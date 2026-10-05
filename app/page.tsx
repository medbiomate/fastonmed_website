'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
  BadgeCheck,
  UserRoundCog,
  Truck,
  CheckCircle2,
  Wrench,
  Calendar,
  Phone,
  MessageCircle,
  Package,
  Clock,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Shuffle,
  RefreshCw,
  Star,
  Layers,
  Heart,
  ShoppingBag,
  ExternalLink,
  Award,
  Stethoscope,
  Headphones,
  Zap,
  Users,
  Globe,
  Settings,
  Hospital,
  Building2,
  FlaskConical,
  HeartPulse,
  Radio,
  Smile,
  Accessibility,
  Activity,
  Send
} from 'lucide-react';
import { useApp } from '@/lib/context';
import { useLocale } from '@/lib/locale-context';
import type { Product } from '@/lib/types';
import EnquirySelect from '@/components/EnquirySelect';
import AssociatedBrands from '@/components/AssociatedBrands';
import HomeFAQs from '@/components/HomeFAQs';
import PurchaseGuide from '@/components/PurchaseGuide';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';

const baseDate = '2026-01-01T00:00:00.000Z';

// Initial curated clinical fallback products for instant render
const initialBentoRaw = [
  {
    id: 'woo-16973',
    name: 'Bio Safe Body Fluid Clean-Up Kit – 1 Application | CM-1011024',
    slug: 'bio-safe-body-fluid-clean-up-kit-1-application-cm-1011024',
    sku: 'CM-1011024',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 135,
    salePrice: 95,
    category: 'Consumables & PPE',
    brand: 'Bio Safe',
    shortDescription: 'Hospital-grade biohazard spill management and fluid cleanup kit.',
    fullDescription: 'Single application emergency body fluid cleanup kit for clinical environments.',
    mainImage: '/wp-content/uploads/2026/09/Body-Fluid-Clean-up-Kit-1-Application.jpg',
    galleryImages: ['/wp-content/uploads/2026/09/Body-Fluid-Clean-up-Kit-1-Application.jpg'],
    stockQuantity: 120,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Sterility': 'Clinical Grade', 'Quality': 'Certified Standard' },
    features: ['Instant fluid absorption', 'Antimicrobial surface disinfection', 'Complete PPE included'],
    applications: ['Hospital Emergency Rooms', 'ICU', 'Ambulance & Clinics'],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['Consumables', 'Emergency']
  },
  {
    id: 'fom-bs-1',
    name: 'Haier Biomedical HYC-309 Pharmacy Vaccine Refrigerator 2–8°C',
    slug: 'haier-biomedical-hyc-309-pharmacy-refrigerator',
    sku: 'HYC-309',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 12500,
    salePrice: 10950,
    category: 'Laboratory & Diagnostic',
    brand: 'Haier Biomedical',
    shortDescription: 'Pharmacy vaccine refrigerator with microprocessor temperature uniformity.',
    fullDescription: 'High precision 2–8°C vaccine and biological storage refrigerator.',
    mainImage: '/images/original/Fridges-Pharmacy_Haier_HYC-309.png',
    galleryImages: ['/images/original/Fridges-Pharmacy_Haier_HYC-309.png'],
    stockQuantity: 8,
    lowStockThreshold: 2,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Capacity': '309 Liters', 'Temp Range': '2°C to 8°C' },
    features: ['Forced air circulation', 'Audible alarms', 'Self-closing heated glass'],
    applications: ['Hospital Pharmacy', 'Vaccination Centers', 'Laboratories'],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['Laboratory', 'Pharmacy']
  },
  {
    id: 'woo-7680',
    name: 'Biobase Weighing Bio-Safety Cabinet – BSC-1000',
    slug: 'biobase-weighing-bio-safety-cabinet-bsc-1000',
    sku: 'BSC-1000',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 11245,
    salePrice: 9800,
    category: 'Laboratory & Diagnostic',
    brand: 'Biobase',
    shortDescription: 'Motorized front window biosafety cabinet with HEPA filter and UV life indicator.',
    fullDescription: 'Clinical class II safety cabinet for sterile laboratory preparation.',
    mainImage: '/wp-content/uploads/2025/06/biobase-weighing-bio-safety-cabinet-bsc-1000-1-510x510_large.jpg',
    galleryImages: ['/wp-content/uploads/2025/06/biobase-weighing-bio-safety-cabinet-bsc-1000-1-510x510_large.jpg'],
    stockQuantity: 4,
    lowStockThreshold: 1,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Airflow': 'HEPA Filtered', 'Alarm': 'Audio & Visual' },
    features: ['Motorized window', 'UV timer', 'HEPA efficiency 99.999%'],
    applications: ['Pathology Labs', 'Hospital Cleanrooms'],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    status: 'published',
    documents: [],
    tags: ['Lab', 'Biobase']
  },
  {
    id: 'woo-8766',
    name: 'Emergency Body Fluid Spill Kit – 5 Applications in Hard Case',
    slug: 'body-fluid-spill-kit-5-application-in-carry-case',
    sku: 'CM-1011025',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 247,
    salePrice: 195,
    category: 'Consumables & PPE',
    brand: 'FastonMed Partner',
    shortDescription: 'Comprehensive emergency clinical response kit with robust carry case.',
    fullDescription: 'Contains 5 individual application kits with absorbent granules, disinfectant spray, and waste bags.',
    mainImage: '/wp-content/uploads/2025/07/body-fluid-spill-kit-5-application-in-carry-case-510x352_large.jpg',
    galleryImages: ['/wp-content/uploads/2025/07/body-fluid-spill-kit-5-application-in-carry-case-510x352_large.jpg'],
    stockQuantity: 45,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Applications': '5 Uses', 'Case': 'Polypropylene Heavy Duty' },
    features: ['Waterproof carry case', 'Clinical protocol guide', 'Rapid response tools'],
    applications: ['Clinics', 'Hospital Wards', 'Laboratories'],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['Consumables', 'First Aid']
  },
  {
    id: 'fom-bs-4',
    name: 'Mindray BeneVision N12 Multi-Parameter Patient Monitor',
    slug: 'mindray-benevision-n12-patient-monitor',
    sku: 'N12-MONITOR',
    productType: 'simple',
    purchaseMode: 'quote',
    regularPrice: 22000,
    category: 'ICU & Monitoring',
    brand: 'Mindray',
    shortDescription: 'Advanced touch clinical patient monitor for ICU, CCU, and surgical suites.',
    fullDescription: '12-inch high-resolution touchscreen with comprehensive arrhythmia analysis and central station connectivity.',
    mainImage: '/products/patient-monitor.jpg',
    galleryImages: ['/products/patient-monitor.jpg'],
    stockQuantity: 12,
    lowStockThreshold: 2,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Display': '12.1-inch Capacitive Multi-Touch', 'Parameters': 'ECG, SpO2, NIBP, Temp, Resp' },
    features: ['Early Warning Score (EWS)', 'Fanless design for quiet ICU environments', 'WiFi & HL7 EMR integration'],
    applications: ['ICU / CCU', 'Operating Theatres', 'Emergency Departments'],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['ICU', 'Patient Monitoring']
  },
  {
    id: 'fom-bs-5',
    name: 'Maquet Servo-u ICU Mechanical Ventilator',
    slug: 'maquet-servo-u-icu-mechanical-ventilator',
    sku: 'SERVO-U',
    productType: 'simple',
    purchaseMode: 'quote',
    regularPrice: 78000,
    category: 'ICU & Monitoring',
    brand: 'Maquet / Getinge',
    shortDescription: 'State-of-the-art critical care ventilator for neonatal to adult patients.',
    fullDescription: 'Provides personalized ventilation with NAVA (Neurally Adjusted Ventilatory Assist) and intuitive touch interface.',
    mainImage: '/products/ventilator.jpg',
    galleryImages: ['/products/ventilator.jpg'],
    stockQuantity: 4,
    lowStockThreshold: 1,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Patient Types': 'Neonatal, Pediatric, Adult', 'Modes': 'Invasive & Non-invasive' },
    features: ['NAVA technology', 'Automated lung recruitment maneuvers', 'Touchscreen with ergonomic tilting'],
    applications: ['Critical Care ICU', 'Respiratory Units', 'Post-Op Recovery'],
    isFeatured: true,
    isBestSeller: true,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['Ventilators', 'ICU']
  },
  {
    id: 'fom-bs-7',
    name: 'Hillrom Advanta 2 Motorized Hospital Ward Bed',
    slug: 'hillrom-advanta-2-motorized-hospital-bed',
    sku: 'ADVANTA-2',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 18500,
    salePrice: 16800,
    category: 'Hospital Furniture',
    brand: 'Hillrom',
    shortDescription: 'Smart motorized ward bed with smart bed-exit alarm and integrated weighing scale.',
    fullDescription: 'Engineered for patient safety and caregiver ergonomics with four independent motor adjustments.',
    mainImage: '/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg',
    galleryImages: ['/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg'],
    stockQuantity: 15,
    lowStockThreshold: 3,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Safe Working Load': '227 kg', 'Controls': 'Dual caregiver & patient side rails' },
    features: ['One-button cardiac chair position', 'CPR emergency quick release', 'Under-bed nightlight'],
    applications: ['Hospital Inpatient Wards', 'Day Surgery Units', 'Private Patient Rooms'],
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    status: 'published',
    documents: [],
    tags: ['Hospital Beds', 'Furniture']
  },
  {
    id: 'woo-8740',
    name: 'Biosafety Diagnostic Specimen Transport Box – BTB L6',
    slug: 'biosafety-transport-box-btb-l6',
    sku: 'BTB-L6',
    productType: 'simple',
    purchaseMode: 'cart',
    regularPrice: 229,
    salePrice: 189,
    category: 'Laboratory & Diagnostic',
    brand: 'FastonMed Partner',
    shortDescription: 'Thermal insulation transport box for UN2814 and UN3373 diagnostic biological specimens.',
    fullDescription: 'Durable cold-chain specimen transfer container compliant with WHO and UAE biological transport protocols.',
    mainImage: '/wp-content/uploads/2025/07/biosafety-transport-box-btb-l6-1-510x510_large.jpg',
    galleryImages: ['/wp-content/uploads/2025/07/biosafety-transport-box-btb-l6-1-510x510_large.jpg'],
    stockQuantity: 28,
    lowStockThreshold: 4,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Volume': '6 Liters', 'Protocol': 'UN2814 / UN3373' },
    features: ['Thermal lock technology', 'Impact resistant outer shell', 'Temperature data display'],
    applications: ['Clinical Pathology', 'Blood Banks', 'Central Laboratories'],
    isFeatured: false,
    isBestSeller: false,
    isNew: false,
    status: 'published',
    documents: [],
    tags: ['Diagnostic', 'Cold Chain']
  }
];

const initialBentoProducts: Product[] = initialBentoRaw.map(p => ({
  ...p,
  createdAt: baseDate,
  updatedAt: baseDate
} as unknown as Product));

// Curated high-value Biomedical Equipment for the top Spotlight card
const spotlightEquipmentList = [
  {
    id: 'spotlight-1',
    name: 'Haier Vaccine Refrigerator HYC-309',
    category: 'Cold Chain Medical',
    badge: 'Clinical Grade',
    description: '2°C to 8°C High Precision Vaccine & Pharmacy Cooling with Microprocessor',
    regularPrice: 12500,
    salePrice: 10950,
    slug: 'haier-biomedical-hyc-309-pharmacy-refrigerator',
    image: '/images/original/Fridges-Pharmacy_Haier_HYC-309.png',
    specs: ['309L Net Capacity', 'Forced Air Uniformity', 'Express UAE Supply']
  },
  {
    id: 'spotlight-2',
    name: 'Mindray BeneVision N12 Patient Monitor',
    category: 'ICU & Critical Care',
    badge: 'Best Seller',
    description: '12.1" Touchscreen with Multi-Lead ECG, SpO2, NIBP & Central Station Sync',
    regularPrice: 24500,
    salePrice: 22000,
    slug: 'mindray-benevision-n12-patient-monitor',
    image: '/products/patient-monitor.jpg',
    specs: ['12.1" Capacitive Touch', 'Early Warning Score', 'Hospital Wards & ICU']
  },
  {
    id: 'spotlight-3',
    name: 'Biobase BSC-1000 Class II Biosafety Cabinet',
    category: 'Laboratory & Diagnostic',
    badge: 'Cleanroom Certified',
    description: 'Motorized Sash Cleanroom Cabinet with 99.999% HEPA Filtration & UV System',
    regularPrice: 11245,
    salePrice: 9800,
    slug: 'biobase-weighing-bio-safety-cabinet-bsc-1000',
    image: '/wp-content/uploads/2025/06/biobase-weighing-bio-safety-cabinet-bsc-1000-1-510x510_large.jpg',
    specs: ['HEPA Efficiency 99.999%', 'Class II Type A2', 'Clinical Pathology Ready']
  },
  {
    id: 'spotlight-4',
    name: 'Hamilton-C6 Next-Gen ICU Ventilator',
    category: 'Respiratory & ICU',
    badge: 'Intensive Care',
    description: 'Adaptive ASV Ventilation System for Neonatal to Adult Critical ICU Suites',
    regularPrice: 42000,
    salePrice: 38000,
    slug: 'shop',
    image: '/products/ventilator.jpg',
    specs: ['Adaptive ASV Technology', 'Turbine Driven Airflow', '24h Emergency AMC']
  }
];

