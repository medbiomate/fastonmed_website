import { NextRequest, NextResponse } from 'next/server';
import { getHostingerDbPool } from '@/lib/hostinger-db';
import { decodeSessionToken } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'fastonmed_admin_session';

function unauthorized(request: NextRequest) {
  const session = decodeSessionToken(request.cookies.get(COOKIE_NAME)?.value || '');
  return session ? null : NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;

  try {
    const [rows] = await getHostingerDbPool().query<import('mysql2').RowDataPacket[]>('SELECT raw_data FROM leads_enquiries ORDER BY created_at DESC');
    const enquiries = rows.map(row => typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data).filter(lead => lead && lead.id);
    return NextResponse.json({ success: true, enquiries }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ success: false, error: 'Enquiry database is unavailable' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = unauthorized(request);
  if (denied) return denied;
  const id = String((await request.json().catch(() => ({})))?.id || '').trim();
  if (!id) return NextResponse.json({ success: false, error: 'Enquiry id is required' }, { status: 400 });

  try {
    await getHostingerDbPool().query('DELETE FROM leads_enquiries WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Could not delete the enquiry' }, { status: 503 });
  }
}
