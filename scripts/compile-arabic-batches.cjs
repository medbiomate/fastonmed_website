// Assemble authored Arabic batches using exact source hashes, without a provider API.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const products = JSON.parse(fs.readFileSync(path.join(root, 'data/products-cache.json'), 'utf8'));
const byId = new Map(products.map(product => [String(product.id), product]));
const records = [];
const seen = new Set();
for (const file of fs.readdirSync(path.join(root, 'locales/arabic-batches')).sort()) {
  if (!file.endsWith('.json')) continue;
  const batch = JSON.parse(fs.readFileSync(path.join(root, 'locales/arabic-batches', file), 'utf8'));
  for (const [id, fields] of Object.entries(batch)) {
    const product = byId.get(id);
    if (!product) throw new Error(`Unknown product ${id}`);
    for (const [sourceField, arabic] of Object.entries(fields)) {
      const source = String(product[sourceField] || '').trim();
      if (!source || typeof arabic !== 'string' || !/[\u0600-\u06ff]/u.test(arabic)) throw new Error(`Missing source/Arabic ${id}:${sourceField}`);
      const key = `${id}:${sourceField}`;
      if (seen.has(key)) throw new Error(`Duplicate ${key}`);
      seen.add(key);
      const hash = crypto.createHash('sha256').update(source).digest('hex').slice(0, 16);
      const fieldsToSave = sourceField === 'description' ? ['description', 'fullDescription'] : [sourceField];
      for (const field of fieldsToSave) records.push({
        id: `product:${id}:${field}:ar`.toLowerCase(), entity_type: 'product', entity_id: id,
        field_name: field, source_language: 'en', target_language: 'ar', source_text: source,
        translated_text: arabic, source_hash: hash, translation_status: 'translated',
        translation_provider: 'static', created_at: '2026-10-12T00:00:00.000Z',
        updated_at: '2026-10-12T00:00:00.000Z',
      });
    }
  }
}
fs.writeFileSync(path.join(root, 'locales/arabic-content.json'), JSON.stringify(records, null, 2) + '\n');
const publicProducts = products.filter(product => ['publish', 'published'].includes(product.status));
const ids = new Set(records.map(record => record.entity_id));
const missing = product => ['name', 'shortDescription', 'description'].filter(field => String(product[field] || '').trim() && !seen.has(`${product.id}:${field}`));
const pending = publicProducts.filter(product => missing(product).length).map(product => ({ id: product.id, name: product.name, missingFields: missing(product) }));
const names = Object.fromEntries(records.filter(record => record.field_name === 'name').map(record => [record.source_text, record.translated_text]));
fs.writeFileSync(path.join(root, 'locales/arabic-product-names.json'), JSON.stringify(names, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'docs/arabic-translation-progress.json'), JSON.stringify({
  source: 'Repository catalog snapshot; live catalog may contain additional or edited products',
  publicProducts: publicProducts.length, productsWithAuthoredTranslations: ids.size,
  translatedRecords: records.length, pendingProducts: pending,
  fullyTranslatedProducts: publicProducts.filter(product => !missing(product).length).length,
  pagesAndBlogs: 'Not yet translated in this batch', providerCalls: 0,
}, null, 2) + '\n');
console.log(`${ids.size} products, ${records.length} records, ${pending.length} public products pending`);
