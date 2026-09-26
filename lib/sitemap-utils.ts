const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

export const SITE_URL = 'https://www.fastonmed.com';

export function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;'
  }[char] || char));
}

export function sitemapResponse(body: string): Response {
  return new Response(`${XML_HEADER}\n${body}\n`, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
    }
  });
}

export function hasUsableProductImage(image?: string): boolean {
  if (!image) return false;
  const normalized = image.trim().toLowerCase();
  return normalized.length > 5 &&
    !normalized.includes('placeholder') &&
    !normalized.includes('no-image') &&
    !normalized.includes('no_image');
}

export function urlEntry(url: string, modified: Date, changeFrequency: string, priority: number): string {
  return `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${modified.toISOString()}</lastmod>\n    <changefreq>${changeFrequency}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}
