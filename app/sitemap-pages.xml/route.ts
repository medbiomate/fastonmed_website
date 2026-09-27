import { SITE_URL, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';
import { getSharedEditorialPages } from '@/lib/server-pages';

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
  const sharedPages = await getSharedEditorialPages();
  const entries = [
    ...pages.map(([path, frequency, priority]) => urlEntry(`${SITE_URL}${path}`, now, frequency, priority)),
    ...sharedPages.map((page) => urlEntry(`${SITE_URL}/${page.slug}`, new Date(page.updatedAt || now), 'monthly', 0.8))
  ].join('\n');
  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
