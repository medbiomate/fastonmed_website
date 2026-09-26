import type { Metadata } from 'next';
import CustomerPage from '@/components/CustomerPage';

export const metadata: Metadata = {
  title: 'Compare Medical Equipment | Best Medical Equipment Supplier in UAE | FastOnMed',
  description:
    'Compare technical specifications, biomedical features, and official warranty parameters across medical devices with FastOnMed, the Best Medical Equipment Supplier in UAE.',
  alternates: {
    canonical: 'https://www.fastonmed.com/compare'
  }
};

export default function Page() {
  return <CustomerPage mode="compare" />;
}
