import type { Metadata } from 'next';
import React from 'react';
import AdminClientLayout from './AdminClientLayout';

export const metadata: Metadata = {
  title: 'FastonMed Staff Administration Portal',
  description: 'Internal biomedical and catalog management system for FastonMed Healthcare Solutions.',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
