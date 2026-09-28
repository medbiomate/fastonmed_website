'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getLocaleFromPath, isRTL, t, Locale } from './i18n';

interface LocaleContextType {
  locale: Locale;
  isRtl: boolean;
  isArabic: boolean;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  isRtl: false,
  isArabic: false,
  t: (key: string) => key,
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
    if (typeof window !== 'undefined') {
      const p = window.location.pathname;
      if (p === '/ar' || p.startsWith('/ar/')) {
        setLocale('ar');
        return;
      }
    }
    setLocale(getLocaleFromPath(pathname));
  }, [pathname]);

  const isRtl = locale === 'ar';
  const isArabic = locale === 'ar';

  const value = useMemo(
    () => ({
      locale,
      isRtl,
      isArabic,
      t: (key: string) => t(key, locale),
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
