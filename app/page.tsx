'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ShieldCheck,
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
  Activity
} from 'lucide-react';
import { useApp } from '@/lib/context';
import type { Product } from '@/lib/types';
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
    technicalSpecs: { 'Sterility': 'Clinical Grade', 'Compliance': 'MoHAP / DHA' },
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
    brand: 'FastOnMed Partner',
    shortDescription: 'Comprehensive emergency clinical response kit with robust carry case.',
    fullDescription: 'Contains 5 individual application kits with absorbent granules, disinfectant spray, and waste bags.',
    mainImage: '/wp-content/uploads/2025/07/body-fluid-spill-kit-5-application-in-carry-case-510x352_large.jpg',
    galleryImages: ['/wp-content/uploads/2025/07/body-fluid-spill-kit-5-application-in-carry-case-510x352_large.jpg'],
    stockQuantity: 45,
    lowStockThreshold: 5,
    stockStatus: 'in_stock',
    technicalSpecs: { 'Applications': '5 Uses', 'Case': 'Polypropylene Heavy Duty' },
    features: ['Waterproof carry case', 'MoHAP compliance guide', 'Rapid response tools'],
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
    brand: 'FastOnMed Partner',
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
    badge: 'MoHAP Certified',
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
    specs: ['1 Complete Application', 'Absorbent Granules', 'MoHAP Waste Bag']
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
  { id: 'all', label: 'All Products' },
  { id: 'recent', label: 'Recently Added' },
  { id: 'icu', label: 'ICU & Monitoring' },
  { id: 'furniture', label: 'Hospital Furniture' },
  { id: 'consumables', label: 'Consumables & PPE' },
  { id: 'diagnostic', label: 'Laboratory & Diagnostic' }
];

const therapeuticAreas = [
  {
    id: 'icu-equipment',
    title: 'ICU & Critical Care',
    desc: 'High-acuity ICU ventilators, infusion pumps & defibrillators.',
    image: '/images/illustrations/icu-care.svg',
    href: '/shop?category=icu-equipment'
  },
  {
    id: 'patient-monitoring',
    title: 'Patient Monitoring',
    desc: 'Multi-parameter monitors, ECG & wireless telemetry units.',
    image: '/images/illustrations/patient-monitoring.svg',
    href: '/shop?category=patient-monitoring'
  },
  {
    id: 'pharmacy-refrigerators',
    title: 'Medical Cold Storage',
    desc: 'MoHAP compliant 2–8°C pharmacy fridges & biofreezers.',
    image: '/images/illustrations/medical-cold-storage.svg',
    href: '/shop?category=pharmacy-refrigerators'
  },
  {
    id: 'radiology-equipments',
    title: 'Ultrasound & Radiology',
    desc: 'Color Doppler ultrasound systems & mobile digital X-ray.',
    image: '/images/illustrations/ultrasound-radiology.svg',
    href: '/shop?category=radiology-equipments'
  },
  {
    id: 'laboratory-equipment',
    title: 'Clinical Laboratory',
    desc: 'Biochemistry analyzers, centrifuges & biosafety cabinets.',
    image: '/images/illustrations/clinical-laboratory.svg',
    href: '/shop?category=laboratory-equipment'
  },
  {
    id: 'hospital-furniture',
    title: 'Hospital Furniture',
    desc: 'Electric hospital beds, examination couches & dental units.',
    image: '/images/illustrations/hospital-furniture.svg',
    href: '/shop?category=hospital-furniture'
  }
];

