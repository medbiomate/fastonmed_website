import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = body?.url;
    if (url && typeof url === 'string') {
      store.logNotFound(url);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, error: 'Invalid URL' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, logs: store.getNotFoundLogs() });
}
