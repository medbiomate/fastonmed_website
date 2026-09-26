'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import QuickViewModal from '@/components/QuickViewModal';
import CompareDrawer from '@/components/CompareDrawer';
import QuoteModal from '@/components/QuoteModal';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const admin = usePathname().startsWith('/admin');
  if (admin) return <>{children}</>;
  return <><Navbar /><main style={{ minHeight: 'calc(100vh - 350px)' }}>{children}</main><Footer /><CartDrawer /><QuickViewModal /><CompareDrawer /><QuoteModal /><WhatsAppFloatingButton /></>;
}
