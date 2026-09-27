import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fastonmed.com'),
  title: {
    default: 'FastonMed | Best Medical Equipment Supplier in UAE',
    template: '%s'
  },
  description:
    'FastonMed is the Best Medical Equipment Supplier in UAE. MoHAP & DHA licensed biomedical technology, ICU ventilators, hospital furniture & clinical devices.',
  keywords: [
    'Best Medical Equipment Supplier in UAE',
    'Medical Equipment Supplier in UAE',
    'Medical Equipment Supplier Dubai',
    'Medical Equipment Supplier Abu Dhabi',
    'Biomedical Equipment UAE',
    'Hospital Equipment Supplier UAE',
    'ICU Ventilators UAE',
    'Patient Monitoring Systems UAE',
    'Clinical Diagnostic Equipment Dubai',
    'MoHAP Licensed Medical Supplier',
    'FastonMed Healthcare UAE'
  ],
  authors: [{ name: 'FastonMed Healthcare Equipment LLC' }],
  creator: 'FastonMed Healthcare Solutions',
  publisher: 'FastonMed Healthcare Solutions',
  alternates: {
    canonical: 'https://www.fastonmed.com'
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.fastonmed.com',
    siteName: 'FastonMed Healthcare Equipment LLC',
    title: 'FastonMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Providing MoHAP & DHA approved hospital supplies, ICU ventilators, patient monitors, and biomedical support.',
    images: [
      {
        url: 'https://www.fastonmed.com/fastonmed-logo.png',
        width: 1200,
        height: 630,
        alt: 'FastonMed - Best Medical Equipment Supplier in UAE'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastonMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Official warranty, same-day delivery across UAE, and biomedical technical support.',
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
  name: 'FastonMed Healthcare Equipment & Medical Solutions LLC',
  url: 'https://www.fastonmed.com',
  logo: 'https://www.fastonmed.com/fastonmed-logo.png',
  image: 'https://www.fastonmed.com/fastonmed-logo.png',
  description:
    'Distributor of certified healthcare equipment, hospital furniture, diagnostic devices, and biomedical calibration in the UAE.',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <AppProvider>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
