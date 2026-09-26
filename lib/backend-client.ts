import type { Product, ProductCategory } from './types';

export interface CatalogResponse {
  products: Product[];
  categories: ProductCategory[];
  source: 'crm' | 'fallback';
  total: number;
  page: number;
  totalPages: number;
}

export interface CatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  slug?: string;
}

export interface WebsiteEnquiryInput {
  name: string;
  email: string;
  phone: string;
  clinicName?: string;
  message: string;
  productId?: string;
  productName?: string;
  quantity?: number;
}

export async function fetchCatalog(query: CatalogQuery = {}): Promise<CatalogResponse> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== '') params.set(key, String(value));
  }
  const response = await fetch(`/api/catalog?${params.toString()}`, { cache: 'no-store' });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success || !Array.isArray(result.products)) {
    throw new Error(result?.error || 'Unable to load the shared CRM catalog');
  }
  return {
    products: result.products,
    categories: Array.isArray(result.categories) ? result.categories : [],
    source: result.source === 'crm' ? 'crm' : 'fallback',
    total: Number(result.total ?? result.products.length),
    page: Number(result.page ?? 1),
    totalPages: Number(result.totalPages ?? 1)
  };
}

export async function submitWebsiteEnquiry(input: WebsiteEnquiryInput): Promise<void> {
  const response = await fetch('/api/enquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result?.success) {
    throw new Error(result?.error || 'Unable to submit your enquiry');
  }
}
