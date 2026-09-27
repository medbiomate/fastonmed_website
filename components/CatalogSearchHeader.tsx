'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, ChevronRight } from 'lucide-react';

interface CatalogSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CatalogSearchHeader({
  searchQuery,
  onSearchChange
}: CatalogSearchHeaderProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal input value if external prop changes
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearchChange(inputValue.trim());
  };

  const handleClear = () => {
    setInputValue('');
    onSearchChange('');
  };

  return (
    <div style={{ marginBottom: '28px' }}>
      {/* Low-Profile Breadcrumb Navigation (For SEO Hierarchy) */}
      <nav
        aria-label="Breadcrumb"
        className="seo-breadcrumb"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '0.68rem',
          color: '#94a3b8',
          marginBottom: '6px',
          lineHeight: 1.2
        }}
      >
        <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
          Home
        </Link>
        <ChevronRight size={10} color="#cbd5e1" />
        <span style={{ color: '#64748b', fontWeight: 500 }}>Medical Catalog</span>
      </nav>

      {/* Page Title & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
        <h1
          id="catalog-search-title"
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#0f172a',
            margin: 0,
            letterSpacing: '-0.02em',
            lineHeight: 1.22
          }}
        >
          Medical Equipment & Supplies
        </h1>

        {/* Clean, Focused Search Input */}
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: isFocused ? '1.5px solid #51b291' : '1px solid #d1d5db',
              borderRadius: '10px',
              padding: '4px 6px 4px 14px',
              boxShadow: isFocused ? '0 0 0 3px rgba(81, 178, 145, 0.2)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
              transition: 'all 0.2s ease'
            }}
          >
            <Search size={18} color="#51b291" style={{ flexShrink: 0, marginRight: '10px' }} />
            <input
              type="text"
              placeholder="Search equipment, brand, or SKU..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '0.95rem',
                color: '#0f172a',
                padding: '8px 0',
                fontWeight: 500,
                backgroundColor: 'transparent'
              }}
            />

            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear search input"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  marginRight: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            )}

            <button
              type="submit"
              style={{
                backgroundColor: '#51b291',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '9px 22px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#429a7c')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#51b291')}
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #catalog-search-title {
            font-size: 1.45rem !important;
            line-height: 1.25 !important;
          }
        }
      `}</style>
    </div>
  );
}
