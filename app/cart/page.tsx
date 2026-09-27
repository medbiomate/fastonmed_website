'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingBag, MessageCircle } from 'lucide-react';

export default function CartPage() {
  const { cart, updateCartQuantity, removeFromCart, cartSubtotal, cartTax, cartGrandTotal } = useApp();

  const waCartText = encodeURIComponent(
    `Hello FastonMed Sales, I would like to place an order for the following items:\n` +
    cart.map(item => `- ${item.name} (Qty: ${item.quantity}) - AED ${(item.price * item.quantity).toLocaleString()}`).join('\n') +
    `\n\nTotal: AED ${cartGrandTotal.toLocaleString()} (incl. VAT)`
  );
  const waUrl = `https://wa.me/971508893589?text=${waCartText}`;

  if (cart.length === 0) {
    return (
      <div style={{ backgroundColor: '#f8fafc', padding: '80px 0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '520px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#eaf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShoppingBag size={32} color="#51b291" />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            Your Cart is Currently Empty
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
            Explore our certified hospital equipment and medical consumables.
          </p>
          <Link
            href="/shop"
            style={{
              backgroundColor: '#51b291',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '8px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none'
            }}
          >
            <span>Browse Medical Catalog</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '48px 0 80px' }}>
      <div className="container">
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>
          Shopping Cart ({cart.length} items)
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          {/* Cart Table */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
              Order Items
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {cart.map(item => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid #f1f5f9',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1', minWidth: '220px' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#f8fafc', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', objectFit: 'contain' }} />
                      ) : (
                        <ShoppingBag size={24} color="#94a3b8" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>SKU: {item.sku}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#51b291', marginTop: '2px' }}>
                        AED {item.price.toLocaleString()} each
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => updateCartQuantity(item.id, Math.max(1, item.quantity - 1))}
                        style={{ padding: '6px 10px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '6px 14px', fontSize: '0.9rem', fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '6px 10px', background: '#f8fafc', border: 'none', cursor: 'pointer' }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div style={{ width: '100px', textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      AED {(item.price * item.quantity).toLocaleString()}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px' }}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Box */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
              Order Summary
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.92rem' }}>
                <span>Subtotal (Excl. VAT)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>AED {cartSubtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.92rem' }}>
                <span>UAE VAT (5%)</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>AED {cartTax.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.92rem' }}>
                <span>UAE Delivery (All 7 Emirates)</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>FREE</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>
              <span>Total Amount</span>
              <span style={{ color: '#51b291' }}>AED {cartGrandTotal.toLocaleString()}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25d366',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.3)'
                }}
              >
                <MessageCircle size={20} />
                <span>Confirm Order via WhatsApp</span>
              </a>

              <Link
                href="/shop"
                style={{
                  textAlign: 'center',
                  color: '#64748b',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '8px'
                }}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
