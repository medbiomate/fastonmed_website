import { getAllProducts } from '@/lib/server-catalog';
import { SITE_URL, hasUsableProductImage, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';
import { translationStore } from '@/lib/translation-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const products = (await getAllProducts()).filter((product) => hasUsableProductImage(product.mainImage));
  const englishEntries = products.slice(0, 50000).map((product) =>
    urlEntry(`${SITE_URL}/product/${product.slug}`, new Date(product.updatedAt || product.createdAt || Date.now()), 'weekly', 0.85)
  );

  // Carefully include Arabic URLs ONLY when meaningful Arabic translation exists in database
  const arabicEntries: string[] = [];
  for (const product of products) {
    const arName = translationStore.getRecord('product', product.id || product.slug, 'name', 'ar');
    if (arName && (arName.translation_status === 'translated' || arName.translation_status === 'manually_edited') && arName.translated_text) {
      arabicEntries.push(
        urlEntry(`${SITE_URL}/ar/product/${product.slug}`, new Date(arName.updated_at || Date.now()), 'weekly', 0.85)
      );
    }
  }

  const allEntries = [...englishEntries, ...arabicEntries].join('\n');
  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${allEntries}\n</urlset>`);
}
