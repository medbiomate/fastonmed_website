import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/server-catalog';
import { brandName, brandSlug } from '@/lib/brand-utils';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };
async function brandProducts(slug: string) {
  return (await getAllProducts()).filter(product => brandSlug(product.brand || '') === slug);
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const products = await brandProducts(slug);
  const name = brandName(products[0]?.brand || slug);
  return { title: `${name} Products | Fastonmed`, description: `Browse ${name} products, prices and availability at Fastonmed.`, alternates: { canonical: `/brand/${slug}` } };
}
export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const products = await brandProducts(slug);
  if (!products.length) notFound();
  const name = brandName(products[0].brand);
  const totalPages = Math.ceil(products.length / 24);
  const page = Math.min(totalPages, Math.max(1, Math.floor(Number((await searchParams).page) || 1)));
  return <main style={{ background: '#f8fafc', padding: '36px 0 64px' }}>
    <div className="container">
      <nav aria-label="Breadcrumb" style={{ marginBottom: 20 }}><Link href="/shop">Shop</Link> / {name}</nav>
      <h1 style={{ color: '#0f172a', fontSize: '2rem', marginBottom: 10 }}>{name}</h1>
      <p style={{ color: '#64748b', marginBottom: 28 }}>{products.length} products</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
        {products.slice((page - 1) * 24, page * 24).map(product => <ProductCard key={product.id} product={product} />)}
      </div>
      {totalPages > 1 && <nav aria-label="Product pages" style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
        {page > 1 && <Link href={`/brand/${slug}?page=${page - 1}`}>Previous</Link>}
        <span>Page {page} of {totalPages}</span>
        {page < totalPages && <Link href={`/brand/${slug}?page=${page + 1}`}>Next</Link>}
      </nav>}
    </div>
  </main>;
}
