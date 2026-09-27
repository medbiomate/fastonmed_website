import type { Metadata } from 'next';
import Link from 'next/link';

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

export const metadata: Metadata = {
  title: 'Healthcare & Biomedical Insights | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Clinical insights, healthcare technology updates, biomedical maintenance guides, and hospital technology news from FastonMed, the Best Medical Equipment Supplier in UAE.',
  keywords: [
    'FastonMed Journal',
    'Best Medical Equipment Supplier in UAE',
    'Biomedical Engineering Insights UAE',
    'Hospital Technology Dubai',
    'Medical Equipment Guides UAE',
    'Clinical Device Maintenance Dubai'
  ],
  alternates: {
    canonical: 'https://www.fastonmed.com/blog'
  },
  openGraph: {
    title: 'Healthcare & Biomedical Insights | Best Medical Equipment Supplier in UAE | FastonMed',
    description:
      'Clinical technology insights and equipment guides from FastonMed, the Best Medical Equipment Supplier in UAE.',
    url: 'https://www.fastonmed.com/blog',
    siteName: 'FastonMed Healthcare Equipment LLC',
    locale: 'en_AE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healthcare & Biomedical Insights | Best Medical Equipment Supplier in UAE | FastonMed',
    description:
      'Clinical insights and equipment guides from FastonMed, the Best Medical Equipment Supplier in UAE.'
  }
};

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

export const dynamic = 'force-dynamic';

export default async function Blog() {
  const posts = await getPosts();
  return (
    <main className="fm-blog-index">
      <header>
        <span>FASTONMED JOURNAL</span>
        <h1>Healthcare insights &amp; guides</h1>
        <p>Practical information for healthcare professionals and medical facilities in the UAE.</p>
      </header>
      <div className="fm-blog-grid">
        {posts.map((p) => (
          <Link href={`/blog/${p.slug}`} key={p.slug}>
            {p.featuredImage && <img src={p.featuredImage} alt={p.title} />}
            <div>
              <small>{p.category || 'General'}</small>
              <h2>{p.title}</h2>
              <p>{p.excerpt}</p>
              <b>Read article →</b>
            </div>
          </Link>
        ))}
        {!posts.length && <p>No published articles yet.</p>}
      </div>
    </main>
  );
}
