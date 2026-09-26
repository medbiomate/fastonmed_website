import ProductManager from '@/components/admin/ProductManager';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams
}: {
  searchParams?: Promise<{ status?: 'all' | 'published' | 'draft' | 'trash' }>;
}) {
  const sParams = searchParams ? await searchParams : {};
  return <ProductManager mode="list" initialStatus={sParams.status || 'published'} />;
}
