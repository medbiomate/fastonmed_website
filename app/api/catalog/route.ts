import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Product, ProductCategory } from '@/lib/types';
import { initialCategories, initialProducts } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

let catalogCache: { products: CrmProduct[]; expiresAt: number } | null = null;

type CrmProduct = {
  id?: string;
  name?: string;
  category?: string;
  brand?: string;
  model?: string;
  sellingPrice?: number;
  purchaseCost?: number;
  warrantyPeriod?: string;
  specifications?: Record<string, string>;
  inStock?: number;
  image?: string;
  description?: string;
  tags?: string[];
  productUrl?: string;
  slug?: string;
  sku?: string;
  status?: string;
  regularPrice?: number;
  salePrice?: number | null;
  stockStatus?: string;
  galleryImages?: string[];
  shortDescription?: string;
  sourcePostType?: string;
  createdAt?: string;
  updatedAt?: string;
};

function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function mapCrmProduct(item: CrmProduct, index: number): Product {
  const name = item.name?.trim() || `Medical product ${index + 1}`;
  const id = item.id || `crm-product-${index + 1}`;
  const regularPrice = Number(item.regularPrice ?? item.sellingPrice ?? item.purchaseCost ?? 0);
  const salePrice = item.salePrice ? Number(item.salePrice) : undefined;
  const price = salePrice || regularPrice;
  const stock = Math.max(0, Number(item.inStock ?? 0));
  const description = item.description?.trim() || 'Contact FastonMed for product specifications and availability.';
  const createdAt = item.createdAt ? new Date(item.createdAt).toISOString() : new Date(0).toISOString();
  const updatedAt = item.updatedAt ? new Date(item.updatedAt).toISOString() : createdAt;

  return {
    id,
    name,
    slug: item.slug || slugify(name) || id,
    sku: item.sku?.trim() || item.model?.trim() || id,
    productType: 'simple',
    purchaseMode: price > 0 ? 'cart' : 'quote',
    regularPrice,
    salePrice,
    category: item.category?.trim() || 'Medical Equipment',
    brand: item.brand?.trim() || 'FastonMed Partner',
    model: item.model,
    shortDescription: item.shortDescription || description,
    fullDescription: description,
    mainImage: item.image || '',
    galleryImages: item.galleryImages?.length ? item.galleryImages : item.image ? [item.image] : [],
    stockQuantity: stock,
    lowStockThreshold: 2,
    stockStatus: item.stockStatus === 'outofstock' ? 'out_of_stock' : item.stockStatus === 'onbackorder' ? 'on_backorder' : 'in_stock',
    warrantyPeriod: item.warrantyPeriod,
    technicalSpecs: item.specifications || {},
    features: [],
    applications: [],
    documents: [],
    tags: item.tags || [],
    isFeatured: index < 8,
    isBestSeller: index < 4,
    isNew: false,
    status: 'published',
    createdAt,
    updatedAt,
    canonicalUrl: item.productUrl
  };
}

function buildCategories(products: Product[]): ProductCategory[] {
  const counts = new Map<string, number>();
  const images = new Map<string, string>();
  for (const product of products) {
    if (!product.category) continue;
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
    if (!images.has(product.category) && product.mainImage && product.mainImage.length > 5 && !product.mainImage.includes('placeholder')) {
      images.set(product.category, product.mainImage);
    }
  }
  return Array.from(counts.entries())
    .filter(([name]) => name.toLowerCase() !== 'uncategorized')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, productCount], index) => ({
      id: `crm-category-${slugify(name)}`,
      name,
      slug: slugify(name),
      image: images.get(name) || '',
      displayOrder: index + 1,
      productCount
    }));
}

