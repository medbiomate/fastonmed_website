'use client';

import Link from 'next/link';
import { Heart, Layers3, PackageSearch, ShieldCheck, ShoppingBag, UserRound } from 'lucide-react';
import { useApp } from '@/lib/context';

type Mode = 'wishlist' | 'compare' | 'checkout' | 'account' | 'tracking';

const copy = {
  wishlist: { title: 'Your Wishlist', text: 'Products saved for later appear here on this device.', icon: Heart },
  compare: { title: 'Compare Equipment', text: 'Review selected medical equipment side by side before requesting a quotation.', icon: Layers3 },
  checkout: { title: 'Secure Checkout', text: 'Review your medical equipment order and send it directly to our UAE sales team.', icon: ShoppingBag },
  account: { title: 'My Account', text: 'Customer account access is being prepared. Our sales team can assist with quotations and order documents now.', icon: UserRound },
  tracking: { title: 'Order Tracking', text: 'Enter your Fastonmed quotation or order reference when contacting our team for a live delivery update.', icon: PackageSearch }
} as const;

export default function CustomerPage({ mode }: { mode: Mode }) {
  const { wishlist, compareList, cart, cartGrandTotal, setIsCompareOpen } = useApp();
  const itemCount = mode === 'wishlist' ? wishlist.length : mode === 'compare' ? compareList.length : mode === 'checkout' ? cart.length : 0;
  const Icon = copy[mode].icon;
  const orderText = encodeURIComponent(`Hello FastOnMed Sales, I would like help with my ${mode}. ${mode === 'checkout' ? `My cart has ${cart.length} item(s), total AED ${cartGrandTotal.toLocaleString()}.` : ''}`);

  return <main style={{ background: '#f7faf9', minHeight: 620, padding: '70px 24px' }}>
    <section className="container" style={{ maxWidth: 900 }}>
      <div style={{ background: '#fff', border: '1px solid #dfe9e5', borderRadius: 20, padding: 'clamp(30px,6vw,64px)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 22px', background: '#e5f6ef', color: '#238467', display: 'grid', placeItems: 'center' }}><Icon size={34}/></div>
        <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', color: '#102c29', marginBottom: 12 }}>{copy[mode].title}</h1>
        <p style={{ color: '#60736e', lineHeight: 1.7, maxWidth: 650, margin: '0 auto 28px' }}>{copy[mode].text}</p>
        {(mode === 'wishlist' || mode === 'compare' || mode === 'checkout') && <p style={{ fontWeight: 800, color: '#238467', marginBottom: 24 }}>{itemCount} item{itemCount === 1 ? '' : 's'} selected</p>}
        {mode === 'compare' && compareList.length > 0 && <button className="btn btn-primary" onClick={() => setIsCompareOpen(true)} style={{ marginRight: 10 }}>Open comparison</button>}
        {mode === 'checkout' && cart.length > 0 && <a className="btn btn-primary" href={`https://wa.me/971508893589?text=${orderText}`} target="_blank" rel="noreferrer" style={{ marginRight: 10 }}>Send order to Fastonmed</a>}
        <Link href="/shop" className="btn btn-outline">Browse equipment</Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', color: '#60736e', marginTop: 30, fontSize: 14 }}><ShieldCheck size={18} color="#51b291"/> UAE sales and biomedical support</div>
      </div>
    </section>
  </main>;
}
