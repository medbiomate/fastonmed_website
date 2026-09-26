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
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>
        <Link href="/" style={{ color: '#64748b', textDecoration: 'none' }}>Home</Link>
        <ChevronRight size={14} />
        <span style={{ color: '#0f172a', fontWeight: 600 }}>Medical Catalog</span>
      </div>

      {/* Page Title & Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '720px' }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
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
    </div>
  );
}
