import { NextResponse } from 'next/server';

const datasets: Record<string, string> = {
  posts: 'website-posts',
  'post-categories': 'website-post-categories',
  pages: 'website-pages'
};

function endpoint(dataset: string) {
  const remote = datasets[dataset];
  if (!remote) return null;
  const crm = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  return `${crm}/api/shared-data/${remote}`;
}

export async function GET(_request: Request, context: { params: Promise<{ dataset: string }> }) {
  const url = endpoint((await context.params).dataset);
  if (!url) return NextResponse.json({ success: false, error: 'Unknown dataset' }, { status: 404 });
  try {
    const response = await fetch(url, { cache: 'no-store' });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Shared database unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request, context: { params: Promise<{ dataset: string }> }) {
  const url = endpoint((await context.params).dataset);
  if (!url) return NextResponse.json({ success: false, error: 'Unknown dataset' }, { status: 404 });
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(await request.json()), cache: 'no-store' });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Shared database unavailable' }, { status: 503 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ dataset: string }> }) {
  const url = endpoint((await context.params).dataset);
  if (!url) return NextResponse.json({ success: false, error: 'Unknown dataset' }, { status: 404 });
  try {
    const response = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(await request.json()), cache: 'no-store' });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch {
    return NextResponse.json({ success: false, error: 'Shared database unavailable' }, { status: 503 });
  }
}
