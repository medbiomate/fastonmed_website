import enTranslations from '../locales/en.json';
import arTranslations from '../locales/ar.json';

export type Locale = 'en' | 'ar';

export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

export function isRTL(locale: Locale): boolean {
  return locale === 'ar';
}

export function getLocaleFromPath(pathname?: string | null): Locale {
  if (!pathname) return DEFAULT_LOCALE;
  if (pathname === '/ar' || pathname.startsWith('/ar/')) {
    return 'ar';
  }
  return 'en';
}

/**
 * Given a pathname (and optional search query), calculates the equivalent URL in the target locale.
 * Example:
 *   /product/patient-monitor -> /ar/product/patient-monitor
 *   /ar/product/patient-monitor -> /product/patient-monitor
 *   / -> /ar
 *   /ar -> /
 * Preserves the exact same slug!
 */
export function getEquivalentPath(pathname: string, targetLocale: Locale, search = ''): string {
  const cleanPath = pathname || '/';
  const query = search ? (search.startsWith('?') ? search : `?${search}`) : '';

  if (targetLocale === 'ar') {
    if (cleanPath === '/ar' || cleanPath.startsWith('/ar/')) {
      return `${cleanPath}${query}`;
    }
    if (cleanPath === '/') {
      return `/ar${query}`;
    }
    return `/ar${cleanPath}${query}`;
  } else {
    // Target is English: remove /ar prefix
    if (cleanPath === '/ar') {
      return `/${query}`;
    }
    if (cleanPath.startsWith('/ar/')) {
      const stripped = cleanPath.slice(3);
      return `${stripped.startsWith('/') ? stripped : '/' + stripped}${query}`;
    }
    return `${cleanPath}${query}`;
  }
}

/**
 * Access nested translation key, e.g. t('common.addToCart', 'ar')
 */
export function t(key: string, locale: Locale = 'en'): string {
  const dictionary = locale === 'ar' ? arTranslations : enTranslations;
  const parts = key.split('.');
  let current: any = dictionary;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to English dictionary if key missing in Arabic
      let fallbackCurrent: any = enTranslations;
      for (const fbPart of parts) {
        if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbPart in fallbackCurrent) {
          fallbackCurrent = fallbackCurrent[fbPart];
        } else {
          return key;
        }
      }
      return typeof fallbackCurrent === 'string' ? fallbackCurrent : key;
    }
  }

  return typeof current === 'string' ? current : key;
}
