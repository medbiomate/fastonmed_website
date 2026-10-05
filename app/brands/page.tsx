import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/server-catalog';
import { brandName, brandSlug } from '@/lib/brand-utils';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Medical Equipment Brands | Fastonmed UAE',
  description: 'Explore medical equipment brands available from Fastonmed and browse products from each brand.',
  alternates: { canonical: '/brands' }
};
export default async function BrandsPage() {
  const brands = new Map<string, { name: string; count: number }>();
  for (const product of await getAllProducts()) {
    const name = brandName(product.brand || '');
    const slug = brandSlug(name);
    if (!slug) continue;
    const existing = brands.get(slug);
    brands.set(slug, { name: existing?.name || name, count: (existing?.count || 0) + 1 });
  }
  return <main style={{ background: '#f8fafc', padding: '48px 0 64px' }}>
    <div className="container">
      <h1 style={{ fontSize: '2.5rem', color: '#193c30', marginBottom: 16 }}>Medical Equipment Brands</h1>
      <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 32 }}>Explore our catalog brands. Choose a brand to view its available products, prices and product details.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 20 }}>
        {[...brands.entries()].sort(([, a], [, b]) => a.name.localeCompare(b.name)).map(([slug, brand]) => <Link key={slug} href={`/brand/${slug}`} style={{ display: 'block', background: '#fff', border: '1px solid #dfeae4', borderRadius: 16, padding: 24, textDecoration: 'none' }}>
          <h2 style={{ color: '#287d63', fontSize: 20, marginBottom: 12 }}>{brand.name}</h2>
          <p style={{ color: '#64748b', marginBottom: 16 }}>{brand.count} {brand.count === 1 ? 'product' : 'products'}</p>
          <span style={{ color: '#193c30', fontWeight: 600 }}>View products →</span>
        </Link>)}
      </div>
    </div>
  </main>;
}
