'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminTopHeader from '@/components/admin/AdminTopHeader';

export default function AdminClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/admin/login';

  if (isAuthPage) {
    return <main style={{ minHeight: '100vh', width: '100%' }}>{children}</main>;
  }

  return (
    <div className="tk-admin-shell">
      <AdminTopHeader />
      <div className="tk-admin-body">
        <Suspense fallback={<aside className="tk-admin-navigation" />}>
          <AdminSidebar />
        </Suspense>
        <section className="tk-admin-main">{children}</section>
      </div>
    </div>
  );
}
