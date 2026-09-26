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
  Star,
  Layers,
  Heart,
  ShoppingBag,
  ExternalLink,
  Award,
  Stethoscope,
  Headphones
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
              gridTemplateColumns: '1.55fr 1fr',
              gap: '24px',
              alignItems: 'stretch'
            }}
            id="hero-bento-grid"
          >
            {/* 1. MAIN BENTO CARD (Left Large Hero Card) */}
            <div
              style={{
                position: 'relative',
                borderRadius: '26px',
                overflow: 'hidden',
                minHeight: '580px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '48px',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.85) 60%, rgba(255, 255, 255, 0.98) 100%), url('/images/hero-medical-light.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
              }}
            >
              {/* Top Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '32px',
                  left: '48px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00875a' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0f766e' }}>
                  UAE MoHAP & DHA Certified Medical Supplier
                </span>
              </div>

              {/* Main Content */}
              <div style={{ maxWidth: '640px', zIndex: 2 }}>
                <h1
                  style={{
                    fontSize: '3.2rem',
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
                    marginBottom: '32px',
                    fontWeight: 500
                  }}
                >
                  FastOnMed is the UAE’s trusted biomedical partner in Dubai Healthcare City (DHCC). We supply certified hospital furniture, ICU patient monitors, ventilators, and emergency healthcare consumables with 24h express supply across Dubai & Abu Dhabi.
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
                      boxShadow: '0 8px 20px rgba(0, 135, 90, 0.25)'
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
                      border: '1px solid #cbd5e1',
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
            </div>

            {/* 2. RIGHT COLUMN: REAL PRODUCTS SHOWCASE (Replacing countdown timer as requested) */}
            <div
              style={{
                display: 'grid',
                gridTemplateRows: '1fr 1fr',
                gap: '24px'
              }}
            >
              {/* Product Card 1: Haier Biomedical Vaccine & Pharmacy Refrigerator */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                className="right-bento-card"
              >
                <div style={{ flex: 1, zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f0fdf4',
                      color: '#15803d',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '8px'
                    }}
                  >
                    Cold Chain Medical
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                    Haier Vaccine Refrigerator HYC-309
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
                    2°C to 8°C High Precision Vaccine & Pharmacy Cooling
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>AED 10,950</span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>AED 12,500</span>
                  </div>
                  <Link
                    href="/product/haier-biomedical-hyc-309-pharmacy-refrigerator"
                    style={{
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      padding: '10px 22px',
                      borderRadius: '24px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>BUY NOW</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>

                <div style={{ width: '130px', height: '170px', position: 'relative', flexShrink: 0 }}>
                  <img
                    src="/images/original/Fridges-Pharmacy_Haier_HYC-309.png"
                    alt="Haier Biomedical Vaccine Refrigerator"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>

              {/* Product Card 2: Bio Safe Body Fluid Clean-Up Kit (Real Product from User Screenshot) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 10px 25px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                className="right-bento-card"
              >
                {/* Circular Discount Sticker Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    lineHeight: 1.15,
                    boxShadow: '0 4px 12px rgba(0, 135, 90, 0.3)',
                    transform: 'rotate(10deg)',
                    zIndex: 5
                  }}
                >
                  <span style={{ fontSize: '0.62rem' }}>SALE</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 900 }}>30%</span>
                </div>

                <div style={{ flex: 1, zIndex: 2 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      marginBottom: '8px'
                    }}
                  >
                    Hospital Disinfection & PPE
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.3, marginBottom: '6px' }}>
                    Bio Safe Fluid Clean-Up Kit
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px', lineHeight: 1.4 }}>
                    Emergency Biohazard Spill Kit | CM-1011024
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>AED 95</span>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>AED 135</span>
                  </div>
                  <Link
                    href="/product/bio-safe-body-fluid-clean-up-kit-1-application-cm-1011024"
                    style={{
                      backgroundColor: '#00875a',
                      color: '#ffffff',
                      padding: '10px 22px',
                      borderRadius: '24px',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>BUY NOW</span>
                    <ChevronRight size={15} />
                  </Link>
                </div>

                <div style={{ width: '130px', height: '150px', position: 'relative', flexShrink: 0 }}>
                  <img
                    src="/wp-content/uploads/2026/09/Body-Fluid-Clean-up-Kit-1-Application.jpg"
                    alt="Bio Safe Body Fluid Clean-Up Kit"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1024px) {
            #hero-bento-grid {
              grid-template-columns: 1fr !important;
            }
            #hero-bento-title {
              font-size: 2.5rem !important;
            }
          }
          @media (max-width: 640px) {
            #hero-bento-title {
              font-size: 2rem !important;
            }
          }
          .hero-emerald-btn:hover {
            background-color: #00704a !important;
            transform: translateY(-2px);
          }
          .hero-outline-btn:hover {
            border-color: #00875a !important;
            color: #00875a !important;
          }
          .right-bento-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08) !important;
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
                    aria-label="Save to Wishlist"
                  >
                    <Heart size={18} fill={isFav ? '#ef4444' : 'none'} />
                  </button>

                  {/* Product Image Container */}
                  <Link
                    href={`/product/${product.slug}`}
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
                  <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: '6px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '14px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '6px' }}>(5.0)</span>
                    </div>

                    {/* Price & Action Row */}
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <div>
                        {price > 0 ? (
                          <div>
                            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                              AED {price.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '8px' }}>
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
