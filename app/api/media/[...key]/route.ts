import { readR2Image } from '@/lib/r2-media';
export const runtime = 'nodejs';
export async function GET(_request: Request, context: { params: Promise<{ key: string[] }> }) {
  try {
    const { key } = await context.params;
    const object = await readR2Image(key.join('/'));
    const bytes = await object.Body!.transformToByteArray();
    return new Response(new Uint8Array(bytes).buffer, { headers: { 'Content-Type': object.ContentType || 'application/octet-stream', 'Content-Disposition': 'inline', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', ...(object.ETag ? { ETag: object.ETag } : {}) } });
  } catch { return new Response('Image not found', { status: 404 }); }
}
