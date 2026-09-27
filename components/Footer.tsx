'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MapPin,
  Mail,
  Phone,
  Send,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import FastonmedLogo from './FastonmedLogo';
import { store } from '@/lib/store';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [chromeSettings, setChromeSettings] = useState(() => store.getSiteChrome());
  const [showAllGuides, setShowAllGuides] = useState(true);

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

  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        color: '#334155',
        borderTop: '1px solid #e2e8f0',
        paddingTop: '52px',
        paddingBottom: '0',
        fontFamily: 'Arial, Helvetica, sans-serif'
      }}
    >
      <style>{`
        .fm-footer-link {
          color: #475569;
          text-decoration: none;
          font-size: 0.82rem;
          line-height: 1.5;
          transition: color 0.15s ease, transform 0.15s ease;
          display: inline-block;
        }
        .fm-footer-link:hover {
          color: #00875a !important;
          transform: translateX(2px);
        }
        .fm-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          text-decoration: none;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .fm-social-btn:hover {
          background: #00875a;
          color: #ffffff !important;
          border-color: #00875a;
          transform: translateY(-2px);
        }
        .fm-dir-header {
          font-size: 0.92rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 6px;
          border-bottom: 2px solid #f1f5f9;
        }
        .fm-dir-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .fm-legal-link {
          color: #94a3b8;
          text-decoration: none;
          font-size: 0.8rem;
          transition: color 0.15s ease;
        }
        .fm-legal-link:hover {
          color: #ffffff;
          text-decoration: underline;
        }
        .fm-guides-toggle-btn:hover {
          background-color: #00875a !important;
          color: #ffffff !important;
          border-color: #00875a !important;
        }
        @media (max-width: 991px) {
          .fm-top-row {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .fm-mega-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 28px 20px !important;
          }
        }
        @media (max-width: 640px) {
          .fm-top-columns {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
          }
          .fm-mega-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .fm-mega-col-content {
            display: block !important;
          }
          .fm-bottom-legal-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
        }
      `}</style>

      <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        {/* ========================================================================= */}
        {/* SECTION 1: BRAND HEADER, QUICK SHORTCUTS & TOP COLUMNS (LIKE GO DIGIT)   */}
        {/* ========================================================================= */}
        <div
          className="fm-top-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '40px',
            paddingBottom: '36px',
            borderBottom: '1px solid #eef2f6'
          }}
        >
          {/* Brand Info & Socials */}
          <div style={{ flex: '1 1 320px', maxWidth: '380px' }}>
            <div style={{ marginBottom: '16px' }}>
              <FastonmedLogo height={44} theme="light" />
            </div>

            {/* Quick Links Row below logo */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '16px'
              }}
            >
              <Link href="/about-us" className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                About Us
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href="/contact" className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                Contact
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href="/shop" className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                Catalog
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href="/brands" className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                Brands
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href="/contact" className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                Request Quote
              </Link>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              FastonMed is the Best Medical Equipment Supplier in UAE. Official distributor of certified biomedical technology, ICU ventilators, diagnostics, and clinical equipment.
            </p>

            {/* Social Icons (Rounded like Go Digit) */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <a
                href="https://wa.me/971508893589"
                target="_blank"
                rel="noreferrer"
                className="fm-social-btn"
                aria-label="WhatsApp"
                title="Chat on WhatsApp"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 2C6.5 2 2 6.5 2 12.031c0 1.947.562 3.759 1.531 5.312L2 22l4.812-1.531A9.97 9.97 0 0 0 12.03 22C17.562 22 22 17.5 22 12.031 22 6.5 17.562 2 12.031 2zm0 18.25c-1.656 0-3.218-.469-4.562-1.281l-.313-.188-3.031.969.969-2.969-.219-.344A8.19 8.19 0 0 1 3.78 12.03c0-4.562 3.688-8.25 8.25-8.25s8.25 3.688 8.25 8.25-3.688 8.25-8.25 8.25zm4.563-6.188c-.25-.125-1.469-.719-1.688-.813-.219-.094-.375-.125-.531.125-.156.25-.625.813-.781.969-.156.156-.281.188-.531.063-.25-.125-1.063-.375-2.031-1.219-.75-.688-1.25-1.531-1.406-1.781-.156-.25-.031-.375.094-.5.125-.125.25-.281.375-.406.125-.156.156-.25.25-.406.094-.156.031-.313-.031-.438-.063-.125-.531-1.313-.75-1.781-.188-.469-.406-.406-.563-.406h-.469c-.156 0-.438.063-.656.313-.219.25-.875.844-.875 2.063s.906 2.406 1.031 2.563c.125.188 1.781 2.719 4.313 3.813.625.25 1.094.406 1.469.531.625.188 1.188.156 1.625.094.5-.063 1.469-.625 1.688-1.219.219-.594.219-1.094.156-1.219-.063-.125-.219-.188-.469-.313z"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/fastonmed"
                target="_blank"
                rel="noreferrer"
                className="fm-social-btn"
                aria-label="LinkedIn"
                title="Follow on LinkedIn"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/fastonmed"
                target="_blank"
                rel="noreferrer"
                className="fm-social-btn"
                aria-label="Instagram"
                title="Follow on Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/fastonmed"
                target="_blank"
                rel="noreferrer"
                className="fm-social-btn"
                aria-label="Facebook"
                title="Follow on Facebook"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@fastonmed"
                target="_blank"
                rel="noreferrer"
                className="fm-social-btn"
                aria-label="YouTube"
                title="Subscribe on YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Google Rating badge */}
            <div style={{ marginTop: '16px' }}>
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
                  padding: '7px 12px',
                  borderRadius: '8px'
                }}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" style={{ flexShrink: 0 }}>
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
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Fastonmed Trading L.L.C • UAE</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Columns: Products, Resources, Important Links */}
          <div
            className="fm-top-columns"
            style={{
              flex: '2 1 600px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px'
            }}
          >
            {/* Products Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                Products
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href="/product-category/icu-equipment" className="fm-footer-link">
                    ICU & Critical Care
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/patient-monitoring" className="fm-footer-link">
                    Patient Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/pharmacy-refrigerators" className="fm-footer-link">
                    Medical Cold Storage
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/radiology-equipments" className="fm-footer-link">
                    Ultrasound & Radiology
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/laboratory-equipment" className="fm-footer-link">
                    Clinical Laboratory
                  </Link>
                </li>
                <li>
                  <Link href="/product-category/hospital-furniture" className="fm-footer-link">
                    Hospital Furniture
                  </Link>
                </li>
                <li>
                  <Link href="/cardiology-equipment" className="fm-footer-link">
                    Cardiology Diagnostics
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="fm-footer-link" style={{ fontWeight: 700, color: '#00875a' }}>
                    View All 2,700+ Products →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                Resources
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href="/medical-equipment-calibration-service-in-uae" className="fm-footer-link">
                    Biomedical Calibration
                  </Link>
                </li>
                <li>
                  <Link href="/amc-cmc-for-medical-equipment-in-dubai-uae" className="fm-footer-link">
                    AMC & CMC Contracts
                  </Link>
                </li>
                <li>
                  <Link href="/plan-preventive-maintenance-for-medical-equipment-in-uae" className="fm-footer-link">
                    Preventive Maintenance
                  </Link>
                </li>
                <li>
                  <Link href="/ultrasound-probe-repair-in-uae" className="fm-footer-link">
                    Ultrasound Probe Repair
                  </Link>
                </li>
                <li>
                  <Link href="/flexible-rigid-endoscope-repair-in-dubai" className="fm-footer-link">
                    Endoscope Repair Dubai
                  </Link>
                </li>
                <li>
                  <Link href="/used-medical-equipment-in-uae" className="fm-footer-link">
                    Certified Pre-Owned
                  </Link>
                </li>
                <li>
                  <Link href="/school-medical-supplies-in-uae" className="fm-footer-link">
                    School Medical Supplies
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="fm-footer-link">
                    Clinical Guides & Articles
                  </Link>
                </li>
              </ul>
            </div>

            {/* Important Links Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                Important Links
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">
                    Supplier Overview UAE
                  </Link>
                </li>
                <li>
                  <Link href="/store-locations" className="fm-footer-link">
                    Store & Warehouses
                  </Link>
                </li>
                <li>
                  <Link href="/brands" className="fm-footer-link">
                    Authorized Brands
                  </Link>
                </li>
                <li>
                  <Link href="/order-tracking" className="fm-footer-link">
                    Order Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/my-account" className="fm-footer-link">
                    Hospital Account Portal
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="fm-footer-link">
                    Institutional RFQ Tender
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="fm-footer-link">
                    UAE Delivery Times
                  </Link>
                </li>
                <li>
                  <Link href="/returns-exchanges" className="fm-footer-link">
                    Warranty & Return Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECTORY MASTER HEADER & SINGLE UNIFIED TOGGLE BUTTON                   */}
        {/* ========================================================================= */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            paddingTop: '28px',
            paddingBottom: '20px',
            borderBottom: showAllGuides ? '1px solid #eef2f6' : 'none'
          }}
        >
          <div>
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0f172a',
                margin: 0,
                letterSpacing: '-0.01em'
              }}
            >
              UAE Healthcare Equipment & Clinical Directories
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
              Direct procurement guides, biomedical specifications, and regional hospital distribution
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllGuides(prev => !prev)}
            aria-expanded={showAllGuides}
            className="fm-guides-toggle-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 18px',
              backgroundColor: showAllGuides ? '#f1f5f9' : '#00875a',
              color: showAllGuides ? '#334155' : '#ffffff',
              border: `1px solid ${showAllGuides ? '#cbd5e1' : '#00875a'}`,
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
            }}
          >
            <span>{showAllGuides ? 'Hide Guides' : 'Show All Guides'}</span>
            {showAllGuides ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* ========================================================================= */}
        {/* MEGA SEO DIRECTORY - ALL 8 COLUMNS TOGGLED BY SINGLE MASTER BUTTON        */}
        {/* ========================================================================= */}
        {showAllGuides && (
          <div>
            {/* SECTION 2: MEGA SEO DIRECTORY - ROW 1 (4 COLUMNS) */}
            <div style={{ paddingTop: '32px', paddingBottom: '32px', borderBottom: '1px solid #eef2f6' }}>
              <div className="fm-mega-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                {/* Guide Column 1: ICU & Critical Care Equipment */}
                <div>
                  <div className="fm-dir-header">
                    <span>ICU & Critical Care Guides</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/product-category/icu-equipment" className="fm-footer-link">ICU Ventilators & Respirators</Link></li>
                      <li><Link href="/product-category/patient-monitoring" className="fm-footer-link">Multi-Parameter ICU Monitors</Link></li>
                      <li><Link href="/automated-external-defibrillator" className="fm-footer-link">Automated External Defibrillator</Link></li>
                      <li><Link href="/moh-registered-aed-machine-in-uae" className="fm-footer-link">MoH Registered AED Machine UAE</Link></li>
                      <li><Link href="/aed-replacement-pad-in-dubai" className="fm-footer-link">AED Replacement Pads in Dubai</Link></li>
                      <li><Link href="/product-category/icu-equipment" className="fm-footer-link">Syringe & Infusion Pumps</Link></li>
                      <li><Link href="/product-category/icu-equipment" className="fm-footer-link">High-Vacuum Suction Units</Link></li>
                      <li><Link href="/bipap-machine" className="fm-footer-link">BiPAP Non-Invasive Ventilation</Link></li>
                      <li><Link href="/cpap-apap-machine" className="fm-footer-link">CPAP & APAP Sleep Therapy</Link></li>
                      <li><Link href="/oxygen-sensor" className="fm-footer-link">Medical Oxygen Sensors & Cells</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Emergency Resuscitation Crash Carts</Link></li>
                      <li><Link href="/product-category/icu-equipment" className="fm-footer-link">High Flow Nasal Cannula (HFNC)</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Guide Column 2: Diagnostic & Cardiology Systems */}
                <div>
                  <div className="fm-dir-header">
                    <span>Diagnostic & Cardiology Guides</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/ecg-machine" className="fm-footer-link">12-Lead Diagnostic ECG Machine</Link></li>
                      <li><Link href="/holter-ecg-monitor-2" className="fm-footer-link">Holter ECG Continuous Monitor</Link></li>
                      <li><Link href="/ambulatory-blood-pressure-monitor" className="fm-footer-link">Ambulatory Blood Pressure (ABPM)</Link></li>
                      <li><Link href="/ambulatory-and-holter-ecg-monitors" className="fm-footer-link">Ambulatory & Holter ECG Monitors</Link></li>
                      <li><Link href="/tmt-stress-test-system" className="fm-footer-link">TMT Cardiac Stress Test System</Link></li>
                      <li><Link href="/cardiology-equipment" className="fm-footer-link">Cardiology Equipment Supplier</Link></li>
                      <li><Link href="/product-category/radiology-equipments" className="fm-footer-link">Color Doppler Ultrasound Machine</Link></li>
                      <li><Link href="/radiology-equipment-supplier-in-uae" className="fm-footer-link">Radiology Equipment Supplier UAE</Link></li>
                      <li><Link href="/ultrasound-probe-repair-in-uae" className="fm-footer-link">Ultrasound Probe Repair UAE</Link></li>
                      <li><Link href="/best-obstetrics-gynecology-equipment-in-uae" className="fm-footer-link">Obstetrics & Gynecology Equipment</Link></li>
                      <li><Link href="/prp-tubes" className="fm-footer-link">PRP Tubes & Centrifuge Kits</Link></li>
                      <li><Link href="/product-category/radiology-equipments" className="fm-footer-link">Digital Mobile Radiography X-Ray</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Guide Column 3: Hospital Furniture & Clinical Couches */}
                <div>
                  <div className="fm-dir-header">
                    <span>Hospital Furniture Guides</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Electric 5-Function ICU Hospital Beds</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Manual 2-Crank Fowler Hospital Beds</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Hydraulic Examination Couches</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Gynecological Delivery Beds & Tables</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Patient Transport Stretchers & Carts</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Phlebotomy Blood Donation Chairs</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Emergency Medication Crash Trolleys</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Hospital Bedside Lockers & Cabinets</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Overbed Food Tables & IV Poles</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Heavy-Duty Patient Wheelchairs</Link></li>
                      <li><Link href="/dental-equipment-supplier-in-dubai" className="fm-footer-link">Dental Equipment Supplier Dubai</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Surgical Shadowless OT Ceiling Lights</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Guide Column 4: Laboratory, Cold Chain & Consumables */}
                <div>
                  <div className="fm-dir-header">
                    <span>Laboratory & Cold Chain Guides</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/product-category/pharmacy-refrigerators" className="fm-footer-link">2°C–8°C Pharmacy Refrigeration</Link></li>
                      <li><Link href="/product-category/pharmacy-refrigerators" className="fm-footer-link">-20°C to -86°C Ultra Low Biofreezers</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">Clinical Chemistry Analyzers</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">High-Speed Clinical Centrifuges</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">Medical Steam Autoclaves & Sterilizers</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">Biosafety & Laminar Airflow Benches</Link></li>
                      <li><Link href="/ozone-generator" className="fm-footer-link">Medical Ozone Generator Systems</Link></li>
                      <li><Link href="/school-medical-supplies-in-uae" className="fm-footer-link">School Medical Supplies in UAE</Link></li>
                      <li><Link href="/consumables" className="fm-footer-link">Clinical Consumables & ECG Paper</Link></li>
                      <li><Link href="/flexible-rigid-endoscope-repair-in-dubai" className="fm-footer-link">Endoscope Repair in Dubai</Link></li>
                      <li><Link href="/used-medical-equipment-in-uae" className="fm-footer-link">Used Medical Equipment in UAE</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">Clinical Pathology Microscopes</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: MEGA SEO DIRECTORY - ROW 2 (4 COLUMNS) */}
            <div style={{ paddingTop: '32px', paddingBottom: '36px' }}>
              <div className="fm-mega-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px' }}>
                {/* Row 2 Column 1: Biomedical Engineering & Maintenance */}
                <div>
                  <div className="fm-dir-header">
                    <span>Biomedical Engineering & AMC</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/medical-equipment-calibration-service-in-uae" className="fm-footer-link">Equipment Calibration Service UAE</Link></li>
                      <li><Link href="/amc-cmc-for-medical-equipment-in-dubai-uae" className="fm-footer-link">AMC & CMC Maintenance Dubai UAE</Link></li>
                      <li><Link href="/plan-preventive-maintenance-for-medical-equipment-in-uae" className="fm-footer-link">Planned Preventive Maintenance (PPM)</Link></li>
                      <li><Link href="/medical-equipment-service-in-uae-2" className="fm-footer-link">Medical Equipment Service in UAE</Link></li>
                      <li><Link href="/amc-cmc-for-medical-equipment-in-dubai-uae" className="fm-footer-link">Biomedical Electrical Safety Audits</Link></li>
                      <li><Link href="/ultrasound-probe-repair-in-uae" className="fm-footer-link">Ultrasound Acoustic & Crystal Repair</Link></li>
                      <li><Link href="/flexible-rigid-endoscope-repair-in-dubai" className="fm-footer-link">Rigid & Flexible Optical Calibration</Link></li>
                      <li><Link href="/product-category/icu-equipment" className="fm-footer-link">ICU Ventilator Flow Sensor Overhaul</Link></li>
                      <li><Link href="/contact" className="fm-footer-link">Hospital Turnkey Equipment Setup</Link></li>
                      <li><Link href="/contact" className="fm-footer-link">24/7 Biomedical Emergency Support</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Row 2 Column 2: Healthcare Facilities We Supply */}
                <div>
                  <div className="fm-dir-header">
                    <span>Healthcare Facilities Supplied</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/about-us" className="fm-footer-link">Tertiary Hospitals & Emergency Units</Link></li>
                      <li><Link href="/about-us" className="fm-footer-link">Day Surgery & Outpatient Clinics</Link></li>
                      <li><Link href="/about-us" className="fm-footer-link">Polyclinics & Diagnostic Centers</Link></li>
                      <li><Link href="/radiology-equipment-supplier-in-uae" className="fm-footer-link">Radiology & Medical Imaging Centers</Link></li>
                      <li><Link href="/product-category/laboratory-equipment" className="fm-footer-link">Clinical Pathology & Diagnostic Labs</Link></li>
                      <li><Link href="/dental-equipment-supplier-in-dubai" className="fm-footer-link">Dental Clinics & Maxillofacial Units</Link></li>
                      <li><Link href="/product-category/hospital-furniture" className="fm-footer-link">Physiotherapy & Rehabilitation Centers</Link></li>
                      <li><Link href="/school-medical-supplies-in-uae" className="fm-footer-link">School, University & Nursery Clinics</Link></li>
                      <li><Link href="/product-category/pharmacy-refrigerators" className="fm-footer-link">Pharmacy & Cold Chain Warehouses</Link></li>
                      <li><Link href="/moh-registered-aed-machine-in-uae" className="fm-footer-link">Ambulance Fleets & First Responders</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Row 2 Column 3: UAE Regional Distribution */}
                <div>
                  <div className="fm-dir-header">
                    <span>UAE Regional Distribution</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Medical Equipment Supplier Dubai</Link></li>
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Medical Equipment Abu Dhabi & Al Ain</Link></li>
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Clinical Supplies Sharjah Medical City</Link></li>
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Medical Equipment Supplier Ajman</Link></li>
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Hospital Equipment Ras Al Khaimah (RAK)</Link></li>
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Healthcare Solutions Fujairah & UAQ</Link></li>
                      <li><Link href="/shipping" className="fm-footer-link">Same-Day Dubai Clinical Express Delivery</Link></li>
                      <li><Link href="/contact" className="fm-footer-link">UAE Free Zone & GCC Export Supply</Link></li>
                      <li><Link href="/contact" className="fm-footer-link">Hospital & Clinic Wholesale Procurement</Link></li>
                      <li><Link href="/contact" className="fm-footer-link">UAE Ministry & Private Hospital Tenders</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Row 2 Column 4: Standards & Compliance Guides */}
                <div>
                  <div className="fm-dir-header">
                    <span>Standards & Regulations Guides</span>
                  </div>
                  <div className="fm-mega-col-content">
                    <ul className="fm-dir-list">
                      <li><Link href="/medical-equipment-supplier-in-uae" className="fm-footer-link">Best Medical Equipment Supplier UAE</Link></li>
                      <li><Link href="/about-us" className="fm-footer-link">Medical Equipment Quality Standards</Link></li>
                      <li><Link href="/about-us" className="fm-footer-link">Clinical Facility Supply Guidelines</Link></li>
                      <li><Link href="/about-us" className="fm-footer-link">Biomedical Engineering & Calibration</Link></li>
                      <li><Link href="/terms-conditions" className="fm-footer-link">Official Manufacturer Warranty Terms</Link></li>
                      <li><Link href="/returns-exchanges" className="fm-footer-link">Warranty Claims & Exchange Policy</Link></li>
                      <li><Link href="/shipping" className="fm-footer-link">Cold-Chain Temperature Monitored Delivery</Link></li>
                      <li><Link href="/privacy-policy" className="fm-footer-link">Hospital Privacy & Data Protection</Link></li>
                      <li><Link href="/brands" className="fm-footer-link">Certified Global Healthcare Brands</Link></li>
                      <li><Link href="/store-locations" className="fm-footer-link">FastonMed Warehouses & Service Hubs</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Hide Control */}
              <div style={{ textAlign: 'center', paddingTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowAllGuides(false)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'none',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#64748b';
                  }}
                >
                  <span>Hide Guides</span>
                  <ChevronUp size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: CONTRASTING BLACK BOTTOM BAR (EXACTLY LIKE DIGIT'S DARK STRIP) */}
      {/* ========================================================================= */}
      <div
        style={{
          backgroundColor: '#090d16',
          color: '#94a3b8',
          borderTop: '1px solid #1e293b',
          paddingTop: '28px',
          paddingBottom: '32px'
        }}
      >
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          {/* Legal Navigation Links + QR Code Row */}
          <div
            className="fm-bottom-legal-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
              paddingBottom: '22px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Quick Policy Links */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px 18px',
                fontSize: '0.84rem',
                fontWeight: 600
              }}
            >
              <Link href="/shop" className="fm-legal-link">Downloads</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/privacy-policy" className="fm-legal-link">Privacy Policy</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/terms-conditions" className="fm-legal-link">Terms & Conditions</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/returns-exchanges" className="fm-legal-link">Returns & Exchanges</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/shipping" className="fm-legal-link">Shipping & Delivery</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/about-us" className="fm-legal-link">Quality & Warranty Standards</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/contact" className="fm-legal-link">24/7 Biomedical Support</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href="/store-locations" className="fm-legal-link">Dubai Store</Link>
            </div>
          </div>

          {/* Legal Registrations & Corporate Office */}
          <div style={{ paddingTop: '20px', fontSize: '0.75rem', lineHeight: 1.6, color: '#64748b' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px 20px',
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                marginBottom: '14px',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}
            >
              <div>
                <strong style={{ color: '#cbd5e1' }}>Legal Entity:</strong> FASTONMED TRADING L.L.C (فاستونميد للتجارة ذ.م.م)
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>Commercial License No:</strong> 1606077
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>Register No:</strong> 2818619
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>VAT TRN:</strong> 105373862900003
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>Jurisdiction:</strong> United Arab Emirates
              </div>
            </div>

            <p style={{ margin: '0 0 12px 0' }}>
              FASTONMED TRADING L.L.C | Corporate Office Address: Dubai Healthcare City (DHCC) & Al Qusais Industrial Area, Dubai, United Arab Emirates | P.O. Box 23881, Dubai, UAE | Official Biomedical Helpline: +971 50 889 3589 / +971 50 889 3586 | Email: sales@fastonmed.com | Calibration Support: service@fastonmed.com.
            </p>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.72rem', color: '#475569' }}>
              FastonMed is the Best Medical Equipment Supplier in UAE. Distributor of certified biomedical technology, ICU ventilators, multi-parameter patient monitors, hospital furniture, surgical lighting, medical cold storage, and clinical laboratory equipment across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. All brand logos, trademarks, and registered marks displayed on this platform belong to their respective corporate manufacturers.
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '0.74rem',
                color: '#64748b'
              }}
            >
              <div>
                © 2026 FastonMed (FASTONMED TRADING L.L.C). All Rights Reserved.
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>Dubai • Abu Dhabi • Sharjah • Northern Emirates</span>
                <span>Clinical & Biomedical Quality Assured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
