import { getAllProducts } from '@/lib/server-catalog';
import { SITE_URL, hasUsableProductImage, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = (await getAllProducts()).filter((product) => hasUsableProductImage(product.mainImage));
  const categories = Array.from(new Set(products.map((product) => product.category?.trim()).filter(Boolean) as string[]));
  const now = new Date();
  const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const entries = categories.map((category) =>
    urlEntry(`${SITE_URL}/product-category/${slugify(category)}`, now, 'weekly', 0.8)
  ).join('\n');
  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
