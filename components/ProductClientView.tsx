'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Headphones,
  MessageCircle,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
  Share2,
  FileText,
  Award,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product } from '@/lib/types';
import { useApp } from '@/lib/context';
import ProductCard from '@/components/ProductCard';

interface ProductClientViewProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductClientView({ product, similarProducts }: ProductClientViewProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage || '');
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'faq'>('specs');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const { addToCart, isInWishlist, toggleWishlist } = useApp();

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const isFavorited = isInWishlist(product.id);

  const images = (product.galleryImages && product.galleryImages.length > 0)
    ? product.galleryImages
    : product.mainImage
    ? [product.mainImage]
    : [];

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const canonicalUrl = `https://www.fastonmed.com/product/${product.slug}`;
  const waOrderText = encodeURIComponent(
    `Hello FastOnMed Sales Team,\nI would like to inquire about purchasing:\n*${product.name}*\nSKU: ${product.sku}\nPrice: AED ${price.toLocaleString()}\nLink: ${canonicalUrl}`
  );
  const waUrl = `https://wa.me/971508893589?text=${waOrderText}`;

  // Default clinical specs if not explicitly set
  const specs = Object.entries(product.technicalSpecs || {});
  const displaySpecs: [string, string][] = specs.length > 0 ? specs : [
    ['Product Category', product.category || 'Medical Equipment'],
    ['Brand / Manufacturer', product.brand || 'FastOnMed Partner'],
    ['SKU / Catalog ID', product.sku || 'N/A'],
    ['Regulatory Compliance', 'UAE MoHAP / DHA / DoH Certified'],
    ['Warranty', product.warrantyPeriod || '1 Year Biomedical Warranty'],
    ['Supply Voltage / Power', '220V - 240V / 50-60Hz (UAE Standard)'],
    ['Clinical Application', 'Hospital Inpatient, ICU, Clinic & Homecare'],
    ['After-Sales Service', 'FastOnMed Dubai Healthcare City Service Center']
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* Toast Notification */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '14px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#51b291', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={14} color="#ffffff" strokeWidth={3} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Added to Shopping Cart</div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{quantity}x {product.name}</div>
          </div>
        </div>
      )}

      {/* Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumbs" style={{ borderBottom: '1px solid #eef2f6', backgroundColor: '#fcfdfd', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link>
          <ChevronRight size={14} />
          <Link href="/shop" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>Medical Equipment</Link>
          <ChevronRight size={14} />
          <Link
            href={`/shop?category=${encodeURIComponent(product.category)}`}
            style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}
          >
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: '#0f172a', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="container" style={{ paddingTop: '36px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>

          {/* Left Column: Product Imagery */}
          <div>
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '1 / 1',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px'
              }}
            >
              {selectedImage ? (
                <Image
                  src={selectedImage}
                  alt={`${product.name} - FastOnMed Healthcare UAE`}
                  fill
                  priority
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <Layers size={48} strokeWidth={1.5} style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Medical Catalog Image</p>
                </div>
              )}

              {/* Badges */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    backgroundColor: '#e6f7f2',
                    color: '#1a775b',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {product.brand || 'FastOnMed Partner'}
                </span>
                <span
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}
                >
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      border: selectedImage === img ? '2px solid #51b291' : '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      padding: '4px',
                      cursor: 'pointer',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <Image src={img} alt={`Thumbnail ${idx + 1}`} fill style={{ objectFit: 'contain' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Pricing, Actions */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#51b291', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {product.category}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  aria-label="Share product"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Share2 size={13} />
                  <span>{copied ? 'Copied!' : 'Share'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Save to wishlist"
                  style={{
                    backgroundColor: isFavorited ? '#fef2f2' : '#f8fafc',
                    border: '1px solid',
                    borderColor: isFavorited ? '#fecaca' : '#e2e8f0',
                    color: isFavorited ? '#ef4444' : '#475569',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Heart size={13} fill={isFavorited ? '#ef4444' : 'none'} />
                  <span>{isFavorited ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '16px' }}>
              {product.name}
            </h1>

            {/* Price Block */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800, color: '#51b291' }}>
                AED {price.toLocaleString()}
              </span>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                Excl. 5% UAE VAT
              </span>
            </div>

            {/* Short Description */}
            <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.65, marginBottom: '28px' }}>
              {product.shortDescription || product.fullDescription}
            </p>

            {/* Quantity Selector & CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '32px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff'
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '42px',
                    height: '46px',
                    backgroundColor: '#f8fafc',
                    border: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  -
                </button>
                <span
                  style={{
                    width: '48px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#0f172a'
                  }}
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '42px',
                    height: '46px',
                    backgroundColor: '#f8fafc',
                    border: 'none',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: '#0f172a',
                    cursor: 'pointer'
                  }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                type="button"
                onClick={handleAddToCart}
                style={{
                  flex: '1 1 200px',
                  height: '48px',
                  backgroundColor: '#51b291',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(81, 178, 145, 0.4)',
                  transition: 'background-color 0.2s'
                }}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              {/* Direct WhatsApp Consultation */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: '1 1 200px',
                  height: '48px',
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                }}
              >
                <MessageCircle size={18} />
                <span>Inquire on WhatsApp</span>
              </a>
            </div>

            {/* UAE Biomedical Trust Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  1 Year Official Warranty
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  Fast UAE Delivery
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Headphones size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  Biomedical Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div style={{ marginTop: '56px', borderTop: '1px solid #e2e8f0', paddingTop: '40px' }}>
          <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'specs' ? '3px solid #51b291' : '3px solid transparent',
                paddingBottom: '12px',
                fontWeight: 700,
                fontSize: '1.02rem',
                color: activeTab === 'specs' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Technical Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('features')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'features' ? '3px solid #51b291' : '3px solid transparent',
                paddingBottom: '12px',
                fontWeight: 700,
                fontSize: '1.02rem',
                color: activeTab === 'features' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Clinical Features & Indications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('faq')}
              style={{
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'faq' ? '3px solid #51b291' : '3px solid transparent',
                paddingBottom: '12px',
                fontWeight: 700,
                fontSize: '1.02rem',
                color: activeTab === 'faq' ? '#0f172a' : '#64748b',
                cursor: 'pointer'
              }}
            >
              UAE Compliance & FAQs
            </button>
          </div>

          {/* Tab 1: Specifications */}
          {activeTab === 'specs' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                Technical & Engineering Specifications
              </h2>
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  maxWidth: '850px'
                }}
              >
                {displaySpecs.map(([key, val], idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 2fr',
                      padding: '14px 20px',
                      backgroundColor: idx % 2 === 0 ? '#f8fafc' : '#ffffff',
                      borderBottom: idx === displaySpecs.length - 1 ? 'none' : '1px solid #f1f5f9'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#475569', fontSize: '0.92rem' }}>{key}</span>
                    <span style={{ fontWeight: 500, color: '#0f172a', fontSize: '0.92rem' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Clinical Features & Indications */}
          {activeTab === 'features' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                Clinical Performance & Indications
              </h2>
              <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '24px', maxWidth: '850px' }}>
                {product.fullDescription || product.shortDescription}
              </p>

              <div style={{ maxWidth: '850px', marginTop: '20px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                  Standard Clinical Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                  {(product.features && product.features.length > 0 ? product.features : [
                    'Pressure redistribution matrix designed for patient ulcer prevention',
                    'Antimicrobial, wipe-down liquid-resistant medical cover',
                    'Ultra-quiet power compression pump with customizable cycle times',
                    'Audible and visual low-pressure alarms for clinical safety'
                  ]).map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #eef2f6'
                      }}
                    >
                      <Check size={16} color="#51b291" strokeWidth={2.5} />
                      <span style={{ fontSize: '0.92rem', color: '#1e293b', fontWeight: 500 }}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: FAQs Accordion */}
          {activeTab === 'faq' && (
            <div style={{ maxWidth: '850px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
                Frequently Asked Procurement Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    q: `Is ${product.name} approved by UAE Ministry of Health (MoHAP)?`,
                    a: 'Yes. All medical equipment distributed by FastOnMed is compliant with UAE MoHAP, Dubai Health Authority (DHA), and Department of Health (DoH Abu Dhabi) standards for hospital and clinical installation.'
                  },
                  {
                    q: 'How does FastOnMed handle warranty, maintenance, and calibration?',
                    a: 'FastOnMed provides an official 1-year warranty on equipment. Our Dubai Healthcare City biomedical engineers provide preventative maintenance, calibration certificates, and 24-48 hour on-site technical support.'
                  },
                  {
                    q: 'What is the delivery timeline for orders across the UAE?',
                    a: 'Stocked medical items are delivered within 24 to 48 hours across Dubai, Abu Dhabi, Sharjah, Ajman, and all northern Emirates with dedicated medical logistics handling.'
                  },
                  {
                    q: 'Can medical institutions request corporate tax invoices with 5% VAT?',
                    a: 'Yes, full corporate VAT invoices conforming to UAE Federal Tax Authority (FTA) guidelines are automatically issued with our registered TRN tax number.'
                  }
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        backgroundColor: openFaq === idx ? '#f1f5f9' : '#f8fafc',
                        border: 'none',
                        textAlign: 'left',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer'
                      }}
                    >
                      <span>{faq.q}</span>
                      {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openFaq === idx && (
                      <div
                        style={{
                          padding: '18px 20px',
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          fontSize: '0.93rem',
                          lineHeight: 1.65,
                          borderTop: '1px solid #e2e8f0'
                        }}
                      >
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Similar & Related Medical Equipment Section */}
        {similarProducts.length > 0 && (
          <section style={{ marginTop: '64px', borderTop: '1px solid #e2e8f0', paddingTop: '48px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: '28px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <span
                  style={{
                    color: '#51b291',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  Clinical Recommendations
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                  Similar Medical Equipment in {product.category}
                </h2>
              </div>
              <Link
                href={`/shop?category=${encodeURIComponent(product.category)}`}
                style={{
                  color: '#51b291',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none'
                }}
              >
                <span>View Full {product.category} Range</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            <div
              className="similar-product-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px'
              }}
            >
              {similarProducts.map(item => (
                <ProductCard key={item.id} product={item} showActions />
              ))}
            </div>

            <style>{`
              @media (max-width: 768px) {
                .similar-product-grid {
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 12px !important;
                }
              }
            `}</style>
          </section>
        )}

        {/* Hospital Bulk RFQ Consultation Banner */}
        <div
          style={{
            marginTop: '64px',
            background: 'linear-gradient(135deg, #0b1e1b 0%, #17483c 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px',
            border: '1px solid rgba(81, 178, 145, 0.3)',
            boxShadow: '0 10px 30px rgba(11, 30, 27, 0.15)'
          }}
        >
          <div>
            <span style={{ color: '#a7e4cf', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Hospital & Clinic Bulk Procurement
            </span>
            <h3 style={{ fontSize: '1.55rem', fontWeight: 800, margin: '6px 0 8px' }}>
              Equipping a clinic, hospital ward, or ICU in the UAE?
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '640px', lineHeight: 1.55, margin: 0 }}>
              Speak with FastOnMed’s biomedical consultants in Dubai Healthcare City for turnkey clinical packages, discounted institutional procurement, and localized AMC maintenance.
            </p>
          </div>

          <a
            href="https://wa.me/971508893589?text=Hello%20FastOnMed%20Sales%2C%20I%20would%20like%20to%20request%20a%20commercial%20quotation%20for%20healthcare%20equipment."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#51b291',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(81, 178, 145, 0.4)'
            }}
          >
            <span>Request Commercial Quote</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
