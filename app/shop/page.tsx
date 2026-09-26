'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowUpDown, X } from 'lucide-react';
import { Product, ProductCategory } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import CategoryWidget from '@/components/CategoryWidget';
import CatalogSearchHeader from '@/components/CatalogSearchHeader';
import { fetchCatalog } from '@/lib/backend-client';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const timer = window.setTimeout(() => {
      fetchCatalog({ page, limit: 20, search: searchQuery, category: selectedCategory, sortBy })
      .then(({ products: sharedProducts, categories: sharedCategories, total, totalPages: pages }) => {
        if (!active) return;
        setProducts(sharedProducts);
        setCategories(sharedCategories);
        setTotalProducts(total);
        setTotalPages(pages);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
        setTotalProducts(0);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    }, searchQuery ? 250 : 0);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, searchQuery, selectedCategory, sortBy]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialCategory, initialSearch]);

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '36px 0 80px' }}>
      <div className="container">
        {/* Modern Search Hero Header (Above Category Widget) */}
        <CatalogSearchHeader
          searchQuery={searchQuery}
          onSearchChange={(query) => {
            setSearchQuery(query);
            setPage(1);
          }}
        />

        {/* Interactive Categories Widget */}
        <CategoryWidget
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(catName) => {
            setSelectedCategory(catName);
            setPage(1);
          }}
          totalProducts={totalProducts}
        />

        {/* Clear Visual Section Divider & Products Inventory Header with Sort Controls */}
        <div style={{ marginBottom: '24px', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '2px solid #e2e8f0', paddingBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  {selectedCategory ? `${selectedCategory.replace(/&amp;/g, '&')}` : searchQuery ? `Search Results for "${searchQuery}"` : 'All Medical Equipment & Supplies'}
                </h2>

                {selectedCategory && (
                  <button
                    onClick={() => { setSelectedCategory(''); setPage(1); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#eaf7f2',
                      color: '#2f6b57',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #a7e4cf',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Category: {selectedCategory.replace(/&amp;/g, '&')}</span>
                    <X size={13} />
                  </button>
                )}

                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setPage(1); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: '1px solid #bfdbfe',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Search: "{searchQuery}"</span>
                    <X size={13} />
                  </button>
                )}
              </div>
              <p style={{ fontSize: '0.86rem', color: '#64748b', margin: '4px 0 0 0' }}>
                Showing <strong style={{ color: '#0f172a' }}>{products.length}</strong> of {totalProducts.toLocaleString()} items
              </p>
            </div>

            {/* Sort Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ArrowUpDown size={14} color="#64748b" />
              <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 600 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={e => {
                  setSortBy(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="recent">Newest / Recent First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: '#64748b' }}>Loading products…</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
              No medical equipment found
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '20px' }}>
              Try adjusting your search criteria or category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory(''); setSearchQuery(''); setPage(1); }}
              style={{
                backgroundColor: '#51b291',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className="shop-product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {products.map(p => (
              <ProductCard key={p.id} product={p} showActions />
            ))}
            <style>{`
              @media (max-width: 768px) {
                .shop-product-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 12px !important;
                }
              }
            `}</style>
          </div>
        )}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginTop: '36px' }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => { setPage(current => Math.max(1, current - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span style={{ color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => { setPage(current => Math.min(totalPages, current + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#51b291', color: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
