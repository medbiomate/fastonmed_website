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
  Users
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
  { id: 'icu', label: 'ICU & Monitoring' },
  { id: 'furniture', label: 'Hospital Furniture' },
  { id: 'consumables', label: 'Consumables & PPE' },
  { id: 'diagnostic', label: 'Laboratory & Diagnostic' }
];

export default function HomePage() {
  const { addToCart, isInWishlist, toggleWishlist } = useApp();
  const [products, setProducts] = useState<Product[]>(initialBentoProducts);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Dynamic Product Shuffle States
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [fastSupplyIndex, setFastSupplyIndex] = useState(0);
  const [isShufflingTop, setIsShufflingTop] = useState(false);
  const [isShufflingBottom, setIsShufflingBottom] = useState(false);

  // Auto-shuffle intervals
  useEffect(() => {
    const timerTop = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % spotlightEquipmentList.length);
    }, 6000);
    return () => clearInterval(timerTop);
  }, []);

  useEffect(() => {
    const timerBottom = setInterval(() => {
      setFastSupplyIndex((prev) => (prev + 1) % fastSupplyConsumablesList.length);
    }, 7500);
    return () => clearInterval(timerBottom);
  }, []);

  const handleShuffleTop = () => {
    setIsShufflingTop(true);
    setSpotlightIndex((prev) => (prev + 1) % spotlightEquipmentList.length);
    setTimeout(() => setIsShufflingTop(false), 500);
  };

  const handlePrevTop = () => {
    setSpotlightIndex((prev) => (prev - 1 + spotlightEquipmentList.length) % spotlightEquipmentList.length);
  };

  const handleNextTop = () => {
    setSpotlightIndex((prev) => (prev + 1) % spotlightEquipmentList.length);
  };

  const handleShuffleBottom = () => {
    setIsShufflingBottom(true);
    setFastSupplyIndex((prev) => (prev + 1) % fastSupplyConsumablesList.length);
    setTimeout(() => setIsShufflingBottom(false), 500);
  };

  const handlePrevBottom = () => {
    setFastSupplyIndex((prev) => (prev - 1 + fastSupplyConsumablesList.length) % fastSupplyConsumablesList.length);
  };

  const handleNextBottom = () => {
    setFastSupplyIndex((prev) => (prev + 1) % fastSupplyConsumablesList.length);
  };

  // Fetch real products from catalog API on mount
  useEffect(() => {
    async function loadCatalog() {
      try {
        const res = await fetch('/api/catalog?limit=16');
        if (res.ok) {
          const data = await res.json();
          if (data?.success && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn('Using initial bento products:', err);
      }
    }
    loadCatalog();
  }, []);

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

  // Filter products for the Recommended section
  const filteredProducts = products.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'icu') {
      return (
        p.category?.toLowerCase().includes('icu') ||
        p.category?.toLowerCase().includes('general') ||
        p.name.toLowerCase().includes('monitor') ||
        p.name.toLowerCase().includes('ventilator')
      );
    }
    if (selectedCategory === 'furniture') {
      return (
        p.category?.toLowerCase().includes('furniture') ||
        p.name.toLowerCase().includes('bed') ||
        p.name.toLowerCase().includes('cabinet')
      );
    }
    if (selectedCategory === 'consumables') {
      return (
        p.category?.toLowerCase().includes('consumables') ||
        p.category?.toLowerCase().includes('disposables') ||
        p.name.toLowerCase().includes('kit') ||
        p.name.toLowerCase().includes('clean') ||
        p.name.toLowerCase().includes('wipes')
      );
    }
    if (selectedCategory === 'diagnostic') {
      return (
        p.category?.toLowerCase().includes('laboratory') ||
        p.category?.toLowerCase().includes('diagnostic') ||
        p.name.toLowerCase().includes('box') ||
        p.name.toLowerCase().includes('refrigerator')
      );
    }
    return true;
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', color: '#0f172a', minHeight: '100vh', overflowX: 'hidden' }}>
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
            fontWeight: 600
          }}
        >
          <CheckCircle2 size={18} color="#42b69c" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SECTION 1: HERO BENTO GRID (Clean Light Aesthetic with Real Featured Products) */}
      <section style={{ padding: '28px 0 50px', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.45fr 1fr',
              gap: '24px',
              alignItems: 'stretch'
            }}
            id="hero-bento-grid"
          >
            {/* 1. MAIN BENTO CARD (Left Large Hero Card) */}
            <div
              id="hero-bento-card-left"
              style={{
                position: 'relative',
                borderRadius: '26px',
                overflow: 'hidden',
                minHeight: '620px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '44px 48px',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(248, 250, 252, 0.88) 55%, #f8fafc 100%), url('/images/hero-medical-light.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 12px 35px rgba(15, 23, 42, 0.05)'
              }}
            >
              {/* Top Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  alignSelf: 'flex-start'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00875a' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f766e' }}>
                  UAE MoHAP & DHA Certified Medical Supplier
                </span>
              </div>

              {/* Main Content */}
              <div style={{ maxWidth: '640px', zIndex: 2, margin: '24px 0' }}>
                <h1
                  style={{
                    fontSize: '3.1rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: 1.12,
                    letterSpacing: '-0.03em',
                    marginBottom: '16px'
                  }}
                  id="hero-bento-title"
                >
                  Best Medical Equipment Supplier in UAE
                </h1>
                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#475569',
                    lineHeight: 1.6,
                    marginBottom: '28px',
                    fontWeight: 500
                  }}
                >
                  FastOnMed is the UAE’s trusted biomedical distributor in Dubai Healthcare City (DHCC). We supply certified hospital furniture, ICU patient monitors, ventilators, and emergency healthcare consumables with 24h express supply across Dubai & Abu Dhabi.
                </p>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Link
                    href="/shop"
                    style={{
                      backgroundColor: '#00875a',
                      color: '#ffffff',
                      padding: '15px 34px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 8px 20px rgba(0, 135, 90, 0.3)'
                    }}
                    className="hero-emerald-btn"
                  >
                    <span>SHOW PRODUCTS</span>
                    <ChevronRight size={18} strokeWidth={3} />
                  </Link>

                  <Link
                    href="/contact"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#0f172a',
                      border: '1.5px solid #cbd5e1',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    className="hero-outline-btn"
                  >
                    <span>Request Quotation</span>
                  </Link>
                </div>
              </div>

              {/* DOC+ Inspired Floating Micro-Metrics Strip */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.94)',
                  backdropFilter: 'blur(10px)',
                  padding: '16px 20px',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 6px 20px rgba(15, 23, 42, 0.05)',
                  zIndex: 2
                }}
                id="hero-metrics-strip"
              >
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#00875a' }}>99.4%</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>24h UAE Delivery</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>1,250+</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Hospitals & Clinics</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#d97706' }}>4.9 ★</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Biomedical Reviews</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0284c7' }}>100%</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>MoHAP Certified</div>
                </div>
              </div>
            </div>

            {/* 2. RIGHT COLUMN: DYNAMIC PRODUCT SHUFFLE SHOWCASE (Mobile Swipeable Slider) */}
            <div
              className="hero-right-bento-col"
              style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: '24px'
              }}
            >
              {/* Product Card 1: BOLD DARKENED CONTRAST CARD (Spotlight Equipment with Shuffle) */}
              {(() => {
                const item = spotlightEquipmentList[spotlightIndex];
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'linear-gradient(145deg, #07111e 0%, #0d1e38 55%, #05262c 100%)',
                      borderRadius: '24px',
                      padding: '24px 26px',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      boxShadow: '0 16px 36px rgba(7, 17, 30, 0.18)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      color: '#ffffff',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    className="right-bento-card spotlight-card-glow"
                  >
                    {/* Header Controls Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', zIndex: 3 }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: 'rgba(16, 185, 129, 0.18)',
                          color: '#34d399',
                          border: '1px solid rgba(52, 211, 153, 0.35)',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        <Zap size={12} />
                        <span>Biomedical Spotlight</span>
                      </div>

                      {/* Interactive Shuffle & Navigation Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginRight: '4px' }}>
                          0{spotlightIndex + 1} / 0{spotlightEquipmentList.length}
                        </span>

                        <button
                          onClick={handleShuffleTop}
                          title="Shuffle product"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            color: '#ffffff',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            transition: 'all 0.2s'
                          }}
                          className="shuffle-btn-hover"
                        >
                          <Shuffle size={12} className={isShufflingTop ? 'animate-spin-once' : ''} />
                          <span>Shuffle</span>
                        </button>

                        <button
                          onClick={handlePrevTop}
                          aria-label="Previous product"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: 'none',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>

                        <button
                          onClick={handleNextTop}
                          aria-label="Next product"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: '#ffffff',
                            border: 'none',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Product Body: Content + Floating Image */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 2 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', color: '#2dd4bf', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                          {item.category}
                        </div>
                        <h3 style={{ fontSize: '1.24rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.28, marginBottom: '6px' }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4, marginBottom: '12px' }}>
                          {item.description}
                        </p>

                        {/* Specs Pill List */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {item.specs.map((s, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.68rem',
                                color: '#cbd5e1',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                padding: '3px 8px',
                                borderRadius: '6px'
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '1.32rem', fontWeight: 900, color: '#10b981' }}>
                              AED {item.salePrice.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.82rem', color: '#64748b', textDecoration: 'line-through', marginLeft: '6px' }}>
                              AED {item.regularPrice.toLocaleString()}
                            </span>
                          </div>

                          <Link
                            href={item.slug.startsWith('http') || item.slug === 'shop' ? `/${item.slug}` : `/product/${item.slug}`}
                            style={{
                              backgroundColor: '#00875a',
                              color: '#ffffff',
                              padding: '9px 20px',
                              borderRadius: '20px',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 14px rgba(0, 135, 90, 0.4)'
                            }}
                            className="hero-emerald-btn"
                          >
                            <span>BUY NOW</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>

                      {/* Product Image Stage */}
                      <div
                        style={{
                          width: '135px',
                          height: '165px',
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderRadius: '16px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          className="shuffle-img-transition"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Product Card 2: MULTI-TONAL MINT & SLATE CARD (Clinical Fast-Supply with Shuffle) */}
              {(() => {
                const item = fastSupplyConsumablesList[fastSupplyIndex];
                return (
                  <div
                    key={item.id}
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f4fbf7 100%)',
                      borderRadius: '24px',
                      padding: '24px 26px',
                      border: '1px solid #cbd5e1',
                      borderLeft: '6px solid #00875a',
                      boxShadow: '0 14px 34px rgba(15, 23, 42, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                    }}
                    className="right-bento-card"
                  >
                    {/* Circular Discount Sticker Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: '#00875a',
                        color: '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.64rem',
                        lineHeight: 1.15,
                        boxShadow: '0 4px 14px rgba(0, 135, 90, 0.35)',
                        transform: 'rotate(8deg)',
                        zIndex: 5
                      }}
                    >
                      <span style={{ fontSize: '0.6rem', color: '#fef08a' }}>HOT</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 900 }}>{item.discountBadge.replace('SALE ', '')}</span>
                    </div>

                    {/* Header Controls Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', zIndex: 3, paddingRight: '56px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          backgroundColor: '#ecfdf5',
                          color: '#065f46',
                          border: '1px solid #a7f3d0',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '20px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        <Stethoscope size={12} />
                        <span>Clinical Fast-Supply</span>
                      </div>

                      {/* Interactive Shuffle & Navigation */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginRight: '4px' }}>
                          0{fastSupplyIndex + 1} / 0{fastSupplyConsumablesList.length}
                        </span>

                        <button
                          onClick={handleShuffleBottom}
                          title="Shuffle consumable"
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            border: '1px solid #cbd5e1',
                            padding: '4px 10px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            transition: 'all 0.2s'
                          }}
                        >
                          <Shuffle size={12} className={isShufflingBottom ? 'animate-spin-once' : ''} />
                          <span>Shuffle</span>
                        </button>

                        <button
                          onClick={handlePrevBottom}
                          aria-label="Previous item"
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            border: 'none',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>

                        <button
                          onClick={handleNextBottom}
                          aria-label="Next item"
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            border: 'none',
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Product Body: Content + Image */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', zIndex: 2 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.72rem', color: '#0f766e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                          {item.category}
                        </div>
                        <h3 style={{ fontSize: '1.24rem', fontWeight: 800, color: '#0b1424', lineHeight: 1.28, marginBottom: '6px' }}>
                          {item.name}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, marginBottom: '12px' }}>
                          {item.description}
                        </p>

                        {/* Specs Pill List */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {item.specs.map((s, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '0.68rem',
                                color: '#334155',
                                backgroundColor: '#e2e8f0',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontWeight: 600
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* Price & CTA */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div>
                            <span style={{ fontSize: '1.32rem', fontWeight: 900, color: '#0f172a' }}>
                              AED {item.salePrice}
                            </span>
                            <span style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                              AED {item.regularPrice}
                            </span>
                          </div>

                          <Link
                            href={item.slug.startsWith('http') || item.slug === 'shop' ? `/${item.slug}` : `/product/${item.slug}`}
                            style={{
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              padding: '9px 20px',
                              borderRadius: '20px',
                              fontWeight: 800,
                              fontSize: '0.8rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease',
                              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)'
                            }}
                            className="hero-outline-btn"
                          >
                            <span>BUY NOW</span>
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>

                      {/* Product Image Stage */}
                      <div
                        style={{
                          width: '135px',
                          height: '155px',
                          backgroundColor: '#ffffff',
                          borderRadius: '16px',
                          padding: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          className="shuffle-img-transition"
                        />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
            {/* Mobile Touch Slider Swipe Hint */}
            <div className="mobile-swipe-pill" style={{ display: 'none', alignItems: 'center', justifyContent: 'center', gap: '6px', margin: '10px auto 0', color: '#64748b', fontSize: '0.74rem', fontWeight: 700 }}>
              <span style={{ backgroundColor: '#ffffff', padding: '6px 16px', borderRadius: '20px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                ↔ Swipe horizontally to explore featured equipment & fast-supplies
              </span>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            #hero-bento-grid {
              grid-template-columns: 1fr !important;
              gap: 20px !important;
            }
            #hero-bento-card-left {
              min-height: auto !important;
              padding: 34px 26px !important;
            }
            #hero-bento-title {
              font-size: 2.3rem !important;
            }
            #hero-metrics-strip {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .hero-right-bento-col {
              display: flex !important;
              grid-template-rows: none !important;
              overflow-x: auto !important;
              scroll-snap-type: x mandatory !important;
              -webkit-overflow-scrolling: touch !important;
              scrollbar-width: none !important;
              gap: 16px !important;
              padding: 6px 4px 16px !important;
              margin: 0 !important;
            }
            .hero-right-bento-col::-webkit-scrollbar {
              display: none !important;
            }
            .hero-right-bento-col .right-bento-card {
              flex: 0 0 calc(100vw - 52px) !important;
              max-width: 440px !important;
              scroll-snap-align: center !important;
              min-height: 285px !important;
            }
            .mobile-swipe-pill {
              display: flex !important;
            }
          }
          @media (max-width: 640px) {
            #hero-bento-title {
              font-size: 1.85rem !important;
              line-height: 1.18 !important;
            }
            #hero-bento-card-left {
              padding: 24px 18px !important;
            }
            #hero-metrics-strip {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 8px !important;
              padding: 12px 14px !important;
            }
            .hero-right-bento-col .right-bento-card {
              flex: 0 0 calc(100vw - 42px) !important;
              padding: 20px 18px !important;
            }
          }
          .hero-emerald-btn:hover {
            background-color: #00704a !important;
            transform: translateY(-2px);
          }
          .hero-outline-btn:hover {
            background-color: #1e293b !important;
            border-color: #1e293b !important;
            color: #ffffff !important;
            transform: translateY(-2px);
          }
          .right-bento-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 20px 42px rgba(15, 23, 42, 0.12) !important;
          }
          .shuffle-btn-hover:hover {
            background-color: rgba(255, 255, 255, 0.22) !important;
            transform: scale(1.04);
          }
          @keyframes spinOnce {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-once {
            animation: spinOnce 0.5s ease-in-out;
          }
          .shuffle-img-transition {
            animation: fadeInScale 0.4s ease forwards;
          }
          @keyframes fadeInScale {
            0% { opacity: 0.6; transform: scale(0.96); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>

      {/* SECTION 2: CLINICAL TRUST & VALUE PROPOSITION RIBBON */}
      <section style={{ padding: '0 0 50px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Box 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdf4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Truck size={22} color="#00875a" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Express UAE Delivery
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  Same-day delivery across Dubai, 24h supply to Abu Dhabi, Sharjah & all 7 Emirates.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#f0fdfa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <ShieldCheck size={22} color="#0d9488" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  MoHAP & DHA Compliant
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  100% genuine medical equipment certified for hospital wards, ICU, and clinical licensing.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#fffbeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Wrench size={22} color="#d97706" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Biomedical AMC & Service
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  On-site calibration, preventive maintenance, and factory biomedical engineering in DHCC.
                </p>
              </div>
            </div>

            {/* Box 4 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: '#fdf2f8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Award size={22} color="#db2777" />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  Direct Hospital Procurement
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                  Wholesale institutional pricing, flexible credit terms, and official UAE tender support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2.5: INSTITUTIONAL PROCUREMENT BANNER (DOC+ Style Dark Accent Module in Light Canvas) */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #071322 0%, #0d2238 50%, #064e3b 100%)',
              borderRadius: '26px',
              padding: '48px 52px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '36px',
              flexWrap: 'wrap',
              boxShadow: '0 20px 48px rgba(7, 19, 34, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Ambient emerald backlight */}
            <div
              style={{
                position: 'absolute',
                top: '-60px',
                right: '-40px',
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}
            />

            <div style={{ maxWidth: '680px', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.16)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '4px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '14px'
                }}
              >
                <span>Institutional Bulk Supply & Tenders</span>
              </div>
              <h2
                style={{
                  fontSize: '2.1rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.22,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px'
                }}
              >
                Procuring for UAE Hospitals, Day Surgery Clinics, or Labs?
              </h2>
              <p
                style={{
                  fontSize: '0.98rem',
                  color: '#94a3b8',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                FastOnMed offers institutional tier discounts, 30-day payment credit facilities, and official MoHAP tax quotation delivery in under 60 minutes with dedicated biomedical engineering support.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', zIndex: 2, flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 8px 24px rgba(245, 158, 11, 0.35)'
                }}
                className="banner-amber-btn"
              >
                <span>Request Tender Quote</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </Link>

              <a
                href="tel:+971508893589"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '15px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Phone size={16} />
                <span>+971 508 893 589</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: RECOMMENDED PRODUCTS (Light Mode Medical Grid) */}
      <section style={{ padding: '60px 0 80px', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '36px',
              flexWrap: 'wrap',
              gap: '20px'
            }}
          >
            <div>
              <span
                style={{
                  color: '#00875a',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                Official Healthcare Catalog
              </span>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  marginTop: '6px'
                }}
              >
                Recommended Medical Products
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div
              className="category-pills-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap'
              }}
            >
              {categoryPills.map(cat => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      backgroundColor: isSelected ? '#00875a' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? '1px solid #00875a' : '1px solid #cbd5e1',
                      padding: '8px 18px',
                      borderRadius: '24px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(0, 135, 90, 0.25)' : 'none'
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
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            {filteredProducts.slice(0, 8).map(product => {
              const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice;
              const hasDiscount = product.salePrice && product.regularPrice > product.salePrice;
              const discountPct = hasDiscount ? Math.round(((product.regularPrice - product.salePrice!) / product.regularPrice) * 100) : null;
              const isFav = isInWishlist(product.id);

              return (
                <div
                  key={product.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
                  }}
                  className="product-card-hover"
                >
                  {/* Badge */}
                  {discountPct && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '14px',
                        left: '14px',
                        backgroundColor: '#00875a',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        zIndex: 3
                      }}
                      className="product-badge"
                    >
                      -{discountPct}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      zIndex: 3,
                      color: isFav ? '#ef4444' : '#64748b',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                    }}
                    className="product-wish-btn"
                    aria-label="Save to Wishlist"
                  >
                    <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
                  </button>

                  {/* Product Image Container */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="product-img-box"
                    style={{
                      display: 'block',
                      backgroundColor: '#f8fafc',
                      padding: '24px',
                      height: '240px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={product.mainImage || '/products/patient-monitor.jpg'}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transition: 'transform 0.3s ease'
                      }}
                      className="card-img"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="product-info-box" style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="product-cat-label" style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: '6px' }}>
                      {product.category || 'Medical Equipment'}
                    </div>

                    <Link
                      href={`/product/${product.slug}`}
                      style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                        textDecoration: 'none',
                        lineHeight: 1.35,
                        marginBottom: '12px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '42px'
                      }}
                      className="product-title-link"
                    >
                      {product.name}
                    </Link>

                    {/* Star Rating */}
                    <div className="product-stars-row" style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '6px' }}>(5.0)</span>
                    </div>

                    {/* Price & Action Row */}
                    <div className="product-price-action-row" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        {price > 0 ? (
                          <div>
                            <span className="product-price-val" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                              AED {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="product-strike-val" style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '8px' }}>
                                AED {product.regularPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00875a' }}>
                            Quote on Request
                          </span>
                        )}
                      </div>

                      {price > 0 ? (
                        <button
                          onClick={() => handleAddToCart(product)}
                          style={{
                            backgroundColor: '#00875a',
                            color: '#ffffff',
                            border: 'none',
                            padding: '9px 18px',
                            borderRadius: '10px',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(0, 135, 90, 0.2)'
                          }}
                          className="btn-add-cart"
                        >
                          <ShoppingBag size={14} />
                          <span>Add</span>
                        </button>
                      ) : (
                        <Link
                          href={`/product/${product.slug}`}
                          style={{
                            backgroundColor: '#f1f5f9',
                            color: '#0f172a',
                            padding: '8px 14px',
                            borderRadius: '10px',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>RFQ</span>
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link
              href="/shop"
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '2px solid #cbd5e1',
                padding: '14px 38px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.95rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
              }}
              className="view-all-btn"
            >
              <span>Explore Full Medical Catalog (3,150+ Items)</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <style>{`
          .product-card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08) !important;
            border-color: #00875a !important;
          }
          .product-card-hover:hover .card-img {
            transform: scale(1.05);
          }
          .product-title-link:hover {
            color: #00875a !important;
          }
          .btn-add-cart:hover {
            background-color: #00704a !important;
            transform: scale(1.04);
          }
          .view-all-btn:hover {
            border-color: #00875a !important;
            color: #00875a !important;
          }

          @media (max-width: 768px) {
            .category-pills-row {
              flex-wrap: nowrap !important;
              overflow-x: auto !important;
              -webkit-overflow-scrolling: touch !important;
              scrollbar-width: none !important;
              padding-bottom: 4px !important;
              width: 100% !important;
            }
            .category-pills-row::-webkit-scrollbar {
              display: none !important;
            }
            .category-pills-row button {
              white-space: nowrap !important;
              flex-shrink: 0 !important;
              padding: 6px 14px !important;
              font-size: 0.78rem !important;
            }
            .recommended-product-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
            }
            .recommended-product-grid .product-card-hover {
              border-radius: 14px !important;
            }
            .recommended-product-grid .product-badge {
              top: 8px !important;
              left: 8px !important;
              padding: 2px 7px !important;
              font-size: 0.65rem !important;
            }
            .recommended-product-grid .product-wish-btn {
              top: 8px !important;
              right: 8px !important;
              width: 30px !important;
              height: 30px !important;
            }
            .recommended-product-grid .product-wish-btn svg {
              width: 14px !important;
              height: 14px !important;
            }
            .recommended-product-grid .product-img-box {
              height: 130px !important;
              padding: 10px !important;
            }
            .recommended-product-grid .product-info-box {
              padding: 10px 10px 12px !important;
            }
            .recommended-product-grid .product-cat-label {
              font-size: 0.66rem !important;
              margin-bottom: 3px !important;
            }
            .recommended-product-grid .product-title-link {
              font-size: 0.8rem !important;
              line-height: 1.25 !important;
              height: 30px !important;
              margin-bottom: 6px !important;
            }
            .recommended-product-grid .product-stars-row {
              display: none !important;
            }
            .recommended-product-grid .product-price-action-row {
              padding-top: 8px !important;
              flex-direction: column !important;
              align-items: flex-start !important;
              gap: 8px !important;
            }
            .recommended-product-grid .product-price-val {
              font-size: 0.94rem !important;
            }
            .recommended-product-grid .product-strike-val {
              font-size: 0.72rem !important;
            }
            .recommended-product-grid .btn-add-cart {
              width: 100% !important;
              justify-content: center !important;
              padding: 7px 10px !important;
              font-size: 0.76rem !important;
              border-radius: 8px !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 4: DUAL CLINICAL SPOTLIGHT BANNERS (Light Medical Style) */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ color: '#00875a', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Specialized Healthcare Units
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
              What&apos;s New in Biomedical Engineering
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
              gap: '28px'
            }}
            id="dual-spotlight-grid"
          >
            {/* Banner 1: ICU & Critical Care */}
            <div
              style={{
                position: 'relative',
                borderRadius: '26px',
                overflow: 'hidden',
                minHeight: '380px',
                padding: '44px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(255, 255, 255, 0.98) 100%), url('/products/patient-monitor.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
              }}
            >
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#00875a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Intensive Care Systems
              </span>
              <h3 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '12px' }}>
                Multi-Parameter Patient Monitors & Ventilators
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px', maxWidth: '440px' }}>
                Continuous cardiac telemetry, invasive arterial blood pressure, and hospital central monitoring networks.
              </p>
              <Link
                href="/shop?category=general-medical-devices"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: 'fit-content',
                  transition: 'background-color 0.2s'
                }}
                className="banner-cta"
              >
                <span>EXPLORE ICU GEAR</span>
                <ChevronRight size={16} />
              </Link>
            </div>

            {/* Banner 2: Hospital Furniture & Sterilization */}
            <div
              style={{
                position: 'relative',
                borderRadius: '26px',
                overflow: 'hidden',
                minHeight: '380px',
                padding: '44px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(255, 255, 255, 0.98) 100%), url('/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
              }}
            >
              <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
                Hospital Ward & Surgical Setup
              </span>
              <h3 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: '12px' }}>
                Electric Hospital Beds & Surgical Lighting
              </h3>
              <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.5, marginBottom: '24px', maxWidth: '440px' }}>
                High-grade antibacterial hospital ward furniture, clinical examination couches, and autoclaves.
              </p>
              <Link
                href="/shop?category=hospital-furniture"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '12px 28px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: 'fit-content',
                  transition: 'background-color 0.2s'
                }}
                className="banner-cta"
              >
                <span>VIEW FURNITURE</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            #dual-spotlight-grid {
              grid-template-columns: 1fr !important;
            }
          }
          .banner-cta:hover {
            background-color: #00875a !important;
          }
        `}</style>
      </section>

      {/* SECTION 5: CLINICAL CONSULTANT HELP BOX (Fresh Light Styling) */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)',
              borderRadius: '26px',
              padding: '48px 56px',
              border: '1px solid #99f6e4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '32px',
              boxShadow: '0 10px 30px rgba(13, 148, 136, 0.08)'
            }}
          >
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Headphones size={22} color="#00875a" />
                <span style={{ fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#00875a' }}>
                  24/7 Biomedical Advisory
                </span>
              </div>
              <h3 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                Do you need help? Contact our biomedical consultant
              </h3>
              <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Our Dubai Healthcare City (DHCC) clinical specialists provide technical consultations, DHA compliance verification, hospital procurement quotes, and installation engineering.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '240px' }}>
              <a
                href="tel:+971508893589"
                style={{
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '16px 28px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(0, 135, 90, 0.25)',
                  transition: 'all 0.2s'
                }}
              >
                <Phone size={18} />
                <span>+971 508 893 589</span>
              </a>

              <a
                href="https://wa.me/971508893589?text=Hello%20FastOnMed%20Team,%20I%20would%20like%20to%20consult%20regarding%20hospital%20equipment%20procurement"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  transition: 'all 0.2s'
                }}
              >
                <MessageCircle size={18} />
                <span>WhatsApp Consultant</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: CLINICAL GUIDES & HEALTHCARE INSIGHTS (Light Mode Cards) */}
      <section style={{ padding: '0 0 90px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <span style={{ color: '#00875a', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Healthcare Knowledge Base
            </span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
              Clinical Equipment Guides & UAE Regulations
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '26px'
            }}
          >
            {/* Article 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/images/original/clinic-1.webp"
                  alt="DHA Clinic Licensing"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '14px', left: '14px', backgroundColor: '#ffffff', color: '#0d9488', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  REGULATORY GUIDE
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '8px' }}>5 min read • DHA Standards</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '10px' }}>
                  Mandatory Medical Equipment Checklist for DHA Clinic Licensing in Dubai
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '18px' }}>
                  Learn the required biomedical inspection protocols, defibrillator guidelines, and sterilization benchmarks demanded by Dubai Health Authority.
                </p>
                <Link
                  href="/contact"
                  style={{
                    color: '#00875a',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: 'auto'
                  }}
                >
                  <span>Request Full Checklist</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/products/patient-monitor.jpg"
                  alt="ICU Patient Monitoring"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '14px', left: '14px', backgroundColor: '#ffffff', color: '#00875a', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  CLINICAL TECH
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '8px' }}>4 min read • ICU Protocol</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '10px' }}>
                  Choosing Multi-Parameter Patient Monitors for ICU vs. General Hospital Wards
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '18px' }}>
                  A comparative technical breakdown between portable bedside monitors and centralized ICU telemetry telemetry stations.
                </p>
                <Link
                  href="/shop?category=general-medical-devices"
                  style={{
                    color: '#00875a',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: 'auto'
                  }}
                >
                  <span>View Monitor Models</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Article 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '200px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/images/original/WhatsApp-Image-2025-06-28-at-18.29.38-1-1.jpeg"
                  alt="Biomedical Engineering AMC"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '14px', left: '14px', backgroundColor: '#ffffff', color: '#d97706', fontSize: '0.72rem', fontWeight: 800, padding: '4px 10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  BIOMEDICAL AMC
                </div>
              </div>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '8px' }}>6 min read • Maintenance</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '10px' }}>
                  Preventive Maintenance and Electrical Safety Testing for Medical Facilities
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '18px' }}>
                  Understanding IEC 62353 standards for leakage current, ground resistance, and annual calibration certifications.
                </p>
                <Link
                  href="/contact"
                  style={{
                    color: '#00875a',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: 'auto'
                  }}
                >
                  <span>Book Biomedical Inspection</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: CLINICAL NEWSLETTER (Light Styling) */}
      <section style={{ padding: '0 0 90px' }}>
        <div className="container" style={{ maxWidth: '960px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '26px',
              padding: '48px 40px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span style={{ color: '#00875a', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Institutional Procurement Network
            </span>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '8px 0 14px' }}>
              Join Our Clinical Procurement Newsletter
            </h3>
            <p style={{ fontSize: '0.96rem', color: '#64748b', maxWidth: '580px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              Receive monthly UAE MoHAP regulatory updates, hospital tender discounts, and new biomedical equipment releases.
            </p>

            {newsletterSubmitted ? (
              <div style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '16px 24px', borderRadius: '12px', fontWeight: 700, display: 'inline-block' }}>
                ✓ Thank you! You are now subscribed to FastOnMed Clinical Procurement Updates.
              </div>
            ) : (
              <form
                onSubmit={handleNewsletter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '520px',
                  margin: '0 auto',
                  backgroundColor: '#f8fafc',
                  borderRadius: '14px',
                  padding: '6px 6px 6px 18px',
                  border: '1px solid #cbd5e1'
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your hospital or clinical email..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '0.92rem',
                    outline: 'none',
                    padding: '8px 0'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 8: GOOGLE REVIEWS & CLINICAL CLIENT ACCREDITATIONS */}
      <GoogleReviewsSection />
    </div>
  );
}
