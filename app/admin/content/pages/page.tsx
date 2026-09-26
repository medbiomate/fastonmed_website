import { Suspense } from 'react';
import PageManager from '@/components/admin/PageManager';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams
}: {
  searchParams?: Promise<{ type?: string }>;
}) {
  const sParams = searchParams ? await searchParams : {};
  return (
    <Suspense fallback={<div style={{ padding: '24px', color: '#64748b' }}>Loading pages...</div>}>
      <PageManager mode="list" initialType={sParams.type} />
    </Suspense>
  );
}
