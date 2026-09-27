'use client';

import React, { createContext, useContext, useMemo } from 'react';
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

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useMemo(() => getLocaleFromPath(pathname), [pathname]);
  const isRtl = useMemo(() => isRTL(locale), [locale]);
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
