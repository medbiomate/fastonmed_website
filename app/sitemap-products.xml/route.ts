import { getAllProducts } from '@/lib/server-catalog';
import { SITE_URL, hasUsableProductImage, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = (await getAllProducts()).filter((product) => hasUsableProductImage(product.mainImage));
  const entries = products.slice(0, 50000).map((product) =>
    urlEntry(`${SITE_URL}/product/${product.slug}`, new Date(product.updatedAt || product.createdAt || Date.now()), 'weekly', 0.85)
  ).join('\n');
  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
