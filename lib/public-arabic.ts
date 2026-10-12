import copy from '@/locales/public-copy-ar.json';
import extra from '@/locales/public-extra-ar.json';
import names from '@/locales/arabic-product-names.json';
import categories from '@/locales/arabic-categories.json';
const dictionary: Record<string, string> = { ...categories, ...names, ...copy, ...extra };
export function publicArabic(source: string): string {
  return dictionary[source.trim()] || source;
}
