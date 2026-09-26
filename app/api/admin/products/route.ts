import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveProductToHostingerDb, deleteProductFromHostingerDb, loadProductsFromHostingerDb } from '@/lib/hostinger-db';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.join(process.cwd(), 'data', 'products-cache.json');
const BASELINE_FILE = path.join(process.cwd(), 'data', 'products-master-baseline.json');
const BACKUPS_DIR = path.join(process.cwd(), 'data', 'backups');

let inMemoryProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute in-memory cache

function ensureDirectories() {
  const dir = path.dirname(CACHE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function createSnapshotBackup(products: any[]) {
  try {
    ensureDirectories();
    if (!Array.isArray(products) || products.length === 0) return;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(BACKUPS_DIR, `products-backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(products), 'utf8');

    // Keep latest 10 rotating backups
    const files = fs
      .readdirSync(BACKUPS_DIR)
      .filter((f) => f.startsWith('products-backup-') && f.endsWith('.json'))
      .sort()
      .reverse();
    if (files.length > 10) {
      for (const oldFile of files.slice(10)) {
        try {
          fs.unlinkSync(path.join(BACKUPS_DIR, oldFile));
        } catch {}
      }
    }
  } catch (err) {
    console.error('Snapshot backup error:', err);
  }
}

function loadFileCache(): any[] {
  try {
    ensureDirectories();

    // 1. Primary cache file
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : [];
      if (list.length > 0) return list;
    }

    // 2. Auto-recovery from latest snapshot backup
    if (fs.existsSync(BACKUPS_DIR)) {
      const files = fs
        .readdirSync(BACKUPS_DIR)
        .filter((f) => f.startsWith('products-backup-') && f.endsWith('.json'))
        .sort()
        .reverse();
      for (const backup of files) {
        try {
          const raw = fs.readFileSync(path.join(BACKUPS_DIR, backup), 'utf8');
          const parsed = JSON.parse(raw);
          const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : [];
          if (list.length > 0) {
            console.log(`Safety Shield: Auto-recovered ${list.length} products from backup ${backup}`);
            saveFileCache(list);
            return list;
          }
        } catch {}
      }
    }

    // 3. Immutable master baseline fail-safe
    if (fs.existsSync(BASELINE_FILE)) {
      const raw = fs.readFileSync(BASELINE_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed.products) ? parsed.products : [];
      if (list.length > 0) {
        console.log(`Safety Shield: Auto-recovered ${list.length} products from master baseline`);
        saveFileCache(list);
        return list;
      }
    }
  } catch (err) {
    console.warn('Could not read products file cache:', err);
  }
  return [];
}

function saveFileCache(products: any[]) {
  try {
    ensureDirectories();

    // SAFETY SHIELD: Never allow overwriting catalog with empty data
    if (!Array.isArray(products) || products.length === 0) {
      console.warn('Safety Shield: Rejected attempt to overwrite product catalog with empty array');
      return;
    }

    // SAFETY SHIELD: Never allow accidental truncation of >50% of the catalog in a single write
    if (inMemoryProducts && inMemoryProducts.length > 100 && products.length < inMemoryProducts.length * 0.5) {
      console.warn('Safety Shield: Prevented mass accidental deletion of products');
      return;
    }

    // Create automatic snapshot before every change
    createSnapshotBackup(products);

    fs.writeFileSync(CACHE_FILE, JSON.stringify(products), 'utf8');
    inMemoryProducts = products;
    lastCacheTime = Date.now();
  } catch (err) {
    console.warn('Could not write products file cache:', err);
  }
}

function getCachedProducts(): any[] {
  if (inMemoryProducts && inMemoryProducts.length > 0 && Date.now() - lastCacheTime < CACHE_TTL_MS) {
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

const getBackendUrls = () => {
  const envUrl = process.env.CRM_BACKEND_URL || process.env.FAST_API_URL;
  const urls: string[] = [];
  if (envUrl) urls.push(`${envUrl.replace(/\/$/, '')}/api/products`);
  urls.push('https://api.fastonmed.com/api/products');
  urls.push('http://127.0.0.1:3000/api/products');
  return Array.from(new Set(urls));
};

export async function GET(request: Request) {
  const cached = getCachedProducts();

  // Return cached products immediately (< 5ms)
  if (cached.length > 0) {
    // Background revalidation
    if (Date.now() - lastCacheTime > CACHE_TTL_MS) {
      setTimeout(async () => {
        for (const url of getBackendUrls()) {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3500);
            const response = await fetch(url, {
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
                break;
              }
            }
          } catch {}
        }
      }, 0);
    }

    return NextResponse.json(
      { success: true, products: cached, count: cached.length, source: 'cache' },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  // Fallback direct fetch if cache is empty
  for (const url of getBackendUrls()) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const response = await fetch(url, {
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
            { success: true, products, count: products.length, source: 'backend' },
            { headers: { 'Cache-Control': 'no-store' } }
          );
        }
      }
    } catch {}
  }

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

    // Persist directly to Hostinger MySQL Database
    saveProductToHostingerDb(body).catch((err) => console.warn('Could not save to Hostinger DB:', err));

    // Forward to backends asynchronously
    for (const url of getBackendUrls()) {
      try {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }).catch(() => {});
      } catch {}
    }

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
      // Safety limit: avoid bulk-deleting more than 50 products in one call without confirmation
      if (idList.length > 50) {
        return NextResponse.json({ success: false, error: 'Safety limit: Cannot delete more than 50 products in one request' }, { status: 400 });
      }
      current = current.filter((p: any) => !idList.includes(p.id));
    }

    saveFileCache(current);

    // Delete from Hostinger MySQL
    if (id) {
      deleteProductFromHostingerDb(id).catch(() => {});
    } else if (ids) {
      const idList = ids.split(',').map((x) => x.trim());
      for (const singleId of idList) {
        deleteProductFromHostingerDb(singleId).catch(() => {});
      }
    }

    for (const u of getBackendUrls()) {
      try {
        fetch(`${u}?${url.searchParams.toString()}`, { method: 'DELETE' }).catch(() => {});
      } catch {}
    }

    return NextResponse.json({ success: true, count: current.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