// Curated Clinical Consumables & Fast-Supply for the bottom card
const fastSupplyConsumablesList = [
  {
    id: 'consumable-1',
    name: 'Bio Safe Fluid Clean-Up Kit',
    category: 'Hospital Disinfection & PPE',
    discountBadge: 'SALE 30%',
    description: 'Emergency Biohazard Spill Kit | Single-Use Protocol CM-1011024',
    regularPrice: 135,
    salePrice: 95,
    slug: 'bio-safe-body-fluid-clean-up-kit-1-application-cm-1011024',
    image: '/wp-content/uploads/2026/09/Body-Fluid-Clean-up-Kit-1-Application.jpg',
    specs: ['1 Complete Application', 'Absorbent Granules', 'Clinical Waste Bag']
  },
  {
    id: 'consumable-2',
    name: 'Emergency Spill Kit – 5 Applications',
    category: 'Emergency Clinical Response',
    discountBadge: 'SALE 21%',
    description: 'Heavy-Duty Waterproof Carry Case for Clinical Wards & Central Laboratories',
    regularPrice: 247,
    salePrice: 195,
    slug: 'body-fluid-spill-kit-5-application-in-carry-case',
    image: '/wp-content/uploads/2025/07/body-fluid-spill-kit-5-application-in-carry-case-510x352_large.jpg',
    specs: ['5 Uses Hard Case', 'Disinfectant Spray', 'Rapid Spill Containment']
  },
  {
    id: 'consumable-3',
    name: 'UN2814 Biosafety Specimen Transport Box BTB-L6',
    category: 'Cold-Chain Diagnostic',
    discountBadge: 'SALE 18%',
    description: '6-Liter Thermal Insulation Box for UN2814 & UN3373 Pathology Specimens',
    regularPrice: 340,
    salePrice: 280,
    slug: 'shop',
    image: '/wp-content/uploads/2025/07/biosafety-transport-box-btb-l6-1-510x510_large.jpg',
    specs: ['6L Volume Capacity', 'Thermal Seal Lock', 'WHO Biological Transport']
  }
];

const categoryPills = [
  { id: 'all', label: 'All Products', labelAr: 'جميع المنتجات' },
  { id: 'recent', label: 'Recently Added', labelAr: 'أحدث الأجهزة' },
  { id: 'icu', label: 'ICU & Monitoring', labelAr: 'العناية المركزة والمراقبة' },
  { id: 'furniture', label: 'Hospital Furniture', labelAr: 'أثاث المستشفيات' },
  { id: 'consumables', label: 'Consumables & PPE', labelAr: 'المستهلكات والوقاية' },
  { id: 'diagnostic', label: 'Laboratory & Diagnostic', labelAr: 'المختبرات والتشخيص' }
];

const therapeuticAreas = [
  {
    id: 'icu-equipment',
    title: 'ICU & Critical Care',
    titleAr: 'العناية المركزة والحرجة',
    desc: 'High-acuity ICU ventilators, infusion pumps & defibrillators.',
    descAr: 'أجهزة تنفس اصطناعي للعناية المركزة، مضخات تسريب وأجهزة إزالة الرجفان.',
    image: '/images/illustrations/icu-care.svg',
    href: '/product-category/icu-equipment'
  },
  {
    id: 'patient-monitoring',
    title: 'Patient Monitoring',
    titleAr: 'مراقبة المرضى السريرية',
    desc: 'Multi-parameter monitors, ECG & wireless telemetry units.',
    descAr: 'شاشات مراقبة متعددة المعايير، أجهزة تخطيط القلب ووحدات قياس عن بعد.',
    image: '/images/illustrations/patient-monitoring.svg',
    href: '/product-category/patient-monitoring'
  },
  {
    id: 'pharmacy-refrigerators',
    title: 'Medical Cold Storage',
    titleAr: 'سلسلة التبريد وحفظ الأدوية',
    desc: 'Certified 2–8°C pharmacy fridges & biofreezers.',
    descAr: 'ثلاجات صيدلانية معتمدة 2–8 درجات مئوية ومجمدات بيولوجية متطورة.',
    image: '/images/illustrations/medical-cold-storage.svg',
    href: '/product-category/pharmacy-refrigerators'
  },
  {
    id: 'radiology-equipments',
    title: 'Ultrasound & Radiology',
    titleAr: 'الموجات فوق الصوتية والأشعة',
    desc: 'Color Doppler ultrasound systems & mobile digital X-ray.',
    descAr: 'أنظمة سونار دوبلر ملونة وأجهزة أشعة سينية رقمية متنقلة للمستشفيات.',
    image: '/images/illustrations/ultrasound-radiology.svg',
    href: '/product-category/radiology-equipments'
  },
  {
    id: 'laboratory-equipment',
    title: 'Clinical Laboratory',
    titleAr: 'المختبرات والتحاليل الطبية',
    desc: 'Biochemistry analyzers, centrifuges & biosafety cabinets.',
    descAr: 'أجهزة كيمياء حيوية، أجهزة طرد مركزي وكبائن أمان حيوي معتمدة.',
    image: '/images/illustrations/clinical-laboratory.svg',
    href: '/product-category/laboratory-equipment'
  },
  {
    id: 'hospital-furniture',
    title: 'Hospital Furniture',
    titleAr: 'أثاث المستشفيات وتجهيز الغرف',
    desc: 'Electric hospital beds, examination couches & dental units.',
    descAr: 'أسرّة مستشفيات كهربائية، طاولات فحص طبية ووحدات عيادات أسنان.',
    image: '/images/illustrations/hospital-furniture.svg',
    href: '/product-category/hospital-furniture'
  }
];

const healthcareFacilitiesServed = [
  {
    id: 'hospitals',
    title: 'Hospitals & Medical Centers',
    titleAr: 'المستشفيات والمراكز الطبية',
    badge: 'Tertiary Care',
    badgeAr: 'رعاية تخصصية',
    desc: 'Equipping inpatient wards, emergency rooms, and surgical suites with certified hospital equipment.',
    descAr: 'تجهيز أجنحة التنويم، غرف الطوارئ، وغرف العمليات الجراحية بأجهزة مستشفيات معتمدة وموثوقة.',
    equipment: ['Hospital Ward Beds', 'OT Lights & Tables', 'Patient Monitors', 'Infusion Pumps'],
    icon: Hospital,
    image: '/images/facilities/hospitals.jpg',
    href: '/equipment-for/hospitals'
  },
  {
    id: 'clinics',
    title: 'Medical Polyclinics & Centers',
    titleAr: 'المجمعات الطبية والعيادات',
    badge: 'Ambulatory Care',
    badgeAr: 'عيادات خارجية',
    desc: 'Supplying consulting suites, diagnostic instruments, and tabletop autoclaves for specialty clinics.',
    descAr: 'توريد أجهزة الفحص السريري، أجهزة التعقيم بالبخار، وشاشات العلامات الحيوية للعيادات التخصصية.',
    equipment: ['Examination Couches', 'Sterilizers & Autoclaves', 'Vital Signs Monitors', 'Diagnostic Sets'],
    icon: Building2,
    image: '/images/facilities/polyclinics.jpg',
    href: '/equipment-for/clinics'
  },
  {
    id: 'laboratories',
    title: 'Clinical Laboratories',
    titleAr: 'المختبرات الطبية والتشخيصية',
    badge: 'Diagnostic Labs',
    badgeAr: 'مختبرات تشخيصية',
    desc: 'Outfitting clinical pathology and research laboratories with precision cold-chain and containment systems.',
    descAr: 'تجهيز مختبرات علم الأمراض والبحوث بأنظمة حفظ بيولوجية دقيقة وسلسلة تبريد متكاملة.',
    equipment: ['Biosafety Cabinets', 'Lab Centrifuges', 'Specimen Transport Boxes', 'Laboratory Fridges'],
    icon: FlaskConical,
    image: '/images/facilities/laboratories.jpg',
    href: '/equipment-for/laboratories'
  },
  {
    id: 'icu-emergency',
    title: 'ICU & Emergency Units',
    titleAr: 'وحدات العناية المركزة والطوارئ',
    badge: 'Critical Care',
    badgeAr: 'عناية فائقة',
    desc: 'Delivering life-support mechanical ventilators, emergency biphasic defibrillators, and mobile crash carts.',
    descAr: 'توريد أجهزة التنفس الاصطناعي المنقذة للحياة، أجهزة الصدمات الكهربائية المتطورة، وحقائب الطوارئ.',
    equipment: ['ICU Ventilators', 'Defibrillators (AED)', 'Emergency Spill Kits', 'Syringe Pumps'],
    icon: HeartPulse,
    image: '/images/facilities/icu-emergency.jpg',
    href: '/equipment-for/icu-emergency'
  },
  {
    id: 'radiology',
    title: 'Radiology & Imaging Centers',
    titleAr: 'مراكز الأشعة والتشخيص التصويري',
    badge: 'Medical Imaging',
    badgeAr: 'تصوير طبي',
    desc: 'Delivering Color Doppler ultrasound systems, imaging transducers, mobile carts, and radiation protection.',
    descAr: 'توفير أجهزة السونار الملونة، مجسات الفحص، عربات النقل المجهزة، ومعدات الحماية من الإشعاع.',
    equipment: ['Color Doppler Ultrasound', 'Ultrasound Probes', 'Ultrasound Carts', 'Radiation PPE'],
    icon: Radio,
    image: '/images/facilities/radiology.jpg',
    href: '/equipment-for/radiology'
  },
  {
    id: 'dental',
    title: 'Dental Clinics & Surgeries',
    titleAr: 'عيادات ومراكز جراحة الأسنان',
    badge: 'Oral Care',
    badgeAr: 'طب وجراحة الأسنان',
    desc: 'Complete delivery of clinical dental operatories, sterilization packaging reels, and suction accessories.',
    descAr: 'تجهيز شامل لكراسي علاج الأسنان، أجهزة كشط الجير بالموجات، ورولات وأكياس التعقيم الطبي.',
    equipment: ['Dental Treatment Chairs', 'Sterilization Reels', 'Ultrasonic Scalers', 'Autoclave Pouches'],
    icon: Smile,
    image: '/images/facilities/dental.jpg',
    href: '/equipment-for/dental'
  },
  {
    id: 'physiotherapy',
    title: 'Rehabilitation & Physiotherapy',
    titleAr: 'مراكز التأهيل والعلاج الطبيعي',
    badge: 'Physical Therapy',
    badgeAr: 'علاج طبيعي وتأهيل',
    desc: 'Equipping rehabilitation gymnasiums, sports medicine facilities, and mobility patient transfer care.',
    descAr: 'تجهيز صالات العلاج الطبيعي والطب الرياضي وأجهزة العلاج بالموجات الصادمة وكراسي الحركة الطبية.',
    equipment: ['Shockwave Therapy Units', 'Combo Electrotherapy', 'Foldable Wheelchairs', 'Transfer Chairs'],
    icon: Accessibility,
    image: '/images/facilities/physiotherapy.jpg',
    href: '/equipment-for/physiotherapy'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacies & Cold Chains',
    titleAr: 'الصيدليات وسلسلة التبريد الطبي',
    badge: 'Pharmaceuticals',
    badgeAr: 'صيدلة وتبريد طبي',
    desc: 'Furnishing hospital and retail pharmacies with certified 2–8°C refrigerators and vaccine loggers.',
    descAr: 'تجهيز الصيدليات بثلاجات حفظ اللقاحات 2–8 درجات مئوية وأجهزة مراقبة وتوثيق درجات الحرارة.',
    equipment: ['Pharmacy Refrigerators', 'Vaccine Freezers', 'Temperature Loggers', 'Dispensing Trolleys'],
    icon: Activity,
    image: '/images/facilities/pharmacies.jpg',
    href: '/equipment-for/pharmacy'
  }
];

const heroFeaturedProducts = [
  {
    id: 'hero-vent',
    name: 'Mindray SV300 ICU Ventilator',
    shortName: 'ICU Ventilator',
    category: 'Critical Care & ICU',
    image: '/images/hero-showcase/1-icu-ventilator.png',
    href: '/shop?category=patient-monitoring'
  },
  {
    id: 'hero-monitor',
    name: 'Multi-Parameter Patient Monitor',
    shortName: 'Patient Monitor',
    category: 'Patient Monitoring',
    image: '/images/hero-showcase/2-patient-monitor.png',
    href: '/shop?category=patient-monitoring'
  },
  {
    id: 'hero-ecg',
    name: 'CardioTouch 12-Channel ECG Machine',
    shortName: '12-Lead ECG Machine',
    category: 'Diagnostic Cardiology',
    image: '/images/hero-showcase/3-ecg-machine.png',
    href: '/shop?category=diagnostic-equipment'
  },
  {
    id: 'hero-fridge',
    name: 'Haier Biomedical Pharmacy Refrigerator',
    shortName: 'Pharmacy Refrigerator',
    category: 'Medical Cold Storage',
    image: '/images/hero-showcase/4-pharmacy-fridge.png',
    href: '/shop?category=pharmacy-refrigerators'
  },
  {
    id: 'hero-aed',
    name: 'Automated External Defibrillator AED',
    shortName: 'Clinical Defibrillator',
    category: 'Emergency Care',
    image: '/images/hero-showcase/5-aed-defibrillator.png',
    href: '/shop?category=emergency-care'
  }
];