const healthcareFacilitiesServed = [
  {
    id: 'hospitals',
    title: 'Hospitals & Medical Centers',
    badge: 'Tertiary Care',
    desc: 'Equipping inpatient wards, emergency rooms, and surgical suites with MoHAP/DHA compliant equipment.',
    equipment: ['Hospital Ward Beds', 'OT Lights & Tables', 'Patient Monitors', 'Infusion Pumps'],
    icon: Hospital,
    href: '/shop?category=hospital-furniture'
  },
  {
    id: 'clinics',
    title: 'Medical Polyclinics & Centers',
    badge: 'Ambulatory Care',
    desc: 'Supplying consulting suites, diagnostic instruments, and tabletop autoclaves for specialty clinics.',
    equipment: ['Examination Couches', 'Sterilizers & Autoclaves', 'Vital Signs Monitors', 'Diagnostic Sets'],
    icon: Building2,
    href: '/shop?category=patient-monitoring'
  },
  {
    id: 'laboratories',
    title: 'Clinical Laboratories',
    badge: 'Diagnostic Labs',
    desc: 'Outfitting clinical pathology and research laboratories with precision cold-chain and containment systems.',
    equipment: ['Biosafety Cabinets', 'Lab Centrifuges', 'Specimen Transport Boxes', 'Laboratory Fridges'],
    icon: FlaskConical,
    href: '/shop?category=laboratory-equipment'
  },
  {
    id: 'icu-emergency',
    title: 'ICU & Emergency Units',
    badge: 'Critical Care',
    desc: 'Delivering life-support mechanical ventilators, emergency biphasic defibrillators, and mobile crash carts.',
    equipment: ['ICU Ventilators', 'Defibrillators (AED)', 'Emergency Spill Kits', 'Syringe Pumps'],
    icon: HeartPulse,
    href: '/shop?category=icu-equipment'
  },
  {
    id: 'radiology',
    title: 'Radiology & Imaging Centers',
    badge: 'Medical Imaging',
    desc: 'Delivering Color Doppler ultrasound systems, imaging transducers, mobile carts, and radiation protection.',
    equipment: ['Color Doppler Ultrasound', 'Ultrasound Probes', 'Ultrasound Carts', 'Radiation PPE'],
    icon: Radio,
    href: '/shop?category=radiology-equipments'
  },
  {
    id: 'dental',
    title: 'Dental Clinics & Surgeries',
    badge: 'Oral Care',
    desc: 'Complete delivery of clinical dental operatories, sterilization packaging reels, and suction accessories.',
    equipment: ['Dental Treatment Chairs', 'Sterilization Reels', 'Ultrasonic Scalers', 'Autoclave Pouches'],
    icon: Smile,
    href: '/shop?category=consumables'
  },
  {
    id: 'physiotherapy',
    title: 'Rehabilitation & Physiotherapy',
    badge: 'Physical Therapy',
    desc: 'Equipping rehabilitation gymnasiums, sports medicine facilities, and mobility patient transfer care.',
    equipment: ['Shockwave Therapy Units', 'Combo Electrotherapy', 'Foldable Wheelchairs', 'Transfer Chairs'],
    icon: Accessibility,
    href: '/shop?category=hospital-furniture'
  },
  {
    id: 'pharmacy',
    title: 'Pharmacies & Cold Chains',
    badge: 'Pharmaceuticals',
    desc: 'Furnishing hospital and retail pharmacies with MoHAP compliant 2–8°C refrigerators and vaccine loggers.',
    equipment: ['Pharmacy Refrigerators', 'Vaccine Freezers', 'Temperature Loggers', 'Dispensing Trolleys'],
    icon: Activity,
    href: '/shop?category=pharmacy-refrigerators'
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
    setToastMessage(`Added "${product.name}" to cart`);
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
              {/* Trust Badge with Primary SEO Keyword */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#e6f7f0',
                  color: '#00875a',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  marginBottom: '20px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                <span>MoHAP Licensed · Best Medical Equipment Supplier in UAE</span>
              </div>

              {/* Main H1: Best Medical Equipment Supplier in UAE */}
              <h1
                id="hero-main-title"
                style={{
                  fontSize: '3.3rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.14,
                  letterSpacing: '-0.025em',
                  margin: '0 0 16px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                Best Medical Equipment<br />
                <span style={{ color: '#00875a' }}>Supplier in UAE</span>
              </h1>

              {/* Credibility Statement */}
              <div
                id="hero-credibility-statement"
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.35,
                  margin: '0 0 16px',
                  letterSpacing: '-0.01em',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                8+ Years. 10,000+ Devices. 100% Certified.
              </div>

              {/* Subtitle with SEO sub-keywords */}
              <p
                id="hero-main-subtitle"
                style={{
                  fontSize: '1rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  margin: '0 0 28px',
                  maxWidth: '540px',
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                FastOnMed is the premier medical equipment supplier in UAE. We deliver MoHAP-licensed biomedical technology, ICU ventilators, patient monitors, diagnostic devices, and clinical consumables to leading hospitals, clinics, and laboratories across Dubai, Abu Dhabi, and the Northern Emirates.
              </p>

              {/* Action Buttons: In-line on Laptop, Stacked on Mobile, Icon matching Logo Color #42B69C */}
              <div 
                id="hero-actions-container"
              >
                <Link
                  href="/shop"
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
                  <Calendar size={18} color="#42B69C" strokeWidth={2.4} />
                  <span>Explore Equipment</span>
                  <ArrowRight size={17} color="#ffffff" strokeWidth={2.4} />
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
                  <Phone size={18} color="#42B69C" fill="#42B69C" strokeWidth={1} />
                  <span>Call Now</span>
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
          @media (max-width: 900px) {
            #medinova-hero-section {
              padding: 28px 0 36px !important;
            }
            #hero-two-col-grid {
              grid-template-columns: 1fr !important;
              gap: 28px !important;
            }
            #hero-left-content {
              text-align: left !important;
            }
            #hero-main-title {
              font-size: 2.35rem !important;
              line-height: 1.14 !important;
              margin-bottom: 14px !important;
              letter-spacing: -0.02em !important;
            }
            #hero-credibility-statement {
              font-size: 1.15rem !important;
              line-height: 1.35 !important;
              margin-bottom: 14px !important;
            }
            #hero-main-subtitle {
              font-size: 0.95rem !important;
              line-height: 1.6 !important;
              margin-bottom: 22px !important;
            }
            #hero-actions-container {
              flex-direction: column !important;
              width: 100% !important;
              gap: 12px !important;
            }
            .hero-nav-btn-primary, .hero-nav-btn-secondary {
              width: 100% !important;
              height: 52px !important;
              font-size: 0.98rem !important;
            }
            #hero-image-col {
              max-width: 540px !important;
              width: 100% !important;
              margin: 0 auto !important;
            }
            .hero-showcase-main-img {
              height: 290px !important;
              padding: 18px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 2: FLOATING OVERLAP TRUST BAR (The 4 Feature Cards in Arial) */}
      <div
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
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>MoHAP & DHA Licensed</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>100% genuine biomedical equipment with direct UAE warranty.</p>
            </div>
          </div>

          {/* 2. Research Driven */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={20} color="#16a34a" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Biomedical AMC & Service</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>In-house biomedical engineers, calibration & hospital support.</p>
            </div>
          </div>

          {/* 3. Global Reach */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Globe size={20} color="#9333ea" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>7 Emirates Coverage</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>Same-day Dubai dispatch & 24h delivery across UAE & GCC.</p>
            </div>
          </div>

          {/* 4. Patient First */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Heart size={20} color="#ea580c" />
            </div>
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>24/7 Clinical Support</h4>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45, fontFamily: 'Arial, Helvetica, sans-serif' }}>Direct hospital procurement rates & emergency loaner units.</p>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #medinova-trust-cards {
              grid-template-columns: repeat(2, 1fr) !important;
              padding: 20px !important;
              gap: 18px !important;
            }
          }
          @media (max-width: 580px) {
            #medinova-trust-cards {
              grid-template-columns: 1fr !important;
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
                  ABOUT FASTONMED
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
                  A Legacy of Trust<br />in UAE Healthcare
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
                  With licensed biomedical engineering facilities and a dedicated clinical support team, FastOnMed is dedicated to empowering UAE hospitals, day surgery centers, and clinics with dependable medical technologies and responsive support.
                </p>

                {/* 4 Checkpoint Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>MoHAP & DHA Licensed Biomedical Supplier</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>Comprehensive Range of Biomedical & ICU Products</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>In-House Biomedical Engineering & Calibration AMC</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={18} color="#00875a" />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', fontFamily: 'Arial, Helvetica, sans-serif' }}>Direct Hospital Supply Across All 7 Emirates</span>
                  </div>
                </div>

                {/* Learn More Button */}
                <Link
                  href="/about-us"
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
                  <span>Learn More</span>
                  <ArrowRight size={16} />
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
                    alt="FastOnMed Medical Equipment & Biomedical Technologies Range"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '32px 12px 12px 12px',
                      objectFit: 'contain'
                    }}
                  />
                </div>

                {/* Floating 15+ Years Badge */}
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
                  <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#00875a', lineHeight: 1, fontFamily: 'Arial, Helvetica, sans-serif' }}>15+</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b', marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Years in UAE Healthcare</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #about-us-card-box {
              padding: 30px 20px !important;
              border-radius: 18px !important;
            }
            #about-two-col-grid {
              grid-template-columns: 1fr !important;
              gap: 36px !important;
            }
            #about-headline {
              font-size: 1.85rem !important;
            }
          }
        `}</style>
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
              OUR SPECIALTIES
            </div>
            <h2
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              Medical Equipment Specialties
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
                href={area.href}
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
                    alt={area.title}
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
                    {area.title}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.45, margin: '0 0 14px', flex: 1, fontFamily: 'Arial, Helvetica, sans-serif' }}>
                    {area.desc}
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
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Centered View All Products Button */}
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link
              href="/shop"
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
              View Complete Catalog
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
          @media (max-width: 640px) {
            #therapeutic-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
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
              gap: '24px',
              textAlign: 'center'
            }}
          >
            {/* Stat 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '8px', opacity: 0.9 }}>
                <Globe size={28} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>7</div>
              <div style={{ fontSize: '0.84rem', opacity: 0.85, marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Emirates Covered</div>
            </div>

            {/* Stat 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '8px', opacity: 0.9 }}>
                <Package size={28} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>500+</div>
              <div style={{ fontSize: '0.84rem', opacity: 0.85, marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Quality Medical Devices</div>
            </div>

            {/* Stat 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '8px', opacity: 0.9 }}>
                <Users size={28} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>300+</div>
              <div style={{ fontSize: '0.84rem', opacity: 0.85, marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Hospitals & Clinics</div>
            </div>

            {/* Stat 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ marginBottom: '8px', opacity: 0.9 }}>
                <Settings size={28} color="#ffffff" />
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, fontFamily: 'Arial, Helvetica, sans-serif' }}>15+</div>
              <div style={{ fontSize: '0.84rem', opacity: 0.85, marginTop: '4px', fontFamily: 'Arial, Helvetica, sans-serif' }}>Years of Excellence</div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #metrics-ribbon-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 28px 16px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 6: HEALTHCARE FACILITIES & FIRMS WE EQUIP */}
      <section style={{ backgroundColor: '#ffffff', padding: '84px 0 90px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
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
              WHO WE SUPPLY & DELIVER TO
            </div>
            <h2
              style={{
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: '0 0 10px',
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              Healthcare Facilities & Sectors We Deliver To
            </h2>
            <p
              style={{
                fontSize: '0.94rem',
                color: '#64748b',
                lineHeight: 1.5,
                margin: 0,
                fontFamily: 'Arial, Helvetica, sans-serif'
              }}
            >
              FastOnMed delivers MoHAP & DHA certified medical equipment, biomedical engineering support, and clinical consumables to healthcare firms across Dubai, Abu Dhabi, and the UAE.
            </p>
          </div>

          {/* 8 Healthcare Delivery Facilities Cards Grid */}
          <div
            id="facilities-cards-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px'
            }}
          >
            {healthcareFacilitiesServed.map(facility => {
              const IconComp = facility.icon;
              return (
                <Link
                  key={facility.id}
                  href={facility.href}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.25s ease',
                    fontFamily: 'Arial, Helvetica, sans-serif'
                  }}
                  className="facility-card-hover"
                >
                  {/* Top Bar: Icon + Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: '#e6f7f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00875a'
                      }}
                    >
                      <IconComp size={24} />
                    </div>

                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        letterSpacing: '0.02em',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      {facility.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
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
                    {facility.title}
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
                    {facility.desc}
                  </p>

                  {/* Delivered Equipment Chips */}
                  <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                    <div
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#00875a',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        marginBottom: '8px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      Equipment Delivered
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                      {facility.equipment.map((item, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            color: '#334155',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontFamily: 'Arial, Helvetica, sans-serif'
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>

                    {/* View Supplies Link */}
                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#00875a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: 'Arial, Helvetica, sans-serif'
                      }}
                    >
                      <span>Explore Equipment</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <style>{`
          .facility-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 14px 28px -6px rgba(0, 135, 90, 0.14) !important;
            border-color: #00875a !important;
          }
          @media (max-width: 1024px) {
            #facilities-cards-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 640px) {
            #facilities-cards-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 7: INTERACTIVE PRODUCT CATALOG (Browse & Order) */}
      <section style={{ backgroundColor: '#f1f5f9', padding: '74px 0 84px', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontFamily: 'Arial, Helvetica, sans-serif' }}>
        <div className="container" style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px' }}>
          <div
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
                LIVE CATALOG
              </div>
              <h2
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  fontFamily: 'Arial, Helvetica, sans-serif'
                }}
              >
                Featured Equipment & Supplies
              </h2>
            </div>

            {/* Segmented Category Pill Tabs */}
            <div
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
                    {cat.label}
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
                    href={`/product/${product.slug}`}
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
                      {product.category || 'Medical Supplies'}
                    </span>

                    <Link
                      href={`/product/${product.slug}`}
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

                    {/* Price and RFQ Action */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 'auto',
                        paddingTop: '12px',
                        borderTop: '1px solid #f1f5f9'
                      }}
                    >
                      <div>
                        {price > 0 ? (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                              AED {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                AED {product.regularPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#00875a', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                            Quote on Request
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        style={{
                          backgroundColor: '#00875a',
                          color: '#ffffff',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s',
                          fontFamily: 'Arial, Helvetica, sans-serif'
                        }}
                      >
                        <span>RFQ</span>
                        <ChevronRight size={13} />
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
              href="/shop"
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
              <span>Explore Complete Catalog ({products.length} Items)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <style>{`
          .product-card-modern:hover {
            box-shadow: 0 12px 28px -8px rgba(0, 135, 90, 0.12) !important;
            transform: translateY(-3px);
            border-color: #cbd5e1 !important;
          }
          .product-card-modern:hover .product-img {
            transform: scale(1.04);
          }
          @media (max-width: 1024px) {
            .recommended-product-grid {
              grid-template-columns: repeat(3, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .recommended-product-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 8: GOOGLE REVIEWS & CLINICAL CLIENT ACCREDITATIONS */}
      <GoogleReviewsSection />
    </div>
  );
}

