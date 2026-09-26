import type { Metadata } from 'next';
import CustomerPage from '@/components/CustomerPage';

export const metadata: Metadata = {
  title: 'Track Medical Equipment Order | Best Medical Equipment Supplier in UAE | FastOnMed',
  description:
    'Track your medical equipment and clinical supplies delivery across Dubai, Abu Dhabi, Sharjah, and the UAE with FastOnMed, the Best Medical Equipment Supplier in UAE.',
  robots: {
    index: false,
    follow: true
  }
};

export default function Page() {
  return <CustomerPage mode="tracking" />;
}
