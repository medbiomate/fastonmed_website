'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Activity,
  HeartPulse,
  Wrench,
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  FileText,
  Sparkles,
  Stethoscope,
  Truck,
  Cpu,
  Clock,
  ArrowRight,
  Headphones,
  Check,
  Microscope,
  ThermometerSnowflake,
  Bed,
  Layers,
  Zap
} from 'lucide-react';
import TrustBar from '@/components/TrustBar';
import { useLocale } from '@/lib/locale-context';

export default function AboutPage() {
  const { isArabic, localizeUrl } = useLocale();

  const isAr = isArabic;

  const quickStats = [
    {
      icon: <Award size={24} color="#00875a" />,
      number: '100%',
      labelEn: 'Certified OEM Medical Technology',
      labelAr: 'تقنيات طبية معتمدة من المصنعين'
    },
    {
      icon: <Wrench size={24} color="#00875a" />,
      number: 'ISO & Reg.',
      labelEn: 'Compliant Biomedical Calibration',
      labelAr: 'معايرة طبية متوافقة مع المعايير'
    },
    {
      icon: <Clock size={24} color="#00875a" />,
      number: '24/7',
      labelEn: 'Biomedical Field Response UAE',
      labelAr: 'استجابة هندسية على مدار الساعة'
    },
    {
      icon: <Truck size={24} color="#00875a" />,
      number: '7 Emirates',
      labelEn: 'Direct Hospital & Clinic Logistics',
      labelAr: 'توزيع شامل للمستشفيات والعيادات'
    }
  ];

  const salesCategories = [
    {
      icon: <Activity size={24} color="#00875a" />,
      titleEn: 'ICU & Critical Care Equipment',
      titleAr: 'أجهزة العناية المركزة والحالات الحرجة',
      descEn: 'Advanced ICU mechanical ventilators, MoH-compliant AED machines, biphasic defibrillators, multi-parameter patient monitors, and precision infusion pumps.',
      descAr: 'أجهزة التنفس الاصطناعي للعناية المركزة، أجهزة إزالة الرجفان الآلية (AED)، شاشات مراقبة المرضى الحيوية، ومضخات الحقن والوريد الطبية الدقيقة.',
      href: '/product-category/icu-equipment'
    },
    {
      icon: <HeartPulse size={24} color="#00875a" />,
      titleEn: 'Diagnostic & Cardiology Systems',
      titleAr: 'أنظمة التشخيص وطب وجراحة القلب',
      descEn: '12-lead diagnostic ECG machines, continuous 24-hour Holter monitors, Ambulatory Blood Pressure Monitors (ABPM), and TMT cardiac treadmill stress test systems.',
      descAr: 'أجهزة تخطيط القلب التشخيصية 12 قناة، أجهزة هولتر للقلب 24 ساعة، مراقبة ضغط الدم المتنقلة (ABPM)، وأنظمة اختبار الجهد للقلب (TMT).',
      href: '/product-category/patient-monitoring'
    },
    {
      icon: <Cpu size={24} color="#00875a" />,
      titleEn: 'Radiology & Ultrasound Imaging',
      titleAr: 'أجهزة الأشعة والسونار والتصوير الطبي',
      descEn: 'High-resolution color Doppler ultrasound machines, portable sonography systems, digital mobile radiography units, and specialized ultrasound transducers.',
      descAr: 'أجهزة سونار الدوبلر الملون عالية الدقة، أنظمة الموجات فوق الصوتية المتنقلة، أجهزة الأشعة الرقمية المتنقلة، ومجسات السونار المتخصصة.',
      href: '/product-category/radiology-equipments'
    },
    {
      icon: <ThermometerSnowflake size={24} color="#00875a" />,
      titleEn: 'Laboratory & Medical Cold Chain',
      titleAr: 'أنظمة التبريد المخبري وسلسلة التبريد الطبي',
      descEn: '2°C to 8°C certified pharmacy refrigerators, -20°C to -86°C ultra-low temperature bio-freezers, clinical centrifuges, chemistry analyzers, and steam autoclaves.',
      descAr: 'ثلاجات الأدوية واللقاحات الطبية المعتمدة (2° إلى 8°)، مجمدات حفظ العينات فائقة التبريد حتى -86°، أجهزة الطرد المركزي، والتعقيم بالأوتوكلاف.',
      href: '/product-category/pharmacy-refrigerators'
    },
    {
      icon: <Bed size={24} color="#00875a" />,
      titleEn: 'Hospital Furniture & Surgical Suite',
      titleAr: 'أثاث المستشفيات وتجهيزات غرف العمليات',
      descEn: '5-function electric ICU beds, hydraulic surgical OT tables, shadowless operating theatre ceiling lights, emergency resuscitation crash carts, and examination couches.',
      descAr: 'أسرة العناية المركزة الكهربائية 5 حركات، طاولات العمليات الهيدروليكية، كشافات العمليات الجراحية بدون ظلال، وعربات الطوارئ والإنعاش.',
      href: '/product-category/hospital-furniture'
    },
    {
      icon: <Stethoscope size={24} color="#00875a" />,
      titleEn: 'Dental, Aesthetics & Specialized Practice',
      titleAr: 'عيادات الأسنان والمراكز التخصصية والتجميل',
      descEn: 'Ergonomic dental chair units, aesthetic medical devices, rehabilitation therapy furniture, and specialized equipment for Day Surgery and specialized clinics.',
      descAr: 'وحدات وكراسي طب الأسنان المتطورة، أجهزة العيادات التجميلية، أثاث ومعدات العلاج الطبيعي والتأهيل الطبي، وتجهيزات جراحة اليوم الواحد.',
      href: '/dental-equipment-supplier-in-dubai'
    }
  ];

  const servicesList = [
    {
      icon: <Settings size={22} color="#00875a" />,
      titleEn: 'Comprehensive AMC & CMC Contracts',
      titleAr: 'عقود الصيانة السنوية والشاملة (AMC & CMC)',
      descEn: 'Customized Planned Preventive Maintenance (PPM) and Comprehensive Maintenance Contracts that eliminate unexpected machine downtime and maximize asset longevity.',
      descAr: 'برامج صيانة وقائية دورية مجدولة وعقود صيانة شاملة تضمن استمرارية عمل الأجهزة الطبية بدون أعطال مفاجئة وتطيل عمر الأصول الحيوية.',
      href: '/amc-cmc-for-medical-equipment-in-dubai-uae'
    },
    {
      icon: <ShieldCheck size={22} color="#00875a" />,
      titleEn: 'Biomedical Equipment Calibration & Safety Testing',
      titleAr: 'معايرة الأجهزة الطبية واختبارات السلامة الكهربائية',
      descEn: 'Traceable calibration and electrical safety audits conforming to DHA, MOHAP, and DoH standards with full certification for audits and healthcare licensing.',
      descAr: 'معايرة دقيقة وفحوصات سلامة كهربائية معتمدة متوافقة تماماً مع معايير هيئة الصحة بدبي ووزارة الصحة ودائرة الصحة بأبوظبي مع شهادات رسمية.',
      href: '/medical-equipment-calibration-service-in-uae'
    },
    {
      icon: <Zap size={22} color="#00875a" />,
      titleEn: 'Ultrasound Probe & Transducer Repair Hub',
      titleAr: 'مركز إصلاح مجسات السونار والموجات فوق الصوتية',
      descEn: 'Component-level repair for damaged acoustic lenses, crystal arrays, strain reliefs, and connectors for GE, Philips, Siemens, Mindray, and Samsung probes.',
      descAr: 'إصلاح دقيق على مستوى المكونات للعدسات الصوتية، ومصفوفات الكريستال، والكابلات والموصلات لمجسات جنرال إلكتريك، فيليبس، سيمنز، وميندراي.',
      href: '/ultrasound-probe-repair-in-uae'
    },
    {
      icon: <Wrench size={22} color="#00875a" />,
      titleEn: 'Endoscope Servicing (Flexible & Rigid)',
      titleAr: 'صيانة وإصلاح المناظير الطبية (المرنة والصلبة)',
      descEn: 'Optical channel realignment, fiber optic bundle repair, insertion tube replacement, and fluid invasion testing to ensure crystal-clear endoscopy imaging.',
      descAr: 'إعادة محاذاة القنوات البصرية، إصلاح ألياف الإضاءة، استبدال أنابيب الإدخال، واختبار منع التسرب لضمان رؤية تنظيرية نقية ودقيقة.',
      href: '/flexible-rigid-endoscope-repair-in-dubai'
    },
    {
      icon: <Building2 size={22} color="#00875a" />,
      titleEn: 'Turnkey Healthcare Installation & Commissioning',
      titleAr: 'تجهيز المنشآت الطبية تسليم مفتاح والتشغيل',
      descEn: 'Complete architectural clinical equipment planning, pre-installation site readiness inspection, professional unboxing, and commissioning according to OEM specifications.',
      descAr: 'تخطيط وتجهيز المنشآت والعيادات الجديدة بالكامل، فحص جاهزية الموقع الفنية، والتركيب والتشغيل والربط وفقاً لأعلى معايير المصنعين.',
      href: '/contact'
    },
    {
      icon: <Headphones size={22} color="#00875a" />,
      titleEn: 'Clinical Staff Training & 24/7 Field Support',
      titleAr: 'تدريب الكوادر السريرية ودعم طوارئ 24/7',
      descEn: 'Biomedical engineering staff available around the clock across the UAE for on-site troubleshooting, urgent breakdown repairs, and hands-on doctor onboarding.',
      descAr: 'فريق هندسي متخصص متاح على مدار الساعة في جميع أنحاء الإمارات لحل الأعطال الطارئة في الموقع وتدريب الأطباء والتمريض على تشغيل الأنظمة.',
      href: '/contact'
    }
  ];

  const sectorsServed = [
    {
      nameEn: 'Tertiary & Private Hospitals',
      nameAr: 'المستشفيات العامة والخاصة التخصصية',
      descEn: 'Complete ICU wings, operating theatres, diagnostic cardiology suites, and centralized cold storage.',
      descAr: 'أجنحة العناية المركزة المتكاملة، غرف العمليات، مراكز تشخيص القلب، والمستودعات الطبية المبردة.'
    },
    {
      nameEn: 'Day Surgery & Polyclinics',
      nameAr: 'مراكز جراحة اليوم الواحد والمجمعات الطبية',
      descEn: 'Outpatient surgery beds, patient monitors, sterilization autoclaves, and surgical illumination.',
      descAr: 'أسرة الجراحة اليومية، شاشات مراقبة المؤشرات الحيوية، أجهزة التعقيم، وكشافات الجراحة المتقدمة.'
    },
    {
      nameEn: 'Radiology & Imaging Centers',
      nameAr: 'مراكز الأشعة والتشخيص الطبي',
      descEn: 'Color Doppler sonography systems, ultrasound probe maintenance, and digital mobile X-ray units.',
      descAr: 'أجهزة سونار الدوبلر الملون، عقود صيانة مجسات السونار، وأجهزة التصوير بالأشعة السينية المتنقلة.'
    },
    {
      nameEn: 'Clinical & Pathology Laboratories',
      nameAr: 'مختبرات التحاليل الطبية والباثولوجيا',
      descEn: '-86°C ultra-low freezers, temperature-logged vaccine fridges, and high-speed centrifuges.',
      descAr: 'مجمدات حفظ العينات حتى -86°، ثلاجات حفظ اللقاحات مع تسجيل درجات الحرارة، وأجهزة الطرد المركزي.'
    },
    {
      nameEn: 'Specialized Dental & Aesthetic Clinics',
      nameAr: 'عيادات الأسنان ومراكز الجلدية والتجميل',
      descEn: 'Ergonomic dental operatory units, clinical autoclaves, and modern aesthetic procedure equipment.',
      descAr: 'وحدات عيادات الأسنان المريحة، أجهزة التعقيم الطبي السريع، وتجهيزات الإجراءات التجميلية المتطورة.'
    },
    {
      nameEn: 'Ambulance Fleets & Corporate Health',
      nameAr: 'أسطول سيارات الإسعاف والعيادات المدرسية',
      descEn: 'Portable AEDs, emergency crash kits, oxygen regulators, and vital signs monitoring carts.',
      descAr: 'أجهزة الصدمات المحمولة AED، حقائب الطوارئ والإنعاش، منظمات الأكسجين، وأجهزة الفحص السريع.'
    }
  ];

  const coreValues = [
    {
      titleEn: 'Clinical Precision & Authenticity',
      titleAr: 'الدقة السريرية والأصالة المعتمدة',
      descEn: 'Every medical device supplied by FastonMed comes with authentic manufacturer documentation, serial verification, and full factory warranty.',
      descAr: 'كل جهاز ومعدة طبية توفرها فاستونميد مرفقة بوثائق المصنّع الأصلية، والتحقق التسلسلي، والضمان الكامل المعتمد.'
    },
    {
      titleEn: 'Regulatory Excellence (DHA / MOHAP / DoH)',
      titleAr: 'الامتثال التام للوائح وهيئات الصحة',
      descEn: 'Our equipment and biomedical calibration protocols are rigorously aligned with UAE healthcare health authorities and FTA tax requirements.',
      descAr: 'تتوافق معداتنا وبروتوكولات المعايرة الهندسية بدقة مع متطلبات هيئات الصحة في الإمارات والهيئة الاتحادية للضرائب.'
    },
    {
      titleEn: 'Rapid Biomedical Field Response',
      titleAr: 'سرعة الاستجابة الهندسية الميدانية',
      descEn: 'Healthcare cannot wait. Our mobile biomedical engineering team is equipped with calibrated testing analyzers for immediate on-site intervention.',
      descAr: 'الرعاية الصحية لا تحتمل التأخير. فريقنا الهندسي الميداني مجهز بأجهزة فحص ومعايرة متنقلة للتدخل الفوري في الموقع.'
    },
    {
      titleEn: 'Transparent Healthcare Partnerships',
      titleAr: 'شراكات رعاية صحية شفافة ومستدامة',
      descEn: 'We build enduring commercial relationships with UAE healthcare providers based on fair pricing, genuine spare parts, and dependable after-sales care.',
      descAr: 'نبني علاقات استراتيجية مستدامة مع المنشآت الطبية قائمة على الأسعار العادلة والشفافة، وتوفير قطع الغيار الأصلية والدعم المستمر.'
    }
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '0 0 80px', color: '#0f172a' }}>
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: COMPANY FOCUS & VALUE PROPOSITION                        */}
      {/* ========================================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f1f8f5 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '64px 0 56px'
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
            {/* Pill Eyebrow */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#eaf7f2',
                border: '1px solid #c7ebde',
                borderRadius: '999px',
                padding: '6px 16px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#00875a',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '20px'
              }}
            >
              <Sparkles size={15} color="#00875a" />
              <span>
                {isAr
                  ? 'شركة فاستونميد للتجارة ش.ذ.م.م • دبي، الإمارات'
                  : 'FASTONMED TRADING L.L.C • DUBAI, UAE'}
              </span>
            </div>

            {/* Main H1 */}
            <h1
              style={{
                fontSize: 'clamp(2rem, 3.8vw, 3rem)',
                fontWeight: 800,
                lineHeight: 1.22,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: '0 0 20px 0'
              }}
            >
              {isAr
                ? 'المورد الرائد لمبيعات وتوريد الأجهزة الطبية وخدمات الهندسة الحيوية في الإمارات'
                : 'Premier Medical Equipment Sales & Biomedical Engineering Services in the UAE'}
            </h1>

            {/* Subtitle / Focus Statement */}
            <p
              style={{
                color: '#475569',
                fontSize: '1.12rem',
                lineHeight: 1.7,
                margin: '0 auto 32px',
                maxWidth: '820px'
              }}
            >
              {isAr
                ? 'تعتبر شركة فاستونميد للتجارة ش.ذ.م.م، ومقرها مجمع دبي للاستثمار 1 (DIP-1)، شريكاً استراتيجياً موثوقاً للمستشفيات والعيادات والمراكز الجراحية والمختبرات في دولة الإمارات ومنطقة الخليج. نتخصص في بيع وتوزيع أحدث المعدات الطبية السريرية المعتمدة، وأنظمة التبريد المخبري، إلى جانب تقديم خدمات الهندسة الطبية الحيوية الشاملة، وعقود الصيانة الوقائية السنوية (AMC)، والمعايرة الدقيقة.'
                : 'Headquartered in Dubai Investments Park 1 (DIP-1), FastonMed (FASTONMED TRADING L.L.C) is a trusted healthcare technology partner for hospitals, specialized clinics, surgery centers, and laboratories across the UAE and GCC. We specialize in the sales and supply of certified capital clinical equipment and cold-chain systems, backed by certified biomedical calibration, preventive maintenance (AMC/CMC), and 24/7 technical field support.'}
            </p>

            {/* CTA Buttons Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginBottom: '40px'
              }}
            >
              <Link
                href={localizeUrl('/contact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '13px 26px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(0, 135, 90, 0.25)',
                  transition: 'background-color 0.2s ease, transform 0.15s ease'
                }}
              >
                <span>{isAr ? 'طلب عرض أسعار أو استشارة' : 'Request RFQ or Consultation'}</span>
                <ArrowRight size={18} />
              </Link>

              <Link
                href={localizeUrl('/shop')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '13px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.96rem',
                  textDecoration: 'none',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease'
                }}
              >
                <span>{isAr ? 'استعراض كتالوج الأجهزة' : 'Browse Equipment Catalog'}</span>
                <ExternalLink size={16} color="#64748b" />
              </Link>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '16px'
              }}
            >
              {quickStats.map((stat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: '#eaf7f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '10px'
                    }}
                  >
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, lineHeight: 1.4 }}>
                    {isAr ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* ========================================================================= */}
        {/* 2. DUAL PILLARS OF FASTONMED: SALES & BIOMEDICAL SERVICES                */}
        {/* ========================================================================= */}
        <section style={{ paddingTop: '64px', paddingBottom: '32px' }}>
          <div style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto 48px' }}>
            <span
              style={{
                color: '#00875a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              {isAr ? 'الركيزتان الأساسيتان للشركة' : 'Core Business Model'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px',
                letterSpacing: '-0.01em'
              }}
            >
              {isAr
                ? 'نموذج عمل متكامل يجمع بين بيع الأجهزة والخدمات الهندسية الطبية'
                : 'A Complete Synergy of Medical Equipment Sales & Biomedical Lifecycle Support'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: 1.6, marginTop: '12px' }}>
              {isAr
                ? 'نقدم للمستشفيات والعيادات في دولة الإمارات حلاً شاملاً يبدأ من استيراد وتوريد التكنولوجيا الطبية المعتمدة، ويمتد طوال دورة حياة الجهاز عبر الصيانة والمعايرة والدعم الفني الفوري.'
                : 'FastonMed provides UAE healthcare institutions with end-to-end operational assurance: from capital medical equipment procurement and installation to scheduled calibration, preventative maintenance, and rapid breakdown response.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
              marginBottom: '32px'
            }}
          >
            {/* Pillar 1: Equipment Sales */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '36px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#eaf7f2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  color: '#00875a',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '20px'
                }}
              >
                <Activity size={18} />
                <span>{isAr ? 'القسم الأول: التوريد والمبيعات' : 'Division 1: Sales & Procurement'}</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                {isAr ? 'مبيعات الأجهزة والمعدات الطبية المعتمدة' : 'Medical Equipment Sales & Capital Distribution'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '20px' }}>
                {isAr
                  ? 'نوفر خطوط توريد موثوقة ومباشرة من كبرى الشركات العالمية المصنعة لأجهزة الرعاية المركزة، التشخيص القلبي، أجهزة السونار، التبريد الصيدلاني، وأثاث المستشفيات مع ضمان كامل وتوافق تام مع شروط التخليص والجمارك والضريبة.'
                  : 'Direct distribution and supply contracts for ICU respirators, diagnostic ultrasound, 12-lead ECGs, pharmaceutical grade cold-storage, hospital furniture, and clinical consumables. Every unit is delivered with factory calibration certificates and full warranty coverage.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  isAr ? 'شراكات مع مصنعين معتمدين عالمياً (CE & FDA)' : 'Direct partnerships with certified OEM manufacturers (CE & FDA)',
                  isAr ? 'تسعير شفاف مع فواتير ضريبية نظامية 5% في الإمارات' : 'Transparent commercial terms with UAE FTA 5% Tax Invoicing',
                  isAr ? 'توصيل مبرد مراقب حرارياً للمستهلكات الحساسة' : 'Cold-chain delivery with GPS & real-time temperature logs',
                  isAr ? 'مخزون استراتيجي في مستودعات دبي للتسليم السريع' : 'Strategic inventory in Dubai warehouses for rapid facility setup'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                    <CheckCircle2 size={18} color="#00875a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={localizeUrl('/shop')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#00875a',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none'
                }}
              >
                <span>{isAr ? 'استكشف قائمة المنتجات والأجهزة' : 'Explore All Equipment Categories'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Pillar 2: Biomedical Engineering Services */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '36px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#eaf7f2',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  color: '#00875a',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  marginBottom: '20px'
                }}
              >
                <Wrench size={18} />
                <span>{isAr ? 'القسم الثاني: الهندسة والصيانة' : 'Division 2: Biomedical Engineering'}</span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '14px' }}>
                {isAr ? 'الهندسة الطبية الحيوية والمعايرة وعقود الصيانة' : 'Biomedical Engineering, Calibration & AMC'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '20px' }}>
                {isAr
                  ? 'يمتلك فريقنا الهندسي مختبراً متطوراً للمعايرة الهندسية في دبي، وفريقاً متنقلاً لتقديم الصيانة الوقائية (PPM)، وعقود الصيانة السنوية (AMC)، وإصلاح مجسات السونار والمناظير وفقاً لأعلى معايير السلامة والجودة الصحية.'
                  : 'Our dedicated biomedical division operates a specialized calibration workshop in Dubai and mobile field teams offering Planned Preventive Maintenance (PPM), comprehensive AMC contracts, electrical safety audits, and component-level probe/endoscope repair.'}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  isAr ? 'شهادات معايرة رسمية معتمدة لهيئات الصحة (DHA / MOHAP)' : 'Certified calibration reports meeting DHA, MOHAP & DoH benchmarks',
                  isAr ? 'عقود صيانة سنوية شاملة وغير شاملة لقطع الغيار' : 'Comprehensive (CMC) and non-comprehensive (AMC) contract options',
                  isAr ? 'مركز متخصص لإصلاح مجسات السونار والمناظير الطبية' : 'Specialized lab for ultrasound probe & endoscope lens restoration',
                  isAr ? 'فريق هندسي متنقل للطوارئ على مدار الساعة في الإمارات' : '24/7 on-call biomedical emergency engineers for rapid intervention'
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.9rem', color: '#334155' }}>
                    <CheckCircle2 size={18} color="#00875a" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={localizeUrl('/medical-equipment-calibration-service-in-uae')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#00875a',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  textDecoration: 'none'
                }}
              >
                <span>{isAr ? 'تفاصيل خدمات المعايرة والصيانة' : 'View Calibration & Service Protocols'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. EQUIPMENT SALES PORTFOLIO (WHAT WE SELL)                               */}
        {/* ========================================================================= */}
        <section style={{ paddingTop: '40px', paddingBottom: '48px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <span
              style={{
                color: '#00875a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              {isAr ? 'كتالوج المبيعات والتوريد' : 'Healthcare Supply Portfolio'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px'
              }}
            >
              {isAr
                ? 'مجموعة المعدات والأجهزة الطبية السريرية المعتمدة'
                : 'Certified Medical Equipment Categories Supplied Across the UAE'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, marginTop: '10px' }}>
              {isAr
                ? 'توريد شامل لأحدث المعدات الطبية المصممة للمستشفيات، وحدات العناية الحرجة، عيادات الجراحة، والمختبرات السريرية.'
                : 'Sourcing, distributing, and installing state-of-the-art medical technology tailored to the demanding standards of UAE clinical practices.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}
          >
            {salesCategories.map((cat, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '14px',
                  padding: '28px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#eaf7f2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '18px'
                    }}
                  >
                    {cat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>
                    {isAr ? cat.titleAr : cat.titleEn}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                    {isAr ? cat.descAr : cat.descEn}
                  </p>
                </div>
                <Link
                  href={localizeUrl(cat.href)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#00875a',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>{isAr ? 'عرض الأجهزة والمواصفات' : 'View Category & Specs'}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BIOMEDICAL ENGINEERING & AFTER-SALES SERVICES (THE SERVICE FOCUS)     */}
        {/* ========================================================================= */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '48px 36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            marginTop: '32px',
            marginBottom: '48px'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <span
              style={{
                color: '#00875a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              {isAr ? 'قسم الهندسة الطبية الحيوية' : 'Biomedical Service Center'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px'
              }}
            >
              {isAr
                ? 'خدمات الصيانة والمعايرة والدعم الهندسي الميداني'
                : 'Certified Biomedical Engineering, Maintenance & Calibration Services'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, marginTop: '10px' }}>
              {isAr
                ? 'تضمن فاستونميد مطابقة أجهزتكم لأعلى اشتراطات السلامة والاعتماد الصحي، مع تقليل فترات التوقف وتحسين دقة النتائج التشخيصية والعلاجية.'
                : 'Ensuring your clinical assets operate at peak safety and regulatory compliance through systematic maintenance routines, precision calibration, and prompt repairs.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px'
            }}
          >
            {servicesList.map((srv, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        backgroundColor: '#eaf7f2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {srv.icon}
                    </div>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                      {isAr ? srv.titleAr : srv.titleEn}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '18px' }}>
                    {isAr ? srv.descAr : srv.descEn}
                  </p>
                </div>
                <Link
                  href={localizeUrl(srv.href)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#00875a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textDecoration: 'none'
                  }}
                >
                  <span>{isAr ? 'المزيد عن هذه الخدمة' : 'Service Specifications'}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HEALTHCARE SECTORS WE SERVE ACROSS THE UAE                             */}
        {/* ========================================================================= */}
        <section style={{ paddingTop: '32px', paddingBottom: '48px' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <span
              style={{
                color: '#00875a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              {isAr ? 'القطاعات الصحية المستهدفة' : 'Clinical Client Reach'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px'
              }}
            >
              {isAr
                ? 'المنشآت الصحية التي نخدمها عبر كافة إمارات الدولة'
                : 'Healthcare Facilities We Equip & Support Across Dubai & UAE'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, marginTop: '10px' }}>
              {isAr
                ? 'حلول توريد وصيانة مخصصة تلائم الاحتياجات الدقيقة لكل تخصص ومنشأة طبية.'
                : 'Specialized procurement programs and maintenance SLAs designed for the unique operational demands of each healthcare vertical.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px'
            }}
          >
            {sectorsServed.map((sector, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#eaf7f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Building2 size={20} color="#00875a" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                    {isAr ? sector.nameAr : sector.nameEn}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    {isAr ? sector.descAr : sector.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. WHY CHOOSE FASTONMED: THE COMPETITIVE EDGE & VALUES                    */}
        {/* ========================================================================= */}
        <section
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '48px 36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)',
            marginBottom: '48px'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px' }}>
            <span
              style={{
                color: '#00875a',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}
            >
              {isAr ? 'لماذا تختار فاستونميد' : 'The FastonMed Advantage'}
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.75rem, 2.5vw, 2.2rem)',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px'
              }}
            >
              {isAr
                ? 'أسباب ثقة المنشآت الطبية في فاستونميد للتجارة'
                : 'Why Leading Healthcare Providers Choose FastonMed Trading L.L.C'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, marginTop: '10px' }}>
              {isAr
                ? 'نلتزم بالجمع بين جودة الأجهزة المعتمدة، وسرعة الاستجابة الهندسية، والشفافية التجارية الكاملة.'
                : 'Built upon clinical authenticity, rapid technical response, and transparent commercial compliance.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '24px'
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#eaf7f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px'
                  }}
                >
                  <Check size={20} color="#00875a" />
                </div>
                <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                  {isAr ? val.titleAr : val.titleEn}
                </h3>
                <p style={{ fontSize: '0.86rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                  {isAr ? val.descAr : val.descEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CORPORATE CREDENTIALS & LICENSING VERIFICATION CARD                   */}
        {/* ========================================================================= */}
        <section
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            borderRadius: '18px',
            padding: '40px',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.12)',
            marginBottom: '48px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '24px',
              marginBottom: '28px'
            }}
          >
            <div>
              <span
                style={{
                  color: '#51b291',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em'
                }}
              >
                {isAr ? 'البيانات الرسمية والتراخيص القانونية' : 'Official Corporate Registry & Accreditation'}
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '6px 0 8px', color: '#ffffff' }}>
                FASTONMED TRADING L.L.C (شركة فاستونميد للتجارة ش.ذ.م.م)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
                {isAr
                  ? 'كيان تجاري مسجل ومعتمد رسمياً في إمارة دبي لتجارة واستيراد وتوزيع الأجهزة والمعدات الطبية ومستلزمات المستشفيات والخدمات الهندسية الطبية الحيوية.'
                  : 'Formally licensed corporate entity registered in the Emirate of Dubai for medical equipment trading, clinical cold-chain logistics, and biomedical engineering services.'}
              </p>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <ShieldCheck size={28} color="#51b291" />
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {isAr ? 'الحالة القانونية' : 'Legal Compliance'}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {isAr ? 'نشط ومعتمد رسمياً' : 'Active & Verified In UAE'}
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              fontSize: '0.88rem'
            }}
          >
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>
                {isAr ? 'رقم الرخصة التجارية' : 'Commercial License No.'}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>1606077</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>
                {isAr ? 'رقم السجل التجاري' : 'Register Number'}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>2818619</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>
                {isAr ? 'الرقم الضريبي (VAT TRN)' : 'UAE FTA Tax TRN'}
              </div>
              <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1.05rem' }}>105373862900003</div>
            </div>
            <div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '4px' }}>
                {isAr ? 'المقر الرئيسي والمستودعات' : 'Corporate Headquarters'}
              </div>
              <div style={{ fontWeight: 600, color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.4 }}>
                {isAr
                  ? 'OFF215 - مبنى ارجمند، قرية جرين كوميونيتي، مجمع دبي للاستثمار 1 (DIP-1)، دبي، الإمارات'
                  : 'OFF215 - Arjumand Bldg, Green Community, DIP-1, Dubai, UAE'}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CALL TO ACTION: CONNECT WITH SALES & BIOMEDICAL TEAM                   */}
        {/* ========================================================================= */}
        <section
          style={{
            backgroundColor: '#eaf7f2',
            border: '1px solid #c7ebde',
            borderRadius: '18px',
            padding: '44px 36px',
            textAlign: 'center',
            marginBottom: '48px'
          }}
        >
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
              {isAr
                ? 'هل تبحث عن توريد أجهزة أو استشارة صيانة لمركزك الصحي؟'
                : 'Need Medical Equipment Procurement or Biomedical Maintenance?'}
            </h3>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '28px' }}>
              {isAr
                ? 'تواصل مباشرة مع مهندسينا ومسؤولي التوريد للحصول على عروض أسعار تنافسية، مواصفات فنية دقيقة، أو خطط صيانة وقائية مجدولة.'
                : 'Speak directly with our clinical equipment specialists and biomedical engineers for competitive quotations, technical datasheets, or institutional AMC service contracts.'}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <a
                href="https://wa.me/971508893589"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(0, 135, 90, 0.2)'
                }}
              >
                <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                <ExternalLink size={16} />
              </a>

              <a
                href="tel:+971508893589"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  textDecoration: 'none'
                }}
              >
                <Phone size={16} color="#00875a" />
                <span>+971 50 889 3589</span>
              </a>

              <Link
                href={localizeUrl('/contact')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  color: '#0f172a',
                  border: '1px solid #cbd5e1',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.94rem',
                  textDecoration: 'none'
                }}
              >
                <Mail size={16} color="#00875a" />
                <span>{isAr ? 'نموذج طلب عرض أسعار' : 'Submit RFQ Form'}</span>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* 9. SOCIAL PROOF & TRUST BAR                                              */}
      {/* ========================================================================= */}
      <div style={{ marginTop: '24px' }}>
        <TrustBar />
      </div>
    </div>
  );
}

