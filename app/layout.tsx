import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/SiteShell';

import { headers } from 'next/headers';
import { LocaleProvider } from '@/lib/locale-context';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const locale = headersList.get('x-locale') === 'ar' ? 'ar' : 'en';
  const isAr = locale === 'ar';

  const titleEn = 'Best Medical Equipment Supplier in UAE | Fastonmed';
  const titleAr = 'مورد الأجهزة والمعدات الطبية في الإمارات | فاستونميد';

  const descEn =
    'FastOnMed supplies medical equipment, ICU systems, patient monitors, hospital furniture and biomedical support across Dubai and the UAE. Request a quote.';
  const descAr =
    'توفر فاستونميد الأجهزة الطبية وأنظمة العناية المركزة وشاشات مراقبة المرضى وأثاث المستشفيات والدعم الهندسي الطبي في دبي والإمارات. اطلب عرض أسعار.';

  const canonicalUrl = isAr ? 'https://www.fastonmed.com/ar' : 'https://www.fastonmed.com';

  return {
    metadataBase: new URL('https://www.fastonmed.com'),
    title: {
      default: isAr ? titleAr : titleEn,
      template: '%s'
    },
    description: isAr ? descAr : descEn,
    keywords: [
      'Medical Equipment Supplier UAE',
      'Biomedical Solutions UAE',
      'Hospital Equipment Dubai',
      'ICU Systems UAE',
      'Patient Monitors UAE',
      'Medical Furniture Dubai',
      'FastOnMed',
      'مورد أجهزة طبية الإمارات'
    ],
    authors: [{ name: 'FastonMed' }],
    creator: 'FastonMed',
    publisher: 'FastonMed',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-AE': 'https://www.fastonmed.com',
        'ar-AE': 'https://www.fastonmed.com/ar',
        'x-default': 'https://www.fastonmed.com'
      }
    },
    openGraph: {
      type: 'website',
      locale: isAr ? 'ar_AE' : 'en_AE',
      url: canonicalUrl,
      siteName: 'FastonMed',
      title: isAr ? titleAr : titleEn,
      description: isAr ? descAr : descEn,
      images: [
        {
          url: 'https://www.fastonmed.com/fastonmed-logo.png',
          width: 1200,
          height: 630,
          alt: isAr ? 'فاستونميد - مورد الأجهزة والمعدات الطبية في الإمارات' : 'FastonMed - Medical Equipment & Biomedical Solutions UAE'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: isAr ? titleAr : titleEn,
      description: isAr ? descAr : descEn,
      images: ['https://www.fastonmed.com/fastonmed-logo.png']
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
        { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
        { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
        { url: '/favicon.svg', type: 'image/svg+xml' }
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
      ],
      shortcut: '/favicon.ico'
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

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': ['MedicalBusiness', 'OnlineStore'],
  name: 'FastonMed',
  legalName: 'FASTONMED TRADING L.L.C',
  alternateName: ['فاستونميد للتجارة ذ.م.م', 'FastOnMed'],
  vatID: '105373862900003',
  taxID: '105373862900003',
  foundingDate: '2025',
  identifier: [
    {
      '@type': 'PropertyValue',
      name: 'Commercial License Number',
      value: '1606077'
    },
    {
      '@type': 'PropertyValue',
      name: 'Commercial Register Number',
      value: '2818619'
    },
    {
      '@type': 'PropertyValue',
      name: 'Tax Registration Number (TRN)',
      value: '105373862900003'
    }
  ],
  url: 'https://www.fastonmed.com',
  logo: 'https://www.fastonmed.com/fastonmed-logo.png',
  image: 'https://www.fastonmed.com/fastonmed-logo.png',
  description:
    'FastOnMed supplies medical equipment, biomedical systems, and clinical solutions to hospitals, clinics, and healthcare facilities across the UAE.',
  telephone: '+971508893589',
  email: 'sales@fastonmed.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'OFF215 - Arjumand Building, Green Community Village, DIP-1',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.0062,
    longitude: 55.1764
  },
  areaServed: {
    '@type': 'Country',
    name: 'United Arab Emirates'
  },
  sameAs: [
    'https://www.linkedin.com/company/fastonmed',
    'https://www.instagram.com/fastonmed',
    'https://www.facebook.com/fastonmed',
    'https://www.youtube.com/@fastonmed',
    'https://wa.me/971508893589'
  ],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+971508893589',
      contactType: 'sales',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic']
    },
    {
      '@type': 'ContactPoint',
      telephone: '+971508893586',
      contactType: 'technical support',
      areaServed: 'AE',
      availableLanguage: ['English', 'Arabic']
    }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:30',
      closes: '18:00'
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00'
    }
  ],
  priceRange: 'AED 50 - AED 150000',
  currenciesAccepted: 'AED'
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FastonMed',
  alternateName: 'FastOnMed UAE',
  url: 'https://www.fastonmed.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.fastonmed.com/shop?search={search_term_string}'
    },
    'query-input': 'required name=search_term_string'
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList.get('x-locale') === 'ar' ? 'ar' : 'en';
  const isAr = locale === 'ar';

  return (
    <html lang={isAr ? 'ar' : 'en'} dir={isAr ? 'rtl' : 'ltr'} className={isAr ? 'rtl-arabic' : ''}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="en-AE" href="https://www.fastonmed.com" />
        <link rel="alternate" hrefLang="ar-AE" href="https://www.fastonmed.com/ar" />
        <link rel="alternate" hrefLang="x-default" href="https://www.fastonmed.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body style={{ fontFamily: isAr ? "'Cairo', 'Tajawal', Arial, sans-serif" : 'Arial, Helvetica, sans-serif' }}>
        <AppProvider>
          <LocaleProvider initialLocale={locale}>
            <SiteShell>{children}</SiteShell>
          </LocaleProvider>
        </AppProvider>
      </body>
    </html>
  );
}
