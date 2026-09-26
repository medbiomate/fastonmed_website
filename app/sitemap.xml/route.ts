import { SITE_URL, sitemapResponse } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const modified = new Date().toISOString();
  const names = ['pages', 'posts', 'products', 'product-categories'];
  const entries = names.map((name) =>
    `  <sitemap>\n    <loc>${SITE_URL}/sitemap-${name}.xml</loc>\n    <lastmod>${modified}</lastmod>\n  </sitemap>`
  ).join('\n');
  return sitemapResponse(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`);
}
