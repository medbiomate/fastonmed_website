import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.join(process.cwd(), 'data', 'products-cache.json');
let inMemoryProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute in-memory cache

function loadFileCache(): any[] {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.products)) return parsed.products;
    }
  } catch (err) {
    console.warn('Could not read products file cache:', err);
  }
  return [];
}

function saveFileCache(products: any[]) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(products), 'utf8');
    inMemoryProducts = products;
    lastCacheTime = Date.now();
  } catch (err) {
    console.warn('Could not write products file cache:', err);
  }
}

function getCachedProducts(): any[] {
  if (inMemoryProducts && Date.now() - lastCacheTime < CACHE_TTL_MS) {
    return inMemoryProducts;
  }
  const fromFile = loadFileCache();
  if (fromFile.length > 0) {
    inMemoryProducts = fromFile;
    lastCacheTime = Date.now();
    return fromFile;
  }
  return inMemoryProducts || [];
}

const crmUrl = () => `${(process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '')}/api/products`;

export async function GET(request: Request) {
  const cached = getCachedProducts();

  // If we have cached products, return them immediately (< 5ms response time)
  if (cached.length > 0) {
    // If cache is older than TTL, revalidate in background without blocking response
    if (Date.now() - lastCacheTime > CACHE_TTL_MS) {
      setTimeout(async () => {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 4000);
          const response = await fetch(crmUrl(), {
            method: 'GET',
            headers: { Accept: 'application/json' },
            signal: controller.signal,
            cache: 'no-store'
          });
          clearTimeout(timeout);
          if (response.ok) {
            const data = await response.json();
            const products = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : null;
            if (products && products.length > 0) saveFileCache(products);
          }
        } catch {}
      }, 0);
    }

    return NextResponse.json(
      { success: true, products: cached, count: cached.length, source: 'cache' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // Fallback if cache was completely empty: try fetching directly
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(crmUrl(), {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
      cache: 'no-store'
    });
    clearTimeout(timeout);
    if (response.ok) {
      const data = await response.json();
      const products = Array.isArray(data) ? data : Array.isArray(data.products) ? data.products : null;
      if (products && products.length > 0) {
        saveFileCache(products);
        return NextResponse.json(
          { success: true, products, count: products.length, source: 'crm' },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }
    }
  } catch {}

  // Return cached products immediately
  if (cached.length > 0) {
    return NextResponse.json(
      { success: true, products: cached, count: cached.length, source: 'cache' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  return NextResponse.json(
    { success: true, products: [], count: 0, warning: 'No products in database or cache' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = getCachedProducts();
    const existingIndex = current.findIndex((p: any) => p.id === body.id || (body.slug && p.slug === body.slug));

    let updatedList: any[];
    if (existingIndex >= 0) {
      updatedList = [...current];
      updatedList[existingIndex] = { ...updatedList[existingIndex], ...body, updatedAt: new Date().toISOString() };
    } else {
      const newProduct = {
        ...body,
        id: body.id || `prod-${Date.now()}`,
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updatedList = [newProduct, ...current];
    }

    saveFileCache(updatedList);

    // Forward to CRM asynchronously if available
    try {
      fetch(crmUrl(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, product: body, count: updatedList.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const ids = url.searchParams.get('ids');

    let current = getCachedProducts();
    if (id) {
      current = current.filter((p: any) => p.id !== id);
    } else if (ids) {
      const idList = ids.split(',').map((x) => x.trim());
      current = current.filter((p: any) => !idList.includes(p.id));
    }

    saveFileCache(current);

    // Forward to CRM if available
    try {
      fetch(`${crmUrl()}?${url.searchParams.toString()}`, { method: 'DELETE' }).catch(() => {});
    } catch {}

    return NextResponse.json({ success: true, count: current.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
