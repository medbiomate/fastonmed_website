import { SITE_URL, sitemapResponse, urlEntry } from '@/lib/sitemap-utils';

export const dynamic = 'force-dynamic';

async function getPublishedPosts() {
  const crm = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  try {
    const r = await fetch(`${crm}/api/shared-data/website-posts`, { cache: 'no-store' });
    const x = await r.json();
    return (x.data || []).filter((p: any) => p.status === 'published');
  } catch {
    return [];
  }
}

export async function GET() {
  const posts = await getPublishedPosts();
  const entries = posts.map((post: any) =>
    urlEntry(`${SITE_URL}/blog/${post.slug}`, new Date(post.publishedAt || post.updatedAt || Date.now()), 'monthly', 0.7)
  ).join('\n');

  return sitemapResponse(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`);
}
