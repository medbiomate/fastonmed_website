const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const ts = require('typescript');
const bundled = require('../locales/arabic-content.json');
function store(runtime = []) {
 const scope = {
  exports: {}, Map, Date, process: { cwd: () => '/translation-test' }, console,
  setTimeout: () => 1, clearTimeout() {},
  require(name) {
   if (name === 'fs') return { existsSync: p => p.endsWith('/data') || p.endsWith('/translations.json'), readFileSync: () => JSON.stringify(runtime), mkdirSync() {} };
   if (name === 'path') return path;
   if (name === 'crypto') return crypto;
   if (name.endsWith('arabic-content.json')) return bundled;
   throw new Error(name);
  },
 };
 vm.runInNewContext(ts.transpileModule(fs.readFileSync(require.resolve('../lib/translation-store.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
 }).outputText, scope);
 return scope.exports.translationStore;
}
test('authored Arabic survives a fresh deployment with no runtime data', () => {
 const app = store(); const record = bundled[0];
 assert.equal(app.getRecord(record.entity_type, record.entity_id, record.field_name, 'ar').translated_text, record.translated_text);
 assert.equal(app.findReusableByHash(record.source_hash, 'ar').translated_text, record.translated_text);
});
test('runtime failures cannot replace authored translations; manual edits take precedence', () => {
 const record = bundled[0];
 const failed = { ...record, translation_status: 'failed', translation_provider: 'google', translated_text: record.source_text };
 assert.equal(store([failed]).getRecord(record.entity_type,record.entity_id,record.field_name,'ar').translated_text,record.translated_text);
 const manual = { ...record, translation_status: 'manually_edited', translation_provider: 'manual', translated_text: 'نص معتمد يدويًا' };
 assert.equal(store([manual]).getRecord(record.entity_type,record.entity_id,record.field_name,'ar').translated_text,manual.translated_text);
});
test('all bundled source hashes match their text', () => {
 for (const record of bundled) {
  assert.equal(record.source_hash, crypto.createHash('sha256').update(record.source_text.trim()).digest('hex').slice(0,16));
 }
});
