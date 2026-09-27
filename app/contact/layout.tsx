import type { Metadata } from 'next';
import { headers } from 'next/headers';
import React from 'react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  const canonicalUrl = isAr ? 'https://www.fastonmed.com/ar/contact' : 'https://www.fastonmed.com/contact';
  const title = isAr
    ? 'اتصل بنا | أفضل مورد للمعدات الطبية في الإمارات | FastonMed'
    : 'Contact Us | Best Medical Equipment Supplier in UAE | FastonMed';
  const description = isAr
    ? 'تواصل مع المتخصصين في الهندسة الطبية الحيوية في فاستونميد دبي. اطلب عروض أسعار ودعم فني للمستشفيات والعيادات في الإمارات.'
    : 'Contact FastonMed, the Best Medical Equipment Supplier in UAE. Request fast quotations, turnkey hospital project consultations, and 24/7 biomedical engineering maintenance across Dubai, Abu Dhabi, and the Northern Emirates.';

  return {
    title,
    description,
    keywords: [
      'Contact FastonMed',
      'Best Medical Equipment Supplier in UAE',
      'Medical Equipment Inquiries Dubai',
      'Hospital Equipment Quotations UAE',
      'Biomedical Support Dubai Contact',
      'Healthcare Procurement Desk UAE'
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: 'https://www.fastonmed.com/contact',
        ar: 'https://www.fastonmed.com/ar/contact',
        'x-default': 'https://www.fastonmed.com/contact',
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

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
