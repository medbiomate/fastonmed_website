import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';

export const r2Configured = () => Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME);
function client() {
  if (!r2Configured()) throw new Error('Cloud image storage is not configured');
  return new S3Client({ region: 'auto', endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } });
}
export function mediaUrl(key: string) { return `/api/media/${key.split('/').map(encodeURIComponent).join('/')}`; }
export async function uploadR2Image(buffer: Buffer, name: string, mime: string) {
  const extensions: Record<string,string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
  if (!extensions[mime] || !buffer.length || buffer.length > 5 * 1024 * 1024) throw new Error('Choose a supported image smaller than 5 MB');
  const hash = createHash('sha256').update(buffer).digest('hex');
  const key = `products/${hash}.${extensions[mime]}`;
  await client().send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: buffer, ContentType: mime, CacheControl: 'public, max-age=31536000, immutable', Metadata: { sha256: hash } }));
  // Verify bytes, not just an upload acknowledgement, before returning a usable URL.
  const stored = await readR2Image(key);
  if (createHash('sha256').update(await stored.Body!.transformToByteArray()).digest('hex') !== hash) throw new Error('Cloud image verification failed');
  return { success: true, url: mediaUrl(key), name };
}
export async function readR2Image(key: string) {
  if (!/^products\/[a-f0-9]{64}\.(jpg|png|webp|gif|avif)$/.test(key)) throw new Error('Invalid image key');
  return client().send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key }));
}
export async function listR2Images() {
  const images = [];
  let continuationToken: string | undefined;
  do {
    const result = await client().send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET_NAME, Prefix: 'products/', MaxKeys: 1000, ContinuationToken: continuationToken }));
    images.push(...(result.Contents || []).filter(item => item.Key).map(item => ({ url: mediaUrl(item.Key!), name: item.Key!.split('/').pop()!, category: 'uploads' as const, mtime: item.LastModified?.getTime() })));
    continuationToken = result.IsTruncated ? result.NextContinuationToken : undefined;
  } while (continuationToken);
  return images;
}
