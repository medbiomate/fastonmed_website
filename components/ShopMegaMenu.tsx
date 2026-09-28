'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Activity,
  HeartPulse,
  ThermometerSnowflake,
  Radio,
  FlaskConical,
  Bed,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

interface ShopMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function ShopMegaMenu({
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave
}: ShopMegaMenuProps) {
  const { locale, isArabic, isRtl, localizeUrl } = useLocale();

  if (!isOpen) return null;

  const categories = [
    {
      title: 'ICU & Critical Care',
      titleAr: 'العناية المركزة والحرجة',
      slug: 'icu-equipment',
      icon: <Activity size={18} color="#00875a" />,
      items: [
        { label: 'ICU Mechanical Ventilators', labelAr: 'أجهزة التنفس الاصطناعي للعناية المركزة', href: '/product-category/icu-equipment' },
        { label: 'Automated External Defibrillators (AED)', labelAr: 'أجهزة مزيل الرجفان الآلي (AED)', href: '/automated-external-defibrillator' },
        { label: 'Syringe & Volumetric Infusion Pumps', labelAr: 'مضخات الحقن والترشيح الوريدي', href: '/product-category/icu-equipment' },
        { label: 'High-Vacuum Medical Suction Units', labelAr: 'وحدات الشفط الطبي الجراحي', href: '/product-category/icu-equipment' },
        { label: 'BiPAP & CPAP Breathing Therapy', labelAr: 'أجهزة التنفس BiPAP و CPAP', href: '/cpap-apap-machine' }
      ]
    },
    {
      title: 'Patient Monitoring & ECG',
      titleAr: 'مراقبة المرضى وتخطيط القلب',
      slug: 'patient-monitoring',
      icon: <HeartPulse size={18} color="#00875a" />,
      items: [
        { label: 'Multi-Parameter Patient Monitors', labelAr: 'شاشات مراقبة العلامات الحيوية', href: '/product-category/patient-monitoring' },
        { label: '12-Lead Diagnostic ECG Machines', labelAr: 'أجهزة تخطيط كهربية القلب 12 قناة', href: '/ecg-machine' },
        { label: 'Holter Continuous ECG Monitors', labelAr: 'أجهزة هولتر لتخطيط القلب المستمر', href: '/holter-ecg-monitor-2' },
        { label: 'Ambulatory Blood Pressure (ABPM)', labelAr: 'أجهزة قياس ضغط الدم التلقائي المتنقل', href: '/ambulatory-blood-pressure-monitor' },
        { label: 'TMT Stress Test Systems', labelAr: 'أنظمة اختبار الجهد للقلب (TMT)', href: '/tmt-stress-test-system' }
      ]
    },
    {
      title: 'Medical Cold Storage',
      titleAr: 'التبريد والتخزين الطبي (2–8° م)',
      slug: 'pharmacy-refrigerators',
      icon: <ThermometerSnowflake size={18} color="#00875a" />,
      items: [
        { label: '2°C–8°C Pharmacy Refrigerators', labelAr: 'ثلاجات الصيدليات وحفظ الأدوية 2–8° م', href: '/product-category/pharmacy-refrigerators' },
        { label: '-20°C to -86°C Ultra-Low Biofreezers', labelAr: 'مجمدات فائقة التبريد (-86° م)', href: '/product-category/pharmacy-refrigerators' },
        { label: 'Vaccine Cold-Chain Storage', labelAr: 'ثلاجات حفظ سلسلة تبريد اللقاحات', href: '/product-category/pharmacy-refrigerators' },
        { label: 'Cold-Chain Data Loggers', labelAr: 'أجهزة تسجيل ومراقبة درجات الحرارة', href: '/product-category/pharmacy-refrigerators' },
        { label: 'Portable Vaccine Carriers', labelAr: 'صناديق نقل العينات واللقاحات المبردة', href: '/product-category/pharmacy-refrigerators' }
      ]
    },
    {
      title: 'Ultrasound & Radiology',
      titleAr: 'الموجات فوق الصوتية والأشعة',
      slug: 'radiology-equipments',
      icon: <Radio size={18} color="#00875a" />,
      items: [
        { label: 'Color Doppler Ultrasound Scanners', labelAr: 'أجهزة الموجات فوق الصوتية الدوبلر الملونة', href: '/product-category/radiology-equipments' },
        { label: 'Digital Mobile X-Ray Systems', labelAr: 'أنظمة الأشعة السينية الرقمية المتحركة', href: '/product-category/radiology-equipments' },
        { label: 'Ultrasound Probe Crystal Repair', labelAr: 'صيانة وتصليح مجسات الموجات الصوتية', href: '/ultrasound-probe-repair-in-uae' },
        { label: 'Obstetrics & Gynecology Equipment', labelAr: 'أجهزة ومعدات النساء والتوليد', href: '/best-obstetrics-gynecology-equipment-in-uae' },
        { label: 'Radiology Supplier in UAE', labelAr: 'مورد معتمد لأجهزة الأشعة في الإمارات', href: '/radiology-equipment-supplier-in-uae' }
      ]
    },
    {
      title: 'Clinical Laboratory',
      titleAr: 'المختبرات والتحاليل الطبية',
      slug: 'laboratory-equipment',
      icon: <FlaskConical size={18} color="#00875a" />,
      items: [
        { label: 'Biochemistry & Blood Analyzers', labelAr: 'أجهزة تحاليل الكيمياء الحيوية والدم', href: '/product-category/laboratory-equipment' },
        { label: 'High-Speed Clinical Centrifuges', labelAr: 'أجهزة الطرد المركزي المخبري عالية السرعة', href: '/product-category/laboratory-equipment' },
        { label: 'Medical Steam Autoclaves', labelAr: 'أجهزة التعقيم بالبخار (الأوتوكلاف)', href: '/product-category/laboratory-equipment' },
        { label: 'PRP Centrifuges & Tubes', labelAr: 'أجهزة وأنابيب البلازما الغنية بالصفائح (PRP)', href: '/prp-tubes' },
        { label: 'Laboratory Diagnostic Microscopes', labelAr: 'المجاهر الطبية التشخيصية المتقدمة', href: '/product-category/laboratory-equipment' }
      ]
    },
    {
      title: 'Hospital Furniture & Clinic',
      titleAr: 'أثاث المستشفيات والعيادات',
      slug: 'hospital-furniture',
      icon: <Bed size={18} color="#00875a" />,
      items: [
        { label: 'Electric 5-Function ICU Beds', labelAr: 'أسرة العناية المركزة الكهربائية 5 حركات', href: '/product-category/hospital-furniture' },
        { label: 'Hydraulic Examination Couches', labelAr: 'طاولات الفحص الطبي الهيدروليكية', href: '/product-category/hospital-furniture' },
        { label: 'Patient Transport Stretchers', labelAr: 'نقالات نقل المرضى والطوارئ', href: '/product-category/hospital-furniture' },
        { label: 'Dental Clinic Units & Chairs', labelAr: 'كراسي ووحدات عيادات الأسنان المتكاملة', href: '/dental-equipment-supplier-in-dubai' },
        { label: 'Emergency Crash & Medication Carts', labelAr: 'عربات الطوارئ وإنعاش القلب والأدوية', href: '/product-category/hospital-furniture' }
      ]
    }
  ];

  const featuredProducts = [
    {
      id: 'ventilator',
      title: 'ICU Mechanical Ventilator',
      titleAr: 'جهاز تنفس اصطناعي للعناية المركزة',
      category: 'Critical Care / ICU',
      categoryAr: 'العناية المركزة والحرجة',
      badge: 'Clinical Grade',
      badgeAr: 'جودة سريرية',
      badgeColor: '#00875a',
      image: '/images/hero-showcase/1-icu-ventilator.png',
      href: '/product-category/icu-equipment'
    },
    {
      id: 'monitor',
      title: 'Multi-Parameter Patient Monitor',
      titleAr: 'شاشة مراقبة علامات حيوية متعددة القياسات',
      category: 'Telemetry & ICU',
      categoryAr: 'مراقبة المرضى وتخطيط القلب',
      badge: 'Bestseller',
      badgeAr: 'الأكثر طلباً',
      badgeColor: '#2563eb',
      image: '/images/hero-showcase/2-patient-monitor.png',
      href: '/product-category/patient-monitoring'
    },
    {
      id: 'fridge',
      title: 'Haier 2°C–8°C Pharmacy Fridge',
      titleAr: 'ثلاجة صيدليات هاير 2–8° م',
      category: 'Cold-Chain Storage',
      categoryAr: 'التبريد والتخزين الطبي',
      badge: '2°C–8°C Certified',
      badgeAr: 'معتمد 2°C–8°C',
      badgeColor: '#0891b2',
      image: '/images/hero-showcase/4-pharmacy-fridge.png',
      href: '/product-category/pharmacy-refrigerators'
    }
  ];

  return (
    <>
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '112px',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 98,
          transition: 'opacity 0.2s ease'
        }}
      />

      {/* Mega Menu Dropdown */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          width: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.22)',
          borderTop: '1px solid #eef2f6',
          borderBottom: '3px solid #00875a',
          zIndex: 99,
          animation: 'fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <style>{`
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .fm-mega-sublink {
            display: flex;
            align-items: center;
            font-size: 0.81rem;
            color: #475569;
            text-decoration: none;
            padding: 4px 0;
            transition: all 0.15s ease;
          }
          .fm-mega-sublink:hover {
            color: #00875a !important;
            transform: translateX(3px);
          }
          .fm-cat-heading {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.88rem;
            font-weight: 700;
            color: #0f172a;
            text-decoration: none;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1.5px solid #f1f5f9;
            transition: color 0.15s ease;
          }
          .fm-cat-heading:hover {
            color: #00875a;
          }
          .fm-featured-card {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 12px;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          .fm-featured-card:hover {
            background: #ffffff;
            border-color: #00875a;
            box-shadow: 0 6px 16px rgba(0, 135, 90, 0.12);
            transform: translateY(-2px);
          }
        `}</style>

        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '28px 24px 24px 24px',
            display: 'flex',
            gap: '36px'
          }}
        >
          {/* LEFT 72%: Categories & Subcategories Grid (3 columns x 2 rows) */}
          <div style={{ flex: '1 1 auto' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '24px 30px'
              }}
            >
              {categories.map(cat => (
                <div key={cat.slug}>
                  <Link
                    href={localizeUrl(`/product-category/${cat.slug}`)}
                    onClick={onClose}
                    className="fm-cat-heading"
                  >
                    <span>{cat.icon}</span>
                    <span>{isArabic ? cat.titleAr : cat.title}</span>
                  </Link>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {cat.items.map(item => (
                      <li key={item.label}>
                        <Link
                          href={localizeUrl(item.href)}
                          onClick={onClose}
                          className="fm-mega-sublink"
                        >
                          <ChevronRight
                            size={13}
                            color="#94a3b8"
                            style={{
                              [isArabic ? 'marginLeft' : 'marginRight']: '4px',
                              transform: isArabic ? 'scaleX(-1)' : 'none',
                              flexShrink: 0
                            }}
                          />
                          <span>{isArabic ? item.labelAr : item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom Bar: Explore Full Catalog Banner */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid #eef2f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    backgroundColor: '#e6f4ea',
                    color: '#00875a',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}
                >
                  {isArabic ? '+2,720 منتج معتمد' : '2,720+ PRODUCTS'}
                </span>
                <span style={{ fontSize: '0.84rem', color: '#475569' }}>
                  {isArabic
                    ? 'توريد الأجهزة والمستلزمات الطبية المعتمدة للمستشفيات والعيادات في الإمارات.'
                    : 'Supplying certified hospital devices and biomedical supplies across UAE.'}
                </span>
              </div>

              <Link
                href={localizeUrl('/shop')}
                onClick={onClose}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'background 0.15s ease'
                }}
              >
                <span>{isArabic ? 'تصفح الكتالوج الشامل' : 'View Full Catalog'}</span>
                <ArrowRight size={14} style={{ transform: isArabic ? 'scaleX(-1)' : 'none' }} />
              </Link>
            </div>
          </div>

          {/* RIGHT 28%: Featured Medical Equipment with Real Product Images */}
          <div
            style={{
              width: '320px',
              flexShrink: 0,
              borderLeft: isArabic ? 'none' : '1px solid #f1f5f9',
              borderRight: isArabic ? '1px solid #f1f5f9' : 'none',
              paddingLeft: isArabic ? 0 : '28px',
              paddingRight: isArabic ? '28px' : 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {isArabic ? 'أجهزة مميزة' : 'Featured Equipment'}
              </div>
              <span style={{ fontSize: '0.72rem', color: '#00875a', fontWeight: 700 }}>
                {isArabic ? 'مخزون الإمارات' : 'UAE Stock'}
              </span>
            </div>

            {featuredProducts.map(p => (
              <Link
                key={p.id}
                href={localizeUrl(p.href)}
                onClick={onClose}
                className="fm-featured-card"
              >
                {/* Product Image Container */}
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    padding: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={p.image}
                    alt={isArabic ? p.titleAr : p.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Product Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span
                      style={{
                        backgroundColor: p.badgeColor,
                        color: '#ffffff',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {isArabic ? p.badgeAr : p.badge}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      lineHeight: 1.25,
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {isArabic ? p.titleAr : p.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {isArabic ? p.categoryAr : p.category}
                  </div>
                </div>
              </Link>
            ))}

            {/* Need consultation button */}
            <Link
              href={localizeUrl('/contact')}
              onClick={onClose}
              style={{
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                color: '#334155',
                fontSize: '0.78rem',
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center'
              }}
            >
              <ShieldCheck size={15} color="#00875a" />
              <span>{isArabic ? 'طلب عرض أسعار معتمد؟ تواصل معنا' : 'Need Equipment Quotation? Contact Us'}</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
