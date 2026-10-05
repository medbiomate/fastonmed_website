'use client';

import sanitizeHtml from 'sanitize-html';

import React, { useEffect, useRef, useState } from 'react';
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
import { useLocale } from '@/lib/locale-context';
import { getEquivalentPath } from '@/lib/i18n';

interface ProductClientViewProps {
  product: Product;
  similarProducts: Product[];
}

export default function ProductClientView({ product, similarProducts }: ProductClientViewProps) {
  const { locale, isRtl, isArabic, localizeUrl, t } = useLocale();
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionLimit, setDescriptionLimit] = useState(220);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);

  useEffect(() => {
    setDescriptionExpanded(false);
    const image = imageFrameRef.current;
    const description = descriptionRef.current;
    if (!image || !description) return;
    const measure = () => {
      const imageRect = image.getBoundingClientRect();
      const descriptionRect = description.getBoundingClientRect();
      const sideBySide = descriptionRect.left >= imageRect.right || descriptionRect.right <= imageRect.left;
      const limit = sideBySide ? Math.max(120, imageRect.bottom - descriptionRect.top - 36) : 180;
      setDescriptionLimit(limit);
      setDescriptionOverflows(description.scrollHeight > limit + 2);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(image);
    observer.observe(description);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, [product.id, product.shortDescription, product.fullDescription]);

  const [quantity, setQuantity] = useState<number>(1);
  const initialImg = product.mainImage || (product.galleryImages && product.galleryImages[0]) || '';
  const [selectedImage, setSelectedImage] = useState<string>(initialImg);
  const [imageError, setImageError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'features' | 'faq'>('specs');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<boolean>(false);

  const { addToCart, isInWishlist, toggleWishlist } = useApp();

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const isFavorited = isInWishlist(product.id);

  const images = [...new Set([product.mainImage, ...(product.galleryImages || [])].filter((image): image is string => Boolean(image)))];

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

  const canonicalUrl = isArabic
    ? `https://www.fastonmed.com/ar/product/${product.slug}`
    : `https://www.fastonmed.com/product/${product.slug}`;
  const priceLine = price && price > 0
    ? (isArabic ? `السعر: ${price.toLocaleString()} درهم\n` : `Price: AED ${price.toLocaleString()}\n`)
    : '';
  const waOrderText = encodeURIComponent(
    isArabic
      ? `مرحباً فريق مبيعات فاستونميد،\nأود الاستفسار بخصوص شراء المنتج:\n*${product.name}*\nالرمز: ${product.sku}\n${priceLine}الرابط: ${canonicalUrl}`
      : `Hello FastonMed Sales Team,\nI would like to inquire about purchasing:\n*${product.name}*\nSKU: ${product.sku}\n${priceLine}Link: ${canonicalUrl}`
  );
  const waUrl = `https://wa.me/971508893589?text=${waOrderText}`;

  // Display only explicitly saved, non-empty specifications.
  const displaySpecs = Object.entries(product.technicalSpecs || {}).filter(([label, value]) => label.trim() && String(value ?? '').trim());

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingBottom: '70px' }}>
      {/* Toast Notification */}
      {addedToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: isArabic ? 'auto' : '24px',
            left: isArabic ? '24px' : 'auto',
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
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              {isArabic ? 'تمت إضافة المنتج إلى سلة المشتريات' : 'Added to Shopping Cart'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{quantity}x {product.name}</div>
          </div>
        </div>
      )}

      {/* Low-Profile Breadcrumbs Navigation (For SEO Hierarchy) */}
      <nav aria-label="Breadcrumbs" className="seo-breadcrumb" style={{ borderBottom: '1px solid #eef2f6', backgroundColor: '#fcfdfd', padding: '6px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.68rem', color: '#94a3b8', flexWrap: 'wrap', lineHeight: 1.2 }}>
          <Link href={localizeUrl('/')} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
            {t('common.home')}
          </Link>
          <ChevronRight size={10} color="#cbd5e1" className="rtl-flip" />
          <Link href={localizeUrl('/shop')} style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
            {isArabic ? 'المعدات والأجهزة الطبية' : 'Medical Equipment'}
          </Link>
          <ChevronRight size={10} color="#cbd5e1" className="rtl-flip" />
          <Link
            href={localizeUrl(`/product-category/${(product.category || 'medical-equipment').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`)}
            style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}
          >
            {product.category}
          </Link>
          <ChevronRight size={10} color="#cbd5e1" className="rtl-flip" />
          <span style={{ color: '#64748b', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px' }}>
            {product.name}
          </span>
        </div>
      </nav>

      {/* Main Product Showcase Section (Behind background: #f8fafc; Product card background: #ffffff) */}
      <section style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #eef2f6', padding: '36px 0 52px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'start' }}>

            {/* Left Column: Product Imagery */}
            <div className="fm-product-gallery-sticky">
              <div
                ref={imageFrameRef}
                className="fm-product-image-frame"
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 24px -2px rgba(15, 23, 42, 0.06)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px'
                }}
              >
                {selectedImage && !imageError ? (
                  <Image
                    src={selectedImage}
                    alt={
                      (selectedImage === product.mainImage ? product.imageAlt : product.galleryAlts?.[selectedImage])
                      || product.imageAlt
                      || product.name
                    }
                    fill
                    priority
                    unoptimized={selectedImage.startsWith('/uploads') || selectedImage.startsWith('data:') || selectedImage.startsWith('http')}
                    onError={() => setImageError(true)}
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
                  {product.brand || 'FastonMed Partner'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="fm-product-thumbnails" style={{ display: 'flex', gap: '12px', marginTop: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedImage(img);
                      setImageError(false);
                    }}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '8px',
                      border: selectedImage === img ? '2px solid #51b291' : '1px solid #e2e8f0',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                      padding: '4px',
                      cursor: 'pointer',
                      position: 'relative',
                      flexShrink: 0
                    }}
                  >
                    <Image
                      src={img}
                      alt={product.galleryAlts?.[img] || (img === product.mainImage ? product.imageAlt : null) || `${product.name} thumbnail ${idx + 1}`}
                      fill
                      unoptimized={img.startsWith('/uploads') || img.startsWith('data:') || img.startsWith('http')}
                      style={{ objectFit: 'contain' }}
                    />
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
                  <span>{copied ? (isArabic ? 'تم النسخ!' : 'Copied!') : (isArabic ? 'مشاركة' : 'Share')}</span>
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
                  <span>{isFavorited ? (isArabic ? 'محفوظة' : 'Saved') : (isArabic ? 'المفضلة' : 'Wishlist')}</span>
                </button>
              </div>
            </div>

            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '16px' }}>
              {product.name}
            </h1>

            {/* Price Block - Only shown when price > 0 */}
            {price > 0 && (
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '20px' }}>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: '#51b291' }}>
                  {isArabic ? `${price.toLocaleString()} درهم` : `AED ${price.toLocaleString()}`}
                </span>
                <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
                  {isArabic ? 'غير شامل 5% ضريبة القيمة المضافة' : 'Excl. 5% UAE VAT'}
                </span>
              </div>
            )}

            <div style={{ marginBottom: '28px' }}>
              <div
                id="product-summary-description"
                ref={descriptionRef}
                className="fm-product-rich-desc"
                style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.65, whiteSpace: 'pre-line', maxHeight: descriptionExpanded ? undefined : descriptionLimit, overflow: 'hidden' }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription || product.fullDescription || '') }}
              />
              {descriptionOverflows && <button
                type="button"
                aria-expanded={descriptionExpanded}
                aria-controls="product-summary-description"
                onClick={() => setDescriptionExpanded(expanded => !expanded)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, padding: 0, border: 0, background: 'transparent', color: '#287d63', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
              >
                {descriptionExpanded ? (isArabic ? 'عرض أقل' : 'Read less') : (isArabic ? 'اقرأ المزيد' : 'Read more')}
                {descriptionExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>}
            </div>

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
                <span>{isArabic ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
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
                <span>{isArabic ? 'استفسار عبر واتساب' : 'Inquire on WhatsApp'}</span>
              </a>
            </div>

            {/* UAE Biomedical Trust Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  {isArabic ? 'ضمان رسمي لمدة عام' : '1 Year Official Warranty'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  {isArabic ? 'توصيل سريع في كافة الإمارات' : 'Fast UAE Delivery'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Headphones size={20} color="#51b291" />
                <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b' }}>
                  {isArabic ? 'دعم فني وطبي حيوي معتمد' : 'Biomedical Support'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Detailed Information Tabs & Related Content */}
    <div className="container" style={{ paddingTop: '48px' }}>
      <div style={{ display: 'flex', gap: '28px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px', overflowX: 'auto' }}>
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isArabic ? 'المواصفات الفنية والهندسية' : 'Technical Specifications'}
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isArabic ? 'المميزات السريرية ودواعي الاستخدام' : 'Clinical Features & Indications'}
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
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {isArabic ? 'الامتثال في الإمارات والأسئلة الشائعة' : 'UAE Compliance & FAQs'}
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
              {/<[a-z][\s\S]*>/i.test(product.fullDescription || '') ? (
                <div
                  className="fm-product-rich-desc"
                  style={{ color: '#334155', lineHeight: 1.8, fontSize: '0.98rem', marginBottom: '24px', maxWidth: '850px' }}
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.fullDescription || '') }}
                />
              ) : (
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '0.98rem', marginBottom: '24px', maxWidth: '850px', whiteSpace: 'pre-line' }}>
                  {product.fullDescription || product.shortDescription}
                </p>
              )}

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
                    q: `Does ${product.name} include official warranty and technical support in UAE?`,
                    a: 'Yes. All medical equipment distributed by FastonMed includes official manufacturer warranty, biomedical inspection, and dedicated technical support across Dubai, Abu Dhabi, and the UAE.'
                  },
                  {
                    q: 'How does FastonMed handle warranty, maintenance, and calibration?',
                    a: 'FastonMed provides an official 1-year warranty on equipment. Our DIP-1, Dubai biomedical engineers provide preventative maintenance, calibration certificates, and 24-48 hour on-site technical support.'
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
                  {isArabic ? 'توصيات سريرية معتمدة' : 'Clinical Recommendations'}
                </span>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                  {isArabic ? `معدات طبية مماثلة في قسم ${product.category}` : `Similar Medical Equipment in ${product.category}`}
                </h2>
              </div>
              <Link
                href={localizeUrl(`/shop?category=${encodeURIComponent(product.category)}`)}
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
                <span>{isArabic ? `عرض كافة أجهزة ${product.category}` : `View Full ${product.category} Range`}</span>
                <ChevronRight size={16} style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }} />
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
                .hospital-rfq-banner {
                  padding: 28px 20px !important;
                }
              }
            `}</style>
          </section>
        )}

        {/* Hospital Bulk RFQ Consultation Banner */}
        <div
          className="hospital-rfq-banner"
          style={{
            marginTop: '64px',
            background: 'linear-gradient(135deg, #063d2f 0%, #005a3e 50%, #00875a 100%)',
            color: '#ffffff',
            borderRadius: '16px',
            padding: '42px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '28px',
            border: '1px solid rgba(167, 243, 208, 0.25)',
            boxShadow: '0 16px 40px -10px rgba(0, 61, 47, 0.35)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle Background Radial Glow */}
          <div
            style={{
              position: 'absolute',
              top: '-60px',
              right: isArabic ? 'auto' : '-40px',
              left: isArabic ? '-40px' : 'auto',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(167, 243, 208, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '720px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '5px 12px', borderRadius: '999px', marginBottom: '12px' }}>
              <Sparkles size={13} color="#a7f3d0" />
              <span style={{ color: '#a7f3d0', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {isArabic ? 'توريد المستشفيات والعيادات بالجملة' : 'Hospital & Clinic Bulk Procurement'}
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.75rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25,
                letterSpacing: '-0.02em',
                margin: '0 0 10px',
                fontFamily: 'inherit'
              }}
            >
              {isArabic ? 'هل تقوم بتجهيز عيادة أو قسم مستشفى أو وحدة عناية مركزة في الإمارات؟' : 'Equipping a clinic, hospital ward, or ICU in the UAE?'}
            </h3>

            <p style={{ color: '#e2e8f0', fontSize: '0.96rem', lineHeight: 1.6, margin: '0 0 16px', opacity: 0.95 }}>
              {isArabic
                ? 'تحدث مباشرة مع مكتب الهندسة الطبية الحيوية في فاستونميد بمجمع دبي للاستثمار (DIP-1) للحصول على باقات متكاملة، خصومات توريد للكميات، ودعم عقود صيانة دورية معتمد.'
                : 'Speak directly with FastonMed’s biomedical engineering desk in DIP-1, Dubai for turnkey department packages, institutional bulk discounts, and localized AMC support.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', fontSize: '0.80rem', fontWeight: 600, color: '#bbf7d0' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} strokeWidth={2.5} />
                <span>{isArabic ? 'جودة سريرية مضمونة 100%' : 'Clinical Quality Assured'}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} strokeWidth={2.5} />
                <span>{isArabic ? 'تسهيلات ائتمانية للمؤسسات والمناقصات' : 'Institutional Credit & Tender Terms'}</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={14} strokeWidth={2.5} />
                <span>{isArabic ? 'مهندسون طبيون معتمدون في دبي' : 'On-Site Dubai Biomedical Engineers'}</span>
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <a
              href={
                isArabic
                  ? 'https://wa.me/971508893589?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%20%D9%85%D8%A8%D9%8A%D8%B9%D8%A7%D8%AA%20%D9%81%D8%A7%D8%B3%D8%AA%D9%88%D9%86%D9%85%D9%8A%D8%AF%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%B7%D9%84%D8%A8%20%D8%B9%D8%B1%D8%B6%20%D8%A3%D8%B3%D8%B9%D8%A7%D8%B1%20%D8%AA%D8%AC%D8%A7%D8%B1%D9%8A%20%D9%84%D9%84%D9%85%D8%B9%D8%AF%D8%A7%D8%AA%20%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%A9.'
                  : 'https://wa.me/971508893589?text=Hello%20FastonMed%20Sales%2C%20I%20would%20like%20to%20request%20a%20commercial%20quotation%20for%20healthcare%20equipment.'
              }
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#ffffff',
                color: '#064e3b',
                padding: '15px 30px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.98rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.22)',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <MessageCircle size={18} color="#00875a" strokeWidth={2.5} />
              <span>{isArabic ? 'طلب عرض أسعار تجاري' : 'Request Commercial Quote'}</span>
              <ArrowRight size={16} strokeWidth={2.5} style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
