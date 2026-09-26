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

      {/* SECTION 1: CLEAN LIGHT HERO BANNER (Professional Medical E-Commerce) */}
      <section style={{ padding: '16px 0 24px', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div
            id="hero-main-banner"
            style={{
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              padding: '32px 36px',
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr',
              gap: '28px',
              alignItems: 'center',
              boxShadow: '0 4px 20px rgba(15, 23, 42, 0.03)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background subtle tint */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '42%',
                background: 'linear-gradient(135deg, #f0fdfa 0%, #e6f9f3 100%)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
              className="hero-bg-tint"
            />

            {/* Left Content Column */}
            <div style={{ zIndex: 1 }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '12px'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <span>UAE Licensed Medical Supplier · DHCC Dubai</span>
              </div>

              {/* Heading */}
              <h1
                id="hero-title"
                style={{
                  fontSize: '2.2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
                  margin: '0 0 12px'
                }}
              >
                Medical Equipment & Hospital Supplies
              </h1>

              {/* Subtitle */}
              <p
                id="hero-subtitle"
                style={{
                  fontSize: '0.94rem',
                  color: '#475569',
                  lineHeight: 1.5,
                  margin: '0 0 20px',
                  maxWidth: '540px'
                }}
              >
                Certified hospital furniture, patient monitors, diagnostic equipment, and clinical consumables with fast express delivery across Dubai, Abu Dhabi, and all 7 Emirates.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <Link
                  href="/shop"
                  style={{
                    backgroundColor: '#00875a',
                    color: '#ffffff',
                    padding: '10px 22px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.03em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 135, 90, 0.25)'
                  }}
                  className="btn-hero-primary"
                >
                  <span>Browse Products</span>
                  <ChevronRight size={15} />
                </Link>

                <a
                  href="https://wa.me/971508893589?text=Hello%20FastOnMed%20Sales%2C%20I%20would%20like%20to%20request%20a%20commercial%20quotation%20for%20medical%20equipment."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                  className="btn-hero-secondary"
                >
                  <MessageCircle size={15} color="#25d366" />
                  <span>Request Quote (RFQ)</span>
                </a>
              </div>
            </div>

            {/* Right Product Spotlight (Desktop only, hidden on mobile for clean fast product access) */}
            <div id="hero-right-spotlight" style={{ zIndex: 1, display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #d9e6e1',
                  boxShadow: '0 8px 24px rgba(0, 135, 90, 0.07)',
                  maxWidth: '360px',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#00875a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Featured Clinical Tech
                  </span>
                  <span style={{ fontSize: '0.66rem', fontWeight: 700, backgroundColor: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '12px' }}>
                    In Stock · UAE
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '160px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px'
                  }}
                >
                  <img
                    src="/wp-content/uploads/2025/06/biobase-weighing-bio-safety-cabinet-bsc-1000-1-510x510_large.jpg"
                    alt="Biobase BSC-1000 Biosafety Cabinet"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>
                    Biobase BSC-1000 Biosafety Cabinet
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                    <div>
                      <span style={{ fontSize: '1.12rem', fontWeight: 800, color: '#0f172a' }}>AED 9,800</span>
                      <span style={{ fontSize: '0.76rem', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>AED 11,245</span>
                    </div>
                    <Link
                      href="/product/biobase-weighing-bio-safety-cabinet-bsc-1000"
                      style={{
                        backgroundColor: '#00875a',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #hero-main-banner {
              grid-template-columns: 1fr !important;
              padding: 20px 16px !important;
              border-radius: 16px !important;
            }
            .hero-bg-tint {
              display: none !important;
            }
            #hero-right-spotlight {
              display: none !important;
            }
            #hero-title {
              font-size: 1.4rem !important;
              line-height: 1.22 !important;
              margin-bottom: 8px !important;
            }
            #hero-subtitle {
              font-size: 0.84rem !important;
              line-height: 1.45 !important;
              margin-bottom: 16px !important;
            }
            .btn-hero-primary, .btn-hero-secondary {
              padding: 8px 16px !important;
              font-size: 0.8rem !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 2: SLIM TRUST STRIP (Takes Minimal Vertical Space, Zero Bloat) */}
      <section style={{ padding: '0 0 20px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div
            id="trust-strip-grid"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              padding: '12px 18px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '14px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Truck size={16} color="#00875a" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Express UAE Delivery</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Same-day Dubai & 24h Emirates</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck size={16} color="#0d9488" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>MoHAP & DHA Certified</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>100% genuine medical grade</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Wrench size={16} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Biomedical Warranty</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Technical support & AMC</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#fdf2f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Award size={16} color="#db2777" />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Hospital B2B Pricing</div>
                <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Institutional wholesale rates</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #trust-strip-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: 10px !important;
              padding: 10px 12px !important;
            }
          }
        `}</style>
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
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                Official Healthcare Catalog
              </span>
              <h2
                id="products-section-heading"
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  letterSpacing: '-0.02em',
                  marginTop: '4px'
                }}
              >
                Featured Medical Products
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
            #products-section-heading {
              font-size: 1.25rem !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 3.5: INSTITUTIONAL BULK SUPPLY & HOSPITAL PROCUREMENT (Placed Naturally After Catalog) */}
      <section style={{ padding: '0 0 40px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div
            id="institutional-banner-card"
            style={{
              background: 'linear-gradient(135deg, #071322 0%, #0d2238 50%, #064e3b 100%)',
              borderRadius: '20px',
              padding: '32px 36px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
              boxShadow: '0 12px 32px rgba(7, 19, 34, 0.16)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{ maxWidth: '640px', zIndex: 2 }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'rgba(245, 158, 11, 0.16)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '10px'
                }}
              >
                <span>Institutional Bulk Supply & Tenders</span>
              </div>
              <h2
                id="inst-banner-title"
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  letterSpacing: '-0.02em',
                  margin: '0 0 10px'
                }}
              >
                Procuring for UAE Hospitals, Clinics, or Laboratories?
              </h2>
              <p
                id="inst-banner-sub"
                style={{
                  fontSize: '0.9rem',
                  color: '#94a3b8',
                  lineHeight: 1.55,
                  margin: 0
                }}
              >
                FastOnMed provides institutional discounts, flexible payment terms, and official MoHAP tax quotation delivery in under 60 minutes with dedicated biomedical engineering support.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', zIndex: 2, flexWrap: 'wrap' }}>
              <Link
                href="/contact"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#0f172a',
                  padding: '11px 24px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
                }}
              >
                <span>Request Tender Quote</span>
                <ArrowRight size={16} />
              </Link>

              <a
                href="tel:+971508893589"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Phone size={15} />
                <span>+971 508 893 589</span>
              </a>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            #institutional-banner-card {
              padding: 22px 18px !important;
              border-radius: 16px !important;
            }
            #inst-banner-title {
              font-size: 1.25rem !important;
            }
            #inst-banner-sub {
              font-size: 0.82rem !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 4: DUAL CLINICAL SPOTLIGHT BANNERS (Light Medical Style) */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span style={{ color: '#00875a', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Specialized Healthcare Units
            </span>
            <h2 id="clinical-units-heading" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '4px' }}>
              Clinical Units & Hospital Setup
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
            id="dual-spotlight-grid"
          >
            {/* Banner 1: ICU & Critical Care */}
            <div
              style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                minHeight: '280px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.88) 55%, rgba(255, 255, 255, 0.98) 100%), url('/products/patient-monitor.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)'
              }}
              className="spotlight-banner-card"
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00875a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Intensive Care Systems
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '8px' }}>
                Multi-Parameter Patient Monitors & Ventilators
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.45, marginBottom: '16px', maxWidth: '420px' }}>
                Continuous cardiac telemetry, invasive arterial blood pressure, and hospital central monitoring networks.
              </p>
              <Link
                href="/shop?category=general-medical-devices"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content'
                }}
                className="banner-cta"
              >
                <span>EXPLORE ICU GEAR</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Banner 2: Hospital Furniture & Sterilization */}
            <div
              style={{
                position: 'relative',
                borderRadius: '18px',
                overflow: 'hidden',
                minHeight: '280px',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.88) 55%, rgba(255, 255, 255, 0.98) 100%), url('/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                border: '1px solid #e2e8f0',
                boxShadow: '0 6px 20px rgba(15, 23, 42, 0.04)'
              }}
              className="spotlight-banner-card"
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Hospital Ward & Surgical Setup
              </span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.25, marginBottom: '8px' }}>
                Electric Hospital Beds & Surgical Lighting
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#475569', lineHeight: 1.45, marginBottom: '16px', maxWidth: '420px' }}>
                High-grade antibacterial hospital ward furniture, clinical examination couches, and autoclaves.
              </p>
              <Link
                href="/shop?category=hospital-furniture"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  width: 'fit-content'
                }}
                className="banner-cta"
              >
                <span>VIEW FURNITURE</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            #clinical-units-heading {
              font-size: 1.22rem !important;
            }
            .spotlight-banner-card {
              padding: 20px 16px !important;
              min-height: 240px !important;
            }
            .spotlight-banner-card h3 {
              font-size: 1.08rem !important;
            }
            .spotlight-banner-card p {
              font-size: 0.8rem !important;
              margin-bottom: 12px !important;
            }
          }
          .banner-cta:hover {
            background-color: #00875a !important;
          }
        `}</style>
      </section>

      {/* SECTION 5: CLINICAL CONSULTANT HELP BOX (Fresh Light Styling) */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div
            id="consultant-advisory-card"
            style={{
              background: 'linear-gradient(135deg, #f0fdfa 0%, #e6fffa 100%)',
              borderRadius: '20px',
              padding: '36px 40px',
              border: '1px solid #99f6e4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px',
              boxShadow: '0 8px 24px rgba(13, 148, 136, 0.06)'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Headphones size={20} color="#00875a" />
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#00875a' }}>
                  Biomedical Advisory
                </span>
              </div>
              <h3 id="consultant-box-title" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Need help? Contact our biomedical consultant
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                Our Dubai Healthcare City (DHCC) clinical specialists provide technical consultations, DHA compliance verification, hospital procurement quotes, and installation engineering.
              </p>
            </div>

            <div id="consultant-action-buttons" style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
              <a
                href="tel:+971508893589"
                style={{
                  backgroundColor: '#00875a',
                  color: '#ffffff',
                  padding: '13px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0, 135, 90, 0.2)',
                  transition: 'all 0.2s'
                }}
              >
                <Phone size={17} />
                <span>+971 508 893 589</span>
              </a>

              <a
                href="https://wa.me/971508893589?text=Hello%20FastOnMed%20Team,%20I%20would%20like%20to%20consult%20regarding%20hospital%20equipment%20procurement"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <MessageCircle size={17} />
                <span>WhatsApp Consultant</span>
              </a>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #consultant-advisory-card {
              padding: 22px 18px !important;
              border-radius: 16px !important;
            }
            #consultant-box-title {
              font-size: 1.15rem !important;
              line-height: 1.35 !important;
            }
            #consultant-action-buttons {
              width: 100% !important;
              min-width: 100% !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 6: CLINICAL GUIDES & HEALTHCARE INSIGHTS */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container" style={{ maxWidth: '1360px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ color: '#00875a', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Healthcare Knowledge Base
            </span>
            <h2 id="guides-section-heading" style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '6px' }}>
              Clinical Equipment Guides & UAE Regulations
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {/* Article 1 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '170px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/images/original/clinic-1.webp"
                  alt="DHA Clinic Licensing"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ffffff', color: '#0d9488', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  REGULATORY GUIDE
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>5 min read • DHA Standards</span>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px' }}>
                  Mandatory Medical Equipment Checklist for DHA Clinic Licensing in Dubai
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.55, marginBottom: '14px' }}>
                  Learn the required biomedical inspection protocols, defibrillator guidelines, and sterilization benchmarks demanded by Dubai Health Authority.
                </p>
                <Link
                  href="/contact"
                  style={{
                    color: '#00875a',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: 'auto'
                  }}
                >
                  <span>Request Full Checklist</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Article 2 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '170px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/products/patient-monitor.jpg"
                  alt="ICU Patient Monitoring"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ffffff', color: '#00875a', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  CLINICAL TECH
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>4 min read • ICU Protocol</span>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px' }}>
                  Choosing Multi-Parameter Patient Monitors for ICU vs. General Hospital Wards
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.55, marginBottom: '14px' }}>
                  A comparative technical breakdown between portable bedside monitors and centralized ICU telemetry stations.
                </p>
                <Link
                  href="/shop?category=general-medical-devices"
                  style={{
                    color: '#00875a',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: 'auto'
                  }}
                >
                  <span>View Monitor Models</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Article 3 */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 3px 12px rgba(0, 0, 0, 0.02)'
              }}
            >
              <div style={{ height: '170px', backgroundColor: '#f1f5f9', position: 'relative', overflow: 'hidden' }}>
                <img
                  src="/images/original/WhatsApp-Image-2025-06-28-at-18.29.38-1-1.jpeg"
                  alt="Biomedical Engineering AMC"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ffffff', color: '#d97706', fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  BIOMEDICAL AMC
                </div>
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '6px' }}>6 min read • Maintenance</span>
                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px' }}>
                  Preventive Maintenance and Electrical Safety Testing for Medical Facilities
                </h4>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.55, marginBottom: '14px' }}>
                  Understanding IEC 62353 standards for leakage current, ground resistance, and annual calibration certifications.
                </p>
                <Link
                  href="/contact"
                  style={{
                    color: '#00875a',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    marginTop: 'auto'
                  }}
                >
                  <span>Book Biomedical Inspection</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #guides-section-heading {
              font-size: 1.22rem !important;
              line-height: 1.35 !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 7: CLINICAL NEWSLETTER */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container" style={{ maxWidth: '880px', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
          <div
            id="newsletter-card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)'
            }}
          >
            <span style={{ color: '#00875a', fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Institutional Procurement Network
            </span>
            <h3 id="newsletter-heading" style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: '8px 0 10px' }}>
              Join Our Clinical Procurement Newsletter
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '520px', margin: '0 auto 22px', lineHeight: 1.55 }}>
              Receive monthly UAE MoHAP regulatory updates, hospital tender discounts, and new biomedical equipment releases.
            </p>

            {newsletterSubmitted ? (
              <div style={{ backgroundColor: '#f0fdf4', color: '#15803d', padding: '14px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', display: 'inline-block' }}>
                ✓ Thank you! You are now subscribed to FastOnMed Clinical Procurement Updates.
              </div>
            ) : (
              <form
                id="newsletter-form"
                onSubmit={handleNewsletter}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  maxWidth: '480px',
                  margin: '0 auto',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  padding: '5px 5px 5px 16px',
                  border: '1px solid #cbd5e1'
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Enter hospital or clinic email..."
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: '#0f172a',
                    fontSize: '0.88rem',
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
                    padding: '11px 20px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    flexShrink: 0
                  }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            #newsletter-card {
              padding: 24px 18px !important;
              border-radius: 16px !important;
            }
            #newsletter-heading {
              font-size: 1.15rem !important;
              line-height: 1.35 !important;
            }
            #newsletter-form {
              flex-direction: column !important;
              padding: 10px !important;
              gap: 8px !important;
            }
            #newsletter-form input {
              width: 100% !important;
              text-align: center !important;
            }
            #newsletter-form button {
              width: 100% !important;
            }
          }
        `}</style>
      </section>

      {/* SECTION 8: GOOGLE REVIEWS & CLINICAL CLIENT ACCREDITATIONS */}
      <GoogleReviewsSection />
    </div>
  );
}
