import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { saveProductToHostingerDb, deleteProductFromHostingerDb, loadProductsFromHostingerDb } from '@/lib/hostinger-db';
import { invalidateServerCatalogCache } from '@/lib/server-catalog';
import { getDurableCatalog, invalidateDurableCatalog } from '@/lib/durable-catalog';
import { canUploadMedia } from '@/lib/media-access';
import { uploadR2Image } from '@/lib/r2-media';

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

    const temporary = `${CACHE_FILE}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(temporary, JSON.stringify(products), 'utf8');
    fs.renameSync(temporary, CACHE_FILE);
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

function responseProducts(products: any[], listView: boolean) {
  return products.map(product => {
    const { wordpressSource, ...fields } = product;
    const createdAt = product.createdAt || wordpressSource?.createdAt;
    if (!listView) return { ...fields, createdAt, sourcePostType: product.sourcePostType || wordpressSource?.postType };
    return {
      id: product.id, name: product.name, slug: product.slug, sku: product.sku,
      category: product.category, parentCategory: product.parentCategory, categories: product.categories, brand: product.brand,
      image: product.image, regularPrice: product.regularPrice, salePrice: product.salePrice,
      sellingPrice: product.sellingPrice, inStock: product.inStock, stockStatus: product.stockStatus,
      status: product.status, createdAt, updatedAt: product.updatedAt,
    };
  });
}

export async function GET(request: Request) {
  const listView = new URL(request.url).searchParams.get('view') === 'list';
  const durable = await getDurableCatalog();
  const products = durable ?? getCachedProducts();
  return NextResponse.json(
    { success: true, products: responseProducts(products, listView), count: products.length,
      parentCategories: [...new Set<string>(products.flatMap((product: any) => (product.wordpressSource?.categories || []).filter((category: any) => !category.parentId && category.name && category.name.toLowerCase() !== 'uncategorized').map((category: any) => category.name)))].sort((a, b) => a.localeCompare(b)),
      source: durable === null ? 'cache' : 'database',
      ...(durable === null ? { warning: 'Database unavailable; showing cached products' } : {}) },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const durable = await getDurableCatalog();
    if (durable === null) return NextResponse.json({ success: false, error: 'Database unavailable. Product was not saved; please retry.' }, { status: 503 });
    const current = durable;
    // Migrate one existing record at a time; never create a product or overwrite
    // staff edits using a stale client-side catalog snapshot.
    if (body.action === 'migrate-product-media') {
      if (!await canUploadMedia(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      const index = current.findIndex((p: any) => p.id === body.id);
      if (index < 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      const original = current[index];
      const product = { ...original };
      const originals = { ...(original.mediaOriginals || {}) };
      const migrate = async (value: string) => {
        if (!value || value.startsWith('/api/media/')) return value;
        // No arbitrary remote fetching or file access through this endpoint.
        if (!/^\/(wp-content\/uploads|uploads|products)\//.test(value)) return value;
        const root = path.resolve(process.cwd(), 'public');
        const file = path.resolve(root, '.' + decodeURIComponent(value));
        if (!file.startsWith(root + path.sep)) throw new Error('Invalid image path');
        const mime = ({ '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' } as Record<string, string>)[path.extname(file).toLowerCase()];
        if (!mime) return value;
        const result = await uploadR2Image(fs.readFileSync(file), path.basename(file), mime);
        originals[result.url] = value;
        return result.url;
      };
      product.image = await migrate(original.image);
      if (Array.isArray(original.galleryImages)) product.galleryImages = await Promise.all(original.galleryImages.map(migrate));
      if (product.image === original.image && JSON.stringify(product.galleryImages) === JSON.stringify(original.galleryImages)) {
        return NextResponse.json({ success: true, changed: false, id: original.id });
      }
      product.mediaOriginals = originals;
      // Keep creation/listing dates and all catalog fields unchanged.
      const recovery = path.join(BACKUPS_DIR, 'media-migration-originals.json');
      ensureDirectories();
      if (!fs.existsSync(recovery)) fs.writeFileSync(recovery, JSON.stringify(current), { flag: 'wx' });
      invalidateDurableCatalog();
      const latest = await getDurableCatalog();
      if (latest === null) return NextResponse.json({ error: 'Database unavailable; retry migration' }, { status: 503 });
      const latestIndex = latest.findIndex((p: any) => p.id === original.id);
      if (latestIndex < 0 || JSON.stringify(latest[latestIndex]) !== JSON.stringify(original)) {
        return NextResponse.json({ error: 'Product changed during migration; retry' }, { status: 409 });
      }
      if (!await saveProductToHostingerDb({ ...product })) {
        return NextResponse.json({ error: 'Database persistence failed; original links retained' }, { status: 503 });
      }
      const next = [...latest];
      next[latestIndex] = product;
      saveFileCache(next);
      invalidateDurableCatalog();
      invalidateServerCatalogCache();
      revalidatePath('/', 'layout');
      return NextResponse.json({ success: true, changed: true, id: product.id, image: product.image });
    }
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

    // A successful response requires a confirmed durable database write.
    if (!await saveProductToHostingerDb(productToSave)) {
      return NextResponse.json({ success: false, error: 'Database persistence failed. Product was not saved; please retry.' }, { status: 503 });
    }
    invalidateDurableCatalog();
    const latest = await getDurableCatalog();
    const normalizedList = latest ?? updatedList;
    saveFileCache(normalizedList);

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

    const durable = await getDurableCatalog();
    if (durable === null) return NextResponse.json({ success: false, error: 'Database unavailable; deletion was not saved' }, { status: 503 });
    let current = durable;
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

    for (const targetId of toDelete) {
      if (!await deleteProductFromHostingerDb(targetId)) {
        invalidateDurableCatalog();
        invalidateServerCatalogCache();
        return NextResponse.json({ success: false, error: 'Database deletion failed; reload before retrying' }, { status: 503 });
      }
    }
    invalidateDurableCatalog();
    saveFileCache(await getDurableCatalog() ?? normalized);

    // 3. Invalidate caches
    invalidateServerCatalogCache();

    // 4. Revalidate routes
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/shop');
    } catch {}

    return NextResponse.json({ success: true, count: normalized.length });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 });
  }
}
