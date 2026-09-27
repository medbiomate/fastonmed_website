import type { Metadata } from 'next';
import NotFoundView from '@/components/NotFoundView';

export const metadata: Metadata = {
  title: '404 - Page Not Found | FastonMed Medical Equipment UAE',
  description:
    'The requested medical equipment or page was not found. Browse 2,720+ certified healthcare devices, ICU monitors, ventilators and hospital furniture at FastonMed.',
  robots: {
    index: false,
    follow: true
  }
};

export default function NotFound() {
  return <NotFoundView />;
}
