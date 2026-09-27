'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  Home,
  ShoppingBag,
  ArrowRight,
  PhoneCall,
  MessageCircle,
  Activity,
  HeartPulse,
  ThermometerSnowflake,
  Scan,
  FlaskConical,
  Bed,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const popularCategories = [
  {
    name: 'ICU & Critical Care',
    desc: 'Ventilators, Defibrillators & Syringe Pumps',
    count: '340+ Products',
    icon: Activity,
    href: '/shop?category=ICU',
    color: '#00875A',
    bg: '#ECFDF5'
  },
  {
    name: 'Patient Monitoring',
    desc: 'Multi-parameter monitors, 12-lead ECG & Vitals',
    count: '420+ Products',
    icon: HeartPulse,
    href: '/shop?category=Monitoring',
    color: '#0284C7',
    bg: '#F0F9FF'
  },
  {
    name: 'Medical Cold Storage',
    desc: 'Pharmacy refrigerators & Ultra-low freezers',
    count: '180+ Products',
    icon: ThermometerSnowflake,
    href: '/shop?category=Refrigeration',
    color: '#2563EB',
    bg: '#EFF6FF'
  },
  {
    name: 'Ultrasound & Radiology',
    desc: 'Color Doppler, Portable ultrasound & X-ray',
    count: '260+ Products',
    icon: Scan,
    href: '/shop?category=Ultrasound',
    color: '#7C3AED',
    bg: '#F5F3FF'
  },
  {
    name: 'Clinical Laboratory',
    desc: 'Biochemistry analyzers, Centrifuges & Sterilizers',
    count: '510+ Products',
    icon: FlaskConical,
    href: '/shop?category=Laboratory',
    color: '#D97706',
    bg: '#FFFBEB'
  },
  {
    name: 'Hospital Furniture',
    desc: 'Electric ICU beds, OT lights & Examination couches',
    count: '680+ Products',
    icon: Bed,
    href: '/shop?category=Furniture',
    color: '#059669',
    bg: '#F0FDF4'
  }
];

const featuredEquipment = [
  {
    title: 'ICU Mechanical Ventilator',
    badge: 'Critical Care',
    category: 'Invasive & Non-Invasive',
    image: '/images/hero-showcase/1-icu-ventilator.png',
    href: '/shop?category=ICU'
  },
  {
    title: 'Multi-Parameter Patient Monitor',
    badge: 'Patient Vitals',
    category: '12.1" Touchscreen ECG / SpO2',
    image: '/images/hero-showcase/2-patient-monitor.png',
    href: '/shop?category=Monitoring'
  },
  {
    title: 'Biomedical Pharmacy Refrigerator',
    badge: 'Cold Chain',
    category: '2°C to 8°C Precision Storage',
    image: '/images/hero-showcase/4-pharmacy-fridge.png',
    href: '/shop?category=Refrigeration'
  },
  {
    title: 'Automated External Defibrillator',
    badge: 'Emergency',
    category: 'Adult / Pediatric AED Unit',
    image: '/images/hero-showcase/5-aed-defibrillator.png',
    href: '/shop?category=ICU'
  }
];

