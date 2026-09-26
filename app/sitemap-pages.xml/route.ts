import { SITE_URL, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';
import { getSharedEditorialPages } from '@/lib/server-pages';

export const dynamic = 'force-dynamic';

export async function GET() {
  const now = new Date();
  const pages = [
    ['', 'daily', 1],
    ['/compare', 'weekly', 0.5],
    ['/wishlist', 'weekly', 0.5],
    ['/shop', 'daily', 0.9],
    ['/cart', 'weekly', 0.4],
    ['/checkout', 'weekly', 0.4],
    ['/my-account', 'monthly', 0.3],
    ['/order-tracking', 'monthly', 0.4],
    ['/about-us', 'monthly', 0.7],
    ['/contact', 'monthly', 0.8]
  ] as const;
  const sharedPages = await getSharedEditorialPages();
  const entries = [
    ...pages.map(([path, frequency, priority]) => urlEntry(`${SITE_URL}${path}`, now, frequency, priority)),
    ...sharedPages.map((page) => urlEntry(`${SITE_URL}/${page.slug}`, new Date(page.updatedAt || now), 'monthly', 0.8))
  ].join('\n');
  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
