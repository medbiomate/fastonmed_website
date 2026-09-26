'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star
} from 'lucide-react';
import type { Product } from '@/lib/types';
import type { FAQItem } from '@/lib/editorial-pages';

export type CategoryItem = {
  name: string;
  slug: string;
  image: string;
};

export type IndustryItem = {
  title: string;
  subtitle: string;
  image: string;
};

export type BrandPartner = {
  name: string;
  image: string;
};

interface EditorialPageClientProps {
  slug: string;
  title: string;
  categories: CategoryItem[];
  featuredProducts: Product[];
  industries: IndustryItem[];
  partners: BrandPartner[];
  faqs: FAQItem[];
}

export default function EditorialPageClient({
  slug,
  title,
  categories,
  featuredProducts,
  industries,
  partners,
  faqs,
}: EditorialPageClientProps) {
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Consultation form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formClinic, setFormClinic] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim() || !formPhone.trim() || !formMessage.trim()) {
      setErrorMessage('Please fill in your name, email, phone number, and message.');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          phone: formPhone,
          clinicName: formClinic,
          message: `[Page: ${title}]\n${formMessage}`,
          productName: title,
        }),
      });

      const data = await response.json();
      if (response.ok && data?.success) {
        setSubmitStatus('success');
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormClinic('');
        setFormMessage('');
      } else {
        setSubmitStatus('error');
        setErrorMessage(data?.error || 'Could not submit your enquiry. Please contact us via WhatsApp.');
      }
    } catch {
      setSubmitStatus('error');
      setErrorMessage('A network error occurred. Please try contacting us via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    const el = document.getElementById('category-scroll-container');
    if (el) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ color: '#0f172a' }}>
      {/* 1. PRODUCT CATEGORIES STRIP */}
      {categories.length > 0 && (
        <section
          style={{
            padding: '48px 0 32px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edf2f0',
          }}
        >
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                    fontWeight: 800,
                    color: '#0f2923',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  Product Categories
                </h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                  Explore comprehensive medical, surgical, and dental equipment solutions
                </p>
              </div>

              {/* Navigation arrows for categories */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => scrollCategories('left')}
                  aria-label="Scroll categories left"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid #d1ded9',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#134e4a',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => scrollCategories('right')}
                  aria-label="Scroll categories right"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: '1px solid #d1ded9',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#134e4a',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable category list */}
            <div
              id="category-scroll-container"
              style={{
                display: 'flex',
                gap: 16,
                overflowX: 'auto',
                paddingBottom: 16,
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 transparent',
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group"
                  style={{
                    flex: '0 0 160px',
                    textDecoration: 'none',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 16,
                      overflow: 'hidden',
                      position: 'relative',
                      backgroundColor: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="160px"
                      style={{
                        objectFit: 'cover',
                        transition: 'transform 0.3s ease',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#134e4a',
                      lineHeight: 1.25,
                      minHeight: '2.5em',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cat.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. FEATURED EQUIPMENT SHOWCASE */}
      {featuredProducts.length > 0 && (
        <section
          id="featured-equipment"
          style={{
            padding: '56px 0 64px',
            backgroundColor: '#f8faf9',
            borderBottom: '1px solid #e2ebe7',
          }}
        >
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: 20,
                  backgroundColor: '#e6f4ea',
                  color: '#1b7a54',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 8,
                }}
              >
                In-Stock Across UAE
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '4px 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                {slug.includes('dental') ? 'Featured Dental Equipment' : `Featured ${title} Solutions`}
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                High-grade clinical instruments, certified consumables, and equipment available with immediate UAE-wide delivery and warranty support.
              </p>
            </div>

            {/* Products Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 22,
              }}
            >
              {featuredProducts.map((product) => {
                const price =
                  product.salePrice && product.salePrice > 0
                    ? product.salePrice
                    : product.regularPrice;
                const hasDiscount =
                  product.salePrice &&
                  product.salePrice > 0 &&
                  product.salePrice < product.regularPrice;

                // Prefilled WhatsApp link
                const waMessage = encodeURIComponent(
                  `Hello FastOnMed Sales Team,\nI would like to inquire/purchase:\n*${product.name}*\nPrice: ${
                    price && price > 0 ? `AED ${price.toLocaleString()}` : 'Contact for Price'
                  }\nURL: https://www.fastonmed.com/product/${product.slug}\n\nThank you!`
                );
                const waLink = `https://wa.me/971508893589?text=${waMessage}`;

                return (
                  <div
                    key={product.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        paddingTop: '92%',
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #f1f5f9',
                      }}
                    >
                      <Link href={`/product/${product.slug}`}>
                        <Image
                          src={product.mainImage || '/products/dental-chair.jpg'}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 280px"
                          style={{ objectFit: 'contain', padding: 12 }}
                        />
                      </Link>
                      {hasDiscount && (
                        <span
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: 6,
                          }}
                        >
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                      }}
                    >
                      {/* Rating */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          marginBottom: 6,
                        }}
                      >
                        <div style={{ display: 'flex', color: '#f59e0b' }}>
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          (5.0)
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          lineHeight: 1.35,
                          margin: '0 0 8px',
                          minHeight: '2.7em',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        <Link
                          href={`/product/${product.slug}`}
                          style={{
                            color: '#0f2923',
                            textDecoration: 'none',
                          }}
                        >
                          {product.name}
                        </Link>
                      </h3>

                      {/* Price */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 8,
                          marginBottom: 10,
                        }}
                      >
                        {price && price > 0 ? (
                          <>
                            <span
                              style={{
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                color: '#134e4a',
                              }}
                            >
                              {price.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>AED</span>
                            </span>
                            {hasDiscount && (
                              <span
                                style={{
                                  fontSize: '0.85rem',
                                  color: '#94a3b8',
                                  textDecoration: 'line-through',
                                }}
                              >
                                {product.regularPrice.toLocaleString()} AED
                              </span>
                            )}
                          </>
                        ) : (
                          <span
                            style={{
                              fontSize: '0.88rem',
                              fontWeight: 700,
                              color: '#2563eb',
                            }}
                          >
                            Price on Request
                          </span>
                        )}
                      </div>

                      {/* Description excerpt */}
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          lineHeight: 1.45,
                          margin: '0 0 16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {product.shortDescription || product.fullDescription?.slice(0, 100) || 'Genuine medical device certified for UAE healthcare institutions.'}
                      </p>

                      {/* Buttons */}
                      <div
                        style={{
                          marginTop: 'auto',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                        }}
                      >
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            padding: '9px 14px',
                            backgroundColor: '#25D366',
                            color: '#ffffff',
                            borderRadius: 8,
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                            transition: 'background-color 0.2s',
                          }}
                        >
                          <MessageCircle size={16} />
                          Buy via WhatsApp
                        </a>

                        <Link
                          href={`/product/${product.slug}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '7px 12px',
                            backgroundColor: '#f1f5f9',
                            color: '#334155',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All in Catalog CTA */}
            <div style={{ textAlign: 'center', marginTop: 36 }}>
              <Link
                href="/shop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  backgroundColor: '#134e4a',
                  color: '#ffffff',
                  borderRadius: 30,
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'background-color 0.2s',
                }}
              >
                Browse All Products in Shop
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. WHO WE SERVE / HEALTHCARE INDUSTRIES WE SUPPORT */}
      {industries.length > 0 && (
        <section
          style={{
            padding: '64px 0',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edf2f0',
          }}
        >
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 42px' }}>
              <span
                style={{
                  display: 'inline-block',
                  color: '#1b7a54',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  marginBottom: 6,
                }}
              >
                Who We Serve
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em',
                }}
              >
                Healthcare Industries We Support
              </h2>
              <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                From large multi-specialty hospitals to home healthcare providers, our equipment solutions are tailored for every healthcare setting.
              </p>
            </div>

            {/* 6 Industry Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 22,
              }}
            >
              {industries.map((ind) => (
                <div
                  key={ind.title}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 14,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: 180, backgroundColor: '#f1f5f9' }}>
                    <Image
                      src={ind.image}
                      alt={ind.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <h3
                      style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#0f2923',
                        margin: '0 0 4px',
                      }}
                    >
                      {ind.title}
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                      {ind.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. BRAND PARTNERS */}
      {partners.length > 0 && (
        <section
          style={{
            padding: '50px 0',
            backgroundColor: '#f8faf9',
            borderBottom: '1px solid #e5ede9',
          }}
        >
          <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '0 0 8px',
                }}
              >
                Reliable Partner in Healthcare Infrastructure
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0 }}>
                Authorized distribution and service partner for certified global healthcare manufacturers
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 28,
              }}
            >
              {partners.map((partner, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 10,
                    padding: '12px 24px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 70,
                    minWidth: 140,
                  }}
                >
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={110}
                    height={48}
                    style={{ objectFit: 'contain', maxHeight: 44 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. INTERACTIVE FAQS ACCORDION */}
      {faqs.length > 0 && (
        <section
          id="faqs"
          style={{
            padding: '64px 0',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edf2f0',
          }}
        >
          <div className="container" style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <span
                style={{
                  display: 'inline-block',
                  color: '#1b7a54',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                Answers & Insights
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '0 0 8px',
                  letterSpacing: '-0.02em',
                }}
              >
                Frequently Asked Questions
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', margin: 0 }}>
                Find answers regarding procurement, clinical certification, installation, and after-sales support across Dubai and the UAE.
              </p>
            </div>

            {/* Accordion list */}
            <div style={{ display: 'grid', gap: 14 }}>
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    style={{
                      borderRadius: 12,
                      border: `1px solid ${isOpen ? '#a7d9c6' : '#e2e8f0'}`,
                      backgroundColor: isOpen ? '#fcfdfd' : '#ffffff',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: isOpen ? '0 4px 16px rgba(19, 78, 74, 0.05)' : 'none',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      style={{
                        width: '100%',
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        background: 'none',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: isOpen ? '#134e4a' : '#1e293b',
                      }}
                    >
                      <span>{faq.question}</span>
                      <span
                        style={{
                          flexShrink: 0,
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          backgroundColor: isOpen ? '#e6f4ea' : '#f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isOpen ? '#1b7a54' : '#64748b',
                        }}
                      >
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div
                        style={{
                          padding: '0 22px 20px',
                          color: '#475569',
                          fontSize: '0.92rem',
                          lineHeight: 1.7,
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: 14,
                        }}
                      >
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 6. GET IN TOUCH & GOOGLE MAPS SECTION */}
      <section
        id="contact"
        style={{
          padding: '64px 0 80px',
          backgroundColor: '#f8faf9',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: 32,
              alignItems: 'start',
            }}
          >
            {/* Left: Office Information & Map */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: '32px',
                border: '1px solid #e2ebe7',
                boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  color: '#1b7a54',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                Dubai Location & Support
              </span>
              <h3
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '0 0 16px',
                }}
              >
                Our Dubai Office
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24 }}>
                FastOnMed supplies and maintains medical & dental installations across all seven Emirates with on-site biomedical technical support.
              </p>

              {/* Map embed */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 220,
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 24,
                  border: '1px solid #e2e8f0',
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Fastonmed%20Dubai&t=m&z=11&output=embed&iwloc=near"
                  title="Fastonmed Dubai Location"
                  aria-label="Fastonmed Dubai Location"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>

              {/* Contact Details Grid */}
              <div style={{ display: 'grid', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: '#e6f4ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1b7a54',
                      flexShrink: 0,
                    }}
                  >
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Address</div>
                    <div style={{ fontSize: '0.92rem', color: '#0f2923', fontWeight: 700 }}>
                      Dubai, United Arab Emirates
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: '#e6f4ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1b7a54',
                      flexShrink: 0,
                    }}
                  >
                    <Phone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Direct Call / WhatsApp</div>
                    <div style={{ fontSize: '0.92rem', color: '#0f2923', fontWeight: 700 }}>
                      +971 50 889 3586 / +971 50 889 3589
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: '#e6f4ea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1b7a54',
                      flexShrink: 0,
                    }}
                  >
                    <Mail size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Email</div>
                    <div style={{ fontSize: '0.92rem', color: '#0f2923', fontWeight: 700 }}>
                      sales@fastonmed.com
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Get in Touch Form */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: '32px',
                border: '1px solid #e2ebe7',
                boxShadow: '0 4px 18px rgba(0,0,0,0.03)',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  color: '#1b7a54',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 6,
                }}
              >
                Inquiry & Consultation
              </span>
              <h3
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#0f2923',
                  margin: '0 0 10px',
                }}
              >
                Get in Touch
              </h3>
              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 24 }}>
                Looking for reliable dental or medical equipment or expert guidance? Complete the form below, and our biomedical specialist team will assist you promptly.
              </p>

              {submitStatus === 'success' ? (
                <div
                  style={{
                    padding: '24px',
                    borderRadius: 12,
                    backgroundColor: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    textAlign: 'center',
                  }}
                >
                  <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px' }} />
                  <h4 style={{ margin: '0 0 6px', color: '#065f46', fontSize: '1.1rem' }}>
                    Thank you! We received your enquiry.
                  </h4>
                  <p style={{ margin: '0 0 16px', color: '#047857', fontSize: '0.88rem' }}>
                    A FastOnMed healthcare equipment specialist will get back to you within 2 business hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitStatus('idle')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: 8,
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} style={{ display: 'grid', gap: 16 }}>
                  {submitStatus === 'error' && (
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: 8,
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#991b1b',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#334155',
                          marginBottom: 4,
                        }}
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Dr. / Mr. / Ms."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#334155',
                          marginBottom: 4,
                        }}
                      >
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="+971 50 ..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#334155',
                          marginBottom: 4,
                        }}
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formEmail}
                        onChange={(e) => setFormEmail(e.target.value)}
                        placeholder="doctor@clinic.ae"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: '#334155',
                          marginBottom: 4,
                        }}
                      >
                        Clinic / Healthcare Facility
                      </label>
                      <input
                        type="text"
                        value={formClinic}
                        onChange={(e) => setFormClinic(e.target.value)}
                        placeholder="Facility or Hospital Name"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 8,
                          border: '1px solid #cbd5e1',
                          fontSize: '0.88rem',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#334155',
                        marginBottom: 4,
                      }}
                    >
                      Equipment Requirements / Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Please mention the equipment, model, or setup service you require..."
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        borderRadius: 8,
                        backgroundColor: '#134e4a',
                        color: '#ffffff',
                        border: 'none',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        opacity: isSubmitting ? 0.7 : 1,
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <Send size={16} />
                      {isSubmitting ? 'Sending Request...' : 'Send Consultation Request'}
                    </button>

                    <a
                      href={`https://wa.me/971508893589?text=${encodeURIComponent(
                        `Hello FastOnMed, I am reaching out from ${title} page to request an equipment consultation.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Quick WhatsApp Enquiry"
                      style={{
                        padding: '12px 18px',
                        borderRadius: 8,
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={18} />
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
