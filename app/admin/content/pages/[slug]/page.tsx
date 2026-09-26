import PageManager from '@/components/admin/PageManager';

export const dynamic = 'force-dynamic';

export default async function EditPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PageManager mode="editor" pageSlug={slug} />;
}
