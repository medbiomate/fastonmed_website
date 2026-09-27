import type { Metadata } from 'next';
import CustomerPage from '@/components/CustomerPage';

export const metadata: Metadata = {
  title: 'Customer Account & RFQ Portal | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Healthcare provider portal for managing equipment orders, RFQs, invoices, and biomedical warranties with FastonMed, the Best Medical Equipment Supplier in UAE.',
  robots: {
    index: false,
    follow: false
  }
};

export default function Page() {
  return <CustomerPage mode="account" />;
}