function catalogPage(products: Product[], request: Request) {
  const params = new URL(request.url).searchParams;
  const slug = params.get('slug')?.trim();
  const search = params.get('search')?.trim().toLowerCase() || '';
  const category = params.get('category')?.trim().toLowerCase() || '';
  const tab = params.get('tab')?.trim().toLowerCase() || '';
  const sortBy = params.get('sortBy') || 'recent';
  const page = Math.max(1, Number(params.get('page')) || 1);
  const limit = Math.min(48, Math.max(1, Number(params.get('limit')) || 24));

  let filtered = slug
    ? products.filter(product => product.slug === slug || product.id === slug)
    : products.filter(product => {
        // Tab-based preset filtering for storefront Featured section
        if (tab === 'icu') {
          const target = `${product.name || ''} ${product.category || ''}`.toLowerCase();
          return (
            target.includes('icu') ||
            target.includes('ventilator') ||
            target.includes('monitor') ||
            target.includes('respiratory') ||
            target.includes('defibrillator') ||
            target.includes('vital') ||
            target.includes('oxygen')
          );
        }
        if (tab === 'recent') {
          return true; // Will be sorted by newest in sortBy handler
        }
        if (tab === 'furniture') {
          const target = `${product.name || ''} ${product.category || ''}`.toLowerCase();
          const isFurnitureItem =
            target.includes('stretcher') ||
            target.includes('bed') ||
            target.includes('chair') ||
            target.includes('trolley') ||
            target.includes('cabinet') ||
            /\btables?\b/.test(target) ||
            target.includes('wheelchair') ||
            target.includes('cart') ||
            target.includes('ward') ||
            target.includes('commode') ||
            target.includes('iv pole') ||
            target.includes('couches') ||
            target.includes('screen');
          const isNotMedicalSupply =
            !target.includes('dressing') &&
            !target.includes('tegaderm') &&
            !target.includes('bandage') &&
            !target.includes('plaster') &&
            !target.includes('portable') &&
            !target.includes('rucksack') &&
            !target.includes('therapy') &&
            !target.includes('tube') &&
            !target.includes('glove') &&
            !target.includes('catheter') &&
            !target.includes('suture') &&
            !target.includes('syringe') &&
            !target.includes('swab');
          return isFurnitureItem && isNotMedicalSupply;
        }
        if (tab === 'consumables') {
          const target = `${product.name || ''} ${product.category || ''}`.toLowerCase();
          return (
            target.includes('disposable') ||
            target.includes('consumable') ||
            target.includes('dressing') ||
            target.includes('bandage') ||
            target.includes('plaster') ||
            target.includes('kit') ||
            target.includes('glove') ||
            target.includes('mask') ||
            target.includes('ppe') ||
            target.includes('clean-up')
          );
        }
        if (tab === 'diagnostic') {
          const target = `${product.name || ''} ${product.category || ''}`.toLowerCase();
          return (
            (target.includes('diagnostic') ||
              target.includes('laboratory') ||
              target.includes('autoclave') ||
              target.includes('ultrasound') ||
              target.includes('refrigerator') ||
              target.includes('analyzer') ||
              target.includes('microscope') ||
              target.includes('centrifuge') ||
              target.includes('transport box')) &&
            !target.includes('bandage') &&
            !target.includes('plaster')
          );
        }

        const catNormalized = category.toLowerCase();
        const productCat = (product.category || '').toLowerCase();
        const productCatSlug = slugify(product.category || '');
        const categoryMatches =
          !category ||
          productCat === catNormalized ||
          productCatSlug === catNormalized ||
          productCat.includes(catNormalized);
        const searchMatches =
          !search ||
          [product.name, product.brand, product.sku, product.shortDescription].some(value =>
            value?.toLowerCase().includes(search)
          );
        return categoryMatches && searchMatches;
      });

  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
  } else if (sortBy === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    // Default ('recent', 'newest', 'featured'): Newest products first
    filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);
  const pageProducts = slug ? filtered : filtered.slice((safePage - 1) * limit, safePage * limit);
  return { products: pageProducts, total, page: safePage, totalPages };
}

let inMemoryProducts: Product[] | null = null;
let inMemoryCategories: ProductCategory[] | null = null;

function getLocalProducts(): { products: Product[]; categories: ProductCategory[] } {
  if (inMemoryProducts && inMemoryCategories) {
    return { products: inMemoryProducts, categories: inMemoryCategories };
  }

  const candidates = [
    path.join(process.cwd(), 'data', 'products-cache.json'),
    path.join(process.cwd(), 'data', 'products-master-baseline.json')
  ];

  for (const filePath of candidates) {
    try {
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const parsed = JSON.parse(fileContent);
        const rawProducts: CrmProduct[] = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed.products)
          ? parsed.products
          : [];
        if (rawProducts.length > 0) {
          inMemoryProducts = rawProducts
            .filter(
              item =>
                item.sourcePostType !== 'product_variation' &&
                item.name !== 'AUTO-DRAFT' &&
                item.status !== 'auto-draft' &&
                item.status !== 'trash' &&
                (!item.status || item.status === 'publish' || item.status === 'published')
            )
            .map(mapCrmProduct);
          inMemoryCategories = buildCategories(inMemoryProducts);
          return { products: inMemoryProducts, categories: inMemoryCategories };
        }
      }
    } catch (e) {
      console.error(`Error reading ${filePath}:`, e);
    }
  }

  inMemoryProducts = initialProducts;
  inMemoryCategories = initialCategories;
  return { products: inMemoryProducts, categories: inMemoryCategories };
}

export async function GET(request: Request) {
  // Check remote backend ONLY if explicitly configured in environment
  const remoteUrl = process.env.CRM_BACKEND_URL || process.env.FAST_API_URL;
  if (remoteUrl) {
    try {
      let rawProducts =
        catalogCache?.expiresAt && catalogCache.expiresAt > Date.now() ? catalogCache.products : null;
      if (!rawProducts) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const response = await fetch(`${remoteUrl.replace(/\/$/, '')}/api/products?view=storefront`, {
          cache: 'no-store',
          headers: { Accept: 'application/json' },
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (response.ok) {
          const result = await response.json();
          if (result?.success && Array.isArray(result.products) && result.products.length > 0) {
            rawProducts = result.products as CrmProduct[];
            catalogCache = { products: rawProducts, expiresAt: Date.now() + 120_000 };
          }
        }
      }
      if (rawProducts) {
        const products = rawProducts
          .filter(
            item =>
              item.sourcePostType !== 'product_variation' &&
              item.name !== 'AUTO-DRAFT' &&
              item.status !== 'auto-draft' &&
              item.status !== 'trash' &&
              (!item.status || item.status === 'publish' || item.status === 'published')
          )
          .map(mapCrmProduct);
        const paged = catalogPage(products, request);
        return NextResponse.json(
          { success: true, ...paged, categories: buildCategories(products), source: 'backend' },
          { headers: { 'Cache-Control': 'no-store' } }
        );
      }
    } catch {}
  }

  // Instant in-memory cache response (< 5ms)
  const { products, categories } = getLocalProducts();
  const paged = catalogPage(products, request);
  return NextResponse.json(
    { success: true, ...paged, categories, source: 'cache' },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
