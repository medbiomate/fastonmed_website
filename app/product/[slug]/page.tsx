import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerProductBySlug, getServerSimilarProducts } from '@/lib/server-catalog';
import ProductClientView from '@/components/ProductClientView';
import NotFound from '@/app/not-found';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);

  if (!product) {
    return {
      title: 'Medical Equipment Product Not Found | FastonMed Dubai',
      description: 'The requested healthcare product could not be found in the FastonMed medical catalog.',
      robots: { index: false, follow: true }
    };
  }

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const imgUrl = product.mainImage
    ? product.mainImage.startsWith('http')
      ? product.mainImage
      : `https://www.fastonmed.com${product.mainImage}`
    : 'https://www.fastonmed.com/fastonmed-logo.png';

  const cleanDescription = (product.shortDescription || product.fullDescription || '')
    .replace(/<[^>]*>?/gm, '')
    .slice(0, 155);

  // Manual SEO title overrides automatic default
  const seoTitle = (product.seoTitle && product.seoTitle.trim().length > 0)
    ? product.seoTitle.trim()
    : `${product.name} in UAE | FastonMed`;

  // Manual SEO description overrides automatic default
  const defaultDescription = cleanDescription.length > 20
    ? `${cleanDescription} FastonMed is the Best Medical Equipment Supplier in UAE. Official warranty & fast delivery across UAE.`
    : `Buy ${product.name} from FastonMed, the Best Medical Equipment Supplier in UAE. Official distributor in Dubai Healthcare City (DHCC) with warranty and biomedical support.`;

  const seoDescription = (product.seoDescription && product.seoDescription.trim().length > 0)
    ? product.seoDescription.trim()
    : defaultDescription.slice(0, 160);

  const canonicalUrl = (product.canonicalUrl && product.canonicalUrl.trim().length > 0)
    ? product.canonicalUrl.trim()
    : `https://www.fastonmed.com/product/${product.slug}`;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      product.name,
      product.category,
      product.brand || 'FastonMed Partner',
      'Best Medical Equipment Supplier in UAE',
      'Medical Equipment Supplier in UAE',
      'Medical Equipment Dubai',
      'Healthcare Supplies UAE',
      'Buy Hospital Equipment Dubai',
      'Dubai Healthcare City DHCC',
      'FastonMed'
    ],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      siteName: 'FastonMed Healthcare Equipment LLC',
      locale: 'en_AE',
      type: 'website',
      images: [
        {
          url: imgUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - FastonMed Healthcare UAE`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imgUrl]
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    }
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getServerProductBySlug(slug);

  if (!product) return <NotFound />;

  // Fetch similar products with intelligent keyword/category scoring
  const similarProducts = await getServerSimilarProducts(product, 4);

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const canonicalUrl = (product.canonicalUrl && product.canonicalUrl.trim().length > 0)
    ? product.canonicalUrl.trim()
    : `https://www.fastonmed.com/product/${product.slug}`;
  const imgUrl = product.mainImage
    ? product.mainImage.startsWith('http')
      ? product.mainImage
      : `https://www.fastonmed.com${product.mainImage}`
    : 'https://www.fastonmed.com/fastonmed-logo.png';

  // 1. JSON-LD Product Schema (Strictly factual - no fabricated reviews or dummy prices)
  const productSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [imgUrl],
    description: (product.shortDescription || product.fullDescription || '').replace(/<[^>]*>?/gm, '').slice(0, 300),
    sku: product.sku || product.id,
    mpn: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'FastonMed Partner'
    },
    category: product.category,
  };

  // Only include offer when a genuine price exists
  if (price && price > 0) {
    productSchema.offers = {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'AED',
      price: price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.stockStatus === 'out_of_stock' ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      seller: {
        '@type': 'MedicalBusiness',
        name: 'FastonMed Healthcare Equipment LLC',
        telephone: '+971508893589',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Dubai Healthcare City (DHCC)',
          addressLocality: 'Dubai',
          addressCountry: 'AE'
        }
      }
    };
  }

  // Only include aggregateRating when genuine reviews exist
  if (product.rating && product.reviewCount && product.reviewCount > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount.toString(),
      bestRating: '5',
      worstRating: '1'
    };
  }

  // 2. JSON-LD Breadcrumbs Schema
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
        name: 'Medical Catalog',
        item: 'https://www.fastonmed.com/shop'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category || 'Medical Equipment',
        item: `https://www.fastonmed.com/product-category/${(product.category || 'medical-equipment').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: canonicalUrl
      }
    ]
  };

  // 3. JSON-LD FAQs Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${product.name} approved by UAE health authorities?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${product.name} is distributed in compliance with UAE Ministry of Health & Prevention (MoHAP), Dubai Health Authority (DHA), and Department of Health (DoH) healthcare equipment regulations.`
        }
      },
      {
        '@type': 'Question',
        name: `What warranty and service comes with ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FastonMed provides an official 1-year warranty along with certified biomedical calibration and maintenance from our Dubai Healthcare City engineering center.'
        }
      },
      {
        '@type': 'Question',
        name: 'How fast is delivery across Dubai and UAE?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Standard delivery for stocked items is completed within 24 to 48 hours across Dubai, Abu Dhabi, Sharjah, and all northern Emirates.'
        }
      }
    ]
  };

  return (
    <>
      {/* Structured Data for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Interactive Client Component */}
      <ProductClientView product={product} similarProducts={similarProducts} />
    </>
  );
}
