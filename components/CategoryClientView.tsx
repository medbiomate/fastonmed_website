'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  Award,
  FileCheck2,
  Search,
  X,
  ArrowUpDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Building2,
  Layers
} from 'lucide-react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { resolveSpecialtyConfig, OTHER_SPECIALTIES_LIST } from '@/lib/category-definitions';

interface CategoryClientViewProps {
  categoryTitle: string;
  categorySlug: string;
  initialProducts: Product[];
}

const ITEMS_PER_PAGE = 24;

export default function CategoryClientView({
  categoryTitle,
  categorySlug,
  initialProducts
}: CategoryClientViewProps) {
  const specialtyConfig = resolveSpecialtyConfig(categorySlug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const gridTopRef = useRef<HTMLDivElement>(null);

  // Subcategory filter counts
  const subcategoryCounts = useMemo(() => {
    if (!specialtyConfig?.subcategories) return {};
    const counts: Record<string, number> = {};
    for (const sub of specialtyConfig.subcategories) {
      if (sub.id === 'all') {
        counts['all'] = initialProducts.length;
      } else {
        counts[sub.id] = initialProducts.filter((p) =>
          sub.matches(p.category || '', p.name || '')
        ).length;
      }
    }
    return counts;
  }, [specialtyConfig, initialProducts]);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // 1. Subcategory filter
    if (selectedSubcategory !== 'all' && specialtyConfig?.subcategories) {
      const activeSub = specialtyConfig.subcategories.find((s) => s.id === selectedSubcategory);
      if (activeSub) {
        list = list.filter((p) => activeSub.matches(p.category || '', p.name || ''));
      }
    }

    // 2. In-category search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.shortDescription && p.shortDescription.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // 3. Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => {
        const pA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.regularPrice;
        const pB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.regularPrice;
        return pA - pB;
      });
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => {
        const pA = a.salePrice && a.salePrice > 0 ? a.salePrice : a.regularPrice;
        const pB = b.salePrice && b.salePrice > 0 ? b.salePrice : b.regularPrice;
        return pB - pA;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }, [initialProducts, selectedSubcategory, specialtyConfig, searchQuery, sortBy]);

  // Pagination calculation
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const otherSpecialties = OTHER_SPECIALTIES_LIST.filter(
    (item) => item.slug !== categorySlug && !specialtyConfig?.aliases.includes(item.slug)
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* 1. Category Hero Banner */}
      <section
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '36px 0 44px',
          position: 'relative'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          {/* Low-Profile Breadcrumbs (For SEO Hierarchy) */}
          <nav
            aria-label="Breadcrumb"
            className="seo-breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.68rem',
              color: '#94a3b8',
              marginBottom: '10px',
              lineHeight: 1.2
            }}
          >
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
              Home
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <Link href="/shop" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
              Specialties
            </Link>
            <span style={{ color: '#cbd5e1' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: 500 }}>{categoryTitle}</span>
          </nav>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: specialtyConfig?.illustration ? '1fr 300px' : '1fr',
              gap: '36px',
              alignItems: 'center'
            }}
            className="category-hero-grid"
          >
            {/* Left Column: Heading & Trust Badges */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  marginBottom: '14px'
                }}
              >
                <ShieldCheck size={14} />
                <span>{specialtyConfig?.badge || 'OFFICIAL UAE CLINICAL CATALOG'}</span>
              </div>

              <h1
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.2,
                  margin: '0 0 10px',
                  letterSpacing: '-0.02em'
                }}
                className="category-main-title"
              >
                {categoryTitle}
              </h1>

              {specialtyConfig?.subtitle && (
                <p
                  style={{
                    fontSize: '1.1rem',
                    color: '#00875a',
                    fontWeight: 700,
                    margin: '0 0 14px',
                    lineHeight: 1.4
                  }}
                >
                  {specialtyConfig.subtitle}
                </p>
              )}

              <p
                style={{
                  fontSize: '0.96rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  maxWidth: '740px',
                  margin: '0 0 24px'
                }}
              >
                {specialtyConfig?.description ||
                  `Certified ${categoryTitle} supplied by FastonMed across Dubai, Abu Dhabi, and Northern Emirates. 100% compliant with UAE MoHAP and DHA medical device regulations with manufacturer warranty.`}
              </p>

              {/* 4 Trust Highlights */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '12px',
                  paddingTop: '6px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Award size={16} color="#00875a" />
                  <span>Official Warranty & Service</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontSize: '0.82rem', fontWeight: 600 }}>
                  <FileCheck2 size={16} color="#00875a" />
                  <span>MoHAP / DHA Compliant</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Truck size={16} color="#00875a" />
                  <span>Fast Delivery Across UAE</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontSize: '0.82rem', fontWeight: 600 }}>
                  <Building2 size={16} color="#00875a" />
                  <span>Hospital & Clinic RFQ</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual Specialty Badge Card */}
            {specialtyConfig?.illustration && (
              <div
                className="category-hero-illustration-box"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div
                  style={{
                    width: '140px',
                    height: '140px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    marginBottom: '16px',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <img
                    src={specialtyConfig.illustration}
                    alt={categoryTitle}
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div
                  style={{
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    marginBottom: '8px'
                  }}
                >
                  {initialProducts.length} Certified Models
                </div>
                <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                  Supplied in UAE by FastonMed
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Interactive Controls & Products Catalog */}
      <section style={{ padding: '36px 0 80px' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }} ref={gridTopRef}>
          {/* Subcategory Pills */}
          {specialtyConfig?.subcategories && specialtyConfig.subcategories.length > 1 && (
            <div
              style={{
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '16px',
                marginBottom: '20px',
                scrollbarWidth: 'none'
              }}
              className="subcategory-scroll-container"
            >
              {specialtyConfig.subcategories.map((sub) => {
                const isSelected = selectedSubcategory === sub.id;
                const count = subcategoryCounts[sub.id] ?? 0;
                if (sub.id !== 'all' && count === 0) return null;

                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubcategory(sub.id);
                      setCurrentPage(1);
                    }}
                    style={{
                      whiteSpace: 'nowrap',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #00875a' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#00875a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#334155',
                      boxShadow: isSelected ? '0 2px 8px rgba(0, 135, 90, 0.25)' : 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{sub.label}</span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        padding: '1px 6px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                        color: isSelected ? '#ffffff' : '#64748b',
                        fontWeight: 800
                      }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Controls Bar: Search & Sort */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            {/* In-category Search Input */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                flex: '1 1 300px',
                maxWidth: '440px'
              }}
            >
              <Search
                size={17}
                color="#94a3b8"
                style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Search within ${categoryTitle}...`}
                style={{
                  width: '100%',
                  padding: '9px 36px 9px 38px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.86rem',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  color: '#0f172a'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Right: Sort & Count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>
                Showing {totalItems === 0 ? 0 : startIndex + 1}–
                {Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of {totalItems} items
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ArrowUpDown size={15} color="#64748b" />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="recent">Newest Certified</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Product Name (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div
              className="category-product-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                marginBottom: '40px'
              }}
            >
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} showActions={true} />
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '60px 24px',
                textAlign: 'center',
                margin: '20px 0 40px'
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#64748b'
                }}
              >
                <Search size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
                No matching products found
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto 20px' }}>
                We couldn&apos;t find any products matching your search in {categoryTitle}. Try adjusting your keywords or browse all products in this category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubcategory('all');
                }}
                style={{
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                margin: '30px 0 50px'
              }}
            >
              <button
                onClick={() => handlePageChange(safePage - 1)}
                disabled={safePage <= 1}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: safePage <= 1 ? '#f8fafc' : '#ffffff',
                  color: safePage <= 1 ? '#94a3b8' : '#0f172a',
                  cursor: safePage <= 1 ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                  fontSize: '0.84rem'
                }}
              >
                <ChevronLeft size={16} />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 2)
                .map((pageNum, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && pageNum - prev > 1;

                  return (
                    <React.Fragment key={pageNum}>
                      {showEllipsis && (
                        <span style={{ color: '#94a3b8', padding: '0 4px', fontSize: '0.84rem' }}>...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(pageNum)}
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '8px',
                          border: pageNum === safePage ? '1px solid #00875a' : '1px solid #e2e8f0',
                          backgroundColor: pageNum === safePage ? '#00875a' : '#ffffff',
                          color: pageNum === safePage ? '#ffffff' : '#334155',
                          fontWeight: pageNum === safePage ? 800 : 600,
                          fontSize: '0.86rem',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pageNum}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => handlePageChange(safePage + 1)}
                disabled={safePage >= totalPages}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: safePage >= totalPages ? '#f8fafc' : '#ffffff',
                  color: safePage >= totalPages ? '#94a3b8' : '#0f172a',
                  cursor: safePage >= totalPages ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                  fontSize: '0.84rem'
                }}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* 3. B2B Hospital & Clinic Procurement RFQ Banner */}
          <div
            style={{
              backgroundColor: '#002845',
              color: '#ffffff',
              borderRadius: '16px',
              padding: '36px 40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '56px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0, 40, 69, 0.15)'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  color: '#4ade80',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  marginBottom: '12px'
                }}
              >
                <Building2 size={13} />
                <span>UAE HEALTHCARE TENDER & BULK PROCUREMENT</span>
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px', color: '#ffffff' }}>
                Equipping a Hospital Ward, Day Surgery, or Clinic?
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: 1.6, margin: 0 }}>
                FastonMed supplies private and government healthcare institutions across Dubai, Abu Dhabi, and Northern Emirates with official MoHAP documentation, biomedical warranty, and scheduled calibration.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                style={{
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '13px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'background-color 0.2s',
                  boxShadow: '0 4px 14px rgba(0, 135, 90, 0.35)'
                }}
              >
                <span>Request Official Quotation</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="https://wa.me/971508893589?text=Hello%20FastonMed%20Sales%20Team%2C%20I%20would%20like%20to%20request%20a%20bulk%20procurement%20quotation%20for%20hospital%20equipment."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  padding: '13px 22px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <MessageCircle size={17} />
                <span>WhatsApp Specialist</span>
              </a>
            </div>
          </div>

          {/* 4. Explore Other Medical Specialties Section */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ color: '#00875a', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.08em' }}>
                EXPLORE COMPLETE CATALOG
              </span>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 0' }}>
                Other Medical Equipment Specialties
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '16px'
              }}
            >
              {otherSpecialties.map((item) => (
                <Link
                  key={item.slug}
                  href={`/product-category/${item.slug}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                  }}
                  className="other-specialty-card"
                >
                  <div
                    style={{
                      height: '110px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px',
                      marginBottom: '12px'
                    }}
                  >
                    <img
                      src={item.illustration}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>

                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.76rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 12px', flex: 1 }}>
                    {item.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00875a'
                      }}
                    >
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Responsive Styles */}
      <style jsx>{`
        .other-specialty-card:hover {
          transform: translateY(-3px);
          border-color: #00875a;
          box-shadow: 0 8px 20px rgba(0, 135, 90, 0.08);
        }
        @media (max-width: 1024px) {
          .category-product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .category-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .category-hero-illustration-box {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .category-product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .category-main-title {
            fontSize: 1.8rem !important;
          }
        }
      `}</style>
    </div>
  );
}
