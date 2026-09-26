import type { Product, ProductCategory } from './types';
import { initialCategories, initialProducts } from './mock-data';

let cachedProducts: Product[] | null = null;
let cacheExpiresAt = 0;

type RawCrmProduct = {
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

function mapRawProduct(item: RawCrmProduct, index: number): Product {
  const name = item.name?.trim() || `Medical product ${index + 1}`;
  const id = item.id || `crm-product-${index + 1}`;
  const regularPrice = Number(item.regularPrice ?? item.sellingPrice ?? item.purchaseCost ?? 0);
  const salePrice = item.salePrice ? Number(item.salePrice) : undefined;
  const price = salePrice || regularPrice;
  const stock = Math.max(0, Number(item.inStock ?? 0));
  const description = item.description?.trim() || 'Contact FastOnMed Dubai for product specifications and healthcare supply availability.';
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
    brand: item.brand?.trim() || 'FastOnMed Partner',
    model: item.model,
    shortDescription: item.shortDescription || description,
    fullDescription: description,
    mainImage: item.image || '',
    galleryImages: item.galleryImages?.length ? item.galleryImages : item.image ? [item.image] : [],
    stockQuantity: stock,
    lowStockThreshold: 2,
    stockStatus: item.stockStatus === 'outofstock' ? 'out_of_stock' : item.stockStatus === 'onbackorder' ? 'on_backorder' : 'in_stock',
    warrantyPeriod: item.warrantyPeriod || '1 Year Official UAE Warranty',
    technicalSpecs: item.specifications || {},
    features: [
      'Statutory compliance with UAE MoHAP, DHA, and DoH clinical standards',
      'Engineered for hospital wards, day surgery centers, and homecare',
      'High-grade medical materials with antimicrobial surface resistance',
      'Fast delivery across Dubai, Abu Dhabi, and all 7 Emirates'
    ],
    applications: ['Hospitals & Intensive Care Units (ICU)', 'Outpatient Clinics', 'Home Healthcare & Rehabilitation'],
    documents: [],
    tags: item.tags || [],
    isFeatured: index < 8,
    isBestSeller: index < 4,
    isNew: false,
    status: 'published',
    createdAt,
    updatedAt,
    canonicalUrl: item.productUrl || `https://www.fastonmed.com/product/${item.slug || slugify(name)}`
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const now = Date.now();
  if (cachedProducts && cacheExpiresAt > now) {
    return cachedProducts;
  }

  const crmUrl = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

  try {
    const response = await fetch(`${crmUrl}/api/products?view=storefront`, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`CRM API HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data?.success && Array.isArray(data.products)) {
      const mapped = (data.products as RawCrmProduct[])
        .filter(item =>
          item.sourcePostType !== 'product_variation' &&
          item.name !== 'AUTO-DRAFT' &&
          item.status !== 'auto-draft' &&
          item.status !== 'trash' &&
          (!item.status || item.status === 'publish' || item.status === 'published')
        )
        .map(mapRawProduct)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      cachedProducts = mapped;
      cacheExpiresAt = now + 60_000; // 1 minute in-memory cache
      return mapped;
    }
  } catch (err) {
    console.warn('[server-catalog] Falling back to initialProducts:', err);
  }

  return initialProducts;
}

export async function getServerProductBySlug(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  const normalized = slug.trim().toLowerCase();
  return (
    products.find(p => p.slug.toLowerCase() === normalized || p.id.toLowerCase() === normalized) ||
    null
  );
}

/**
 * Intelligent similar products matcher:
 * 1. Prioritizes products matching medical title keywords (e.g. mattress, bed, monitor, pump).
 * 2. Matches category and brand.
 * 3. Filters for items with valid high-resolution product photography.
 * 4. Backfills to guarantee the requested limit of similar products.
 */
export async function getServerSimilarProducts(
  product: Product,
  limit: number = 4
): Promise<Product[]> {
  const all = await getAllProducts();

  // Extract meaningful product keywords (exclude common stop words)
  const stopWords = new Set(['the', 'and', 'for', 'with', 'set', 'each', 'box', 'pack', 'size', 'type']);
  const titleWords = product.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  // Score candidate products
  const scored = all
    .filter(p => p.id !== product.id && p.slug !== product.slug)
    .map(candidate => {
      let score = 0;

      // Bonus for valid image
      const hasValidImage = candidate.mainImage && candidate.mainImage.trim().length > 5 && !candidate.mainImage.includes('placeholder');
      if (hasValidImage) {
        score += 15;
      } else {
        score -= 20; // heavily penalize products without pictures
      }

      // Same clinical category
      if (candidate.category && product.category && candidate.category.toLowerCase() === product.category.toLowerCase()) {
        score += 25;
      }

      // Same brand/partner
      if (candidate.brand && product.brand && candidate.brand.toLowerCase() === product.brand.toLowerCase() && candidate.brand !== 'FastOnMed Partner') {
        score += 15;
      }

      // Keyword matches in title
      const candTitle = candidate.name.toLowerCase();
      for (const word of titleWords) {
        if (candTitle.includes(word)) {
          score += 8;
        }
      }

      return { candidate, score, hasValidImage };
    })
    .filter(item => item.score > 0 && item.hasValidImage)
    .sort((a, b) => b.score - a.score);

  const topMatches = scored.slice(0, limit).map(item => item.candidate);

  // If still fewer than limit, backfill with featured products having valid images
  if (topMatches.length < limit) {
    const existingIds = new Set([product.id, ...topMatches.map(p => p.id)]);
    const fallbackItems = all.filter(
      p => !existingIds.has(p.id) && p.mainImage && p.mainImage.trim().length > 5
    );
    topMatches.push(...fallbackItems.slice(0, limit - topMatches.length));
  }

  return topMatches.slice(0, limit);
}
