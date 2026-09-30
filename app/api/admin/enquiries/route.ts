import { NextRequest, NextResponse } from 'next/server';
import { decodeSessionToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'fastonmed_admin_session';

function crmUrls(path: string): string[] {
  const bases = [
    process.env.CRM_BACKEND_URL,
    process.env.FAST_API_URL,
    'http://127.0.0.1:3000',
    'https://api.fastonmed.com'
  ].filter(Boolean) as string[];
  return [...new Set(bases.map((base) => `${base.replace(/\/$/, '')}${path}`))];
}

function unauthorized(request: NextRequest) {
  const session = decodeSessionToken(request.cookies.get(COOKIE_NAME)?.value || '');
  return session ? null : NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  for (const url of crmUrls('/api/leads')) {
    try {
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      const payload = await response.json().catch(() => null);
      if (response.ok && Array.isArray(payload?.leads)) {
        const enquiries = payload.leads
          .filter((lead: any) => lead?.source === 'Website' || String(lead?.id || '').startsWith('web-'))
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        return NextResponse.json({ success: true, enquiries });
      }
    } catch {}
  }

  return NextResponse.json({ success: false, error: 'CRM enquiry service is unavailable' }, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const id = String((await request.json().catch(() => ({})))?.id || '').trim();
  if (!id) return NextResponse.json({ success: false, error: 'Enquiry id is required' }, { status: 400 });

  for (const url of crmUrls(`/api/leads?id=${encodeURIComponent(id)}`)) {
    try {
      const response = await fetch(url, { method: 'DELETE', cache: 'no-store', signal: AbortSignal.timeout(5000) });
      const payload = await response.json().catch(() => null);
      if (response.ok && payload?.success) return NextResponse.json({ success: true });
    } catch {}
  }

  return NextResponse.json({ success: false, error: 'Could not delete the enquiry from CRM' }, { status: 503 });
}
