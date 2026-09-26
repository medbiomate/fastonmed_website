import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'About Us | Best Medical Equipment Supplier in UAE | FastOnMed',
  description:
    'Learn about FastOnMed, the Best Medical Equipment Supplier in UAE. Based in Dubai Healthcare City (DHCC), supplying MoHAP & DHA compliant hospital equipment, ICU ventilators, diagnostics, and biomedical engineering services across the UAE.',
  keywords: [
    'About FastOnMed',
    'Best Medical Equipment Supplier in UAE',
    'Medical Equipment Supplier Dubai',
    'Hospital Equipment Supplier UAE',
    'Biomedical Engineering Services UAE',
    'Dubai Healthcare City DHCC',
    'MoHAP Approved Medical Devices'
  ],
  alternates: {
    canonical: 'https://www.fastonmed.com/about-us'
  },
  openGraph: {
    title: 'About Us | Best Medical Equipment Supplier in UAE | FastOnMed',
    description:
      'FastOnMed is the Best Medical Equipment Supplier in UAE. Discover our biomedical expertise, DHA/MoHAP certified equipment, and clinical support across the UAE.',
    url: 'https://www.fastonmed.com/about-us',
    siteName: 'FastOnMed Healthcare Equipment LLC',
    locale: 'en_AE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Best Medical Equipment Supplier in UAE | FastOnMed',
    description:
      'FastOnMed is the Best Medical Equipment Supplier in UAE. Providing hospital equipment, ICU ventilators, and biomedical engineering in Dubai & Abu Dhabi.'
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
