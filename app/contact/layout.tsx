import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contact Us | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Contact FastonMed, the Best Medical Equipment Supplier in UAE. Request fast quotations, turnkey hospital project consultations, and 24/7 biomedical engineering maintenance across Dubai, Abu Dhabi, and the Northern Emirates.',
  keywords: [
    'Contact FastonMed',
    'Best Medical Equipment Supplier in UAE',
    'Medical Equipment Inquiries Dubai',
    'Hospital Equipment Quotations UAE',
    'Biomedical Support Dubai Contact',
    'Healthcare Procurement Desk UAE'
  ],
  alternates: {
    canonical: 'https://www.fastonmed.com/contact'
  },
  openGraph: {
    title: 'Contact FastonMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Inquire now for certified hospital equipment, ICU systems, and clinical services.',
    url: 'https://www.fastonmed.com/contact',
    siteName: 'FastonMed Healthcare Equipment LLC',
    locale: 'en_AE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact FastonMed | Best Medical Equipment Supplier in UAE',
    description:
      'FastonMed: Best Medical Equipment Supplier in UAE. Reach our clinical sales and biomedical engineers in Dubai.'
  }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
