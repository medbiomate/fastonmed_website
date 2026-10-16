'use client';

import React, { useEffect, useState } from 'react';
import { productDescriptionHtml } from '@/lib/product-description';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, MessageCircle, FileText, Check } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useApp();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  useEffect(() => {
    if (!quickViewProduct) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = document.querySelector<HTMLElement>('[data-quick-view]');
    dialog?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeQuickView();
      if (event.key === 'Tab' && dialog) {
        const items = Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href]'));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [quickViewProduct, closeQuickView]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;

  const handleAddToCart = () => {
    addToCart(product, 1);
    closeQuickView();
  };

  const waText = encodeURIComponent(
    `Hello FastonMed Sales, I would like to inquire about: ${product.name} (SKU: ${product.sku}) https://www.fastonmed.com/product/${product.slug}`
  );
  const waUrl = `https://wa.me/971508893589?text=${waText}`;

  return (
    <div className="modal-overlay" onClick={closeQuickView}>
      <div data-quick-view role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="modal-content quick-view" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', padding: '0', overflow: 'auto', maxHeight: '90dvh', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <button
            aria-label="Close product preview"
            onClick={closeQuickView}
            style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
            <X size={20} />
          </button>
        </div>

        <style>{`.quick-view-layout { display:grid; grid-template-columns:1fr 1fr; align-items:start; }
.quick-view-description { max-height:220px; overflow:auto; line-height:1.65; color:var(--text-muted); font-size:14px; margin-bottom:20px; }
.quick-view-description p { margin:0 0 12px; } .quick-view-description ul,.quick-view-description ol { padding-left:20px; margin-bottom:12px; }
.quick-view-description h2,.quick-view-description h3 { font-size:16px; margin:16px 0 8px; }
@media(max-width:640px) { .quick-view-layout {grid-template-columns:1fr;} .quick-view-image {min-height:200px!important;padding:24px!important;} .quick-view-image img {max-height:200px!important;} }
`}</style>
        <div className="quick-view-layout">
          {/* Image Pane */}
          <div className="quick-view-image" style={{ minHeight: 360, backgroundColor: '#ffffff', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
            {product.mainImage && failedImage !== product.mainImage ? (
              <Image
                src={product.mainImage}
                alt={product.name}
                width={360}
                height={360}
                style={{ objectFit: 'contain', width: '100%', maxHeight: '360px' }}
                onError={() => setFailedImage(product.mainImage)}
                unoptimized
              />
            ) : (
              <div style={{ color: "var(--text-muted)", textAlign: "center" }}>Product image unavailable</div>
            )}
          </div>

          {/* Details Pane */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {product.brand} | {product.category}
            </span>

            <h3 id="quick-view-title" style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
              {product.name}
            </h3>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
              {price > 0 ? (
                <>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    AED {price.toLocaleString()}
                  </span>
                  {product.salePrice && product.salePrice > 0 && product.salePrice < product.regularPrice && (
                    <span style={{ fontSize: '0.95rem', textDecoration: 'line-through', color: 'var(--text-light)' }}>
                      AED {product.regularPrice.toLocaleString()}
                    </span>
                  )}
                </>
              ) : (
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                  Price on Inquiry
                </span>
              )}
            </div>

            <div className="quick-view-description" dangerouslySetInnerHTML={{ __html: productDescriptionHtml(product.shortDescription || product.fullDescription || '') }} />

            {/* Quick Specs */}
            {product.technicalSpecs && Object.keys(product.technicalSpecs).length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', padding: '12px', fontSize: '0.8rem', marginBottom: '20px' }}>
                {Object.entries(product.technicalSpecs).slice(0, 3).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>{key}:</span>
                    <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{val}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
              <button disabled={price <= 0} onClick={handleAddToCart} className="btn btn-primary" style={{ width: '100%' }}>
                <ShoppingBag size={18} />
                <span>{price > 0 ? "Add to Cart" : "Price available on enquiry"}</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                style={{ width: '100%' }}
              >
                <MessageCircle size={18} />
                <span>Order via WhatsApp</span>
              </a>

              <Link
                href={`/product/${product.slug}`}
                onClick={closeQuickView}
                style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginTop: '4px' }}
              >
                View Full Product Details & Manuals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
