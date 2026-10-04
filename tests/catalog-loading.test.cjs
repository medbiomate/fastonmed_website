const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

function service() {
  const product = { id: 'p1', name: 'Device', slug: 'device', category: 'ICU', brand: 'Acme', status: 'published', image: '/old.jpg', description: 'Clinical details', specifications: { Voltage: '220V' }, wordpressSource: { createdAt: '2026-01-01', postType: 'product', rawImport: 'x'.repeat(100000) } };
  const files = new Map([['/catalog/data/products-cache.json', JSON.stringify([product])]]);
  const background = [];
  let resolveDatabase;
  const database = new Promise(resolve => { resolveDatabase = resolve; });
  let saved;
  const scope = {
    exports: {}, process: { cwd: () => '/catalog', env: {} }, console: { warn() {}, error() {}, log() {} }, Date, Map, Set, URL, fetch: async () => ({}),
    require: name => {
      if (name === 'next/server') return { after: callback => background.push(callback), NextResponse: { json: data => ({ data }) } };
      if (name === 'fs') return { existsSync: file => files.has(file), mkdirSync() {}, readFileSync: file => files.get(file), writeFileSync: (file, value) => files.set(file, value), readdirSync: () => [], unlinkSync() {} };
      if (name === 'path') return path;
      if (name === 'next/cache') return { revalidatePath() {} };
      if (name === '@/lib/server-catalog') return { invalidateServerCatalogCache() {} };
      if (name === '@/lib/hostinger-db') return { loadProductsFromHostingerDb: () => database, saveProductToHostingerDb: async product => { saved = product; return true; } };
      if (name === '@/lib/media-access') return { canUploadMedia: async () => true };
      if (name === '@/lib/r2-media') return {};
      throw new Error(name);
    },
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(__dirname, '../app/api/admin/products/route.ts'), 'utf8'), { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, scope);
  return { route: scope.exports, product, background, resolveDatabase, saved: () => saved };
}

test('cached list returns before database recovery finishes, with a compact payload', async () => {
  const app = service();
  const response = await app.route.GET({ url: 'https://example.com/api/admin/products?view=list' });
  assert.equal(response.data.products[0].name, 'Device');
  assert.equal(response.data.products[0].description, undefined);
  assert.equal(response.data.products[0].wordpressSource, undefined);
  assert.equal(response.data.products[0].createdAt, '2026-01-01');
  assert.equal(response.data.mediaRecoveryPending, true);
  assert.equal(app.background.length, 1);
  app.resolveDatabase([]);
  await app.background[0]();
});

test('background recovery updates durable images for following requests', async () => {
  const app = service();
  await app.route.GET({ url: 'https://example.com/api/admin/products?view=list' });
  app.resolveDatabase([{ ...app.product, image: '/api/media/durable.jpg', mediaOriginals: { '/api/media/durable.jpg': '/old.jpg' } }]);
  await app.background[0]();
  const response = await app.route.GET({ url: 'https://example.com/api/admin/products?view=list' });
  assert.equal(response.data.products[0].image, '/api/media/durable.jpg');
  assert.equal(response.data.mediaRecoveryPending, false);
});

test('compact editor reads and list status changes preserve full stored product data', async () => {
  const app = service();
  const editor = await app.route.GET({ url: 'https://example.com/api/admin/products' });
  assert.equal(editor.data.products[0].description, 'Clinical details');
  assert.equal(editor.data.products[0].specifications.Voltage, '220V');
  const list = await app.route.GET({ url: 'https://example.com/api/admin/products?view=list' });
  await app.route.POST({ json: async () => ({ ...list.data.products[0], status: 'draft' }) });
  assert.equal(app.saved().description, 'Clinical details');
  assert.equal(app.saved().specifications.Voltage, '220V');
  assert.equal(app.saved().status, 'draft');
  assert.equal(app.saved().wordpressSource.rawImport.length, 100000);
  app.resolveDatabase([]);
  await Promise.all(app.background.map(callback => callback()));
});
