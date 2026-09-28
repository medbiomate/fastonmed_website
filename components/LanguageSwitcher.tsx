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

export default function LanguageSwitcher({ variant = 'header', className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname() || '/';
  const [currentLocale, setCurrentLocale] = useState<Locale>('en');
  const [searchString, setSearchString] = useState('');

  useEffect(() => {
    setCurrentLocale(getLocaleFromPath(pathname));
    if (typeof window !== 'undefined') {
      setSearchString(window.location.search);
    }
  }, [pathname]);

  const handleLanguageClick = (target: Locale) => {
    try {
      document.cookie = `preferred_language=${target}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // Ignore cookie errors
    }
  };

  const enHref = getEquivalentPath(pathname, 'en', searchString);
  const arHref = getEquivalentPath(pathname, 'ar', searchString);

  // Styled toggle capsule matching exact user reference image:
  // Rounded navy capsule with active amber/gold pill and white inactive text
  return (
    <div
      className={`fm-lang-toggle ${className}`}
      dir="ltr"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#1b2d48',
        borderRadius: '10px',
        padding: '3px',
        gap: '2px',
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        userSelect: 'none',
        flexShrink: 0
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
          minWidth: '38px',
          padding: '4px 10px',
          borderRadius: '7px',
          fontSize: '0.78rem',
          fontWeight: 700,
          letterSpacing: '0.02em',
          textDecoration: 'none',
          lineHeight: 1.1,
          fontFamily: 'Arial, Helvetica, sans-serif',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: currentLocale === 'en' ? '#f59e0b' : 'transparent',
          color: currentLocale === 'en' ? '#0f172a' : '#ffffff',
          boxShadow: currentLocale === 'en' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none'
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
          minWidth: '42px',
          padding: '4px 10px',
          borderRadius: '7px',
          fontSize: '0.82rem',
          fontWeight: 700,
          textDecoration: 'none',
          lineHeight: 1.1,
          fontFamily: "'Cairo', 'Tajawal', Arial, sans-serif",
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: currentLocale === 'ar' ? '#f59e0b' : 'transparent',
          color: currentLocale === 'ar' ? '#0f172a' : '#ffffff',
          boxShadow: currentLocale === 'ar' ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none'
        }}
        title="التحويل إلى اللغة العربية"
      >
        عربي
      </Link>
    </div>
  );
}
