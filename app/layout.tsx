import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';
import SiteShell from '@/components/SiteShell';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.fastonmed.com'),
  title: {
    default: 'FastOnMed | Best Medical Equipment Supplier in UAE',
    template: '%s'
  },
  description:
    'FastOnMed is the Best Medical Equipment Supplier in UAE. Trusted distributor of MoHAP & DHA licensed biomedical technology, ICU ventilators, patient monitors, hospital furniture, and clinical equipment in Dubai, Abu Dhabi, and across the UAE.',
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
    'FastOnMed Healthcare UAE'
  ],
  authors: [{ name: 'FastOnMed Healthcare Equipment LLC' }],
  creator: 'FastOnMed Healthcare Solutions',
  publisher: 'FastOnMed Healthcare Solutions',
  alternates: {
    canonical: 'https://www.fastonmed.com'
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://www.fastonmed.com',
    siteName: 'FastOnMed Healthcare Equipment LLC',
    title: 'FastOnMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastOnMed is the Best Medical Equipment Supplier in UAE. Providing MoHAP & DHA approved hospital supplies, ICU ventilators, patient monitors, and biomedical support across Dubai and the UAE.',
    images: [
      {
        url: 'https://www.fastonmed.com/fastonmed-logo.png',
        width: 1200,
        height: 630,
        alt: 'FastOnMed - Best Medical Equipment Supplier in UAE'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FastOnMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastOnMed is the Best Medical Equipment Supplier in UAE. Official warranty, same-day delivery across UAE, and biomedical technical support.',
    images: ['https://www.fastonmed.com/fastonmed-logo.png']
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
  name: 'FastOnMed Healthcare Equipment & Medical Solutions LLC',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <AppProvider>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
