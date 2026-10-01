import fs from 'node:fs';
import path from 'node:path';

// Credentials belong only in the process environment, never in the report.
const origin = 'https://www.fastonmed.com';
const limit = Number(process.env.MIGRATION_LIMIT || 3);
const identifier = process.env.ADMIN_IDENTIFIER;
const password = process.env.ADMIN_PASSWORD;
if (!identifier || !password) throw new Error('Set ADMIN_IDENTIFIER and ADMIN_PASSWORD');
const login = await fetch(`${origin}/api/admin/auth/login`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ identifier, password }),
});
if (!login.ok) throw new Error(`Login failed (${login.status})`);
const cookie = login.headers.getSetCookie().map(value => value.split(';')[0]).join('; ');
if (!cookie) throw new Error('Login did not return an authenticated session');
const response = await fetch(`${origin}/api/admin/products`, { headers: { Cookie: cookie }, cache: 'no-store' });
if (!response.ok) throw new Error(`Catalog read failed (${response.status})`);
const catalog = await response.json();
const products = catalog.products;
if (!Array.isArray(products) || !products.length) throw new Error('Empty catalog; stopped');
const directory = path.resolve('data/backups/media-migration');
fs.mkdirSync(directory, { recursive: true });
const stamp = new Date().toISOString().replaceAll(':', '-');
fs.writeFileSync(path.join(directory, `catalog-before-${stamp}.json`), JSON.stringify(products), { flag: 'wx' });
const selected = products.filter(p => [p.image, ...(p.galleryImages || [])].some(value => /^\/(wp-content\/uploads|uploads)\//.test(value || ''))).slice(0, limit);
console.log(`Catalog ${products.length}; selected ${selected.length}; originals backed up`);
const report = [];
for (const product of selected) {
  const result = await fetch(`${origin}/api/admin/products`, {
    method: 'POST', headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'migrate-product-media', id: product.id }),
    signal: AbortSignal.timeout(120000),
  });
  const data = await result.json();
  report.push({ id: product.id, status: result.status, ...data });
  fs.writeFileSync(path.join(directory, `report-${stamp}.json`), JSON.stringify(report, null, 2));
  if (!result.ok || !data.success || !('changed' in data)) throw new Error(`Migration stopped for ${product.id}: ${data.error || 'Migration endpoint not deployed'}`);
  console.log(`${report.length}/${selected.length}: ${product.id} ${data.changed ? 'verified and saved' : 'unchanged'}`);
}
console.log('Batch completed; verify website and CRM before increasing MIGRATION_LIMIT');
