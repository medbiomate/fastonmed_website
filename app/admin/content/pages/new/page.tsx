import PageManager from '@/components/admin/PageManager';

export const dynamic = 'force-dynamic';

export default function NewPage() {
  return <PageManager mode="editor" isNew={true} />;
}
