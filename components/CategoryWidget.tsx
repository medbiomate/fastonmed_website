'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { ProductCategory } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Layers
} from 'lucide-react';

interface CategoryWidgetProps {
  categories: ProductCategory[];
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
  totalProducts: number;
}

// Helper to decode HTML entities like &amp;
function cleanName(name: string): string {
  return name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

// Curated high-resolution fallback photography for healthcare categories
function getCategoryVisualImage(categoryName: string, fallbackApiImage?: string): string {
  const lower = categoryName.toLowerCase();

  // Better matching for hospital furniture: display a real clinical hospital bed
  if (lower.includes('furniture') || lower.includes('bed')) {
    return '/wp-content/uploads/2025/06/dione-100-homecare-electric-bed-510x352_large.jpg';
  }
  if (lower.includes('monitor') || lower.includes('vital signs')) {
    return '/wp-content/uploads/2025/10/av-pro-multiparameter-patient-monitor-uae.png';
  }
  if (lower.includes('refrigerat') || lower.includes('cold') || lower.includes('pharmacy')) {
    return '/images/original/Fridges-Pharmacy_Haier_HYC-309.png';
  }
  if (lower.includes('physiotherapy')) {
    return '/images/original/phsyotherapy-1.jpeg';
  }
  if (lower.includes('ventilator') || lower.includes('icu') || lower.includes('critical care')) {
    return '/products/ventilator.jpg';
  }
  if (lower.includes('cardio') || lower.includes('ecg')) {
    return '/products/ecg-machine.jpg';
  }
  if (lower.includes('dental')) {
    return '/products/dental-chair.jpg';
  }
  if (lower.includes('ultrasound')) {
    return '/products/ultrasound.jpg';
  }

  // Use API image if available
  if (fallbackApiImage && fallbackApiImage.trim().length > 5 && !fallbackApiImage.includes('placeholder')) {
    return fallbackApiImage;
  }

  // General fallbacks
  if (lower.includes('consumable') || lower.includes('disposable')) {
    return '/wp-content/uploads/2025/07/103497-mueller_s_kinesiology_tape_pink-1024x1024-1-510x510_large.jpg';
  }

  return '/products/patient-monitor.jpg';
}

export default function CategoryWidget({
  categories,
  selectedCategory,
  onSelectCategory,
  totalProducts
}: CategoryWidgetProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const amount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Top featured categories to display in cards (excluding Uncategorized)
  const topCategories = categories
    .filter(c => (c.productCount || 0) > 0 && c.name.toLowerCase() !== 'uncategorized')
    .sort((a, b) => (b.productCount || 0) - (a.productCount || 0))
    .slice(0, 16);

  return (
    <section
      aria-label="Medical Specialties & Departments"
      className="cat-widget-section"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e5ede9',
        padding: '16px 20px 18px',
        marginBottom: '28px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)'
      }}
    >
      <style>{`
        .cat-scroll-track {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 4px 2px 12px 2px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .cat-scroll-track::-webkit-scrollbar {
          display: none;
        }
        .cat-card-widget {
          flex: 0 0 160px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          user-select: none;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }
        .cat-card-widget:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -4px rgba(15, 23, 42, 0.1);
          border-color: #51b291;
        }
        .cat-card-widget:hover .cat-widget-img {
          transform: scale(1.08);
        }
        .cat-card-widget.active {
          border-color: #51b291;
          box-shadow: 0 8px 22px -3px rgba(81, 178, 145, 0.35);
          background: #f0fdf9;
        }
        .cat-card-widget.active .cat-widget-title {
          color: #0f766e !important;
          font-weight: 800 !important;
        }
        .cat-card-widget.active .cat-widget-count {
          background: #51b291 !important;
          color: #ffffff !important;
          border-color: #51b291 !important;
        }
        @media (max-width: 768px) {
          .cat-widget-section {
            padding: 12px 10px 10px !important;
            margin-bottom: 20px !important;
            border-radius: 14px !important;
          }
          .cat-widget-header {
            display: none !important;
          }
          .cat-scroll-track {
            padding: 2px 2px 6px 2px !important;
            gap: 10px !important;
          }
          .cat-card-widget {
            flex: 0 0 126px !important;
            padding: 10px 8px !important;
            border-radius: 12px !important;
          }
          .cat-widget-img-box {
            height: 78px !important;
            margin-bottom: 8px !important;
          }
          .cat-widget-title {
            font-size: 0.78rem !important;
            min-height: 2.2em !important;
            margin-bottom: 4px !important;
          }
        }
      `}</style>

      {/* Desktop Prev/Next Controls (Hidden on Mobile) */}
      <div className="cat-widget-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left categories"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#51b291'; e.currentTarget.style.color = '#51b291'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right categories"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#51b291'; e.currentTarget.style.color = '#51b291'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Visual Cards Horizontal Track with Real Photos */}
      <div ref={scrollContainerRef} className="cat-scroll-track">
        {/* All Medical Equipment Master Card */}
        <div
          onClick={() => onSelectCategory('')}
          className={`cat-card-widget ${!selectedCategory ? 'active' : ''}`}
        >
          <div
            className="cat-widget-img-box"
            style={{
              position: 'relative',
              width: '100%',
              height: '102px',
              borderRadius: '10px',
              backgroundColor: '#f1f5f9',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '10px'
            }}
          >
            <Image
              src="/products/patient-monitor.jpg"
              alt="All Medical Equipment - FastOnMed UAE"
              fill
              className="cat-widget-img"
              style={{ objectFit: 'contain', padding: '6px', transition: 'transform 0.3s ease' }}
              sizes="172px"
            />
          </div>

          <div
            className="cat-widget-title"
            style={{
              fontSize: '0.88rem',
              fontWeight: 700,
              color: '#0f172a',
              marginBottom: '6px',
              lineHeight: 1.25,
              minHeight: '2.4em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            All Medical Equipment
          </div>

          <div
            className="cat-widget-count"
            style={{
              fontSize: '0.73rem',
              fontWeight: 700,
              color: '#64748b',
              backgroundColor: '#f1f5f9',
              padding: '3px 8px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              marginTop: 'auto'
            }}
          >
            {totalProducts.toLocaleString()} Items
          </div>

          {!selectedCategory && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#51b291',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <Check size={11} strokeWidth={3} />
            </div>
          )}
        </div>

        {/* Dynamic Category Cards with Real Product Images */}
        {topCategories.map(cat => {
          const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
          const displayName = cleanName(cat.name);
          const imgSrc = getCategoryVisualImage(cat.name, cat.image);

          return (
            <div
              key={cat.id || cat.name}
              onClick={() => onSelectCategory(isSelected ? '' : cat.name)}
              className={`cat-card-widget ${isSelected ? 'active' : ''}`}
            >
              <div
                className="cat-widget-img-box"
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '102px',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                  border: '1px solid #f1f5f9'
                }}
              >
                <Image
                  src={imgSrc}
                  alt={`${displayName} - FastOnMed Healthcare UAE`}
                  fill
                  className="cat-widget-img"
                  style={{ objectFit: 'contain', padding: '6px', transition: 'transform 0.3s ease' }}
                  sizes="172px"
                />
              </div>

              <div
                className="cat-widget-title"
                style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  marginBottom: '6px',
                  lineHeight: 1.25,
                  minHeight: '2.4em',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
                title={displayName}
              >
                {displayName}
              </div>

              <div
                className="cat-widget-count"
                style={{
                  fontSize: '0.73rem',
                  fontWeight: 700,
                  color: '#64748b',
                  backgroundColor: '#f1f5f9',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  marginTop: 'auto'
                }}
              >
                {cat.productCount || 1} {cat.productCount === 1 ? 'Item' : 'Items'}
              </div>

              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#51b291',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  <Check size={11} strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>



      {/* Active Category Filter Tag Banner */}
      {selectedCategory && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#eaf7f2',
            border: '1px solid #a7e4cf',
            borderRadius: '10px',
            padding: '10px 16px',
            marginTop: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.86rem', color: '#134e4a', fontWeight: 500 }}>
              Currently filtering by department:
            </span>
            <span style={{ fontSize: '0.88rem', color: '#042f2e', fontWeight: 800 }}>
              "{cleanName(selectedCategory)}"
            </span>
          </div>

          <button
            onClick={() => onSelectCategory('')}
            style={{
              background: 'none',
              border: 'none',
              color: '#0f766e',
              fontWeight: 700,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <span>Clear filter</span>
            <X size={15} />
          </button>
        </div>
      )}
    </section>
  );
}
