const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function service(failDatabase = false) {
  const records = new Map();
  const query = async (sql, values = []) => {
    if (failDatabase) throw new Error('Unavailable');
    if (sql.startsWith('SELECT raw_data FROM leads_enquiries WHERE')) return [[records.has(values[0]) ? { raw_data: JSON.stringify(records.get(values[0])) } : undefined].filter(Boolean)];
    if (sql.startsWith('SELECT raw_data')) return [[...records.values()].map(record => ({ raw_data: JSON.stringify(record) }))];
    if (sql.startsWith('UPDATE')) { records.set(values[2], JSON.parse(values[1])); return [{}]; }
    if (sql.startsWith('DELETE')) { records.delete(values[0]); return [{}]; }
    throw new Error(sql);
  };
  const db = { query, getConnection: async () => ({ query, beginTransaction: async () => {}, commit: async () => {}, rollback: async () => {}, release: () => {} }) };
  const scope = { exports: {}, console: { error() {}, warn() {} }, process: { env: {} }, Date, Math, AbortSignal, AbortController, setTimeout, clearTimeout,
    fetch: async url => ({ ok: url.includes('/api/auth/me'), json: async () => url.includes('/api/auth/me') ? { success: true, data: { id: 'staff' } } : { success: false } }),
    require: name => {
      if (name === 'next/server') return { NextResponse: { json: (data, options) => ({ data, status: options?.status || 200 }) } };
      if (name === '@/lib/hostinger-db') return { getHostingerDbPool: () => db, saveLeadToHostingerDb: async lead => { if (failDatabase) return false; records.set(lead.id, lead); return true; } };
      throw new Error(name);
    }
  };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(require('node:path').join(__dirname, '../app/api/enquiries/route.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, scope);
  const request = (body = {}, signed = true, id = '') => ({ headers: new Headers(signed ? { authorization: 'Bearer staff-token' } : {}), nextUrl: new URL(`https://example.com/api/enquiries?id=${id}`), json: async () => body });
  return { route: scope.exports, records, request };
}
test('a submitted enquiry remains visible when CRM forwarding is unavailable', async () => {
  const { route, request, records } = service();
  const submitted = await route.POST(request({ name: 'Test', email: 'test@example.com', phone: '123', message: 'Equipment request' }, false));
  assert.equal(submitted.status, 200);
  assert.equal(submitted.data.savedToCRM, false);
  assert.equal(records.size, 1);
  const listed = await route.GET(request());
  assert.equal(listed.data.leads[0].id, submitted.data.leadId);
  assert.equal(listed.data.leads[0].contactName, 'Test');
});
test('failed persistence does not show a successful enquiry confirmation', async () => {
  const { route, request } = service(true);
  const result = await route.POST(request({ name: 'Test', email: 'test@example.com', phone: '123' }, false));
  assert.equal(result.status, 503);
  assert.equal(result.data.success, false);
});
test('reading, updating and deleting use the same persistent enquiry record', async () => {
  const { route, request } = service();
  const submitted = await route.POST(request({ name: 'Test', email: 'test@example.com', phone: '123' }, false));
  const id = submitted.data.leadId;
  assert.equal((await route.GET(request({}, false))).status, 401);
  assert.equal((await route.PUT(request({ id, data: { stage: 'Contacted' } }))).status, 200);
  assert.equal((await route.GET(request())).data.leads[0].stage, 'Contacted');
  assert.equal((await route.DELETE(request({}, true, id))).status, 200);
  assert.equal((await route.GET(request())).data.leads.length, 0);
});
