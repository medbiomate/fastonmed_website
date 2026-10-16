'use client';
import { useLocale } from '@/lib/locale-context';
import { publicArabic } from '@/lib/public-arabic';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchCatalog } from '@/lib/backend-client';
import type { Product } from '@/lib/types';
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
 const { isArabic, localizeUrl } = useLocale(); const ar = (text: string) => isArabic ? publicArabic(text) : text;
  const { wishlist, compareList, cart, cartGrandTotal, setIsCompareOpen } = useApp();
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (mode !== 'wishlist' || !wishlist.length) { setSavedProducts([]); return; }
    let active = true;
    setLoading(true);
    setLoadError(false);
    Promise.all(wishlist.map(id => fetchCatalog({ slug: id }).then(result => result.products[0])))
      .then(products => { if (active) setSavedProducts(products.filter((p): p is Product => Boolean(p))); })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [mode, wishlist, retry]);
  const itemCount = mode === 'wishlist' ? wishlist.length : mode === 'compare' ? compareList.length : mode === 'checkout' ? cart.length : 0;
  const Icon = copy[mode].icon;
  const orderText = encodeURIComponent(`Hello FastonMed Sales, I would like help with my ${mode}. ${mode === 'checkout' ? `My cart has ${cart.length} item(s), total AED ${cartGrandTotal.toLocaleString()}.` : ''}`);

  return <main style={{ background: '#f7faf9', minHeight: 620, padding: '70px 24px' }}>
    <section className="container" style={{ maxWidth: mode === 'wishlist' ? 1280 : 900 }}>
      <div style={{ background: '#fff', border: '1px solid #dfe9e5', borderRadius: 20, padding: mode === 'wishlist' ? 'clamp(20px,3vw,36px)' : 'clamp(30px,6vw,64px)', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, margin: '0 auto 22px', background: '#e5f6ef', color: '#238467', display: 'grid', placeItems: 'center' }}><Icon size={34}/></div>
        <h1 style={{ fontSize: mode === 'wishlist' ? 'clamp(1.8rem,4vw,2.6rem)' : 'clamp(2rem,5vw,3.5rem)', color: '#102c29', marginBottom: 12 }}>{ar(copy[mode].title)}</h1>
        <p style={{ color: '#60736e', lineHeight: 1.7, maxWidth: 650, margin: '0 auto 28px' }}>{ar(copy[mode].text)}</p>
        {(mode === 'wishlist' || mode === 'compare' || mode === 'checkout') && <p style={{ fontWeight: 800, color: '#238467', marginBottom: 24 }}>{isArabic ? `${itemCount} منتج مختار` : `${itemCount} item${itemCount === 1 ? '' : 's'} selected`}</p>}
        {mode === 'compare' && compareList.length > 0 && <button className="btn btn-primary" onClick={() => setIsCompareOpen(true)} style={{ marginRight: 10 }}>{ar("Open comparison")}</button>}
        {mode === 'checkout' && cart.length > 0 && <a className="btn btn-primary" href={`https://wa.me/971508893589?text=${orderText}`} target="_blank" rel="noreferrer" style={{ marginRight: 10 }}>{ar("Send order to Fastonmed")}</a>}
        {mode === 'wishlist' && wishlist.length > 0 && <div style={{ textAlign: 'left', marginBottom: 28 }}>
          {loading ? <p role="status">Loading saved products…</p> : loadError ? <div role="alert">Unable to load saved products. <button className="btn btn-outline" onClick={() => setRetry(n => n + 1)}>Try again</button></div> : <>
            <style>{`.wishlist-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:20px; }
@media(max-width:1100px) { .wishlist-grid {grid-template-columns:repeat(3,minmax(0,1fr));} }
@media(max-width:800px) { .wishlist-grid {grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;} }
@media(max-width:420px) { .wishlist-grid {grid-template-columns:1fr;} }
`}</style>
            <div className="wishlist-grid">
              {savedProducts.filter(product => wishlist.includes(product.id)).map(product => <ProductCard key={product.id} product={product} showActions />)}
            </div>
            {savedProducts.length < wishlist.length && <p role="status">Some saved products are no longer available in the catalog.</p>}
          </>}
        </div>}
        <Link href={localizeUrl("/shop")} className="btn btn-outline">{ar("Browse equipment")}</Link>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', color: '#60736e', marginTop: 30, fontSize: 14 }}><ShieldCheck size={18} color="#51b291"/>{ar("UAE sales and biomedical support")}</div>
      </div>
    </section>
  </main>;
}
