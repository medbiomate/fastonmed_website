import recoveredPages from './scraped-pages.json';

export type EditorialSection = { title: string; paragraphs: string[]; points?: string[] };
export type FAQItem = { question: string; answer: string };
export type EditorialPage = {
  title: string;
  eyebrow: string;
  description: string;
  heroImage?: string;
  featuredCategory?: string;
  featuredProductIds?: string[];
  sections: EditorialSection[];
  faqs?: FAQItem[];
};

/** Published copy recovered from the supplied Fastonmed WordPress database. */
const pages = recoveredPages as Record<string, EditorialPage>;

export const editorialPages: Record<string, EditorialPage> = {
  ...pages,
  // Preserve the cleaner local URL for the original WordPress privacy page.
  'privacy-policy': pages['privacy-policy-2'],
};
