import type { Metadata } from 'next';
import { headers } from 'next/headers';
import ContactClientView from '@/components/ContactClientView';

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
    : 'Speak with our clinical specialists in Dubai, UAE. Request equipment pricing, clinical demonstration, or biomedical service support.';

  return {
    title,
    description,
    keywords: [
      'Contact FastonMed',
      'FastonMed Dubai Phone',
      'Medical Equipment Inquiry UAE',
      'Biomedical Support Dubai',
      'FASTONMED TRADING L.L.C'
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
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export default async function ContactPage() {
  const headersList = await headers();
  const isAr = headersList.get('x-locale') === 'ar';
  return <ContactClientView isAr={isAr} />;
}
