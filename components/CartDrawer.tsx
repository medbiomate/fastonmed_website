'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useApp } from '@/lib/context';
import { useLocale } from '@/lib/locale-context';

export default function CartDrawer() {
  const { locale, isArabic, localizeUrl } = useLocale();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartTax,
    cartShipping,
    cartGrandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = await applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const amountNeeded = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {isArabic ? 'سلة المشتريات' : 'Your Shopping Cart'}
            </h3>
            <span className="badge badge-primary">
              {cart.length} {isArabic ? 'منتجات' : 'items'}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label={isArabic ? 'إغلاق' : 'Close'}
          >
            <X size={22} />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div style={{ padding: '14px 24px', backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
            {amountNeeded > 0 ? (
              <span>
                {isArabic ? (
                  <>أضف بقيمة <strong style={{ color: 'var(--primary-dark)' }}>{amountNeeded.toLocaleString()} درهم</strong> إضافية للحصول على توصيل مجاني في الإمارات!</>
                ) : (
                  <>Add <strong style={{ color: 'var(--primary-dark)' }}>AED {amountNeeded.toLocaleString()}</strong> more for FREE UAE Delivery!</>
                )}
              </span>
            ) : (
              <span style={{ color: 'var(--status-success)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isArabic ? '🎉 لقد حصلت على توصيل مجاني لكافة مناطق الإمارات!' : '🎉 You have qualified for FREE UAE Delivery!'}
              </span>
            )}
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressToFreeShipping}%`,
                height: '100%',
                backgroundColor: 'var(--primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Items List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>Your cart is empty</h4>
              <p style={{ fontSize: '0.88rem', marginBottom: '20px' }}>Explore our range of UAE approved medical equipment.</p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      flexShrink: 0,
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '4px'
                    }}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        style={{ objectFit: 'contain' }}
                        unoptimized
                      />
                    ) : null}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          marginBottom: '4px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer', padding: '2px' }}
                        title="Remove"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {item.selectedAttributes && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        {Object.entries(item.selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                      </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      {/* Quantity Controls */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--border-color)',
                          borderRadius: 'var(--radius-pill)',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 6px' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          style={{ border: 'none', background: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Price */}
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        AED {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer & Checkout */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <input
                type="text"
                placeholder={isArabic ? 'رمز القسيمة (مثال: WELCOME10)' : 'Coupon code (e.g. WELCOME10)'}
                value={couponInput}
                onChange={e => setCouponInput(e.target.value)}
                className="form-control"
                style={{ padding: '8px 12px', fontSize: '0.85rem' }}
              />
              <button type="submit" className="btn btn-outline btn-sm">
                {isArabic ? 'تطبيق' : 'Apply'}
              </button>
            </form>

            {couponMsg && (
              <div style={{ fontSize: '0.8rem', color: couponMsg.error ? 'var(--status-danger)' : 'var(--status-success)', marginBottom: '10px' }}>
                {couponMsg.text}
              </div>
            )}

            {appliedCoupon && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-light)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Tag size={13} /> {appliedCoupon.code} {isArabic ? 'مُطبّقة' : 'applied'}
                </span>
                <button onClick={removeCoupon} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 700 }}>
                  {isArabic ? 'إزالة' : 'Remove'}
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{cartSubtotal.toLocaleString()} {isArabic ? 'درهم' : 'AED'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>{isArabic ? 'الشحن (الإمارات)' : 'Shipping (UAE)'}</span>
                <span>{cartShipping === 0 ? <strong style={{ color: 'var(--status-success)' }}>{isArabic ? 'مجاني' : 'FREE'}</strong> : `${cartShipping} ${isArabic ? 'درهم' : 'AED'}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>{isArabic ? 'ضريبة القيمة المضافة (5%)' : 'UAE VAT (5%)'}</span>
                <span>{cartTax.toLocaleString()} {isArabic ? 'درهم' : 'AED'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '4px' }}>
                <span>{isArabic ? 'المجموع الكلي' : 'Grand Total'}</span>
                <span style={{ color: 'var(--primary-dark)' }}>{cartGrandTotal.toLocaleString()} {isArabic ? 'درهم' : 'AED'}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href={localizeUrl('/checkout')}
              onClick={() => setIsCartOpen(false)}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <span>{isArabic ? 'المتابعة إلى إتمام الطلب' : 'Proceed to Checkout'}</span>
              <ArrowRight size={18} style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} color="var(--primary)" />
              <span>{isArabic ? 'دفع آمن ومعتمد متوافق مع معايير وزارة الصحة الإماراتية' : 'UAE Ministry of Health Compliant & Secure Checkout'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