export default function HomePage() {
  const { locale, isArabic, localizeUrl } = useLocale();
  const isAr = isArabic || locale === 'ar';
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>(initialBentoProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);

  // Auto-cycle through equipment showcase images
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx(prev => (prev + 1) % heroFeaturedProducts.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Healthcare facilities slider state & handlers (for mobile slider)
  const biomedicalScrollRef = useRef<HTMLDivElement>(null);
  const [biomedicalSlide, setBiomedicalSlide] = useState(0);
  const facilitiesScrollRef = useRef<HTMLDivElement>(null);
  const [activeFacilityIndex, setActiveFacilityIndex] = useState(0);

  const handleFacilitiesScroll = () => {
    if (!facilitiesScrollRef.current) return;
    const el = facilitiesScrollRef.current;
    const card = el.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 14 : 280;
    const newIdx = Math.round(el.scrollLeft / cardWidth);
    setActiveFacilityIndex(Math.min(Math.max(newIdx, 0), healthcareFacilitiesServed.length - 1));
  };

  const scrollFacilities = (direction: 'left' | 'right') => {
    if (!facilitiesScrollRef.current) return;
    const el = facilitiesScrollRef.current;
    const card = el.firstElementChild as HTMLElement;
    const cardWidth = card ? card.offsetWidth + 14 : 280;
    el.scrollBy({
      left: direction === 'left' ? -cardWidth : cardWidth,
      behavior: 'smooth'
    });
  };

  // Dynamic category products cache
  const [categoryCache, setCategoryCache] = useState<Record<string, Product[]>>({
    all: initialBentoProducts
  });
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);

  // Preload all category tabs on mount so tab switching is instantaneous
  useEffect(() => {
    let isMounted = true;
    async function preloadAllTabs() {
      try {
        const tabs = ['all', 'recent', 'icu', 'furniture', 'consumables', 'diagnostic'];
        const responses = await Promise.all(
          tabs.map(async tabId => {
            const url =
              tabId === 'all'
                ? '/api/catalog?limit=24'
                : `/api/catalog?tab=${tabId}&limit=16`;
            try {
              const res = await fetch(url);
              if (res.ok) {
                const data = await res.json();
                if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
                  return { tabId, products: data.products };
                }
              }
            } catch {
              // Ignore single tab fetch error
            }
            return { tabId, products: null };
          })
        );

        if (isMounted) {
          setCategoryCache(prev => {
            const next = { ...prev };
            responses.forEach(item => {
              if (item.products && item.products.length > 0) {
                next[item.tabId] = item.products;
              }
            });
            return next;
          });
          const allRes = responses.find(r => r.tabId === 'all');
          if (allRes?.products && allRes.products.length > 0) {
            setProducts(allRes.products);
          }
        }
      } catch (err) {
        console.warn('Preload categories failed:', err);
      }
    }
    preloadAllTabs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategorySelect = async (catId: string) => {
    setSelectedCategory(catId);
    if (categoryCache[catId] && categoryCache[catId].length > 0) {
      return;
    }
    setIsCategoryLoading(true);
    try {
      const url =
        catId === 'all'
          ? '/api/catalog?limit=24'
          : `/api/catalog?tab=${catId}&limit=16`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
          setCategoryCache(prev => ({
            ...prev,
            [catId]: data.products
          }));
          if (catId === 'all') {
            setProducts(data.products);
          }
        }
      }
    } catch (err) {
      console.warn('Category fetch error:', err);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    setToastMessage(`Added "${product.name}" to enquiry list`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => {
        setNewsletterSubmitted(false);
        setNewsletterEmail('');
      }, 4000);
    }
  };

  // CRM Lead Generation Form State
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    facilityName: '',
    facilityType: '',
    equipmentInterest: '',
    timeline: 'Immediate (Ex-Stock UAE)',
    message: ''
  });
  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const enquirySectionRef = useRef<HTMLElement>(null);
  const popupCloseRef = useRef<HTMLButtonElement>(null);
  const enquiryInteractedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!enquiryInteractedRef.current) setShowEnquiryPopup(true);
    }, 30000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!showEnquiryPopup) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    popupCloseRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowEnquiryPopup(false);
      if (event.key !== 'Tab') return;
      const controls = Array.from(enquirySectionRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, select, textarea') || []);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      previousFocus?.focus();
    };
  }, [showEnquiryPopup]);

  const [enquiryType, setEnquiryType] = useState<'Sales' | 'Service'>('Sales');
  const [customFacility, setCustomFacility] = useState(false);
  const [customEquipment, setCustomEquipment] = useState(false);
  const [serviceType, setServiceType] = useState('Repair / Breakdown');
  const [serviceTimeline, setServiceTimeline] = useState('Urgent');
  const isServiceEnquiry = enquiryType === 'Service';
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadRefId, setLeadRefId] = useState<string | null>(null);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadValidationAttempted, setLeadValidationAttempted] = useState(false);
  const leadWhatsAppMessage = [
    'Hello FastonMed, I submitted the following request on your website:',
    '',
    `Enquiry reference: ${leadRefId || 'N/A'}`,
    `Enquiry type: ${enquiryType}`,
    `Contact name: ${leadForm.name.trim()}`,
    `Phone / WhatsApp: ${leadForm.phone.trim()}`,
    `Email: ${leadForm.email.trim()}`,
    `Facility / firm name: ${leadForm.facilityName.trim() || 'Not provided'}`,
    `Facility type: ${leadForm.facilityType.trim() || 'Not provided'}`,
    `Equipment category: ${leadForm.equipmentInterest.trim() || 'Not provided'}`,
    ...(isServiceEnquiry ? [`Service required: ${serviceType}`] : []),
    `${isServiceEnquiry ? 'Service urgency' : 'Delivery / procurement timeline'}: ${isServiceEnquiry ? serviceTimeline : leadForm.timeline}`,
    '',
    'Requirements / equipment details:',
    leadForm.message.trim() || (isServiceEnquiry ? 'Medical equipment service request from homepage.' : 'Direct equipment procurement & RFQ consultation request from homepage.')
  ].join('\n');


  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);
    setLeadValidationAttempted(true);
    const form = e.currentTarget as HTMLFormElement;
    if (!form.checkValidity()) {
      setLeadError(isAr ? 'يرجى إكمال الحقول المطلوبة وإدخال بريد إلكتروني صحيح.' : 'Please complete the required fields and enter a valid email address.');
      form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }
    if (!leadForm.name.trim() || !leadForm.phone.trim() || !leadForm.email.trim()) {
      setLeadError('Please provide your name, official email, and contact phone number.');
      return;
    }

    setIsLeadSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType,
          serviceType: isServiceEnquiry ? serviceType : undefined,
          name: leadForm.name.trim(),
          email: leadForm.email.trim(),
          phone: leadForm.phone.trim(),
          facilityName: leadForm.facilityName.trim() || `${leadForm.facilityType} - ${leadForm.name.trim()}`,
          facilityType: leadForm.facilityType,
          equipmentInterest: leadForm.equipmentInterest,
          timeline: isServiceEnquiry ? serviceTimeline : leadForm.timeline,
          message: leadForm.message.trim() || (isServiceEnquiry ? 'Medical equipment service request from homepage.' : 'Direct equipment procurement & RFQ consultation request from homepage.')
        })
      });
      const data = await res.json();
      if (data?.success) {
        setLeadSubmitted(true);
        setLeadRefId(data.leadId || `LEAD-${Date.now().toString().slice(-6)}`);
        setToastMessage('Inquiry successfully synchronized with FastonMed CRM');
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        setLeadError(data?.error || 'Failed to submit inquiry. Please call our biomedical desk directly.');
      }
    } catch {
      setLeadError('Network connection error. Please try again or reach out directly on WhatsApp.');
    } finally {
      setIsLeadSubmitting(false);
    }
  };


  // Active products for the selected category pill with intelligent fallback
  const activeCategoryProducts =
    categoryCache[selectedCategory] && categoryCache[selectedCategory].length > 0
      ? categoryCache[selectedCategory]
      : (categoryCache['all'] && categoryCache['all'].length > 0 ? categoryCache['all'] : initialBentoProducts).filter(p => {
          if (selectedCategory === 'all' || selectedCategory === 'recent') return true;
          const text = `${p.name} ${p.category}`.toLowerCase();
          if (selectedCategory === 'icu')


  return (
              text.includes('icu') ||
              text.includes('ventilator') ||
              text.includes('monitor') ||
              text.includes('oxygen')
            );
          if (selectedCategory === 'furniture')
            return (
              text.includes('furniture') ||
              text.includes('chair') ||
              text.includes('bed') ||
              text.includes('stretcher') ||
              text.includes('trolley')
            );
          if (selectedCategory === 'consumables')
            return (
              text.includes('consumables') ||
              text.includes('disposable') ||
              text.includes('kit') ||
              text.includes('dressing')
            );
          if (selectedCategory === 'diagnostic')
            return (
              text.includes('diagnostic') ||
              text.includes('laboratory') ||
              text.includes('refrigerator') ||
              text.includes('autoclave')
            );
          return true;
        });

  const enquirySection = (
      <section ref={enquirySectionRef} onFocusCapture={() => { enquiryInteractedRef.current = true; }} id="rfq-crm-section" style={{ backgroundColor: '#ffffff', padding: '86px 0 92px', borderTop: '1px solid #e2e8f0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        {showEnquiryPopup && <button ref={popupCloseRef} type="button" className="rfq-popup-close" aria-label="Close quotation form" onClick={() => setShowEnquiryPopup(false)}>×</button>}
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div
            id="rfq-two-column-layout"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.15fr',
              gap: '40px',
              alignItems: 'start'
            }}
          >
            {/* Left Column: Context, Value Props & Fast Contact */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#e6f7f0',
                  color: '#00875a',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '14px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                <Zap size={13} color="#00875a" />
                <span>{isAr ? 'ربط مباشر مع نظام خدمة العملاء • استجابة خلال ساعتين' : 'DIRECT CRM INTEGRATION • FAST 2-HR RESPONSE'}</span>
              </div>

              <h2
                id="rfq-main-heading"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  margin: '0 0 14px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr ? 'طلب شراء معدات أو دعم وصيانة' : 'Request Equipment Sales or Service Support'}
              </h2>

              <p
                id="rfq-main-desc"
                style={{
                  fontSize: '0.92rem',
                  color: '#64748b',
                  lineHeight: 1.6,
                  margin: '0 0 24px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr
                  ? 'أرسل مواصفات وتجهيزات منشأتك الصحية مباشرة إلى فريق الهندسة الطبية الحيوية في الإمارات للحصول على عروض أسعار رسمية وتوريد سريع لكافة الإمارات السبع.'
                  : 'Contact our UAE biomedical engineering team for equipment quotations, repairs, maintenance and calibration across all 7 Emirates.'}
              </p>

              {/* 3 Key Trust Pillars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '26px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#e6f7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00875a',
                      flexShrink: 0
                    }}
                  >
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'إحالة فورية للطلب عبر الـ CRM' : 'Real-Time CRM Assignment'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'توجيه فوري للطلب إلى مهندسي الطب الحيوي في دبي.' : 'Instant ticket routing to biomedical engineers in Dubai.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#e6f7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00875a',
                      flexShrink: 0
                    }}
                  >
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'شهادات ووثائق معتمدة من المصنع' : 'Manufacturer Certified Documentation'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'شهادات مطابقة رسمية، معايرة مصنعية، وضمان شامل.' : 'Official compliance certificates, factory calibration, and warranty.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: '#e6f7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#00875a',
                      flexShrink: 0
                    }}
                  >
                    <Truck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'جاهزية التوريد الفوري في الإمارات' : 'Immediate UAE Stock & Deployment'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'شحن فوري من مستودعاتنا بالإمارات مع التركيب والتشغيل الطبي.' : 'Direct dispatch from UAE fulfillment centers with biomedical installation.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Urgent Contact Box */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? 'هل تحتاج إلى مساعدة عاجلة وفورية؟' : 'Need Immediate Urgent Assistance?'}
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    <a href="tel:+971508893589" style={{ color: '#0f172a', textDecoration: 'none' }}>+971 50 889 3589</a> / <a href="tel:+971508893586" style={{ color: '#0f172a', textDecoration: 'none' }}>+971 50 889 3586</a>
                  </div>
                </div>
                <a
                  href="https://wa.me/971508893589?text=Hello%20FastonMed%20team,%20I%20need%20an%20urgent%20medical%20equipment%20quotation."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  <MessageCircle size={15} />
                  <span>{isAr ? 'مكتب واتساب' : 'WhatsApp Desk'}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Modern CRM Lead Capture Form */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '30px 28px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {leadSubmitted ? (
                <div style={{ textAlign: 'center', padding: '36px 12px' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: '#e6f7f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 18px',
                      color: '#00875a'
                    }}
                  >
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? 'تم استلام طلبك بنجاح!' : 'Enquiry received successfully!'}
                  </h3>
                  {leadRefId && (
                    <div
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        padding: '4px 14px',
                        borderRadius: '999px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#00875a',
                        marginBottom: '16px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      {isAr ? `المرجع: #${leadRefId}` : `Reference: #${leadRefId}`}
                    </div>
                  )}
                  <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.55, maxWidth: '440px', margin: '0 auto 24px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? (
                      <>شكراً لك، <strong>{leadForm.name}</strong>. تم حفظ طلبك. سيراجع فريقنا متطلباتك ويتواصل معك قريباً.</>
                    ) : (
                      <>Thank you, <strong>{leadForm.name}</strong>. Your {isServiceEnquiry ? 'service' : 'sales'} enquiry has been saved. Our team will review your requirements and contact you soon.</>
                    )}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/971508893589?text=${encodeURIComponent(leadWhatsAppMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      <MessageCircle size={16} />
                      <span>{isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setLeadSubmitted(false);
                        setLeadValidationAttempted(false);
                        setCustomFacility(false);
                        setCustomEquipment(false);
                        setLeadForm({
                          name: '',
                          email: '',
                          phone: '',
                          facilityName: '',
                          facilityType: '',
                          equipmentInterest: '',
                          timeline: 'Immediate (Ex-Stock UAE)',
                          message: ''
                        });
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      {isAr ? 'إرسال طلب آخر' : 'Submit Another Request'}
                    </button>
                  </div>
                </div>
              ) : (
                <form noValidate className={leadValidationAttempted ? 'rfq-enquiry-form rfq-validation-attempted' : 'rfq-enquiry-form'} onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="rfq-form-heading">
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'كيف يمكننا مساعدتك؟' : 'How can we help?'}
                    </h3>
                    <div className="rfq-type-switch" role="group" aria-label={isAr ? 'نوع الطلب' : 'Enquiry type'}>
                      {(['Sales', 'Service'] as const).map(type => (
                        <button key={type} type="button" aria-pressed={enquiryType === type} disabled={isLeadSubmitting}
                          onClick={() => { setEnquiryType(type); setLeadError(null); }}>
                          {type === 'Sales' ? <ShoppingBag size={15} aria-hidden="true" /> : <Wrench size={15} aria-hidden="true" />}
                          {type === 'Sales' ? (isAr ? 'المبيعات' : 'Sales') : (isAr ? 'الصيانة' : 'Service')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rfq-enquiry-intro" aria-live="polite">
                    <div className="rfq-enquiry-icon">{isServiceEnquiry ? <Wrench size={22} aria-hidden="true" /> : <ShoppingBag size={22} aria-hidden="true" />}</div>
                    <div>
                      <h4>{isServiceEnquiry ? (isAr ? 'طلب خدمة وصيانة للمعدات' : 'Request Equipment Service') : (isAr ? 'طلب عرض أسعار للمعدات' : 'Get an Equipment Quotation')}</h4>
                      <p>{isServiceEnquiry ? (isAr ? 'أخبرنا عن جهازك وما يحتاجه من إصلاح أو صيانة أو معايرة.' : 'Tell us about your equipment and the repair, maintenance or calibration you need.') : (isAr ? 'شارك احتياجات منشأتك للحصول على عرض أسعار من فريق المبيعات.' : 'Share your facility’s equipment needs for a quotation from our sales team.')}</p>
                    </div>
                  </div>
                  {isServiceEnquiry && (
                    <div>
                      <label htmlFor="service-type" style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{isAr ? 'نوع الخدمة' : 'Service Required'}</label>
                      <EnquirySelect id="service-type" className="rfq-field-input" value={serviceType} onChange={e => setServiceType(e.target.value)} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }}>
                        <option value="Repair / Breakdown">{isAr ? 'إصلاح / عطل' : 'Repair / Breakdown'}</option>
                        <option value="Preventive Maintenance">{isAr ? 'صيانة وقائية' : 'Preventive Maintenance'}</option>
                        <option value="Calibration">{isAr ? 'معايرة' : 'Calibration'}</option>
                        <option value="Annual Maintenance Contract">{isAr ? 'عقد صيانة سنوي' : 'Annual Maintenance Contract (AMC)'}</option>
                        <option value="Installation / Technical Support">{isAr ? 'تركيب / دعم فني' : 'Installation / Technical Support'}</option>
                      </EnquirySelect>
                    </div>
                  )}

                  {leadError && (
                    <div
                      style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#b91c1c',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      <span role="alert">{leadError}</span>
                    </div>
                  )}

                  {/* Row 1: Contact Name & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="rfq-form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'اسم مسؤول التواصل *' : 'Contact Person Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? 'الاسم بالكامل' : 'Full name'}
                        className="rfq-field-input"
                        value={leadForm.name}
                        onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          fontSize: '0.84rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'الهاتف / واتساب *' : 'Phone / WhatsApp *'}
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+971 50 000 0000"
                        className="rfq-field-input"
                        value={leadForm.phone}
                        onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          fontSize: '0.84rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Healthcare Facility Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="rfq-form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'البريد الإلكتروني الرسمي *' : 'Official Email Address *'}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@organization.ae"
                        className="rfq-field-input"
                        value={leadForm.email}
                        onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          fontSize: '0.84rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'اسم المنشأة الصحية / المركز' : 'Healthcare Facility / Firm Name'}
                      </label>
                      <input
                        type="text"
                        placeholder={isAr ? 'اسم المستشفى أو العيادة' : 'Clinic or hospital name'}
                        className="rfq-field-input"
                        value={leadForm.facilityName}
                        onChange={e => setLeadForm({ ...leadForm, facilityName: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: '#f8fafc',
                          fontSize: '0.84rem',
                          color: '#0f172a',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Facility Type & Equipment Category */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="rfq-form-row">
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'نوع المنشأة' : 'Facility Type'}
                      </label>
                      <EnquirySelect
                        aria-label={isAr ? 'اختر أو أضف قيمة مخصصة' : 'Select facility type'}
                        className="rfq-field-input"
                        value={customFacility ? '__custom__' : leadForm.facilityType}
                        onChange={e => {
                          const isCustom = e.target.value === '__custom__';
                          setCustomFacility(isCustom);
                          setLeadForm({ ...leadForm, facilityType: isCustom ? '' : e.target.value });
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.84rem', color: '#0f172a' }}>
                        <option value="">{isAr ? 'اختر من القائمة' : 'Select facility type...'}</option>
                        <option value="Hospital & Medical Center">{isAr ? 'مستشفى أو مركز طبي' : 'Hospital & Medical Center'}</option>
                        <option value="Medical Clinic / Polyclinic">{isAr ? 'مجمع عيادات أو عيادة تخصصية' : 'Medical Clinic / Polyclinic'}</option>
                        <option value="Clinical Diagnostic Lab">{isAr ? 'مختبر تحاليل سريرية' : 'Clinical Diagnostic Lab'}</option>
                        <option value="ICU & Emergency Care">{isAr ? 'عناية مركزة وطوارئ' : 'ICU & Emergency Care'}</option>
                        <option value="Radiology & Imaging Suite">{isAr ? 'مركز أشعة وتصوير طبي' : 'Radiology & Imaging Suite'}</option>
                        <option value="Dental Surgery Center">{isAr ? 'مركز جراحة وأسنان' : 'Dental Surgery Center'}</option>
                        <option value="Rehabilitation & Physiotherapy">{isAr ? 'علاج طبيعي وتأهيل' : 'Rehabilitation & Physiotherapy'}</option>
                        <option value="Hospital Pharmacy & Cold Chain">{isAr ? 'صيدلية مستشفى وسلسلة تبريد' : 'Hospital Pharmacy & Cold Chain'}</option>
                        <option value="Other Healthcare Entity">{isAr ? 'جهة رعاية صحية أخرى' : 'Other Healthcare Entity'}</option>
                        <option value="__custom__">{isAr ? 'أخرى / إضافة نص مخصص' : 'Other / Add Custom Text'}</option>
                      </EnquirySelect>
                      {customFacility && (
                        <div style={{ marginTop: '10px' }}>
                          <label htmlFor="rfq-facility-suggestions-custom" style={{ display: 'block', fontSize: '.76rem', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>{isAr ? 'أدخل القيمة المخصصة *' : 'Custom facility type *'}</label>
                          <input id="rfq-facility-suggestions-custom" type="text" required className="rfq-field-input"
                            value={leadForm.facilityType} onChange={e => setLeadForm({ ...leadForm, facilityType: e.target.value })}
                            placeholder={isAr ? 'اكتب هنا...' : 'Enter your facility type...'}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '.84rem', color: '#0f172a', boxSizing: 'border-box' }} />
                        </div>
                      )}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                        {isAr ? 'فئة الأجهزة المطلوبة' : 'Equipment Category of Interest'}
                      </label>
                      <EnquirySelect
                        aria-label={isAr ? 'اختر أو أضف قيمة مخصصة' : 'Select equipment category'}
                        className="rfq-field-input"
                        value={customEquipment ? '__custom__' : leadForm.equipmentInterest}
                        onChange={e => {
                          const isCustom = e.target.value === '__custom__';
                          setCustomEquipment(isCustom);
                          setLeadForm({ ...leadForm, equipmentInterest: isCustom ? '' : e.target.value });
                        }}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.84rem', color: '#0f172a' }}>
                        <option value="">{isAr ? 'اختر من القائمة' : 'Select equipment category...'}</option>
                        <option value="ICU & Mechanical Ventilators">{isAr ? 'أجهزة التنفس الاصطناعي والعناية المركزة' : 'ICU & Mechanical Ventilators'}</option>
                        <option value="Patient Monitoring & Telemetry">{isAr ? 'أجهزة مراقبة المرضى وتخطيط القلب' : 'Patient Monitoring & Telemetry'}</option>
                        <option value="Hospital Furniture & Ward Beds">{isAr ? 'أثاث المستشفيات وأسرّة المرضى' : 'Hospital Furniture & Ward Beds'}</option>
                        <option value="Laboratory & Biosafety Cabinets">{isAr ? 'المختبرات وكبائن الأمان الحيوي' : 'Laboratory & Biosafety Cabinets'}</option>
                        <option value="Ultrasound & Color Doppler">{isAr ? 'أجهزة السونار والموجات فوق الصوتية' : 'Ultrasound & Color Doppler'}</option>
                        <option value="Pharmacy 2–8°C Refrigerators">{isAr ? 'ثلاجات حفظ الأدوية 2–8 درجات مئوية' : 'Pharmacy 2–8°C Refrigerators'}</option>
                        <option value="Clinical Consumables & PPE">{isAr ? 'المستهلكات الطبية وأدوات الوقاية' : 'Clinical Consumables & PPE'}</option>
                        <option value="Turnkey Clinic / OT Package">{isAr ? 'تجهيز كامل للعيادات وغرف العمليات' : 'Turnkey Clinic / OT Package'}</option>
                        <option value="__custom__">{isAr ? 'أخرى / إضافة نص مخصص' : 'Other / Add Custom Text'}</option>
                      </EnquirySelect>
                      {customEquipment && (
                        <div style={{ marginTop: '10px' }}>
                          <label htmlFor="rfq-equipment-suggestions-custom" style={{ display: 'block', fontSize: '.76rem', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>{isAr ? 'أدخل القيمة المخصصة *' : 'Custom equipment category *'}</label>
                          <input id="rfq-equipment-suggestions-custom" type="text" required className="rfq-field-input"
                            value={leadForm.equipmentInterest} onChange={e => setLeadForm({ ...leadForm, equipmentInterest: e.target.value })}
                            placeholder={isAr ? 'اكتب هنا...' : 'Enter your equipment category...'}
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '.84rem', color: '#0f172a', boxSizing: 'border-box' }} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Delivery Timeline */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isServiceEnquiry ? (isAr ? 'مدى إلحاح الخدمة' : 'Service Urgency') : (isAr ? 'الجدول الزمني للتوريد والتسليم' : 'Delivery / Procurement Timeline')}
                    </label>
                    <EnquirySelect
                      value={isServiceEnquiry ? serviceTimeline : leadForm.timeline}
                      onChange={e => isServiceEnquiry ? setServiceTimeline(e.target.value) : setLeadForm({ ...leadForm, timeline: e.target.value })}
                      className="rfq-field-input"
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.84rem',
                        color: '#0f172a',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isServiceEnquiry ? <>
                        <option value="Urgent">{isAr ? 'عاجل — الجهاز متوقف' : 'Urgent — Equipment Down'}</option>
                        <option value="Within This Week">{isAr ? 'خلال هذا الأسبوع' : 'Within This Week'}</option>
                        <option value="Scheduled Service">{isAr ? 'خدمة مجدولة' : 'Scheduled Service / Maintenance'}</option>
                      </> : <>
                      <option value="Immediate (Ex-Stock UAE)">{isAr ? 'فوري (متوفر بمستودعات الإمارات - خلال 48 ساعة)' : 'Immediate (Ex-Stock UAE - Next 48 Hours)'}</option>
                      <option value="Within 1–2 Weeks">{isAr ? 'خلال 1–2 أسبوع' : 'Within 1–2 Weeks'}</option>
                      <option value="1–3 Months (Upcoming Expansion)">{isAr ? 'خلال 1–3 أشهر (مشروع توسعة قادم)' : '1–3 Months (Upcoming Expansion / Project)'}</option>
                      <option value="Annual Budget & Tender Planning">{isAr ? 'تخطيط ميزانية سنوية أو مناقصات' : 'Annual Budget & Tender Planning'}</option>
                      </>}
                    </EnquirySelect>
                  </div>

                  {/* Row 5: Notes / Specifications */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: '#475569', marginBottom: '6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isServiceEnquiry ? (isAr ? 'الماركة والموديل والرقم التسلسلي وتفاصيل المشكلة *' : 'Equipment Brand, Model, Serial Number & Issue *') : (isAr ? 'الموديلات أو الكميات أو المتطلبات الخاصة' : 'Specific Models, Quantities or Requirements')}
                    </label>
                    <textarea
                      rows={2}
                      required={isServiceEnquiry}
                      placeholder={isServiceEnquiry ? (isAr ? 'اذكر تفاصيل الجهاز والمشكلة أو الخدمة المطلوبة...' : 'Describe your equipment and the fault or service needed...') : (isAr ? 'تفاصيل إضافية أو أصناف محددة...' : 'Brief details or specific items...')}
                      className="rfq-field-input"
                      value={leadForm.message}
                      onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        fontSize: '0.84rem',
                        color: '#0f172a',
                        outline: 'none',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        transition: 'all 0.15s ease'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLeadSubmitting}
                    style={{
                      backgroundColor: '#00875a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '13px 22px',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      cursor: isLeadSubmitting ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(0, 135, 90, 0.22)',
                      transition: 'all 0.2s ease',
                      marginTop: '4px',
                      opacity: isLeadSubmitting ? 0.75 : 1,
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    <span>{isLeadSubmitting ? (isAr ? 'جاري الإرسال والمزامنة...' : 'Synchronizing to CRM...') : (isServiceEnquiry ? (isAr ? 'إرسال طلب الخدمة' : 'Submit Service Request') : (isAr ? 'إرسال طلب المبيعات' : 'Submit Sales Enquiry'))}</span>
                    <Send size={15} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? '🔒 يتم توجيه الاستفسارات مباشرة إلى منصة إدارة طلبات الرعاية الصحية في فاستونميد وفقاً لمعايير الامتثال الطبي في الإمارات.' : '🔒 Inquiries are directly routed to the FastonMed Biomedical CRM platform under UAE healthcare compliance.'}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .rfq-popup-backdrop { position: fixed; inset: 0; z-index: 10000; background: rgba(15,23,42,.55); display: flex; justify-content: center; align-items: flex-start; overflow-y: auto; padding: 24px 16px; }
          .rfq-popup-backdrop #rfq-crm-section { position: relative; width: 100%; max-width: 720px; max-height: calc(100dvh - 48px); overflow-y: auto; padding: 40px 0 20px !important; border-radius: 20px; margin: auto; box-shadow: 0 24px 80px rgba(15,23,42,.25); }
          .rfq-popup-backdrop #rfq-two-column-layout { display: block !important; }
          .rfq-popup-backdrop #rfq-two-column-layout > div:first-child { display: none; }
          .rfq-popup-backdrop #rfq-two-column-layout > div:last-child { border: 0 !important; padding: 0 !important; box-shadow: none !important; }
          @media (min-width: 961px) {
            .rfq-popup-backdrop #rfq-crm-section { max-width: 720px; }
            .rfq-popup-backdrop #rfq-crm-section > .container { padding: 0 24px !important; }
            .rfq-popup-backdrop .rfq-form-row { gap: 16px !important; }
            .rfq-popup-backdrop .rfq-enquiry-form { gap: 12px !important; }
            .rfq-popup-backdrop .rfq-field-input { padding: 10px 12px !important; }
          }
          .rfq-popup-close { position: absolute; top: 10px; right: 14px; border: none; background: #f1f5f9; color: #475569; border-radius: 50%; width: 32px; height: 32px; font-size: 24px; cursor: pointer; }
          .rfq-popup-close:focus-visible { outline: 2px solid #00875a; outline-offset: 2px; }
          .rfq-form-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
          .rfq-type-switch { display: flex; gap: 4px; padding: 4px; background: #f1f5f4; border: 1px solid #e2e8e5; border-radius: 12px; }
          .rfq-type-switch button { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 9px 14px; border: 0; border-radius: 8px; background: transparent; color: #64748b; font-size: .8rem; font-weight: 700; cursor: pointer; transition: background .15s ease, color .15s ease; }
          .rfq-type-switch button[aria-pressed="true"] { background: #00875a; color: white; box-shadow: 0 2px 5px rgba(0,135,90,.15); }
          .rfq-type-switch button:focus-visible { outline: 2px solid #00875a; outline-offset: 3px; }
          .rfq-type-switch button:disabled { cursor: wait; opacity: .65; }
          .rfq-enquiry-intro { display: flex; align-items: flex-start; gap: 12px; padding: 18px 0 20px; border-bottom: 1px solid #e8eeeb; margin-bottom: 2px; }
          .rfq-enquiry-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 44px; height: 44px; border-radius: 12px; background: #e5f6ef; color: #00875a; }
          .rfq-enquiry-intro h4 { margin: 0 0 6px; font-size: 1.15rem; line-height: 1.3; font-weight: 800; color: #0f172a; }
          .rfq-enquiry-intro p { margin: 0; font-size: .8rem; line-height: 1.6; color: #64748b; }
          @media (max-width: 420px) { .rfq-type-switch { width: 100%; } .rfq-type-switch button { flex: 1; } }
          .rfq-enquiry-form .rfq-field-input { min-height: 44px; border-radius: 10px !important; font-family: Arial, Helvetica, sans-serif; }
          .rfq-enquiry-form .rfq-field-input:focus-visible { outline: none; border-color: #00875a !important; box-shadow: 0 0 0 3px rgba(0,135,90,.12) !important; }
          .rfq-validation-attempted .rfq-field-input:invalid { border-color: #dc6b6b !important; background: #fffafa !important; }
          .rfq-validation-attempted .rfq-field-input:invalid:focus { box-shadow: 0 0 0 3px rgba(220,107,107,.12) !important; }
          .rfq-field-input::placeholder {
            color: #94a3b8 !important;
            font-weight: 400 !important;
            opacity: 0.7 !important;
          }
          .rfq-field-input:focus {
            border-color: #00875a !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(0, 135, 90, 0.08) !important;
          }
          @media (max-width: 960px) {
            #rfq-crm-section {
              padding: 44px 0 54px !important;
            }
            #rfq-two-column-layout {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
            #rfq-main-heading {
              font-size: 1.48rem !important;
              line-height: 1.25 !important;
              margin-bottom: 10px !important;
            }
            #rfq-main-desc {
              font-size: 0.85rem !important;
              line-height: 1.5 !important;
              margin-bottom: 16px !important;
            }
          }
          @media (max-width: 600px) {
            .rfq-form-row {
              grid-template-columns: 1fr !important;
              gap: 12px !important;
            }
          }
        `}</style>
      </section>
  );

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#0f172a', minHeight: '100vh', overflowX: 'hidden', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '28px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '14px 22px',
            borderRadius: '12px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
            fontSize: '0.9rem',
            fontWeight: 600,
            fontFamily: 'Arial, Helvetica, sans-serif'
          }}
        >
          <CheckCircle2 size={18} color="#00875a" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: HERO SECTION (Rich Medical Equipment Collection & Arial Typography) */}
      <section
        id="medinova-hero-section"
        style={{
          background: 'radial-gradient(1100px 580px at 75% 25%, #e8f9f2 0%, #ffffff 75%)',
          padding: '56px 0 68px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <div className="container" style={{ maxWidth: '1260px', margin: '0 auto', padding: '0 20px' }}>
          <div
            id="hero-two-col-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.05fr 0.95fr',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Column: Headline & Content */}
            <div id="hero-left-content">
              {/* Main H1: Best Medical Equipment Supplier in UAE */}
              <h1
                id="hero-main-title"
                style={{
                  fontSize: '3.2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.15,
                  letterSpacing: '-0.025em',
                  margin: '0 0 14px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr ? (
                  <>
                    أفضل مورد للأجهزة<br />
                    <span style={{ color: '#00875a' }}>والمعدات الطبية في الإمارات</span>
                  </>
                ) : (
                  <>
                    Best Medical Equipment<br />
                    <span style={{ color: '#00875a' }}>Supplier in UAE</span>
                  </>
                )}
              </h1>

              {/* Credibility Statement */}
              <div
                id="hero-credibility-statement"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: '#0f172a',
                  lineHeight: 1.35,
                  margin: '0 0 14px',
                  letterSpacing: '-0.01em',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr
                  ? 'منذ 2025 · أكثر من 2,700 منتج طبي · وثائق ومعايير معتمدة من المصنع'
                  : 'Since 2025 · 2,700+ Catalog Products · Manufacturer Documentation Available'}
              </div>

              {/* Subtitle with SEO sub-keywords */}
              <p
                id="hero-main-subtitle"
                className="hero-desc-desktop"
                style={{
                  fontSize: '0.98rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: '0 0 24px',
                  maxWidth: '540px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr
                  ? 'توفر فاستونميد الأجهزة الطبية وأنظمة الهندسة الطبية الحيوية والحلول السريرية للمستشفيات والعيادات والمنشآت الصحية عبر كافة أنحاء الإمارات.'
                  : 'FastOnMed supplies medical equipment, biomedical systems and clinical solutions to hospitals, clinics and healthcare facilities across the UAE.'}
              </p>
              <p
                className="hero-desc-mobile"
                style={{
                  fontSize: '0.86rem',
                  color: '#64748b',
                  lineHeight: 1.45,
                  margin: '0 0 16px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr
                  ? 'أنظمة طبية حيوية وحلول سريرية متقدمة للمستشفيات والعيادات عبر الإمارات.'
                  : 'Medical equipment, biomedical systems & clinical solutions across the UAE.'}
              </p>

              {/* Action Buttons: In-line on Laptop, Stacked on Mobile, Icon matching Logo Color #42B69C */}
              <div
                id="hero-actions-container"
              >
                <Link
                  href={isAr ? "/ar/shop" : "/shop"}
                  style={{
                    backgroundColor: '#002845',
                    color: '#ffffff',
                    padding: '14px 26px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0, 40, 69, 0.2)',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                  className="hero-nav-btn-primary"
                >
                  <Calendar size={18} color="#42B69C" strokeWidth={2.4} className="hero-btn-icon" />
                  <span className="hero-btn-text-full">{isAr ? 'استكشف الأجهزة الطبية' : 'Explore Equipment'}</span>
                  <span className="hero-btn-text-compact">{isAr ? 'استكشف الكل' : 'Explore All'}</span>
                  <ArrowRight size={17} color="#ffffff" strokeWidth={2.4} className="hero-btn-arrow" />
                </Link>

                <a
                  href="tel:+971508893589"
                  style={{
                    backgroundColor: '#002845',
                    color: '#ffffff',
                    padding: '14px 26px',
                    borderRadius: '14px',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(0, 40, 69, 0.2)',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                  className="hero-nav-btn-secondary"
                >
                  <Phone size={18} color="#42B69C" fill="#42B69C" strokeWidth={1} className="hero-btn-icon hero-btn-icon-phone" />
                  <span>{isAr ? 'اتصل الآن' : 'Call Now'}</span>
                </a>
              </div>
            </div>

            {/* Right Column: Pure Clean Medical Equipment Image Showcase (Auto-changing, 5 images, bg removed, no thumbnails) */}
            <div id="hero-image-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <div
                style={{
                  width: '100%',
                  maxWidth: '560px',
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  boxShadow: '0 20px 45px -15px rgba(0, 135, 90, 0.12)',
                  border: '1.5px solid #e2e8f0',
                  padding: '24px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {/* Main Prominent Equipment Display */}
                <div
                  className="hero-showcase-main-img"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '420px',
                    borderRadius: '16px',
                    backgroundColor: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '28px',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9'
                  }}
                >
                  <img
                    key={heroFeaturedProducts[activeHeroIdx].id}
                    src={heroFeaturedProducts[activeHeroIdx].image}
                    alt={heroFeaturedProducts[activeHeroIdx].name}
                    className="hero-auto-image"
                    style={{
                      maxHeight: '100%',
                      maxWidth: '100%',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes heroImgFadeIn {
            from { opacity: 0; transform: scale(0.97); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes heroBtnShimmer {
            0% { left: -60%; }
            35% { left: 130%; }
            100% { left: 130%; }
          }
          @keyframes phoneWiggle {
            0%, 65%, 100% { transform: rotate(0deg); }
            70% { transform: rotate(-14deg); }
            75% { transform: rotate(14deg); }
            80% { transform: rotate(-10deg); }
            85% { transform: rotate(8deg); }
            90% { transform: rotate(0deg); }
          }
          .hero-auto-image {
            animation: heroImgFadeIn 0.4s ease;
          }
          #hero-actions-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 14px;
            width: auto;
            flex-wrap: wrap;
          }
          .hero-nav-btn-primary,
          .hero-nav-btn-secondary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: auto;
            padding: 14px 26px;
            background-color: #002845;
            color: #ffffff;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
          }
          .hero-nav-btn-primary::after {
            content: '';
            position: absolute;
            top: -50%;
            left: -60%;
            width: 40%;
            height: 200%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
            transform: rotate(25deg);
            animation: heroBtnShimmer 3.2s infinite ease-in-out;
            pointer-events: none;
          }
          .hero-btn-icon-phone {
            animation: phoneWiggle 3.2s infinite ease-in-out;
            transform-origin: center;
          }
          .hero-nav-btn-primary:hover,
          .hero-nav-btn-secondary:hover {
            background-color: #00875a !important;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 135, 90, 0.28) !important;
          }
          .hero-nav-btn-primary:active,
          .hero-nav-btn-secondary:active {
            transform: translateY(0);
          }
          .hero-btn-text-compact {
            display: none;
          }
          .hero-desc-mobile {
            display: none;
          }
          @media (max-width: 900px) {
            #medinova-hero-section {
              padding: 14px 0 18px !important;
              background: #f1f8f5 !important;
            }
            #medinova-hero-section .container {
              padding: 0 14px !important;
            }
            #hero-two-col-grid {
              display: flex !important;
              flex-direction: column !important;
              gap: 0 !important;
              background: #ffffff !important;
              border: 1px solid #e2e8f0 !important;
              border-radius: 20px !important;
              padding: 20px 14px 18px !important;
              box-shadow: 0 10px 28px -6px rgba(0, 40, 69, 0.08), 0 4px 10px rgba(0, 135, 90, 0.04) !important;
            }
            #hero-left-content {
              display: contents !important;
            }
            #hero-main-title {
              order: 1 !important;
              font-size: 1.55rem !important;
              line-height: 1.22 !important;
              margin: 0 0 8px 0 !important;
              letter-spacing: -0.025em !important;
              text-align: left !important;
              width: 100% !important;
              padding: 0 !important;
            }
            #hero-credibility-statement {
              order: 2 !important;
              display: inline-flex !important;
              align-items: center !important;
              align-self: flex-start !important;
              font-size: 0.74rem !important;
              font-weight: 700 !important;
              color: #00875a !important;
              background: #eaf7f2 !important;
              border: 1px solid #cceee1 !important;
              padding: 4px 10px !important;
              border-radius: 6px !important;
              margin: 0 0 14px 0 !important;
              text-align: left !important;
            }
            #hero-image-col {
              order: 3 !important;
              max-width: 100% !important;
              width: 100% !important;
              margin: 0 0 14px !important;
              padding: 0 !important;
            }
            #hero-image-col > div {
              padding: 0 !important;
              border-radius: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              max-width: 100% !important;
            }
            .hero-showcase-main-img {
              height: 195px !important;
              padding: 10px !important;
              border-radius: 14px !important;
              background: #f8fafc !important;
              border: 1px solid #eef2f6 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .hero-auto-image {
              max-height: 100% !important;
              max-width: 100% !important;
              object-fit: contain !important;
              filter: drop-shadow(0 6px 14px rgba(0, 40, 69, 0.12)) !important;
            }
            .hero-desc-desktop {
              display: none !important;
            }
            .hero-desc-mobile {
              order: 4 !important;
              display: block !important;
              font-size: 0.84rem !important;
              line-height: 1.45 !important;
              color: #475569 !important;
              margin: 0 0 16px 0 !important;
              text-align: left !important;
              padding: 0 !important;
            }
            #hero-actions-container {
              order: 5 !important;
              display: flex !important;
              flex-direction: row !important;
              width: 100% !important;
              gap: 8px !important;
              margin: 0 !important;
            }
            .hero-nav-btn-primary {
              flex: 1.4 !important;
              width: auto !important;
              min-width: 0 !important;
              height: 44px !important;
              padding: 0 8px !important;
              font-size: 0.78rem !important;
              border-radius: 11px !important;
              white-space: nowrap !important;
              gap: 5px !important;
              background: #00875a !important;
              color: #ffffff !important;
              box-shadow: 0 4px 14px rgba(0, 135, 90, 0.28) !important;
            }
            .hero-nav-btn-secondary {
              flex: 1 !important;
              width: auto !important;
              min-width: 0 !important;
              height: 44px !important;
              padding: 0 8px !important;
              font-size: 0.78rem !important;
              border-radius: 11px !important;
              white-space: nowrap !important;
              gap: 5px !important;
              background: #002845 !important;
              color: #ffffff !important;
              box-shadow: 0 4px 14px rgba(0, 40, 69, 0.2) !important;
            }
            .hero-btn-arrow {
              display: none !important;
            }
            .hero-btn-icon {
              width: 15px !important;
              height: 15px !important;
              flex-shrink: 0 !important;
            }
          }
          @media (max-width: 350px) {
            .hero-btn-text-full {
              display: none !important;
            }
            .hero-btn-text-compact {
              display: inline !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 2: FLOATING OVERLAP TRUST BAR (The 4 Feature Cards in Arial) */}
      <div
        id="medinova-trust-cards-wrapper"
        style={{
          maxWidth: '1240px',
          margin: '-32px auto 0',
          padding: '0 20px',
          position: 'relative',
          zIndex: 10,
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <div
          id="medinova-trust-cards"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #edf2f7',
            boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.07)',
            padding: '26px 32px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
        >
          {/* 1. Quality Assurance */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={20} color="#0284c7" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'جودة أصلية معتمدة' : 'Certified Genuine Quality'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'أجهزة طبية حيوية أصلية 100% مع ضمان مباشر ومعتمد بالإمارات.' : '100% genuine biomedical equipment with direct UAE warranty.'}
              </p>
            </div>
          </div>

          {/* 2. Research Driven */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} color="#16a34a" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'عقود صيانة طبية ومعايرة' : 'Biomedical AMC & Service'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'فريق هندسي متخصص، معايرة دورية ودعم مستمر للمستشفيات.' : 'In-house biomedical engineers, calibration & hospital support.'}
              </p>
            </div>
          </div>

          {/* 3. Global Reach */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Globe size={20} color="#9333ea" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'تغطية كافة الإمارات السبع' : '7 Emirates Coverage'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'شحن فوري في دبي وتوصيل خلال 24 ساعة لكافة الإمارات والخليج.' : 'Same-day Dubai dispatch & 24h delivery across UAE & GCC.'}
              </p>
            </div>
          </div>

          {/* 4. Patient First */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={20} color="#ea580c" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'دعم سريري وهندسي 24/7' : '24/7 Clinical Support'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {isAr ? 'أسعار توريد مباشرة للمستشفيات مع توفير أجهزة بديلة للطوارئ.' : 'Direct hospital procurement rates & emergency loaner units.'}
              </p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #medinova-trust-cards-wrapper {
              margin: 18px auto 0 !important;
            }
            #medinova-trust-cards {
              grid-template-columns: repeat(2, 1fr) !important;
              padding: 16px 14px !important;
              gap: 12px !important;
              margin-top: 0 !important;
              border-radius: 14px !important;
            }
            #medinova-trust-cards h4 {
              font-size: 0.82rem !important;
              margin-bottom: 2px !important;
            }
            #medinova-trust-cards p {
              font-size: 0.72rem !important;
              line-height: 1.35 !important;
            }
          }
          @media (max-width: 580px) {
            #medinova-trust-cards {
              grid-template-columns: 1fr !important;
              gap: 10px !important;
              padding: 14px !important;
            }
          }
        `}</style>
      </div>

      {/* SECTION 3: ABOUT US / A LEGACY OF TRUST (ENCLOSED IN STYLISH SUITABLE MINT CARD BOX) */}
      <section style={{ backgroundColor: '#ffffff', padding: '90px 0 80px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          {/* THE SUITABLE COLORED CARD BOX */}
          <div
            id="about-us-card-box"
            style={{
              background: 'linear-gradient(135deg, #f2faf6 0%, #eaf7f1 100%)',
              border: '1.5px solid #bbf2dc',
              borderRadius: '24px',
              padding: '52px 48px',
              boxShadow: '0 16px 40px -10px rgba(0, 135, 90, 0.08)'
            }}
          >
            <div
              id="about-two-col-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1.05fr 1fr',
                gap: '48px',
                alignItems: 'center'
              }}
            >
              {/* Left Column: Content */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#ffffff',
                    color: '#00875a',
                    border: '1px solid #a7f3d0',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    marginBottom: '16px',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {isAr ? 'عن فاستونميد' : 'ABOUT FASTONMED'}
                </div>

                <h2
                  id="about-headline"
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    margin: '0 0 18px',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {isAr ? (
                    <>شريك موثوق ومسيرة تميز<br />في الرعاية الصحية بالإمارات</>
                  ) : (
                    <>A Legacy of Trust<br />in UAE Healthcare</>
                  )}
                </h2>

                <p
                  style={{
                    fontSize: '0.96rem',
                    color: '#475569',
                    lineHeight: 1.65,
                    margin: '0 0 24px',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  {isAr
                    ? 'بفضل منشآت الهندسة الطبية الحيوية المتقدمة وفريق الدعم السريري المتخصص، تلتزم فاستونميد بتمكين المستشفيات ومراكز جراحة اليوم الواحد والعيادات في الإمارات بأحدث التقنيات الطبية الموثوقة والدعم السريع الفوري.'
                    : 'With professional biomedical engineering facilities and a dedicated clinical support team, FastonMed is dedicated to empowering UAE hospitals, day surgery centers, and clinics with dependable medical technologies and responsive support.'}
                </p>

                {/* 4 Checkpoint Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'مورد معتمد للرعاية الصحية والأجهزة الطبية الحيوية في الإمارات' : 'UAE Registered Healthcare & Biomedical Supplier'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'مجموعة متكاملة من أجهزة العناية المركزة والمعدات الطبية' : 'Comprehensive Range of Biomedical & ICU Products'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'فريق هندسة طبية حيوية داخلي وعقود صيانة ومعايرة معتمدة' : 'In-House Biomedical Engineering & Calibration AMC'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                      {isAr ? 'توريد وتسليم مباشر للمستشفيات في جميع الإمارات السبع' : 'Direct Hospital Supply Across All 7 Emirates'}
                    </span>
                  </div>
                </div>

                {/* Learn More Button */}
                <Link
                  href={isAr ? '/ar/about-us' : '/about-us'}
                  style={{
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    padding: '12px 26px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 135, 90, 0.22)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                >
                  <span>{isAr ? 'تعرف على المزيد' : 'Learn More'}</span>
                  <ArrowRight size={16} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                </Link>
              </div>

              {/* Right Column: Medical Equipment Showcase with Signature Arched Corner & Badge */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    borderRadius: '40px 16px 16px 16px',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)',
                    position: 'relative',
                    border: '3px solid #ffffff',
                    backgroundColor: '#ffffff',
                    padding: '8px'
                  }}
                >
                  <img
                    src="/images/hero-medical-equipment.jpg"
                    alt="FastonMed Medical Equipment & Biomedical Technologies Range"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '32px 12px 12px 12px',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Floating Since 2025 Badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-18px',
                    left: '20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    padding: '14px 22px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
                    border: '1.5px solid #d1fae5',
                    textAlign: 'center',
                    zIndex: 2
                  }}
                >
                  <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#00875a', lineHeight: 1, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? 'منذ 2025' : 'Since 2025'}
                  </div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr ? 'ريادة الرعاية الصحية بالإمارات' : 'Pioneering UAE Healthcare'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #about-us-card-box {
              padding: 22px 16px !important;
              border-radius: 16px !important;
            }
            #about-two-col-grid {
              grid-template-columns: 1fr !important;
              gap: 22px !important;
            }
            #about-headline {
              font-size: 1.38rem !important;
              line-height: 1.25 !important;
              margin-bottom: 10px !important;
            }
          }
        `}</style>
      </section>

      <AssociatedBrands />

      <section className="fm-equipment-explainer">
        <div className="container">
          <h2>{isAr ? 'ما هي المعدات الطبية؟' : 'What is'} <span>{isAr ? '' : 'Medical Equipment?'}</span></h2>
          <p className="fm-equipment-intro">{isAr ? 'المعدات الطبية هي الأجهزة والأدوات والأنظمة التي تدعم التشخيص والمراقبة والعلاج ورعاية المرضى. من أجهزة مراقبة المرضى إلى معدات المختبرات وأثاث المستشفيات، يساعد اختيار المعدات المناسبة فرق الرعاية الصحية على تقديم الرعاية.' : 'Medical equipment includes the devices, instruments and systems used to support diagnosis, monitoring, treatment and patient care. From patient monitors and diagnostic devices to laboratory equipment and hospital furniture, choosing the right equipment helps healthcare teams meet the needs of their patients and facilities.'}</p>
          <h3>{isAr ? 'لماذا تشتري المعدات الطبية من فاستونميد؟' : 'Why purchase medical equipment from Fastonmed?'}</h3>
          <div className="fm-equipment-reasons">
            {[
              { number: '01', title: isAr ? 'شركة ذات مسؤولية محدودة مرخصة في الإمارات' : 'A UAE-licensed LLC', body: isAr ? 'تعامل مع شركة ذات مسؤولية محدودة مرخصة في الإمارات. يدعم فريقنا اختيار المعدات وعروض الأسعار وتنسيق التسليم وخدمة ما بعد البيع.' : 'Purchase from a UAE-licensed limited liability company. Our team supports equipment selection, quotations, delivery coordination and after-sales enquiries, giving your facility a local point of contact.' },
              { number: '02', title: isAr ? 'خمس مراحل للتحقق من الجودة' : 'Five-layer quality assurance', body: isAr ? 'نطبق خمس مراحل للتحقق من الجودة قبل تسليم المنتج إلى المستخدم النهائي. يشرف فريق الهندسة الطبية على الفحوصات ويتابع أي ملاحظات قبل التسليم.' : 'We apply five layers of quality checks before a product reaches the end user. Our biomedical engineering team oversees these checks and follows up on any issues before delivery, with quality assurance built into the handover process.' },
              { number: '03', title: isAr ? 'فريق من مهندسي المعدات الطبية' : 'A team of biomedical engineers', body: isAr ? 'مهندسو المعدات الطبية هم أعضاء في فريقنا ويشاركون في التحقق من الجودة والدعم الفني. يساعدون على مراجعة متطلبات المعدات وشرح استخدامها وتنسيق الدعم بعد التسليم.' : 'Biomedical engineers are part of our team and actively handle quality checks and technical support. They help review equipment requirements, explain product operation and coordinate support after delivery, so you have access to people who understand the equipment.' }
            ].map(reason => <article key={reason.number} className="fm-equipment-reason"><span className="fm-equipment-reason-icon" aria-hidden="true">{reason.number === '01' ? <BadgeCheck size={26} /> : reason.number === '02' ? <ShieldCheck size={26} /> : <UserRoundCog size={26} />}</span><h4>{reason.title}</h4><p>{reason.body}</p></article>)}
          </div>
        </div>
      </section>

      <section className="fm-biomedical-types">
        <div className="container">
          <div className="fm-biomedical-summary">
            <h2>What is Biomedical Equipment?</h2>
            <p>Biomedical equipment supports diagnosis, monitoring, treatment and patient care—from ECG machines and patient monitors to ventilators and laboratory systems. Correct installation, calibration and preventive maintenance help keep equipment reliable. <Link href={localizeUrl('/contact')}>Our biomedical team</Link> can help you choose equipment and discuss support for your facility.</p>
          </div>
          <div className="fm-biomedical-heading"><h2>Types of Biomedical Equipment</h2></div>
          <p className="fm-equipment-intro">Explore equipment, key features and where each type is used.</p>
          <div className="fm-biomedical-type-grid" ref={biomedicalScrollRef} role="region" aria-label="Biomedical equipment types" tabIndex={0} onScroll={() => {
            const track = biomedicalScrollRef.current;
            const card = track?.firstElementChild as HTMLElement | null;
            if (track && card) setBiomedicalSlide(Math.round(Math.abs(track.scrollLeft) / (card.offsetWidth + 20)));
          }}>
            {[
              { title: 'Diagnostic Equipment', description: 'Helps healthcare professionals assess symptoms and measure clinical parameters.', features: 'ECG machines, blood pressure monitors, spirometers and otoscopes.', used: 'Clinics, outpatient departments and diagnostic centres.' },
              { title: 'Patient Monitoring Equipment', description: 'Tracks patient measurements over time to support clinical observation.', features: 'Multi-parameter monitors, pulse oximeters and telemetry systems; alarms and trend displays vary by model.', used: 'ICUs, emergency departments, operating theatres and hospital wards.' },
              { title: 'Therapeutic Equipment', description: 'Delivers a treatment or supports a prescribed therapy.', features: 'Infusion pumps, nebulizers and electrotherapy units with model-specific treatment settings.', used: 'Hospitals, respiratory clinics and physiotherapy departments.' },
              { title: 'Life Support Equipment', description: 'Supports essential functions such as breathing in critical care.', features: 'Ventilators, defibrillators and oxygen delivery systems with monitoring and safety functions appropriate to each device.', used: 'ICUs, emergency departments, ambulances and operating theatres.' },
              { title: 'Laboratory Equipment', description: 'Processes and analyses samples to support clinical testing.', features: 'Centrifuges, microscopes, analysers and laboratory refrigerators.', used: 'Clinical laboratories, hospitals and research facilities.' },
              { title: 'Surgical Equipment', description: 'Supports surgical procedures, instrument handling and the operating environment.', features: 'Electrosurgical units, surgical lights, operating tables and suction systems.', used: 'Operating theatres, day-surgery centres and procedure rooms.' },
              { title: 'Imaging Equipment', description: 'Produces images used to examine internal structures and guide assessment.', features: 'Ultrasound, X-ray, CT and MRI systems; image modes and software depend on the system.', used: 'Radiology departments, imaging centres and specialist clinics.' },
              { title: 'Rehabilitation Equipment', description: 'Supports movement training, recovery and functional rehabilitation.', features: 'Therapy tables, exercise systems, gait-training aids and rehabilitation devices.', used: 'Physiotherapy clinics, rehabilitation centres and supervised home-care programmes.' },
              { title: 'Hospital & Clinical Equipment', description: 'Supports everyday patient care and the practical needs of healthcare facilities.', features: 'Hospital beds, examination couches, medical scales and patient-transfer equipment.', used: 'Hospital wards, clinics, nursing facilities and examination rooms.' },
              { title: 'Dermatology & Aesthetic Equipment', description: 'Supports skin assessment and selected dermatological or aesthetic treatments.', features: 'Dermatoscopes, treatment lasers, IPL systems and other skin-treatment devices, selected for the intended procedure.', used: 'Dermatology clinics, licensed aesthetic centres and specialist treatment rooms.' }
            ].map((type, index) => <article className="fm-biomedical-type" key={type.title}>
              <div className="fm-biomedical-card-top"><span className="fm-biomedical-icon">{React.createElement([Stethoscope, HeartPulse, Zap, Activity, FlaskConical, Wrench, Radio, Accessibility, Hospital, Sparkles][index], { size: 28, 'aria-hidden': true })}</span><span className="fm-equipment-number">{String(index + 1).padStart(2, '0')}</span></div>
              <h3><Link href={localizeUrl(['/product-category/diagnostic-equipment', '/product-category/patient-monitoring', '/equipment-for/physiotherapy', '/equipment-for/icu-emergency', '/equipment-for/laboratories', '/equipment-for/hospitals', '/equipment-for/radiology', '/equipment-for/physiotherapy', '/product-category/hospital-furniture', '/product-category/dermatology-equipment'][index])}>{type.title}</Link></h3>
              <p>{type.description}</p>
              <h4>Common equipment & features</h4><p>{type.features}</p>
              <h4>Where it is used</h4><p>{type.used}</p>
            </article>)}
          </div>
          <div className="fm-biomedical-controls">
            <div><button type="button" aria-label="Previous equipment types" disabled={biomedicalSlide === 0} onClick={() => biomedicalScrollRef.current?.scrollBy({ left: -((biomedicalScrollRef.current.firstElementChild as HTMLElement).offsetWidth + 20), behavior: 'smooth' })}><ChevronLeft size={21} /></button>
            <button type="button" aria-label="Next equipment types" disabled={biomedicalSlide >= 10 - Math.round((biomedicalScrollRef.current?.clientWidth || 1) / (((biomedicalScrollRef.current?.firstElementChild as HTMLElement)?.offsetWidth || 1) + 20))} onClick={() => biomedicalScrollRef.current?.scrollBy({ left: (biomedicalScrollRef.current.firstElementChild as HTMLElement).offsetWidth + 20, behavior: 'smooth' })}><ChevronRight size={21} /></button></div>
          </div>
        </div>
      </section>

      {/* SECTION 4: OUR PRODUCTS / MEDICAL EQUIPMENT SPECIALTIES */}
      <section style={{ backgroundColor: '#fafcfa', padding: '80px 0 90px', borderTop: '1px solid #f1f5f9', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: '36px' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#e6f7f0',
                color: '#00875a',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '12px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {isAr ? 'تخصصاتنا الطبية' : 'OUR SPECIALTIES'}
            </div>
            <h2
              id="specialties-heading"
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {isAr ? 'التخصصات والمعدات الطبية المعتمدة' : 'Medical Equipment Specialties'}
            </h2>
          </div>

          {/* 6 Category Cards Grid */}
          <div
            id="therapeutic-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: '16px'
            }}
          >
            {therapeuticAreas.map(area => (
              <Link
                key={area.id}
                href={isAr ? `/ar${area.href}` : area.href}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.25s ease',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
                className="therapeutic-card"
              >
                {/* Medical Specialty Line Illustration */}
                <div style={{ height: '148px', backgroundColor: '#f8fafc', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
                  <img
                    src={area.image}
                    alt={isAr && (area as any).titleAr ? (area as any).titleAr : area.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      display: 'block',
                      transition: 'transform 0.3s ease'
                    }}
                    className="therapeutic-img"
                  />
                </div>

                {/* Content */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr && (area as any).titleAr ? (area as any).titleAr : area.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 14px', flex: 1, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {isAr && (area as any).descAr ? (area as any).descAr : area.desc}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00875a'
                      }}
                    >
                      <ArrowRight size={13} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Centered View All Products Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              href={isAr ? '/ar/shop' : '/shop'}
              style={{
                backgroundColor: '#00875a',
                color: '#ffffff',
                padding: '12px 32px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 135, 90, 0.25)',
                transition: 'all 0.2s ease',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              <span>{isAr ? 'استكشف الكتالوج الطبي الكامل' : 'View Complete Catalog'}</span>
              <ArrowRight size={16} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
            </Link>
          </div>
        </div>

        <style>{`
          .therapeutic-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -6px rgba(0, 135, 90, 0.12) !important;
            border-color: #cbd5e1 !important;
          }
          .therapeutic-card:hover .therapeutic-img {
            transform: scale(1.05);
          }
          @media (max-width: 1024px) {
            #therapeutic-cards-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            #specialties-heading {
              font-size: 1.38rem !important;
              line-height: 1.25 !important;
              margin-bottom: 6px !important;
            }
            #therapeutic-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 5: BRAND GREEN METRICS COUNTER RIBBON (Full Bleed in Arial) */}
      <section
        style={{
          background: 'linear-gradient(135deg, #00875a 0%, #006040 100%)',
          color: '#ffffff',
          padding: '48px 0',
          fontFamily: 'Arial, Helvetica, sans-serif'
        }}
      >
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div
            id="metrics-ribbon-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              textAlign: 'center'
            }}
          >
            {/* Stat 1 */}
            <div className="metric-stat-box">
              <div className="metric-stat-icon">
                <Globe size={24} color="#ffffff" />
              </div>
              <div className="metric-stat-number">7</div>
              <div className="metric-stat-label">{isAr ? 'إمارات نغطيها بالكامل' : 'Emirates Covered'}</div>
            </div>

            {/* Stat 2 */}
            <div className="metric-stat-box">
              <div className="metric-stat-icon">
                <Package size={24} color="#ffffff" />
              </div>
              <div className="metric-stat-number">2,700+</div>
              <div className="metric-stat-label">{isAr ? 'منتج ومعدة طبية بالكتالوج' : 'Catalog Medical Products'}</div>
            </div>

            {/* Stat 3 */}
            <div className="metric-stat-box">
              <div className="metric-stat-icon">
                <Users size={24} color="#ffffff" />
              </div>
              <div className="metric-stat-number">300+</div>
              <div className="metric-stat-label">{isAr ? 'مستشفى وعيادة نخدمها' : 'Hospitals & Clinics'}</div>
            </div>

            {/* Stat 4 */}
            <div className="metric-stat-box">
              <div className="metric-stat-icon">
                <Award size={24} color="#ffffff" />
              </div>
              <div className="metric-stat-number">2025</div>
              <div className="metric-stat-label">{isAr ? 'تأسست لخدمة القطاع الصحي' : 'Since Established in UAE'}</div>
            </div>
          </div>
        </div>

        <style>{`
          .metric-stat-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justifyContent: center;
            text-align: center;
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 16px;
            padding: 24px 18px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            transition: transform 0.2s ease, background 0.2s ease;
          }
          .metric-stat-box:hover {
            background: rgba(255, 255, 255, 0.18);
            transform: translateY(-3px);
          }
          .metric-stat-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.16);
            display: grid;
            place-items: center;
            line-height: 0;
            margin: 0 auto 12px auto;
          }
          .metric-stat-icon svg {
            display: block;
            margin: auto;
          }
          .metric-stat-number {
            font-size: 2.2rem;
            font-weight: 800;
            line-height: 1.1;
            color: #ffffff;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: -0.02em;
            text-align: center;
            width: 100%;
          }
          .metric-stat-label {
            font-size: 0.85rem;
            color: #f1fdf8;
            font-weight: 600;
            margin-top: 6px;
            font-family: Arial, Helvetica, sans-serif;
            letter-spacing: 0.01em;
            text-align: center;
            width: 100%;
          }
          @media (max-width: 768px) {
            #metrics-ribbon-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 12px !important;
            }
            .metric-stat-box {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              padding: 18px 12px !important;
              border-radius: 14px !important;
              background: rgba(255, 255, 255, 0.14) !important;
              border: 1px solid rgba(255, 255, 255, 0.25) !important;
            }
            .metric-stat-icon {
              width: 42px !important;
              height: 42px !important;
              margin: 0 auto 8px auto !important;
              border-radius: 10px !important;
              display: grid !important;
              place-items: center !important;
              line-height: 0 !important;
            }
            .metric-stat-icon svg {
              display: block !important;
              margin: auto !important;
              width: 22px !important;
              height: 22px !important;
            }
            .metric-stat-number {
              font-size: 1.75rem !important;
              text-align: center !important;
            }
            .metric-stat-label {
              font-size: 0.78rem !important;
              margin-top: 4px !important;
              opacity: 0.95 !important;
              text-align: center !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 6: HEALTHCARE FACILITIES & FIRMS WE EQUIP */}
      <section id="facilities-section" style={{ backgroundColor: '#ffffff', padding: '84px 0 90px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          {/* Header */}
          <div style={{ marginBottom: '38px', maxWidth: '820px' }}>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: '#e6f7f0',
                color: '#00875a',
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                marginBottom: '12px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {isAr ? 'القطاعات والمنشآت التي نورد لها' : 'WHO WE SUPPLY & DELIVER TO'}
            </div>
            <h2
              id="facilities-heading"
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: '0 0 10px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {isAr ? 'المنشآت الصحية والمستشفيات التي نخدمها في الإمارات' : 'Healthcare Facilities & Sectors We Deliver To'}
            </h2>
            <p
              id="facilities-subtext"
              style={{
                fontSize: '0.94rem',
                color: '#64748b',
                lineHeight: 1.5,
                margin: 0,
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {isAr
                ? 'أفضل مورد معدات طبية يوفر أجهزة معتمدة ودعماً سريرياً ومستهلكات طبية لكافة المنشآت الصحية في الإمارات.'
                : 'Best medical equipment supplier delivering genuine certified biomedical technology, clinical support, and healthcare consumables across the UAE.'}
            </p>
          </div>

          {/* 8 Healthcare Delivery Facilities Cards Grid / Mobile Touch Slider */}
          <div
            id="facilities-cards-grid"
            ref={facilitiesScrollRef}
            onScroll={handleFacilitiesScroll}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px'
            }}
          >
            {healthcareFacilitiesServed.map(facility => (
              <Link
                key={facility.id}
                href={isAr ? `/ar${facility.href}` : facility.href}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.25s ease',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
                className="facility-card-hover"
              >
                {/* Real Facility Photograph Header */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '160px',
                    overflow: 'hidden',
                    backgroundColor: '#f1f5f9'
                  }}
                >
                  <Image
                    src={facility.image}
                    alt={isAr && (facility as any).titleAr ? (facility as any).titleAr : facility.title}
                    fill
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 25vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    className="facility-image-zoom"
                  />
                </div>

                {/* Card Content Body */}
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3
                    style={{
                      fontSize: '1.02rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.35,
                      margin: '0 0 8px',
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    {isAr && (facility as any).titleAr ? (facility as any).titleAr : facility.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.78rem',
                      color: '#64748b',
                      lineHeight: 1.45,
                      margin: '0 0 16px',
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    {isAr && (facility as any).descAr ? (facility as any).descAr : facility.desc}
                  </p>

                  {/* View Supplies Link */}
                  <div
                    style={{
                      marginTop: 'auto',
                      paddingTop: '12px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#00875a',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    <span>{isAr ? 'استكشف المعدات' : 'Explore Equipment'}</span>
                    <ArrowRight size={14} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile Slider Controls & Indicators */}
          <div
            id="facilities-mobile-controls"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              padding: '0 4px'
            }}
          >
            {/* Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              {healthcareFacilitiesServed.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    if (facilitiesScrollRef.current) {
                      const card = facilitiesScrollRef.current.children[dotIdx] as HTMLElement;
                      if (card) {
                        facilitiesScrollRef.current.scrollTo({
                          left: card.offsetLeft - 20,
                          behavior: 'smooth'
                        });
                      }
                    }
                  }}
                  aria-label={`Go to sector ${dotIdx + 1}`}
                  style={{
                    width: activeFacilityIndex === dotIdx ? '22px' : '6px',
                    height: '6px',
                    borderRadius: '999px',
                    backgroundColor: activeFacilityIndex === dotIdx ? '#00875a' : '#cbd5e1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                />
              ))}
            </div>

            {/* Left / Right Nav Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                {activeFacilityIndex + 1} / {healthcareFacilitiesServed.length}
              </span>
              <button
                type="button"
                onClick={() => scrollFacilities('left')}
                aria-label="Previous sector"
                disabled={activeFacilityIndex === 0}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: activeFacilityIndex === 0 ? '#cbd5e1' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeFacilityIndex === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => scrollFacilities('right')}
                aria-label="Next sector"
                disabled={activeFacilityIndex === healthcareFacilitiesServed.length - 1}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: activeFacilityIndex === healthcareFacilitiesServed.length - 1 ? '#cbd5e1' : '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: activeFacilityIndex === healthcareFacilitiesServed.length - 1 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <style>{`
          .facility-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 28px -6px rgba(0, 135, 90, 0.14) !important;
            border-color: #00875a !important;
          }
          .facility-card-hover:hover .facility-image-zoom {
            transform: scale(1.06);
          }
          @media (max-width: 1024px) {
            #facilities-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            #facilities-section {
              padding: 44px 0 50px !important;
            }
            #facilities-heading {
              font-size: 1.38rem !important;
              line-height: 1.25 !important;
              margin-bottom: 8px !important;
            }
            #facilities-subtext {
              font-size: 0.84rem !important;
              line-height: 1.45 !important;
            }
            #facilities-cards-grid {
              display: flex !important;
              flex-direction: row !important;
              overflow-x: auto !important;
              scroll-snap-type: x mandatory !important;
              -webkit-overflow-scrolling: touch !important;
              gap: 14px !important;
              padding: 6px 20px 18px !important;
              margin: 0 -20px !important;
              width: calc(100% + 40px) !important;
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            #facilities-cards-grid::-webkit-scrollbar {
              display: none !important;
            }
            .facility-card-hover {
              flex: 0 0 82vw !important;
              max-width: 310px !important;
              min-width: 260px !important;
              scroll-snap-align: start !important;
              scroll-snap-stop: normal !important;
              border-radius: 14px !important;
            }
            #facilities-mobile-controls {
              display: flex !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 7: INTERACTIVE PRODUCT CATALOG (Browse & Order) */}
      <section id="catalog-section" style={{ backgroundColor: '#f1f5f9', padding: '74px 0 84px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div
            id="catalog-header-bar"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: '#e6f7f0',
                  color: '#00875a',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  fontSize: '0.76rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '10px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr ? 'الكتالوج الطبي المباشر' : 'LIVE CATALOG'}
              </div>
              <h2
                id="catalog-heading"
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                {isAr ? 'أبرز الأجهزة والمستلزمات الطبية' : 'Featured Equipment & Supplies'}
              </h2>
            </div>

            {/* Segmented Category Pill Tabs */}
            <div
              className="catalog-category-tabs-bar"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                padding: '5px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1',
                gap: '4px',
                overflowX: 'auto',
                maxWidth: '100%',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              {categoryPills.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`catalog-pill-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      backgroundColor: isSelected ? '#00875a' : 'transparent',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '999px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      whiteSpace: 'nowrap',
                      boxShadow: isSelected ? '0 2px 8px rgba(0, 135, 90, 0.28)' : 'none',
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    {isAr && (cat as any).labelAr ? (cat as any).labelAr : cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid */}
          <div
            className="recommended-product-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '22px',
              opacity: isCategoryLoading ? 0.7 : 1,
              transition: 'opacity 0.2s ease'
            }}
          >
            {activeCategoryProducts.slice(0, 8).map(product => {
              const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
              const hasDiscount = product.salePrice && product.regularPrice > product.salePrice;
              const discountPct = hasDiscount ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100) : null;
              const isFav = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    position: 'relative',
                    boxShadow: '0 3px 12px rgba(0, 0, 0, 0.04)',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                  className="product-card-modern"
                >
                  {/* Badge */}
                  {discountPct && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#00875a',
                        color: '#ffffff',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '4px 9px',
                        borderRadius: '999px',
                        zIndex: 3,
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        boxShadow: '0 2px 6px rgba(0, 135, 90, 0.25)'
                      }}
                    >
                      -{discountPct}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
                    }}
                    aria-label="Wishlist"
                  >
                    <Heart size={15} color={isFav ? '#ef4444' : '#94a3b8'} fill={isFav ? '#ef4444' : 'none'} />
                  </button>

                  {/* Product Image Link - Pure White Background for seamless product image blending */}
                  <Link
                    href={isAr ? `/ar/product/${product.slug}` : `/product/${product.slug}`}
                    className="product-img-box"
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      margin: '12px 12px 0',
                      height: '190px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px',
                      textDecoration: 'none'
                    }}
                  >
                    <img
                      src={product.mainImage || (product as any).image || '/products/patient-monitor.jpg'}
                      alt={product.name}
                      style={{
                        maxHeight: '100%',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                      className="product-img"
                    />
                  </Link>

                  {/* Product Info */}
                  <div
                    className="product-info-box"
                    style={{
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      fontFamily: 'Arial, Helvetica, sans-serif'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#00875a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '4px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      {product.category || (isAr ? 'مستلزمات طبية' : 'Medical Supplies')}
                    </span>

                    <Link
                      href={isAr ? `/ar/product/${product.slug}` : `/product/${product.slug}`}
                      className="product-card-title"
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        lineHeight: 1.35,
                        textDecoration: 'none',
                        marginBottom: '10px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '38px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      {product.name}
                    </Link>

                    {/* Action Button: Single Full-Width Enquiry */}
                    <div
                      style={{
                        marginTop: 'auto',
                        paddingTop: '10px',
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      {price > 0 && (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            AED {price.toLocaleString()}
                          </span>
                          {hasDiscount && (
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                              AED {product.regularPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="product-enquiry-btn"
                        style={{
                          width: '100%',
                          backgroundColor: '#00875a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease',
                          fontFamily: 'Arial, Helvetica, sans-serif',
                          boxShadow: '0 2px 6px rgba(0, 135, 90, 0.18)'
                        }}
                      >
                        <span>{isAr ? 'استفسار وطلب' : 'Enquiry'}</span>
                        <ChevronRight size={14} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Full Catalog Link */}
          <div style={{ textAlign: 'center', marginTop: '38px' }}>
            <Link
              href={isAr ? '/ar/shop' : '/shop'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#00875a',
                fontSize: '0.92rem',
                fontWeight: 700,
                textDecoration: 'none',
                padding: '12px 28px',
                borderRadius: '999px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #00875a',
                boxShadow: '0 2px 8px rgba(0, 135, 90, 0.08)',
                transition: 'all 0.2s',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              <span>{isAr ? 'استعرض أكثر من 2,700 منتج طبي' : 'Browse 2,700+ Medical Products'}</span>
              <ArrowRight size={16} style={isAr ? { transform: 'scaleX(-1)' } : undefined} />
            </Link>
          </div>
        </div>

        <style>{`
          .catalog-category-tabs-bar {
            scrollbar-width: none;
            -ms-overflow-style: none;
            -webkit-overflow-scrolling: touch;
          }
          .catalog-category-tabs-bar::-webkit-scrollbar {
            display: none !important;
          }
          .product-card-modern:hover {
            box-shadow: 0 12px 28px -8px rgba(0, 135, 90, 0.12) !important;
            transform: translateY(-3px);
            border-color: #cbd5e1 !important;
          }
          .product-card-modern:hover .product-img {
            transform: scale(1.04);
          }
          .product-enquiry-btn:hover {
            background-color: #00714b !important;
            box-shadow: 0 4px 10px rgba(0, 135, 90, 0.28) !important;
            transform: translateY(-1px);
          }
          @media (max-width: 1024px) {
            .recommended-product-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            #catalog-section {
              padding: 38px 0 46px !important;
            }
            #catalog-header-bar {
              margin-bottom: 18px !important;
              gap: 12px !important;
              flex-direction: column !important;
              align-items: flex-start !important;
            }
            #catalog-heading {
              font-size: 1.45rem !important;
              line-height: 1.25 !important;
              margin-bottom: 0 !important;
            }
            .catalog-category-tabs-bar {
              display: flex !important;
              width: calc(100% + 28px) !important;
              margin: 0 -14px !important;
              padding: 4px 14px 6px !important;
              background: transparent !important;
              border: none !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              gap: 8px !important;
              overflow-x: auto !important;
              flex-wrap: nowrap !important;
            }
            .catalog-pill-btn {
              padding: 7px 15px !important;
              font-size: 0.79rem !important;
              border-radius: 999px !important;
              background-color: #ffffff !important;
              border: 1px solid #cbd5e1 !important;
              box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05) !important;
              flex-shrink: 0 !important;
            }
            .catalog-pill-btn.active {
              background-color: #00875a !important;
              border-color: #00875a !important;
              color: #ffffff !important;
              box-shadow: 0 3px 10px rgba(0, 135, 90, 0.28) !important;
            }
            .recommended-product-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .product-card-modern {
              border-radius: 14px !important;
            }
            .product-img-box {
              height: 135px !important;
              margin: 8px 8px 0 !important;
              padding: 8px !important;
            }
            .product-info-box {
              padding: 10px !important;
            }
            .product-card-title {
              font-size: 0.80rem !important;
              line-height: 1.3 !important;
              height: 32px !important;
              margin-bottom: 6px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 8: FAST CRM LEAD GENERATION & EQUIPMENT RFQ FORM */}
      {showEnquiryPopup ? createPortal(
        <div className="rfq-popup-backdrop" role="dialog" aria-modal="true" aria-label="Sales and service enquiry" onClick={event => { if (event.target === event.currentTarget) setShowEnquiryPopup(false); }}>
          {enquirySection}
        </div>, document.body
      ) : enquirySection}

      {/* SECTION 9: GOOGLE REVIEWS & CLINICAL CLIENT ACCREDITATIONS */}
      <GoogleReviewsSection />
      <PurchaseGuide onEnquire={type => { setEnquiryType(type); setShowEnquiryPopup(true); }} />
      <HomeFAQs />
    </div>
  );
}

