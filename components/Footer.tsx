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
import { useLocale } from '@/lib/locale-context';

const row1Columns = [
  {
    titleEn: 'ICU & Critical Care Guides',
    titleAr: 'أدلة العناية المركزة والحالات الحرجة',
    items: [
      { labelEn: 'ICU Ventilators & Respirators', labelAr: 'أجهزة التنفس الاصطناعي للعناية المركزة', href: '/product-category/icu-equipment' },
      { labelEn: 'Multi-Parameter ICU Monitors', labelAr: 'أجهزة مراقبة المرضى متعددة المعايير', href: '/product-category/patient-monitoring' },
      { labelEn: 'Automated External Defibrillator', labelAr: 'أجهزة إزالة رجفان القلب الآلية (AED)', href: '/automated-external-defibrillator' },
      { labelEn: 'MoH Registered AED Machine UAE', labelAr: 'أجهزة AED معتمدة من وزارة الصحة', href: '/moh-registered-aed-machine-in-uae' },
      { labelEn: 'AED Replacement Pads in Dubai', labelAr: 'ضمادات ووسادات أجهزة الصدمات بدبي', href: '/aed-replacement-pad-in-dubai' },
      { labelEn: 'Syringe & Infusion Pumps', labelAr: 'مضخات الحقن والوريد الطبية الدقيقة', href: '/product-category/icu-equipment' },
      { labelEn: 'High-Vacuum Suction Units', labelAr: 'وحدات شفط جراحية عالية الفراغ', href: '/product-category/icu-equipment' },
      { labelEn: 'BiPAP Non-Invasive Ventilation', labelAr: 'أجهزة التنفس غير الغازي BiPAP', href: '/bipap-machine' },
      { labelEn: 'CPAP & APAP Sleep Therapy', labelAr: 'أجهزة علاج انقطاع التنفس CPAP وAPAP', href: '/cpap-apap-machine' },
      { labelEn: 'Medical Oxygen Sensors & Cells', labelAr: 'حساسات وخلايا الأكسجين الطبي', href: '/oxygen-sensor' },
      { labelEn: 'Emergency Resuscitation Crash Carts', labelAr: 'عربات الطوارئ والإنعاش الطبي', href: '/product-category/hospital-furniture' },
      { labelEn: 'High Flow Nasal Cannula (HFNC)', labelAr: 'أجهزة قنية الأنف عالية التدفق (HFNC)', href: '/product-category/icu-equipment' }
    ]
  },
  {
    titleEn: 'Diagnostic & Cardiology Guides',
    titleAr: 'أدلة التشخيص وطب القلب',
    items: [
      { labelEn: '12-Lead Diagnostic ECG Machine', labelAr: 'أجهزة تخطيط القلب التشخيصية 12 قناة', href: '/ecg-machine' },
      { labelEn: 'Holter ECG Continuous Monitor', labelAr: 'أجهزة مراقبة تخطيط القلب المستمر (هولتر)', href: '/holter-ecg-monitor-2' },
      { labelEn: 'Ambulatory Blood Pressure (ABPM)', labelAr: 'أجهزة مراقبة ضغط الدم المتنقلة (ABPM)', href: '/ambulatory-blood-pressure-monitor' },
      { labelEn: 'Ambulatory & Holter ECG Monitors', labelAr: 'أجهزة هولتر ومراقبة القلب وضغط الدم', href: '/ambulatory-and-holter-ecg-monitors' },
      { labelEn: 'TMT Cardiac Stress Test System', labelAr: 'أنظمة اختبار الجهد للقلب (TMT)', href: '/tmt-stress-test-system' },
      { labelEn: 'Cardiology Equipment Supplier', labelAr: 'مورد أجهزة ومعدات طب وجراحة القلب', href: '/cardiology-equipment' },
      { labelEn: 'Color Doppler Ultrasound Machine', labelAr: 'أجهزة سونار الدوبلر الملون التراساوند', href: '/product-category/radiology-equipments' },
      { labelEn: 'Radiology Equipment Supplier UAE', labelAr: 'مورد أجهزة الأشعة والتصوير الطبي بالإمارات', href: '/radiology-equipment-supplier-in-uae' },
      { labelEn: 'Ultrasound Probe Repair UAE', labelAr: 'إصلاح وصيانة مجسات السونار بالإمارات', href: '/ultrasound-probe-repair-in-uae' },
      { labelEn: 'Obstetrics & Gynecology Equipment', labelAr: 'أجهزة ومعدات طب النساء والولادة', href: '/best-obstetrics-gynecology-equipment-in-uae' },
      { labelEn: 'PRP Tubes & Centrifuge Kits', labelAr: 'أنابيب البلازما PRP وأجهزة الطرد المركزي', href: '/prp-tubes' },
      { labelEn: 'Digital Mobile Radiography X-Ray', labelAr: 'أجهزة الأشعة السينية الرقمية المتنقلة', href: '/product-category/radiology-equipments' }
    ]
  },
  {
    titleEn: 'Hospital Furniture Guides',
    titleAr: 'أدلة أثاث المستشفيات والأسرة',
    items: [
      { labelEn: 'Electric 5-Function ICU Hospital Beds', labelAr: 'أسرة عناية مركزة كهربائية 5 حركات', href: '/product-category/hospital-furniture' },
      { labelEn: 'Manual 2-Crank Fowler Hospital Beds', labelAr: 'أسرة مرضى يدوية بحركتين مع كرنك', href: '/product-category/hospital-furniture' },
      { labelEn: 'Hydraulic Examination Couches', labelAr: 'طاولات فحص سريري هيدروليكية', href: '/product-category/hospital-furniture' },
      { labelEn: 'Gynecological Delivery Beds & Tables', labelAr: 'أسرة وطاولات الولادة والفحص النسائي', href: '/product-category/hospital-furniture' },
      { labelEn: 'Patient Transport Stretchers & Carts', labelAr: 'نقالات وعربات نقل المرضى بالمستشفى', href: '/product-category/hospital-furniture' },
      { labelEn: 'Phlebotomy Blood Donation Chairs', labelAr: 'كراسي سحب الدم والتبرع المتخصصة', href: '/product-category/hospital-furniture' },
      { labelEn: 'Emergency Medication Crash Trolleys', labelAr: 'عربات أدوية الطوارئ والإنعاش المجهزة', href: '/product-category/hospital-furniture' },
      { labelEn: 'Hospital Bedside Lockers & Cabinets', labelAr: 'خزائن وطاولات جانبية لأسرة المرضى', href: '/product-category/hospital-furniture' },
      { labelEn: 'Overbed Food Tables & IV Poles', labelAr: 'طاولات طعام فوق السرير وحوامل محاليل', href: '/product-category/hospital-furniture' },
      { labelEn: 'Heavy-Duty Patient Wheelchairs', labelAr: 'كراسي متحركة للمرضى شديدة التحمل', href: '/product-category/hospital-furniture' },
      { labelEn: 'Dental Equipment Supplier Dubai', labelAr: 'مورد أجهزة وعيادات طب الأسنان بدبي', href: '/dental-equipment-supplier-in-dubai' },
      { labelEn: 'Surgical Shadowless OT Ceiling Lights', labelAr: 'كشافات عمليات جراحية سقفية بدون ظلال', href: '/product-category/hospital-furniture' }
    ]
  },
  {
    titleEn: 'Laboratory & Cold Chain Guides',
    titleAr: 'أدلة المختبرات وسلسلة التبريد',
    items: [
      { labelEn: '2°C–8°C Pharmacy Refrigeration', labelAr: 'ثلاجات صيدلية وطبية (2° إلى 8° مئوية)', href: '/product-category/pharmacy-refrigerators' },
      { labelEn: '-20°C to -86°C Ultra Low Biofreezers', labelAr: 'مجمدات حفظ عينات فائقة التبريد حتى -86°', href: '/product-category/pharmacy-refrigerators' },
      { labelEn: 'Clinical Chemistry Analyzers', labelAr: 'أجهزة تحاليل كيمياء الدم السريرية', href: '/product-category/laboratory-equipment' },
      { labelEn: 'High-Speed Clinical Centrifuges', labelAr: 'أجهزة طرد مركزي طبية عالية السرعة', href: '/product-category/laboratory-equipment' },
      { labelEn: 'Medical Steam Autoclaves & Sterilizers', labelAr: 'أجهزة أوتوكلاف وتعقيم طبي بالبخار', href: '/product-category/laboratory-equipment' },
      { labelEn: 'Biosafety & Laminar Airflow Benches', labelAr: 'كبائن السلامة الحيوية وتدفق الهواء النقي', href: '/product-category/laboratory-equipment' },
      { labelEn: 'Medical Ozone Generator Systems', labelAr: 'أنظمة ومولدات الأوزون الطبي العلاجي', href: '/ozone-generator' },
      { labelEn: 'School Medical Supplies in UAE', labelAr: 'مستلزمات العيادات المدرسية في الإمارات', href: '/school-medical-supplies-in-uae' },
      { labelEn: 'Clinical Consumables & ECG Paper', labelAr: 'مستهلكات طبية وورق تخطيط القلب', href: '/consumables' },
      { labelEn: 'Endoscope Repair in Dubai', labelAr: 'صيانة وإصلاح مناظير الجهاز الهضمي بدبي', href: '/flexible-rigid-endoscope-repair-in-dubai' },
      { labelEn: 'Used Medical Equipment in UAE', labelAr: 'أجهزة ومعدات طبية مستعملة ومجددة معتمدة', href: '/used-medical-equipment-in-uae' },
      { labelEn: 'Clinical Pathology Microscopes', labelAr: 'مجاهر فحص مخبري وسريري عالية الدقة', href: '/product-category/laboratory-equipment' }
    ]
  }
];

