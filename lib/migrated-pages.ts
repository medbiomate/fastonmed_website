import type { EditorialPage } from './editorial-pages';
import recoveredPages from './scraped-pages.json';

export const migratedEditorialPages = recoveredPages as Record<string, EditorialPage>;
export const migratedPageSlugs = Object.keys(migratedEditorialPages);
