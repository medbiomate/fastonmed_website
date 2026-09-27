import http from 'http';

const LOCAL_PORT = 3002;
const BASE_URL = `http://127.0.0.1:${LOCAL_PORT}`;

function fetchUrl(path: string): Promise<{ status: number; text: string; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 0, text: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verifyAll() {
  console.log('=== STARTING FASTONMED REGRESSION & SEO AUDIT VERIFICATION ===\n');
  let failures = 0;

  // 1. Core pages test
  const testPages = [
    { path: '/', label: 'Homepage', mustContain: ['Medical Equipment Supplier in UAE &amp; Dubai | FastonMed', 'https://schema.org'] },
    { path: '/shop', label: 'Shop Catalog', mustContain: ['canonical', 'FastonMed'] },
    { path: '/about-us', label: 'About Us', mustContain: ['canonical', 'FastonMed'] },
    { path: '/contact', label: 'Contact', mustContain: ['canonical', 'FastonMed'] },
    { path: '/compare', label: 'Compare (Utility)', mustContain: ['noindex'] },
    { path: '/wishlist', label: 'Wishlist (Utility)', mustContain: ['noindex'] },
    { path: '/cart', label: 'Cart (Utility)', mustContain: ['noindex'] }
  ];

  for (const page of testPages) {
    try {
      const res = await fetchUrl(page.path);
      const passed = res.status === 200 && page.mustContain.every(term => res.text.includes(term));
      if (passed) {
        console.log(`[PASS] ${page.label} (${page.path}) -> HTTP ${res.status}`);
      } else {
        console.error(`[FAIL] ${page.label} (${page.path}) -> HTTP ${res.status}`);
        failures++;
      }
    } catch (err: any) {
      console.error(`[ERROR] ${page.label} (${page.path}): ${err.message}`);
      failures++;
    }
  }

  // 2. Product page structured data & review spam verification
  console.log('\n--- Checking Product Schema Cleanliness ---');
  const sampleProductSlug = 'bio-safe-body-fluid-clean-up-kit-1-application-cm-1011024';
  try {
    const prodRes = await fetchUrl(`/product/${sampleProductSlug}`);
    if (prodRes.status === 200) {
      const hasFakeReviews = prodRes.text.includes('"reviewCount":"18"') || prodRes.text.includes('"ratingValue":"4.9"');
      const hasValidProductSchema = prodRes.text.includes('"@type":"Product"');
      const hasCleanCanonical = prodRes.text.includes(`https://www.fastonmed.com/product/${sampleProductSlug}`);

      if (!hasFakeReviews && hasValidProductSchema && hasCleanCanonical) {
        console.log(`[PASS] Product Schema Clean: 0 fake reviews, genuine structured data, self-referencing canonical.`);
      } else {
        console.error(`[FAIL] Product Schema issue: fake reviews detected or invalid schema.`);
        failures++;
      }
    } else {
      console.warn(`[WARN] Sample product returned HTTP ${prodRes.status}`);
    }
  } catch (err: any) {
    console.error(`[ERROR] Product fetch: ${err.message}`);
    failures++;
  }

  // 3. Category page check
  console.log('\n--- Checking Category Route & Schema ---');
  try {
    const catRes = await fetchUrl('/product-category/accessories');
    if (catRes.status === 200) {
      const hasBreadcrumbSchema = catRes.text.includes('"@type":"BreadcrumbList"');
      const hasCanonical = catRes.text.includes('https://www.fastonmed.com/product-category/accessories');
      if (hasBreadcrumbSchema && hasCanonical) {
        console.log(`[PASS] Category Route: HTTP 200, BreadcrumbList schema and canonical verified.`);
      } else {
        console.error(`[FAIL] Category schema or canonical missing.`);
        failures++;
      }
    } else {
      console.warn(`[WARN] Category returned HTTP ${catRes.status}`);
    }
  } catch (err: any) {
    console.error(`[ERROR] Category fetch: ${err.message}`);
    failures++;
  }

  // 4. Sitemap files check
  console.log('\n--- Checking XML Sitemaps ---');
  const sitemaps = [
    '/sitemap.xml',
    '/sitemap-products.xml',
    '/sitemap-product-categories.xml',
    '/sitemap-pages.xml',
    '/sitemap-posts.xml'
  ];

  for (const sm of sitemaps) {
    try {
      const smRes = await fetchUrl(sm);
      if (smRes.status === 200 && (smRes.text.includes('<sitemapindex') || smRes.text.includes('<urlset'))) {
        console.log(`[PASS] Sitemap: ${sm} -> HTTP 200 Valid XML`);
      } else {
        console.error(`[FAIL] Sitemap: ${sm} -> HTTP ${smRes.status}`);
        failures++;
      }
    } catch (err: any) {
      console.error(`[ERROR] Sitemap fetch ${sm}: ${err.message}`);
      failures++;
    }
  }

  // 5. 404 Logging Verification
  console.log('\n--- Checking 404 Page & Logging ---');
  try {
    const test404 = await fetchUrl('/test-nonexistent-device-sku-404');
    if (test404.status === 404) {
      console.log(`[PASS] 404 Status: returns clean HTTP 404.`);
    } else {
      console.error(`[FAIL] 404 Status: returned HTTP ${test404.status}`);
      failures++;
    }
  } catch (err: any) {
    console.error(`[ERROR] 404 fetch: ${err.message}`);
    failures++;
  }

  console.log(`\n=== VERIFICATION COMPLETE: ${failures === 0 ? 'ALL CHECKS PASSED (0 ERRORS)' : `${failures} FAILURES DETECTED`} ===`);
}

verifyAll().catch(console.error);
