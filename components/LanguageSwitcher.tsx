'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { getLocaleFromPath, getEquivalentPath, Locale } from '@/lib/i18n';

import { useLocale } from '@/lib/locale-context';

interface LanguageSwitcherProps {
  variant?: 'topbar' | 'header' | 'mobile';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';
  const { locale: contextLocale } = useLocale();
  const [currentPath, setCurrentPath] = useState(pathname);
  const [browserLocale, setBrowserLocale] = useState<Locale>(contextLocale);
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      setCurrentPath(p);
      setBrowserLocale(p === '/ar' || p.startsWith('/ar/') ? 'ar' : 'en');
      setSearchString(window.location.search);
    } else {
      setBrowserLocale(contextLocale);
    }
  }, [pathname, contextLocale]);

  const activeLocale = browserLocale || contextLocale || 'en';
  const pathForLinks = currentPath || pathname;

  const handleLanguageClick = (target: Locale) => {
    try {
      document.cookie = `preferred_language=${target}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore cookie errors
    }
  };

  const enHref = getEquivalentPath(pathForLinks, 'en', searchString);
  const arHref = getEquivalentPath(pathForLinks, 'ar', searchString);

  // Styled toggle capsule matching FastonMed website palette:
  // Light subtle pill container (#f1f5f9) with FastonMed emerald green (#00875a) active pill
  return (
    <div
      className={`fm-lang-toggle ${className}`}
      dir="ltr"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: '20px',
        padding: '2.5px',
        gap: '2px',
        border: '1px solid #e2e8f0',
        userSelect: 'none',
        flexShrink: 0,
        height: '30px'
      }}
      role="group"
      aria-label="Language selection"
    >
      {/* English Option */}
      <Link
        href={enHref}
        onClick={() => handleLanguageClick('en')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '34px',
          height: '24px',
          padding: '0 8px',
          borderRadius: '16px',
          fontSize: '0.74rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          lineHeight: 1,
          fontFamily: 'Arial, Helvetica, sans-serif',
          transition: 'all 0.18s ease-in-out',
          backgroundColor: activeLocale === 'en' ? '#00875a' : 'transparent',
          color: activeLocale === 'en' ? '#ffffff' : '#64748b',
          boxShadow: activeLocale === 'en' ? '0 1px 3px rgba(0, 135, 90, 0.25)' : 'none'
        }}
        title="Switch to English"
      >
        EN
      </Link>

      {/* Arabic Option */}
      <Link
        href={arHref}
        onClick={() => handleLanguageClick('ar')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '38px',
          height: '24px',
          padding: '0 9px',
          borderRadius: '16px',
          fontSize: '0.78rem',
          fontWeight: 700,
          textDecoration: 'none',
          lineHeight: 1,
          fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif",
          transition: 'all 0.18s ease-in-out',
          backgroundColor: activeLocale === 'ar' ? '#00875a' : 'transparent',
          color: activeLocale === 'ar' ? '#ffffff' : '#64748b',
          boxShadow: activeLocale === 'ar' ? '0 1px 3px rgba(0, 135, 90, 0.25)' : 'none'
        }}
        title="التحويل إلى اللغة العربية"
      >
        عربي
      </Link>
    </div>
  );
}
