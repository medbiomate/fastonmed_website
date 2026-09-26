'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Edit3,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  X,
  Layers,
  RotateCcw,
} from 'lucide-react';

type Product = Record<string, any> & {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  brand: string;
  status: string;
  image?: string;
  galleryImages?: string[];
  regularPrice?: number;
  salePrice?: number;
  sellingPrice?: number;
  inStock?: number;
  stockStatus?: string;
  description?: string;
  shortDescription?: string;
  specifications?: Record<string, string>;
  tags?: string[];
  purchaseMode?: string;
  warrantyPeriod?: string;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const decodeHtml = (html?: string): string => {
  if (!html) return '';
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#038;/g, '&')
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
};

const productCreatedAt = (product: Product): string =>
  product.createdAt || product.wordpressSource?.createdAt || product.updatedAt || '';

const productCreatedTime = (product: Product): number => {
  const value = productCreatedAt(product);
  if (!value) return 0;
  const parsed = Date.parse(value.includes('T') ? value : value.replace(' ', 'T'));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatProductDate = (product: Product): { date: string; time: string } => {
  const timestamp = productCreatedTime(product);
  if (!timestamp) return { date: '—', time: '' };
  const date = new Date(timestamp);
  return {
    date: new Intl.DateTimeFormat('en-AE', { day: '2-digit', month: 'short', year: 'numeric' }).format(date),
    time: new Intl.DateTimeFormat('en-AE', { hour: '2-digit', minute: '2-digit' }).format(date),
  };
};

const blank = (): Product => ({
  id: `prod-${Date.now()}`,
  name: '',
  slug: '',
  sku: '',
  category: '',
  brand: '',
  status: 'draft',
  image: '',
  galleryImages: [],
  regularPrice: 0,
  salePrice: 0,
  sellingPrice: 0,
  inStock: 0,
  stockStatus: 'instock',
  description: '',
  shortDescription: '',
  specifications: {},
  tags: [],
  purchaseMode: 'cart',
  warrantyPeriod: '',
  seoTitle: '',
  seoDescription: '',
});

const PAGE_SIZE = 25;

export default function ProductManager({
  mode,
  id,
  initialStatus = 'published'
}: {
  mode: 'list' | 'editor';
  id?: string;
  initialStatus?: 'all' | 'published' | 'draft' | 'trash';
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [product, setProduct] = useState<Product>(blank());
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState('');
  const [specText, setSpecText] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeletingBulk, setIsDeletingBulk] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'trash'>(initialStatus);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch('/api/admin/products', { cache: 'no-store' })
      .then((r) => r.json())
      .then((x) => {
        if (!active) return;
        const all = x.products || [];
        setProducts(all);
        if (id) {
          const p = all.find((v: Product) => v.id === id || v.slug === id);
          if (p) {
            setProduct({ ...blank(), ...p });
            setSpecText(
              Object.entries(p.specifications || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join('\n')
            );
          }
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  // Reset page to 1 whenever search query or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedCategory, statusFilter]);

  const productStatus = (p: Product) => {
    if (p.status === 'trash') return 'trash';
    if (p.status === 'draft' || p.status === 'auto-draft') return 'draft';
    return 'published';
  };

  const statusCounts = useMemo(() => ({
    all: products.length,
    published: products.filter((p) => productStatus(p) === 'published').length,
    draft: products.filter((p) => productStatus(p) === 'draft').length,
    trash: products.filter((p) => productStatus(p) === 'trash').length,
  }), [products]);

  // Decoded category counts
  const { categories, categoryCounts } = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of products) {
      const cat = decodeHtml(p.category?.trim()) || 'Uncategorized';
      counts[cat] = (counts[cat] || 0) + 1;
    }
    const cats = Object.keys(counts).sort((a, b) => a.localeCompare(b));
    return { categories: cats, categoryCounts: counts };
  }, [products]);

  // Filtered products list
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (statusFilter !== 'all' && productStatus(p) !== statusFilter) return false;
      const pCat = decodeHtml(p.category?.trim()) || 'Uncategorized';
      if (selectedCategory && pCat !== selectedCategory) {
        return false;
      }
      if (q) {
        const pName = decodeHtml(p.name || '').toLowerCase();
        const pSku = (p.sku || '').toLowerCase();
        const pBrand = decodeHtml(p.brand || '').toLowerCase();
        if (!pName.includes(q) && !pSku.includes(q) && !pBrand.includes(q) && !pCat.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => productCreatedTime(b) - productCreatedTime(a));
  }, [products, query, selectedCategory, statusFilter]);

  // 25 items per page pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const paginated = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  // Multi-select helpers
  const allCurrentPageSelected =
    paginated.length > 0 && paginated.every((p) => selectedIds.includes(p.id));
  const someCurrentPageSelected =
    paginated.some((p) => selectedIds.includes(p.id));

  const toggleSelectCurrentPage = () => {
    const pageIds = paginated.map((p) => p.id);
    if (allCurrentPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedIds(filtered.map((p) => p.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const updateProductStatus = async (item: Product, status: string) => {
    const updated = { ...item, status, updatedAt: new Date().toISOString() };
    const response = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    if (!response.ok) throw new Error('Product status could not be updated');
    setProducts((current) => current.map((p) => p.id === item.id ? updated : p));
  };

  // Bulk trash/permanent-delete action
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const permanent = statusFilter === 'trash';
    const confirmMsg =
      selectedIds.length === 1
        ? permanent ? 'Permanently delete 1 selected product? This cannot be undone.' : 'Move 1 selected product to Trash?'
        : permanent ? `Permanently delete ${selectedIds.length} selected products? This cannot be undone.` : `Move ${selectedIds.length} selected products to Trash?`;
    if (!confirm(confirmMsg)) return;

    setIsDeletingBulk(true);
    try {
      if (permanent) {
        await Promise.all(selectedIds.map((pid) => fetch(`/api/admin/products?id=${encodeURIComponent(pid)}`, { method: 'DELETE' })));
        setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      } else {
        const chosen = products.filter((p) => selectedIds.includes(p.id));
        await Promise.all(chosen.map((p) => updateProductStatus(p, 'trash')));
      }
      setMessage(permanent ? `Permanently deleted ${selectedIds.length} product(s)` : `Moved ${selectedIds.length} product(s) to Trash`);
      setSelectedIds([]);
      setTimeout(() => setMessage(''), 4000);
    } catch (err: any) {
      alert(`Bulk delete failed: ${err?.message || err}`);
    } finally {
      setIsDeletingBulk(false);
    }
  };

  // Single delete action
  const remove = async (item: Product) => {
    if (statusFilter === 'trash') {
      if (!confirm('Permanently delete this product? This cannot be undone.')) return;
      await fetch(`/api/admin/products?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' });
      setProducts((v) => v.filter((p) => p.id !== item.id));
    } else {
      if (!confirm('Move this product to Trash?')) return;
      await updateProductStatus(item, 'trash');
    }
    setSelectedIds((prev) => prev.filter((id) => id !== item.id));
  };

  // Save product (editor mode)
  const saveProduct = async () => {
    const specifications = Object.fromEntries(
      specText
        .split('\n')
        .map((x) => x.split(':'))
        .filter((x) => x.length > 1)
        .map(([k, ...v]) => [k.trim(), v.join(':').trim()])
    );
    const ready = {
      ...product,
      name: product.name.trim(),
      slug: product.slug || slugify(product.name),
      sku: product.sku || `FOM-${Date.now()}`,
      image: product.image || '',
      galleryImages: (product.galleryImages || []).filter(Boolean),
      regularPrice: Number(product.regularPrice || 0),
      salePrice: Number(product.salePrice || 0) || null,
      sellingPrice: Number(product.salePrice || product.regularPrice || 0),
      inStock: Number(product.inStock || 0),
      specifications,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString(),
    };
    const r = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ready),
    });
    const x = await r.json();
    if (!r.ok) throw new Error(x.error);
    setProduct(x.product);
    setMessage('Product saved to shared catalogue');
  };

  // Pagination page numbers generation
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (safePage <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (safePage >= totalPages - 3) {
      pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages);
    }
    return pages;
  }, [totalPages, safePage]);

  if (mode === 'list') {
    return (
      <div>
        <Title
          title="Products"
          action={
            <Link href="/admin/products/new" className="tk-page-action">
              <Plus size={15} /> Add Product
            </Link>
          }
        />

        <main className="tk-editor-page">
          {message && <div className="tk-save-message">{message}</div>}

          <nav className="tk-product-status-tabs" aria-label="Product status filters">
            {([
              ['all', 'All'],
              ['published', 'Published'],
              ['draft', 'Draft'],
              ['trash', 'Trash'],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" className={statusFilter === value ? 'active' : ''} onClick={() => { setStatusFilter(value); setSelectedIds([]); }}>
                {label} <span>{loading ? '...' : statusCounts[value].toLocaleString()}</span>
              </button>
            ))}
          </nav>

          {/* Search and Category Filter Toolbar */}
          <div className="tk-list-tools">
            <label>
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, SKU or brand…"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  style={{ border: 0, background: 'none', cursor: 'pointer', padding: 2 }}
                >
                  <X size={14} color="#89958f" />
                </button>
              )}
            </label>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories ({statusFilter === 'all' ? products.length : statusCounts[statusFilter]})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c} ({categoryCounts[c] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Selection Action Bar */}
          {selectedIds.length > 0 && (
            <div className="tk-bulk-bar">
              <div className="tk-bulk-info">
                <span className="tk-bulk-badge">
                  {selectedIds.length} Selected
                </span>
                <span>
                  {selectedIds.length === 1
                    ? '1 product selected'
                    : `${selectedIds.length} products selected`}
                </span>
                {selectedIds.length < filtered.length && (
                  <button
                    type="button"
                    onClick={selectAllFiltered}
                    className="tk-bulk-btn tk-bulk-btn-secondary"
                    style={{ fontSize: 11, padding: '4px 8px' }}
                  >
                    Select all {filtered.length} matching
                  </button>
                )}
              </div>

              <div className="tk-bulk-actions">
                <button
                  type="button"
                  onClick={clearSelection}
                  className="tk-bulk-btn tk-bulk-btn-secondary"
                >
                  <X size={13} /> Deselect All
                </button>

                <button
                  type="button"
                  onClick={handleBulkDelete}
                  disabled={isDeletingBulk}
                  className="tk-bulk-btn tk-bulk-btn-danger"
                >
                  <Trash2 size={13} />
                  {isDeletingBulk ? 'Processing…' : statusFilter === 'trash' ? `Delete Permanently (${selectedIds.length})` : `Move to Trash (${selectedIds.length})`}
                </button>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="tk-panel">
            <table className="tk-admin-table tk-product-table">
              <thead>
                <tr>
                  <th className="tk-checkbox-col">
                    <input
                      type="checkbox"
                      className="tk-checkbox"
                      checked={allCurrentPageSelected}
                      ref={(el) => {
                        if (el) {
                          el.indeterminate =
                            !allCurrentPageSelected && someCurrentPageSelected;
                        }
                      }}
                      onChange={toggleSelectCurrentPage}
                      title="Select all on this page"
                    />
                  </th>
                  <th>Product</th>
                  <th>Category / Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Date Created</th>
                  <th style={{ textAlign: 'right', paddingRight: 20 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="tk-empty" style={{ padding: '60px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', color: '#475569', fontSize: '14px', fontWeight: 500 }}>
                        <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2.5px solid #cbd5e1', borderTopColor: '#0d9488', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                        Loading FastOnMed product catalogue...
                      </div>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="tk-empty">
                      No products found matching your search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginated.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    const decodedName = decodeHtml(p.name);
                    const decodedCat = decodeHtml(p.category) || 'Uncategorized';
                    const decodedBrand = decodeHtml(p.brand);
                    const priceVal = Number(
                      p.salePrice || p.regularPrice || p.sellingPrice || 0
                    );
                    const created = formatProductDate(p);

                    return (
                      <tr
                        key={p.id}
                        className={isSelected ? 'tk-row-selected' : ''}
                      >
                        <td className="tk-checkbox-col">
                          <input
                            type="checkbox"
                            className="tk-checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectRow(p.id)}
                            title={`Select ${decodedName}`}
                          />
                        </td>
                        <td>
                          <div className="tk-product-cell">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={decodedName}
                                loading="lazy"
                              />
                            ) : (
                              <div className="tk-no-thumb" />
                            )}
                            <span>
                              <b>{decodedName}</b>
                              <small>SKU: {p.sku || '—'}</small>
                            </span>
                          </div>
                        </td>
                        <td>
                          <b>{decodedCat}</b>
                          <small>{decodedBrand || '—'}</small>
                        </td>
                        <td>
                          {priceVal > 0 ? (
                            <span style={{ fontWeight: 600 }}>
                              AED {priceVal.toLocaleString()}
                            </span>
                          ) : (
                            <span style={{ color: '#87938e' }}>Enquiry</span>
                          )}
                        </td>
                        <td>{p.inStock ?? 0}</td>
                        <td>
                          <span className={`tk-post-status ${productStatus(p)}`}>{productStatus(p) === 'published' ? 'Published' : productStatus(p) === 'trash' ? 'Trash' : 'Draft'}</span>
                        </td>
                        <td className="tk-product-date">
                          <b>{created.date}</b>
                          {created.time && <small>{created.time}</small>}
                        </td>
                        <td style={{ textAlign: 'right', paddingRight: 16 }}>
                          <div
                            className="tk-row-actions"
                            style={{ justifyContent: 'flex-end' }}
                          >
                            {statusFilter !== 'trash' && <Link href={`/admin/products/${p.id}`} title="Edit product"><Edit3 size={15} /></Link>}
                            {statusFilter === 'trash' && <button type="button" onClick={() => updateProductStatus(p, 'draft')} title="Restore as draft"><RotateCcw size={15}/></button>}
                            <button
                              type="button"
                              onClick={() => remove(p)}
                              title={statusFilter === 'trash' ? 'Delete permanently' : 'Move to Trash'}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls Footer - 25 items per page */}
            {totalItems > 0 && (
              <div className="tk-pagination-bar">
                <div className="tk-pagination-info">
                  Showing <strong>{startIndex + 1}</strong> to{' '}
                  <strong>{endIndex}</strong> of <strong>{totalItems}</strong>{' '}
                  products (25 per page)
                </div>

                <div className="tk-pagination-controls">
                  <button
                    type="button"
                    className="tk-page-btn"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    title="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {pageNumbers.map((num, idx) =>
                    typeof num === 'string' ? (
                      <span key={`dots-${idx}`} className="tk-page-dots">
                        …
                      </span>
                    ) : (
                      <button
                        key={num}
                        type="button"
                        className={`tk-page-btn ${
                          safePage === num ? 'active' : ''
                        }`}
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    className="tk-page-btn"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={safePage >= totalPages}
                    title="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Editor mode
  return (
    <div>
      <Title
        title={id ? 'Edit Product' : 'Add Product'}
        action={
          <button className="tk-page-action" onClick={saveProduct}>
            <Save size={15} /> Save Product
          </button>
        }
      />
      <main className="tk-editor-page">
        {message && <div className="tk-save-message">{message}</div>}
        <div className="tk-product-editor">
          <section className="tk-panel tk-editor-main">
            <h3>Product details</h3>
            <label>
              Product name
              <input
                className="tk-title-input"
                value={product.name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                    slug: product.slug || slugify(e.target.value),
                  })
                }
              />
            </label>
            <div className="tk-two-fields">
              <label>
                SKU
                <input
                  value={product.sku}
                  onChange={(e) =>
                    setProduct({ ...product, sku: e.target.value })
                  }
                />
              </label>
              <label>
                URL slug
                <input
                  value={product.slug}
                  onChange={(e) =>
                    setProduct({ ...product, slug: slugify(e.target.value) })
                  }
                />
              </label>
            </div>
            <label>
              Short description
              <textarea
                rows={4}
                value={product.shortDescription || ''}
                onChange={(e) =>
                  setProduct({ ...product, shortDescription: e.target.value })
                }
              />
            </label>
            <label>
              Full product description
              <textarea
                className="tk-content-input"
                rows={12}
                value={product.description || ''}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </label>
            <h3>Product data</h3>
            <div className="tk-two-fields">
              <label>
                Regular price (AED)
                <input
                  type="number"
                  value={product.regularPrice || 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      regularPrice: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Sale price (AED)
                <input
                  type="number"
                  value={product.salePrice || 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      salePrice: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Stock quantity
                <input
                  type="number"
                  value={product.inStock || 0}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      inStock: Number(e.target.value),
                    })
                  }
                />
              </label>
              <label>
                Stock status
                <select
                  value={product.stockStatus || 'instock'}
                  onChange={(e) =>
                    setProduct({ ...product, stockStatus: e.target.value })
                  }
                >
                  <option value="instock">In stock</option>
                  <option value="outofstock">Out of stock</option>
                  <option value="onbackorder">On backorder</option>
                </select>
              </label>
            </div>
            <label>
              Technical specifications{' '}
              <small>One per line: Label: Value</small>
              <textarea
                rows={9}
                value={specText}
                onChange={(e) => setSpecText(e.target.value)}
                placeholder={'Model: ABC-100\nWarranty: 2 years'}
              />
            </label>
          </section>
          <aside className="tk-editor-side">
            <div className="tk-panel">
              <h3>Publish</h3>
              <label>
                Status
                <select
                  value={product.status || 'draft'}
                  onChange={(e) =>
                    setProduct({ ...product, status: e.target.value })
                  }
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
              <label>
                Purchase mode
                <select
                  value={product.purchaseMode || 'cart'}
                  onChange={(e) =>
                    setProduct({ ...product, purchaseMode: e.target.value })
                  }
                >
                  <option value="cart">Add to cart</option>
                  <option value="quote">Request quote</option>
                  <option value="enquire">Enquiry only</option>
                </select>
              </label>
            </div>
            <div className="tk-panel">
              <h3>Organisation</h3>
              <label>
                Category
                <input
                  list="product-categories"
                  value={product.category || ''}
                  onChange={(e) =>
                    setProduct({ ...product, category: e.target.value })
                  }
                />
                <datalist id="product-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label>
                Brand
                <input
                  value={product.brand || ''}
                  onChange={(e) =>
                    setProduct({ ...product, brand: e.target.value })
                  }
                />
              </label>
              <label>
                Tags
                <input
                  value={(product.tags || []).join(', ')}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      tags: e.target.value
                        .split(',')
                        .map((x) => x.trim())
                        .filter(Boolean),
                    })
                  }
                />
              </label>
              <label>
                Warranty
                <input
                  value={product.warrantyPeriod || ''}
                  onChange={(e) =>
                    setProduct({ ...product, warrantyPeriod: e.target.value })
                  }
                />
              </label>
            </div>
            <div className="tk-panel">
              <h3>Product images</h3>
              <label>
                Main image URL
                <input
                  value={product.image || ''}
                  onChange={(e) =>
                    setProduct({ ...product, image: e.target.value })
                  }
                />
              </label>
              {product.image && (
                <img
                  className="tk-image-preview"
                  src={product.image}
                  alt="Preview"
                />
              )}
              <label>
                Gallery image URLs <small>One per line</small>
                <textarea
                  rows={5}
                  value={(product.galleryImages || []).join('\n')}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      galleryImages: e.target.value
                        .split('\n')
                        .map((x) => x.trim()),
                    })
                  }
                />
              </label>
              <div className="tk-upload-note">
                <Upload size={15} /> Media uploads can be selected from the
                Media Library.
              </div>
            </div>
            <div className="tk-panel">
              <h3>SEO</h3>
              <label>
                SEO title
                <input
                  value={product.seoTitle || ''}
                  onChange={(e) =>
                    setProduct({ ...product, seoTitle: e.target.value })
                  }
                />
              </label>
              <label>
                Meta description
                <textarea
                  rows={4}
                  value={product.seoDescription || ''}
                  onChange={(e) =>
                    setProduct({ ...product, seoDescription: e.target.value })
                  }
                />
              </label>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Title({
  title,
  action,
}: {
  title: string;
  action: React.ReactNode;
}) {
  return (
    <div className="tk-page-heading">
      <div>
        <h1>{title}</h1>
        <p>WooCommerce-style Fastonmed catalogue management.</p>
      </div>
      {action}
    </div>
  );
}
