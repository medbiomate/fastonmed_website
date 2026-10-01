import { timingSafeEqual } from 'crypto';
import { findAdminUser } from './admin-auth';

function equal(a: string, b: string) {
  const left = Buffer.from(a), right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}
export function canUploadMedia(request: Request) {
  const shared = process.env.MEDIA_UPLOAD_TOKEN;
  if (shared && equal(request.headers.get('x-media-upload-token') || '', shared)) return true;
  const cookie = (request.headers.get('cookie') || '').split(';').map(part => part.trim()).find(part => part.startsWith('fastonmed_admin_session='));
  if (!cookie) return false;
  try {
    const token = decodeURIComponent(cookie.slice(cookie.indexOf('=') + 1));
    const [payload, signature] = token.split('.');
    const expected = Buffer.from(process.env.ADMIN_SESSION_SECRET || 'fastonmed_admin_secure_key_2026').toString('base64').slice(0, 10);
    if (!signature || !equal(signature, expected)) return false;
    const session = JSON.parse(Buffer.from(payload, 'base64').toString());
    const user = findAdminUser(session.email);
    return Boolean(user && user.id === session.userId && user.role === session.role && Date.now() - session.createdAt < 7 * 86400000);
  } catch { return false; }
}
