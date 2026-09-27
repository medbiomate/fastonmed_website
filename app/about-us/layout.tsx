import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'About Us | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Learn about FastonMed, the Best Medical Equipment Supplier in UAE. Based in Dubai Healthcare City (DHCC), supplying certified hospital equipment, ICU ventilators, diagnostics, and biomedical engineering services across the UAE.',
  keywords: [
    'About FastonMed',
    'Best Medical Equipment Supplier in UAE',
    'Medical Equipment Supplier Dubai',
    'Hospital Equipment Supplier UAE',
    'Biomedical Engineering Services UAE',
    'Dubai Healthcare City DHCC',
    'Certified Medical Devices UAE'
  ],
  alternates: {
    canonical: 'https://www.fastonmed.com/about-us'
  },
  openGraph: {
    title: 'About Us | Best Medical Equipment Supplier in UAE | FastonMed',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Discover our biomedical expertise, certified clinical equipment, and dedicated support across the UAE.',
    url: 'https://www.fastonmed.com/about-us',
    siteName: 'FastonMed',
    locale: 'en_AE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Us | Best Medical Equipment Supplier in UAE | FastonMed',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Providing hospital equipment, ICU ventilators, and biomedical engineering in Dubai & Abu Dhabi.'
  }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