export default function NotFoundView() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullPath = window.location.pathname + window.location.search;
      fetch('/api/not-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: fullPath })
      }).catch(() => {});
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F8FAFC',
        minHeight: '75vh',
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#0F172A',
        paddingBottom: '60px'
      }}
    >
      {/* 1. TOP HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F1F5F9 100%)',
          borderBottom: '1px solid #E2E8F0',
          padding: '60px 20px 50px',
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          {/* Clinical Status Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#065F46',
              marginBottom: '20px',
              letterSpacing: '0.02em'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)'
              }}
            />
            Biomedical Diagnostics Code: 404 • Signal Unresolved
          </div>

          {/* Big Number & Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '14px'
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
                fontWeight: 900,
                color: '#00875A',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                margin: 0
              }}
            >
              404
            </h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderLeft: '3px solid #00875A',
                paddingLeft: '16px',
                textAlign: 'left'
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: '#64748B'
                }}
              >
                UAE Medical Equipment Portal
              </div>
              <div
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  lineHeight: 1.2
                }}
              >
                Page or Equipment Not Found
              </div>
            </div>
          </div>

          {/* Description */}
          <p
            style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '640px',
              margin: '0 auto 28px'
            }}
          >
            The medical device, product specification, or page you are attempting to access may have been updated, relocated, or temporarily decommissioned within our UAE biomedical catalog.
          </p>

          {/* SEARCH BAR */}
          <form
            onSubmit={handleSearch}
            style={{
              maxWidth: '580px',
              margin: '0 auto 28px',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '2px solid #00875A',
              borderRadius: '12px',
              padding: '6px 8px 6px 16px',
              boxShadow: '0 8px 24px -4px rgba(0, 135, 90, 0.12)'
            }}
          >
            <Search size={20} color="#00875A" style={{ flexShrink: 0, marginRight: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search 2,720+ medical equipment, ICU monitors, ventilators..."
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#0F172A',
                backgroundColor: 'transparent',
                fontFamily: 'inherit'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#00875A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease',
                flexShrink: 0
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#00704A')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#00875A')}
            >
              Search Catalog
            </button>
          </form>

          {/* PRIMARY ACTION BUTTONS */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Link
              href="/"
              style={{
                backgroundColor: '#00875A',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 135, 90, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#00704A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#00875A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Home size={17} />
              Return to Homepage
            </Link>

            <Link
              href="/shop"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00875A';
                e.currentTarget.style.color = '#00875A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#0F172A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ShoppingBag size={17} />
              Explore Medical Catalog (2,720+)
            </Link>

            <a
              href="https://wa.me/971508893589?text=Hello%20FastonMed%20Team,%20I%20was%20browsing%20the%20website%20and%20could%20not%20find%20a%20specific%20medical%20device."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                padding: '12px 22px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#20BA5A';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#25D366';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MessageCircle size={17} />
              WhatsApp FastonMed
            </a>
          </div>
        </div>
      </section>

      {/* 2. EXPLORE POPULAR MEDICAL CATEGORIES */}
      <section style={{ maxWidth: '1240px', margin: '48px auto 0', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#00875A',
              marginBottom: '6px'
            }}
          >
            Direct Department Links
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px'
            }}
          >
            Browse Clinical Equipment by Category
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Find hospital-grade certified biomedical devices with official UAE warranty.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}
        >
          {popularCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                href={cat.href}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '20px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#00875A';
                  e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 135, 90, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    backgroundColor: cat.bg,
                    color: cat.color,
                    width: '48px',
                    height: '48px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <Icon size={24} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}
                  >
                    <h3
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0
                      }}
                    >
                      {cat.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#00875A',
                        backgroundColor: '#ECFDF5',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      {cat.count}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#64748B',
                      margin: '0 0 10px',
                      lineHeight: 1.4
                    }}
                  >
                    {cat.desc}
                  </p>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#00875A',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Explore Category <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED EQUIPMENT SHOWCASE */}
      <section style={{ maxWidth: '1240px', margin: '48px auto 0', padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#00875A',
                marginBottom: '4px'
              }}
            >
              Essential Equipment
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
                fontWeight: 800,
                color: '#0F172A',
                margin: 0
              }}
            >
              Top Biomedical Systems Ready for Fast Dispatch
            </h2>
          </div>
          <Link
            href="/shop"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#00875A',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            View All 2,720+ Products <ArrowRight size={14} />
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}
        >
          {featuredEquipment.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00875A';
                e.currentTarget.style.boxShadow = '0 10px 20px -4px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '160px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    backgroundColor: '#00875A',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    zIndex: 2
                  }}
                >
                  {item.badge}
                </span>
                <Image
                  src={item.image}
                  alt={item.title}
                  width={150}
                  height={150}
                  style={{
                    objectFit: 'contain',
                    maxHeight: '135px',
                    width: 'auto',
                    transition: 'transform 0.3s ease'
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: '#64748B',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '4px'
                  }}
                >
                  {item.category}
                </div>
                <h3
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 10px',
                    lineHeight: 1.3
                  }}
                >
                  {item.title}
                </h3>
                <div
                  style={{
                    marginTop: 'auto',
                    paddingTop: '8px',
                    borderTop: '1px dashed #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#00875A'
                  }}
                >
                  <span>Request UAE Quote</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. FAST PROCUREMENT & CLINICAL SUPPORT BANNER */}
      <section style={{ maxWidth: '1240px', margin: '48px auto 0', padding: '0 20px' }}>
        <div
          style={{
            backgroundColor: '#0B3B24',
            backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(81, 178, 145, 0.25) 0%, transparent 40%)',
            borderRadius: '16px',
            padding: '32px 36px',
            color: '#FFFFFF',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '24px'
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: '12px',
                color: '#A7F3D0'
              }}
            >
              <ShieldCheck size={14} /> Verified Medical Equipment Supplier • FastonMed UAE
            </div>
            <h3
              style={{
                fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                fontWeight: 800,
                margin: '0 0 8px',
                lineHeight: 1.3
              }}
            >
              Cannot find the exact device or hospital specification?
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: '#D1FAE5',
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '540px'
              }}
            >
              Our biomedical engineering team can source directly from global manufacturers or arrange custom tenders for clinics, hospitals, and day-surgery centers across Dubai, Abu Dhabi & the Northern Emirates.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              justifySelf: 'end'
            }}
          >
            <a
              href="tel:+971508893589"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#0B3B24',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >
              <PhoneCall size={16} color="#00875A" />
              Call Biomedical Desk: +971 50 889 3589 / +971 50 889 3586
            </a>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                fontSize: '12px',
                color: '#A7F3D0'
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Same-day Dispatch
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Official UAE Warranty
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
