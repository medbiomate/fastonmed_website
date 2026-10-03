import { NextRequest, NextResponse } from 'next/server';
import { getHostingerDbPool, saveLeadToHostingerDb } from '@/lib/hostinger-db';

export const dynamic = 'force-dynamic';

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = clean(body.name || body.fullName, 120);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 50);
    const rawMessage = clean(body.message || body.notes || body.requirement, 4000);
    const message = rawMessage || 'Direct medical equipment procurement & RFQ consultation request.';
    const productName = clean(body.productName || body.equipmentInterest, 240);
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Name, email, and phone number are required.' }, { status: 400 });
    }

    const enquiryType = body.enquiryType === 'Service' ? 'Service' : 'Sales';
    const serviceType = enquiryType === 'Service' ? clean(body.serviceType, 100) : '';
    const now = new Date().toISOString();
    const facilityName = clean(body.facilityName || body.clinicName, 180);
    const facilityType = clean(body.facilityType, 100);
    const equipmentInterest = clean(body.equipmentInterest || body.productName, 200);
    const timeline = clean(body.timeline, 100);

    const lead = {
      id: `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      clientName: facilityName || name,
      contactName: name,
      phone,
      email,
      enquiryType,
      category: equipmentInterest || 'Website RFQ',
      product: equipmentInterest || productName || message.slice(0, 160),
      quantity: Math.max(1, Number(body.quantity) || 1),
      estimatedValue: Number(body.estimatedValue) || 0,
      stage: 'New Lead',
      source: 'Website',
      assignedTo: 'Unassigned',
      assignedToId: '',
      priority: 'High',
      notes: `${serviceType ? `[Service: ${serviceType}] ` : ''}[Facility: ${facilityName || 'N/A'}] [Type: ${facilityType || 'General'}] [Interest: ${equipmentInterest || 'General'}] [Timeline: ${timeline || 'Immediate'}] Notes: ${message}`,
      createdAt: now,
      updatedAt: now
    };

    let saved = false;
    let savedToCRM = false;

    const candidateUrls = [
      ...(process.env.CRM_BACKEND_URL ? [`${process.env.CRM_BACKEND_URL.replace(/\/$/, '')}/api/leads`] : []),
      ...(process.env.FAST_API_URL ? [`${process.env.FAST_API_URL.replace(/\/$/, '')}/api/leads`] : []),
      'https://crm.fastonmed.com/api/leads',
      'https://api.fastonmed.com/api/leads',
      'http://127.0.0.1:3000/api/leads'
    ];

    // 2. Always persist to Hostinger MySQL Database
    try {
      if (await saveLeadToHostingerDb(lead)) saved = true;
    } catch (err) {
      console.warn('Could not save lead to Hostinger DB:', err);
    }

    // 3. Also forward to CRM/API endpoints
    for (const url of candidateUrls) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ lead }),
          signal: controller.signal,
          cache: 'no-store'
        });
        clearTimeout(timeout);
        const result = await response.json().catch(() => null);
        if (response.ok && (result?.success || result?.data || result?.id)) {
          savedToCRM = true;
          break;
        }
      } catch {}
    }

    if (!saved) {
      return NextResponse.json(
        { success: false, error: 'The CRM could not save this enquiry. Please try again.' },
        { status: 503 }
      );
    }
    return NextResponse.json({ success: true, leadId: lead.id, savedToRemote: saved, savedToCRM });
  } catch (error) {
    console.error('Website enquiry error:', error);
    return NextResponse.json({ success: false, error: 'The enquiry could not be processed. Please try again or contact us directly.' }, { status: 500 });
  }
}


async function requireCRMUser(request: NextRequest): Promise<boolean> {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ') || authorization.includes('session-token-')) return false;
  const origin = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.fastonmed.com').replace(/\/$/, '');
  const response = await fetch(`${origin}/api/auth/me`, { headers: { Authorization: authorization }, cache: 'no-store', signal: AbortSignal.timeout(10000) });
  const data = await response.json();
  return response.ok && data.success === true && Boolean(data.data?.id);
}

export async function GET(request: NextRequest) {
  try {
    if (!await requireCRMUser(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const [rows] = await getHostingerDbPool().query<import('mysql2').RowDataPacket[]>('SELECT raw_data FROM leads_enquiries ORDER BY created_at DESC');
    const leads = rows.map(row => typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data).filter(lead => lead && lead.id);
    return NextResponse.json({ success: true, leads }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Read website enquiries failed:', error);
    return NextResponse.json({ success: false, error: 'Website enquiry database is unavailable. Please retry.' }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!await requireCRMUser(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const body = await request.json();
    const id = clean(body.id, 120);
    const stage = clean(body.data?.stage || body.stage, 60);
    if (!id || !['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Won', 'Lost', 'Closed', 'Closed Won', 'Closed Lost'].includes(stage)) return NextResponse.json({ success: false, error: 'Invalid enquiry status' }, { status: 400 });
    const db = await getHostingerDbPool().getConnection();
    try {
      await db.beginTransaction();
      const [rows] = await db.query<import('mysql2').RowDataPacket[]>('SELECT raw_data FROM leads_enquiries WHERE id = ? FOR UPDATE', [id]);
      if (!rows[0]) { await db.rollback(); return NextResponse.json({ success: false, error: 'Enquiry not found' }, { status: 404 }); }
      const original = typeof rows[0].raw_data === 'string' ? JSON.parse(rows[0].raw_data) : rows[0].raw_data;
      const lead = { ...original, stage, updatedAt: new Date().toISOString() };
      await db.query('UPDATE leads_enquiries SET stage = ?, raw_data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [stage, JSON.stringify(lead), id]);
      await db.commit();
      return NextResponse.json({ success: true, lead });
    } catch (error) { await db.rollback(); throw error; }
    finally { db.release(); }
  } catch (error) {
    console.error('Update website enquiry failed:', error);
    return NextResponse.json({ success: false, error: 'Enquiry status could not be saved' }, { status: 503 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await requireCRMUser(request)) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    const id = clean(request.nextUrl.searchParams.get('id'), 120);
    if (!id) return NextResponse.json({ success: false, error: 'Enquiry id is required' }, { status: 400 });
    await getHostingerDbPool().query('DELETE FROM leads_enquiries WHERE id = ?', [id]);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error('Delete website enquiry failed:', error);
    return NextResponse.json({ success: false, error: 'Enquiry could not be deleted' }, { status: 503 });
  }
}
