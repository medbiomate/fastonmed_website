import { sitemapResponse } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

export async function GET() {
  return sitemapResponse('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
}
