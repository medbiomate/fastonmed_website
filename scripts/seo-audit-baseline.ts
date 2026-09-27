import fs from 'fs';
import path from 'path';
import { getAllProducts } from '../lib/server-catalog';
import { editorialPages } from '../lib/editorial-pages';
import { CATEGORY_SPECIALTIES } from '../lib/category-definitions';

const SITE_URL = 'https://www.fastonmed.com';

interface BaselineUrl {
  url: string;
  type: 'core' | 'editorial' | 'category' | 'product' | 'utility';
  canonical: string;
  indexable: boolean;
  expectedStatus: number;
}

async function runAudit() {
  console.log('--- STARTING FASTONMED TECHNICAL SEO AUDIT ---');
  
  const products = await getAllProducts();
  const editorialEntries = Object.entries(editorialPages);
  
  // 1. Core pages
  const corePages: BaselineUrl[] = [
    { url: `${SITE_URL}/`, type: 'core', canonical: `${SITE_URL}`, indexable: true, expectedStatus: 200 },
    { url: `${SITE_URL}/about-us`, type: 'core', canonical: `${SITE_URL}/about-us`, indexable: true, expectedStatus: 200 },
    { url: `${SITE_URL}/shop`, type: 'core', canonical: `${SITE_URL}/shop`, indexable: true, expectedStatus: 200 },
    { url: `${SITE_URL}/contact`, type: 'core', canonical: `${SITE_URL}/contact`, indexable: true, expectedStatus: 200 },
    { url: `${SITE_URL}/blog`, type: 'core', canonical: `${SITE_URL}/blog`, indexable: true, expectedStatus: 200 },
    // Utility pages that should be noindex
    { url: `${SITE_URL}/compare`, type: 'utility', canonical: `${SITE_URL}/compare`, indexable: false, expectedStatus: 200 },
    { url: `${SITE_URL}/wishlist`, type: 'utility', canonical: `${SITE_URL}/wishlist`, indexable: false, expectedStatus: 200 },
    { url: `${SITE_URL}/cart`, type: 'utility', canonical: `${SITE_URL}/cart`, indexable: false, expectedStatus: 200 },
    { url: `${SITE_URL}/checkout`, type: 'utility', canonical: `${SITE_URL}/checkout`, indexable: false, expectedStatus: 200 },
    { url: `${SITE_URL}/my-account`, type: 'utility', canonical: `${SITE_URL}/my-account`, indexable: false, expectedStatus: 200 },
    { url: `${SITE_URL}/order-tracking`, type: 'utility', canonical: `${SITE_URL}/order-tracking`, indexable: false, expectedStatus: 200 },
  ];

  // 2. Editorial pages
  const editorialUrls: BaselineUrl[] = editorialEntries.map(([slug, page]) => ({
    url: `${SITE_URL}/${slug}`,
    type: 'editorial',
    canonical: `${SITE_URL}/${slug}`,
    indexable: true,
    expectedStatus: 200
  }));

  // 3. Category pages
  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const rawCategories = Array.from(new Set(products.map(p => p.category?.trim()).filter(Boolean) as string[]));
  const categoryUrls: BaselineUrl[] = rawCategories.map(cat => ({
    url: `${SITE_URL}/product-category/${slugify(cat)}`,
    type: 'category',
    canonical: `${SITE_URL}/product-category/${slugify(cat)}`,
    indexable: true,
    expectedStatus: 200
  }));

  // Specialty category aliases
  const specialtyUrls: BaselineUrl[] = Object.keys(CATEGORY_SPECIALTIES).map(slug => ({
    url: `${SITE_URL}/product-category/${slug}`,
    type: 'category',
    canonical: `${SITE_URL}/product-category/${slug}`,
    indexable: true,
    expectedStatus: 200
  }));

  // 4. Products
  const productUrls: BaselineUrl[] = products.map(prod => ({
    url: `${SITE_URL}/product/${prod.slug}`,
    type: 'product',
    canonical: `${SITE_URL}/product/${prod.slug}`,
    indexable: true,
    expectedStatus: 200
  }));

  const allInventory = [
    ...corePages,
    ...editorialUrls,
    ...categoryUrls,
    ...specialtyUrls,
    ...productUrls
  ];

  // Audit Product Metrics
  const missingDescription = products.filter(p => !p.shortDescription && !p.fullDescription);
  const shortDescription = products.filter(p => {
    const desc = (p.shortDescription || p.fullDescription || '').replace(/<[^>]*>?/gm, '').trim();
    return desc.length > 0 && desc.length < 50;
  });
  const missingImages = products.filter(p => !p.mainImage || p.mainImage.length < 5);
  const placeholderImages = products.filter(p => p.mainImage && (p.mainImage.includes('placeholder') || p.mainImage.includes('no-image')));
  const missingBrand = products.filter(p => !p.brand || p.brand.trim() === '');
  const missingSku = products.filter(p => !p.sku || p.sku.trim() === '');
  const zeroPrice = products.filter(p => (!p.regularPrice || p.regularPrice <= 0) && (!p.salePrice || p.salePrice <= 0));

  const stats = {
    totalIndexedUrls: allInventory.length,
    corePages: corePages.length,
    editorialPages: editorialUrls.length,
    uniqueCategories: rawCategories.length,
    specialtyCategories: Object.keys(CATEGORY_SPECIALTIES).length,
    totalProducts: products.length,
    productAudit: {
      missingDescription: missingDescription.length,
      shortDescription: shortDescription.length,
      missingImages: missingImages.length,
      placeholderImages: placeholderImages.length,
      missingBrand: missingBrand.length,
      missingSku: missingSku.length,
      zeroPrice: zeroPrice.length
    }
  };

  console.log('Audit Summary Stats:', JSON.stringify(stats, null, 2));

  // Save baseline inventory
  const outputPath = path.join(__dirname, 'seo-baseline-inventory.json');
  fs.writeFileSync(outputPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    urls: allInventory.slice(0, 500) // sample slice for quick verification
  }, null, 2));

  console.log(`Baseline inventory saved to ${outputPath}`);
}

runAudit().catch(console.error);
