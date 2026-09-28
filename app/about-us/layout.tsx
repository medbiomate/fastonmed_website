import type { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const canonicalUrl = isAr ? 'https://www.fastonmed.com/ar/about-us' : 'https://www.fastonmed.com/about-us';
  const title = isAr
    ? 'من نحن | شركة فاستونميد للتجارة ش.ذ.م.م | مبيعات وصيانة الأجهزة الطبية في الإمارات'
    : 'About FastonMed Trading L.L.C | Medical Equipment Sales & Biomedical Services UAE';
  const description = isAr
    ? 'تعرف على شركة فاستونميد للتجارة ش.ذ.م.م (مجمع دبي للاستثمار) - المورد الرائد لمبيعات وتوريد الأجهزة والمعدات الطبية السريرية وخدمات الهندسة الطبية الحيوية، المعايرة، وعقود الصيانة الوقائية للمستشفيات والعيادات في دبي والإمارات.'
    : 'FastonMed (FASTONMED TRADING L.L.C) is a premier UAE supplier of medical equipment sales and biomedical engineering services based in Dubai Investments Park. Supplying hospitals, clinics, and ICU centers with certified medical technology, calibration, and AMC contracts across Dubai, Abu Dhabi, and the GCC.';

  return {
    title,
    description,
    keywords: [
      'About FastonMed',
      'Fastonmed Trading L.L.C',
      'Medical Equipment Sales Dubai',
      'Medical Equipment Supplier in UAE',
      'Hospital Equipment Supplier UAE',
      'Biomedical Engineering Services UAE',
      'Medical Equipment Calibration Dubai',
      'Preventive Maintenance AMC UAE',
      'Ultrasound Probe Repair UAE',
      'ICU Ventilators UAE',
      'Pharmacy Refrigerators Dubai',
      'Certified Medical Devices UAE',
      'Dubai Investments Park DIP'
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://www.fastonmed.com/about-us',
        ar: 'https://www.fastonmed.com/ar/about-us',
        'x-default': 'https://www.fastonmed.com/about-us',
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

export default async function AboutLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': ['MedicalBusiness', 'MedicalOrganization'],
    'name': isAr ? 'شركة فاستونميد للتجارة ش.ذ.م.م' : 'FASTONMED TRADING L.L.C',
    'alternateName': ['FastonMed', 'FastonMed UAE', 'فاستونميد'],
    'url': isAr ? 'https://www.fastonmed.com/ar/about-us' : 'https://www.fastonmed.com/about-us',
    'logo': 'https://www.fastonmed.com/fastonmed_logo_official.png',
    'image': 'https://www.fastonmed.com/fastonmed_logo_official.png',
    'description': isAr
      ? 'شركة فاستونميد للتجارة ش.ذ.م.م متخصصة في مبيعات وتوزيع المعدات الطبية السريرية، أجهزة العناية المركزة، التبريد المخبري وسلسلة التبريد، وخدمات الهندسة الطبية الحيوية والمعايرة وعقود الصيانة الوقائية في دولة الإمارات العربية المتحدة.'
      : 'FastonMed (FASTONMED TRADING L.L.C) specializes in capital medical equipment sales, ICU & hospital technologies, cold-chain refrigeration, and certified biomedical engineering, calibration, and preventive maintenance services across the UAE.',
    'telephone': '+971 50 889 3589',
    'email': 'sales@fastonmed.com',
    'taxID': '105373862900003',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'OFF215 - Arjumand Building, Green Community Village, DIP-1',
      'addressLocality': 'Dubai Investments Park',
      'addressRegion': 'Dubai',
      'addressCountry': 'AE'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '24.9880',
      'longitude': '55.1840'
    },
    'areaServed': [
      'Dubai',
      'Abu Dhabi',
      'Sharjah',
      'Ajman',
      'Ras Al Khaimah',
      'Fujairah',
      'Umm Al Quwain',
      'United Arab Emirates',
      'GCC'
    ],
    'knowsAbout': [
      'Medical Equipment Sales',
      'Biomedical Engineering Services',
      'Medical Device Calibration',
      'Preventive Maintenance AMC & CMC',
      'Ultrasound Probe Repair',
      'ICU & Critical Care Equipment',
      'Pharmacy Cold-Chain Storage',
      'Hospital Furniture & Operating Theatre Setup'
    ],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Medical Equipment Sales & Biomedical Services',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Medical Equipment Sales & Hospital Distribution'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Biomedical Equipment Calibration & Safety Testing'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Preventive Maintenance AMC & CMC Contracts'
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': 'Ultrasound Probe & Endoscope Repair'
          }
        }
      ]
    },
    'sameAs': [
      'https://www.linkedin.com/company/fastonmed',
      'https://www.instagram.com/fastonmed',
      'https://www.facebook.com/fastonmed',
      'https://www.youtube.com/@fastonmed'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {children}
    </>
  );
}
