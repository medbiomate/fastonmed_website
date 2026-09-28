'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, Menu, X, Phone, Mail, User, ShieldCheck, MapPin, Clock, ChevronDown } from 'lucide-react';
import { useApp } from '@/lib/context';
import { store } from '@/lib/store';
import FastonmedLogo from './FastonmedLogo';
import ShopMegaMenu from './ShopMegaMenu';
import LanguageSwitcher from './LanguageSwitcher';
import { useLocale } from '@/lib/locale-context';
import { getEquivalentPath } from '@/lib/i18n';

const tickerMessagesEn = [
  'Free UAE Delivery on Orders Over AED 500',
  '100% Genuine Medical Supplies & Direct UAE Warranty',
  'Bringing Advanced Medical Equipment to Your Doorstep',
  'Precision Healthcare Solutions & Dedicated Support'
];

const tickerMessagesAr = [
  'توصيل مجاني في الإمارات للطلبات التي تتجاوز 500 درهم',
  'مستلزمات طبية أصلية 100% مع ضمان معتمد في الإمارات',
  'توريد أحدث الأجهزة والمعدات الطبية مباشرة إلى منشأتك',
  'حلول رعاية صحية دقيقة مع دعم فني وهندسي متواصل'
];

export default function Navbar() {
  const pathname = usePathname();
  const { locale, isRtl } = useLocale();
  const { cartCount, setIsCartOpen, wishlist } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileShopExpanded, setMobileShopExpanded] = useState(false);
  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleShopMouseEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setMegaMenuOpen(true);
  };

  const handleShopMouseLeave = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
    }, 180);
  };

  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerMessagesEn.length);
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

  const baseLinks = chromeSettings.headerMenu && chromeSettings.headerMenu.length > 0
    ? chromeSettings.headerMenu.map(m => ({ label: m.label, href: m.url }))
    : [
        { label: locale === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
        { label: locale === 'ar' ? 'من نحن' : 'About Us', href: '/about-us' },
        { label: locale === 'ar' ? 'المتجر' : 'Products', href: '/shop' },
        { label: locale === 'ar' ? 'الخدمات' : 'Services', href: '/services' },
        { label: locale === 'ar' ? 'الجودة' : 'Quality', href: '/about-us' },
        { label: locale === 'ar' ? 'اتصل بنا' : 'Contact Us', href: '/contact' }
      ];

  const translateNavLabel = (label: string, isAr: boolean) => {
    if (!isAr) return label;
    const lower = label.toLowerCase().trim();
    if (lower === 'home') return 'الرئيسية';
    if (lower === 'about' || lower === 'about us') return 'من نحن';
    if (lower === 'shop' || lower === 'catalog' || lower === 'products') return 'المتجر';
    if (lower === 'services') return 'الخدمات';
    if (lower === 'quality') return 'الجودة';
    if (lower === 'contact' || lower === 'contact us') return 'اتصل بنا';
    if (lower === 'brands') return 'العلامات التجارية';
    return label;
  };

  const navLinks = baseLinks.map(l => ({
    label: translateNavLabel(l.label, locale === 'ar'),
    href: locale === 'ar' ? getEquivalentPath(l.href, 'ar') : l.href
  }));

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isDarkHeader = false;

  return (
    <>
      {/* 1. TOPBAR */}
      <div
        id="topbar"
        style={{
          backgroundColor: '#00875a',
          color: '#ffffff',
          fontSize: '0.80rem',
          height: '38px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          zIndex: 101,
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
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
              gap: '14px',
              fontWeight: 500,
              justifySelf: 'start'
            }}
          >
            <div
              style={{
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: 0.95
              }}
            >
              <Phone size={13} strokeWidth={2.2} />
              <a
                href="tel:+971508893589"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                +971 50 889 3589
              </a>
              <span style={{ opacity: 0.4 }}>/</span>
              <a
                href="tel:+971508893586"
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                +971 50 889 3586
              </a>
            </div>

            <span style={{ opacity: 0.35, fontSize: '0.75rem' }}>|</span>

            <a
              href="mailto:sales@fastonmed.com"
              style={{
                color: '#ffffff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: 0.95,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.95')}
            >
              <Mail size={13} strokeWidth={2.2} />
              <span>sales@fastonmed.com</span>
            </a>
          </div>

          {/* Center: Exactly Centered Live Ticker */}
          <div
            id="topbar-ticker"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              fontWeight: 600,
              fontSize: '0.80rem',
              letterSpacing: '0.01em',
              textAlign: 'center',
              justifySelf: 'center',
              color: '#ffffff',
              padding: '0 12px',
              whiteSpace: 'nowrap'
            }}
          >
            <ShieldCheck size={14} strokeWidth={2.2} color="#bbf7d0" />
            <span>{(locale === 'ar' ? tickerMessagesAr : tickerMessagesEn)[tickerIndex % 4]}</span>
          </div>

          {/* Right: UAE Presence & Business Hours for visual balance */}
          <div
            id="topbar-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              justifySelf: 'end',
              fontWeight: 500,
              fontSize: '0.78rem'
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: 0.95
              }}
            >
              <MapPin size={13} strokeWidth={2.2} />
              <span>{locale === 'ar' ? 'دبي، الإمارات' : 'Dubai, UAE'}</span>
            </span>

            <span style={{ opacity: 0.35, fontSize: '0.75rem' }}>|</span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: 0.95
              }}
            >
              <Clock size={13} strokeWidth={2.2} />
              <span>{locale === 'ar' ? 'السبت – الخميس: 8:30 ص – 6:00 م' : 'Mon – Sat: 8:30 AM – 6:00 PM'}</span>
            </span>

            <span style={{ opacity: 0.35, fontSize: '0.75rem' }}>|</span>

            <LanguageSwitcher variant="topbar" />
          </div>
        </div>

        <style>{`
          @media (max-width: 1100px) {
            #topbar-right {
              display: none !important;
            }
            #topbar .container {
              display: flex !important;
              justify-content: space-between !important;
              grid-template-columns: none !important;
            }
            #topbar-ticker {
              justify-self: auto !important;
              text-align: right !important;
            }
          }
          @media (max-width: 820px) {
            #topbar {
              height: 34px !important;
            }
            #topbar-contacts {
              display: none !important;
            }
            #topbar .container {
              display: flex !important;
              justify-content: center !important;
              padding: 0 10px !important;
            }
            #topbar-ticker {
              justify-self: center !important;
              text-align: center !important;
              font-size: 0.74rem !important;
              white-space: nowrap !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              width: 100% !important;
            }
          }
        `}</style>
      </div>

      {/* 2. MAIN HEADER (BeTheme Detailing Shop Dark on Home, Minimalist on Inner) */}
      <header
        id="main-header"
        style={{
          backgroundColor: isDarkHeader ? '#111216' : '#ffffff',
          borderBottom: isDarkHeader ? '1px solid rgba(255,255,255,0.08)' : '1px solid #eef2f6',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: isDarkHeader ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <div
          className="container"
          id="main-header-inner"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '74px',
            padding: '0 24px',
            fontFamily: 'Arial, Helvetica, sans-serif'
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
              color: isDarkHeader ? '#ffffff' : '#0f172a',
              padding: '6px',
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}
            aria-label="Open mobile menu"
          >
            <Menu size={22} />
          </button>

          {/* 1. Brand Logo (Responsive desktop / mobile) */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <div id="desktop-logo" style={{ display: 'block' }}>
              <FastonmedLogo height={38} theme={isDarkHeader ? 'dark' : 'light'} />
            </div>
            <div id="mobile-logo" style={{ display: 'none' }}>
              <FastonmedLogo height={28} theme={isDarkHeader ? 'dark' : 'light'} />
            </div>
          </Link>

          {/* 2. Center: Navigation Menu */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '36px',
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}
            id="desktop-nav"
          >
            {navLinks.map(link => {
              const isShop = link.label.toLowerCase() === 'shop' || link.href === '/shop';
              const isActive = pathname === link.href || (isShop && pathname.startsWith('/product-category'));

              if (isShop) {
                return (
                  <div
                    key={link.href}
                    onMouseEnter={handleShopMouseEnter}
                    onMouseLeave={handleShopMouseLeave}
                    style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMegaMenuOpen(false)}
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: isActive || megaMenuOpen ? 700 : 500,
                        color: isActive || megaMenuOpen ? '#00875a' : '#334155',
                        textDecoration: 'none',
                        letterSpacing: '0.01em',
                        transition: 'color 0.2s ease',
                        position: 'relative',
                        padding: '8px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        size={14}
                        style={{
                          transition: 'transform 0.2s ease',
                          transform: megaMenuOpen ? 'rotate(180deg)' : 'none',
                          color: megaMenuOpen ? '#00875a' : '#94a3b8'
                        }}
                      />
                      {(isActive || megaMenuOpen) && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '2.5px',
                            backgroundColor: '#00875a',
                            borderRadius: '2px'
                          }}
                        />
                      )}
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#00875a' : '#334155',
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    transition: 'color 0.2s ease',
                    position: 'relative',
                    padding: '8px 0',
                    fontFamily: 'Arial, Helvetica, sans-serif'
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
                        height: '2.5px',
                        backgroundColor: '#00875a',
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
              #header-cta-btn { display: inline-flex !important; }
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
                color: isDarkHeader ? '#f8fafc' : '#1e293b',
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

            {/* Wishlist Icon */}
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
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    fontSize: '0.64rem',
                    fontWeight: 800,
                    width: '17px',
                    height: '17px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
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
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  width: '17px',
                  height: '17px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {cartCount}
              </span>
            </button>

            {/* Account / Admin Login Icon */}
            <Link
              href="/admin/login"
              style={{
                color: '#1e293b',
                padding: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <User size={21} />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher variant="header" />

            {/* Get in Touch CTA Button */}
            <Link
              href={locale === 'ar' ? '/ar/contact' : '/contact'}
              id="header-cta-btn"
              style={{
                backgroundColor: '#00875a',
                color: '#ffffff',
                padding: '9px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.86rem',
                textDecoration: 'none',
                display: 'none',
                alignItems: 'center',
                marginLeft: '8px',
                transition: 'background-color 0.2s',
                boxShadow: '0 2px 8px rgba(0, 135, 90, 0.25)',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {locale === 'ar' ? 'تواصل معنا' : 'Get in Touch'}
            </Link>
          </div>
        </div>

        {/* Shop Mega Menu Dropdown */}
        <ShopMegaMenu
          isOpen={megaMenuOpen}
          onClose={() => setMegaMenuOpen(false)}
          onMouseEnter={handleShopMouseEnter}
          onMouseLeave={handleShopMouseLeave}
        />
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
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Search FastonMed</h3>
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

            {/* Mobile Language Switcher */}
            <LanguageSwitcher variant="mobile" />

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
              {navLinks.map(l => {
                const isShop = l.label.toLowerCase() === 'shop' || l.href === '/shop';
                if (isShop) {
                  return (
                    <div key={l.href} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 4px'
                        }}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setMobileMenuOpen(false)}
                          style={{
                            fontSize: '1rem',
                            fontWeight: 700,
                            color: pathname.startsWith('/shop') || pathname.startsWith('/product-category') ? '#00875a' : '#0f172a',
                            textDecoration: 'none'
                          }}
                        >
                          Shop Equipment
                        </Link>
                        <button
                          type="button"
                          onClick={() => setMobileShopExpanded(prev => !prev)}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            color: '#00875a'
                          }}
                          aria-label="Toggle categories"
                        >
                          <ChevronDown
                            size={18}
                            style={{
                              transform: mobileShopExpanded ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s ease'
                            }}
                          />
                        </button>
                      </div>

                      {mobileShopExpanded && (
                        <div
                          style={{
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            margin: '4px 0 10px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          <Link
                            href="/product-category/icu-equipment"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • ICU & Critical Care
                          </Link>
                          <Link
                            href="/product-category/patient-monitoring"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • Patient Monitoring & ECG
                          </Link>
                          <Link
                            href="/product-category/pharmacy-refrigerators"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • Medical Cold Storage (2–8°C)
                          </Link>
                          <Link
                            href="/product-category/radiology-equipments"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • Ultrasound & Radiology
                          </Link>
                          <Link
                            href="/product-category/laboratory-equipment"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • Clinical Laboratory
                          </Link>
                          <Link
                            href="/product-category/hospital-furniture"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.85rem', color: '#334155', textDecoration: 'none', fontWeight: 600 }}
                          >
                            • Hospital Furniture & Couches
                          </Link>
                          <Link
                            href="/shop"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{ fontSize: '0.84rem', color: '#00875a', textDecoration: 'none', fontWeight: 700, paddingTop: '6px', borderTop: '1px solid #e2e8f0' }}
                          >
                            View Full 2,700+ Catalog →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: '1rem',
                      fontWeight: pathname === l.href ? 700 : 500,
                      color: pathname === l.href ? '#00875a' : '#0f172a',
                      textDecoration: 'none',
                      padding: '10px 4px',
                      borderBottom: '1px solid #f8fafc'
                    }}
                  >
                    {l.label}
                  </Link>
                );
              })}

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
                  marginBottom: '10px'
                }}
              >
                <span>WhatsApp: +971 50 889 3589</span>
              </a>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  marginBottom: '14px'
                }}
              >
                <span>Call:</span>
                <a href="tel:+971508893589" style={{ color: '#51b291', textDecoration: 'none' }}>+971 50 889 3589</a>
                <span style={{ color: '#cbd5e1' }}>/</span>
                <a href="tel:+971508893586" style={{ color: '#51b291', textDecoration: 'none' }}>+971 50 889 3586</a>
              </div>

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
