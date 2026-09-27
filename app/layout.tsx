import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fastonmed.com'),
  title: {
    default: 'Medical Equipment Supplier in UAE & Dubai | FastonMed',
    template: '%s'
  },
  description:
    'FastonMed is a leading medical equipment supplier in UAE & Dubai. Supplying hospitals, clinics, and healthcare facilities with certified biomedical devices, ICU systems, and medical supplies.',
  keywords: [
    'Medical Equipment Supplier in UAE',
    'Medical Equipment Dubai',
    'Hospital Equipment UAE',
    'Healthcare Equipment UAE',
    'Medical Supplies UAE',
    'Biomedical Equipment UAE',
    'FastonMed'
  ],
  authors: [{ name: 'FastonMed' }],
  creator: 'FastonMed',
  publisher: 'FastonMed',
  alternates: {
    canonical: 'https://www.fastonmed.com'
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.fastonmed.com',
    siteName: 'FastonMed',
    title: 'Medical Equipment Supplier in UAE & Dubai | FastonMed',
    description:
      'FastonMed is a leading medical equipment supplier in UAE & Dubai. Supplying hospitals, clinics, and healthcare facilities with certified biomedical devices, ICU systems, and medical supplies.',
    images: [
      {
        url: 'https://www.fastonmed.com/fastonmed-logo.png',
        width: 1200,
        height: 630,
        alt: 'FastonMed - Medical Equipment Supplier in UAE'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Medical Equipment Supplier in UAE & Dubai | FastonMed',
    description:
      'FastonMed is a leading medical equipment supplier in UAE & Dubai. Official warranty, fast delivery across UAE, and biomedical technical support.',
    images: ['https://www.fastonmed.com/fastonmed-logo.png']
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' }
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

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  name: 'FastonMed',
  legalName: 'FASTONMED TRADING L.L.C',
  alternateName: 'فاستونميد للتجارة ذ.م.م',
  vatID: '105373862900003',
  taxID: '105373862900003',
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
    'Supplier and distributor of certified healthcare equipment, hospital furniture, diagnostic devices, and biomedical calibration in the UAE.',
  telephone: '+971508893589',
  email: 'info@fastonmed.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Dubai Healthcare City (DHCC)',
    addressLocality: 'Dubai',
    addressRegion: 'Dubai',
    addressCountry: 'AE'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 25.2343,
    longitude: 55.3217
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:30',
      closes: '18:00'
    }
  ],
  priceRange: 'AED 50 - AED 150000',
  currenciesAccepted: 'AED'
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FastonMed',
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

import { headers } from 'next/headers';
import { LocaleProvider } from '@/lib/locale-context';

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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="alternate" hrefLang="en" href="https://www.fastonmed.com" />
        <link rel="alternate" hrefLang="ar" href="https://www.fastonmed.com/ar" />
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
          <LocaleProvider>
            <SiteShell>{children}</SiteShell>
          </LocaleProvider>
        </AppProvider>
      </body>
    </html>
  );
}
