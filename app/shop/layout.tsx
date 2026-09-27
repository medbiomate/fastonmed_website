import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Shop Medical Equipment Online UAE | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Explore certified clinical devices from FastonMed, the Best Medical Equipment Supplier in UAE. Shop ICU ventilators, multiparameter patient monitors, electric hospital beds, diagnostic instruments, and consumables with official UAE warranty.',
  keywords: [
    'Shop Medical Equipment UAE',
    'Best Medical Equipment Supplier in UAE',
    'Buy Hospital Equipment Dubai',
    'Buy ICU Ventilators Online UAE',
    'Patient Monitors Supplier UAE',
    'Clinical Diagnostic Tools Dubai',
    'Medical Supplies UAE Online'
  ],
  alternates: {
    canonical: 'https://www.fastonmed.com/shop'
  },
  openGraph: {
    title: 'Shop Medical Equipment Online UAE | Best Medical Equipment Supplier in UAE',
    description:
      'FastonMed is the Best Medical Equipment Supplier in UAE. Browse over 2,700 certified hospital devices, diagnostic tools, and clinical consumables.',
    url: 'https://www.fastonmed.com/shop',
    siteName: 'FastonMed Healthcare Equipment LLC',
    locale: 'en_AE',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Medical Equipment Online UAE | Best Medical Equipment Supplier in UAE',
    description:
      'Order clinical medical equipment online from FastonMed, the Best Medical Equipment Supplier in UAE. MoHAP compliant, official warranty, fast delivery.'
  }
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
