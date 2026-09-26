import { Suspense } from 'react';
import BlogManager from '@/components/admin/BlogManager';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: '24px', color: '#64748b' }}>Loading categories...</div>}>
      <BlogManager mode="categories" />
    </Suspense>
  );
}
