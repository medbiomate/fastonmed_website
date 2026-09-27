import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import NotFound from '@/app/not-found';
import { getOrTranslateBatch, getOrTranslateContent } from '@/lib/translation-service';

export const dynamic = 'force-dynamic';

type Post = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  featuredImage?: string;
  category?: string;
  author?: string;
  authorRole?: string;
  authorImage?: string;
  reviewer?: string;
  reviewerRole?: string;
  reviewerImage?: string;
  showByline?: boolean;
  showAuthor?: boolean;
  showReviewer?: boolean;
  publishedAt?: string;
  updatedAt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

async function getPost(slug: string) {
  const crm = (process.env.CRM_BACKEND_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  try {
    const r = await fetch(`${crm}/api/shared-data/website-posts`, { cache: 'no-store' });
    const x = await r.json();
    return (x.data || []).find((p: Post) => p.slug === slug) as Post | undefined;
  } catch {
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';

  if (!post) {
    return {
      title: isAr ? 'المقال غير موجود | FastonMed' : 'Article Not Found | Best Medical Equipment Supplier in UAE | FastonMed',
      description: isAr ? 'تعذر العثور على المقال الطبي المطلوب.' : 'The requested healthcare article could not be found on FastonMed.',
      robots: { index: false, follow: true }
    };
  }

  let title = post.seoTitle || `${post.title} | Best Medical Equipment Supplier in UAE | FastonMed`;
  let description =
    post.seoDescription ||
    post.excerpt ||
    `Read ${post.title} on FastonMed, the Best Medical Equipment Supplier in UAE. Insights into hospital technology and biomedical engineering.`;

  if (isAr) {
    const [arTitle, arDesc] = await Promise.all([
      getOrTranslateContent({
        entityType: 'post',
        entityId: slug,
        fieldName: 'seo_title',
        sourceText: post.title,
      }),
      getOrTranslateContent({
        entityType: 'post',
        entityId: slug,
        fieldName: 'seo_desc',
        sourceText: description,
      }),
    ]);
    title = `${arTitle} | فاستونميد الإمارات | FastonMed`;
    description = arDesc;
  }

  const canonicalUrl = isAr ? `https://www.fastonmed.com/ar/blog/${slug}` : `https://www.fastonmed.com/blog/${slug}`;

  return {
    title,
    description,
    keywords: [
      post.title,
      post.category || 'Healthcare Technology',
      'Best Medical Equipment Supplier in UAE',
      'Biomedical Engineering UAE',
      'Hospital Equipment Dubai',
      'FastonMed Journal'
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `https://www.fastonmed.com/blog/${slug}`,
        ar: `https://www.fastonmed.com/ar/blog/${slug}`,
        'x-default': `https://www.fastonmed.com/blog/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'FastonMed',
      locale: isAr ? 'ar_AE' : 'en_AE',
      type: 'article',
      images: post.featuredImage ? [{ url: post.featuredImage, alt: post.title }] : []
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : []
    }
  };
}

export default async function BlogPost({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const preview = (await searchParams).preview === '1';

  if (!post || (!preview && post.status !== 'published')) return <NotFound />;

  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';

  let displayTitle = post.title;
  let displayExcerpt = post.excerpt;
  let displayContent = post.content;
  let displayCategory = post.category;

  if (isAr) {
    const trans = await getOrTranslateBatch({
      entityType: 'post',
      entityId: slug,
      items: [
        { fieldName: 'title', sourceText: post.title },
        { fieldName: 'excerpt', sourceText: post.excerpt || '' },
        { fieldName: 'content', sourceText: post.content || '', isHtml: true },
        { fieldName: 'category', sourceText: post.category || 'Fastonmed Journal' },
      ],
    });
    displayTitle = trans.title || displayTitle;
    displayExcerpt = trans.excerpt || displayExcerpt;
    displayContent = trans.content || displayContent;
    displayCategory = trans.category || displayCategory;
  }

  return (
    <main className="fm-blog-page">
      <article>
        <Link href={isAr ? '/ar/blog' : '/blog'} className="fm-blog-back">
          {isAr ? '← كافة المقالات' : '← All articles'}
        </Link>
        {preview && post.status !== 'published' && (
          <div className="fm-preview-banner">
            {isAr ? 'معاينة المسودة — هذا المقال ليس عاماً بعد.' : 'Draft preview — this article is not public.'}
          </div>
        )}
        <span className="fm-blog-category">{displayCategory || (isAr ? 'مجلة فاستونميد' : 'Fastonmed Journal')}</span>
        <h1>{displayTitle}</h1>
        {displayExcerpt && <p className="fm-blog-excerpt">{displayExcerpt}</p>}
        {post.showByline && (
          <div className="fm-public-byline">
            {post.showAuthor !== false && (
              <div className="fm-public-byline-item">
                {post.authorImage && <img src={post.authorImage} alt={post.author} className="fm-public-byline-avatar" />}
                <div>
                  <small>{isAr ? 'بقلم' : 'Written by'}</small>
                  <b>{post.author}</b>
                  {post.authorRole && <span>{post.authorRole}</span>}
                </div>
              </div>
            )}
            {post.showReviewer !== false && post.reviewer && (
              <div className="fm-public-byline-item">
                {post.reviewerImage && <img src={post.reviewerImage} alt={post.reviewer} className="fm-public-byline-avatar" />}
                <div>
                  <small>{isAr ? 'تمت المراجعة الطبية بواسطة' : 'Medically reviewed by'}</small>
                  <b>{post.reviewer}</b>
                  {post.reviewerRole && <span>{post.reviewerRole}</span>}
                </div>
              </div>
            )}
          </div>
        )}
        {post.featuredImage && <img className="fm-blog-hero" src={post.featuredImage} alt={displayTitle} />}
        <div className="fm-blog-content" dangerouslySetInnerHTML={{ __html: displayContent }} />
      </article>
    </main>
  );
}
