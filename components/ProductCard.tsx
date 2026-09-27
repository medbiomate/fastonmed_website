'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Heart, Eye, MessageCircle, Star, ImageOff } from 'lucide-react';
import { Product } from '@/lib/types';
import { useApp } from '@/lib/context';

interface ProductCardProps {
  product: Product;
  showActions?: boolean;
}

export default function ProductCard({ product, showActions = false }: ProductCardProps) {
  const { addToCart, isInWishlist, toggleWishlist, openQuickView } = useApp();

  const isFavorited = isInWishlist(product.id);
  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const hasDiscount = product.salePrice && product.salePrice > 0 && product.salePrice < product.regularPrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100)
    : 0;

  // WhatsApp prefilled message for direct enquiry
  const priceLine = price && price > 0 ? `Price: AED ${price.toLocaleString()}\n` : '';
  const waText = encodeURIComponent(
    `Hello FastOnMed Sales Team,\nI would like to make an enquiry regarding:\n*${product.name}*\nSKU: ${product.sku || product.id}\n${priceLine}https://www.fastonmed.com/product/${product.slug}`
  );
  const waUrl = `https://wa.me/971508893589?text=${waText}`;

  const hasReviews = (product.reviewCount || 0) > 0 && (product.rating || 0) > 0;

  return (
    <div
      className="product-card group"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e8ecf1',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'all 0.25s ease',
        position: 'relative'
      }}
    >
      <style>{`
        .product-card:hover {
          box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.09);
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }
        .product-card:hover .product-img {
          transform: scale(1.05);
        }
        .product-card .hover-actions {
          opacity: 0;
          transform: translateY(6px);
          transition: all 0.2s ease;
        }
        .product-card:hover .hover-actions {
          opacity: 1;
          transform: translateY(0);
        }
        .product-card .direct-enquiry-btn {
          background-color: #25d366;
          color: #ffffff;
          transition: all 0.2s ease;
        }
        .product-card .direct-enquiry-btn:hover {
          background-color: #20ba5a;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
        }
        .product-card .quick-view-btn {
          display: flex;
        }
        @media (max-width: 768px) {
          .product-card .hover-actions {
            opacity: 1 !important;
            transform: none !important;
          }
          .product-card .quick-view-btn {
            display: none !important;
          }
          .product-card .wishlist-btn {
            width: 30px !important;
            height: 30px !important;
          }
        }
      `}</style>

      {/* 1. Image Thumbnail & Quick Badges */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          maxHeight: '185px',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          borderBottom: '1px solid #f1f5f9'
        }}
      >
        <Link
          href={`/product/${product.slug}`}
          style={{ position: 'relative', width: '100%', height: '100%', display: 'block' }}
        >
          {product.mainImage ? (
            <Image
              src={product.mainImage}
              alt={product.name}
              fill
              className="product-img"
              style={{
                objectFit: 'contain',
                transition: 'transform 0.35s ease'
              }}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 600 }}>
              <ImageOff size={30} strokeWidth={1.5} />
              <span>Image unavailable</span>
            </div>
          )}
        </Link>

        {/* Badges (Discount / Hot) */}
        <div style={{ position: 'absolute', top: '7px', left: '7px', display: 'flex', flexDirection: 'column', gap: '4px', zIndex: 2 }}>
          {hasDiscount && (
            <span
              style={{
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '2px 6px',
                borderRadius: '9999px',
                letterSpacing: '0.02em',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.25)'
              }}
            >
              -{discountPercent}%
            </span>
          )}
          {product.isBestSeller && !hasDiscount && (
            <span
              style={{
                backgroundColor: '#10b981',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '9999px'
              }}
            >
              HOT
            </span>
          )}
        </div>

        {/* Floating Icons (Wishlist & Quick View) */}
        <div
          className="hover-actions"
          style={{
            position: 'absolute',
            top: '7px',
            right: '7px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            zIndex: 3
          }}
        >
          <button
            onClick={() => toggleWishlist(product.id)}
            className="wishlist-btn"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
              color: isFavorited ? '#ef4444' : '#64748b',
              transition: 'all 0.15s ease'
            }}
            title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart size={14} fill={isFavorited ? '#ef4444' : 'none'} />
          </button>

          <button
            onClick={() => openQuickView(product)}
            className="quick-view-btn"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
              color: '#64748b',
              transition: 'all 0.15s ease'
            }}
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye size={14} />
          </button>
        </div>
      </div>

      {/* 2. Content Info */}
      <div style={{ padding: '10px 10px 12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Brand / Stock Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '4px' }}>
          <span
            style={{
              fontSize: '0.64rem',
              fontWeight: 700,
              color: 'var(--primary, #51b291)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {product.brand || product.category || 'MEDICAL'}
          </span>

          {hasReviews ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Star size={11} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: '0.66rem', fontWeight: 700, color: '#0f172a' }}>
                {product.rating?.toFixed(1)}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontSize: '0.64rem',
                fontWeight: 600,
                color: '#10b981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              In Stock
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: '6px',
            minHeight: '2.5em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          <Link
            href={`/product/${product.slug}`}
            style={{ color: '#0f172a', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            {product.name}
          </Link>
        </h3>

        {/* Price Display: Guaranteed Single Line per unit - Only shown when price > 0 */}
        {price > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '6px',
              flexWrap: 'wrap',
              marginTop: 'auto',
              marginBottom: showActions ? '8px' : '2px'
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: 'var(--primary, #51b291)',
                  marginRight: '3px'
                }}
              >
                AED
              </span>
              <span
                style={{
                  fontSize: '0.96rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.01em'
                }}
              >
                {price.toLocaleString()}
              </span>
            </div>

            {hasDiscount && (
              <span
                style={{
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  textDecoration: 'line-through',
                  whiteSpace: 'nowrap'
                }}
              >
                AED {product.regularPrice.toLocaleString()}
              </span>
            )}
          </div>
        )}

        {/* Direct Enquiry Button (Goes directly to WhatsApp) */}
        {showActions && (
          <div style={{ marginTop: 'auto' }}>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="direct-enquiry-btn"
              style={{
                width: '100%',
                height: '35px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.28)'
              }}
              title={`Direct enquiry for ${product.name} on WhatsApp`}
            >
              <MessageCircle size={15} strokeWidth={2.5} />
              <span>Direct Enquiry</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
