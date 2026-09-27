import type { Metadata } from 'next';
import CustomerPage from '@/components/CustomerPage';

export const metadata: Metadata = {
  title: 'Saved Medical Equipment Wishlist | Best Medical Equipment Supplier in UAE | FastonMed',
  description:
    'Review your saved hospital equipment and medical technology wishlist at FastonMed, the Best Medical Equipment Supplier in UAE. Request batch quotes for saved devices.',
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: 'https://www.fastonmed.com/wishlist'
  }
};

export default function Page() {
  return <CustomerPage mode="wishlist" />;
}