const row2Columns = [
  {
    titleEn: 'Biomedical Engineering & AMC',
    titleAr: 'الهندسة الطبية الحيوية وعقود الصيانة',
    items: [
      { labelEn: 'Equipment Calibration Service UAE', labelAr: 'خدمات معايرة الأجهزة الطبية في الإمارات', href: '/medical-equipment-calibration-service-in-uae' },
      { labelEn: 'AMC & CMC Maintenance Dubai UAE', labelAr: 'عقود صيانة سنوية وشاملة للأجهزة الطبية', href: '/amc-cmc-for-medical-equipment-in-dubai-uae' },
      { labelEn: 'Planned Preventive Maintenance (PPM)', labelAr: 'الصيانة الوقائية الدورية المجدولة (PPM)', href: '/plan-preventive-maintenance-for-medical-equipment-in-uae' },
      { labelEn: 'Medical Equipment Service in UAE', labelAr: 'مركز خدمة وصيانة المعدات الطبية بالإمارات', href: '/medical-equipment-service-in-uae-2' },
      { labelEn: 'Biomedical Electrical Safety Audits', labelAr: 'تدقيق السلامة الكهربائية للأجهزة الطبية', href: '/amc-cmc-for-medical-equipment-in-dubai-uae' },
      { labelEn: 'Ultrasound Acoustic & Crystal Repair', labelAr: 'إصلاح كريستالات وصوتيات مجسات السونار', href: '/ultrasound-probe-repair-in-uae' },
      { labelEn: 'Rigid & Flexible Optical Calibration', labelAr: 'معايرة وصيانة المناظير الصلبة والمرنة', href: '/flexible-rigid-endoscope-repair-in-dubai' },
      { labelEn: 'ICU Ventilator Flow Sensor Overhaul', labelAr: 'صيانة ومعايرة حساسات تدفق أجهزة التنفس', href: '/product-category/icu-equipment' },
      { labelEn: 'Hospital Turnkey Equipment Setup', labelAr: 'تجهيز المستشفيات والعيادات تسليم مفتاح', href: '/contact' },
      { labelEn: '24/7 Biomedical Emergency Support', labelAr: 'دعم هندسي وطبي طارئ على مدار الساعة', href: '/contact' }
    ]
  },
  {
    titleEn: 'Healthcare Facilities Supplied',
    titleAr: 'المنشآت الصحية المعتمدة',
    items: [
      { labelEn: 'Tertiary Hospitals & Emergency Units', labelAr: 'المستشفيات التخصصية وأقسام الطوارئ', href: '/about-us' },
      { labelEn: 'Day Surgery & Outpatient Clinics', labelAr: 'مراكز جراحة اليوم الواحد والعيادات الخارجية', href: '/about-us' },
      { labelEn: 'Polyclinics & Diagnostic Centers', labelAr: 'المجمعات الطبية ومراكز الفحص التشخيصي', href: '/about-us' },
      { labelEn: 'Radiology & Medical Imaging Centers', labelAr: 'مراكز الأشعة والتصوير الطبي المتقدم', href: '/radiology-equipment-supplier-in-uae' },
      { labelEn: 'Clinical Pathology & Diagnostic Labs', labelAr: 'مختبرات التحاليل الطبية والباثولوجيا', href: '/product-category/laboratory-equipment' },
      { labelEn: 'Dental Clinics & Maxillofacial Units', labelAr: 'عيادات الأسنان وجراحة الوجه والفكين', href: '/dental-equipment-supplier-in-dubai' },
      { labelEn: 'Physiotherapy & Rehabilitation Centers', labelAr: 'مراكز العلاج الطبيعي والتأهيل الطبي', href: '/product-category/hospital-furniture' },
      { labelEn: 'School, University & Nursery Clinics', labelAr: 'عيادات المدارس والجامعات والحضانات', href: '/school-medical-supplies-in-uae' },
      { labelEn: 'Pharmacy & Cold Chain Warehouses', labelAr: 'مستودعات الأدوية وسلسلة التبريد الطبي', href: '/product-category/pharmacy-refrigerators' },
      { labelEn: 'Ambulance Fleets & First Responders', labelAr: 'أسطول سيارات الإسعاف وفرق الاستجابة السريعة', href: '/moh-registered-aed-machine-in-uae' }
    ]
  },
  {
    titleEn: 'UAE Regional Distribution',
    titleAr: 'التوزيع الإقليمي في الإمارات',
    items: [
      { labelEn: 'Medical Equipment Supplier Dubai', labelAr: 'مورد أجهزة طبية في دبي', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Medical Equipment Abu Dhabi & Al Ain', labelAr: 'مورد معدات طبية في أبوظبي والعين', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Clinical Supplies Sharjah Medical City', labelAr: 'مستلزمات طبية في مدينة الشارقة للرعاية الصحية', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Medical Equipment Supplier Ajman', labelAr: 'مورد أجهزة طبية في عجمان', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Hospital Equipment Ras Al Khaimah (RAK)', labelAr: 'معدات مستشفيات في رأس الخيمة', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Healthcare Solutions Fujairah & UAQ', labelAr: 'حلول رعاية صحية في الفجيرة وأم القيوين', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Same-Day Dubai Clinical Express Delivery', labelAr: 'توصيل سريع في نفس اليوم للعيادات بدبي', href: '/shipping' },
      { labelEn: 'UAE Free Zone & GCC Export Supply', labelAr: 'توريد للمناطق الحرة وتصدير لدول الخليج', href: '/contact' },
      { labelEn: 'Hospital & Clinic Wholesale Procurement', labelAr: 'توريد بالجملة للمستشفيات والعيادات', href: '/contact' },
      { labelEn: 'UAE Ministry & Private Hospital Tenders', labelAr: 'مناقصات المستشفيات الحكومية والخاصة', href: '/contact' }
    ]
  },
  {
    titleEn: 'Standards & Regulations Guides',
    titleAr: 'أدلة المعايير واللوائح الطبية',
    items: [
      { labelEn: 'Best Medical Equipment Supplier UAE', labelAr: 'أفضل مورد معدات وأجهزة طبية في الإمارات', href: '/medical-equipment-supplier-in-uae' },
      { labelEn: 'Medical Equipment Quality Standards', labelAr: 'معايير جودة المعدات الطبية العالمية', href: '/about-us' },
      { labelEn: 'Clinical Facility Supply Guidelines', labelAr: 'إرشادات تجهيز المنشآت والعيادات الطبية', href: '/about-us' },
      { labelEn: 'Biomedical Engineering & Calibration', labelAr: 'معايير الهندسة الطبية الحيوية والمعايرة', href: '/about-us' },
      { labelEn: 'Official Manufacturer Warranty Terms', labelAr: 'شروط الضمان المعتمد من المصنعين', href: '/terms-conditions' },
      { labelEn: 'Warranty Claims & Exchange Policy', labelAr: 'سياسة مطالبات الضمان واستبدال الأجهزة', href: '/returns-exchanges' },
      { labelEn: 'Cold-Chain Temperature Monitored Delivery', labelAr: 'شحن مبرد مراقب درجات الحرارة للمستلزمات', href: '/shipping' },
      { labelEn: 'Hospital Privacy & Data Protection', labelAr: 'خصوصية المنشآت الصحية وحماية البيانات', href: '/privacy-policy' },
      { labelEn: 'Certified Global Healthcare Brands', labelAr: 'علامات تجارية طبية عالمية معتمدة', href: '/brands' },
      { labelEn: 'FastonMed Warehouses & Service Hubs', labelAr: 'مستودعات ومراكز خدمات فاستون ميد', href: '/store-locations' }
    ]
  }
];

