import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { getOrTranslateBatch } from '@/lib/translation-service';

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  status: string;
  featuredImage?: string;
  category?: string;
  publishedAt?: string;
  updatedAt?: string;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const canonicalUrl = isAr ? 'https://www.fastonmed.com/ar/blog' : 'https://www.fastonmed.com/blog';

  const title = isAr
    ? 'رؤى الرعاية الصحية والطب الحيوي | أفضل مورد للمعدات الطبية في الإمارات | FastonMed'
    : 'Healthcare & Biomedical Insights | Best Medical Equipment Supplier in UAE | FastonMed';
  const description = isAr
    ? 'مقالات سريرية وتحديثات تقنيات الرعاية الصحية ودليل صيانة الأجهزة الطبية في الإمارات من فاستونميد.'
    : 'Clinical insights, healthcare technology updates, biomedical maintenance guides, and hospital technology news from FastonMed, the Best Medical Equipment Supplier in UAE.';

  return {
    title,
    description,
    keywords: [
      'FastonMed Journal',
      'Best Medical Equipment Supplier in UAE',
      'Biomedical Engineering Insights UAE',
      'Hospital Technology Dubai',
      'Medical Equipment Guides UAE',
      'Clinical Device Maintenance Dubai'
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://www.fastonmed.com/blog',
        ar: 'https://www.fastonmed.com/ar/blog',
        'x-default': 'https://www.fastonmed.com/blog',
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'FastonMed',
      locale: isAr ? 'ar_AE' : 'en_AE',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

async function getPosts() {
  const crm = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  try {
    const r = await fetch(`${crm}/api/shared-data/website-posts`, { cache: 'no-store' });
    const x = await r.json();
    return (x.data || []).filter((p: Post) => p.status === 'published') as Post[];
  } catch {
    return [];
  }
}

export default async function Blog() {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  let posts = await getPosts();

  if (isAr && posts.length > 0) {
    const itemsToTranslate: { fieldName: string; sourceText: string }[] = [];
    posts.forEach((p) => {
      itemsToTranslate.push({ fieldName: `${p.slug}_title`, sourceText: p.title });
      if (p.excerpt) {
        itemsToTranslate.push({ fieldName: `${p.slug}_excerpt`, sourceText: p.excerpt });
      }
      if (p.category) {
        itemsToTranslate.push({ fieldName: `${p.slug}_cat`, sourceText: p.category });
      }
    });

    const translations = await getOrTranslateBatch({
      entityType: 'post',
      entityId: 'published_posts',
      items: itemsToTranslate,
    });

    posts = posts.map((p) => ({
      ...p,
      title: translations[`${p.slug}_title`] || p.title,
      excerpt: translations[`${p.slug}_excerpt`] || p.excerpt,
      category: translations[`${p.slug}_cat`] || p.category,
    }));
  }

  return (
    <main className="fm-blog-index">
      <header>
        <span>{isAr ? 'مجلة فاستونميد' : 'FASTONMED JOURNAL'}</span>
        <h1>{isAr ? 'رؤى وإرشادات الرعاية الصحية' : 'Healthcare insights & guides'}</h1>
        <p>
          {isAr
            ? 'معلومات عملية للمتخصصين في الرعاية الصحية والمرافق الطبية في دولة الإمارات.'
            : 'Practical information for healthcare professionals and medical facilities in the UAE.'}
        </p>
      </header>
      <div className="fm-blog-grid">
        {posts.map((p) => (
          <Link href={isAr ? `/ar/blog/${p.slug}` : `/blog/${p.slug}`} key={p.slug}>
            {p.featuredImage && <img src={p.featuredImage} alt={p.title} />}
            <div>
              <small>{p.category || (isAr ? 'عام' : 'General')}</small>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <b>{isAr ? 'اقرأ المقال ←' : 'Read article →'}</b>
            </div>
          </Link>
        ))}
        {!posts.length && <p>{isAr ? 'لا توجد مقالات منشورة بعد.' : 'No published articles yet.'}</p>}
      </div>
    </main>
  );
}
