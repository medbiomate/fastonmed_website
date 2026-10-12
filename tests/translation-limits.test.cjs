const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function service(fetch, provider = 'google') {
  let now = 1_000_000;
  const records = new Map();
  const key = (type, id, field, lang) => [type, id, field, lang].join(':');
  const store = {
    getRecord: (...args) => records.get(key(...args)),
    findReusableByHash: () => undefined,
    recordApiUsage() {}, recordCacheHit() {},
    saveRecord(record) {
      const saved = { ...record, updated_at: new Date(now).toISOString() };
      records.set(key(record.entity_type, record.entity_id, record.field_name, record.target_language), saved);
      return saved;
    },
  };
  const scope = {
    exports: {}, Map, Date: class extends Date { static now() { return now; } },
    process: { env: { GOOGLE_TRANSLATE_API_KEY: 'test', TRANSLATION_PROVIDER: provider } },
    AbortSignal, fetch, console: { error() {}, warn() {} },
    require: name => name === './translation-store' ? { translationStore: store, computeSourceHash: text => text } : {
      protectContent: text => ({ protectedText: text }), cleanProtectedHtml: text => text,
    },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../lib/translation-service.ts'), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, scope);
  return { ...scope.exports, advance: ms => { now += ms; } };
}
const field = (id, text = id) => ({ entity_type: 'product', entity_id: id, field_name: 'name', source_text: text });
const success = () => ({ ok: true, json: async () => ({ data: { translations: [{ translatedText: 'Arabic' }] } }) });

test('authored mode never calls Google for missing content, even with a configured API key', async () => {
  let calls = 0;
  const app = service(async () => { calls++; return success(); }, '');
  assert.equal(await app.getOrTranslateField(field('missing')), 'missing');
  const batch = await app.translateEntityFields('product', 'another', { name: 'Untranslated' }, 'ar', true);
  assert.equal(batch.name, 'Untranslated');
  assert.equal(calls, 0);
});

test('quota errors pause all translations and recover after cooldown', async () => {
  let calls = 0;
  const app = service(async () => ++calls === 1 ? { ok: false, status: 403, text: async () => 'quota' } : success());
  assert.equal(await app.getOrTranslateField(field('one')), 'one');
  await app.getOrTranslateField(field('one'));
  await app.translateEntityFields('product', 'two', { name: 'two' });
  assert.equal(calls, 1);
  app.advance(15 * 60 * 1000 + 1);
  assert.equal(await app.getOrTranslateField(field('one')), 'Arabic');
  assert.equal(calls, 2);
});

test('identical batches share a request and distinct requests are bounded', async () => {
  let calls = 0;
  const releases = [];
  const app = service(() => { calls++; return new Promise(resolve => releases.push(() => resolve(success()))); });
  const a = app.translateEntityFields('product', 'a', { name: 'same' });
  const b = app.translateEntityFields('product', 'b', { name: 'same' });
  const c = app.getOrTranslateField(field('different'));
  assert.equal(await app.getOrTranslateField(field('overflow')), 'overflow');
  assert.equal(calls, 2);
  releases.forEach(release => release());
  await Promise.all([a, b, c]);
});

test('network failure sets a cooldown and requests carry a timeout signal', async () => {
  let calls = 0;
  const app = service(async (_, options) => { calls++; assert.ok(options.signal instanceof AbortSignal); throw new Error('offline'); });
  await app.getOrTranslateField(field('one'));
  await app.getOrTranslateField(field('two'));
  assert.equal(calls, 1);
  app.advance(60_001);
  await app.getOrTranslateField(field('three'));
  assert.equal(calls, 2);
});
