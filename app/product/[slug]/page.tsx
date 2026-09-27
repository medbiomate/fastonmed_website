import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getServerProductBySlug, getServerSimilarProducts } from '@/lib/server-catalog';
import ProductClientView from '@/components/ProductClientView';
import NotFound from '@/app/not-found';
import { translateEntityFields } from '@/lib/translation-service';

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

  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const enUrl = `https://www.fastonmed.com/product/${product.slug}`;
  const arUrl = `https://www.fastonmed.com/ar/product/${product.slug}`;
  const canonicalUrl = isAr ? arUrl : enUrl;

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
  const defaultEnSeoTitle = (product.seoTitle && product.seoTitle.trim().length > 0)
    ? product.seoTitle.trim()
    : `${product.name} in UAE | FastonMed`;

  // Manual SEO description overrides automatic default
  const defaultEnDescription = cleanDescription.length > 20
    ? `${cleanDescription} FastonMed is the Best Medical Equipment Supplier in UAE. Official warranty & fast delivery across UAE.`
    : `Buy ${product.name} from FastonMed, the Best Medical Equipment Supplier in UAE. Official distributor in DIP-1, Dubai with warranty and biomedical support.`;

  const defaultEnSeoDescription = (product.seoDescription && product.seoDescription.trim().length > 0)
    ? product.seoDescription.trim()
    : defaultEnDescription.slice(0, 160);

  let finalTitle = defaultEnSeoTitle;
  let finalDescription = defaultEnSeoDescription;

  if (isAr) {
    const arFields = await translateEntityFields('product', product.id || product.slug, {
      name: product.name,
      shortDescription: cleanDescription,
      seoTitle: defaultEnSeoTitle,
      seoDescription: defaultEnSeoDescription,
    }, 'ar');

    finalTitle = arFields.seoTitle || `${arFields.name} في الإمارات | فاستونميد`;
    finalDescription = arFields.seoDescription || defaultEnSeoDescription;
  }

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: [
      product.name,
      product.category,
      product.brand || 'FastonMed Partner',
      'Best Medical Equipment Supplier in UAE',
      'Medical Equipment Supplier in UAE',
      'Medical Equipment Dubai',
      'Healthcare Supplies UAE',
      'Buy Hospital Equipment Dubai',
      'Dubai Investments Park DIP',
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
      type: 'website',
      images: [
        {
          url: imgUrl,
          width: 800,
          height: 800,
          alt: `${product.name} - FastonMed UAE`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
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

  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const enUrl = `https://www.fastonmed.com/product/${product.slug}`;
  const arUrl = `https://www.fastonmed.com/ar/product/${product.slug}`;
  const canonicalUrl = isAr ? arUrl : enUrl;

  let displayProduct = product;
  if (isAr) {
    const arFields = await translateEntityFields('product', product.id || product.slug, {
      name: product.name,
      shortDescription: product.shortDescription || '',
      fullDescription: product.fullDescription || '',
    }, 'ar');

    displayProduct = {
      ...product,
      name: arFields.name || product.name,
      shortDescription: arFields.shortDescription || product.shortDescription,
      fullDescription: arFields.fullDescription || product.fullDescription,
    };
  }

  // Fetch similar products with intelligent keyword/category scoring
  const similarProducts = await getServerSimilarProducts(product, 4);

  const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
  const imgUrl = product.mainImage
    ? product.mainImage.startsWith('http')
      ? product.mainImage
      : `https://www.fastonmed.com${product.mainImage}`
    : 'https://www.fastonmed.com/fastonmed-logo.png';

  // 1. JSON-LD Product Schema (Strictly factual - no fabricated reviews or dummy prices)
  const productSchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayProduct.name,
    image: [imgUrl],
    description: (displayProduct.shortDescription || displayProduct.fullDescription || '').replace(/<[^>]*>?/gm, '').slice(0, 300),
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
        name: 'FASTONMED TRADING L.L.C',
        telephone: '+971508893589',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'OFF215 - Arjumand Building, Green Community Village, DIP-1',
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
        name: isAr ? 'الرئيسية' : 'Home',
        item: isAr ? 'https://www.fastonmed.com/ar' : 'https://www.fastonmed.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isAr ? 'المتجر' : 'Medical Catalog',
        item: isAr ? 'https://www.fastonmed.com/ar/shop' : 'https://www.fastonmed.com/shop'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.category || (isAr ? 'الأجهزة الطبية' : 'Medical Equipment'),
        item: `${isAr ? 'https://www.fastonmed.com/ar' : 'https://www.fastonmed.com'}/product-category/${(product.category || 'medical-equipment').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: displayProduct.name,
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
        name: `Is ${product.name} genuine and warranted for healthcare facilities in the UAE?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${product.name} is a 100% genuine medical product supplied with manufacturer warranty, calibration verification, and complete technical support across the UAE.`
        }
      },
      {
        '@type': 'Question',
        name: `What warranty and service comes with ${product.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FastonMed provides an official 1-year warranty along with certified biomedical calibration and maintenance from our DIP-1, Dubai engineering center.'
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
      <ProductClientView product={displayProduct} similarProducts={similarProducts} />
    </>
  );
}
