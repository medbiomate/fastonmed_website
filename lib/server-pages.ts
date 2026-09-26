import type { EditorialPage } from './editorial-pages';
import { editorialPages } from './editorial-pages';

export type SharedEditorialPage = EditorialPage & { id: string; slug: string; status?: string; updatedAt?: string };

export async function getSharedEditorialPages(): Promise<SharedEditorialPage[]> {
  const crmUrl = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  try {
    const response = await fetch(`${crmUrl}/api/shared-data/website-pages`, { cache: 'no-store' });
    if (response.ok) {
      const payload = await response.json();
      if (payload?.success && Array.isArray(payload.data) && payload.data.length) {
        return payload.data.filter((page: SharedEditorialPage) => page.status !== 'draft');
      }
    }
  } catch (error) {
    console.warn('[website-pages] Shared database unavailable, using bundled fallback.', error);
  }
  return Object.entries(editorialPages).map(([slug, page]) => ({ ...page, id: slug, slug, status: 'published' }));
}

export async function getSharedEditorialPage(slug: string): Promise<SharedEditorialPage | null> {
  const crmPages = await getSharedEditorialPages();
  const crmPage = crmPages.find((page) => page.slug === slug);
  const fallback = editorialPages[slug];
  if (!crmPage) return fallback ? { ...fallback, id: slug, slug, status: 'published' } : null;
  if (!fallback) return crmPage;
  return {
    ...fallback,
    ...crmPage,
    id: crmPage?.id || slug,
    slug: crmPage?.slug || slug,
    status: crmPage?.status || 'published',
    heroImage: crmPage?.heroImage || fallback.heroImage,
    eyebrow: crmPage?.eyebrow || fallback.eyebrow,
    featuredCategory: crmPage?.featuredCategory || fallback.featuredCategory,
    featuredProductIds: crmPage?.featuredProductIds || fallback.featuredProductIds,
    faqs: (crmPage?.faqs && crmPage.faqs.length > 0) ? crmPage.faqs : fallback.faqs,
  };
}
