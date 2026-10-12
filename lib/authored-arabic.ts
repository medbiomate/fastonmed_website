import categories from '@/locales/arabic-categories.json';

const categoryLabels = new Map(Object.entries(categories).map(([name, text]) => [name.toLowerCase(), text]));
export function arabicCategoryName(source: string): string {
  const decoded = source.replace(/&amp;/gi, '&').trim();
  return categoryLabels.get(decoded.toLowerCase()) || source;
}
