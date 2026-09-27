import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getAllProducts } from '@/lib/server-catalog';
import CategoryClientView from '@/components/CategoryClientView';
import { resolveSpecialtyConfig } from '@/lib/category-definitions';
import { translateEntityFields } from '@/lib/translation-service';

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const target = slug.at(-1)?.toLowerCase() || '';
  const specialty = resolveSpecialtyConfig(target);

  const formattedLabel = specialty
    ? specialty.title
    : target.replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const enUrl = `https://www.fastonmed.com/product-category/${slug.join('/')}`;
  const arUrl = `https://www.fastonmed.com/ar/product-category/${slug.join('/')}`;
  const canonicalUrl = isAr ? arUrl : enUrl;

  const defaultDescription = specialty?.description ||
    `Discover certified ${formattedLabel} from FastonMed, leading medical equipment supplier in UAE. Official UAE distribution, verified quality standards, and rapid delivery in Dubai & Abu Dhabi.`;

  let finalTitle = `${formattedLabel} in UAE | FastonMed`;
  let finalDescription = defaultDescription;

  if (isAr) {
    const arFields = await translateEntityFields('category', target, {
      title: formattedLabel,
      description: defaultDescription,
    }, 'ar');

    finalTitle = `${arFields.title || formattedLabel} في الإمارات | فاستونميد`;
    finalDescription = arFields.description || defaultDescription;
  }

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: [
      formattedLabel,
      `${formattedLabel} UAE`,
      `${formattedLabel} Dubai`,
      'Medical Equipment Supplier in UAE',
      'Hospital Supplies UAE',
      'FastonMed'
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': enUrl,
        'ar': arUrl,
        'x-default': enUrl,
      }
    },
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      url: canonicalUrl,
      siteName: 'FastonMed',
      locale: isAr ? 'ar_AE' : 'en_AE',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription
    }
  };
}

export default async function ProductCategoryPage({
  params
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const target = slug.at(-1)?.toLowerCase() || '';

  const specialty = resolveSpecialtyConfig(target);
  const all = await getAllProducts();

  let matchedProducts = [];

  if (specialty) {
    matchedProducts = all.filter((product) =>
      specialty.matches(product.category || '', product.name || '')
    );
  } else {
    const targetClean = target.replaceAll('-', ' ');
    matchedProducts = all.filter(
      (product) =>
        slugify(product.category || '') === target ||
        (product.category || '').toLowerCase() === targetClean ||
        (product.category || '').toLowerCase().includes(targetClean)
    );
  }

  // Sort so items with usable image appear first, then newest
  matchedProducts.sort((a, b) => {
    const imgA = a.mainImage && a.mainImage.length > 5 ? 1 : 0;
    const imgB = b.mainImage && b.mainImage.length > 5 ? 1 : 0;
    if (imgB !== imgA) return imgB - imgA;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const categoryTitle = specialty
    ? specialty.title
    : matchedProducts[0]?.category ||
      target.replaceAll('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const canonicalUrl = `https://www.fastonmed.com/product-category/${slug.join('/')}`;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.fastonmed.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: 'https://www.fastonmed.com/shop'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: categoryTitle,
        item: canonicalUrl
      }
    ]
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryTitle} in UAE | FastonMed`,
    url: canonicalUrl,
    description: specialty?.description || `Explore certified ${categoryTitle} available with official UAE warranty from FastonMed.`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: matchedProducts.length,
      itemListElement: matchedProducts.slice(0, 10).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: prod.name,
        url: `https://www.fastonmed.com/product/${prod.slug}`
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <CategoryClientView
        categoryTitle={categoryTitle}
        categorySlug={target}
        initialProducts={matchedProducts}
      />
    </>
  );
}
