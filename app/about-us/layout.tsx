import type { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const canonicalUrl = isAr ? 'https://www.fastonmed.com/ar/about-us' : 'https://www.fastonmed.com/about-us';
  const title = isAr
    ? 'من نحن | أفضل مورد للمعدات الطبية في الإمارات | FastonMed'
    : 'About FastonMed | Best Medical Equipment Supplier in UAE | FastonMed';
  const description = isAr
    ? 'تعرف على فاستونميد (شركة فاستونميد للتجارة ش.ذ.م.م) - المورد الرائد للمعدات والأجهزة الطبية السريرية المعتمدة في دبي ودولة الإمارات العربية المتحدة.'
    : 'Learn about FastonMed, the Best Medical Equipment Supplier in UAE. Based in DIP-1, Dubai, supplying certified hospital equipment, ICU ventilators, diagnostics, and biomedical engineering services across the UAE.';

  return {
    title,
    description,
    keywords: [
      'About FastonMed',
      'Best Medical Equipment Supplier in UAE',
      'Medical Equipment Supplier Dubai',
      'Hospital Equipment Supplier UAE',
      'Biomedical Engineering Services UAE',
      'Dubai Investments Park DIP',
      'Certified Medical Devices UAE'
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

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
