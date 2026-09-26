import { NextResponse } from 'next/server';
import { editorialPages } from '@/lib/editorial-pages';

export async function GET() {
  const pages = Object.entries(editorialPages).map(([slug, page]) => ({
    ...page,
    id: slug,
    slug,
    status: 'published',
    updatedAt: new Date().toISOString()
  }));
  return NextResponse.json({ success: true, pages });
}
