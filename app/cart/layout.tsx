import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Shopping Cart | Best Medical Equipment Supplier in UAE | FastOnMed',
  description:
    'Review your medical equipment and clinical supplies cart with FastOnMed, the Best Medical Equipment Supplier in UAE. Direct WhatsApp order forwarding and clinical checkout.',
  robots: {
    index: false,
    follow: false
  }
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
