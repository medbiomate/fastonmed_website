import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function clean(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = clean(body.name, 120);
    const email = clean(body.email, 160);
    const phone = clean(body.phone, 50);
    const message = clean(body.message, 4000);
    const clinicName = clean(body.clinicName, 180);
    const productName = clean(body.productName, 240);
    if (!name || !email || !phone || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, phone, and enquiry details are required.' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const lead = {
      id: `web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      clientName: clinicName || name,
      contactName: name,
      phone,
      email,
      enquiryType: 'Sales',
      category: 'Website Enquiry',
      product: productName || message.slice(0, 160),
      quantity: Math.max(1, Number(body.quantity) || 1),
      estimatedValue: 0,
      stage: 'New Lead',
      source: 'Website',
      assignedTo: 'Unassigned',
      assignedToId: '',
      priority: 'Medium',
      notes: message,
      createdAt: now,
      updatedAt: now
    };

    const candidateUrls = [
      ...(process.env.CRM_BACKEND_URL ? [`${process.env.CRM_BACKEND_URL.replace(/\/$/, '')}/api/leads`] : []),
      ...(process.env.FAST_API_URL ? [`${process.env.FAST_API_URL.replace(/\/$/, '')}/api/leads`] : []),
      'https://api.fastonmed.com/api/leads',
      'http://127.0.0.1:3000/api/leads'
    ];

    let saved = false;
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

    return NextResponse.json({ success: true, leadId: lead.id, savedToRemote: saved });
  } catch (error) {
    console.error('Website enquiry error:', error);
    return NextResponse.json({ success: false, error: 'The enquiry could not be processed. Please try again or contact us directly.' }, { status: 500 });
  }
}