export default function Footer() {
  const { locale, isArabic } = useLocale();
  const isAr = isArabic || locale === 'ar' || (typeof window !== 'undefined' && (window.location.pathname === '/ar' || window.location.pathname.startsWith('/ar/')));
  const getHref = (url: string) => isAr ? (url === '/' ? '/ar' : (url.startsWith('/ar') ? url : `/ar${url}`)) : url;
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [chromeSettings, setChromeSettings] = useState(() => store.getSiteChrome());
  

  const allGuideTitles = [
    ...row1Columns.map(c => c.titleEn),
    ...row2Columns.map(c => c.titleEn)
  ];

  // Desktop: single accordion per row (Row 1 and Row 2)
  const [desktopRow1Open, setDesktopRow1Open] = useState(true);
  const [desktopRow2Open, setDesktopRow2Open] = useState(false);

  // Mobile: individual accordion per category
  const [mobileOpenGuides, setMobileOpenGuides] = useState<Record<string, boolean>>({
    'ICU & Critical Care Guides': true
  });

  const toggleMobileGuide = (title: string) => {
    setMobileOpenGuides(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const areAllOpen = desktopRow1Open && desktopRow2Open;

  const toggleAllGuides = () => {
    if (areAllOpen) {
      setDesktopRow1Open(false);
      setDesktopRow2Open(false);
      setMobileOpenGuides({});
    } else {
      setDesktopRow1Open(true);
      setDesktopRow2Open(true);
      const next: Record<string, boolean> = {};
      allGuideTitles.forEach(t => {
        next[t] = true;
      });
      setMobileOpenGuides(next);
    }
  };

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
        .fm-desktop-guide-rows {
          display: block;
        }
        .fm-mobile-guide-cards {
          display: none;
        }
        .fm-row-accordion-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .fm-row-accordion-card:hover {
          border-color: #cbd5e1;
        }
        .fm-row-accordion-header:hover {
          background-color: #f8fafc !important;
        }
        .fm-guide-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .fm-guide-card:hover {
          border-color: #cbd5e1;
        }
        .fm-guide-header-btn:hover {
          background-color: #f8fafc !important;
        }
        @media (max-width: 991px) {
          .fm-top-row {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .fm-top-columns {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px 16px !important;
          }
        }
        @media (max-width: 767px) {
          .fm-desktop-guide-rows {
            display: none !important;
          }
          .fm-mobile-guide-cards {
            display: flex !important;
            flex-direction: column;
            gap: 12px;
          }
          .fm-bottom-legal-row {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 14px !important;
          }
        }
        @media (max-width: 640px) {
          .fm-top-columns {
            grid-template-columns: 1fr !important;
            gap: 24px 16px !important;
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
              <Link href={isAr ? '/ar/about-us' : '/about-us'} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'من نحن' : 'About Us'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={isAr ? '/ar/contact' : '/contact'} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'اتصل بنا' : 'Contact'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={isAr ? '/ar/shop' : '/shop'} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'الكتالوج' : 'Catalog'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={isAr ? '/ar/brands' : '/brands'} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'العلامات التجارية' : 'Brands'}
              </Link>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <Link href={isAr ? '/ar/contact' : '/contact'} className="fm-footer-link" style={{ fontWeight: 700, color: '#0f172a' }}>
                {isAr ? 'طلب عرض أسعار' : 'Request Quote'}
              </Link>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              {isAr
                ? 'فاستونميد هي أفضل مورد للأجهزة والمعدات الطبية في الإمارات ودبي. موزع معتمد للتقنيات الطبية الحيوية، أجهزة التنفس للعناية المركزة، أجهزة التشخيص والمعدات السريرية.'
                : 'FastonMed is the Best Medical Equipment Supplier in UAE. Official distributor of certified biomedical technology, ICU ventilators, diagnostics, and clinical equipment.'}
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
              gap: '30px'
            }}
          >
            {/* Products Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                {isAr ? 'المنتجات والأجهزة' : 'Products'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={isAr ? '/ar/product-category/icu-equipment' : '/product-category/icu-equipment'} className="fm-footer-link">
                    {isAr ? 'العناية المركزة والحرجة' : 'ICU & Critical Care'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/product-category/patient-monitoring' : '/product-category/patient-monitoring'} className="fm-footer-link">
                    {isAr ? 'مراقبة المرضى السريرية' : 'Patient Monitoring'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/product-category/pharmacy-refrigerators' : '/product-category/pharmacy-refrigerators'} className="fm-footer-link">
                    {isAr ? 'سلسلة التبريد الطبي' : 'Medical Cold Storage'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/product-category/radiology-equipments' : '/product-category/radiology-equipments'} className="fm-footer-link">
                    {isAr ? 'السونار والأشعة التشخيصية' : 'Ultrasound & Radiology'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/product-category/laboratory-equipment' : '/product-category/laboratory-equipment'} className="fm-footer-link">
                    {isAr ? 'المختبرات والتحاليل' : 'Clinical Laboratory'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/product-category/hospital-furniture' : '/product-category/hospital-furniture'} className="fm-footer-link">
                    {isAr ? 'أثاث المستشفيات' : 'Hospital Furniture'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/cardiology-equipment' : '/cardiology-equipment'} className="fm-footer-link">
                    {isAr ? 'تشخيص أمراض القلب' : 'Cardiology Diagnostics'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/shop' : '/shop'} className="fm-footer-link" style={{ fontWeight: 700, color: '#00875a' }}>
                    {isAr ? 'عرض جميع المنتجات (أكثر من 2,700 صنف) ←' : 'View All 2,700+ Products →'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                {isAr ? 'المصادر والخدمات' : 'Resources'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={isAr ? '/ar/medical-equipment-calibration-service-in-uae' : '/medical-equipment-calibration-service-in-uae'} className="fm-footer-link">
                    {isAr ? 'معايرة الأجهزة الطبية الحيوية' : 'Biomedical Calibration'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/amc-cmc-for-medical-equipment-in-dubai-uae' : '/amc-cmc-for-medical-equipment-in-dubai-uae'} className="fm-footer-link">
                    {isAr ? 'عقود الصيانة AMC و CMC' : 'AMC & CMC Contracts'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/plan-preventive-maintenance-for-medical-equipment-in-uae' : '/plan-preventive-maintenance-for-medical-equipment-in-uae'} className="fm-footer-link">
                    {isAr ? 'الصيانة الوقائية الدورية' : 'Preventive Maintenance'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/ultrasound-probe-repair-in-uae' : '/ultrasound-probe-repair-in-uae'} className="fm-footer-link">
                    {isAr ? 'إصلاح مجسات السونار' : 'Ultrasound Probe Repair'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/flexible-rigid-endoscope-repair-in-dubai' : '/flexible-rigid-endoscope-repair-in-dubai'} className="fm-footer-link">
                    {isAr ? 'إصلاح المناظير الطبية في دبي' : 'Endoscope Repair Dubai'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/used-medical-equipment-in-uae' : '/used-medical-equipment-in-uae'} className="fm-footer-link">
                    {isAr ? 'أجهزة طبية مستعملة معتمدة' : 'Certified Pre-Owned'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/school-medical-supplies-in-uae' : '/school-medical-supplies-in-uae'} className="fm-footer-link">
                    {isAr ? 'مستلزمات العيادات المدرسية' : 'School Medical Supplies'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/blog' : '/blog'} className="fm-footer-link">
                    {isAr ? 'المقالات والأدلة السريرية' : 'Clinical Guides & Articles'}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Important Links Column */}
            <div>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px 0' }}>
                {isAr ? 'روابط هامة' : 'Important Links'}
              </h4>
              <ul className="fm-dir-list">
                <li>
                  <Link href={isAr ? '/ar/medical-equipment-supplier-in-uae' : '/medical-equipment-supplier-in-uae'} className="fm-footer-link">
                    {isAr ? 'دليل التوريد الطبي في الإمارات' : 'Supplier Overview UAE'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/store-locations' : '/store-locations'} className="fm-footer-link">
                    {isAr ? 'المتجر والمستودعات' : 'Store & Warehouses'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/brands' : '/brands'} className="fm-footer-link">
                    {isAr ? 'العلامات المعتمدة' : 'Authorized Brands'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/order-tracking' : '/order-tracking'} className="fm-footer-link">
                    {isAr ? 'تتبع الطلبات' : 'Order Tracking'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/my-account' : '/my-account'} className="fm-footer-link">
                    {isAr ? 'بوابة حسابات المستشفيات' : 'Hospital Account Portal'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/contact' : '/contact'} className="fm-footer-link">
                    {isAr ? 'عروض أسعار ومناقصات' : 'Institutional RFQ Tender'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/shipping' : '/shipping'} className="fm-footer-link">
                    {isAr ? 'مواعيد التوصيل في الإمارات' : 'UAE Delivery Times'}
                  </Link>
                </li>
                <li>
                  <Link href={isAr ? '/ar/returns-exchanges' : '/returns-exchanges'} className="fm-footer-link">
                    {isAr ? 'سياسة الضمان والاسترجاع' : 'Warranty & Return Policy'}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECTORY SECTION: INDIVIDUAL ACCORDION CARDS (GODIGIT STYLE)            */}
        {/* ========================================================================= */}
        <div style={{ paddingTop: '28px', paddingBottom: '36px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '22px'
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
                {isAr ? 'دليل الأجهزة الطبية والرعاية الصحية في الإمارات' : 'UAE Healthcare Equipment & Clinical Directories'}
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                {isAr ? 'أدلة التوريد المباشر ومواصفات الهندسة الطبية الحيوية وتوزيع المستشفيات' : 'Direct procurement guides, biomedical specifications, and regional hospital distribution'}
              </p>
            </div>

            <button
              type="button"
              onClick={toggleAllGuides}
              className="fm-guides-toggle-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 16px',
                backgroundColor: areAllOpen ? '#f1f5f9' : '#ffffff',
                color: areAllOpen ? '#0f172a' : '#00875a',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
              }}
            >
              <span>{areAllOpen ? (isAr ? 'طي كافة الأدلة' : 'Collapse All') : (isAr ? 'توسيع كافة الأدلة' : 'Expand All')}</span>
              {areAllOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>

          {/* DESKTOP VIEW: SINGLE ACCORDION PER ROW (>= 768px) */}
          <div className="fm-desktop-guide-rows">
            {/* ROW 1 ACCORDION CARD */}
            <div
              className="fm-row-accordion-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                marginBottom: '14px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: desktopRow1Open ? '0 4px 14px rgba(15, 23, 42, 0.04)' : 'none'
              }}
            >
              <div
                onClick={() => setDesktopRow1Open(!desktopRow1Open)}
                className="fm-row-accordion-header"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '24px',
                  alignItems: 'center',
                  padding: '13px 20px',
                  backgroundColor: desktopRow1Open ? '#f8fafc' : '#ffffff',
                  borderBottom: desktopRow1Open ? '1px solid #eef2f6' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                  textAlign: isAr ? 'right' : 'left'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row1Columns[0].titleAr : row1Columns[0].titleEn}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row1Columns[1].titleAr : row1Columns[1].titleEn}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row1Columns[2].titleAr : row1Columns[2].titleEn}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <span>{isAr ? row1Columns[3].titleAr : row1Columns[3].titleEn}</span>
                  {desktopRow1Open ? (
                    <ChevronUp size={17} color="#00875a" style={{ flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
                  )}
                </div>
              </div>

              {desktopRow1Open && (
                <div style={{ padding: '18px 20px 22px 20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '24px',
                      alignItems: 'start'
                    }}
                  >
                    {row1Columns.map((col, idx) => (
                      <div key={idx}>
                        <ul
                          className="fm-dir-list"
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link href={getHref(item.href)} className="fm-footer-link">
                                {isAr ? item.labelAr : item.labelEn}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ROW 2 ACCORDION CARD */}
            <div
              className="fm-row-accordion-card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                boxShadow: desktopRow2Open ? '0 4px 14px rgba(15, 23, 42, 0.04)' : 'none'
              }}
            >
              <div
                onClick={() => setDesktopRow2Open(!desktopRow2Open)}
                className="fm-row-accordion-header"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '24px',
                  alignItems: 'center',
                  padding: '13px 20px',
                  backgroundColor: desktopRow2Open ? '#f8fafc' : '#ffffff',
                  borderBottom: desktopRow2Open ? '1px solid #eef2f6' : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                  textAlign: isAr ? 'right' : 'left'
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row2Columns[0].titleAr : row2Columns[0].titleEn}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row2Columns[1].titleAr : row2Columns[1].titleEn}
                </div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {isAr ? row2Columns[2].titleAr : row2Columns[2].titleEn}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <span>{isAr ? row2Columns[3].titleAr : row2Columns[3].titleEn}</span>
                  {desktopRow2Open ? (
                    <ChevronUp size={17} color="#00875a" style={{ flexShrink: 0 }} />
                  ) : (
                    <ChevronDown size={17} color="#94a3b8" style={{ flexShrink: 0 }} />
                  )}
                </div>
              </div>

              {desktopRow2Open && (
                <div style={{ padding: '18px 20px 22px 20px' }}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '24px',
                      alignItems: 'start'
                    }}
                  >
                    {row2Columns.map((col, idx) => (
                      <div key={idx}>
                        <ul
                          className="fm-dir-list"
                          style={{
                            listStyle: 'none',
                            padding: 0,
                            margin: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                          }}
                        >
                          {col.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <Link href={getHref(item.href)} className="fm-footer-link">
                                {isAr ? item.labelAr : item.labelEn}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* MOBILE VIEW: INDIVIDUAL ACCORDION PER CATEGORY (< 768px) */}
          <div className="fm-mobile-guide-cards">
            {[...row1Columns, ...row2Columns].map((category) => {
              const isOpen = !!mobileOpenGuides[category.titleEn];
              return (
                <div
                  key={category.titleEn}
                  className="fm-guide-card"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: isOpen ? '0 4px 14px rgba(15, 23, 42, 0.05)' : 'none'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileGuide(category.titleEn)}
                    className="fm-guide-header-btn"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '13px 16px',
                      backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                      border: 'none',
                      borderBottom: isOpen ? '1px solid #eef2f6' : 'none',
                      cursor: 'pointer',
                      textAlign: isAr ? 'right' : 'left',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <span style={{ lineHeight: 1.35 }}>{isAr ? category.titleAr : category.titleEn}</span>
                    {isOpen ? (
                      <ChevronUp size={17} color="#00875a" style={{ flexShrink: 0, [isAr ? 'marginRight' : 'marginLeft']: '8px' }} />
                    ) : (
                      <ChevronDown size={17} color="#94a3b8" style={{ flexShrink: 0, [isAr ? 'marginRight' : 'marginLeft']: '8px' }} />
                    )}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '12px 16px 16px 16px' }}>
                      <ul
                        className="fm-dir-list"
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        {category.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <Link href={getHref(item.href)} className="fm-footer-link">
                              {isAr ? item.labelAr : item.labelEn}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
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
              <Link href={isAr ? '/ar/shop' : '/shop'} className="fm-legal-link">{isAr ? 'التحميلات' : 'Downloads'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/privacy-policy' : '/privacy-policy'} className="fm-legal-link">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/terms-conditions' : '/terms-conditions'} className="fm-legal-link">{isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/returns-exchanges' : '/returns-exchanges'} className="fm-legal-link">{isAr ? 'الإرجاع والاستبدال' : 'Returns & Exchanges'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/shipping' : '/shipping'} className="fm-legal-link">{isAr ? 'الشحن والتوصيل' : 'Shipping & Delivery'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/about-us' : '/about-us'} className="fm-legal-link">{isAr ? 'معايير الجودة والضمان' : 'Quality & Warranty Standards'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/contact' : '/contact'} className="fm-legal-link">{isAr ? 'دعم طبي حيوي 24/7' : '24/7 Biomedical Support'}</Link>
              <span style={{ color: '#334155' }}>|</span>
              <Link href={isAr ? '/ar/store-locations' : '/store-locations'} className="fm-legal-link">{isAr ? 'مقر دبي' : 'Dubai Store'}</Link>
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
                ? 'فاستونميد هي أفضل مورد للأجهزة والمعدات الطبية في الإمارات. موزع للتكنولوجيا الطبية الحيوية المعتمدة، أجهزة التنفس للعناية المركزة، شاشات مراقبة المرضى، أثاث المستشفيات، الإضاءة الجراحية، التبريد الطبي وأجهزة المختبرات السريرية في دبي وأبوظبي والشارقة وعجمان ورأس الخيمة والفجيرة وأم القيوين. جميع العلامات التجارية والشعارات ملك لأصحابها من الشركات المصنعة.'
                : 'FastonMed is the Best Medical Equipment Supplier in UAE. Distributor of certified biomedical technology, ICU ventilators, multi-parameter patient monitors, hospital furniture, surgical lighting, medical cold storage, and clinical laboratory equipment across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. All brand logos, trademarks, and registered marks displayed on this platform belong to their respective corporate manufacturers.'}
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
