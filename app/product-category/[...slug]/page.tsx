import type { Metadata } from 'next';
import ProductCard from '@/components/ProductCard';
import { getAllProducts } from '@/lib/server-catalog';
import { hasUsableProductImage } from '@/lib/sitemap-utils';

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params; const label = slug.at(-1)?.replaceAll('-', ' ') || 'Medical Equipment';
  return { title: `${label.replace(/\b\w/g, (char) => char.toUpperCase())} in UAE | Fastonmed`, alternates: { canonical: `https://www.fastonmed.com/product-category/${slug.join('/')}` } };
}

export default async function ProductCategoryPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params; const target = slug.at(-1) || '';
  const all = (await getAllProducts()).filter((product) => hasUsableProductImage(product.mainImage));
  const products = all.filter((product) => slugify(product.category || '') === target);
  const title = products[0]?.category || target.replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  return (
    <main style={{ background: '#f8fafc', padding: '44px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: 34 }}>
          <span style={{ color: '#51b291', fontWeight: 800, fontSize: 12, letterSpacing: '.12em' }}>PRODUCT CATEGORY</span>
          <h1 style={{ fontSize: 38, margin: '7px 0' }}>{title}</h1>
          <p style={{ color: '#64748b' }}>{products.length} verified products with available images.</p>
        </div>
        {products.length ? (
          <div
            className="category-product-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showActions />
            ))}
            <style>{`
              @media (max-width: 768px) {
                .category-product-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 12px !important;
                }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 48, textAlign: 'center' }}>
            No products are currently available in this category.
          </div>
        )}
      </div>
    </main>
  );
}
