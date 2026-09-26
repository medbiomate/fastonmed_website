'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, Menu, X, Phone, Mail } from 'lucide-react';
import { useApp } from '@/lib/context';
import { store } from '@/lib/store';
import FastonmedLogo from './FastonmedLogo';

const tickerMessages = [
  'Free UAE Delivery on Orders Over AED 500',
  '100% Genuine Medical Supplies & Direct UAE Warranty',
  'Bringing Advanced Medical Equipment to Your Doorstep',
  'Precision Healthcare Solutions & Dedicated Support'
];

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount, setIsCartOpen, wishlist } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerMessages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Hide public navbar inside /admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const [chromeSettings, setChromeSettings] = useState(() => store.getSiteChrome());
  useEffect(() => {
    setChromeSettings(store.getSiteChrome());
  }, []);

  const navLinks = chromeSettings.headerMenu && chromeSettings.headerMenu.length > 0
    ? chromeSettings.headerMenu.map(m => ({ label: m.label, href: m.url }))
    : [
        { label: 'Home', href: '/' },
        { label: 'Shop', href: '/shop' },
        { label: 'About Us', href: '/about-us' },
        { label: 'Contact', href: '/contact' }
      ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      {/* 1. TOPBAR (Exact FastOnMed Brand Teal #51b291) */}
      <div
        id="topbar"
        style={{
          backgroundColor: '#51b291',
          color: '#ffffff',
          fontSize: '0.84rem',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 101
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            width: '100%'
          }}
        >
          {/* Left: Contact Info */}
          <div
            id="topbar-contacts"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontWeight: 500
            }}
          >
            <a
              href="tel:+971 508 893 589"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Phone size={13} />
              <span>+971 508 893 589</span>
            </a>
            <a
              href="mailto:sales@fastonmed.com"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Mail size={13} />
              <span>sales@fastonmed.com</span>
            </a>
          </div>

          {/* Center: Live Ticker Slide */}
          <div
            id="topbar-ticker"
            style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 600,
              letterSpacing: '0.01em',
              transition: 'opacity 0.3s ease'
            }}
          >
            <span>{tickerMessages[tickerIndex]}</span>
          </div>

          {/* Right Spacer for balance */}
          <div id="topbar-spacer" style={{ width: '180px', display: 'none' }} />
        </div>
        <style>{`
          @media (max-width: 900px) {
            #topbar {
              height: 32px !important;
            }
            #topbar-contacts { display: none !important; }
            #topbar-ticker {
              text-align: center !important;
              font-size: 0.73rem !important;
              font-weight: 600 !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              padding: 0 10px !important;
            }
          }
        `}</style>
      </div>

      {/* 2. MAIN HEADER (Clean White Ecomus Minimalist) */}
      <header
        id="main-header"
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #eef2f6',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div
          className="container"
          id="main-header-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '70px',
            padding: '0 24px'
          }}
        >
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            id="mobile-menu-trigger"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#0f172a',
              padding: '6px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Open mobile menu"
          >
            <Menu size={22} />
          </button>

          {/* 1. Brand Logo (Responsive desktop / mobile) */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <div id="desktop-logo" style={{ display: 'block' }}>
              <FastonmedLogo height={38} theme="light" />
            </div>
            <div id="mobile-logo" style={{ display: 'none' }}>
              <FastonmedLogo height={28} theme="light" />
            </div>
          </Link>

          {/* 2. Center: Navigation Menu */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '40px'
            }}
            id="desktop-nav"
          >
            {navLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '1rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#51b291' : '#1e293b',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    padding: '8px 0'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: '#51b291',
                        borderRadius: '2px'
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
          <style>{`
            @media (min-width: 900px) {
              #desktop-nav { display: flex !important; }
              #desktop-logo { display: block !important; }
              #mobile-logo { display: none !important; }
              #header-wishlist { display: flex !important; }
            }
            @media (max-width: 899px) {
              #mobile-menu-trigger { display: flex !important; }
              #desktop-logo { display: none !important; }
              #mobile-logo { display: block !important; }
              #header-wishlist { display: none !important; }
              #main-header-inner {
                height: 56px !important;
                padding: 0 12px !important;
              }
            }
          `}</style>

          {/* 3. Right: Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Search Icon */}
            <button
              onClick={() => setSearchModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1e293b',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                transition: 'color 0.2s'
              }}
              aria-label="Search site"
              title="Search Medical Products"
            >
              <Search size={21} />
            </button>

            {/* Wishlist Icon (Desktop only for clean mobile header) */}
            <Link
              href="/wishlist"
              id="header-wishlist"
              style={{
                position: 'relative',
                color: '#1e293b',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label="Wishlist"
              title="Saved Products"
            >
              <Heart size={21} />
              {wishlist.length > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    backgroundColor: '#51b291',
                    color: '#ffffff',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(81, 178, 145, 0.4)'
                  }}
                >
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1e293b',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative'
              }}
              aria-label="View Shopping Cart"
              title="Shopping Cart"
            >
              <ShoppingBag size={21} />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  backgroundColor: '#51b291',
                  color: '#ffffff',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(81, 178, 145, 0.4)'
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. SEARCH OVERLAY MODAL */}
      {searchModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '90px'
          }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '92%',
              padding: '30px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Search FastOnMed</h3>
              <button
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Search size={22} style={{ position: 'absolute', left: '16px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search medical equipment, brand, model or SKU..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '16px 120px 16px 48px',
                    fontSize: '1rem',
                    border: '2px solid #51b291',
                    borderRadius: '30px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '6px',
                    backgroundColor: '#51b291',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '30px',
                    padding: '10px 24px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Search
                </button>
              </div>
            </form>

            <div style={{ marginTop: '20px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Popular Searches:</span>
              {['Haier Refrigerator', 'Cederroth Dressing', 'Blue Dot Pack', 'Dental Chair', 'ENT Unit'].map(k => (
                <button
                  key={k}
                  onClick={() => {
                    setSearchQuery(k);
                    window.location.href = `/shop?search=${encodeURIComponent(k)}`;
                  }}
                  style={{
                    fontSize: '0.8rem',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            zIndex: 9999,
            display: 'flex'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '340px',
              backgroundColor: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
              padding: '20px',
              overflowY: 'auto'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <FastonmedLogo height={32} theme="light" />
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '6px' }}
                aria-label="Close mobile menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Quick Search Trigger inside Mobile Drawer */}
            <div style={{ marginBottom: '18px' }}>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '24px',
                  color: '#94a3b8',
                  fontSize: '0.86rem',
                  cursor: 'pointer'
                }}
              >
                <Search size={16} />
                <span>Search 500+ products...</span>
              </button>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              {navLinks.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: pathname === l.href ? 700 : 500,
                    color: pathname === l.href ? '#51b291' : '#0f172a',
                    textDecoration: 'none',
                    padding: '10px 4px',
                    borderBottom: '1px solid #f8fafc'
                  }}
                >
                  {l.label}
                </Link>
              ))}

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#0f172a',
                  textDecoration: 'none',
                  padding: '10px 4px',
                  borderBottom: '1px solid #f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>Saved Wishlist</span>
                {wishlist.length > 0 && (
                  <span style={{ backgroundColor: '#51b291', color: '#ffffff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px' }}>
                    {wishlist.length}
                  </span>
                )}
              </Link>
            </nav>

            {/* Direct WhatsApp Callout in Mobile Drawer */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '16px' }}>
              <a
                href="https://wa.me/971508893589"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  borderRadius: '24px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  marginBottom: '14px'
                }}
              >
                <span>WhatsApp: +971 508 893 589</span>
              </a>

              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Dubai, UAE • Official Medical Equipment Supplier
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
