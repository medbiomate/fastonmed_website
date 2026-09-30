import { NextRequest, NextResponse } from 'next/server';
import { saveLeadToHostingerDb } from '@/lib/hostinger-db';

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
    const clinicName = clean(body.clinicName || body.facilityName, 180);
    const productName = clean(body.productName || body.equipmentInterest, 240);
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: 'Name, email, and phone number are required.' }, { status: 400 });
    }

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
      enquiryType: 'Sales',
      category: equipmentInterest || 'Website RFQ',
      product: equipmentInterest || productName || message.slice(0, 160),
      quantity: Math.max(1, Number(body.quantity) || 1),
      estimatedValue: Number(body.estimatedValue) || 0,
      stage: 'New Lead',
      source: 'Website',
      assignedTo: 'Unassigned',
      assignedToId: '',
      priority: 'High',
      notes: `[Facility: ${facilityName || 'N/A'}] [Type: ${facilityType || 'General'}] [Interest: ${equipmentInterest || 'General'}] [Timeline: ${timeline || 'Immediate'}] Notes: ${message}`,
      createdAt: now,
      updatedAt: now
    };

    let saved = false;

    // 1. Direct local CRM store sync if running in the workspace
    try {
      const fs = await import('fs');
      const path = await import('path');
      const crmStorePath = path.resolve(process.cwd(), '../CRM/data/leads_store.json');
      if (fs.existsSync(crmStorePath)) {
        const raw = fs.readFileSync(crmStorePath, 'utf-8');
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          list.unshift(lead);
          fs.writeFileSync(crmStorePath, JSON.stringify(list, null, 2), 'utf-8');
          saved = true;
        }
      }
    } catch (e) {
      console.warn('Local CRM file sync error:', e);
    }

    const candidateUrls = [
      ...(process.env.CRM_BACKEND_URL ? [`${process.env.CRM_BACKEND_URL.replace(/\/$/, '')}/api/leads`] : []),
      ...(process.env.FAST_API_URL ? [`${process.env.FAST_API_URL.replace(/\/$/, '')}/api/leads`] : []),
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
          saved = true;
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
    return NextResponse.json({ success: true, leadId: lead.id, savedToRemote: true });
  } catch (error) {
    console.error('Website enquiry error:', error);
    return NextResponse.json({ success: false, error: 'The enquiry could not be processed. Please try again or contact us directly.' }, { status: 500 });
  }
}
