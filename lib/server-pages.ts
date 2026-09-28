import type { EditorialPage } from './editorial-pages';
import { editorialPages } from './editorial-pages';

export type SharedEditorialPage = EditorialPage & { id: string; slug: string; status?: string; updatedAt?: string };

let cachedPages: SharedEditorialPage[] | null = null;
let pagesCacheExpiry = 0;
let lastFetchFailureTime = 0;

export async function getSharedEditorialPages(): Promise<SharedEditorialPage[]> {
  const now = Date.now();
  if (cachedPages && now < pagesCacheExpiry) {
    return cachedPages;
  }

  // If CRM backend failed within the last 60 seconds, do not block requests with repeated timeouts
  if (now - lastFetchFailureTime < 60_000) {
    return Object.entries(editorialPages).map(([slug, page]) => ({ ...page, id: slug, slug, status: 'published' }));
  }

  const crmUrl = process.env.CRM_BACKEND_URL?.replace(/\/$/, '') || '';
  if (crmUrl) {
    try {
      const response = await fetch(`${crmUrl}/api/shared-data/website-pages`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(1000)
      });
      if (response.ok) {
        const payload = await response.json();
        if (payload?.success && Array.isArray(payload.data) && payload.data.length) {
          const filtered: SharedEditorialPage[] = payload.data.filter((page: SharedEditorialPage) => page.status !== 'draft');
          cachedPages = filtered;
          pagesCacheExpiry = now + 60_000;
          return filtered;
        }
      }
    } catch (error) {
      lastFetchFailureTime = Date.now();
      console.warn('[website-pages] Shared database unavailable, using bundled fallback.');
    }
  }

  const bundled = Object.entries(editorialPages).map(([slug, page]) => ({ ...page, id: slug, slug, status: 'published' }));
  cachedPages = bundled;
  pagesCacheExpiry = now + 30_000;
  return bundled;
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
