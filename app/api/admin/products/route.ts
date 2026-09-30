import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { saveProductToHostingerDb, deleteProductFromHostingerDb, loadProductsFromHostingerDb } from '@/lib/hostinger-db';
import { invalidateServerCatalogCache } from '@/lib/server-catalog';

export const dynamic = 'force-dynamic';

const CACHE_FILE = path.join(process.cwd(), 'data', 'products-cache.json');
const BASELINE_FILE = path.join(process.cwd(), 'data', 'products-master-baseline.json');
const BACKUPS_DIR = path.join(process.cwd(), 'data', 'backups');

let inMemoryProducts: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60_000; // 1 minute in-memory cache

function productTime(product: any): number {
  const value = product?.createdAt || product?.wordpressSource?.createdAt || product?.updatedAt;
  const parsed = value ? new Date(value).getTime() : 0;
  if (Number.isFinite(parsed) && parsed > 0) return parsed;
  const match = String(product?.id || '').match(/(\d{12,})/);
  return match ? Number(match[1]) : 0;
}

function identityKeys(product: any): string[] {
  const normalize = (value: unknown) => String(value || '').trim().toLowerCase();
  const sku = normalize(product?.sku);
  const slug = normalize(product?.slug);
  const id = normalize(product?.id);
  return [sku && sku !== '—' && sku !== '-' ? `sku:${sku}` : '', slug ? `slug:${slug}` : '', id ? `id:${id}` : ''].filter(Boolean);
}

function normalizeProducts(products: any[]): any[] {
  const seen = new Set<string>();
  return [...products].filter((product) => product?.id).sort((a, b) => productTime(b) - productTime(a)).filter((product) => {
    const keys = identityKeys(product);
    if (keys.some((key) => seen.has(key))) return false;
    keys.forEach((key) => seen.add(key));
    return true;
  });
}

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

export async function GET() {
  const cached = getCachedProducts();
  if (cached.length > 0) {
    return NextResponse.json(
      { success: true, products: cached, count: cached.length, source: 'cache' },
      { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
    );
  }

  // Fallback to Hostinger MySQL live database
  try {
    const dbProducts = await loadProductsFromHostingerDb();
    if (Array.isArray(dbProducts) && dbProducts.length > 0) {
      const normalized = normalizeProducts(dbProducts);
      saveFileCache(normalized);
      return NextResponse.json(
        { success: true, products: normalized, count: normalized.length, source: 'database' },
        { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
      );
    }
  } catch {}

  return NextResponse.json(
    { success: true, products: [], count: 0, warning: 'No products in database or cache' },
    { headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const current = getCachedProducts();
    const existingIndex = current.findIndex(
      (p: any) => p.id === body.id || (body.slug && p.slug === body.slug)
    );

    let updatedList: any[];
    let productToSave: any;

    if (existingIndex >= 0) {
      productToSave = {
        ...current[existingIndex],
        ...body,
        updatedAt: new Date().toISOString(),
      };
      updatedList = [...current];
      updatedList[existingIndex] = productToSave;
    } else {
      productToSave = {
        ...body,
        id: body.id || `prod-${Date.now()}`,
        createdAt: body.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      updatedList = [productToSave, ...current];
    }

    const normalizedList = normalizeProducts(updatedList);

    // 1. Instantly save to local file cache
    saveFileCache(normalizedList);

    // 2. Persist directly to Hostinger MySQL Database
    await saveProductToHostingerDb(productToSave).catch((err) =>
      console.warn('Could not save to Hostinger DB:', err)
    );

    // 3. Invalidate all in-memory caches instantly (0ms delay)
    invalidateServerCatalogCache();

    // 4. Purge Next.js page route cache so visitors see updates immediately
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
      if (productToSave.slug) {
        revalidatePath(`/product/${productToSave.slug}`);
      }
    } catch (e) {
      console.warn('Revalidation warning:', e);
    }

    // 5. Fire-and-forget background sync to secondary backends if configured
    for (const url of getBackendUrls()) {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToSave),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      product: productToSave,
      count: normalizedList.length,
    });
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
    const toDelete: string[] = [];

    if (id) {
      toDelete.push(id);
      current = current.filter((p: any) => p.id !== id);
    } else if (ids) {
      const idList = ids.split(',').map((x) => x.trim()).filter(Boolean);
      if (idList.length > 50) {
        return NextResponse.json(
          { success: false, error: 'Safety limit: Cannot delete more than 50 products in one request' },
          { status: 400 }
        );
      }
      toDelete.push(...idList);
      current = current.filter((p: any) => !idList.includes(p.id));
    }

    const normalized = normalizeProducts(current);

    // 1. Update local file cache
    saveFileCache(normalized);

    // 2. Delete from Hostinger MySQL
    for (const targetId of toDelete) {
      await deleteProductFromHostingerDb(targetId).catch(() => {});
    }

    // 3. Invalidate caches
    invalidateServerCatalogCache();

    // 4. Revalidate routes
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
    } catch {}

    // 5. Fire-and-forget notify backends
    for (const u of getBackendUrls()) {
      fetch(`${u}?${url.searchParams.toString()}`, { method: 'DELETE' }).catch(() => {});
    }

    return NextResponse.json({ success: true, count: normalized.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
