'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import FastonmedLogo from './FastonmedLogo';
import { useLocale } from '@/lib/locale-context';

export default function Footer() {
  const { locale, isArabic } = useLocale();
  const isAr =
    isArabic ||
    locale === 'ar' ||
    (typeof window !== 'undefined' &&
      (window.location.pathname === '/ar' || window.location.pathname.startsWith('/ar/')));
  const getHref = (url: string) =>
    isAr ? (url === '/' ? '/ar' : url.startsWith('/ar') ? url : `/ar${url}`) : url;
  const pathname = usePathname();

  // Hide public footer in /admin
  if (pathname?.startsWith('/admin')) return null;

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
          font-size: 0.84rem;
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
        .fm-dir-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
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
        @media (max-width: 991px) {
          .fm-top-row {
            flex-direction: column !important;
            gap: 36px !important;
          }
          .fm-top-columns {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            width: 100%;
            flex: none !important;
            gap: 28px 20px !important;
          }
        }
        @media (max-width: 640px) {
          .fm-top-columns {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 26px 16px !important;
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
        {/* MAIN SECTION: BRAND INFO & 3 ORGANIZED NON-DUPLICATE COLUMNS              */}
        {/* ========================================================================= */}
        <div
          className="fm-top-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '48px',
            paddingBottom: '48px'
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
              <Link href={getHref('/about-us')} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'من نحن' : 'About Us'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={getHref('/shop')} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'الكتالوج' : 'Catalog'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={getHref('/brands')} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'العلامات التجارية' : 'Brands'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={getHref('/contact')} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'اتصل بنا' : 'Contact'}
              </Link>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.6, margin: '0 0 18px 0' }}>
              {isAr
                ? 'توفر فاستونميد الأجهزة الطبية وأنظمة الهندسة الطبية الحيوية والحلول السريرية للمستشفيات والعيادات والمنشآت الصحية عبر كافة أنحاء الإمارات.'
                : 'FastOnMed supplies medical equipment, biomedical systems and clinical solutions to hospitals, clinics and healthcare facilities across the UAE.'}
            </p>

            {/* Social Icons */}
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
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>{isAr ? 'تقييم جوجل' : 'Google Rating'}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#00875a' }}>5.0 ★★★★★</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{isAr ? 'فاستونميد للتجارة ذ.م.م • الإمارات' : 'Fastonmed Trading L.L.C • UAE'}</div>
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
              gap: '32px'
            }}
          >
            {/* Products Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                {isAr ? 'المنتجات والأجهزة' : 'Products'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={getHref('/product-category/icu-equipment')} className="fm-footer-link">
                    {isAr ? 'العناية المركزة والحرجة' : 'ICU & Critical Care'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/product-category/patient-monitoring')} className="fm-footer-link">
                    {isAr ? 'مراقبة المرضى السريرية' : 'Patient Monitoring'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/product-category/pharmacy-refrigerators')} className="fm-footer-link">
                    {isAr ? 'سلسلة التبريد الطبي' : 'Medical Cold Storage'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/product-category/radiology-equipments')} className="fm-footer-link">
                    {isAr ? 'السونار والأشعة التشخيصية' : 'Ultrasound & Radiology'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/product-category/laboratory-equipment')} className="fm-footer-link">
                    {isAr ? 'المختبرات والتحاليل' : 'Clinical Laboratory'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/product-category/hospital-furniture')} className="fm-footer-link">
                    {isAr ? 'أثاث المستشفيات' : 'Hospital Furniture'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/cardiology-equipment')} className="fm-footer-link">
                    {isAr ? 'تشخيص أمراض القلب' : 'Cardiology Diagnostics'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/shop')} className="fm-footer-link" style={{ fontWeight: 700, color: '#00875a' }}>
                    {isAr ? 'عرض جميع المنتجات (2,700+ صنف) ←' : 'View All Products →'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & Services Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                {isAr ? 'الخدمات والصيانة' : 'Biomedical Services'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={getHref('/medical-equipment-calibration-service-in-uae')} className="fm-footer-link">
                    {isAr ? 'معايرة الأجهزة الطبية الحيوية' : 'Biomedical Calibration'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/amc-cmc-for-medical-equipment-in-dubai-uae')} className="fm-footer-link">
                    {isAr ? 'عقود الصيانة AMC و CMC' : 'AMC & CMC Contracts'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/plan-preventive-maintenance-for-medical-equipment-in-uae')} className="fm-footer-link">
                    {isAr ? 'الصيانة الوقائية الدورية (PPM)' : 'Preventive Maintenance'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/ultrasound-probe-repair-in-uae')} className="fm-footer-link">
                    {isAr ? 'إصلاح وصيانة مجسات السونار' : 'Ultrasound Probe Repair'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/flexible-rigid-endoscope-repair-in-dubai')} className="fm-footer-link">
                    {isAr ? 'إصلاح المناظير الطبية بدبي' : 'Endoscope Repair Dubai'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/used-medical-equipment-in-uae')} className="fm-footer-link">
                    {isAr ? 'أجهزة طبية مستعملة معتمدة' : 'Certified Pre-Owned'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/school-medical-supplies-in-uae')} className="fm-footer-link">
                    {isAr ? 'مستلزمات العيادات المدرسية' : 'School Medical Supplies'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/blog')} className="fm-footer-link">
                    {isAr ? 'المقالات والأدلة السريرية' : 'Clinical Guides & Blog'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Important Links Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '8px' }}>
                {isAr ? 'روابط هامة' : 'Important Links'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={getHref('/medical-equipment-supplier-in-uae')} className="fm-footer-link">
                    {isAr ? 'دليل التوريد الطبي في الإمارات' : 'UAE Supplier Overview'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/store-locations')} className="fm-footer-link">
                    {isAr ? 'المتجر والمستودعات' : 'Store & Warehouses'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/brands')} className="fm-footer-link">
                    {isAr ? 'العلامات المعتمدة' : 'Authorized Brands'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/order-tracking')} className="fm-footer-link">
                    {isAr ? 'تتبع الطلبات' : 'Order Tracking'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/my-account')} className="fm-footer-link">
                    {isAr ? 'بوابة حسابات المستشفيات' : 'Hospital Account Portal'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/contact')} className="fm-footer-link">
                    {isAr ? 'عروض أسعار ومناقصات' : 'Institutional RFQ Tender'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/shipping')} className="fm-footer-link">
                    {isAr ? 'مواعيد التوصيل في الإمارات' : 'UAE Delivery & Cold Chain'}
                  </Link>
                </li>
                <li>
                  <Link href={getHref('/returns-exchanges')} className="fm-footer-link">
                    {isAr ? 'سياسة الضمان والاسترجاع' : 'Warranty & Return Policy'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: SLEEK BLACK BOTTOM BAR (LEGAL & REGISTRATION CREDENTIALS)      */}
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
          {/* Legal Navigation Links Row */}
          <div
            className="fm-bottom-legal-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            {/* Direct Policy Links */}
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
              <Link href={getHref('/privacy-policy')} className="fm-legal-link">
                {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={getHref('/terms-conditions')} className="fm-legal-link">
                {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={getHref('/returns-exchanges')} className="fm-legal-link">
                {isAr ? 'الإرجاع والاستبدال' : 'Returns & Exchanges'}
              </Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={getHref('/shipping')} className="fm-legal-link">
                {isAr ? 'الشحن والتوصيل' : 'Shipping & Delivery'}
              </Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={getHref('/store-locations')} className="fm-legal-link">
                {isAr ? 'مستودعات ومقر دبي' : 'Dubai Hub & Warehouses'}
              </Link>
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
                <strong style={{ color: '#cbd5e1' }}>{isAr ? 'الكيان القانوني:' : 'Legal Entity:'}</strong> FASTONMED TRADING L.L.C (فاستونميد للتجارة ذ.م.م)
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isAr ? 'رقم الرخصة التجارية:' : 'Commercial License No:'}</strong> 1606077
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isAr ? 'رقم السجل التجاري:' : 'Register No:'}</strong> 2818619
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isAr ? 'الرقم الضريبي:' : 'VAT TRN:'}</strong> 105373862900003
              </div>
              <div>
                <strong style={{ color: '#cbd5e1' }}>{isAr ? 'الدولة:' : 'Jurisdiction:'}</strong> {isAr ? 'دولة الإمارات العربية المتحدة' : 'United Arab Emirates'}
              </div>
            </div>

            <p style={{ margin: '0 0 12px 0' }}>
              {isAr
                ? 'فاستونميد للتجارة ذ.م.م | العنوان الرسمي: OFF215 - مبنى ارجمند، قرية جرين كوميونيتي، مجمع دبي للاستثمار 1 (DIP-1)، دبي، الإمارات العربية المتحدة | الخط الساخن للأجهزة الطبية: +971 50 889 3589 / +971 50 889 3586 | البريد الإلكتروني: sales@fastonmed.com | دعم المعايرة: service@fastonmed.com.'
                : 'FASTONMED TRADING L.L.C | Official Address: OFF215 - Arjumand Building, Green Community Village, DIP-1, Dubai, United Arab Emirates | Official Biomedical Helpline: +971 50 889 3589 / +971 50 889 3586 | Email: sales@fastonmed.com | Calibration Support: service@fastonmed.com.'}
            </p>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.72rem', color: '#475569' }}>
              {isAr
                ? 'فاستونميد للتجارة ذ.م.م | موزع معتمد للتكنولوجيا الطبية الحيوية، أجهزة التنفس للعناية المركزة، شاشات مراقبة المرضى، أثاث المستشفيات، التبريد الطبي وأجهزة المختبرات السريرية في دبي وأبوظبي والشارقة وعجمان ورأس الخيمة والفجيرة وأم القيوين. جميع العلامات التجارية والشعارات ملك لأصحابها من الشركات المصنعة.'
                : 'FastOnMed is an official UAE distributor of certified biomedical technology, ICU ventilators, multi-parameter patient monitors, hospital furniture, surgical lighting, medical cold storage, and clinical laboratory equipment across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. All brand logos, trademarks, and registered marks displayed on this platform belong to their respective corporate manufacturers.'}
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
                {isAr ? '© 2026 فاستونميد (فاستونميد للتجارة ذ.م.م). جميع الحقوق محفوظة.' : '© 2026 FastonMed (FASTONMED TRADING L.L.C). All Rights Reserved.'}
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>{isAr ? 'دبي • أبوظبي • الشارقة • كافة الإمارات' : 'Dubai • Abu Dhabi • Sharjah • Northern Emirates'}</span>
                <span>{isAr ? 'جودة طبية وسريرية معتمدة' : 'Clinical & Biomedical Quality Assured'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
