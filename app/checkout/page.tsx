import type { Metadata } from 'next';
import CustomerPage from '@/components/CustomerPage';

export const metadata: Metadata = {
  title: 'Secure Checkout | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Complete your clinical order and healthcare procurement securely with FastonMed, the Best Medical Equipment Supplier in UAE. Direct institutional invoice and delivery options.',
  robots: {
    index: false,
    follow: false
  }
};

export default function Page() {
  return <CustomerPage mode="checkout" />;
}
