'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { getLocaleFromPath, getEquivalentPath, Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'header' | 'mobile';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'topbar', className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    setCurrentLocale(getLocaleFromPath(pathname));
    if (typeof window !== 'undefined') {
      setSearchString(window.location.search);
    }
  }, [pathname]);

  const targetLocale: Locale = currentLocale === 'en' ? 'ar' : 'en';
  const equivalentPath = getEquivalentPath(pathname, targetLocale, searchString);

  const handleLanguageClick = (target: Locale) => {
    try {
      document.cookie = `preferred_language=${target}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore cookie errors
    }
  };

  // Topbar Variant (Rendered in top green bar: "English | العربية")
  if (variant === 'topbar') {
    return (
      <div
        className={`fm-lang-switcher-topbar ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          fontWeight: 600,
          color: '#ffffff'
        }}
      >
        <Globe size={13} style={{ opacity: 0.9 }} />
        {currentLocale === 'en' ? (
          <Link
            href={getEquivalentPath(pathname, 'ar', searchString)}
            onClick={() => handleLanguageClick('ar')}
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transition: 'background-color 0.2s',
              fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif"
            }}
            title="التحويل إلى اللغة العربية"
          >
            العربية
          </Link>
        ) : (
          <Link
            href={getEquivalentPath(pathname, 'en', searchString)}
            onClick={() => handleLanguageClick('en')}
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transition: 'background-color 0.2s'
            }}
            title="Switch to English"
          >
            English
          </Link>
        )}
      </div>
    );
  }

  // Header Desktop Variant (compact icon button next to cart/user in main navbar)
  if (variant === 'header') {
    return (
      <Link
        href={equivalentPath}
        onClick={() => handleLanguageClick(targetLocale)}
        className={`fm-lang-switcher-header ${className}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 9px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontSize: '0.80rem',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          fontFamily: targetLocale === 'ar' ? "'Cairo', 'Tajawal', Arial, sans-serif" : 'Arial, sans-serif'
        }}
        title={targetLocale === 'ar' ? 'التحويل إلى العربية' : 'Switch to English'}
      >
        <Globe size={14} color="#00875a" />
        <span>{targetLocale === 'ar' ? 'العربية' : 'EN'}</span>
      </Link>
    );
  }

  // Mobile Drawer Variant (Prominent button inside slideout menu)
  return (
    <div
      className={`fm-lang-switcher-mobile ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        backgroundColor: '#f8fafc',
        borderRadius: '10px',
        border: '1px solid #e2e8f0',
        margin: '12px 0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Globe size={18} color="#00875a" />
        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
          {currentLocale === 'ar' ? 'اللغة' : 'Language'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px' }}>
        <Link
          href={getEquivalentPath(pathname, 'en', searchString)}
          onClick={() => handleLanguageClick('en')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: currentLocale === 'en' ? 700 : 500,
            backgroundColor: currentLocale === 'en' ? '#00875a' : '#ffffff',
            color: currentLocale === 'en' ? '#ffffff' : '#64748b',
            border: `1px solid ${currentLocale === 'en' ? '#00875a' : '#cbd5e1'}`,
            textDecoration: 'none'
          }}
        >
          English
        </Link>
        <Link
          href={getEquivalentPath(pathname, 'ar', searchString)}
          onClick={() => handleLanguageClick('ar')}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.82rem',
            fontWeight: currentLocale === 'ar' ? 700 : 500,
            backgroundColor: currentLocale === 'ar' ? '#00875a' : '#ffffff',
            color: currentLocale === 'ar' ? '#ffffff' : '#64748b',
            border: `1px solid ${currentLocale === 'ar' ? '#00875a' : '#cbd5e1'}`,
            textDecoration: 'none',
            fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif"
          }}
        >
          العربية
        </Link>
      </div>
    </div>
  );
}
