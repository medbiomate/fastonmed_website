'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, MessageCircle, FileText, Check } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useApp();
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;

  const handleAddToCart = () => {
    addToCart(product, 1);
    closeQuickView();
  };

  const waText = encodeURIComponent(
    `Hello FastOnMed Sales, I would like to inquire about: ${product.name} (SKU: ${product.sku}) https://www.fastonmed.com/product/${product.slug}`
  );
  const waUrl = `https://wa.me/971508893589?text=${waText}`;

  return (
    <div className="modal-overlay" onClick={closeQuickView}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <button
            onClick={closeQuickView}
            style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2" style={{ gap: 0 }}>
          {/* Image Pane */}
          <div style={{ backgroundColor: '#ffffff', padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)' }}>
            {product.mainImage ? (
              <Image
                src={product.mainImage}
                alt={product.name}
                width={360}
                height={360}
                style={{ objectFit: 'contain', width: '100%', maxHeight: '360px' }}
                unoptimized
              />
            ) : (
              <div>No Image Available</div>
            )}
          </div>

          {/* Details Pane */}
          <div style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
              {product.brand} | {product.category}
            </span>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
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

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '20px' }}>
              {product.shortDescription}
            </p>

            {/* Quick Specs */}
            {product.technicalSpecs && (
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
              <button onClick={handleAddToCart} className="btn btn-primary" style={{ width: '100%' }}>
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
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
