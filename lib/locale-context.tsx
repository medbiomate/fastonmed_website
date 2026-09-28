'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPath, isRTL, t, Locale } from './i18n';

interface LocaleContextType {
  locale: Locale;
  isRtl: boolean;
  isArabic: boolean;
  t: (key: string) => string;
  localizeUrl: (url: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  isRtl: false,
  isArabic: false,
  t: (key: string) => key,
  localizeUrl: (url: string) => url,
});

export function LocaleProvider({
  children,
  initialLocale = 'en',
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const pathname = usePathname();

  // Initialize with initialLocale from server header
  const [locale, setLocale] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/ar' || p.startsWith('/ar/')) return 'ar';
    }
    return initialLocale;
  });

  useEffect(() => {
    const syncLocale = () => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname;
        const isAr = p === '/ar' || p.startsWith('/ar/');
        const newLocale = isAr ? 'ar' : 'en';
        setLocale(newLocale);
        document.documentElement.lang = isAr ? 'ar' : 'en';
        document.documentElement.dir = isAr ? 'rtl' : 'ltr';
        if (isAr) {
          document.documentElement.classList.add('rtl-arabic');
        } else {
          document.documentElement.classList.remove('rtl-arabic');
        }
      }
    };

    syncLocale();
    window.addEventListener('popstate', syncLocale);
    return () => window.removeEventListener('popstate', syncLocale);
  }, [pathname]);

  const isRtl = locale === 'ar';
  const isArabic = locale === 'ar';

  const localizeUrl = (url: string): string => {
    if (!url) return url;
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('mailto:') ||
      url.startsWith('tel:') ||
      url.startsWith('#') ||
      url.includes('wa.me')
    ) {
      return url;
    }
    if (locale === 'ar') {
      if (url === '/ar' || url.startsWith('/ar/')) return url;
      if (url === '/') return '/ar';
      return `/ar${url.startsWith('/') ? url : '/' + url}`;
    } else {
      if (url === '/ar') return '/';
      if (url.startsWith('/ar/')) {
        const stripped = url.slice(3);
        return stripped.startsWith('/') ? stripped : '/' + stripped;
      }
      return url;
    }
  };

  const value = useMemo(
    () => ({
      locale,
      isRtl,
      isArabic,
      t: (key: string) => t(key, locale),
      localizeUrl,
    }),
    [locale, isRtl, isArabic]
  );

  return (
    <LocaleContext.Provider value={value}>
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'rtl-arabic' : ''}>
        {children}
      </div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}

