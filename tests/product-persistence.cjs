const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies) {
  const exports = {};
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  vm.runInNewContext(source, { exports, require: name => {
    if (!(name in dependencies)) throw new Error(`Unexpected dependency: ${name}`);
    return dependencies[name];
  }, process, console, Date, URL, Buffer });
  return exports;
}
const product = { id: 'recovered', name: 'Recovered product', status: 'published' };
function route(save) {
  let fileWrites = 0;
  const result = load('app/api/admin/products/route.ts', {
    'next/server': { NextResponse: { json: (body, options) => ({ body, status: options?.status || 200 }) } },
    fs: { existsSync: () => true, readdirSync: () => [], writeFileSync: () => fileWrites++, renameSync: () => {} },
    path: require('node:path'),
    'next/cache': { revalidatePath: () => {} },
    '@/lib/hostinger-db': { saveProductToHostingerDb: save },
    '@/lib/server-catalog': { invalidateServerCatalogCache: () => {} },
    '@/lib/durable-catalog': { getDurableCatalog: async () => [product], invalidateDurableCatalog: () => {} },
    '@/lib/media-access': {}, '@/lib/r2-media': {},
  });
  return { result, writes: () => fileWrites };
}
test('admin returns database products without consulting stale deployment files', async () => {
  const { result } = route(async () => true);
  const response = await result.GET(new Request('http://localhost/api/admin/products'));
  assert.equal(response.body.source, 'database');
  assert.equal(response.body.products[0].id, 'recovered');
});
test('failed durable save returns 503 and never writes success into file cache', async () => {
  const { result, writes } = route(async () => false);
  const response = await result.POST({ json: async () => ({ id: 'new-product', name: 'New product' }) });
  assert.equal(response.status, 503);
  assert.equal(response.body.success, false);
  assert.equal(writes(), 0);
});
test('durable cache invalidation prevents an older in-flight read replacing a newer snapshot', async () => {
  let release;
  let calls = 0;
  const cache = load('lib/durable-catalog.ts', {
    './hostinger-db': { readDurableProductCatalog: () => ++calls === 1 ? new Promise(resolve => { release = resolve; }) : Promise.resolve([product]) },
  });
  const old = cache.getDurableCatalog();
  cache.invalidateDurableCatalog();
  await cache.getDurableCatalog();
  release([]);
  await old;
  assert.equal((await cache.getDurableCatalog())[0].id, 'recovered');
});
