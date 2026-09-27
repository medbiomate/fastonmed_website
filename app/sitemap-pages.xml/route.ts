import { SITE_URL, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';
import { getSharedEditorialPages } from '@/lib/server-pages';
import { translationStore } from '@/lib/translation-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const pages = [
    ['', 'daily', 1.0],
    ['/shop', 'daily', 0.9],
    ['/about-us', 'monthly', 0.7],
    ['/contact', 'monthly', 0.8],
    ['/blog', 'weekly', 0.8]
  ] as const;

  const arabicCorePages = [
    ['/ar', 'daily', 1.0],
    ['/ar/shop', 'daily', 0.9],
    ['/ar/about-us', 'monthly', 0.7],
    ['/ar/contact', 'monthly', 0.8],
    ['/ar/blog', 'weekly', 0.8]
  ] as const;

  const sharedPages = await getSharedEditorialPages();

  const englishEditorialEntries = sharedPages.map((page) =>
    urlEntry(`${SITE_URL}/${page.slug}`, new Date(page.updatedAt || now), 'monthly', 0.8)
  );

  const arabicEditorialEntries: string[] = [];
  for (const page of sharedPages) {
    const arTrans = translationStore.getRecord('page', page.slug, 'title', 'ar');
    if (arTrans && arTrans.translated_text) {
      arabicEditorialEntries.push(
        urlEntry(`${SITE_URL}/ar/${page.slug}`, new Date(arTrans.updated_at || now), 'monthly', 0.8)
      );
    }
  }

  const entries = [
    ...pages.map(([path, frequency, priority]) => urlEntry(`${SITE_URL}${path}`, now, frequency, priority)),
    ...arabicCorePages.map(([path, frequency, priority]) => urlEntry(`${SITE_URL}${path}`, now, frequency, priority)),
    ...englishEditorialEntries,
    ...arabicEditorialEntries,
  ].join('\n');

  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
