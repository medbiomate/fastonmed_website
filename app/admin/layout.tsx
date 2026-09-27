import type { Metadata } from 'next';
import React from 'react';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  title: 'FastonMed Staff Administration Portal',
  description: 'Internal biomedical and catalog management system for FastonMed Healthcare Solutions.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1
    }
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
