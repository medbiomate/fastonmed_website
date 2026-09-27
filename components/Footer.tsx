'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Mail, Phone, Send, Check } from 'lucide-react';
import FastonmedLogo from './FastonmedLogo';
import { store } from '@/lib/store';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [chromeSettings, setChromeSettings] = useState(() => store.getSiteChrome());
  useEffect(() => {
    setChromeSettings(store.getSiteChrome());
  }, []);

  // Hide public footer in /admin
  if (pathname?.startsWith('/admin')) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const isDark = false;

  return (
    <footer
      style={{
        backgroundColor: isDark ? '#0b0c0f' : '#ffffff',
        color: isDark ? '#94a3b8' : '#334155',
        borderTop: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #eef2f6',
        paddingTop: '56px',
        paddingBottom: '28px',
        transition: 'background-color 0.3s ease'
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .footer-main-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 30px 20px !important;
            margin-bottom: 32px !important;
          }
          .footer-col-brand {
            grid-column: 1 / -1 !important;
          }
          .footer-col-help {
            grid-column: 1 / 2 !important;
          }
          .footer-col-links {
            grid-column: 2 / 3 !important;
          }
          .footer-col-newsletter {
            grid-column: 1 / -1 !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            text-align: center !important;
            gap: 8px !important;
          }
        }
      `}</style>
      <div className="container">
        <div
          className="footer-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '40px',
            marginBottom: '44px'
          }}
        >
          {/* Column 1: Brand & Contact Info */}
          <div className="footer-col-brand">
            <div style={{ marginBottom: '20px' }}>
              <FastonmedLogo height={42} theme={isDark ? 'dark' : 'light'} />
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#51b291" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Address: Dubai, United Arab Emirates</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#51b291" style={{ flexShrink: 0 }} />
                <span>
                  Email: <a href="mailto:sales@fastonmed.com" style={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 600, textDecoration: 'none' }}>sales@fastonmed.com</a>
                </span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <Phone size={16} color="#51b291" style={{ flexShrink: 0, marginTop: '3px' }} />
                <div>
                  Phone: <a href="tel:+971508893589" style={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 600, textDecoration: 'none' }}>+971 50 889 3589</a>
                  <br />
                  <a href="tel:+971508893586" style={{ color: isDark ? '#ffffff' : '#0f172a', fontWeight: 600, textDecoration: 'none' }}>+971 50 889 3586</a>
                </div>
              </li>
            </ul>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="https://www.instagram.com/fastonmed"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f8fafc' : '#334155',
                  textDecoration: 'none'
                }}
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/fastonmed"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isDark ? '#f8fafc' : '#334155',
                  textDecoration: 'none'
                }}
                aria-label="LinkedIn"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>

            {/* Trustpilot-Style Google Reviews Badge */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <a
                href="https://share.google/zWzPzh4XjEJlQcKK6"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  textDecoration: 'none',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  padding: '9px 14px',
                  borderRadius: '10px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
                }}
              >
                <svg viewBox="0 0 24 24" width="22" height="22" style={{ flexShrink: 0 }}>
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>Google Rating</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00875a' }}>5.0 ★★★★★</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Fastonmed Trading L.L.C</div>
                </div>
              </a>
            </div>
          </div>

          {/* Column 2: Help */}
          <div className="footer-col-help">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
              Help
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <li>
                <Link href="/privacy-policy" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns-exchanges" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Returns + Exchanges
                </Link>
              </li>
              <li>
                <Link href="/shipping" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Useful Links */}
          <div className="footer-col-links">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '20px' }}>
              Useful Links
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
              <li>
                <Link href="/" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Shop Equipment
                </Link>
              </li>
              <li>
                <Link href="/about-us" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/contact" style={{ color: '#64748b', textDecoration: 'none', transition: 'color 0.2s' }}>
                  Visit Our Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="footer-col-newsletter">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
              Sign Up for Email
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
              Sign up to get first dibs on new arrivals, sales, clinical guides, events and more!
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="email"
                required
                placeholder="Enter your email..."
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control"
                style={{ fontSize: '0.86rem', height: '42px' }}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  height: '42px',
                  padding: '0 16px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#0f172a',
                  borderColor: '#0f172a'
                }}
              >
                {subscribed ? <Check size={16} /> : <Send size={16} />}
              </button>
            </form>
            {subscribed && (
              <span style={{ fontSize: '0.78rem', color: 'var(--primary)', marginTop: '6px', display: 'block', fontWeight: 600 }}>
                Thank you for subscribing!
              </span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div
          className="footer-bottom-bar"
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: '#94a3b8'
          }}
        >
          <div>
            {chromeSettings.footerCopyright || '© 2026 Fastonmed. All Rights Reserved.'}
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Dubai, United Arab Emirates</span>
            <span>MoHAP / DHA Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
