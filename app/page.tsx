'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

function jsxDEV(this: unknown, type: any, props: any, key?: React.Key, ..._debug: unknown[]) {
  const actualType = (type && type.default) ? type.default : type;
  if (!actualType) {
    return null;
  }
  const { children, ...rest } = props || {};
  const elementProps = key !== undefined ? { ...rest, key } : rest;
  if (children === undefined) {
    return React.createElement(actualType, elementProps);
  }
  if (Array.isArray(children)) {
    return React.createElement(actualType, elementProps, ...children);
  }
  return React.createElement(actualType, elementProps, children);
}

import {
  ArrowRight,
  MessageCircle,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Wrench,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';
import TrustBar from '@/components/TrustBar';
import { fetchCatalog } from '@/lib/backend-client';
import type { Product } from '@/lib/types';

// 12 Exact Categories from live FastOnMed
const categories = [
    {
        name: 'Accessories',
        slug: 'accessories',
        image: '/images/original/accessories-1.jpeg'
    },
    {
        name: 'Consumables & Disposables',
        slug: 'consumables-and-disposables',
        image: '/images/original/consumables-1.jpeg'
    },
    {
        name: 'Dermatology Equipment',
        slug: 'dermatology-equipment',
        image: '/images/original/WhatsApp-Image-2025-06-28-at-18.29.38-1-1.jpeg'
    },
    {
        name: 'Dental Equipment',
        slug: 'dental-equipments',
        image: '/images/original/dental-chair-1.jpeg'
    },
    {
        name: 'ENT Equipment',
        slug: 'ent-equipments',
        image: '/images/original/ent-1.jpeg'
    },
    {
        name: 'General Medical Devices',
        slug: 'general-medical-devices',
        image: '/images/original/genaral-equipments-1.jpeg'
    },
    {
        name: 'Hospital Furnitures',
        slug: 'hospital-furniture',
        image: '/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg'
    },
    {
        name: 'Gynecology Equipment',
        slug: 'labor-room-equipments',
        image: '/images/original/gynocology-1.jpeg'
    },
    {
        name: 'Laboratory Equipment',
        slug: 'laboratory-equipment',
        image: '/images/original/laborotory-equipments-1.jpeg'
    },
    {
        name: 'Ophthalmology Equipment',
        slug: 'ophthalmology-equipments',
        image: '/images/original/ofthemology-1.jpeg'
    },
    {
        name: 'Physiotherapy Equipment',
        slug: 'physiotherapy-equipments',
        image: '/images/original/phsyotherapy-1.jpeg'
    },
    {
        name: 'Radiology Equipment',
        slug: 'radiology-equipments',
        image: '/images/original/radiology-1.jpeg'
    }
];
// 10 Exact Best Sellers from live FastOnMed
const liveBestSellers = [
    {
        id: 'fom-bs-1',
        name: 'Haier Biomedical HYC-309 Pharmacy Refrigerator 2–8°C, 309 L',
        slug: 'haier-biomedical-hyc-309-pharmacy-refrigerator',
        sku: 'HYC-309',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 12500,
        salePrice: 10950,
        category: 'Laboratory Equipment',
        brand: 'Haier Biomedical',
        shortDescription: 'Pharmacy and vaccine refrigerator engineered for precise temperature uniformity between 2°C and 8°C with digital display and alarm systems.',
        fullDescription: 'Haier Biomedical HYC-309 Pharmacy Refrigerator delivers superior cooling reliability for pharmaceutical products, vaccines, biologicals, and temperature-sensitive clinical materials. Equipped with forced-air cooling, self-closing glass door, and multi-alarm safety mechanisms.',
        mainImage: '/images/original/Fridges-Pharmacy_Haier_HYC-309.png',
        galleryImages: [
            '/images/original/Fridges-Pharmacy_Haier_HYC-309.png'
        ],
        stockQuantity: 8,
        lowStockThreshold: 2,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Capacity': '309 Liters',
            'Temp Range': '2°C to 8°C',
            'Refrigerant': 'Hydrocarbon Eco-friendly',
            'Doors': 'Heated glass, self-closing'
        },
        features: [
            'Microprocessor temperature control',
            'Audible & visual safety alarms',
            'Uniform airflow design',
            'MoHAP & DOH compliant'
        ],
        applications: [
            'Hospital Pharmacies',
            'Vaccination Centers',
            'Laboratories',
            'Clinics'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-2',
        name: 'Cederroth Sterile Net Wound Dressing | 1893',
        slug: 'cederroth-sterile-net-wound-dressing-1893',
        sku: 'CED-1893',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 185,
        salePrice: 165,
        category: 'Consumables & Disposables',
        brand: 'Cederroth',
        shortDescription: 'Sterile non-adherent net wound dressing for direct application over acute cuts, burns, and abrasions.',
        fullDescription: 'Cederroth 1893 Sterile Net Wound Dressing allows exudate to pass through freely into an absorbent secondary pad while preventing dressing sticking to fragile new tissue.',
        mainImage: '/images/original/Net-dressing-CEDERROTH-1893-362x500.jpg',
        galleryImages: [
            '/images/original/Net-dressing2-CEDERROTH-1893-500x500.jpg'
        ],
        stockQuantity: 120,
        lowStockThreshold: 20,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Box Count': '10 pieces/box',
            'Sterilization': 'Gamma irradiated',
            'Texture': 'Non-adherent porous net'
        },
        features: [
            'Non-stick contact layer',
            'Painless dressing change',
            'Hospital grade sterility'
        ],
        applications: [
            'Emergency Rooms',
            'Ambulatory Care',
            'First Aid Stations'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-3',
        name: 'Cederroth Burn Gel Dressing 10 × 10 cm | 901900',
        slug: 'cederroth-burn-gel-dressing-10x10-cm-901900',
        sku: 'CED-901900',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 95,
        salePrice: 85,
        category: 'Consumables & Disposables',
        brand: 'Cederroth',
        shortDescription: 'Rapid cooling burn gel dressing for 1st and 2nd-degree burns, scalds, and sunburns.',
        fullDescription: 'Provides immediate cooling pain relief, prevents burn progression into deeper tissue layers, and protects against contamination without adhering to damaged skin.',
        mainImage: '/images/original/Burn-Gel-Dressing-10_C3_9710-cm-500x500.jpg',
        galleryImages: [
            '/images/original/Burn-Gel-Dressing-10_C3_9710-cm1-500x500.jpg'
        ],
        stockQuantity: 95,
        lowStockThreshold: 15,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Size': '10 x 10 cm',
            'Gel Base': 'Water-based cooling gel',
            'Packaging': 'Individually foil sealed'
        },
        features: [
            'Immediate pain reduction',
            'Prevents infection',
            'Non-toxic, safe for facial application'
        ],
        applications: [
            'Kitchens & Industry',
            'Urgent Care Centers',
            'First Aid Kits'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-4',
        name: 'Cederroth Emergency Blanket | 1892',
        slug: 'cederroth-emergency-blanket-1892',
        sku: 'CED-1892',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 45,
        salePrice: 38,
        category: 'Consumables & Disposables',
        brand: 'Cederroth',
        shortDescription: 'Reflective emergency thermal blanket to prevent hypothermia and shock in trauma patients.',
        fullDescription: 'Dual-surface aluminized emergency rescue foil blanket. Reflects up to 90% of body heat back to patient. Compact, lightweight, water and windproof.',
        mainImage: '/images/original/Emergency-blanket-Cederroth.jpg',
        galleryImages: [
            '/images/original/Emergency-blanket-Cederroth1.jpg'
        ],
        stockQuantity: 240,
        lowStockThreshold: 30,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Dimensions': '150 x 210 cm',
            'Material': 'Aluminized Mylar',
            'Weight': '60g'
        },
        features: [
            '90% thermal reflection',
            'Waterproof & windproof',
            'Ultra-compact fold'
        ],
        applications: [
            'Ambulances',
            'Field Operations',
            'Disaster Relief'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-5',
        name: 'Blue Dot Reusable Hot & Cold Pack | 30REUHC1',
        slug: 'blue-dot-reusable-hot-cold-pack-30reuhc1',
        sku: 'BD-30REUHC1',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 35,
        salePrice: 28,
        category: 'Physiotherapy',
        brand: 'Blue Dot',
        shortDescription: 'Flexible dual-purpose gel compress for soothing therapeutic hot or cold pain management.',
        fullDescription: 'Non-toxic therapeutic gel pack that remains flexible at freezing temperatures. Can be microwave heated for muscular aches or freezer chilled for acute sprains and swelling reduction.',
        mainImage: '/images/original/30REUHC1-_E2_80_93-REUSABLE-COLD-HOT-PACK-500x500.jpg',
        galleryImages: [
            '/images/original/30REUHC1-_E2_80_93-REUSABLE-COLD-HOT-PACK-500x500.jpg'
        ],
        stockQuantity: 180,
        lowStockThreshold: 25,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Type': 'Reusable thermal gel',
            'Size': 'Standard anatomical 13 x 28 cm',
            'Safety': 'Non-toxic gel formula'
        },
        features: [
            'Microwave & freezer safe',
            'Flexible when frozen',
            'Durable puncture-resistant exterior'
        ],
        applications: [
            'Physiotherapy Clinics',
            'Sports Medicine',
            'Post-Op Recovery'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-6',
        name: 'Haier Biomedical HYC-410 Pharmacy Refrigerator – 410L, 2–8°C',
        slug: 'haier-biomedical-hyc-410-pharmacy-refrigerator',
        sku: 'HYC-410',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 15800,
        salePrice: 14200,
        category: 'Laboratory Equipment',
        brand: 'Haier Biomedical',
        shortDescription: 'Large 410-liter clinical pharmacy refrigerator with multi-layer adjustable shelving and continuous temperature monitoring.',
        fullDescription: 'High-capacity medical refrigerator engineered for large hospitals and centralized pharmaceutical storage. Features USB data download for GMP compliance and smart forced air circulation.',
        mainImage: '/images/original/1200Wx1200H-HYC-410-USBCURB-HYC-410-USBCURB-1-20250627-500x500.jpg',
        galleryImages: [
            '/images/original/1200Wx1200H-HYC-410-USBCURB-HYC-410-USBCURB-1-20250627-500x500.jpg'
        ],
        stockQuantity: 5,
        lowStockThreshold: 1,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Capacity': '410 Liters',
            'Shelves': '5 adjustable wire shelves',
            'Display': 'LED digital display',
            'Interface': 'USB data download'
        },
        features: [
            'High-accuracy ±1°C sensor control',
            'Keyed lock for controlled pharmaceuticals',
            'Auto-defrost system'
        ],
        applications: [
            'Central Hospitals',
            'Blood Banks',
            'Pharmaceutical Warehouses'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-7',
        name: 'Blue Dot Easy Ice Instant Ice Pack | 9987',
        slug: 'blue-dot-easy-ice-instant-ice-pack-9987',
        sku: 'BD-9987',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 25,
        salePrice: 18,
        category: 'Consumables & Disposables',
        brand: 'Blue Dot',
        shortDescription: 'Single-use chemical activation instant cold pack without prior refrigeration needed.',
        fullDescription: 'Squeeze to activate instant cold pack. Reaches therapeutic cold within 3 seconds, ideal for immediate field treatment of acute sprains, bruises, and contusions.',
        mainImage: '/images/original/Blue-Dot-Easy-Ice-Instant-Ice-Pack-9987.webp',
        galleryImages: [
            '/images/original/Blue-Dot-Easy-Ice-Instant-Ice-Pack-9987.webp'
        ],
        stockQuantity: 310,
        lowStockThreshold: 50,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Activation': 'Internal water pouch burst',
            'Duration': '20-30 minutes therapeutic cold',
            'Packaging': 'Single pack'
        },
        features: [
            'No freezer required',
            'Instant activation',
            'Essential emergency supply'
        ],
        applications: [
            'Schools & Sports Clubs',
            'Construction Sites',
            'Ambulances'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-8',
        name: 'Blue Dot Heavy Duty Medium Clinical Waste Bags',
        slug: 'blue-dot-heavy-duty-medium-clinical-waste-bags',
        sku: 'BD-CLIN-BAG',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 120,
        salePrice: 95,
        category: 'Consumables & Disposables',
        brand: 'Blue Dot',
        shortDescription: 'Certified UN-approved yellow biohazard clinical waste disposal bags with star-seal bottom.',
        fullDescription: 'High-density puncture and tear resistant clinical waste bags compliant with UAE environmental and healthcare waste segregation standards. Pack of 50 heavy-duty liners.',
        mainImage: '/images/original/Heavy-Duty-Medium-Clinical-Waste-Bags-500x500.webp',
        galleryImages: [
            '/images/original/Heavy-Duty-Medium-Clinical-Waste-Bags-500x500.webp'
        ],
        stockQuantity: 150,
        lowStockThreshold: 20,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Color': 'Biohazard Yellow with black print',
            'Capacity': '50 Liters',
            'Pack Size': 'Roll of 50 bags'
        },
        features: [
            'Puncture-resistant high gauge film',
            'Leak-proof star seal bottom',
            'UN certified biohazard symbol'
        ],
        applications: [
            'Dental Clinics',
            'Laboratories',
            'Hospital Wards'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-9',
        name: 'Blue Dot Revive Aid Resuscitation Device | 30REVA01',
        slug: 'blue-dot-revive-aid-resuscitation-device-30reva01',
        sku: 'BD-30REVA01',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 55,
        salePrice: 45,
        category: 'General Medical Devices',
        brand: 'Blue Dot',
        shortDescription: 'CPR resuscitation face shield with one-way non-rebreathing valve for hygienic rescue ventilation.',
        fullDescription: 'Provides sanitary barrier protection between rescuer and patient during mouth-to-mouth resuscitation. Includes high-efficiency one-way valve with 3M bacterial filter.',
        mainImage: '/images/original/REVIVE-AID-RESUSCITATION-DEVICE-500x500.webp',
        galleryImages: [
            '/images/original/REVIVE-AID-RESUSCITATION-DEVICE1-500x500.webp'
        ],
        stockQuantity: 85,
        lowStockThreshold: 15,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Valve': 'One-way non-rebreathing valve',
            'Filter': 'Bacterial filter membrane',
            'Case': 'Compact plastic carry case'
        },
        features: [
            'Zero cross-contamination risk',
            'Clear transparent mask',
            'Fits adults and children'
        ],
        applications: [
            'First Responders',
            'Lifeguards',
            'Paramedic Kits'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    },
    {
        id: 'fom-bs-10',
        name: 'Salvequick Waterproof Plaster Strips Refill | 6036',
        slug: 'salvequick-waterproof-plaster-strips-refill-6036',
        sku: 'SALV-6036',
        productType: 'simple',
        purchaseMode: 'cart',
        regularPrice: 42,
        salePrice: 35,
        category: 'Consumables & Disposables',
        brand: 'Salvequick',
        shortDescription: 'Sterile waterproof adhesive wound plaster refill pack for clinical dispensers.',
        fullDescription: 'Salvequick 6036 refill pack contains breathable, sterile waterproof plasters that remain securely affixed during washing and clinical hand hygiene routines.',
        mainImage: '/images/original/Salvequick-Plaster-Strips-Waterproof-500x500.webp',
        galleryImages: [
            '/images/original/Salvequick-Plaster-Strips-Waterproof-500x500.webp'
        ],
        stockQuantity: 140,
        lowStockThreshold: 20,
        stockStatus: 'in_stock',
        technicalSpecs: {
            'Pack Contents': '45 assorted waterproof plasters',
            'Adhesive': 'Hypoallergenic polyacrylate'
        },
        features: [
            '100% waterproof seal',
            'Dispensers refill compatible',
            'Gentle on sensitive skin'
        ],
        applications: [
            'Clinic Stations',
            'Laboratories',
            'Surgery Suites'
        ],
        isFeatured: true,
        isBestSeller: true,
        isNew: false,
        status: "published",
        documents: [],
        tags: [
            "Medical Equipment",
            "UAE"
        ],
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-09-24T00:00:00Z'
    }
];
// 8 Healthcare Sectors We Support
const sectors = [
    {
        title: 'Hospitals',
        image: '/images/original/hospital-image-1.webp'
    },
    {
        title: 'Clinics',
        image: '/images/original/clinic-1.webp'
    },
    {
        title: 'Diagnostic Centers',
        image: '/images/original/diagnostic-centers-1.webp'
    },
    {
        title: 'Pharmacies',
        image: '/images/original/pharmacy-1.webp'
    },
    {
        title: 'Home Healthcare',
        image: '/images/original/home-healthcare-1.webp'
    },
    {
        title: 'Government Projects',
        image: '/images/original/govermnet-project-1.webp'
    },
    {
        title: 'Medical Laboratories',
        image: '/images/sectors/medical-laboratories.jpg'
    },
    {
        title: 'Rehabilitation Centers',
        image: '/images/sectors/rehabilitation-centers.jpg'
    }
];
// Brand Partners from live FastOnMed
const brands = [
    {
        name: 'Bistos America',
        image: '/images/brands/bistos.png'
    },
    {
        name: 'MIR Medical International Research',
        image: '/images/brands/mir.png'
    },
    {
        name: 'Woodpecker Dental',
        image: '/images/brands/woodpecker.png'
    },
    {
        name: 'Johari Medical',
        image: '/images/brands/johari.png'
    },
    {
        name: 'Biobase Group',
        image: '/images/brands/biobase.png'
    },
    {
        name: 'Al-Can Exports',
        image: '/images/brands/al-can.png'
    }
];
// FAQ items from live FastOnMed
const faqItems = [
    {
        q: 'Do you provide maintenance services?',
        a: 'Yes, we provide technical assistance, maintenance support, and service coordination for selected medical equipment systems.'
    },
    {
        q: 'Can I request bulk medical equipment supply?',
        a: 'Yes, we handle bulk healthcare equipment supply for hospitals, clinics, laboratories, healthcare projects, and government tenders.'
    }
];
// BeBeauty5-Style Hero Slides
const heroSlides = [
    {
        tag: 'COLD-CHAIN STORAGE',
        title: 'Precision Medical Cold Storage',
        subtitle: 'Haier Biomedical pharmacy refrigerators engineered for precise 2°C – 8°C vaccine, medicine, and clinical specimen preservation across the UAE.',
        image: '/images/original/Fridges-Pharmacy_Haier_HYC-309.png',
        lifestyleImage: '/images/original/hospital-image-1.webp',
        buttonText: 'EXPLORE REFRIGERATION',
        link: '/product/haier-biomedical-hyc-309-pharmacy-refrigerator'
    },
    {
        tag: 'SURGICAL & CLINIC CARE',
        title: 'Hospital Sterile Net Dressings',
        subtitle: 'European clinical-grade non-adherent contact dressings and sterile exudate transfer meshes designed for trauma and surgical recovery.',
        image: '/images/original/Net-dressing-CEDERROTH-1893-362x500.jpg',
        lifestyleImage: '/images/original/clinic-1.webp',
        buttonText: 'EXPLORE WOUND CARE',
        link: '/product/cederroth-sterile-net-wound-dressing-1893'
    },
    {
        tag: 'PHYSIOTHERAPY & COMPRESS',
        title: 'Dual-Action Thermal Therapy',
        subtitle: 'Flexible cryo and thermo compress therapy solutions for rehabilitation clinics, patient recovery, and hospital trauma care.',
        image: '/images/original/30REUHC1-_E2_80_93-REUSABLE-COLD-HOT-PACK-500x500.jpg',
        lifestyleImage: '/images/original/diagnostic-centers-1.webp',
        buttonText: 'EXPLORE THERAPY',
        link: '/shop'
    }
];
function HomePage(this: unknown) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [activeSlideIdx, setActiveSlideIdx] = useState(0);
    const [bestSellers, setBestSellers] = useState<Product[]>(liveBestSellers as unknown as Product[]);

    useEffect(()=>{
        let active = true;
        fetchCatalog({ limit: 10 }).then(({ products })=>{
            if (!active || products.length === 0) return;
            const featured = products.filter((product)=>product.isBestSeller || product.isFeatured);
            setBestSellers((featured.length ? featured : products).slice(0, 10));
        }).catch(()=>{});
        return ()=>{
            active = false;
        };
    }, []);
    const toggleFaq = (index: number)=>{
        setOpenFaq(openFaq === index ? null : index);
    };
    const handlePrevSlide = ()=>{
        setActiveSlideIdx((prev)=>prev === 0 ? heroSlides.length - 1 : prev - 1);
    };
    const handleNextSlide = ()=>{
        setActiveSlideIdx((prev)=>prev === heroSlides.length - 1 ? 0 : prev + 1);
    };
    const currentSlide = heroSlides[activeSlideIdx];
    return /*#__PURE__*/ jsxDEV("div", {
        style: {
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            color: '#1e293b'
        },
        children: [
            /*#__PURE__*/ jsxDEV("style", {
                children: `
        @media (max-width: 768px) {
          .home-hero-section {
            padding: 38px 0 32px !important;
          }
          .home-hero-section h1 {
            font-size: 1.85rem !important;
            line-height: 1.2 !important;
            margin-bottom: 12px !important;
          }
          .home-hero-section p {
            font-size: 0.92rem !important;
            line-height: 1.55 !important;
            margin-bottom: 22px !important;
          }
          .hero-cta-btn {
            padding: 12px 28px !important;
            font-size: 0.92rem !important;
          }
          .home-section {
            padding: 40px 0 !important;
          }
          .home-section-title {
            font-size: 1.5rem !important;
            margin-bottom: 6px !important;
          }
          .home-categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .category-item-card {
            border-radius: 12px !important;
          }
          .category-item-card .cat-img-box {
            padding: 10px !important;
          }
          .category-item-card .cat-title {
            font-size: 0.84rem !important;
            line-height: 1.3 !important;
            min-height: 2.6em !important;
          }
          .category-item-card .cat-explore {
            font-size: 0.72rem !important;
          }
          .home-who-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .home-who-img-box {
            max-width: 240px !important;
          }
          .home-products-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .home-sectors-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .sector-card {
            height: 160px !important;
          }
          .sector-card h3 {
            font-size: 1.05rem !important;
          }
          .home-brands-wrap {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 12px !important;
          }
          .brand-logo-card {
            height: 72px !important;
            padding: 10px 14px !important;
          }
          .faq-btn {
            padding: 14px 16px !important;
          }
          .faq-q {
            font-size: 0.92rem !important;
          }
          .faq-a {
            padding: 0 16px 16px !important;
            font-size: 0.88rem !important;
          }
        }
        @media (max-width: 1100px) and (min-width: 769px) {
          .home-categories-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .home-sectors-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .home-categories-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .home-sectors-grid {
            grid-template-columns: 1fr !important;
          }
          .home-brands-wrap {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .brand-logo-card {
            height: 66px !important;
            padding: 8px 12px !important;
          }
        }
        .home-brands-wrap {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 16px;
          align-items: center;
        }
        .brand-logo-card {
          background-color: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 18px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
          transition: all 0.25s ease;
          position: relative;
        }
        .brand-logo-card:hover {
          border-color: #51b291 !important;
          box-shadow: 0 10px 24px rgba(81, 178, 145, 0.2) !important;
          transform: translateY(-3px);
        }
        .brand-logo-card .brand-logo-img {
          transition: transform 0.25s ease;
        }
        .brand-logo-card:hover .brand-logo-img {
          transform: scale(1.06);
        }
        .view-all-btn:hover {
          background-color: #0f172a !important;
          color: #ffffff !important;
        }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

        .be-hero-grid {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr 1fr;
          align-items: center;
          gap: 28px;
          min-height: 520px;
        }
        .be-cta-btn {
          background-color: #51b291 !important;
          color: #ffffff !important;
          transition: all 0.25s ease;
        }
        .be-cta-btn:hover {
          background-color: #0d4d47 !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(13, 77, 71, 0.18);
        }
        .be-arrow-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #a9cec1;
          background-color: transparent;
          color: #17483f;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          outline: none;
          transition: all 0.25s ease;
        }
        .be-arrow-btn:hover {
          background-color: #0d4d47;
          border-color: #0d4d47;
          color: #ffffff;
        }
        .be-arrow-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px rgba(81, 178, 145, 0.28);
        }
        .be-checkerboard-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .be-discover-link {
          transition: transform 0.25s ease, color 0.25s ease;
        }
        .be-discover-link:hover {
          transform: translateX(4px);
        }
        .be-feature-card {
          background-color: #ffffff;
          border: 1px solid #e7e5e4;
          padding: 28px 24px;
          transition: all 0.25s ease;
        }
        .be-feature-card:hover {
          border-color: #1f7a5b;
          box-shadow: 0 10px 24px rgba(31, 122, 91, 0.08);
          transform: translateY(-2px);
        }
        @media (max-width: 1024px) {
          .be-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .be-checkerboard-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 640px) {
          .be-checkerboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 418,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                style: {
                    background: 'linear-gradient(118deg, #f7fcfa 0%, #edf8f4 58%, #e5f4ef 100%)',
                    padding: '48px 0 56px',
                    position: 'relative',
                    overflow: 'hidden',
                    borderBottom: '1px solid #d7e9e2'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: /*#__PURE__*/ jsxDEV("div", {
                        className: "be-hero-grid",
                        children: [
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    paddingRight: '12px'
                                },
                                children: [
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            marginBottom: '18px'
                                        },
                                        children: [
                                            /*#__PURE__*/ jsxDEV("span", {
                                                style: {
                                                    fontSize: '0.74rem',
                                                    fontWeight: 700,
                                                    color: '#2f8f70',
                                                    letterSpacing: '0.22em',
                                                    textTransform: 'uppercase',
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                                                },
                                                children: "FASTONMED MEDICAL"
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 655,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("span", {
                                                style: {
                                                    height: 1,
                                                    width: 32,
                                                    backgroundColor: '#9acdbb'
                                                }
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 667,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("span", {
                                                style: {
                                                    fontSize: '0.72rem',
                                                    fontWeight: 600,
                                                    color: '#66847b',
                                                    letterSpacing: '0.16em',
                                                    textTransform: 'uppercase',
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif"
                                                },
                                                children: currentSlide.tag
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 668,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 654,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("h1", {
                                        style: {
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
                                            fontWeight: 800,
                                            color: '#0f172a',
                                            lineHeight: 1.15,
                                            letterSpacing: '-0.025em',
                                            marginBottom: '20px'
                                        },
                                        children: currentSlide.title
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 682,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("p", {
                                        style: {
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontSize: '1.02rem',
                                            color: '#58716b',
                                            lineHeight: 1.68,
                                            marginBottom: '34px',
                                            maxWidth: '480px'
                                        },
                                        children: currentSlide.subtitle
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 691,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px',
                                            flexWrap: 'wrap',
                                            marginBottom: '38px'
                                        },
                                        children: [
                                            /*#__PURE__*/ jsxDEV((Link), {
                                                href: currentSlide.link,
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    backgroundColor: '#51b291',
                                                    color: '#ffffff',
                                                    padding: '16px 36px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.14em',
                                                    textTransform: 'uppercase',
                                                    textDecoration: 'none',
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                    transition: 'all 0.25s ease'
                                                },
                                                className: "be-cta-btn",
                                                children: [
                                                    /*#__PURE__*/ jsxDEV("span", {
                                                        children: currentSlide.buttonText
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 724,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ jsxDEV(ArrowRight, {
                                                        size: 15
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 725,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 705,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("a", {
                                                href: `https://wa.me/971508893589?text=${encodeURIComponent('Hello Fastonmed Sales, I would like to inquire about medical equipment.')}`,
                                                target: "_blank",
                                                rel: "noopener noreferrer",
                                                style: {
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    backgroundColor: '#ffffff',
                                                    border: '1px solid #c9dfd7',
                                                    color: '#173f3a',
                                                    padding: '15px 24px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.1em',
                                                    textTransform: 'uppercase',
                                                    textDecoration: 'none',
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                    transition: 'all 0.2s ease'
                                                },
                                                children: [
                                                    /*#__PURE__*/ jsxDEV(MessageCircle, {
                                                        size: 16,
                                                        color: "#16a34a"
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ jsxDEV("span", {
                                                        children: "WhatsApp Quote"
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 750,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 728,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 704,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '14px'
                                        },
                                        children: [
                                            /*#__PURE__*/ jsxDEV("button", {
                                                onClick: handlePrevSlide,
                                                "aria-label": "Previous slide",
                                                className: "be-arrow-btn",
                                                children: /*#__PURE__*/ jsxDEV("svg", {
                                                    width: "18",
                                                    height: "14",
                                                    viewBox: "0 0 18 14",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ jsxDEV("path", {
                                                        d: "M7 1L1 7L7 13M1 7H17",
                                                        stroke: "currentColor",
                                                        strokeWidth: "1.6",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 762,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 761,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 756,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("button", {
                                                onClick: handleNextSlide,
                                                "aria-label": "Next slide",
                                                className: "be-arrow-btn",
                                                children: /*#__PURE__*/ jsxDEV("svg", {
                                                    width: "18",
                                                    height: "14",
                                                    viewBox: "0 0 18 14",
                                                    fill: "none",
                                                    children: /*#__PURE__*/ jsxDEV("path", {
                                                        d: "M11 1L17 7L11 13M17 7H1",
                                                        stroke: "currentColor",
                                                        strokeWidth: "1.6",
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round"
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 772,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 771,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 766,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 755,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 653,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                },
                                children: [
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            width: '320px',
                                            height: '380px',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.04)',
                                            position: 'absolute'
                                        }
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 781,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            position: 'relative',
                                            width: '280px',
                                            height: '360px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            zIndex: 2
                                        },
                                        children: /*#__PURE__*/ jsxDEV(Image, {
                                            src: currentSlide.image,
                                            alt: currentSlide.title,
                                            fill: true,
                                            style: {
                                                objectFit: 'contain',
                                                padding: '16px',
                                                filter: 'drop-shadow(0 15px 25px rgba(0, 0, 0, 0.12))'
                                            },
                                            unoptimized: true,
                                            priority: true
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 801,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 790,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 779,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    position: 'relative',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end'
                                },
                                children: [
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            position: 'relative',
                                            width: '100%',
                                            height: '420px',
                                            overflow: 'hidden',
                                            backgroundColor: '#dceee8'
                                        },
                                        children: /*#__PURE__*/ jsxDEV(Image, {
                                            src: currentSlide.lifestyleImage,
                                            alt: "Clinical Technology",
                                            fill: true,
                                            style: {
                                                objectFit: 'cover'
                                            },
                                            unoptimized: true
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 823,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 814,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            position: 'absolute',
                                            left: '-24px',
                                            backgroundColor: '#ffffff',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                                            padding: '16px 14px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontFamily: 'var(--font-heading)',
                                            fontSize: '0.98rem',
                                            fontWeight: 700,
                                            letterSpacing: '0.04em',
                                            color: '#0f172a',
                                            zIndex: 3
                                        },
                                        children: [
                                            /*#__PURE__*/ jsxDEV("span", {
                                                children: String(activeSlideIdx + 1).padStart(2, '0')
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 848,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("span", {
                                                style: {
                                                    width: 16,
                                                    height: 1,
                                                    backgroundColor: '#9acdbb',
                                                    margin: '6px 0',
                                                    transform: 'rotate(-45deg)'
                                                }
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 849,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ jsxDEV("span", {
                                                style: {
                                                    color: '#66847b',
                                                    fontSize: '1rem'
                                                },
                                                children: String(heroSlides.length).padStart(2, '0')
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 850,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 833,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 813,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                        lineNumber: 651,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 650,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 641,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                style: {
                    backgroundColor: '#ffffff',
                    padding: '0'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "be-checkerboard-grid",
                    children: [
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                position: 'relative',
                                minHeight: '320px'
                            },
                            children: /*#__PURE__*/ jsxDEV(Image, {
                                src: "/images/original/clinic-1.webp",
                                alt: "Clinic",
                                fill: true,
                                style: {
                                    objectFit: 'cover'
                                },
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 862,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 861,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                backgroundColor: '#4a6755',
                                color: '#ffffff',
                                padding: '48px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minHeight: '320px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("h3", {
                                    style: {
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '-0.015em',
                                        color: '#ffffff',
                                        marginBottom: '10px',
                                        lineHeight: 1.2
                                    },
                                    children: "Cold-Chain Storage"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 877,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.92rem',
                                        color: '#d1fae5',
                                        lineHeight: 1.6,
                                        marginBottom: '24px',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    children: "Precision 2\xb0C – 8\xb0C pharmacy refrigerators with certified thermal telemetry."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 884,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV((Link), {
                                    href: "/product-category/accessories",
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    className: "be-discover-link",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("span", {
                                            children: "DISCOVER"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 903,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV(ArrowRight, {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 904,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 887,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 866,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                position: 'relative',
                                minHeight: '320px'
                            },
                            children: /*#__PURE__*/ jsxDEV(Image, {
                                src: "/images/original/hospital-image-1.webp",
                                alt: "Hospital Room",
                                fill: true,
                                style: {
                                    objectFit: 'cover'
                                },
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 910,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 909,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                backgroundColor: '#f7f4ee',
                                color: '#34252f',
                                padding: '48px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minHeight: '320px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("h3", {
                                    style: {
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '-0.015em',
                                        color: '#0f172a',
                                        marginBottom: '10px',
                                        lineHeight: 1.2
                                    },
                                    children: "Hospital Furniture"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 925,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.92rem',
                                        color: '#5b5957',
                                        lineHeight: 1.6,
                                        marginBottom: '24px',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    children: "Ergonomic ICU beds, clinical treatment furniture, and ward equipment."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 932,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV((Link), {
                                    href: "/product-category/hospital-furniture",
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#34252f',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    className: "be-discover-link",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("span", {
                                            children: "DISCOVER"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 951,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV(ArrowRight, {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 952,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 935,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 914,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                backgroundColor: '#f7f4ee',
                                color: '#34252f',
                                padding: '48px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minHeight: '320px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("h3", {
                                    style: {
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '-0.015em',
                                        color: '#0f172a',
                                        marginBottom: '10px',
                                        lineHeight: 1.2
                                    },
                                    children: "Surgical & Sterile"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 968,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.92rem',
                                        color: '#5b5957',
                                        lineHeight: 1.6,
                                        marginBottom: '24px',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    children: "European wound dressings, surgical consumables, and sterile patient supplies."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 975,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV((Link), {
                                    href: "/product-category/consumables-and-disposables",
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#34252f',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    className: "be-discover-link",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("span", {
                                            children: "DISCOVER"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 994,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV(ArrowRight, {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 995,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 978,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 957,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                position: 'relative',
                                minHeight: '320px'
                            },
                            children: /*#__PURE__*/ jsxDEV(Image, {
                                src: "/images/original/diagnostic-centers-1.webp",
                                alt: "Diagnostic Center",
                                fill: true,
                                style: {
                                    objectFit: 'cover'
                                },
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1001,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1000,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                backgroundColor: '#4a6755',
                                color: '#ffffff',
                                padding: '48px 40px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                minHeight: '320px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("h3", {
                                    style: {
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '1.75rem',
                                        fontWeight: 700,
                                        letterSpacing: '-0.015em',
                                        color: '#ffffff',
                                        marginBottom: '10px',
                                        lineHeight: 1.2
                                    },
                                    children: "Diagnostic Systems"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1016,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.92rem',
                                        color: '#d1fae5',
                                        lineHeight: 1.6,
                                        marginBottom: '24px',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    children: "Digital patient monitors, ultrasound systems, and laboratory diagnostics."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1023,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV((Link), {
                                    href: "/product-category/general-medical-devices",
                                    style: {
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#ffffff',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        letterSpacing: '0.14em',
                                        textTransform: 'uppercase',
                                        textDecoration: 'none',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    className: "be-discover-link",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("span", {
                                            children: "DISCOVER"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1042,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV(ArrowRight, {
                                            size: 14
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1043,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1026,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1005,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                position: 'relative',
                                minHeight: '320px'
                            },
                            children: /*#__PURE__*/ jsxDEV(Image, {
                                src: "/images/original/dental-chair-1.jpeg",
                                alt: "Dental Care",
                                fill: true,
                                style: {
                                    objectFit: 'cover'
                                },
                                unoptimized: true
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1049,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1048,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 859,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 858,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV(TrustBar, {}, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1055,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                style: {
                    padding: '52px 0',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #f1f5f9'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: [
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                marginBottom: '36px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("h2", {
                                    style: {
                                        fontFamily: 'var(--font-heading)',
                                        fontSize: '2.1rem',
                                        fontWeight: 800,
                                        letterSpacing: '-0.02em',
                                        color: '#0f172a',
                                        marginBottom: '8px',
                                        lineHeight: 1.2
                                    },
                                    children: "Why Healthcare Facilities Choose Fastonmed"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1061,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.94rem',
                                        color: '#78716c',
                                        fontFamily: "'Plus Jakarta Sans', sans-serif"
                                    },
                                    children: "Certified healthcare technology, regulatory compliance, and dependable medical logistics across UAE."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1068,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1060,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                gap: '20px'
                            },
                            className: "home-feature-ref-grid",
                            children: [
                                /*#__PURE__*/ jsxDEV("div", {
                                    className: "be-feature-card",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("div", {
                                            style: {
                                                width: 44,
                                                height: 44,
                                                borderRadius: '8px',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '16px'
                                            },
                                            children: /*#__PURE__*/ jsxDEV(ShieldCheck, {
                                                size: 24,
                                                color: "#1f7a5b"
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1083,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1082,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("h3", {
                                            style: {
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#1c1917',
                                                marginBottom: '8px'
                                            },
                                            children: "100% Genuine OEM Warranty"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1085,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("p", {
                                            style: {
                                                fontSize: '0.84rem',
                                                color: '#57534e',
                                                lineHeight: 1.6,
                                                margin: 0
                                            },
                                            children: "Direct factory-sourced equipment from accredited global manufacturers with official UAE warranty."
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1086,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1081,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("div", {
                                    className: "be-feature-card",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("div", {
                                            style: {
                                                width: 44,
                                                height: 44,
                                                borderRadius: '8px',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '16px'
                                            },
                                            children: /*#__PURE__*/ jsxDEV(Truck, {
                                                size: 24,
                                                color: "#1f7a5b"
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1093,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1092,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("h3", {
                                            style: {
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#1c1917',
                                                marginBottom: '8px'
                                            },
                                            children: "24–48h Nationwide Delivery"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1095,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("p", {
                                            style: {
                                                fontSize: '0.84rem',
                                                color: '#57534e',
                                                lineHeight: 1.6,
                                                margin: 0
                                            },
                                            children: "Express temperature-controlled logistics across Dubai, Abu Dhabi, and Northern Emirates."
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1096,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("div", {
                                    className: "be-feature-card",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("div", {
                                            style: {
                                                width: 44,
                                                height: 44,
                                                borderRadius: '8px',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '16px'
                                            },
                                            children: /*#__PURE__*/ jsxDEV(CheckCircle2, {
                                                size: 24,
                                                color: "#1f7a5b"
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1103,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1102,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("h3", {
                                            style: {
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#1c1917',
                                                marginBottom: '8px'
                                            },
                                            children: "MOHAP & DHA Compliant"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1105,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("p", {
                                            style: {
                                                fontSize: '0.84rem',
                                                color: '#57534e',
                                                lineHeight: 1.6,
                                                margin: 0
                                            },
                                            children: "Full medical compliance with UAE healthcare regulatory standards for hospital & clinical operations."
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1106,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1101,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("div", {
                                    className: "be-feature-card",
                                    children: [
                                        /*#__PURE__*/ jsxDEV("div", {
                                            style: {
                                                width: 44,
                                                height: 44,
                                                borderRadius: '8px',
                                                backgroundColor: '#f0fdf4',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginBottom: '16px'
                                            },
                                            children: /*#__PURE__*/ jsxDEV(Wrench, {
                                                size: 24,
                                                color: "#1f7a5b"
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1113,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1112,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("h3", {
                                            style: {
                                                fontSize: '1rem',
                                                fontWeight: 700,
                                                color: '#1c1917',
                                                marginBottom: '8px'
                                            },
                                            children: "Biomedical Technical Support"
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1115,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("p", {
                                            style: {
                                                fontSize: '0.84rem',
                                                color: '#57534e',
                                                lineHeight: 1.6,
                                                margin: 0
                                            },
                                            children: "Authorized installation, regular equipment calibration, and prompt maintenance services."
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1116,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1111,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1073,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1059,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1058,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                className: "home-section",
                style: {
                    padding: '56px 0',
                    backgroundColor: '#fcfdfd',
                    borderTop: '1px solid #f1f5f9'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: /*#__PURE__*/ jsxDEV("div", {
                        className: "home-who-grid",
                        style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '40px',
                            alignItems: 'center'
                        },
                        children: [
                            /*#__PURE__*/ jsxDEV("div", {
                                children: [
                                    /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            fontSize: '0.85rem',
                                            fontWeight: 800,
                                            textTransform: 'uppercase',
                                            color: '#51b291',
                                            letterSpacing: '0.08em',
                                            marginBottom: '6px'
                                        },
                                        children: "Who Are We"
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1138,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("h3", {
                                        style: {
                                            fontSize: '1.3rem',
                                            fontWeight: 700,
                                            color: '#64748b',
                                            marginBottom: '14px'
                                        },
                                        children: "Dubai, United Arab Emirates"
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1150,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("p", {
                                        style: {
                                            fontSize: '1rem',
                                            color: '#334155',
                                            lineHeight: 1.65,
                                            marginBottom: '22px'
                                        },
                                        children: "Faston Med is a UAE-based provider of high-quality medical and surgical equipment. We supply reliable, innovative solutions and offer professional medical equipment maintenance services. Committed to quality and service excellence, we support healthcare providers with advanced technologies that enhance patient care and clinical performance."
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1160,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV("div", {
                                        children: /*#__PURE__*/ jsxDEV((Link), {
                                            href: "/about-us",
                                            style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                backgroundColor: '#51b291',
                                                color: '#ffffff',
                                                padding: '11px 24px',
                                                borderRadius: '30px',
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                textDecoration: 'none',
                                                transition: 'all 0.2s'
                                            },
                                            children: [
                                                /*#__PURE__*/ jsxDEV("span", {
                                                    children: "Learn More About Us"
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 1188,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ jsxDEV(ArrowRight, {
                                                    size: 15
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 1189,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1172,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1171,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1137,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    display: 'flex',
                                    justifyContent: 'center'
                                },
                                children: /*#__PURE__*/ jsxDEV("div", {
                                    className: "home-who-img-box",
                                    style: {
                                        position: 'relative',
                                        width: '100%',
                                        maxWidth: '380px',
                                        aspectRatio: '1 / 1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    children: /*#__PURE__*/ jsxDEV(Image, {
                                        src: "/images/original/1181792a684142a1c53da8260c97210e-100kb-removebg-preview-100kb-1.jpeg",
                                        alt: "Fastonmed Healthcare Specialist",
                                        fill: true,
                                        style: {
                                            objectFit: 'contain'
                                        },
                                        unoptimized: true
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1196,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1195,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                        lineNumber: 1127,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1125,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                className: "home-section",
                style: {
                    padding: '60px 0',
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #f1f5f9'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: [
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                marginBottom: '32px'
                            },
                            children: /*#__PURE__*/ jsxDEV("h2", {
                                className: "home-section-title",
                                style: {
                                    fontSize: '1.85rem',
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    letterSpacing: '-0.02em',
                                    marginBottom: '8px'
                                },
                                children: "Our Best Selling Medical Equipment"
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1225,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            className: "home-products-grid",
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(185px, 1fr))',
                                gap: '14px'
                            },
                            children: bestSellers.map((product)=>/*#__PURE__*/ jsxDEV(ProductCard, {
                                    product: product
                                }, product.id, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1248,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1239,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                marginTop: '36px'
                            },
                            children: /*#__PURE__*/ jsxDEV((Link), {
                                href: "/shop",
                                style: {
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: '#ffffff',
                                    color: '#0f172a',
                                    border: '2px solid #0f172a',
                                    padding: '11px 28px',
                                    borderRadius: '30px',
                                    fontSize: '0.9rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    transition: 'all 0.2s'
                                },
                                className: "view-all-btn",
                                children: [
                                    /*#__PURE__*/ jsxDEV("span", {
                                        children: "View All Medical Equipment"
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1271,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ jsxDEV(ArrowRight, {
                                        size: 15
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1272,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1253,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1252,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1223,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                className: "home-section",
                style: {
                    padding: '60px 0',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #f1f5f9'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: [
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                marginBottom: '36px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("div", {
                                    style: {
                                        fontSize: '0.82rem',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                        color: '#51b291',
                                        letterSpacing: '0.08em',
                                        marginBottom: '6px'
                                    },
                                    children: "Who We Serve"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1282,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("h2", {
                                    className: "home-section-title",
                                    style: {
                                        fontSize: '1.85rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '10px'
                                    },
                                    children: "Healthcare Sectors We Support"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1294,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.94rem',
                                        color: '#64748b',
                                        maxWidth: '640px',
                                        margin: '0 auto'
                                    },
                                    children: "From large multi-specialty hospitals to home healthcare providers, our equipment solutions are tailored for every healthcare setting."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1281,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            className: "home-sectors-grid",
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                                gap: '18px'
                            },
                            children: sectors.map((s)=>/*#__PURE__*/ jsxDEV("div", {
                                    style: {
                                        position: 'relative',
                                        height: '210px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
                                    },
                                    className: "sector-card group",
                                    children: [
                                        /*#__PURE__*/ jsxDEV(Image, {
                                            src: s.image,
                                            alt: s.title,
                                            fill: true,
                                            style: {
                                                objectFit: 'cover',
                                                transition: 'transform 0.4s ease'
                                            },
                                            className: "sector-img",
                                            unoptimized: true
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1331,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ jsxDEV("div", {
                                            style: {
                                                position: 'absolute',
                                                inset: 0,
                                                background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.2) 60%, rgba(15, 23, 42, 0) 100%)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                padding: '18px'
                                            },
                                            children: [
                                                /*#__PURE__*/ jsxDEV("h3", {
                                                    style: {
                                                        fontSize: '1.18rem',
                                                        fontWeight: 800,
                                                        color: '#ffffff',
                                                        marginBottom: '2px'
                                                    },
                                                    children: s.title
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 1350,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ jsxDEV("span", {
                                                    style: {
                                                        fontSize: '0.8rem',
                                                        color: '#51b291',
                                                        fontWeight: 700
                                                    },
                                                    children: "Certified UAE Supply Solutions"
                                                }, void 0, false, {
                                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                    lineNumber: 1360,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1339,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, s.title, true, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1320,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1311,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1280,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1279,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                className: "home-section",
                style: {
                    padding: '64px 0',
                    backgroundColor: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: [
                        /*#__PURE__*/ jsxDEV("div", {
                            style: {
                                textAlign: 'center',
                                maxWidth: '700px',
                                margin: '0 auto 36px'
                            },
                            children: [
                                /*#__PURE__*/ jsxDEV("span", {
                                    style: {
                                        display: 'inline-block',
                                        backgroundColor: '#e6f7f0',
                                        color: '#1f7a5b',
                                        padding: '5px 14px',
                                        borderRadius: '999px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.06em',
                                        marginBottom: '10px'
                                    },
                                    children: "Authorized Global Partners"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1382,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("h2", {
                                    className: "home-section-title",
                                    style: {
                                        fontSize: '1.65rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '8px'
                                    },
                                    children: "Reliable Partner in Healthcare Infrastructure"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1398,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ jsxDEV("p", {
                                    style: {
                                        fontSize: '0.92rem',
                                        color: '#64748b',
                                        margin: 0,
                                        lineHeight: 1.5
                                    },
                                    children: "Direct procurement partnerships with certified international manufacturers ensuring genuine medical equipment across the UAE."
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1410,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1381,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ jsxDEV("div", {
                            className: "home-brands-wrap",
                            children: brands.map((b)=>/*#__PURE__*/ jsxDEV("div", {
                                    className: "brand-logo-card",
                                    title: b.name,
                                    children: /*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            position: 'relative',
                                            width: '100%',
                                            height: '100%'
                                        },
                                        children: /*#__PURE__*/ jsxDEV(Image, {
                                            src: b.image,
                                            alt: b.name,
                                            fill: true,
                                            style: {
                                                objectFit: 'contain'
                                            },
                                            className: "brand-logo-img",
                                            unoptimized: true
                                        }, void 0, false, {
                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                            lineNumber: 1423,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1422,
                                        columnNumber: 17
                                    }, this)
                                }, b.name, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1417,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                            lineNumber: 1415,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1380,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1371,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV(GoogleReviewsSection, {}, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1439,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ jsxDEV("section", {
                className: "home-section",
                style: {
                    padding: '50px 0',
                    backgroundColor: '#fcfdfd',
                    borderTop: '1px solid #f1f5f9'
                },
                children: /*#__PURE__*/ jsxDEV("div", {
                    className: "container",
                    children: /*#__PURE__*/ jsxDEV("div", {
                        style: {
                            maxWidth: '780px',
                            margin: '0 auto'
                        },
                        children: [
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    textAlign: 'center',
                                    marginBottom: '28px'
                                },
                                children: /*#__PURE__*/ jsxDEV("h2", {
                                    className: "home-section-title",
                                    style: {
                                        fontSize: '1.65rem',
                                        fontWeight: 800,
                                        color: '#0f172a',
                                        letterSpacing: '-0.02em',
                                        marginBottom: '6px'
                                    },
                                    children: "Frequently Asked Questions"
                                }, void 0, false, {
                                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                    lineNumber: 1446,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1445,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ jsxDEV("div", {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                },
                                children: faqItems.map((item, idx)=>/*#__PURE__*/ jsxDEV("div", {
                                        style: {
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #eef2f6',
                                            borderRadius: '10px',
                                            overflow: 'hidden'
                                        },
                                        children: [
                                            /*#__PURE__*/ jsxDEV("button", {
                                                onClick: ()=>toggleFaq(idx),
                                                className: "faq-btn",
                                                style: {
                                                    width: '100%',
                                                    padding: '18px 22px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'left'
                                                },
                                                children: [
                                                    /*#__PURE__*/ jsxDEV("span", {
                                                        className: "faq-q",
                                                        style: {
                                                            fontSize: '0.98rem',
                                                            fontWeight: 700,
                                                            color: '#0f172a'
                                                        },
                                                        children: item.q
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 1486,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ jsxDEV("span", {
                                                        style: {
                                                            color: '#51b291',
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        },
                                                        children: openFaq === idx ? /*#__PURE__*/ jsxDEV(ChevronUp, {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                            lineNumber: 1490,
                                                            columnNumber: 42
                                                        }, this) : /*#__PURE__*/ jsxDEV(ChevronDown, {
                                                            size: 18
                                                        }, void 0, false, {
                                                            fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                            lineNumber: 1490,
                                                            columnNumber: 68
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                        lineNumber: 1489,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1471,
                                                columnNumber: 19
                                            }, this),
                                            openFaq === idx && /*#__PURE__*/ jsxDEV("div", {
                                                className: "faq-a",
                                                style: {
                                                    padding: '0 22px 18px 22px',
                                                    color: '#475569',
                                                    fontSize: '0.92rem',
                                                    lineHeight: 1.6
                                                },
                                                children: item.a
                                            }, void 0, false, {
                                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                                lineNumber: 1494,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, item.q, true, {
                                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                        lineNumber: 1462,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                                lineNumber: 1460,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                        lineNumber: 1444,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                    lineNumber: 1443,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
                lineNumber: 1442,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/Users/saneen/Documents/Fastonmed Website/app/page.tsx",
        lineNumber: 417,
        columnNumber: 5
    }, this);
}
//# sourceURL=[module]
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9hcHAvcGFnZS50c3giLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFd0M7QUFDWDtBQUNFO0FBQzJIO0FBQ3ZHO0FBQ2tCO0FBQ3hCO0FBSTdDLDBDQUEwQztBQUMxQyxNQUFNZSxhQUFhO0lBQ2pCO1FBQUVDLE1BQU07UUFBZUMsTUFBTTtRQUFlQyxPQUFPO0lBQXNDO0lBQ3pGO1FBQUVGLE1BQU07UUFBNkJDLE1BQU07UUFBK0JDLE9BQU87SUFBc0M7SUFDdkg7UUFBRUYsTUFBTTtRQUF5QkMsTUFBTTtRQUF5QkMsT0FBTztJQUFrRTtJQUN6STtRQUFFRixNQUFNO1FBQW9CQyxNQUFNO1FBQXFCQyxPQUFPO0lBQXVDO0lBQ3JHO1FBQUVGLE1BQU07UUFBaUJDLE1BQU07UUFBa0JDLE9BQU87SUFBOEI7SUFDdEY7UUFBRUYsTUFBTTtRQUEyQkMsTUFBTTtRQUEyQkMsT0FBTztJQUE2QztJQUN4SDtRQUFFRixNQUFNO1FBQXVCQyxNQUFNO1FBQXNCQyxPQUFPO0lBQWdFO0lBQ2xJO1FBQUVGLE1BQU07UUFBd0JDLE1BQU07UUFBeUJDLE9BQU87SUFBcUM7SUFDM0c7UUFBRUYsTUFBTTtRQUF3QkMsTUFBTTtRQUF3QkMsT0FBTztJQUFnRDtJQUNySDtRQUFFRixNQUFNO1FBQTJCQyxNQUFNO1FBQTRCQyxPQUFPO0lBQXNDO0lBQ2xIO1FBQUVGLE1BQU07UUFBMkJDLE1BQU07UUFBNEJDLE9BQU87SUFBdUM7SUFDbkg7UUFBRUYsTUFBTTtRQUF1QkMsTUFBTTtRQUF3QkMsT0FBTztJQUFvQztDQUN6RztBQUVELDRDQUE0QztBQUM1QyxNQUFNQyxrQkFBNkI7SUFDakM7UUFDRUMsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBc0Q7UUFDdEVDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLFlBQVk7WUFBYyxjQUFjO1lBQWMsZUFBZTtZQUE0QixTQUFTO1FBQTZCO1FBQ3pKQyxVQUFVO1lBQUM7WUFBc0M7WUFBa0M7WUFBMEI7U0FBd0I7UUFDcklDLGNBQWM7WUFBQztZQUF1QjtZQUF1QjtZQUFnQjtTQUFVO1FBQ3ZGQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBNEQ7UUFDNUVDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLGFBQWE7WUFBaUIsaUJBQWlCO1lBQW9CLFdBQVc7UUFBMEI7UUFDMUhDLFVBQVU7WUFBQztZQUEyQjtZQUE0QjtTQUEyQjtRQUM3RkMsY0FBYztZQUFDO1lBQW1CO1lBQW1CO1NBQXFCO1FBQzFFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBZ0U7UUFDaEZDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLFFBQVE7WUFBYyxZQUFZO1lBQTJCLGFBQWE7UUFBMkI7UUFDdkhDLFVBQVU7WUFBQztZQUE0QjtZQUFzQjtTQUF5QztRQUN0R0MsY0FBYztZQUFDO1lBQXVCO1lBQXVCO1NBQWlCO1FBQzlFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBb0Q7UUFDcEVDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLGNBQWM7WUFBZ0IsWUFBWTtZQUFvQixVQUFVO1FBQU07UUFDaEdDLFVBQVU7WUFBQztZQUEwQjtZQUEwQjtTQUFxQjtRQUNwRkMsY0FBYztZQUFDO1lBQWM7WUFBb0I7U0FBa0I7UUFDbkVDLFlBQVk7UUFDWkMsY0FBYztRQUNkQyxPQUFPO1FBQ1BDLFFBQVE7UUFDUkMsV0FBVyxFQUFFO1FBQ2JDLE1BQU07WUFBQztZQUFxQjtTQUFNO1FBQ2xDQyxXQUFXO1FBQ1hDLFdBQVc7SUFDYjtJQUNBO1FBQ0V6QixJQUFJO1FBQ0pKLE1BQU07UUFDTkMsTUFBTTtRQUNOSSxLQUFLO1FBQ0xDLGFBQWE7UUFDYkMsY0FBYztRQUNkQyxjQUFjO1FBQ2RDLFdBQVc7UUFDWEMsVUFBVTtRQUNWQyxPQUFPO1FBQ1BDLGtCQUFrQjtRQUNsQkMsaUJBQWlCO1FBQ2pCQyxXQUFXO1FBQ1hDLGVBQWU7WUFBQztTQUF5RTtRQUN6RkMsZUFBZTtRQUNmQyxtQkFBbUI7UUFDbkJDLGFBQWE7UUFDYkMsZ0JBQWdCO1lBQUUsUUFBUTtZQUF3QixRQUFRO1lBQWtDLFVBQVU7UUFBd0I7UUFDOUhDLFVBQVU7WUFBQztZQUE0QjtZQUF3QjtTQUFzQztRQUNyR0MsY0FBYztZQUFDO1lBQXlCO1lBQW1CO1NBQW1CO1FBQzlFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBc0Y7UUFDdEdDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLFlBQVk7WUFBYyxXQUFXO1lBQTZCLFdBQVc7WUFBdUIsYUFBYTtRQUFvQjtRQUN2SkMsVUFBVTtZQUFDO1lBQXFDO1lBQTZDO1NBQXNCO1FBQ25IQyxjQUFjO1lBQUM7WUFBcUI7WUFBZTtTQUE0QjtRQUMvRUMsWUFBWTtRQUNaQyxjQUFjO1FBQ2RDLE9BQU87UUFDUEMsUUFBUTtRQUNSQyxXQUFXLEVBQUU7UUFDYkMsTUFBTTtZQUFDO1lBQXFCO1NBQU07UUFDbENDLFdBQVc7UUFDWEMsV0FBVztJQUNiO0lBQ0E7UUFDRXpCLElBQUk7UUFDSkosTUFBTTtRQUNOQyxNQUFNO1FBQ05JLEtBQUs7UUFDTEMsYUFBYTtRQUNiQyxjQUFjO1FBQ2RDLGNBQWM7UUFDZEMsV0FBVztRQUNYQyxVQUFVO1FBQ1ZDLE9BQU87UUFDUEMsa0JBQWtCO1FBQ2xCQyxpQkFBaUI7UUFDakJDLFdBQVc7UUFDWEMsZUFBZTtZQUFDO1NBQWdFO1FBQ2hGQyxlQUFlO1FBQ2ZDLG1CQUFtQjtRQUNuQkMsYUFBYTtRQUNiQyxnQkFBZ0I7WUFBRSxjQUFjO1lBQThCLFlBQVk7WUFBa0MsYUFBYTtRQUFjO1FBQ3ZJQyxVQUFVO1lBQUM7WUFBdUI7WUFBc0I7U0FBNkI7UUFDckZDLGNBQWM7WUFBQztZQUEwQjtZQUFzQjtTQUFhO1FBQzVFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBc0U7UUFDdEZDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLFNBQVM7WUFBcUMsWUFBWTtZQUFhLGFBQWE7UUFBa0I7UUFDeEhDLFVBQVU7WUFBQztZQUFzQztZQUErQjtTQUFnQztRQUNoSEMsY0FBYztZQUFDO1lBQWtCO1lBQWdCO1NBQWlCO1FBQ2xFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBaUU7UUFDakZDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLFNBQVM7WUFBaUMsVUFBVTtZQUE2QixRQUFRO1FBQTZCO1FBQ3hJQyxVQUFVO1lBQUM7WUFBaUM7WUFBMEI7U0FBMkI7UUFDakdDLGNBQWM7WUFBQztZQUFvQjtZQUFjO1NBQWlCO1FBQ2xFQyxZQUFZO1FBQ1pDLGNBQWM7UUFDZEMsT0FBTztRQUNQQyxRQUFRO1FBQ1JDLFdBQVcsRUFBRTtRQUNiQyxNQUFNO1lBQUM7WUFBcUI7U0FBTTtRQUNsQ0MsV0FBVztRQUNYQyxXQUFXO0lBQ2I7SUFDQTtRQUNFekIsSUFBSTtRQUNKSixNQUFNO1FBQ05DLE1BQU07UUFDTkksS0FBSztRQUNMQyxhQUFhO1FBQ2JDLGNBQWM7UUFDZEMsY0FBYztRQUNkQyxXQUFXO1FBQ1hDLFVBQVU7UUFDVkMsT0FBTztRQUNQQyxrQkFBa0I7UUFDbEJDLGlCQUFpQjtRQUNqQkMsV0FBVztRQUNYQyxlQUFlO1lBQUM7U0FBcUU7UUFDckZDLGVBQWU7UUFDZkMsbUJBQW1CO1FBQ25CQyxhQUFhO1FBQ2JDLGdCQUFnQjtZQUFFLGlCQUFpQjtZQUFtQyxZQUFZO1FBQThCO1FBQ2hIQyxVQUFVO1lBQUM7WUFBd0I7WUFBZ0M7U0FBMkI7UUFDOUZDLGNBQWM7WUFBQztZQUFtQjtZQUFnQjtTQUFpQjtRQUNuRUMsWUFBWTtRQUNaQyxjQUFjO1FBQ2RDLE9BQU87UUFDUEMsUUFBUTtRQUNSQyxXQUFXLEVBQUU7UUFDYkMsTUFBTTtZQUFDO1lBQXFCO1NBQU07UUFDbENDLFdBQVc7UUFDWEMsV0FBVztJQUNiO0NBQ0Q7QUFFRCxrQ0FBa0M7QUFDbEMsTUFBTUMsVUFBVTtJQUNkO1FBQUVDLE9BQU87UUFBYTdCLE9BQU87SUFBeUM7SUFDdEU7UUFBRTZCLE9BQU87UUFBVzdCLE9BQU87SUFBaUM7SUFDNUQ7UUFBRTZCLE9BQU87UUFBc0I3QixPQUFPO0lBQTZDO0lBQ25GO1FBQUU2QixPQUFPO1FBQWM3QixPQUFPO0lBQW1DO0lBQ2pFO1FBQUU2QixPQUFPO1FBQW1CN0IsT0FBTztJQUEwQztJQUM3RTtRQUFFNkIsT0FBTztRQUF1QjdCLE9BQU87SUFBNEM7SUFDbkY7UUFBRTZCLE9BQU87UUFBd0I3QixPQUFPO0lBQTJDO0lBQ25GO1FBQUU2QixPQUFPO1FBQTBCN0IsT0FBTztJQUE2QztDQUN4RjtBQUVELHFDQUFxQztBQUNyQyxNQUFNOEIsU0FBUztJQUNiO1FBQUVoQyxNQUFNO1FBQWtCRSxPQUFPO0lBQTRCO0lBQzdEO1FBQUVGLE1BQU07UUFBc0NFLE9BQU87SUFBeUI7SUFDOUU7UUFBRUYsTUFBTTtRQUFxQkUsT0FBTztJQUFnQztJQUNwRTtRQUFFRixNQUFNO1FBQWtCRSxPQUFPO0lBQTRCO0lBQzdEO1FBQUVGLE1BQU07UUFBaUJFLE9BQU87SUFBNkI7SUFDN0Q7UUFBRUYsTUFBTTtRQUFrQkUsT0FBTztJQUE0QjtDQUM5RDtBQUVELGdDQUFnQztBQUNoQyxNQUFNK0IsV0FBVztJQUNmO1FBQ0VDLEdBQUc7UUFDSEMsR0FBRztJQUNMO0lBQ0E7UUFDRUQsR0FBRztRQUNIQyxHQUFHO0lBQ0w7Q0FDRDtBQUVELDhCQUE4QjtBQUM5QixNQUFNQyxhQUFhO0lBQ2pCO1FBQ0VDLEtBQUs7UUFDTE4sT0FBTztRQUNQTyxVQUFVO1FBQ1ZwQyxPQUFPO1FBQ1BxQyxnQkFBZ0I7UUFDaEJDLFlBQVk7UUFDWkMsTUFBTTtJQUNSO0lBQ0E7UUFDRUosS0FBSztRQUNMTixPQUFPO1FBQ1BPLFVBQVU7UUFDVnBDLE9BQU87UUFDUHFDLGdCQUFnQjtRQUNoQkMsWUFBWTtRQUNaQyxNQUFNO0lBQ1I7SUFDQTtRQUNFSixLQUFLO1FBQ0xOLE9BQU87UUFDUE8sVUFBVTtRQUNWcEMsT0FBTztRQUNQcUMsZ0JBQWdCO1FBQ2hCQyxZQUFZO1FBQ1pDLE1BQU07SUFDUjtDQUNEO0FBRWMsU0FBU0M7SUFDdEIsTUFBTSxDQUFDQyxTQUFTQyxXQUFXLEdBQUczRCwrQ0FBUUEsQ0FBZ0I7SUFDdEQsTUFBTSxDQUFDNEQsZ0JBQWdCQyxrQkFBa0IsR0FBRzdELCtDQUFRQSxDQUFDO0lBRXJELE1BQU04RCxZQUFZLENBQUNDO1FBQ2pCSixXQUFXRCxZQUFZSyxRQUFRLE9BQU9BO0lBQ3hDO0lBRUEsTUFBTUMsa0JBQWtCO1FBQ3RCSCxrQkFBa0IsQ0FBQ0ksT0FBVUEsU0FBUyxJQUFJZCxXQUFXZSxNQUFNLEdBQUcsSUFBSUQsT0FBTztJQUMzRTtJQUVBLE1BQU1FLGtCQUFrQjtRQUN0Qk4sa0JBQWtCLENBQUNJLE9BQVVBLFNBQVNkLFdBQVdlLE1BQU0sR0FBRyxJQUFJLElBQUlELE9BQU87SUFDM0U7SUFFQSxNQUFNRyxlQUFlakIsVUFBVSxDQUFDUyxlQUFlO0lBRS9DLHFCQUNFLDhEQUFDUztRQUFJQyxPQUFPO1lBQUVDLGlCQUFpQjtZQUFXQyxXQUFXO1lBQVNDLE9BQU87UUFBVTs7MEJBQzdFLDhEQUFDSDswQkFBTyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BNE5ULENBQUM7Ozs7OzswQkFHRCw4REFBQ0k7Z0JBQ0NKLE9BQU87b0JBQ0xLLFlBQVk7b0JBQ1pDLFNBQVM7b0JBQ1RDLFVBQVU7b0JBQ1ZDLFVBQVU7b0JBQ1ZDLGNBQWM7Z0JBQ2hCOzBCQUVBLDRFQUFDVjtvQkFBSVcsV0FBVTs4QkFDYiw0RUFBQ1g7d0JBQUlXLFdBQVU7OzBDQUViLDhEQUFDWDtnQ0FBSUMsT0FBTztvQ0FBRVcsY0FBYztnQ0FBTzs7a0RBQ2pDLDhEQUFDWjt3Q0FBSUMsT0FBTzs0Q0FBRVksU0FBUzs0Q0FBUUMsWUFBWTs0Q0FBVUMsS0FBSzs0Q0FBUUMsY0FBYzt3Q0FBTzs7MERBQ3JGLDhEQUFDQztnREFDQ2hCLE9BQU87b0RBQ0xpQixVQUFVO29EQUNWQyxZQUFZO29EQUNaZixPQUFPO29EQUNQZ0IsZUFBZTtvREFDZkMsZUFBZTtvREFDZkMsWUFBWTtnREFDZDswREFDRDs7Ozs7OzBEQUdELDhEQUFDTDtnREFBS2hCLE9BQU87b0RBQUVzQixRQUFRO29EQUFHQyxPQUFPO29EQUFJdEIsaUJBQWlCO2dEQUFVOzs7Ozs7MERBQ2hFLDhEQUFDZTtnREFDQ2hCLE9BQU87b0RBQ0xpQixVQUFVO29EQUNWQyxZQUFZO29EQUNaZixPQUFPO29EQUNQZ0IsZUFBZTtvREFDZkMsZUFBZTtvREFDZkMsWUFBWTtnREFDZDswREFFQ3ZCLGFBQWFoQixHQUFHOzs7Ozs7Ozs7Ozs7a0RBSXJCLDhEQUFDMEM7d0NBQ0N4QixPQUFPOzRDQUNMcUIsWUFBWTs0Q0FBdUJKLFVBQVU7NENBQWdDQyxZQUFZOzRDQUFLZixPQUFPOzRDQUFXc0IsWUFBWTs0Q0FBTU4sZUFBZTs0Q0FDakpKLGNBQWM7d0NBQ2hCO2tEQUVDakIsYUFBYXRCLEtBQUs7Ozs7OztrREFHckIsOERBQUNrRDt3Q0FDQzFCLE9BQU87NENBQ0xxQixZQUFZOzRDQUNaSixVQUFVOzRDQUNWZCxPQUFPOzRDQUNQc0IsWUFBWTs0Q0FDWlYsY0FBYzs0Q0FDZFksVUFBVTt3Q0FDWjtrREFFQzdCLGFBQWFmLFFBQVE7Ozs7OztrREFHeEIsOERBQUNnQjt3Q0FBSUMsT0FBTzs0Q0FBRVksU0FBUzs0Q0FBUUMsWUFBWTs0Q0FBVUMsS0FBSzs0Q0FBUWMsVUFBVTs0Q0FBUWIsY0FBYzt3Q0FBTzs7MERBQ3ZHLDhEQUFDcEYsa0RBQUlBO2dEQUNIa0csTUFBTS9CLGFBQWFaLElBQUk7Z0RBQ3ZCYyxPQUFPO29EQUNMWSxTQUFTO29EQUNUQyxZQUFZO29EQUNaQyxLQUFLO29EQUNMYixpQkFBaUI7b0RBQ2pCRSxPQUFPO29EQUNQRyxTQUFTO29EQUNUVyxVQUFVO29EQUNWQyxZQUFZO29EQUNaQyxlQUFlO29EQUNmQyxlQUFlO29EQUNmVSxnQkFBZ0I7b0RBQ2hCVCxZQUFZO29EQUNaVSxZQUFZO2dEQUNkO2dEQUNBckIsV0FBVTs7a0VBRVYsOERBQUNNO2tFQUFNbEIsYUFBYWIsVUFBVTs7Ozs7O2tFQUM5Qiw4REFBQ3BELGdLQUFVQTt3REFBQ21HLE1BQU07Ozs7Ozs7Ozs7OzswREFHcEIsOERBQUNwRDtnREFDQ2lELE1BQU0sQ0FBQyxnQ0FBZ0MsRUFBRUksbUJBQW1CLDRFQUE0RTtnREFDeElDLFFBQU87Z0RBQ1BDLEtBQUk7Z0RBQ0puQyxPQUFPO29EQUNMWSxTQUFTO29EQUNUQyxZQUFZO29EQUNaQyxLQUFLO29EQUNMYixpQkFBaUI7b0RBQ2pCbUMsUUFBUTtvREFDUmpDLE9BQU87b0RBQ1BHLFNBQVM7b0RBQ1RXLFVBQVU7b0RBQ1ZDLFlBQVk7b0RBQ1pDLGVBQWU7b0RBQ2ZDLGVBQWU7b0RBQ2ZVLGdCQUFnQjtvREFDaEJULFlBQVk7b0RBQ1pVLFlBQVk7Z0RBQ2Q7O2tFQUVBLDhEQUFDL0YsZ0tBQWFBO3dEQUFDZ0csTUFBTTt3REFBSTdCLE9BQU07Ozs7OztrRUFDL0IsOERBQUNhO2tFQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0RBS1YsOERBQUNqQjt3Q0FBSUMsT0FBTzs0Q0FBRVksU0FBUzs0Q0FBUUMsWUFBWTs0Q0FBVUMsS0FBSzt3Q0FBTzs7MERBQy9ELDhEQUFDdUI7Z0RBQ0NDLFNBQVM1QztnREFDVDZDLGNBQVc7Z0RBQ1g3QixXQUFVOzBEQUVWLDRFQUFDOEI7b0RBQUlqQixPQUFNO29EQUFLRCxRQUFPO29EQUFLbUIsU0FBUTtvREFBWUMsTUFBSzs4REFDbkQsNEVBQUNDO3dEQUFLQyxHQUFFO3dEQUF1QkMsUUFBTzt3REFBZUMsYUFBWTt3REFBTUMsZUFBYzt3REFBUUMsZ0JBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7MERBSWhILDhEQUFDWDtnREFDQ0MsU0FBU3pDO2dEQUNUMEMsY0FBVztnREFDWDdCLFdBQVU7MERBRVYsNEVBQUM4QjtvREFBSWpCLE9BQU07b0RBQUtELFFBQU87b0RBQUttQixTQUFRO29EQUFZQyxNQUFLOzhEQUNuRCw0RUFBQ0M7d0RBQUtDLEdBQUU7d0RBQTBCQyxRQUFPO3dEQUFlQyxhQUFZO3dEQUFNQyxlQUFjO3dEQUFRQyxnQkFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQ0FPdkgsOERBQUNqRDtnQ0FBSUMsT0FBTztvQ0FBRU8sVUFBVTtvQ0FBWUssU0FBUztvQ0FBUUMsWUFBWTtvQ0FBVW9DLGdCQUFnQjtnQ0FBUzs7a0RBRWxHLDhEQUFDbEQ7d0NBQ0NDLE9BQU87NENBQ0x1QixPQUFPOzRDQUNQRCxRQUFROzRDQUNSckIsaUJBQWlCOzRDQUNqQmlELFdBQVc7NENBQ1gzQyxVQUFVO3dDQUNaOzs7Ozs7a0RBRUYsOERBQUNSO3dDQUNDQyxPQUFPOzRDQUNMTyxVQUFVOzRDQUNWZ0IsT0FBTzs0Q0FDUEQsUUFBUTs0Q0FDUlYsU0FBUzs0Q0FDVEMsWUFBWTs0Q0FDWm9DLGdCQUFnQjs0Q0FDaEJFLFFBQVE7d0NBQ1Y7a0RBRUEsNEVBQUN2SCxrREFBS0E7NENBQ0p3SCxLQUFLdEQsYUFBYW5ELEtBQUs7NENBQ3ZCMEcsS0FBS3ZELGFBQWF0QixLQUFLOzRDQUN2QmtFLElBQUk7NENBQ0oxQyxPQUFPO2dEQUFFc0QsV0FBVztnREFBV2hELFNBQVM7Z0RBQVFpRCxRQUFROzRDQUErQzs0Q0FDdkdDLFdBQVc7NENBQ1hDLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQU1kLDhEQUFDMUQ7Z0NBQUlDLE9BQU87b0NBQUVPLFVBQVU7b0NBQVlLLFNBQVM7b0NBQVFDLFlBQVk7b0NBQVVvQyxnQkFBZ0I7Z0NBQVc7O2tEQUNwRyw4REFBQ2xEO3dDQUNDQyxPQUFPOzRDQUNMTyxVQUFVOzRDQUNWZ0IsT0FBTzs0Q0FDUEQsUUFBUTs0Q0FDUmQsVUFBVTs0Q0FDVlAsaUJBQWlCO3dDQUNuQjtrREFFQSw0RUFBQ3JFLGtEQUFLQTs0Q0FDSndILEtBQUt0RCxhQUFhZCxjQUFjOzRDQUNoQ3FFLEtBQUk7NENBQ0pYLElBQUk7NENBQ0oxQyxPQUFPO2dEQUFFc0QsV0FBVzs0Q0FBUTs0Q0FDNUJFLFdBQVc7Ozs7Ozs7Ozs7O2tEQUtmLDhEQUFDekQ7d0NBQ0NDLE9BQU87NENBQ0xPLFVBQVU7NENBQ1ZtRCxNQUFNOzRDQUNOekQsaUJBQWlCOzRDQUNqQmlELFdBQVc7NENBQ1g1QyxTQUFTOzRDQUNUTSxTQUFTOzRDQUNUK0MsZUFBZTs0Q0FDZjlDLFlBQVk7NENBQ1pvQyxnQkFBZ0I7NENBQ2hCNUIsWUFBWTs0Q0FBdUJKLFVBQVU7NENBQVdDLFlBQVk7NENBQUtDLGVBQWU7NENBQVVoQixPQUFPOzRDQUN6R2dELFFBQVE7d0NBQ1Y7OzBEQUVBLDhEQUFDbkM7MERBQU00QyxPQUFPdEUsaUJBQWlCLEdBQUd1RSxRQUFRLENBQUMsR0FBRzs7Ozs7OzBEQUM5Qyw4REFBQzdDO2dEQUFLaEIsT0FBTztvREFBRXVCLE9BQU87b0RBQUlELFFBQVE7b0RBQUdyQixpQkFBaUI7b0RBQVc2RCxRQUFRO29EQUFTQyxXQUFXO2dEQUFpQjs7Ozs7OzBEQUM5Ryw4REFBQy9DO2dEQUFLaEIsT0FBTztvREFBRUcsT0FBTztvREFBV2MsVUFBVTtnREFBTzswREFBSTJDLE9BQU8vRSxXQUFXZSxNQUFNLEVBQUVpRSxRQUFRLENBQUMsR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFRdEcsOERBQUN6RDtnQkFBUUosT0FBTztvQkFBRUMsaUJBQWlCO29CQUFXSyxTQUFTO2dCQUFJOzBCQUN6RCw0RUFBQ1A7b0JBQUlXLFdBQVU7O3NDQUViLDhEQUFDWDs0QkFBSUMsT0FBTztnQ0FBRU8sVUFBVTtnQ0FBWUwsV0FBVzs0QkFBUTtzQ0FDckQsNEVBQUN0RSxrREFBS0E7Z0NBQUN3SCxLQUFJO2dDQUFpQ0MsS0FBSTtnQ0FBU1gsSUFBSTtnQ0FBQzFDLE9BQU87b0NBQUVzRCxXQUFXO2dDQUFRO2dDQUFHRSxXQUFXOzs7Ozs7Ozs7OztzQ0FJMUcsOERBQUN6RDs0QkFDQ0MsT0FBTztnQ0FDTEMsaUJBQWlCO2dDQUNqQkUsT0FBTztnQ0FDUEcsU0FBUztnQ0FDVE0sU0FBUztnQ0FDVCtDLGVBQWU7Z0NBQ2ZWLGdCQUFnQjtnQ0FDaEIvQyxXQUFXOzRCQUNiOzs4Q0FFQSw4REFBQzhEO29DQUNDaEUsT0FBTzt3Q0FDTHFCLFlBQVk7d0NBQXVCSixVQUFVO3dDQUFXQyxZQUFZO3dDQUFLQyxlQUFlO3dDQUFZaEIsT0FBTzt3Q0FBV1ksY0FBYzt3Q0FBUVUsWUFBWTtvQ0FDMUo7OENBQ0Q7Ozs7Ozs4Q0FHRCw4REFBQ0M7b0NBQUUxQixPQUFPO3dDQUFFaUIsVUFBVTt3Q0FBV2QsT0FBTzt3Q0FBV3NCLFlBQVk7d0NBQUtWLGNBQWM7d0NBQVFNLFlBQVk7b0NBQWtDOzhDQUFHOzs7Ozs7OENBRzNJLDhEQUFDMUYsa0RBQUlBO29DQUNIa0csTUFBSztvQ0FDTDdCLE9BQU87d0NBQ0xZLFNBQVM7d0NBQ1RDLFlBQVk7d0NBQ1pDLEtBQUs7d0NBQ0xYLE9BQU87d0NBQ1BjLFVBQVU7d0NBQ1ZDLFlBQVk7d0NBQ1pDLGVBQWU7d0NBQ2ZDLGVBQWU7d0NBQ2ZVLGdCQUFnQjt3Q0FDaEJULFlBQVk7b0NBQ2Q7b0NBQ0FYLFdBQVU7O3NEQUVWLDhEQUFDTTtzREFBSzs7Ozs7O3NEQUNOLDhEQUFDbkYsZ0tBQVVBOzRDQUFDbUcsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQUt0Qiw4REFBQ2pDOzRCQUFJQyxPQUFPO2dDQUFFTyxVQUFVO2dDQUFZTCxXQUFXOzRCQUFRO3NDQUNyRCw0RUFBQ3RFLGtEQUFLQTtnQ0FBQ3dILEtBQUk7Z0NBQXlDQyxLQUFJO2dDQUFnQlgsSUFBSTtnQ0FBQzFDLE9BQU87b0NBQUVzRCxXQUFXO2dDQUFRO2dDQUFHRSxXQUFXOzs7Ozs7Ozs7OztzQ0FJekgsOERBQUN6RDs0QkFDQ0MsT0FBTztnQ0FDTEMsaUJBQWlCO2dDQUNqQkUsT0FBTztnQ0FDUEcsU0FBUztnQ0FDVE0sU0FBUztnQ0FDVCtDLGVBQWU7Z0NBQ2ZWLGdCQUFnQjtnQ0FDaEIvQyxXQUFXOzRCQUNiOzs4Q0FFQSw4REFBQzhEO29DQUNDaEUsT0FBTzt3Q0FDTHFCLFlBQVk7d0NBQXVCSixVQUFVO3dDQUFXQyxZQUFZO3dDQUFLQyxlQUFlO3dDQUFZaEIsT0FBTzt3Q0FBV1ksY0FBYzt3Q0FBUVUsWUFBWTtvQ0FDMUo7OENBQ0Q7Ozs7Ozs4Q0FHRCw4REFBQ0M7b0NBQUUxQixPQUFPO3dDQUFFaUIsVUFBVTt3Q0FBV2QsT0FBTzt3Q0FBV3NCLFlBQVk7d0NBQUtWLGNBQWM7d0NBQVFNLFlBQVk7b0NBQWtDOzhDQUFHOzs7Ozs7OENBRzNJLDhEQUFDMUYsa0RBQUlBO29DQUNIa0csTUFBSztvQ0FDTDdCLE9BQU87d0NBQ0xZLFNBQVM7d0NBQ1RDLFlBQVk7d0NBQ1pDLEtBQUs7d0NBQ0xYLE9BQU87d0NBQ1BjLFVBQVU7d0NBQ1ZDLFlBQVk7d0NBQ1pDLGVBQWU7d0NBQ2ZDLGVBQWU7d0NBQ2ZVLGdCQUFnQjt3Q0FDaEJULFlBQVk7b0NBQ2Q7b0NBQ0FYLFdBQVU7O3NEQUVWLDhEQUFDTTtzREFBSzs7Ozs7O3NEQUNOLDhEQUFDbkYsZ0tBQVVBOzRDQUFDbUcsTUFBTTs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NDQUt0Qiw4REFBQ2pDOzRCQUNDQyxPQUFPO2dDQUNMQyxpQkFBaUI7Z0NBQ2pCRSxPQUFPO2dDQUNQRyxTQUFTO2dDQUNUTSxTQUFTO2dDQUNUK0MsZUFBZTtnQ0FDZlYsZ0JBQWdCO2dDQUNoQi9DLFdBQVc7NEJBQ2I7OzhDQUVBLDhEQUFDOEQ7b0NBQ0NoRSxPQUFPO3dDQUNMcUIsWUFBWTt3Q0FBdUJKLFVBQVU7d0NBQVdDLFlBQVk7d0NBQUtDLGVBQWU7d0NBQVloQixPQUFPO3dDQUFXWSxjQUFjO3dDQUFRVSxZQUFZO29DQUMxSjs4Q0FDRDs7Ozs7OzhDQUdELDhEQUFDQztvQ0FBRTFCLE9BQU87d0NBQUVpQixVQUFVO3dDQUFXZCxPQUFPO3dDQUFXc0IsWUFBWTt3Q0FBS1YsY0FBYzt3Q0FBUU0sWUFBWTtvQ0FBa0M7OENBQUc7Ozs7Ozs4Q0FHM0ksOERBQUMxRixrREFBSUE7b0NBQ0hrRyxNQUFLO29DQUNMN0IsT0FBTzt3Q0FDTFksU0FBUzt3Q0FDVEMsWUFBWTt3Q0FDWkMsS0FBSzt3Q0FDTFgsT0FBTzt3Q0FDUGMsVUFBVTt3Q0FDVkMsWUFBWTt3Q0FDWkMsZUFBZTt3Q0FDZkMsZUFBZTt3Q0FDZlUsZ0JBQWdCO3dDQUNoQlQsWUFBWTtvQ0FDZDtvQ0FDQVgsV0FBVTs7c0RBRVYsOERBQUNNO3NEQUFLOzs7Ozs7c0RBQ04sOERBQUNuRixnS0FBVUE7NENBQUNtRyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBS3RCLDhEQUFDakM7NEJBQUlDLE9BQU87Z0NBQUVPLFVBQVU7Z0NBQVlMLFdBQVc7NEJBQVE7c0NBQ3JELDRFQUFDdEUsa0RBQUtBO2dDQUFDd0gsS0FBSTtnQ0FBNkNDLEtBQUk7Z0NBQW9CWCxJQUFJO2dDQUFDMUMsT0FBTztvQ0FBRXNELFdBQVc7Z0NBQVE7Z0NBQUdFLFdBQVc7Ozs7Ozs7Ozs7O3NDQUlqSSw4REFBQ3pEOzRCQUNDQyxPQUFPO2dDQUNMQyxpQkFBaUI7Z0NBQ2pCRSxPQUFPO2dDQUNQRyxTQUFTO2dDQUNUTSxTQUFTO2dDQUNUK0MsZUFBZTtnQ0FDZlYsZ0JBQWdCO2dDQUNoQi9DLFdBQVc7NEJBQ2I7OzhDQUVBLDhEQUFDOEQ7b0NBQ0NoRSxPQUFPO3dDQUNMcUIsWUFBWTt3Q0FBdUJKLFVBQVU7d0NBQVdDLFlBQVk7d0NBQUtDLGVBQWU7d0NBQVloQixPQUFPO3dDQUFXWSxjQUFjO3dDQUFRVSxZQUFZO29DQUMxSjs4Q0FDRDs7Ozs7OzhDQUdELDhEQUFDQztvQ0FBRTFCLE9BQU87d0NBQUVpQixVQUFVO3dDQUFXZCxPQUFPO3dDQUFXc0IsWUFBWTt3Q0FBS1YsY0FBYzt3Q0FBUU0sWUFBWTtvQ0FBa0M7OENBQUc7Ozs7Ozs4Q0FHM0ksOERBQUMxRixrREFBSUE7b0NBQ0hrRyxNQUFLO29DQUNMN0IsT0FBTzt3Q0FDTFksU0FBUzt3Q0FDVEMsWUFBWTt3Q0FDWkMsS0FBSzt3Q0FDTFgsT0FBTzt3Q0FDUGMsVUFBVTt3Q0FDVkMsWUFBWTt3Q0FDWkMsZUFBZTt3Q0FDZkMsZUFBZTt3Q0FDZlUsZ0JBQWdCO3dDQUNoQlQsWUFBWTtvQ0FDZDtvQ0FDQVgsV0FBVTs7c0RBRVYsOERBQUNNO3NEQUFLOzs7Ozs7c0RBQ04sOERBQUNuRixnS0FBVUE7NENBQUNtRyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs7c0NBS3RCLDhEQUFDakM7NEJBQUlDLE9BQU87Z0NBQUVPLFVBQVU7Z0NBQVlMLFdBQVc7NEJBQVE7c0NBQ3JELDRFQUFDdEUsa0RBQUtBO2dDQUFDd0gsS0FBSTtnQ0FBdUNDLEtBQUk7Z0NBQWNYLElBQUk7Z0NBQUMxQyxPQUFPO29DQUFFc0QsV0FBVztnQ0FBUTtnQ0FBR0UsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFNekgsOERBQUNqSCw0REFBUUE7Ozs7OzBCQUdULDhEQUFDNkQ7Z0JBQVFKLE9BQU87b0JBQUVNLFNBQVM7b0JBQVVMLGlCQUFpQjtvQkFBV1EsY0FBYztnQkFBb0I7MEJBQ2pHLDRFQUFDVjtvQkFBSVcsV0FBVTs7c0NBQ2IsOERBQUNYOzRCQUFJQyxPQUFPO2dDQUFFaUUsV0FBVztnQ0FBVWxELGNBQWM7NEJBQU87OzhDQUN0RCw4REFBQ21EO29DQUNDbEUsT0FBTzt3Q0FDTHFCLFlBQVk7d0NBQXVCSixVQUFVO3dDQUFVQyxZQUFZO3dDQUFLQyxlQUFlO3dDQUFXaEIsT0FBTzt3Q0FBV1ksY0FBYzt3Q0FBT1UsWUFBWTtvQ0FDdko7OENBQ0Q7Ozs7Ozs4Q0FHRCw4REFBQ0M7b0NBQUUxQixPQUFPO3dDQUFFaUIsVUFBVTt3Q0FBV2QsT0FBTzt3Q0FBV2tCLFlBQVk7b0NBQWtDOzhDQUFHOzs7Ozs7Ozs7Ozs7c0NBS3RHLDhEQUFDdEI7NEJBQ0NDLE9BQU87Z0NBQ0xZLFNBQVM7Z0NBQ1R1RCxxQkFBcUI7Z0NBQ3JCckQsS0FBSzs0QkFDUDs0QkFDQUosV0FBVTs7OENBRVYsOERBQUNYO29DQUFJVyxXQUFVOztzREFDYiw4REFBQ1g7NENBQUlDLE9BQU87Z0RBQUV1QixPQUFPO2dEQUFJRCxRQUFRO2dEQUFJOEMsY0FBYztnREFBT25FLGlCQUFpQjtnREFBV1csU0FBUztnREFBUUMsWUFBWTtnREFBVW9DLGdCQUFnQjtnREFBVWxDLGNBQWM7NENBQU87c0RBQzFLLDRFQUFDN0UsZ0tBQVdBO2dEQUFDOEYsTUFBTTtnREFBSTdCLE9BQU07Ozs7Ozs7Ozs7O3NEQUUvQiw4REFBQzZEOzRDQUFHaEUsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVFDLFlBQVk7Z0RBQUtmLE9BQU87Z0RBQVdZLGNBQWM7NENBQU07c0RBQUc7Ozs7OztzREFDekYsOERBQUNXOzRDQUFFMUIsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVdkLE9BQU87Z0RBQVdzQixZQUFZO2dEQUFLcUMsUUFBUTs0Q0FBRTtzREFBRzs7Ozs7Ozs7Ozs7OzhDQUtuRiw4REFBQy9EO29DQUFJVyxXQUFVOztzREFDYiw4REFBQ1g7NENBQUlDLE9BQU87Z0RBQUV1QixPQUFPO2dEQUFJRCxRQUFRO2dEQUFJOEMsY0FBYztnREFBT25FLGlCQUFpQjtnREFBV1csU0FBUztnREFBUUMsWUFBWTtnREFBVW9DLGdCQUFnQjtnREFBVWxDLGNBQWM7NENBQU87c0RBQzFLLDRFQUFDNUUsaUtBQUtBO2dEQUFDNkYsTUFBTTtnREFBSTdCLE9BQU07Ozs7Ozs7Ozs7O3NEQUV6Qiw4REFBQzZEOzRDQUFHaEUsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVFDLFlBQVk7Z0RBQUtmLE9BQU87Z0RBQVdZLGNBQWM7NENBQU07c0RBQUc7Ozs7OztzREFDekYsOERBQUNXOzRDQUFFMUIsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVdkLE9BQU87Z0RBQVdzQixZQUFZO2dEQUFLcUMsUUFBUTs0Q0FBRTtzREFBRzs7Ozs7Ozs7Ozs7OzhDQUtuRiw4REFBQy9EO29DQUFJVyxXQUFVOztzREFDYiw4REFBQ1g7NENBQUlDLE9BQU87Z0RBQUV1QixPQUFPO2dEQUFJRCxRQUFRO2dEQUFJOEMsY0FBYztnREFBT25FLGlCQUFpQjtnREFBV1csU0FBUztnREFBUUMsWUFBWTtnREFBVW9DLGdCQUFnQjtnREFBVWxDLGNBQWM7NENBQU87c0RBQzFLLDRFQUFDOUUsaUtBQVlBO2dEQUFDK0YsTUFBTTtnREFBSTdCLE9BQU07Ozs7Ozs7Ozs7O3NEQUVoQyw4REFBQzZEOzRDQUFHaEUsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVFDLFlBQVk7Z0RBQUtmLE9BQU87Z0RBQVdZLGNBQWM7NENBQU07c0RBQUc7Ozs7OztzREFDekYsOERBQUNXOzRDQUFFMUIsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVdkLE9BQU87Z0RBQVdzQixZQUFZO2dEQUFLcUMsUUFBUTs0Q0FBRTtzREFBRzs7Ozs7Ozs7Ozs7OzhDQUtuRiw4REFBQy9EO29DQUFJVyxXQUFVOztzREFDYiw4REFBQ1g7NENBQUlDLE9BQU87Z0RBQUV1QixPQUFPO2dEQUFJRCxRQUFRO2dEQUFJOEMsY0FBYztnREFBT25FLGlCQUFpQjtnREFBV1csU0FBUztnREFBUUMsWUFBWTtnREFBVW9DLGdCQUFnQjtnREFBVWxDLGNBQWM7NENBQU87c0RBQzFLLDRFQUFDM0UsaUtBQU1BO2dEQUFDNEYsTUFBTTtnREFBSTdCLE9BQU07Ozs7Ozs7Ozs7O3NEQUUxQiw4REFBQzZEOzRDQUFHaEUsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVFDLFlBQVk7Z0RBQUtmLE9BQU87Z0RBQVdZLGNBQWM7NENBQU07c0RBQUc7Ozs7OztzREFDekYsOERBQUNXOzRDQUFFMUIsT0FBTztnREFBRWlCLFVBQVU7Z0RBQVdkLE9BQU87Z0RBQVdzQixZQUFZO2dEQUFLcUMsUUFBUTs0Q0FBRTtzREFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBU3pGLDhEQUFDMUQ7Z0JBQVFNLFdBQVU7Z0JBQWVWLE9BQU87b0JBQUVNLFNBQVM7b0JBQVVMLGlCQUFpQjtvQkFBV29FLFdBQVc7Z0JBQW9COzBCQUN2SCw0RUFBQ3RFO29CQUFJVyxXQUFVOzhCQUNiLDRFQUFDWDt3QkFDQ1csV0FBVTt3QkFDVlYsT0FBTzs0QkFDTFksU0FBUzs0QkFDVHVELHFCQUFxQjs0QkFDckJyRCxLQUFLOzRCQUNMRCxZQUFZO3dCQUNkOzswQ0FHQSw4REFBQ2Q7O2tEQUNDLDhEQUFDQTt3Q0FDQ0MsT0FBTzs0Q0FDTGlCLFVBQVU7NENBQ1ZDLFlBQVk7NENBQ1pFLGVBQWU7NENBQ2ZqQixPQUFPOzRDQUNQZ0IsZUFBZTs0Q0FDZkosY0FBYzt3Q0FDaEI7a0RBQ0Q7Ozs7OztrREFHRCw4REFBQ2lEO3dDQUNDaEUsT0FBTzs0Q0FDTGlCLFVBQVU7NENBQ1ZDLFlBQVk7NENBQ1pmLE9BQU87NENBQ1BZLGNBQWM7d0NBQ2hCO2tEQUNEOzs7Ozs7a0RBR0QsOERBQUNXO3dDQUNDMUIsT0FBTzs0Q0FDTGlCLFVBQVU7NENBQ1ZkLE9BQU87NENBQ1BzQixZQUFZOzRDQUNaVixjQUFjO3dDQUNoQjtrREFDRDs7Ozs7O2tEQUlELDhEQUFDaEI7a0RBQ0MsNEVBQUNwRSxrREFBSUE7NENBQ0hrRyxNQUFLOzRDQUNMN0IsT0FBTztnREFDTFksU0FBUztnREFDVEMsWUFBWTtnREFDWkMsS0FBSztnREFDTGIsaUJBQWlCO2dEQUNqQkUsT0FBTztnREFDUEcsU0FBUztnREFDVDhELGNBQWM7Z0RBQ2RuRCxVQUFVO2dEQUNWQyxZQUFZO2dEQUNaWSxnQkFBZ0I7Z0RBQ2hCQyxZQUFZOzRDQUNkOzs4REFFQSw4REFBQ2Y7OERBQUs7Ozs7Ozs4REFDTiw4REFBQ25GLGdLQUFVQTtvREFBQ21HLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBDQU14Qiw4REFBQ2pDO2dDQUFJQyxPQUFPO29DQUFFWSxTQUFTO29DQUFRcUMsZ0JBQWdCO2dDQUFTOzBDQUN0RCw0RUFBQ2xEO29DQUNDVyxXQUFVO29DQUNWVixPQUFPO3dDQUNMTyxVQUFVO3dDQUNWZ0IsT0FBTzt3Q0FDUEksVUFBVTt3Q0FDVjJDLGFBQWE7d0NBQ2IxRCxTQUFTO3dDQUNUQyxZQUFZO3dDQUNab0MsZ0JBQWdCO29DQUNsQjs4Q0FFQSw0RUFBQ3JILGtEQUFLQTt3Q0FDSndILEtBQUk7d0NBQ0pDLEtBQUk7d0NBQ0pYLElBQUk7d0NBQ0oxQyxPQUFPOzRDQUFFc0QsV0FBVzt3Q0FBVTt3Q0FDOUJFLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQVN2Qiw4REFBQ3BEO2dCQUFRTSxXQUFVO2dCQUFlVixPQUFPO29CQUFFTSxTQUFTO29CQUFVTCxpQkFBaUI7b0JBQVdvRSxXQUFXO2dCQUFvQjswQkFDdkgsNEVBQUN0RTtvQkFBSVcsV0FBVTs7c0NBQ2IsOERBQUNYOzRCQUFJQyxPQUFPO2dDQUFFaUUsV0FBVztnQ0FBVWxELGNBQWM7NEJBQU87c0NBQ3RELDRFQUFDbUQ7Z0NBQ0N4RCxXQUFVO2dDQUNWVixPQUFPO29DQUNMaUIsVUFBVTtvQ0FDVkMsWUFBWTtvQ0FDWmYsT0FBTztvQ0FDUGdCLGVBQWU7b0NBQ2ZKLGNBQWM7Z0NBQ2hCOzBDQUNEOzs7Ozs7Ozs7OztzQ0FLSCw4REFBQ2hCOzRCQUNDVyxXQUFVOzRCQUNWVixPQUFPO2dDQUNMWSxTQUFTO2dDQUNUdUQscUJBQXFCO2dDQUNyQnJELEtBQUs7NEJBQ1A7c0NBRUNsRSxnQkFBZ0IySCxHQUFHLENBQUNDLENBQUFBLHdCQUNuQiw4REFBQ25JLCtEQUFXQTtvQ0FBa0JtSSxTQUFTQTttQ0FBckJBLFFBQVEzSCxFQUFFOzs7Ozs7Ozs7O3NDQUloQyw4REFBQ2tEOzRCQUFJQyxPQUFPO2dDQUFFaUUsV0FBVztnQ0FBVVEsV0FBVzs0QkFBTztzQ0FDbkQsNEVBQUM5SSxrREFBSUE7Z0NBQ0hrRyxNQUFLO2dDQUNMN0IsT0FBTztvQ0FDTFksU0FBUztvQ0FDVEMsWUFBWTtvQ0FDWkMsS0FBSztvQ0FDTGIsaUJBQWlCO29DQUNqQkUsT0FBTztvQ0FDUGlDLFFBQVE7b0NBQ1I5QixTQUFTO29DQUNUOEQsY0FBYztvQ0FDZG5ELFVBQVU7b0NBQ1ZDLFlBQVk7b0NBQ1pZLGdCQUFnQjtvQ0FDaEJDLFlBQVk7Z0NBQ2Q7Z0NBQ0FyQixXQUFVOztrREFFViw4REFBQ007a0RBQUs7Ozs7OztrREFDTiw4REFBQ25GLGdLQUFVQTt3Q0FBQ21HLE1BQU07Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBTzFCLDhEQUFDNUI7Z0JBQVFNLFdBQVU7Z0JBQWVWLE9BQU87b0JBQUVNLFNBQVM7b0JBQVVMLGlCQUFpQjtvQkFBV29FLFdBQVc7Z0JBQW9COzBCQUN2SCw0RUFBQ3RFO29CQUFJVyxXQUFVOztzQ0FDYiw4REFBQ1g7NEJBQUlDLE9BQU87Z0NBQUVpRSxXQUFXO2dDQUFVbEQsY0FBYzs0QkFBTzs7OENBQ3RELDhEQUFDaEI7b0NBQ0NDLE9BQU87d0NBQ0xpQixVQUFVO3dDQUNWQyxZQUFZO3dDQUNaRSxlQUFlO3dDQUNmakIsT0FBTzt3Q0FDUGdCLGVBQWU7d0NBQ2ZKLGNBQWM7b0NBQ2hCOzhDQUNEOzs7Ozs7OENBR0QsOERBQUNtRDtvQ0FDQ3hELFdBQVU7b0NBQ1ZWLE9BQU87d0NBQ0xpQixVQUFVO3dDQUNWQyxZQUFZO3dDQUNaZixPQUFPO3dDQUNQZ0IsZUFBZTt3Q0FDZkosY0FBYztvQ0FDaEI7OENBQ0Q7Ozs7Ozs4Q0FHRCw4REFBQ1c7b0NBQUUxQixPQUFPO3dDQUFFaUIsVUFBVTt3Q0FBV2QsT0FBTzt3Q0FBV3dCLFVBQVU7d0NBQVNtQyxRQUFRO29DQUFTOzhDQUFHOzs7Ozs7Ozs7Ozs7c0NBSzVGLDhEQUFDL0Q7NEJBQ0NXLFdBQVU7NEJBQ1ZWLE9BQU87Z0NBQ0xZLFNBQVM7Z0NBQ1R1RCxxQkFBcUI7Z0NBQ3JCckQsS0FBSzs0QkFDUDtzQ0FFQ3ZDLFFBQVFnRyxHQUFHLENBQUNHLENBQUFBLGtCQUNYLDhEQUFDM0U7b0NBRUNDLE9BQU87d0NBQ0xPLFVBQVU7d0NBQ1ZlLFFBQVE7d0NBQ1I4QyxjQUFjO3dDQUNkNUQsVUFBVTt3Q0FDVjBDLFdBQVc7b0NBQ2I7b0NBQ0F4QyxXQUFVOztzREFFViw4REFBQzlFLGtEQUFLQTs0Q0FDSndILEtBQUtzQixFQUFFL0gsS0FBSzs0Q0FDWjBHLEtBQUtxQixFQUFFbEcsS0FBSzs0Q0FDWmtFLElBQUk7NENBQ0oxQyxPQUFPO2dEQUFFc0QsV0FBVztnREFBU3ZCLFlBQVk7NENBQXNCOzRDQUMvRHJCLFdBQVU7NENBQ1Y4QyxXQUFXOzs7Ozs7c0RBRWIsOERBQUN6RDs0Q0FDQ0MsT0FBTztnREFDTE8sVUFBVTtnREFDVm9FLE9BQU87Z0RBQ1B0RSxZQUFZO2dEQUNaTyxTQUFTO2dEQUNUK0MsZUFBZTtnREFDZlYsZ0JBQWdCO2dEQUNoQjNDLFNBQVM7NENBQ1g7OzhEQUVBLDhEQUFDMEQ7b0RBQ0NoRSxPQUFPO3dEQUNMaUIsVUFBVTt3REFDVkMsWUFBWTt3REFDWmYsT0FBTzt3REFDUFksY0FBYztvREFDaEI7OERBRUMyRCxFQUFFbEcsS0FBSzs7Ozs7OzhEQUVWLDhEQUFDd0M7b0RBQUtoQixPQUFPO3dEQUFFaUIsVUFBVTt3REFBVWQsT0FBTzt3REFBV2UsWUFBWTtvREFBSTs4REFBRzs7Ozs7Ozs7Ozs7OzttQ0F2Q3JFd0QsRUFBRWxHLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFrRHRCLDhEQUFDNEI7Z0JBQ0NNLFdBQVU7Z0JBQ1ZWLE9BQU87b0JBQ0xNLFNBQVM7b0JBQ1RMLGlCQUFpQjtvQkFDakJvRSxXQUFXO29CQUNYNUQsY0FBYztnQkFDaEI7MEJBRUEsNEVBQUNWO29CQUFJVyxXQUFVOztzQ0FDYiw4REFBQ1g7NEJBQUlDLE9BQU87Z0NBQUVpRSxXQUFXO2dDQUFVdEMsVUFBVTtnQ0FBU21DLFFBQVE7NEJBQWM7OzhDQUMxRSw4REFBQzlDO29DQUNDaEIsT0FBTzt3Q0FDTFksU0FBUzt3Q0FDVFgsaUJBQWlCO3dDQUNqQkUsT0FBTzt3Q0FDUEcsU0FBUzt3Q0FDVDhELGNBQWM7d0NBQ2RuRCxVQUFVO3dDQUNWQyxZQUFZO3dDQUNaRSxlQUFlO3dDQUNmRCxlQUFlO3dDQUNmSixjQUFjO29DQUNoQjs4Q0FDRDs7Ozs7OzhDQUdELDhEQUFDbUQ7b0NBQ0N4RCxXQUFVO29DQUNWVixPQUFPO3dDQUNMaUIsVUFBVTt3Q0FDVkMsWUFBWTt3Q0FDWmYsT0FBTzt3Q0FDUGdCLGVBQWU7d0NBQ2ZKLGNBQWM7b0NBQ2hCOzhDQUNEOzs7Ozs7OENBR0QsOERBQUNXO29DQUFFMUIsT0FBTzt3Q0FBRWlCLFVBQVU7d0NBQVdkLE9BQU87d0NBQVcyRCxRQUFRO3dDQUFHckMsWUFBWTtvQ0FBSTs4Q0FBRzs7Ozs7Ozs7Ozs7O3NDQUtuRiw4REFBQzFCOzRCQUFJVyxXQUFVO3NDQUNaakMsT0FBTzhGLEdBQUcsQ0FBQ0ssQ0FBQUEsa0JBQ1YsOERBQUM3RTtvQ0FFQ1csV0FBVTtvQ0FDVmxDLE9BQU9vRyxFQUFFbkksSUFBSTs4Q0FFYiw0RUFBQ3NEO3dDQUFJQyxPQUFPOzRDQUFFTyxVQUFVOzRDQUFZZ0IsT0FBTzs0Q0FBUUQsUUFBUTt3Q0FBTztrREFDaEUsNEVBQUMxRixrREFBS0E7NENBQ0p3SCxLQUFLd0IsRUFBRWpJLEtBQUs7NENBQ1owRyxLQUFLdUIsRUFBRW5JLElBQUk7NENBQ1hpRyxJQUFJOzRDQUNKMUMsT0FBTztnREFBRXNELFdBQVc7NENBQVU7NENBQzlCNUMsV0FBVTs0Q0FDVjhDLFdBQVc7Ozs7Ozs7Ozs7O21DQVhWb0IsRUFBRW5JLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkFxQnJCLDhEQUFDSCx3RUFBb0JBOzs7OzswQkFHckIsOERBQUM4RDtnQkFBUU0sV0FBVTtnQkFBZVYsT0FBTztvQkFBRU0sU0FBUztvQkFBVUwsaUJBQWlCO29CQUFXb0UsV0FBVztnQkFBb0I7MEJBQ3ZILDRFQUFDdEU7b0JBQUlXLFdBQVU7OEJBQ2IsNEVBQUNYO3dCQUFJQyxPQUFPOzRCQUFFMkIsVUFBVTs0QkFBU21DLFFBQVE7d0JBQVM7OzBDQUNoRCw4REFBQy9EO2dDQUFJQyxPQUFPO29DQUFFaUUsV0FBVztvQ0FBVWxELGNBQWM7Z0NBQU87MENBQ3RELDRFQUFDbUQ7b0NBQ0N4RCxXQUFVO29DQUNWVixPQUFPO3dDQUNMaUIsVUFBVTt3Q0FDVkMsWUFBWTt3Q0FDWmYsT0FBTzt3Q0FDUGdCLGVBQWU7d0NBQ2ZKLGNBQWM7b0NBQ2hCOzhDQUNEOzs7Ozs7Ozs7OzswQ0FLSCw4REFBQ2hCO2dDQUFJQyxPQUFPO29DQUFFWSxTQUFTO29DQUFRK0MsZUFBZTtvQ0FBVTdDLEtBQUs7Z0NBQU87MENBQ2pFcEMsU0FBUzZGLEdBQUcsQ0FBQyxDQUFDTSxNQUFNQyxvQkFDbkIsOERBQUMvRTt3Q0FFQ0MsT0FBTzs0Q0FDTEMsaUJBQWlCOzRDQUNqQm1DLFFBQVE7NENBQ1JnQyxjQUFjOzRDQUNkNUQsVUFBVTt3Q0FDWjs7MERBRUEsOERBQUM2QjtnREFDQ0MsU0FBUyxJQUFNOUMsVUFBVXNGO2dEQUN6QnBFLFdBQVU7Z0RBQ1ZWLE9BQU87b0RBQ0x1QixPQUFPO29EQUNQakIsU0FBUztvREFDVE0sU0FBUztvREFDVEMsWUFBWTtvREFDWm9DLGdCQUFnQjtvREFDaEI1QyxZQUFZO29EQUNaK0IsUUFBUTtvREFDUjJDLFFBQVE7b0RBQ1JkLFdBQVc7Z0RBQ2I7O2tFQUVBLDhEQUFDakQ7d0RBQUtOLFdBQVU7d0RBQVFWLE9BQU87NERBQUVpQixVQUFVOzREQUFXQyxZQUFZOzREQUFLZixPQUFPO3dEQUFVO2tFQUNyRjBFLEtBQUtsRyxDQUFDOzs7Ozs7a0VBRVQsOERBQUNxQzt3REFBS2hCLE9BQU87NERBQUVHLE9BQU87NERBQVdTLFNBQVM7NERBQVFDLFlBQVk7d0RBQVM7a0VBQ3BFekIsWUFBWTBGLG9CQUFNLDhEQUFDL0ksaUtBQVNBOzREQUFDaUcsTUFBTTs7Ozs7aUZBQVMsOERBQUNsRyxpS0FBV0E7NERBQUNrRyxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7Ozs0Q0FHbkU1QyxZQUFZMEYscUJBQ1gsOERBQUMvRTtnREFBSVcsV0FBVTtnREFBUVYsT0FBTztvREFBRU0sU0FBUztvREFBb0JILE9BQU87b0RBQVdjLFVBQVU7b0RBQVdRLFlBQVk7Z0RBQUk7MERBQ2pIb0QsS0FBS2pHLENBQUM7Ozs7Ozs7dUNBaENOaUcsS0FBS2xHLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEM3QiIsInNvdXJjZXMiOlsiL1VzZXJzL3NhbmVlbi9Eb2N1bWVudHMvRmFzdG9ubWVkIFdlYnNpdGUvYXBwL3BhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2UgY2xpZW50JztcblxuaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCBJbWFnZSBmcm9tICduZXh0L2ltYWdlJztcbmltcG9ydCB7IEFycm93UmlnaHQsIENoZXZyb25Eb3duLCBDaGV2cm9uVXAsIFNob3BwaW5nQmFnLCBFeWUsIEhlYXJ0LCBNZXNzYWdlQ2lyY2xlLCBDaGVja0NpcmNsZTIsIFNoaWVsZENoZWNrLCBTdGFyLCBUcnVjaywgV3JlbmNoIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcbmltcG9ydCBQcm9kdWN0Q2FyZCBmcm9tICdAL2NvbXBvbmVudHMvUHJvZHVjdENhcmQnO1xuaW1wb3J0IEdvb2dsZVJldmlld3NTZWN0aW9uIGZyb20gJ0AvY29tcG9uZW50cy9Hb29nbGVSZXZpZXdzU2VjdGlvbic7XG5pbXBvcnQgVHJ1c3RCYXIgZnJvbSAnQC9jb21wb25lbnRzL1RydXN0QmFyJztcbmltcG9ydCB7IFByb2R1Y3QgfSBmcm9tICdAL2xpYi90eXBlcyc7XG5pbXBvcnQgeyB1c2VBcHAgfSBmcm9tICdAL2xpYi9jb250ZXh0JztcblxuLy8gMTIgRXhhY3QgQ2F0ZWdvcmllcyBmcm9tIGxpdmUgRmFzdE9uTWVkXG5jb25zdCBjYXRlZ29yaWVzID0gW1xuICB7IG5hbWU6ICdBY2Nlc3NvcmllcycsIHNsdWc6ICdhY2Nlc3NvcmllcycsIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9hY2Nlc3Nvcmllcy0xLmpwZWcnIH0sXG4gIHsgbmFtZTogJ0NvbnN1bWFibGVzICYgRGlzcG9zYWJsZXMnLCBzbHVnOiAnY29uc3VtYWJsZXMtYW5kLWRpc3Bvc2FibGVzJywgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL2NvbnN1bWFibGVzLTEuanBlZycgfSxcbiAgeyBuYW1lOiAnRGVybWF0b2xvZ3kgRXF1aXBtZW50Jywgc2x1ZzogJ2Rlcm1hdG9sb2d5LWVxdWlwbWVudCcsIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9XaGF0c0FwcC1JbWFnZS0yMDI1LTA2LTI4LWF0LTE4LjI5LjM4LTEtMS5qcGVnJyB9LFxuICB7IG5hbWU6ICdEZW50YWwgRXF1aXBtZW50Jywgc2x1ZzogJ2RlbnRhbC1lcXVpcG1lbnRzJywgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL2RlbnRhbC1jaGFpci0xLmpwZWcnIH0sXG4gIHsgbmFtZTogJ0VOVCBFcXVpcG1lbnQnLCBzbHVnOiAnZW50LWVxdWlwbWVudHMnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvZW50LTEuanBlZycgfSxcbiAgeyBuYW1lOiAnR2VuZXJhbCBNZWRpY2FsIERldmljZXMnLCBzbHVnOiAnZ2VuZXJhbC1tZWRpY2FsLWRldmljZXMnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvZ2VuYXJhbC1lcXVpcG1lbnRzLTEuanBlZycgfSxcbiAgeyBuYW1lOiAnSG9zcGl0YWwgRnVybml0dXJlcycsIHNsdWc6ICdob3NwaXRhbC1mdXJuaXR1cmUnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvV2hhdHNBcHAtSW1hZ2UtMjAyNS0wNi0yOC1hdC0xOC4yOS4zNy0xLmpwZWcnIH0sXG4gIHsgbmFtZTogJ0d5bmVjb2xvZ3kgRXF1aXBtZW50Jywgc2x1ZzogJ2xhYm9yLXJvb20tZXF1aXBtZW50cycsIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9neW5vY29sb2d5LTEuanBlZycgfSxcbiAgeyBuYW1lOiAnTGFib3JhdG9yeSBFcXVpcG1lbnQnLCBzbHVnOiAnbGFib3JhdG9yeS1lcXVpcG1lbnQnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvbGFib3JvdG9yeS1lcXVpcG1lbnRzLTEuanBlZycgfSxcbiAgeyBuYW1lOiAnT3BodGhhbG1vbG9neSBFcXVpcG1lbnQnLCBzbHVnOiAnb3BodGhhbG1vbG9neS1lcXVpcG1lbnRzJywgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL29mdGhlbW9sb2d5LTEuanBlZycgfSxcbiAgeyBuYW1lOiAnUGh5c2lvdGhlcmFweSBFcXVpcG1lbnQnLCBzbHVnOiAncGh5c2lvdGhlcmFweS1lcXVpcG1lbnRzJywgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL3Boc3lvdGhlcmFweS0xLmpwZWcnIH0sXG4gIHsgbmFtZTogJ1JhZGlvbG9neSBFcXVpcG1lbnQnLCBzbHVnOiAncmFkaW9sb2d5LWVxdWlwbWVudHMnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvcmFkaW9sb2d5LTEuanBlZycgfVxuXTtcblxuLy8gMTAgRXhhY3QgQmVzdCBTZWxsZXJzIGZyb20gbGl2ZSBGYXN0T25NZWRcbmNvbnN0IGxpdmVCZXN0U2VsbGVyczogUHJvZHVjdFtdID0gW1xuICB7XG4gICAgaWQ6ICdmb20tYnMtMScsXG4gICAgbmFtZTogJ0hhaWVyIEJpb21lZGljYWwgSFlDLTMwOSBQaGFybWFjeSBSZWZyaWdlcmF0b3IgMuKAkzjCsEMsIDMwOSBMJyxcbiAgICBzbHVnOiAnaGFpZXItYmlvbWVkaWNhbC1oeWMtMzA5LXBoYXJtYWN5LXJlZnJpZ2VyYXRvcicsXG4gICAgc2t1OiAnSFlDLTMwOScsXG4gICAgcHJvZHVjdFR5cGU6ICdzaW1wbGUnLFxuICAgIHB1cmNoYXNlTW9kZTogJ2NhcnQnLFxuICAgIHJlZ3VsYXJQcmljZTogMTI1MDAsXG4gICAgc2FsZVByaWNlOiAxMDk1MCxcbiAgICBjYXRlZ29yeTogJ0xhYm9yYXRvcnkgRXF1aXBtZW50JyxcbiAgICBicmFuZDogJ0hhaWVyIEJpb21lZGljYWwnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdQaGFybWFjeSBhbmQgdmFjY2luZSByZWZyaWdlcmF0b3IgZW5naW5lZXJlZCBmb3IgcHJlY2lzZSB0ZW1wZXJhdHVyZSB1bmlmb3JtaXR5IGJldHdlZW4gMsKwQyBhbmQgOMKwQyB3aXRoIGRpZ2l0YWwgZGlzcGxheSBhbmQgYWxhcm0gc3lzdGVtcy4nLFxuICAgIGZ1bGxEZXNjcmlwdGlvbjogJ0hhaWVyIEJpb21lZGljYWwgSFlDLTMwOSBQaGFybWFjeSBSZWZyaWdlcmF0b3IgZGVsaXZlcnMgc3VwZXJpb3IgY29vbGluZyByZWxpYWJpbGl0eSBmb3IgcGhhcm1hY2V1dGljYWwgcHJvZHVjdHMsIHZhY2NpbmVzLCBiaW9sb2dpY2FscywgYW5kIHRlbXBlcmF0dXJlLXNlbnNpdGl2ZSBjbGluaWNhbCBtYXRlcmlhbHMuIEVxdWlwcGVkIHdpdGggZm9yY2VkLWFpciBjb29saW5nLCBzZWxmLWNsb3NpbmcgZ2xhc3MgZG9vciwgYW5kIG11bHRpLWFsYXJtIHNhZmV0eSBtZWNoYW5pc21zLicsXG4gICAgbWFpbkltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9GcmlkZ2VzLVBoYXJtYWN5X0hhaWVyX0hZQy0zMDkucG5nJyxcbiAgICBnYWxsZXJ5SW1hZ2VzOiBbJy9pbWFnZXMvb3JpZ2luYWwvRnJpZGdlcy1QaGFybWFjeV9IYWllcl9IWUMtMzA5LnBuZyddLFxuICAgIHN0b2NrUXVhbnRpdHk6IDgsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDIsXG4gICAgc3RvY2tTdGF0dXM6ICdpbl9zdG9jaycsXG4gICAgdGVjaG5pY2FsU3BlY3M6IHsgJ0NhcGFjaXR5JzogJzMwOSBMaXRlcnMnLCAnVGVtcCBSYW5nZSc6ICcywrBDIHRvIDjCsEMnLCAnUmVmcmlnZXJhbnQnOiAnSHlkcm9jYXJib24gRWNvLWZyaWVuZGx5JywgJ0Rvb3JzJzogJ0hlYXRlZCBnbGFzcywgc2VsZi1jbG9zaW5nJyB9LFxuICAgIGZlYXR1cmVzOiBbJ01pY3JvcHJvY2Vzc29yIHRlbXBlcmF0dXJlIGNvbnRyb2wnLCAnQXVkaWJsZSAmIHZpc3VhbCBzYWZldHkgYWxhcm1zJywgJ1VuaWZvcm0gYWlyZmxvdyBkZXNpZ24nLCAnTW9IQVAgJiBET0ggY29tcGxpYW50J10sXG4gICAgYXBwbGljYXRpb25zOiBbJ0hvc3BpdGFsIFBoYXJtYWNpZXMnLCAnVmFjY2luYXRpb24gQ2VudGVycycsICdMYWJvcmF0b3JpZXMnLCAnQ2xpbmljcyddLFxuICAgIGlzRmVhdHVyZWQ6IHRydWUsXG4gICAgaXNCZXN0U2VsbGVyOiB0cnVlLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBzdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgZG9jdW1lbnRzOiBbXSxcbiAgICB0YWdzOiBbXCJNZWRpY2FsIEVxdWlwbWVudFwiLCBcIlVBRVwiXSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA5LTAxVDAwOjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wOS0yNFQwMDowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZvbS1icy0yJyxcbiAgICBuYW1lOiAnQ2VkZXJyb3RoIFN0ZXJpbGUgTmV0IFdvdW5kIERyZXNzaW5nIHwgMTg5MycsXG4gICAgc2x1ZzogJ2NlZGVycm90aC1zdGVyaWxlLW5ldC13b3VuZC1kcmVzc2luZy0xODkzJyxcbiAgICBza3U6ICdDRUQtMTg5MycsXG4gICAgcHJvZHVjdFR5cGU6ICdzaW1wbGUnLFxuICAgIHB1cmNoYXNlTW9kZTogJ2NhcnQnLFxuICAgIHJlZ3VsYXJQcmljZTogMTg1LFxuICAgIHNhbGVQcmljZTogMTY1LFxuICAgIGNhdGVnb3J5OiAnQ29uc3VtYWJsZXMgJiBEaXNwb3NhYmxlcycsXG4gICAgYnJhbmQ6ICdDZWRlcnJvdGgnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdTdGVyaWxlIG5vbi1hZGhlcmVudCBuZXQgd291bmQgZHJlc3NpbmcgZm9yIGRpcmVjdCBhcHBsaWNhdGlvbiBvdmVyIGFjdXRlIGN1dHMsIGJ1cm5zLCBhbmQgYWJyYXNpb25zLicsXG4gICAgZnVsbERlc2NyaXB0aW9uOiAnQ2VkZXJyb3RoIDE4OTMgU3RlcmlsZSBOZXQgV291bmQgRHJlc3NpbmcgYWxsb3dzIGV4dWRhdGUgdG8gcGFzcyB0aHJvdWdoIGZyZWVseSBpbnRvIGFuIGFic29yYmVudCBzZWNvbmRhcnkgcGFkIHdoaWxlIHByZXZlbnRpbmcgZHJlc3Npbmcgc3RpY2tpbmcgdG8gZnJhZ2lsZSBuZXcgdGlzc3VlLicsXG4gICAgbWFpbkltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9OZXQtZHJlc3NpbmctQ0VERVJST1RILTE4OTMtMzYyeDUwMC5qcGcnLFxuICAgIGdhbGxlcnlJbWFnZXM6IFsnL2ltYWdlcy9vcmlnaW5hbC9OZXQtZHJlc3NpbmcyLUNFREVSUk9USC0xODkzLTUwMHg1MDAuanBnJ10sXG4gICAgc3RvY2tRdWFudGl0eTogMTIwLFxuICAgIGxvd1N0b2NrVGhyZXNob2xkOiAyMCxcbiAgICBzdG9ja1N0YXR1czogJ2luX3N0b2NrJyxcbiAgICB0ZWNobmljYWxTcGVjczogeyAnQm94IENvdW50JzogJzEwIHBpZWNlcy9ib3gnLCAnU3RlcmlsaXphdGlvbic6ICdHYW1tYSBpcnJhZGlhdGVkJywgJ1RleHR1cmUnOiAnTm9uLWFkaGVyZW50IHBvcm91cyBuZXQnIH0sXG4gICAgZmVhdHVyZXM6IFsnTm9uLXN0aWNrIGNvbnRhY3QgbGF5ZXInLCAnUGFpbmxlc3MgZHJlc3NpbmcgY2hhbmdlJywgJ0hvc3BpdGFsIGdyYWRlIHN0ZXJpbGl0eSddLFxuICAgIGFwcGxpY2F0aW9uczogWydFbWVyZ2VuY3kgUm9vbXMnLCAnQW1idWxhdG9yeSBDYXJlJywgJ0ZpcnN0IEFpZCBTdGF0aW9ucyddLFxuICAgIGlzRmVhdHVyZWQ6IHRydWUsXG4gICAgaXNCZXN0U2VsbGVyOiB0cnVlLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBzdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgZG9jdW1lbnRzOiBbXSxcbiAgICB0YWdzOiBbXCJNZWRpY2FsIEVxdWlwbWVudFwiLCBcIlVBRVwiXSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA5LTAxVDAwOjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wOS0yNFQwMDowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZvbS1icy0zJyxcbiAgICBuYW1lOiAnQ2VkZXJyb3RoIEJ1cm4gR2VsIERyZXNzaW5nIDEwIMOXIDEwIGNtIHwgOTAxOTAwJyxcbiAgICBzbHVnOiAnY2VkZXJyb3RoLWJ1cm4tZ2VsLWRyZXNzaW5nLTEweDEwLWNtLTkwMTkwMCcsXG4gICAgc2t1OiAnQ0VELTkwMTkwMCcsXG4gICAgcHJvZHVjdFR5cGU6ICdzaW1wbGUnLFxuICAgIHB1cmNoYXNlTW9kZTogJ2NhcnQnLFxuICAgIHJlZ3VsYXJQcmljZTogOTUsXG4gICAgc2FsZVByaWNlOiA4NSxcbiAgICBjYXRlZ29yeTogJ0NvbnN1bWFibGVzICYgRGlzcG9zYWJsZXMnLFxuICAgIGJyYW5kOiAnQ2VkZXJyb3RoJyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnUmFwaWQgY29vbGluZyBidXJuIGdlbCBkcmVzc2luZyBmb3IgMXN0IGFuZCAybmQtZGVncmVlIGJ1cm5zLCBzY2FsZHMsIGFuZCBzdW5idXJucy4nLFxuICAgIGZ1bGxEZXNjcmlwdGlvbjogJ1Byb3ZpZGVzIGltbWVkaWF0ZSBjb29saW5nIHBhaW4gcmVsaWVmLCBwcmV2ZW50cyBidXJuIHByb2dyZXNzaW9uIGludG8gZGVlcGVyIHRpc3N1ZSBsYXllcnMsIGFuZCBwcm90ZWN0cyBhZ2FpbnN0IGNvbnRhbWluYXRpb24gd2l0aG91dCBhZGhlcmluZyB0byBkYW1hZ2VkIHNraW4uJyxcbiAgICBtYWluSW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL0J1cm4tR2VsLURyZXNzaW5nLTEwX0MzXzk3MTAtY20tNTAweDUwMC5qcGcnLFxuICAgIGdhbGxlcnlJbWFnZXM6IFsnL2ltYWdlcy9vcmlnaW5hbC9CdXJuLUdlbC1EcmVzc2luZy0xMF9DM185NzEwLWNtMS01MDB4NTAwLmpwZyddLFxuICAgIHN0b2NrUXVhbnRpdHk6IDk1LFxuICAgIGxvd1N0b2NrVGhyZXNob2xkOiAxNSxcbiAgICBzdG9ja1N0YXR1czogJ2luX3N0b2NrJyxcbiAgICB0ZWNobmljYWxTcGVjczogeyAnU2l6ZSc6ICcxMCB4IDEwIGNtJywgJ0dlbCBCYXNlJzogJ1dhdGVyLWJhc2VkIGNvb2xpbmcgZ2VsJywgJ1BhY2thZ2luZyc6ICdJbmRpdmlkdWFsbHkgZm9pbCBzZWFsZWQnIH0sXG4gICAgZmVhdHVyZXM6IFsnSW1tZWRpYXRlIHBhaW4gcmVkdWN0aW9uJywgJ1ByZXZlbnRzIGluZmVjdGlvbicsICdOb24tdG94aWMsIHNhZmUgZm9yIGZhY2lhbCBhcHBsaWNhdGlvbiddLFxuICAgIGFwcGxpY2F0aW9uczogWydLaXRjaGVucyAmIEluZHVzdHJ5JywgJ1VyZ2VudCBDYXJlIENlbnRlcnMnLCAnRmlyc3QgQWlkIEtpdHMnXSxcbiAgICBpc0ZlYXR1cmVkOiB0cnVlLFxuICAgIGlzQmVzdFNlbGxlcjogdHJ1ZSxcbiAgICBpc05ldzogZmFsc2UsXG4gICAgc3RhdHVzOiBcInB1Ymxpc2hlZFwiLFxuICAgIGRvY3VtZW50czogW10sXG4gICAgdGFnczogW1wiTWVkaWNhbCBFcXVpcG1lbnRcIiwgXCJVQUVcIl0sXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wOS0wMVQwMDowMDowMFonLFxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDktMjRUMDA6MDA6MDBaJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdmb20tYnMtNCcsXG4gICAgbmFtZTogJ0NlZGVycm90aCBFbWVyZ2VuY3kgQmxhbmtldCB8IDE4OTInLFxuICAgIHNsdWc6ICdjZWRlcnJvdGgtZW1lcmdlbmN5LWJsYW5rZXQtMTg5MicsXG4gICAgc2t1OiAnQ0VELTE4OTInLFxuICAgIHByb2R1Y3RUeXBlOiAnc2ltcGxlJyxcbiAgICBwdXJjaGFzZU1vZGU6ICdjYXJ0JyxcbiAgICByZWd1bGFyUHJpY2U6IDQ1LFxuICAgIHNhbGVQcmljZTogMzgsXG4gICAgY2F0ZWdvcnk6ICdDb25zdW1hYmxlcyAmIERpc3Bvc2FibGVzJyxcbiAgICBicmFuZDogJ0NlZGVycm90aCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ1JlZmxlY3RpdmUgZW1lcmdlbmN5IHRoZXJtYWwgYmxhbmtldCB0byBwcmV2ZW50IGh5cG90aGVybWlhIGFuZCBzaG9jayBpbiB0cmF1bWEgcGF0aWVudHMuJyxcbiAgICBmdWxsRGVzY3JpcHRpb246ICdEdWFsLXN1cmZhY2UgYWx1bWluaXplZCBlbWVyZ2VuY3kgcmVzY3VlIGZvaWwgYmxhbmtldC4gUmVmbGVjdHMgdXAgdG8gOTAlIG9mIGJvZHkgaGVhdCBiYWNrIHRvIHBhdGllbnQuIENvbXBhY3QsIGxpZ2h0d2VpZ2h0LCB3YXRlciBhbmQgd2luZHByb29mLicsXG4gICAgbWFpbkltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9FbWVyZ2VuY3ktYmxhbmtldC1DZWRlcnJvdGguanBnJyxcbiAgICBnYWxsZXJ5SW1hZ2VzOiBbJy9pbWFnZXMvb3JpZ2luYWwvRW1lcmdlbmN5LWJsYW5rZXQtQ2VkZXJyb3RoMS5qcGcnXSxcbiAgICBzdG9ja1F1YW50aXR5OiAyNDAsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDMwLFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdEaW1lbnNpb25zJzogJzE1MCB4IDIxMCBjbScsICdNYXRlcmlhbCc6ICdBbHVtaW5pemVkIE15bGFyJywgJ1dlaWdodCc6ICc2MGcnIH0sXG4gICAgZmVhdHVyZXM6IFsnOTAlIHRoZXJtYWwgcmVmbGVjdGlvbicsICdXYXRlcnByb29mICYgd2luZHByb29mJywgJ1VsdHJhLWNvbXBhY3QgZm9sZCddLFxuICAgIGFwcGxpY2F0aW9uczogWydBbWJ1bGFuY2VzJywgJ0ZpZWxkIE9wZXJhdGlvbnMnLCAnRGlzYXN0ZXIgUmVsaWVmJ10sXG4gICAgaXNGZWF0dXJlZDogdHJ1ZSxcbiAgICBpc0Jlc3RTZWxsZXI6IHRydWUsXG4gICAgaXNOZXc6IGZhbHNlLFxuICAgIHN0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICBkb2N1bWVudHM6IFtdLFxuICAgIHRhZ3M6IFtcIk1lZGljYWwgRXF1aXBtZW50XCIsIFwiVUFFXCJdLFxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDktMDFUMDA6MDA6MDBaJyxcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA5LTI0VDAwOjAwOjAwWidcbiAgfSxcbiAge1xuICAgIGlkOiAnZm9tLWJzLTUnLFxuICAgIG5hbWU6ICdCbHVlIERvdCBSZXVzYWJsZSBIb3QgJiBDb2xkIFBhY2sgfCAzMFJFVUhDMScsXG4gICAgc2x1ZzogJ2JsdWUtZG90LXJldXNhYmxlLWhvdC1jb2xkLXBhY2stMzByZXVoYzEnLFxuICAgIHNrdTogJ0JELTMwUkVVSEMxJyxcbiAgICBwcm9kdWN0VHlwZTogJ3NpbXBsZScsXG4gICAgcHVyY2hhc2VNb2RlOiAnY2FydCcsXG4gICAgcmVndWxhclByaWNlOiAzNSxcbiAgICBzYWxlUHJpY2U6IDI4LFxuICAgIGNhdGVnb3J5OiAnUGh5c2lvdGhlcmFweScsXG4gICAgYnJhbmQ6ICdCbHVlIERvdCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ0ZsZXhpYmxlIGR1YWwtcHVycG9zZSBnZWwgY29tcHJlc3MgZm9yIHNvb3RoaW5nIHRoZXJhcGV1dGljIGhvdCBvciBjb2xkIHBhaW4gbWFuYWdlbWVudC4nLFxuICAgIGZ1bGxEZXNjcmlwdGlvbjogJ05vbi10b3hpYyB0aGVyYXBldXRpYyBnZWwgcGFjayB0aGF0IHJlbWFpbnMgZmxleGlibGUgYXQgZnJlZXppbmcgdGVtcGVyYXR1cmVzLiBDYW4gYmUgbWljcm93YXZlIGhlYXRlZCBmb3IgbXVzY3VsYXIgYWNoZXMgb3IgZnJlZXplciBjaGlsbGVkIGZvciBhY3V0ZSBzcHJhaW5zIGFuZCBzd2VsbGluZyByZWR1Y3Rpb24uJyxcbiAgICBtYWluSW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsLzMwUkVVSEMxLV9FMl84MF85My1SRVVTQUJMRS1DT0xELUhPVC1QQUNLLTUwMHg1MDAuanBnJyxcbiAgICBnYWxsZXJ5SW1hZ2VzOiBbJy9pbWFnZXMvb3JpZ2luYWwvMzBSRVVIQzEtX0UyXzgwXzkzLVJFVVNBQkxFLUNPTEQtSE9ULVBBQ0stNTAweDUwMC5qcGcnXSxcbiAgICBzdG9ja1F1YW50aXR5OiAxODAsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDI1LFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdUeXBlJzogJ1JldXNhYmxlIHRoZXJtYWwgZ2VsJywgJ1NpemUnOiAnU3RhbmRhcmQgYW5hdG9taWNhbCAxMyB4IDI4IGNtJywgJ1NhZmV0eSc6ICdOb24tdG94aWMgZ2VsIGZvcm11bGEnIH0sXG4gICAgZmVhdHVyZXM6IFsnTWljcm93YXZlICYgZnJlZXplciBzYWZlJywgJ0ZsZXhpYmxlIHdoZW4gZnJvemVuJywgJ0R1cmFibGUgcHVuY3R1cmUtcmVzaXN0YW50IGV4dGVyaW9yJ10sXG4gICAgYXBwbGljYXRpb25zOiBbJ1BoeXNpb3RoZXJhcHkgQ2xpbmljcycsICdTcG9ydHMgTWVkaWNpbmUnLCAnUG9zdC1PcCBSZWNvdmVyeSddLFxuICAgIGlzRmVhdHVyZWQ6IHRydWUsXG4gICAgaXNCZXN0U2VsbGVyOiB0cnVlLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBzdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgZG9jdW1lbnRzOiBbXSxcbiAgICB0YWdzOiBbXCJNZWRpY2FsIEVxdWlwbWVudFwiLCBcIlVBRVwiXSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA5LTAxVDAwOjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wOS0yNFQwMDowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZvbS1icy02JyxcbiAgICBuYW1lOiAnSGFpZXIgQmlvbWVkaWNhbCBIWUMtNDEwIFBoYXJtYWN5IFJlZnJpZ2VyYXRvciDigJMgNDEwTCwgMuKAkzjCsEMnLFxuICAgIHNsdWc6ICdoYWllci1iaW9tZWRpY2FsLWh5Yy00MTAtcGhhcm1hY3ktcmVmcmlnZXJhdG9yJyxcbiAgICBza3U6ICdIWUMtNDEwJyxcbiAgICBwcm9kdWN0VHlwZTogJ3NpbXBsZScsXG4gICAgcHVyY2hhc2VNb2RlOiAnY2FydCcsXG4gICAgcmVndWxhclByaWNlOiAxNTgwMCxcbiAgICBzYWxlUHJpY2U6IDE0MjAwLFxuICAgIGNhdGVnb3J5OiAnTGFib3JhdG9yeSBFcXVpcG1lbnQnLFxuICAgIGJyYW5kOiAnSGFpZXIgQmlvbWVkaWNhbCcsXG4gICAgc2hvcnREZXNjcmlwdGlvbjogJ0xhcmdlIDQxMC1saXRlciBjbGluaWNhbCBwaGFybWFjeSByZWZyaWdlcmF0b3Igd2l0aCBtdWx0aS1sYXllciBhZGp1c3RhYmxlIHNoZWx2aW5nIGFuZCBjb250aW51b3VzIHRlbXBlcmF0dXJlIG1vbml0b3JpbmcuJyxcbiAgICBmdWxsRGVzY3JpcHRpb246ICdIaWdoLWNhcGFjaXR5IG1lZGljYWwgcmVmcmlnZXJhdG9yIGVuZ2luZWVyZWQgZm9yIGxhcmdlIGhvc3BpdGFscyBhbmQgY2VudHJhbGl6ZWQgcGhhcm1hY2V1dGljYWwgc3RvcmFnZS4gRmVhdHVyZXMgVVNCIGRhdGEgZG93bmxvYWQgZm9yIEdNUCBjb21wbGlhbmNlIGFuZCBzbWFydCBmb3JjZWQgYWlyIGNpcmN1bGF0aW9uLicsXG4gICAgbWFpbkltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC8xMjAwV3gxMjAwSC1IWUMtNDEwLVVTQkNVUkItSFlDLTQxMC1VU0JDVVJCLTEtMjAyNTA2MjctNTAweDUwMC5qcGcnLFxuICAgIGdhbGxlcnlJbWFnZXM6IFsnL2ltYWdlcy9vcmlnaW5hbC8xMjAwV3gxMjAwSC1IWUMtNDEwLVVTQkNVUkItSFlDLTQxMC1VU0JDVVJCLTEtMjAyNTA2MjctNTAweDUwMC5qcGcnXSxcbiAgICBzdG9ja1F1YW50aXR5OiA1LFxuICAgIGxvd1N0b2NrVGhyZXNob2xkOiAxLFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdDYXBhY2l0eSc6ICc0MTAgTGl0ZXJzJywgJ1NoZWx2ZXMnOiAnNSBhZGp1c3RhYmxlIHdpcmUgc2hlbHZlcycsICdEaXNwbGF5JzogJ0xFRCBkaWdpdGFsIGRpc3BsYXknLCAnSW50ZXJmYWNlJzogJ1VTQiBkYXRhIGRvd25sb2FkJyB9LFxuICAgIGZlYXR1cmVzOiBbJ0hpZ2gtYWNjdXJhY3kgwrExwrBDIHNlbnNvciBjb250cm9sJywgJ0tleWVkIGxvY2sgZm9yIGNvbnRyb2xsZWQgcGhhcm1hY2V1dGljYWxzJywgJ0F1dG8tZGVmcm9zdCBzeXN0ZW0nXSxcbiAgICBhcHBsaWNhdGlvbnM6IFsnQ2VudHJhbCBIb3NwaXRhbHMnLCAnQmxvb2QgQmFua3MnLCAnUGhhcm1hY2V1dGljYWwgV2FyZWhvdXNlcyddLFxuICAgIGlzRmVhdHVyZWQ6IHRydWUsXG4gICAgaXNCZXN0U2VsbGVyOiB0cnVlLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBzdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgZG9jdW1lbnRzOiBbXSxcbiAgICB0YWdzOiBbXCJNZWRpY2FsIEVxdWlwbWVudFwiLCBcIlVBRVwiXSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA5LTAxVDAwOjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wOS0yNFQwMDowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZvbS1icy03JyxcbiAgICBuYW1lOiAnQmx1ZSBEb3QgRWFzeSBJY2UgSW5zdGFudCBJY2UgUGFjayB8IDk5ODcnLFxuICAgIHNsdWc6ICdibHVlLWRvdC1lYXN5LWljZS1pbnN0YW50LWljZS1wYWNrLTk5ODcnLFxuICAgIHNrdTogJ0JELTk5ODcnLFxuICAgIHByb2R1Y3RUeXBlOiAnc2ltcGxlJyxcbiAgICBwdXJjaGFzZU1vZGU6ICdjYXJ0JyxcbiAgICByZWd1bGFyUHJpY2U6IDI1LFxuICAgIHNhbGVQcmljZTogMTgsXG4gICAgY2F0ZWdvcnk6ICdDb25zdW1hYmxlcyAmIERpc3Bvc2FibGVzJyxcbiAgICBicmFuZDogJ0JsdWUgRG90JyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnU2luZ2xlLXVzZSBjaGVtaWNhbCBhY3RpdmF0aW9uIGluc3RhbnQgY29sZCBwYWNrIHdpdGhvdXQgcHJpb3IgcmVmcmlnZXJhdGlvbiBuZWVkZWQuJyxcbiAgICBmdWxsRGVzY3JpcHRpb246ICdTcXVlZXplIHRvIGFjdGl2YXRlIGluc3RhbnQgY29sZCBwYWNrLiBSZWFjaGVzIHRoZXJhcGV1dGljIGNvbGQgd2l0aGluIDMgc2Vjb25kcywgaWRlYWwgZm9yIGltbWVkaWF0ZSBmaWVsZCB0cmVhdG1lbnQgb2YgYWN1dGUgc3ByYWlucywgYnJ1aXNlcywgYW5kIGNvbnR1c2lvbnMuJyxcbiAgICBtYWluSW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL0JsdWUtRG90LUVhc3ktSWNlLUluc3RhbnQtSWNlLVBhY2stOTk4Ny53ZWJwJyxcbiAgICBnYWxsZXJ5SW1hZ2VzOiBbJy9pbWFnZXMvb3JpZ2luYWwvQmx1ZS1Eb3QtRWFzeS1JY2UtSW5zdGFudC1JY2UtUGFjay05OTg3LndlYnAnXSxcbiAgICBzdG9ja1F1YW50aXR5OiAzMTAsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDUwLFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdBY3RpdmF0aW9uJzogJ0ludGVybmFsIHdhdGVyIHBvdWNoIGJ1cnN0JywgJ0R1cmF0aW9uJzogJzIwLTMwIG1pbnV0ZXMgdGhlcmFwZXV0aWMgY29sZCcsICdQYWNrYWdpbmcnOiAnU2luZ2xlIHBhY2snIH0sXG4gICAgZmVhdHVyZXM6IFsnTm8gZnJlZXplciByZXF1aXJlZCcsICdJbnN0YW50IGFjdGl2YXRpb24nLCAnRXNzZW50aWFsIGVtZXJnZW5jeSBzdXBwbHknXSxcbiAgICBhcHBsaWNhdGlvbnM6IFsnU2Nob29scyAmIFNwb3J0cyBDbHVicycsICdDb25zdHJ1Y3Rpb24gU2l0ZXMnLCAnQW1idWxhbmNlcyddLFxuICAgIGlzRmVhdHVyZWQ6IHRydWUsXG4gICAgaXNCZXN0U2VsbGVyOiB0cnVlLFxuICAgIGlzTmV3OiBmYWxzZSxcbiAgICBzdGF0dXM6IFwicHVibGlzaGVkXCIsXG4gICAgZG9jdW1lbnRzOiBbXSxcbiAgICB0YWdzOiBbXCJNZWRpY2FsIEVxdWlwbWVudFwiLCBcIlVBRVwiXSxcbiAgICBjcmVhdGVkQXQ6ICcyMDI2LTA5LTAxVDAwOjAwOjAwWicsXG4gICAgdXBkYXRlZEF0OiAnMjAyNi0wOS0yNFQwMDowMDowMFonXG4gIH0sXG4gIHtcbiAgICBpZDogJ2ZvbS1icy04JyxcbiAgICBuYW1lOiAnQmx1ZSBEb3QgSGVhdnkgRHV0eSBNZWRpdW0gQ2xpbmljYWwgV2FzdGUgQmFncycsXG4gICAgc2x1ZzogJ2JsdWUtZG90LWhlYXZ5LWR1dHktbWVkaXVtLWNsaW5pY2FsLXdhc3RlLWJhZ3MnLFxuICAgIHNrdTogJ0JELUNMSU4tQkFHJyxcbiAgICBwcm9kdWN0VHlwZTogJ3NpbXBsZScsXG4gICAgcHVyY2hhc2VNb2RlOiAnY2FydCcsXG4gICAgcmVndWxhclByaWNlOiAxMjAsXG4gICAgc2FsZVByaWNlOiA5NSxcbiAgICBjYXRlZ29yeTogJ0NvbnN1bWFibGVzICYgRGlzcG9zYWJsZXMnLFxuICAgIGJyYW5kOiAnQmx1ZSBEb3QnLFxuICAgIHNob3J0RGVzY3JpcHRpb246ICdDZXJ0aWZpZWQgVU4tYXBwcm92ZWQgeWVsbG93IGJpb2hhemFyZCBjbGluaWNhbCB3YXN0ZSBkaXNwb3NhbCBiYWdzIHdpdGggc3Rhci1zZWFsIGJvdHRvbS4nLFxuICAgIGZ1bGxEZXNjcmlwdGlvbjogJ0hpZ2gtZGVuc2l0eSBwdW5jdHVyZSBhbmQgdGVhciByZXNpc3RhbnQgY2xpbmljYWwgd2FzdGUgYmFncyBjb21wbGlhbnQgd2l0aCBVQUUgZW52aXJvbm1lbnRhbCBhbmQgaGVhbHRoY2FyZSB3YXN0ZSBzZWdyZWdhdGlvbiBzdGFuZGFyZHMuIFBhY2sgb2YgNTAgaGVhdnktZHV0eSBsaW5lcnMuJyxcbiAgICBtYWluSW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL0hlYXZ5LUR1dHktTWVkaXVtLUNsaW5pY2FsLVdhc3RlLUJhZ3MtNTAweDUwMC53ZWJwJyxcbiAgICBnYWxsZXJ5SW1hZ2VzOiBbJy9pbWFnZXMvb3JpZ2luYWwvSGVhdnktRHV0eS1NZWRpdW0tQ2xpbmljYWwtV2FzdGUtQmFncy01MDB4NTAwLndlYnAnXSxcbiAgICBzdG9ja1F1YW50aXR5OiAxNTAsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDIwLFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdDb2xvcic6ICdCaW9oYXphcmQgWWVsbG93IHdpdGggYmxhY2sgcHJpbnQnLCAnQ2FwYWNpdHknOiAnNTAgTGl0ZXJzJywgJ1BhY2sgU2l6ZSc6ICdSb2xsIG9mIDUwIGJhZ3MnIH0sXG4gICAgZmVhdHVyZXM6IFsnUHVuY3R1cmUtcmVzaXN0YW50IGhpZ2ggZ2F1Z2UgZmlsbScsICdMZWFrLXByb29mIHN0YXIgc2VhbCBib3R0b20nLCAnVU4gY2VydGlmaWVkIGJpb2hhemFyZCBzeW1ib2wnXSxcbiAgICBhcHBsaWNhdGlvbnM6IFsnRGVudGFsIENsaW5pY3MnLCAnTGFib3JhdG9yaWVzJywgJ0hvc3BpdGFsIFdhcmRzJ10sXG4gICAgaXNGZWF0dXJlZDogdHJ1ZSxcbiAgICBpc0Jlc3RTZWxsZXI6IHRydWUsXG4gICAgaXNOZXc6IGZhbHNlLFxuICAgIHN0YXR1czogXCJwdWJsaXNoZWRcIixcbiAgICBkb2N1bWVudHM6IFtdLFxuICAgIHRhZ3M6IFtcIk1lZGljYWwgRXF1aXBtZW50XCIsIFwiVUFFXCJdLFxuICAgIGNyZWF0ZWRBdDogJzIwMjYtMDktMDFUMDA6MDA6MDBaJyxcbiAgICB1cGRhdGVkQXQ6ICcyMDI2LTA5LTI0VDAwOjAwOjAwWidcbiAgfSxcbiAge1xuICAgIGlkOiAnZm9tLWJzLTknLFxuICAgIG5hbWU6ICdCbHVlIERvdCBSZXZpdmUgQWlkIFJlc3VzY2l0YXRpb24gRGV2aWNlIHwgMzBSRVZBMDEnLFxuICAgIHNsdWc6ICdibHVlLWRvdC1yZXZpdmUtYWlkLXJlc3VzY2l0YXRpb24tZGV2aWNlLTMwcmV2YTAxJyxcbiAgICBza3U6ICdCRC0zMFJFVkEwMScsXG4gICAgcHJvZHVjdFR5cGU6ICdzaW1wbGUnLFxuICAgIHB1cmNoYXNlTW9kZTogJ2NhcnQnLFxuICAgIHJlZ3VsYXJQcmljZTogNTUsXG4gICAgc2FsZVByaWNlOiA0NSxcbiAgICBjYXRlZ29yeTogJ0dlbmVyYWwgTWVkaWNhbCBEZXZpY2VzJyxcbiAgICBicmFuZDogJ0JsdWUgRG90JyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnQ1BSIHJlc3VzY2l0YXRpb24gZmFjZSBzaGllbGQgd2l0aCBvbmUtd2F5IG5vbi1yZWJyZWF0aGluZyB2YWx2ZSBmb3IgaHlnaWVuaWMgcmVzY3VlIHZlbnRpbGF0aW9uLicsXG4gICAgZnVsbERlc2NyaXB0aW9uOiAnUHJvdmlkZXMgc2FuaXRhcnkgYmFycmllciBwcm90ZWN0aW9uIGJldHdlZW4gcmVzY3VlciBhbmQgcGF0aWVudCBkdXJpbmcgbW91dGgtdG8tbW91dGggcmVzdXNjaXRhdGlvbi4gSW5jbHVkZXMgaGlnaC1lZmZpY2llbmN5IG9uZS13YXkgdmFsdmUgd2l0aCAzTSBiYWN0ZXJpYWwgZmlsdGVyLicsXG4gICAgbWFpbkltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9SRVZJVkUtQUlELVJFU1VTQ0lUQVRJT04tREVWSUNFLTUwMHg1MDAud2VicCcsXG4gICAgZ2FsbGVyeUltYWdlczogWycvaW1hZ2VzL29yaWdpbmFsL1JFVklWRS1BSUQtUkVTVVNDSVRBVElPTi1ERVZJQ0UxLTUwMHg1MDAud2VicCddLFxuICAgIHN0b2NrUXVhbnRpdHk6IDg1LFxuICAgIGxvd1N0b2NrVGhyZXNob2xkOiAxNSxcbiAgICBzdG9ja1N0YXR1czogJ2luX3N0b2NrJyxcbiAgICB0ZWNobmljYWxTcGVjczogeyAnVmFsdmUnOiAnT25lLXdheSBub24tcmVicmVhdGhpbmcgdmFsdmUnLCAnRmlsdGVyJzogJ0JhY3RlcmlhbCBmaWx0ZXIgbWVtYnJhbmUnLCAnQ2FzZSc6ICdDb21wYWN0IHBsYXN0aWMgY2FycnkgY2FzZScgfSxcbiAgICBmZWF0dXJlczogWydaZXJvIGNyb3NzLWNvbnRhbWluYXRpb24gcmlzaycsICdDbGVhciB0cmFuc3BhcmVudCBtYXNrJywgJ0ZpdHMgYWR1bHRzIGFuZCBjaGlsZHJlbiddLFxuICAgIGFwcGxpY2F0aW9uczogWydGaXJzdCBSZXNwb25kZXJzJywgJ0xpZmVndWFyZHMnLCAnUGFyYW1lZGljIEtpdHMnXSxcbiAgICBpc0ZlYXR1cmVkOiB0cnVlLFxuICAgIGlzQmVzdFNlbGxlcjogdHJ1ZSxcbiAgICBpc05ldzogZmFsc2UsXG4gICAgc3RhdHVzOiBcInB1Ymxpc2hlZFwiLFxuICAgIGRvY3VtZW50czogW10sXG4gICAgdGFnczogW1wiTWVkaWNhbCBFcXVpcG1lbnRcIiwgXCJVQUVcIl0sXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wOS0wMVQwMDowMDowMFonLFxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDktMjRUMDA6MDA6MDBaJ1xuICB9LFxuICB7XG4gICAgaWQ6ICdmb20tYnMtMTAnLFxuICAgIG5hbWU6ICdTYWx2ZXF1aWNrIFdhdGVycHJvb2YgUGxhc3RlciBTdHJpcHMgUmVmaWxsIHwgNjAzNicsXG4gICAgc2x1ZzogJ3NhbHZlcXVpY2std2F0ZXJwcm9vZi1wbGFzdGVyLXN0cmlwcy1yZWZpbGwtNjAzNicsXG4gICAgc2t1OiAnU0FMVi02MDM2JyxcbiAgICBwcm9kdWN0VHlwZTogJ3NpbXBsZScsXG4gICAgcHVyY2hhc2VNb2RlOiAnY2FydCcsXG4gICAgcmVndWxhclByaWNlOiA0MixcbiAgICBzYWxlUHJpY2U6IDM1LFxuICAgIGNhdGVnb3J5OiAnQ29uc3VtYWJsZXMgJiBEaXNwb3NhYmxlcycsXG4gICAgYnJhbmQ6ICdTYWx2ZXF1aWNrJyxcbiAgICBzaG9ydERlc2NyaXB0aW9uOiAnU3RlcmlsZSB3YXRlcnByb29mIGFkaGVzaXZlIHdvdW5kIHBsYXN0ZXIgcmVmaWxsIHBhY2sgZm9yIGNsaW5pY2FsIGRpc3BlbnNlcnMuJyxcbiAgICBmdWxsRGVzY3JpcHRpb246ICdTYWx2ZXF1aWNrIDYwMzYgcmVmaWxsIHBhY2sgY29udGFpbnMgYnJlYXRoYWJsZSwgc3RlcmlsZSB3YXRlcnByb29mIHBsYXN0ZXJzIHRoYXQgcmVtYWluIHNlY3VyZWx5IGFmZml4ZWQgZHVyaW5nIHdhc2hpbmcgYW5kIGNsaW5pY2FsIGhhbmQgaHlnaWVuZSByb3V0aW5lcy4nLFxuICAgIG1haW5JbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvU2FsdmVxdWljay1QbGFzdGVyLVN0cmlwcy1XYXRlcnByb29mLTUwMHg1MDAud2VicCcsXG4gICAgZ2FsbGVyeUltYWdlczogWycvaW1hZ2VzL29yaWdpbmFsL1NhbHZlcXVpY2stUGxhc3Rlci1TdHJpcHMtV2F0ZXJwcm9vZi01MDB4NTAwLndlYnAnXSxcbiAgICBzdG9ja1F1YW50aXR5OiAxNDAsXG4gICAgbG93U3RvY2tUaHJlc2hvbGQ6IDIwLFxuICAgIHN0b2NrU3RhdHVzOiAnaW5fc3RvY2snLFxuICAgIHRlY2huaWNhbFNwZWNzOiB7ICdQYWNrIENvbnRlbnRzJzogJzQ1IGFzc29ydGVkIHdhdGVycHJvb2YgcGxhc3RlcnMnLCAnQWRoZXNpdmUnOiAnSHlwb2FsbGVyZ2VuaWMgcG9seWFjcnlsYXRlJyB9LFxuICAgIGZlYXR1cmVzOiBbJzEwMCUgd2F0ZXJwcm9vZiBzZWFsJywgJ0Rpc3BlbnNlcnMgcmVmaWxsIGNvbXBhdGlibGUnLCAnR2VudGxlIG9uIHNlbnNpdGl2ZSBza2luJ10sXG4gICAgYXBwbGljYXRpb25zOiBbJ0NsaW5pYyBTdGF0aW9ucycsICdMYWJvcmF0b3JpZXMnLCAnU3VyZ2VyeSBTdWl0ZXMnXSxcbiAgICBpc0ZlYXR1cmVkOiB0cnVlLFxuICAgIGlzQmVzdFNlbGxlcjogdHJ1ZSxcbiAgICBpc05ldzogZmFsc2UsXG4gICAgc3RhdHVzOiBcInB1Ymxpc2hlZFwiLFxuICAgIGRvY3VtZW50czogW10sXG4gICAgdGFnczogW1wiTWVkaWNhbCBFcXVpcG1lbnRcIiwgXCJVQUVcIl0sXG4gICAgY3JlYXRlZEF0OiAnMjAyNi0wOS0wMVQwMDowMDowMFonLFxuICAgIHVwZGF0ZWRBdDogJzIwMjYtMDktMjRUMDA6MDA6MDBaJ1xuICB9XG5dO1xuXG4vLyA4IEhlYWx0aGNhcmUgU2VjdG9ycyBXZSBTdXBwb3J0XG5jb25zdCBzZWN0b3JzID0gW1xuICB7IHRpdGxlOiAnSG9zcGl0YWxzJywgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsL2hvc3BpdGFsLWltYWdlLTEud2VicCcgfSxcbiAgeyB0aXRsZTogJ0NsaW5pY3MnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvY2xpbmljLTEud2VicCcgfSxcbiAgeyB0aXRsZTogJ0RpYWdub3N0aWMgQ2VudGVycycsIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9kaWFnbm9zdGljLWNlbnRlcnMtMS53ZWJwJyB9LFxuICB7IHRpdGxlOiAnUGhhcm1hY2llcycsIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9waGFybWFjeS0xLndlYnAnIH0sXG4gIHsgdGl0bGU6ICdIb21lIEhlYWx0aGNhcmUnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvaG9tZS1oZWFsdGhjYXJlLTEud2VicCcgfSxcbiAgeyB0aXRsZTogJ0dvdmVybm1lbnQgUHJvamVjdHMnLCBpbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvZ292ZXJtbmV0LXByb2plY3QtMS53ZWJwJyB9LFxuICB7IHRpdGxlOiAnTWVkaWNhbCBMYWJvcmF0b3JpZXMnLCBpbWFnZTogJy9pbWFnZXMvc2VjdG9ycy9tZWRpY2FsLWxhYm9yYXRvcmllcy5qcGcnIH0sXG4gIHsgdGl0bGU6ICdSZWhhYmlsaXRhdGlvbiBDZW50ZXJzJywgaW1hZ2U6ICcvaW1hZ2VzL3NlY3RvcnMvcmVoYWJpbGl0YXRpb24tY2VudGVycy5qcGcnIH1cbl07XG5cbi8vIEJyYW5kIFBhcnRuZXJzIGZyb20gbGl2ZSBGYXN0T25NZWRcbmNvbnN0IGJyYW5kcyA9IFtcbiAgeyBuYW1lOiAnQmlzdG9zIEFtZXJpY2EnLCBpbWFnZTogJy9pbWFnZXMvYnJhbmRzL2Jpc3Rvcy5wbmcnIH0sXG4gIHsgbmFtZTogJ01JUiBNZWRpY2FsIEludGVybmF0aW9uYWwgUmVzZWFyY2gnLCBpbWFnZTogJy9pbWFnZXMvYnJhbmRzL21pci5wbmcnIH0sXG4gIHsgbmFtZTogJ1dvb2RwZWNrZXIgRGVudGFsJywgaW1hZ2U6ICcvaW1hZ2VzL2JyYW5kcy93b29kcGVja2VyLnBuZycgfSxcbiAgeyBuYW1lOiAnSm9oYXJpIE1lZGljYWwnLCBpbWFnZTogJy9pbWFnZXMvYnJhbmRzL2pvaGFyaS5wbmcnIH0sXG4gIHsgbmFtZTogJ0Jpb2Jhc2UgR3JvdXAnLCBpbWFnZTogJy9pbWFnZXMvYnJhbmRzL2Jpb2Jhc2UucG5nJyB9LFxuICB7IG5hbWU6ICdBbC1DYW4gRXhwb3J0cycsIGltYWdlOiAnL2ltYWdlcy9icmFuZHMvYWwtY2FuLnBuZycgfVxuXTtcblxuLy8gRkFRIGl0ZW1zIGZyb20gbGl2ZSBGYXN0T25NZWRcbmNvbnN0IGZhcUl0ZW1zID0gW1xuICB7XG4gICAgcTogJ0RvIHlvdSBwcm92aWRlIG1haW50ZW5hbmNlIHNlcnZpY2VzPycsXG4gICAgYTogJ1llcywgd2UgcHJvdmlkZSB0ZWNobmljYWwgYXNzaXN0YW5jZSwgbWFpbnRlbmFuY2Ugc3VwcG9ydCwgYW5kIHNlcnZpY2UgY29vcmRpbmF0aW9uIGZvciBzZWxlY3RlZCBtZWRpY2FsIGVxdWlwbWVudCBzeXN0ZW1zLidcbiAgfSxcbiAge1xuICAgIHE6ICdDYW4gSSByZXF1ZXN0IGJ1bGsgbWVkaWNhbCBlcXVpcG1lbnQgc3VwcGx5PycsXG4gICAgYTogJ1llcywgd2UgaGFuZGxlIGJ1bGsgaGVhbHRoY2FyZSBlcXVpcG1lbnQgc3VwcGx5IGZvciBob3NwaXRhbHMsIGNsaW5pY3MsIGxhYm9yYXRvcmllcywgaGVhbHRoY2FyZSBwcm9qZWN0cywgYW5kIGdvdmVybm1lbnQgdGVuZGVycy4nXG4gIH1cbl07XG5cbi8vIEJlQmVhdXR5NS1TdHlsZSBIZXJvIFNsaWRlc1xuY29uc3QgaGVyb1NsaWRlcyA9IFtcbiAge1xuICAgIHRhZzogJ0NPTEQtQ0hBSU4gU1RPUkFHRScsXG4gICAgdGl0bGU6ICdQcmVjaXNpb24gTWVkaWNhbCBDb2xkIFN0b3JhZ2UnLFxuICAgIHN1YnRpdGxlOiAnSGFpZXIgQmlvbWVkaWNhbCBwaGFybWFjeSByZWZyaWdlcmF0b3JzIGVuZ2luZWVyZWQgZm9yIHByZWNpc2UgMsKwQyDigJMgOMKwQyB2YWNjaW5lLCBtZWRpY2luZSwgYW5kIGNsaW5pY2FsIHNwZWNpbWVuIHByZXNlcnZhdGlvbiBhY3Jvc3MgdGhlIFVBRS4nLFxuICAgIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9GcmlkZ2VzLVBoYXJtYWN5X0hhaWVyX0hZQy0zMDkucG5nJyxcbiAgICBsaWZlc3R5bGVJbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvaG9zcGl0YWwtaW1hZ2UtMS53ZWJwJyxcbiAgICBidXR0b25UZXh0OiAnRVhQTE9SRSBSRUZSSUdFUkFUSU9OJyxcbiAgICBsaW5rOiAnL3Byb2R1Y3QvaGFpZXItYmlvbWVkaWNhbC1oeWMtMzA5LXBoYXJtYWN5LXJlZnJpZ2VyYXRvcidcbiAgfSxcbiAge1xuICAgIHRhZzogJ1NVUkdJQ0FMICYgQ0xJTklDIENBUkUnLFxuICAgIHRpdGxlOiAnSG9zcGl0YWwgU3RlcmlsZSBOZXQgRHJlc3NpbmdzJyxcbiAgICBzdWJ0aXRsZTogJ0V1cm9wZWFuIGNsaW5pY2FsLWdyYWRlIG5vbi1hZGhlcmVudCBjb250YWN0IGRyZXNzaW5ncyBhbmQgc3RlcmlsZSBleHVkYXRlIHRyYW5zZmVyIG1lc2hlcyBkZXNpZ25lZCBmb3IgdHJhdW1hIGFuZCBzdXJnaWNhbCByZWNvdmVyeS4nLFxuICAgIGltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9OZXQtZHJlc3NpbmctQ0VERVJST1RILTE4OTMtMzYyeDUwMC5qcGcnLFxuICAgIGxpZmVzdHlsZUltYWdlOiAnL2ltYWdlcy9vcmlnaW5hbC9jbGluaWMtMS53ZWJwJyxcbiAgICBidXR0b25UZXh0OiAnRVhQTE9SRSBXT1VORCBDQVJFJyxcbiAgICBsaW5rOiAnL3Byb2R1Y3QvY2VkZXJyb3RoLXN0ZXJpbGUtbmV0LXdvdW5kLWRyZXNzaW5nLTE4OTMnXG4gIH0sXG4gIHtcbiAgICB0YWc6ICdQSFlTSU9USEVSQVBZICYgQ09NUFJFU1MnLFxuICAgIHRpdGxlOiAnRHVhbC1BY3Rpb24gVGhlcm1hbCBUaGVyYXB5JyxcbiAgICBzdWJ0aXRsZTogJ0ZsZXhpYmxlIGNyeW8gYW5kIHRoZXJtbyBjb21wcmVzcyB0aGVyYXB5IHNvbHV0aW9ucyBmb3IgcmVoYWJpbGl0YXRpb24gY2xpbmljcywgcGF0aWVudCByZWNvdmVyeSwgYW5kIGhvc3BpdGFsIHRyYXVtYSBjYXJlLicsXG4gICAgaW1hZ2U6ICcvaW1hZ2VzL29yaWdpbmFsLzMwUkVVSEMxLV9FMl84MF85My1SRVVTQUJMRS1DT0xELUhPVC1QQUNLLTUwMHg1MDAuanBnJyxcbiAgICBsaWZlc3R5bGVJbWFnZTogJy9pbWFnZXMvb3JpZ2luYWwvZGlhZ25vc3RpYy1jZW50ZXJzLTEud2VicCcsXG4gICAgYnV0dG9uVGV4dDogJ0VYUExPUkUgVEhFUkFQWScsXG4gICAgbGluazogJy9zaG9wJ1xuICB9XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBIb21lUGFnZSgpIHtcbiAgY29uc3QgW29wZW5GYXEsIHNldE9wZW5GYXFdID0gdXNlU3RhdGU8bnVtYmVyIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IFthY3RpdmVTbGlkZUlkeCwgc2V0QWN0aXZlU2xpZGVJZHhdID0gdXNlU3RhdGUoMCk7XG5cbiAgY29uc3QgdG9nZ2xlRmFxID0gKGluZGV4OiBudW1iZXIpID0+IHtcbiAgICBzZXRPcGVuRmFxKG9wZW5GYXEgPT09IGluZGV4ID8gbnVsbCA6IGluZGV4KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVQcmV2U2xpZGUgPSAoKSA9PiB7XG4gICAgc2V0QWN0aXZlU2xpZGVJZHgoKHByZXYpID0+IChwcmV2ID09PSAwID8gaGVyb1NsaWRlcy5sZW5ndGggLSAxIDogcHJldiAtIDEpKTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVOZXh0U2xpZGUgPSAoKSA9PiB7XG4gICAgc2V0QWN0aXZlU2xpZGVJZHgoKHByZXYpID0+IChwcmV2ID09PSBoZXJvU2xpZGVzLmxlbmd0aCAtIDEgPyAwIDogcHJldiArIDEpKTtcbiAgfTtcblxuICBjb25zdCBjdXJyZW50U2xpZGUgPSBoZXJvU2xpZGVzW2FjdGl2ZVNsaWRlSWR4XTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsIG1pbkhlaWdodDogJzEwMHZoJywgY29sb3I6ICcjMWUyOTNiJyB9fT5cbiAgICAgIDxzdHlsZT57YFxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogNzY4cHgpIHtcbiAgICAgICAgICAuaG9tZS1oZXJvLXNlY3Rpb24ge1xuICAgICAgICAgICAgcGFkZGluZzogMzhweCAwIDMycHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtaGVyby1zZWN0aW9uIGgxIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMS44NXJlbSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgbGluZS1oZWlnaHQ6IDEuMiAhaW1wb3J0YW50O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuaG9tZS1oZXJvLXNlY3Rpb24gcCB7XG4gICAgICAgICAgICBmb250LXNpemU6IDAuOTJyZW0gIWltcG9ydGFudDtcbiAgICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU1ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAyMnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5oZXJvLWN0YS1idG4ge1xuICAgICAgICAgICAgcGFkZGluZzogMTJweCAyOHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBmb250LXNpemU6IDAuOTJyZW0gIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtc2VjdGlvbiB7XG4gICAgICAgICAgICBwYWRkaW5nOiA0MHB4IDAgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtc2VjdGlvbi10aXRsZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEuNXJlbSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgbWFyZ2luLWJvdHRvbTogNnB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5ob21lLWNhdGVnb3JpZXMtZ3JpZCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGdhcDogMTJweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuY2F0ZWdvcnktaXRlbS1jYXJkIHtcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmNhdGVnb3J5LWl0ZW0tY2FyZCAuY2F0LWltZy1ib3gge1xuICAgICAgICAgICAgcGFkZGluZzogMTBweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuY2F0ZWdvcnktaXRlbS1jYXJkIC5jYXQtdGl0bGUge1xuICAgICAgICAgICAgZm9udC1zaXplOiAwLjg0cmVtICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBsaW5lLWhlaWdodDogMS4zICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBtaW4taGVpZ2h0OiAyLjZlbSAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuY2F0ZWdvcnktaXRlbS1jYXJkIC5jYXQtZXhwbG9yZSB7XG4gICAgICAgICAgICBmb250LXNpemU6IDAuNzJyZW0gIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtd2hvLWdyaWQge1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGdhcDogMjhweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuaG9tZS13aG8taW1nLWJveCB7XG4gICAgICAgICAgICBtYXgtd2lkdGg6IDI0MHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5ob21lLXByb2R1Y3RzLWdyaWQge1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMiwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBnYXA6IDEwcHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtc2VjdG9ycy1ncmlkIHtcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZ2FwOiAxMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5zZWN0b3ItY2FyZCB7XG4gICAgICAgICAgICBoZWlnaHQ6IDE2MHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5zZWN0b3ItY2FyZCBoMyB7XG4gICAgICAgICAgICBmb250LXNpemU6IDEuMDVyZW0gIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmhvbWUtYnJhbmRzLXdyYXAge1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgICBnYXA6IDEycHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmJyYW5kLWxvZ28tY2FyZCB7XG4gICAgICAgICAgICBoZWlnaHQ6IDcycHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIHBhZGRpbmc6IDEwcHggMTRweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZmFxLWJ0biB7XG4gICAgICAgICAgICBwYWRkaW5nOiAxNHB4IDE2cHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgICAgLmZhcS1xIHtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMC45MnJlbSAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuZmFxLWEge1xuICAgICAgICAgICAgcGFkZGluZzogMCAxNnB4IDE2cHggIWltcG9ydGFudDtcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMC44OHJlbSAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTEwMHB4KSBhbmQgKG1pbi13aWR0aDogNzY5cHgpIHtcbiAgICAgICAgICAuaG9tZS1jYXRlZ29yaWVzLWdyaWQge1xuICAgICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNCwgbWlubWF4KDAsIDFmcikpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5ob21lLXNlY3RvcnMtZ3JpZCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSkgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDQ4MHB4KSB7XG4gICAgICAgICAgLmhvbWUtY2F0ZWdvcmllcy1ncmlkIHtcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKSAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZ2FwOiAxMHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5ob21lLXNlY3RvcnMtZ3JpZCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuaG9tZS1icmFuZHMtd3JhcCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSkgIWltcG9ydGFudDtcbiAgICAgICAgICAgIGdhcDogMTBweCAhaW1wb3J0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgICAuYnJhbmQtbG9nby1jYXJkIHtcbiAgICAgICAgICAgIGhlaWdodDogNjZweCAhaW1wb3J0YW50O1xuICAgICAgICAgICAgcGFkZGluZzogOHB4IDEycHggIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLmhvbWUtYnJhbmRzLXdyYXAge1xuICAgICAgICAgIGRpc3BsYXk6IGdyaWQ7XG4gICAgICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoNiwgbWlubWF4KDAsIDFmcikpO1xuICAgICAgICAgIGdhcDogMTZweDtcbiAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAgICB9XG4gICAgICAgIC5icmFuZC1sb2dvLWNhcmQge1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gICAgICAgICAgYm9yZGVyOiAxLjVweCBzb2xpZCAjZTJlOGYwO1xuICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgICAgICAgaGVpZ2h0OiA4NHB4O1xuICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICAgICAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICAgICAgICBwYWRkaW5nOiAxMnB4IDE4cHg7XG4gICAgICAgICAgYm94LXNoYWRvdzogMCAycHggOHB4IHJnYmEoMTUsIDIzLCA0MiwgMC4wNCk7XG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGVhc2U7XG4gICAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICB9XG4gICAgICAgIC5icmFuZC1sb2dvLWNhcmQ6aG92ZXIge1xuICAgICAgICAgIGJvcmRlci1jb2xvcjogIzUxYjI5MSAhaW1wb3J0YW50O1xuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IHJnYmEoODEsIDE3OCwgMTQ1LCAwLjIpICFpbXBvcnRhbnQ7XG4gICAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0zcHgpO1xuICAgICAgICB9XG4gICAgICAgIC5icmFuZC1sb2dvLWNhcmQgLmJyYW5kLWxvZ28taW1nIHtcbiAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4yNXMgZWFzZTtcbiAgICAgICAgfVxuICAgICAgICAuYnJhbmQtbG9nby1jYXJkOmhvdmVyIC5icmFuZC1sb2dvLWltZyB7XG4gICAgICAgICAgdHJhbnNmb3JtOiBzY2FsZSgxLjA2KTtcbiAgICAgICAgfVxuICAgICAgICAudmlldy1hbGwtYnRuOmhvdmVyIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMGYxNzJhICFpbXBvcnRhbnQ7XG4gICAgICAgICAgY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcbiAgICAgICAgfVxuICAgICAgICBAaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1QbHVzK0pha2FydGErU2FuczppdGFsLHdnaHRAMCwzMDA7MCw0MDA7MCw1MDA7MCw2MDA7MCw3MDA7MCw4MDA7MSw0MDAmZGlzcGxheT1zd2FwJyk7XG5cbiAgICAgICAgLmJlLWhlcm8tZ3JpZCB7XG4gICAgICAgICAgZGlzcGxheTogZ3JpZDtcbiAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDEuMTVmciAwLjg1ZnIgMWZyO1xuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAgZ2FwOiAyOHB4O1xuICAgICAgICAgIG1pbi1oZWlnaHQ6IDUyMHB4O1xuICAgICAgICB9XG4gICAgICAgIC5iZS1jdGEtYnRuIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjNTFiMjkxICFpbXBvcnRhbnQ7XG4gICAgICAgICAgY29sb3I6ICNmZmZmZmYgIWltcG9ydGFudDtcbiAgICAgICAgICB0cmFuc2l0aW9uOiBhbGwgMC4yNXMgZWFzZTtcbiAgICAgICAgfVxuICAgICAgICAuYmUtY3RhLWJ0bjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzBkNGQ0NyAhaW1wb3J0YW50O1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCByZ2JhKDEzLCA3NywgNzEsIDAuMTgpO1xuICAgICAgICB9XG4gICAgICAgIC5iZS1hcnJvdy1idG4ge1xuICAgICAgICAgIHdpZHRoOiA0NHB4O1xuICAgICAgICAgIGhlaWdodDogNDRweDtcbiAgICAgICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2E5Y2VjMTtcbiAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcbiAgICAgICAgICBjb2xvcjogIzE3NDgzZjtcbiAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICAgIG91dGxpbmU6IG5vbmU7XG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGVhc2U7XG4gICAgICAgIH1cbiAgICAgICAgLmJlLWFycm93LWJ0bjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogIzBkNGQ0NztcbiAgICAgICAgICBib3JkZXItY29sb3I6ICMwZDRkNDc7XG4gICAgICAgICAgY29sb3I6ICNmZmZmZmY7XG4gICAgICAgIH1cbiAgICAgICAgLmJlLWFycm93LWJ0bjpmb2N1cy12aXNpYmxlIHtcbiAgICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDJweCByZ2JhKDgxLCAxNzgsIDE0NSwgMC4yOCk7XG4gICAgICAgIH1cbiAgICAgICAgLmJlLWNoZWNrZXJib2FyZC1ncmlkIHtcbiAgICAgICAgICBkaXNwbGF5OiBncmlkO1xuICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDQsIG1pbm1heCgwLCAxZnIpKTtcbiAgICAgICAgfVxuICAgICAgICAuYmUtZGlzY292ZXItbGluayB7XG4gICAgICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMjVzIGVhc2UsIGNvbG9yIDAuMjVzIGVhc2U7XG4gICAgICAgIH1cbiAgICAgICAgLmJlLWRpc2NvdmVyLWxpbms6aG92ZXIge1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCg0cHgpO1xuICAgICAgICB9XG4gICAgICAgIC5iZS1mZWF0dXJlLWNhcmQge1xuICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgI2U3ZTVlNDtcbiAgICAgICAgICBwYWRkaW5nOiAyOHB4IDI0cHg7XG4gICAgICAgICAgdHJhbnNpdGlvbjogYWxsIDAuMjVzIGVhc2U7XG4gICAgICAgIH1cbiAgICAgICAgLmJlLWZlYXR1cmUtY2FyZDpob3ZlciB7XG4gICAgICAgICAgYm9yZGVyLWNvbG9yOiAjMWY3YTViO1xuICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IHJnYmEoMzEsIDEyMiwgOTEsIDAuMDgpO1xuICAgICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMnB4KTtcbiAgICAgICAgfVxuICAgICAgICBAbWVkaWEgKG1heC13aWR0aDogMTAyNHB4KSB7XG4gICAgICAgICAgLmJlLWhlcm8tZ3JpZCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAhaW1wb3J0YW50O1xuICAgICAgICAgICAgZ2FwOiA0MHB4ICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIC5iZS1jaGVja2VyYm9hcmQtZ3JpZCB7XG4gICAgICAgICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSkgIWltcG9ydGFudDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgQG1lZGlhIChtYXgtd2lkdGg6IDY0MHB4KSB7XG4gICAgICAgICAgLmJlLWNoZWNrZXJib2FyZC1ncmlkIHtcbiAgICAgICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyICFpbXBvcnRhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBgfTwvc3R5bGU+XG5cbiAgICAgIHsvKiAxLiBCRUJFQVVUWS1TVFlMRSBIRVJPIFNFQ1RJT04gKENsZWFuLCBNaW5pbWFsaXN0IEx1eHVyeSBTbGlkZXIpICovfVxuICAgICAgPHNlY3Rpb25cbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KDExOGRlZywgI2Y3ZmNmYSAwJSwgI2VkZjhmNCA1OCUsICNlNWY0ZWYgMTAwJSknLFxuICAgICAgICAgIHBhZGRpbmc6ICc0OHB4IDAgNTZweCcsXG4gICAgICAgICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjZDdlOWUyJ1xuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmUtaGVyby1ncmlkXCI+XG4gICAgICAgICAgICB7LyogTGVmdDogRWRpdG9yaWFsIFR5cG9ncmFwaHkgJiBBY3Rpb25zICovfVxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nUmlnaHQ6ICcxMnB4JyB9fT5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBnYXA6ICcxNHB4JywgbWFyZ2luQm90dG9tOiAnMThweCcgfX0+XG4gICAgICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC43NHJlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMmY4ZjcwJyxcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMjJlbScsXG4gICAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIlxuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICBGQVNUT05NRUQgTUVESUNBTFxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBoZWlnaHQ6IDEsIHdpZHRoOiAzMiwgYmFja2dyb3VuZENvbG9yOiAnIzlhY2RiYicgfX0gLz5cbiAgICAgICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjcycmVtJyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2Njg0N2InLFxuICAgICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNmVtJyxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiJ1BsdXMgSmFrYXJ0YSBTYW5zJywgc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtjdXJyZW50U2xpZGUudGFnfVxuICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgPGgxXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFNpemU6ICdjbGFtcCgyLjRyZW0sIDQuMnZ3LCAzLjZyZW0pJywgZm9udFdlaWdodDogODAwLCBjb2xvcjogJyMwZjE3MmEnLCBsaW5lSGVpZ2h0OiAxLjE1LCBsZXR0ZXJTcGFjaW5nOiAnLTAuMDI1ZW0nLFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMjBweCdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2N1cnJlbnRTbGlkZS50aXRsZX1cbiAgICAgICAgICAgICAgPC9oMT5cblxuICAgICAgICAgICAgICA8cFxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMS4wMnJlbScsXG4gICAgICAgICAgICAgICAgICBjb2xvcjogJyM1ODcxNmInLFxuICAgICAgICAgICAgICAgICAgbGluZUhlaWdodDogMS42OCxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzM0cHgnLFxuICAgICAgICAgICAgICAgICAgbWF4V2lkdGg6ICc0ODBweCdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge2N1cnJlbnRTbGlkZS5zdWJ0aXRsZX1cbiAgICAgICAgICAgICAgPC9wPlxuXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTRweCcsIGZsZXhXcmFwOiAnd3JhcCcsIG1hcmdpbkJvdHRvbTogJzM4cHgnIH19PlxuICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICBocmVmPXtjdXJyZW50U2xpZGUubGlua31cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBnYXA6ICcxMHB4JyxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzUxYjI5MScsXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4IDM2cHgnLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuOHJlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMTRlbScsXG4gICAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjI1cyBlYXNlJ1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlLWN0YS1idG5cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzcGFuPntjdXJyZW50U2xpZGUuYnV0dG9uVGV4dH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICA8QXJyb3dSaWdodCBzaXplPXsxNX0gLz5cbiAgICAgICAgICAgICAgICA8L0xpbms+XG5cbiAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgaHJlZj17YGh0dHBzOi8vd2EubWUvOTcxNTA4ODkzNTg5P3RleHQ9JHtlbmNvZGVVUklDb21wb25lbnQoJ0hlbGxvIEZhc3Rvbm1lZCBTYWxlcywgSSB3b3VsZCBsaWtlIHRvIGlucXVpcmUgYWJvdXQgbWVkaWNhbCBlcXVpcG1lbnQuJyl9YH1cbiAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgICAgICAgICAgICByZWw9XCJub29wZW5lciBub3JlZmVycmVyXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBnYXA6ICc4cHgnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICNjOWRmZDcnLFxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMxNzNmM2EnLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMTVweCAyNHB4JyxcbiAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjhyZW0nLFxuICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA3MDAsXG4gICAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjFlbScsXG4gICAgICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIixcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzIGVhc2UnXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxNZXNzYWdlQ2lyY2xlIHNpemU9ezE2fSBjb2xvcj1cIiMxNmEzNGFcIiAvPlxuICAgICAgICAgICAgICAgICAgPHNwYW4+V2hhdHNBcHAgUXVvdGU8L3NwYW4+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgICAgICB7LyogU2xpZGVyIEFycm93IENvbnRyb2xzIChFeGFjdCBCZUJlYXV0eSBTdHlsZSkgKi99XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywgZ2FwOiAnMTRweCcgfX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlUHJldlNsaWRlfVxuICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlByZXZpb3VzIHNsaWRlXCJcbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlLWFycm93LWJ0blwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPHN2ZyB3aWR0aD1cIjE4XCIgaGVpZ2h0PVwiMTRcIiB2aWV3Qm94PVwiMCAwIDE4IDE0XCIgZmlsbD1cIm5vbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD1cIk03IDFMMSA3TDcgMTNNMSA3SDE3XCIgc3Ryb2tlPVwiY3VycmVudENvbG9yXCIgc3Ryb2tlV2lkdGg9XCIxLjZcIiBzdHJva2VMaW5lY2FwPVwicm91bmRcIiBzdHJva2VMaW5lam9pbj1cInJvdW5kXCIvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVOZXh0U2xpZGV9XG4gICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmV4dCBzbGlkZVwiXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZS1hcnJvdy1idG5cIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzdmcgd2lkdGg9XCIxOFwiIGhlaWdodD1cIjE0XCIgdmlld0JveD1cIjAgMCAxOCAxNFwiIGZpbGw9XCJub25lXCI+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9XCJNMTEgMUwxNyA3TDExIDEzTTE3IDdIMVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZVdpZHRoPVwiMS42XCIgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCIgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogQ2VudGVyOiBGcmFtZWQgUHJvZHVjdCBEaXNwbGF5IChFeGFjdCBCZUJlYXV0eSBTdHlsZSkgKi99XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicgfX0+XG4gICAgICAgICAgICAgIHsvKiBEZWxpY2F0ZSB3aGl0ZSBiYWNrZ3JvdW5kIGZyYW1lICovfVxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMzIwcHgnLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzgwcHgnLFxuICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgICBib3hTaGFkb3c6ICcwIDE1cHggMzVweCByZ2JhKDAsIDAsIDAsIDAuMDQpJyxcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMjgwcHgnLFxuICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMzYwcHgnLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB6SW5kZXg6IDJcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEltYWdlXG4gICAgICAgICAgICAgICAgICBzcmM9e2N1cnJlbnRTbGlkZS5pbWFnZX1cbiAgICAgICAgICAgICAgICAgIGFsdD17Y3VycmVudFNsaWRlLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgZmlsbFxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgb2JqZWN0Rml0OiAnY29udGFpbicsIHBhZGRpbmc6ICcxNnB4JywgZmlsdGVyOiAnZHJvcC1zaGFkb3coMCAxNXB4IDI1cHggcmdiYSgwLCAwLCAwLCAwLjEyKSknIH19XG4gICAgICAgICAgICAgICAgICB1bm9wdGltaXplZFxuICAgICAgICAgICAgICAgICAgcHJpb3JpdHlcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUmlnaHQ6IEhvc3BpdGFsIExpZmVzdHlsZSBQaG90byAmIFZlcnRpY2FsIE51bWJlciBJbmRpY2F0b3IgKi99XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2ZsZXgtZW5kJyB9fT5cbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ6ICc0MjBweCcsXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbicsXG4gICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZGNlZWU4J1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SW1hZ2VcbiAgICAgICAgICAgICAgICAgIHNyYz17Y3VycmVudFNsaWRlLmxpZmVzdHlsZUltYWdlfVxuICAgICAgICAgICAgICAgICAgYWx0PVwiQ2xpbmljYWwgVGVjaG5vbG9neVwiXG4gICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBvYmplY3RGaXQ6ICdjb3ZlcicgfX1cbiAgICAgICAgICAgICAgICAgIHVub3B0aW1pemVkXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgey8qIFZlcnRpY2FsIFNsaWRlIENvdW50ZXIgKGxpa2UgQmVCZWF1dHkpICovfVxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgICAgICAgbGVmdDogJy0yNHB4JyxcbiAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA4cHggMjRweCByZ2JhKDAsMCwwLDAuMDYpJyxcbiAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcxNnB4IDE0cHgnLFxuICAgICAgICAgICAgICAgICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICd2YXIoLS1mb250LWhlYWRpbmcpJywgZm9udFNpemU6ICcwLjk4cmVtJywgZm9udFdlaWdodDogNzAwLCBsZXR0ZXJTcGFjaW5nOiAnMC4wNGVtJywgY29sb3I6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgICAgIHpJbmRleDogM1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8c3Bhbj57U3RyaW5nKGFjdGl2ZVNsaWRlSWR4ICsgMSkucGFkU3RhcnQoMiwgJzAnKX08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgd2lkdGg6IDE2LCBoZWlnaHQ6IDEsIGJhY2tncm91bmRDb2xvcjogJyM5YWNkYmInLCBtYXJnaW46ICc2cHggMCcsIHRyYW5zZm9ybTogJ3JvdGF0ZSgtNDVkZWcpJyB9fSAvPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnIzY2ODQ3YicsIGZvbnRTaXplOiAnMXJlbScgfX0+e1N0cmluZyhoZXJvU2xpZGVzLmxlbmd0aCkucGFkU3RhcnQoMiwgJzAnKX08L3NwYW4+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICB7LyogMi4gRURJVE9SSUFMIENIRUNLRVJCT0FSRCBTSE9XQ0FTRSAoRXhhY3QgQmVCZWF1dHkgNSBMYXlvdXQpICovfVxuICAgICAgPHNlY3Rpb24gc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsIHBhZGRpbmc6ICcwJyB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZS1jaGVja2VyYm9hcmQtZ3JpZFwiPlxuICAgICAgICAgIHsvKiBSb3cgMSwgQ29sIDE6IFBob3RvICovfVxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIG1pbkhlaWdodDogJzMyMHB4JyB9fT5cbiAgICAgICAgICAgIDxJbWFnZSBzcmM9XCIvaW1hZ2VzL29yaWdpbmFsL2NsaW5pYy0xLndlYnBcIiBhbHQ9XCJDbGluaWNcIiBmaWxsIHN0eWxlPXt7IG9iamVjdEZpdDogJ2NvdmVyJyB9fSB1bm9wdGltaXplZCAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFJvdyAxLCBDb2wgMjogU2FnZSBHcmVlbiBCb3ggKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzRhNjc1NScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc0OHB4IDQwcHgnLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogJzMyMHB4J1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS43NXJlbScsIGZvbnRXZWlnaHQ6IDcwMCwgbGV0dGVyU3BhY2luZzogJy0wLjAxNWVtJywgY29sb3I6ICcjZmZmZmZmJywgbWFyZ2luQm90dG9tOiAnMTBweCcsIGxpbmVIZWlnaHQ6IDEuMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBDb2xkLUNoYWluIFN0b3JhZ2VcbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzAuOTJyZW0nLCBjb2xvcjogJyNkMWZhZTUnLCBsaW5lSGVpZ2h0OiAxLjYsIG1hcmdpbkJvdHRvbTogJzI0cHgnLCBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIiB9fT5cbiAgICAgICAgICAgICAgUHJlY2lzaW9uIDLCsEMg4oCTIDjCsEMgcGhhcm1hY3kgcmVmcmlnZXJhdG9ycyB3aXRoIGNlcnRpZmllZCB0aGVybWFsIHRlbGVtZXRyeS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgIGhyZWY9XCIvcHJvZHVjdC1jYXRlZ29yeS9hY2Nlc3Nvcmllc1wiXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZGlzcGxheTogJ2lubGluZS1mbGV4JyxcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICBnYXA6ICc4cHgnLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjc4cmVtJyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA3MDAsXG4gICAgICAgICAgICAgICAgbGV0dGVyU3BhY2luZzogJzAuMTRlbScsXG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJiZS1kaXNjb3Zlci1saW5rXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4+RElTQ09WRVI8L3NwYW4+XG4gICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IHNpemU9ezE0fSAvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFJvdyAxLCBDb2wgMzogUGhvdG8gKi99XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyBwb3NpdGlvbjogJ3JlbGF0aXZlJywgbWluSGVpZ2h0OiAnMzIwcHgnIH19PlxuICAgICAgICAgICAgPEltYWdlIHNyYz1cIi9pbWFnZXMvb3JpZ2luYWwvaG9zcGl0YWwtaW1hZ2UtMS53ZWJwXCIgYWx0PVwiSG9zcGl0YWwgUm9vbVwiIGZpbGwgc3R5bGU9e3sgb2JqZWN0Rml0OiAnY292ZXInIH19IHVub3B0aW1pemVkIC8+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogUm93IDEsIENvbCA0OiBDcmVhbSBCb3ggKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2Y3ZjRlZScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzM0MjUyZicsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc0OHB4IDQwcHgnLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogJzMyMHB4J1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS43NXJlbScsIGZvbnRXZWlnaHQ6IDcwMCwgbGV0dGVyU3BhY2luZzogJy0wLjAxNWVtJywgY29sb3I6ICcjMGYxNzJhJywgbWFyZ2luQm90dG9tOiAnMTBweCcsIGxpbmVIZWlnaHQ6IDEuMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBIb3NwaXRhbCBGdXJuaXR1cmVcbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzAuOTJyZW0nLCBjb2xvcjogJyM1YjU5NTcnLCBsaW5lSGVpZ2h0OiAxLjYsIG1hcmdpbkJvdHRvbTogJzI0cHgnLCBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIiB9fT5cbiAgICAgICAgICAgICAgRXJnb25vbWljIElDVSBiZWRzLCBjbGluaWNhbCB0cmVhdG1lbnQgZnVybml0dXJlLCBhbmQgd2FyZCBlcXVpcG1lbnQuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICBocmVmPVwiL3Byb2R1Y3QtY2F0ZWdvcnkvaG9zcGl0YWwtZnVybml0dXJlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGdhcDogJzhweCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMzQyNTJmJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzhyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiJ1BsdXMgSmFrYXJ0YSBTYW5zJywgc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlLWRpc2NvdmVyLWxpbmtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3Bhbj5ESVNDT1ZFUjwvc3Bhbj5cbiAgICAgICAgICAgICAgPEFycm93UmlnaHQgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogUm93IDIsIENvbCAxOiBDcmVhbSBCb3ggKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2Y3ZjRlZScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzM0MjUyZicsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc0OHB4IDQwcHgnLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogJzMyMHB4J1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS43NXJlbScsIGZvbnRXZWlnaHQ6IDcwMCwgbGV0dGVyU3BhY2luZzogJy0wLjAxNWVtJywgY29sb3I6ICcjMGYxNzJhJywgbWFyZ2luQm90dG9tOiAnMTBweCcsIGxpbmVIZWlnaHQ6IDEuMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBTdXJnaWNhbCAmYW1wOyBTdGVyaWxlXG4gICAgICAgICAgICA8L2gzPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcwLjkycmVtJywgY29sb3I6ICcjNWI1OTU3JywgbGluZUhlaWdodDogMS42LCBtYXJnaW5Cb3R0b206ICcyNHB4JywgZm9udEZhbWlseTogXCInUGx1cyBKYWthcnRhIFNhbnMnLCBzYW5zLXNlcmlmXCIgfX0+XG4gICAgICAgICAgICAgIEV1cm9wZWFuIHdvdW5kIGRyZXNzaW5ncywgc3VyZ2ljYWwgY29uc3VtYWJsZXMsIGFuZCBzdGVyaWxlIHBhdGllbnQgc3VwcGxpZXMuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICA8TGlua1xuICAgICAgICAgICAgICBocmVmPVwiL3Byb2R1Y3QtY2F0ZWdvcnkvY29uc3VtYWJsZXMtYW5kLWRpc3Bvc2FibGVzXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGdhcDogJzhweCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMzQyNTJmJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzhyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiJ1BsdXMgSmFrYXJ0YSBTYW5zJywgc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlLWRpc2NvdmVyLWxpbmtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3Bhbj5ESVNDT1ZFUjwvc3Bhbj5cbiAgICAgICAgICAgICAgPEFycm93UmlnaHQgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogUm93IDIsIENvbCAyOiBQaG90byAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtaW5IZWlnaHQ6ICczMjBweCcgfX0+XG4gICAgICAgICAgICA8SW1hZ2Ugc3JjPVwiL2ltYWdlcy9vcmlnaW5hbC9kaWFnbm9zdGljLWNlbnRlcnMtMS53ZWJwXCIgYWx0PVwiRGlhZ25vc3RpYyBDZW50ZXJcIiBmaWxsIHN0eWxlPXt7IG9iamVjdEZpdDogJ2NvdmVyJyB9fSB1bm9wdGltaXplZCAvPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgey8qIFJvdyAyLCBDb2wgMzogU2FnZSBHcmVlbiBCb3ggKi99XG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzRhNjc1NScsXG4gICAgICAgICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgIHBhZGRpbmc6ICc0OHB4IDQwcHgnLFxuICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgIG1pbkhlaWdodDogJzMyMHB4J1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICA8aDNcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAndmFyKC0tZm9udC1oZWFkaW5nKScsIGZvbnRTaXplOiAnMS43NXJlbScsIGZvbnRXZWlnaHQ6IDcwMCwgbGV0dGVyU3BhY2luZzogJy0wLjAxNWVtJywgY29sb3I6ICcjZmZmZmZmJywgbWFyZ2luQm90dG9tOiAnMTBweCcsIGxpbmVIZWlnaHQ6IDEuMlxuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBEaWFnbm9zdGljIFN5c3RlbXNcbiAgICAgICAgICAgIDwvaDM+XG4gICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzAuOTJyZW0nLCBjb2xvcjogJyNkMWZhZTUnLCBsaW5lSGVpZ2h0OiAxLjYsIG1hcmdpbkJvdHRvbTogJzI0cHgnLCBmb250RmFtaWx5OiBcIidQbHVzIEpha2FydGEgU2FucycsIHNhbnMtc2VyaWZcIiB9fT5cbiAgICAgICAgICAgICAgRGlnaXRhbCBwYXRpZW50IG1vbml0b3JzLCB1bHRyYXNvdW5kIHN5c3RlbXMsIGFuZCBsYWJvcmF0b3J5IGRpYWdub3N0aWNzLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgaHJlZj1cIi9wcm9kdWN0LWNhdGVnb3J5L2dlbmVyYWwtbWVkaWNhbC1kZXZpY2VzXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGdhcDogJzhweCcsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuNzhyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4xNGVtJyxcbiAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6IFwiJ1BsdXMgSmFrYXJ0YSBTYW5zJywgc2Fucy1zZXJpZlwiXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJlLWRpc2NvdmVyLWxpbmtcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8c3Bhbj5ESVNDT1ZFUjwvc3Bhbj5cbiAgICAgICAgICAgICAgPEFycm93UmlnaHQgc2l6ZT17MTR9IC8+XG4gICAgICAgICAgICA8L0xpbms+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICB7LyogUm93IDIsIENvbCA0OiBQaG90byAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBvc2l0aW9uOiAncmVsYXRpdmUnLCBtaW5IZWlnaHQ6ICczMjBweCcgfX0+XG4gICAgICAgICAgICA8SW1hZ2Ugc3JjPVwiL2ltYWdlcy9vcmlnaW5hbC9kZW50YWwtY2hhaXItMS5qcGVnXCIgYWx0PVwiRGVudGFsIENhcmVcIiBmaWxsIHN0eWxlPXt7IG9iamVjdEZpdDogJ2NvdmVyJyB9fSB1bm9wdGltaXplZCAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgey8qIFRydXN0cGlsb3Qtc3R5bGUgR29vZ2xlIFJldmlld3MgVHJ1c3QgQmFyICovfVxuICAgICAgPFRydXN0QmFyIC8+XG5cbiAgICAgIHsvKiAzLiBWQUxVRSBQUk9QT1NJVElPTlMgKENsZWFuIE1pbmltYWxpc3QgUGlsbGFycykgKi99XG4gICAgICA8c2VjdGlvbiBzdHlsZT17eyBwYWRkaW5nOiAnNTJweCAwJywgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjZjFmNWY5JyB9fT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzM2cHgnIH19PlxuICAgICAgICAgICAgPGgyXG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ3ZhcigtLWZvbnQtaGVhZGluZyknLCBmb250U2l6ZTogJzIuMXJlbScsIGZvbnRXZWlnaHQ6IDgwMCwgbGV0dGVyU3BhY2luZzogJy0wLjAyZW0nLCBjb2xvcjogJyMwZjE3MmEnLCBtYXJnaW5Cb3R0b206ICc4cHgnLCBsaW5lSGVpZ2h0OiAxLjJcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgV2h5IEhlYWx0aGNhcmUgRmFjaWxpdGllcyBDaG9vc2UgRmFzdG9ubWVkXG4gICAgICAgICAgICA8L2gyPlxuICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcwLjk0cmVtJywgY29sb3I6ICcjNzg3MTZjJywgZm9udEZhbWlseTogXCInUGx1cyBKYWthcnRhIFNhbnMnLCBzYW5zLXNlcmlmXCIgfX0+XG4gICAgICAgICAgICAgIENlcnRpZmllZCBoZWFsdGhjYXJlIHRlY2hub2xvZ3ksIHJlZ3VsYXRvcnkgY29tcGxpYW5jZSwgYW5kIGRlcGVuZGFibGUgbWVkaWNhbCBsb2dpc3RpY3MgYWNyb3NzIFVBRS5cbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1uczogJ3JlcGVhdCg0LCBtaW5tYXgoMCwgMWZyKSknLFxuICAgICAgICAgICAgICBnYXA6ICcyMHB4J1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImhvbWUtZmVhdHVyZS1yZWYtZ3JpZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJiZS1mZWF0dXJlLWNhcmRcIj5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyB3aWR0aDogNDQsIGhlaWdodDogNDQsIGJvcmRlclJhZGl1czogJzhweCcsIGJhY2tncm91bmRDb2xvcjogJyNmMGZkZjQnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzE2cHgnIH19PlxuICAgICAgICAgICAgICAgIDxTaGllbGRDaGVjayBzaXplPXsyNH0gY29sb3I9XCIjMWY3YTViXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzFyZW0nLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnIzFjMTkxNycsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+MTAwJSBHZW51aW5lIE9FTSBXYXJyYW50eTwvaDM+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NHJlbScsIGNvbG9yOiAnIzU3NTM0ZScsIGxpbmVIZWlnaHQ6IDEuNiwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgICAgIERpcmVjdCBmYWN0b3J5LXNvdXJjZWQgZXF1aXBtZW50IGZyb20gYWNjcmVkaXRlZCBnbG9iYWwgbWFudWZhY3R1cmVycyB3aXRoIG9mZmljaWFsIFVBRSB3YXJyYW50eS5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmUtZmVhdHVyZS1jYXJkXCI+XG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgd2lkdGg6IDQ0LCBoZWlnaHQ6IDQ0LCBib3JkZXJSYWRpdXM6ICc4cHgnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZjBmZGY0JywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fT5cbiAgICAgICAgICAgICAgICA8VHJ1Y2sgc2l6ZT17MjR9IGNvbG9yPVwiIzFmN2E1YlwiIC8+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8aDMgc3R5bGU9e3sgZm9udFNpemU6ICcxcmVtJywgZm9udFdlaWdodDogNzAwLCBjb2xvcjogJyMxYzE5MTcnLCBtYXJnaW5Cb3R0b206ICc4cHgnIH19PjI04oCTNDhoIE5hdGlvbndpZGUgRGVsaXZlcnk8L2gzPlxuICAgICAgICAgICAgICA8cCBzdHlsZT17eyBmb250U2l6ZTogJzAuODRyZW0nLCBjb2xvcjogJyM1NzUzNGUnLCBsaW5lSGVpZ2h0OiAxLjYsIG1hcmdpbjogMCB9fT5cbiAgICAgICAgICAgICAgICBFeHByZXNzIHRlbXBlcmF0dXJlLWNvbnRyb2xsZWQgbG9naXN0aWNzIGFjcm9zcyBEdWJhaSwgQWJ1IERoYWJpLCBhbmQgTm9ydGhlcm4gRW1pcmF0ZXMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJlLWZlYXR1cmUtY2FyZFwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiA0NCwgaGVpZ2h0OiA0NCwgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZENvbG9yOiAnI2YwZmRmNCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XG4gICAgICAgICAgICAgICAgPENoZWNrQ2lyY2xlMiBzaXplPXsyNH0gY29sb3I9XCIjMWY3YTViXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzFyZW0nLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnIzFjMTkxNycsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+TU9IQVAgJmFtcDsgREhBIENvbXBsaWFudDwvaDM+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NHJlbScsIGNvbG9yOiAnIzU3NTM0ZScsIGxpbmVIZWlnaHQ6IDEuNiwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgICAgIEZ1bGwgbWVkaWNhbCBjb21wbGlhbmNlIHdpdGggVUFFIGhlYWx0aGNhcmUgcmVndWxhdG9yeSBzdGFuZGFyZHMgZm9yIGhvc3BpdGFsICZhbXA7IGNsaW5pY2FsIG9wZXJhdGlvbnMuXG4gICAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJlLWZlYXR1cmUtY2FyZFwiPlxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHdpZHRoOiA0NCwgaGVpZ2h0OiA0NCwgYm9yZGVyUmFkaXVzOiAnOHB4JywgYmFja2dyb3VuZENvbG9yOiAnI2YwZmRmNCcsIGRpc3BsYXk6ICdmbGV4JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0+XG4gICAgICAgICAgICAgICAgPFdyZW5jaCBzaXplPXsyNH0gY29sb3I9XCIjMWY3YTViXCIgLz5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxoMyBzdHlsZT17eyBmb250U2l6ZTogJzFyZW0nLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnIzFjMTkxNycsIG1hcmdpbkJvdHRvbTogJzhweCcgfX0+QmlvbWVkaWNhbCBUZWNobmljYWwgU3VwcG9ydDwvaDM+XG4gICAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44NHJlbScsIGNvbG9yOiAnIzU3NTM0ZScsIGxpbmVIZWlnaHQ6IDEuNiwgbWFyZ2luOiAwIH19PlxuICAgICAgICAgICAgICAgIEF1dGhvcml6ZWQgaW5zdGFsbGF0aW9uLCByZWd1bGFyIGVxdWlwbWVudCBjYWxpYnJhdGlvbiwgYW5kIHByb21wdCBtYWludGVuYW5jZSBzZXJ2aWNlcy5cbiAgICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgICB7LyogMy4gV0hPIEFSRSBXRSBTRUNUSU9OIChFeGFjdCBMaXZlIEZhc3RPbk1lZCBDb250ZW50KSAqL31cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImhvbWUtc2VjdGlvblwiIHN0eWxlPXt7IHBhZGRpbmc6ICc1NnB4IDAnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZmNmZGZkJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNmMWY1ZjknIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImhvbWUtd2hvLWdyaWRcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZml0LCBtaW5tYXgoMzAwcHgsIDFmcikpJyxcbiAgICAgICAgICAgICAgZ2FwOiAnNDBweCcsXG4gICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHsvKiBMZWZ0IENvbnRlbnQgKi99XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC44NXJlbScsXG4gICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA4MDAsXG4gICAgICAgICAgICAgICAgICB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzUxYjI5MScsXG4gICAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzZweCdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgV2hvIEFyZSBXZVxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPGgzXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMS4zcmVtJyxcbiAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzY0NzQ4YicsXG4gICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxNHB4J1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICBEdWJhaSwgVW5pdGVkIEFyYWIgRW1pcmF0ZXNcbiAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgPHBcbiAgICAgICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxcmVtJyxcbiAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzNDE1NScsXG4gICAgICAgICAgICAgICAgICBsaW5lSGVpZ2h0OiAxLjY1LFxuICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMjJweCdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgRmFzdG9uIE1lZCBpcyBhIFVBRS1iYXNlZCBwcm92aWRlciBvZiBoaWdoLXF1YWxpdHkgbWVkaWNhbCBhbmQgc3VyZ2ljYWwgZXF1aXBtZW50LiBXZSBzdXBwbHkgcmVsaWFibGUsIGlubm92YXRpdmUgc29sdXRpb25zIGFuZCBvZmZlciBwcm9mZXNzaW9uYWwgbWVkaWNhbCBlcXVpcG1lbnQgbWFpbnRlbmFuY2Ugc2VydmljZXMuIENvbW1pdHRlZCB0byBxdWFsaXR5IGFuZCBzZXJ2aWNlIGV4Y2VsbGVuY2UsIHdlIHN1cHBvcnQgaGVhbHRoY2FyZSBwcm92aWRlcnMgd2l0aCBhZHZhbmNlZCB0ZWNobm9sb2dpZXMgdGhhdCBlbmhhbmNlIHBhdGllbnQgY2FyZSBhbmQgY2xpbmljYWwgcGVyZm9ybWFuY2UuXG4gICAgICAgICAgICAgIDwvcD5cblxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAgICBocmVmPVwiL2Fib3V0LXVzXCJcbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdpbmxpbmUtZmxleCcsXG4gICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBnYXA6ICc4cHgnLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjNTFiMjkxJyxcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzExcHggMjRweCcsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzMwcHgnLFxuICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzAuOXJlbScsXG4gICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICAgICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzJ1xuICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICA8c3Bhbj5MZWFybiBNb3JlIEFib3V0IFVzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPEFycm93UmlnaHQgc2l6ZT17MTV9IC8+XG4gICAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICB7LyogUmlnaHQgSW1hZ2UgKi99XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS13aG8taW1nLWJveFwiXG4gICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgIG1heFdpZHRoOiAnMzgwcHgnLFxuICAgICAgICAgICAgICAgICAgYXNwZWN0UmF0aW86ICcxIC8gMScsXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8SW1hZ2VcbiAgICAgICAgICAgICAgICAgIHNyYz1cIi9pbWFnZXMvb3JpZ2luYWwvMTE4MTc5MmE2ODQxNDJhMWM1M2RhODI2MGM5NzIxMGUtMTAwa2ItcmVtb3ZlYmctcHJldmlldy0xMDBrYi0xLmpwZWdcIlxuICAgICAgICAgICAgICAgICAgYWx0PVwiRmFzdG9ubWVkIEhlYWx0aGNhcmUgU3BlY2lhbGlzdFwiXG4gICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBvYmplY3RGaXQ6ICdjb250YWluJyB9fVxuICAgICAgICAgICAgICAgICAgdW5vcHRpbWl6ZWRcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgey8qIDQuIE9VUiBCRVNUIFNFTExJTkcgTUVESUNBTCBFUVVJUE1FTlQgKEV4YWN0IExpdmUgRmFzdE9uTWVkIFByb2R1Y3RzKSAqL31cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImhvbWUtc2VjdGlvblwiIHN0eWxlPXt7IHBhZGRpbmc6ICc2MHB4IDAnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZmZmZmZmJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNmMWY1ZjknIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMzJweCcgfX0+XG4gICAgICAgICAgICA8aDJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLXRpdGxlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuODVyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICctMC4wMmVtJyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIE91ciBCZXN0IFNlbGxpbmcgTWVkaWNhbCBFcXVpcG1lbnRcbiAgICAgICAgICAgIDwvaDI+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJob21lLXByb2R1Y3RzLWdyaWRcIlxuICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgZGlzcGxheTogJ2dyaWQnLFxuICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zOiAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDE4NXB4LCAxZnIpKScsXG4gICAgICAgICAgICAgIGdhcDogJzE0cHgnXG4gICAgICAgICAgICB9fVxuICAgICAgICAgID5cbiAgICAgICAgICAgIHtsaXZlQmVzdFNlbGxlcnMubWFwKHByb2R1Y3QgPT4gKFxuICAgICAgICAgICAgICA8UHJvZHVjdENhcmQga2V5PXtwcm9kdWN0LmlkfSBwcm9kdWN0PXtwcm9kdWN0fSAvPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpblRvcDogJzM2cHgnIH19PlxuICAgICAgICAgICAgPExpbmtcbiAgICAgICAgICAgICAgaHJlZj1cIi9zaG9wXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWZsZXgnLFxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgIGdhcDogJzhweCcsXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgICBib3JkZXI6ICcycHggc29saWQgIzBmMTcyYScsXG4gICAgICAgICAgICAgICAgcGFkZGluZzogJzExcHggMjhweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMzBweCcsXG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjlyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDcwMCxcbiAgICAgICAgICAgICAgICB0ZXh0RGVjb3JhdGlvbjogJ25vbmUnLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycydcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidmlldy1hbGwtYnRuXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHNwYW4+VmlldyBBbGwgTWVkaWNhbCBFcXVpcG1lbnQ8L3NwYW4+XG4gICAgICAgICAgICAgIDxBcnJvd1JpZ2h0IHNpemU9ezE1fSAvPlxuICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvc2VjdGlvbj5cblxuICAgICAgey8qIDUuIFdITyBXRSBTRVJWRSDigJQgSEVBTFRIQ0FSRSBTRUNUT1JTIFdFIFNVUFBPUlQgKEV4YWN0IExpdmUgRmFzdE9uTWVkKSAqL31cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImhvbWUtc2VjdGlvblwiIHN0eWxlPXt7IHBhZGRpbmc6ICc2MHB4IDAnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZjhmYWZjJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNmMWY1ZjknIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgdGV4dEFsaWduOiAnY2VudGVyJywgbWFyZ2luQm90dG9tOiAnMzZweCcgfX0+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgZm9udFNpemU6ICcwLjgycmVtJyxcbiAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA4MDAsXG4gICAgICAgICAgICAgICAgdGV4dFRyYW5zZm9ybTogJ3VwcGVyY2FzZScsXG4gICAgICAgICAgICAgICAgY29sb3I6ICcjNTFiMjkxJyxcbiAgICAgICAgICAgICAgICBsZXR0ZXJTcGFjaW5nOiAnMC4wOGVtJyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICc2cHgnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFdobyBXZSBTZXJ2ZVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8aDJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLXRpdGxlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuODVyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICctMC4wMmVtJyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcxMHB4J1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICBIZWFsdGhjYXJlIFNlY3RvcnMgV2UgU3VwcG9ydFxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC45NHJlbScsIGNvbG9yOiAnIzY0NzQ4YicsIG1heFdpZHRoOiAnNjQwcHgnLCBtYXJnaW46ICcwIGF1dG8nIH19PlxuICAgICAgICAgICAgICBGcm9tIGxhcmdlIG11bHRpLXNwZWNpYWx0eSBob3NwaXRhbHMgdG8gaG9tZSBoZWFsdGhjYXJlIHByb3ZpZGVycywgb3VyIGVxdWlwbWVudCBzb2x1dGlvbnMgYXJlIHRhaWxvcmVkIGZvciBldmVyeSBoZWFsdGhjYXJlIHNldHRpbmcuXG4gICAgICAgICAgICA8L3A+XG4gICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJob21lLXNlY3RvcnMtZ3JpZFwiXG4gICAgICAgICAgICBzdHlsZT17e1xuICAgICAgICAgICAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM6ICdyZXBlYXQoNCwgbWlubWF4KDAsIDFmcikpJyxcbiAgICAgICAgICAgICAgZ2FwOiAnMThweCdcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgPlxuICAgICAgICAgICAge3NlY3RvcnMubWFwKHMgPT4gKFxuICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAga2V5PXtzLnRpdGxlfVxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ3JlbGF0aXZlJyxcbiAgICAgICAgICAgICAgICAgIGhlaWdodDogJzIxMHB4JyxcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDAsIDAsIDAsIDAuMDUpJ1xuICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2VjdG9yLWNhcmQgZ3JvdXBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEltYWdlXG4gICAgICAgICAgICAgICAgICBzcmM9e3MuaW1hZ2V9XG4gICAgICAgICAgICAgICAgICBhbHQ9e3MudGl0bGV9XG4gICAgICAgICAgICAgICAgICBmaWxsXG4gICAgICAgICAgICAgICAgICBzdHlsZT17eyBvYmplY3RGaXQ6ICdjb3ZlcicsIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC40cyBlYXNlJyB9fVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwic2VjdG9yLWltZ1wiXG4gICAgICAgICAgICAgICAgICB1bm9wdGltaXplZFxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICAgICAgICAgIGluc2V0OiAwLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbGluZWFyLWdyYWRpZW50KHRvIHRvcCwgcmdiYSgxNSwgMjMsIDQyLCAwLjg1KSAwJSwgcmdiYSgxNSwgMjMsIDQyLCAwLjIpIDYwJSwgcmdiYSgxNSwgMjMsIDQyLCAwKSAxMDAlKScsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnLFxuICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMThweCdcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGgzXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcxLjE4cmVtJyxcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiA4MDAsXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICcycHgnXG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtzLnRpdGxlfVxuICAgICAgICAgICAgICAgICAgPC9oMz5cbiAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IGZvbnRTaXplOiAnMC44cmVtJywgY29sb3I6ICcjNTFiMjkxJywgZm9udFdlaWdodDogNzAwIH19PlxuICAgICAgICAgICAgICAgICAgICBDZXJ0aWZpZWQgVUFFIFN1cHBseSBTb2x1dGlvbnNcbiAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHsvKiA2LiBCUkFORCBQQVJUTkVSUyAoRXhhY3QgTGl2ZSBGYXN0T25NZWQgTG9nb3MpICovfVxuICAgICAgPHNlY3Rpb25cbiAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uXCJcbiAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICBwYWRkaW5nOiAnNjRweCAwJyxcbiAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjhmYWZjJyxcbiAgICAgICAgICBib3JkZXJUb3A6ICcxcHggc29saWQgI2UyZThmMCcsXG4gICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNlMmU4ZjAnXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XG4gICAgICAgICAgPGRpdiBzdHlsZT17eyB0ZXh0QWxpZ246ICdjZW50ZXInLCBtYXhXaWR0aDogJzcwMHB4JywgbWFyZ2luOiAnMCBhdXRvIDM2cHgnIH19PlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZTZmN2YwJyxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMxZjdhNWInLFxuICAgICAgICAgICAgICAgIHBhZGRpbmc6ICc1cHggMTRweCcsXG4gICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOTk5cHgnLFxuICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMC43OHJlbScsXG4gICAgICAgICAgICAgICAgZm9udFdlaWdodDogNzAwLFxuICAgICAgICAgICAgICAgIHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICcwLjA2ZW0nLFxuICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzEwcHgnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIEF1dGhvcml6ZWQgR2xvYmFsIFBhcnRuZXJzXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8aDJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG9tZS1zZWN0aW9uLXRpdGxlXCJcbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuNjVyZW0nLFxuICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IDgwMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwZjE3MmEnLFxuICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICctMC4wMmVtJyxcbiAgICAgICAgICAgICAgICBtYXJnaW5Cb3R0b206ICc4cHgnXG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIFJlbGlhYmxlIFBhcnRuZXIgaW4gSGVhbHRoY2FyZSBJbmZyYXN0cnVjdHVyZVxuICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDxwIHN0eWxlPXt7IGZvbnRTaXplOiAnMC45MnJlbScsIGNvbG9yOiAnIzY0NzQ4YicsIG1hcmdpbjogMCwgbGluZUhlaWdodDogMS41IH19PlxuICAgICAgICAgICAgICBEaXJlY3QgcHJvY3VyZW1lbnQgcGFydG5lcnNoaXBzIHdpdGggY2VydGlmaWVkIGludGVybmF0aW9uYWwgbWFudWZhY3R1cmVycyBlbnN1cmluZyBnZW51aW5lIG1lZGljYWwgZXF1aXBtZW50IGFjcm9zcyB0aGUgVUFFLlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJob21lLWJyYW5kcy13cmFwXCI+XG4gICAgICAgICAgICB7YnJhbmRzLm1hcChiID0+IChcbiAgICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgIGtleT17Yi5uYW1lfVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImJyYW5kLWxvZ28tY2FyZFwiXG4gICAgICAgICAgICAgICAgdGl0bGU9e2IubmFtZX1cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcG9zaXRpb246ICdyZWxhdGl2ZScsIHdpZHRoOiAnMTAwJScsIGhlaWdodDogJzEwMCUnIH19PlxuICAgICAgICAgICAgICAgICAgPEltYWdlXG4gICAgICAgICAgICAgICAgICAgIHNyYz17Yi5pbWFnZX1cbiAgICAgICAgICAgICAgICAgICAgYWx0PXtiLm5hbWV9XG4gICAgICAgICAgICAgICAgICAgIGZpbGxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgb2JqZWN0Rml0OiAnY29udGFpbicgfX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYnJhbmQtbG9nby1pbWdcIlxuICAgICAgICAgICAgICAgICAgICB1bm9wdGltaXplZFxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICApKX1cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L3NlY3Rpb24+XG5cbiAgICAgIHsvKiA3LiBWRVJJRklFRCBHT09HTEUgUkVWSUVXUyAoVHJ1c3RwaWxvdC1TdHlsZSBHTUIgU2hvd2Nhc2UpICovfVxuICAgICAgPEdvb2dsZVJldmlld3NTZWN0aW9uIC8+XG5cbiAgICAgIHsvKiA4LiBGQVEgQUNDT1JESU9OIChFeGFjdCBMaXZlIEZhc3RPbk1lZCBDb250ZW50KSAqL31cbiAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cImhvbWUtc2VjdGlvblwiIHN0eWxlPXt7IHBhZGRpbmc6ICc1MHB4IDAnLCBiYWNrZ3JvdW5kQ29sb3I6ICcjZmNmZGZkJywgYm9yZGVyVG9wOiAnMXB4IHNvbGlkICNmMWY1ZjknIH19PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWF4V2lkdGg6ICc3ODBweCcsIG1hcmdpbjogJzAgYXV0bycgfX0+XG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHRleHRBbGlnbjogJ2NlbnRlcicsIG1hcmdpbkJvdHRvbTogJzI4cHgnIH19PlxuICAgICAgICAgICAgICA8aDJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJob21lLXNlY3Rpb24tdGl0bGVcIlxuICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICBmb250U2l6ZTogJzEuNjVyZW0nLFxuICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogODAwLFxuICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMGYxNzJhJyxcbiAgICAgICAgICAgICAgICAgIGxldHRlclNwYWNpbmc6ICctMC4wMmVtJyxcbiAgICAgICAgICAgICAgICAgIG1hcmdpbkJvdHRvbTogJzZweCdcbiAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgRnJlcXVlbnRseSBBc2tlZCBRdWVzdGlvbnNcbiAgICAgICAgICAgICAgPC9oMj5cbiAgICAgICAgICAgIDwvZGl2PlxuXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsIGdhcDogJzEycHgnIH19PlxuICAgICAgICAgICAgICB7ZmFxSXRlbXMubWFwKChpdGVtLCBpZHgpID0+IChcbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBrZXk9e2l0ZW0ucX1cbiAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgI2VlZjJmNicsXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzEwcHgnLFxuICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0b2dnbGVGYXEoaWR4KX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmFxLWJ0blwiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAnMThweCAyMnB4JyxcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiAnbm9uZScsXG4gICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgdGV4dEFsaWduOiAnbGVmdCdcbiAgICAgICAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmFxLXFcIiBzdHlsZT17eyBmb250U2l6ZTogJzAuOThyZW0nLCBmb250V2VpZ2h0OiA3MDAsIGNvbG9yOiAnIzBmMTcyYScgfX0+XG4gICAgICAgICAgICAgICAgICAgICAge2l0ZW0ucX1cbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBjb2xvcjogJyM1MWIyOTEnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInIH19PlxuICAgICAgICAgICAgICAgICAgICAgIHtvcGVuRmFxID09PSBpZHggPyA8Q2hldnJvblVwIHNpemU9ezE4fSAvPiA6IDxDaGV2cm9uRG93biBzaXplPXsxOH0gLz59XG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAge29wZW5GYXEgPT09IGlkeCAmJiAoXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmFxLWFcIiBzdHlsZT17eyBwYWRkaW5nOiAnMCAyMnB4IDE4cHggMjJweCcsIGNvbG9yOiAnIzQ3NTU2OScsIGZvbnRTaXplOiAnMC45MnJlbScsIGxpbmVIZWlnaHQ6IDEuNiB9fT5cbiAgICAgICAgICAgICAgICAgICAgICB7aXRlbS5hfVxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICkpfVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuXG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VTdGF0ZSIsIkxpbmsiLCJJbWFnZSIsIkFycm93UmlnaHQiLCJDaGV2cm9uRG93biIsIkNoZXZyb25VcCIsIk1lc3NhZ2VDaXJjbGUiLCJDaGVja0NpcmNsZTIiLCJTaGllbGRDaGVjayIsIlRydWNrIiwiV3JlbmNoIiwiUHJvZHVjdENhcmQiLCJHb29nbGVSZXZpZXdzU2VjdGlvbiIsIlRydXN0QmFyIiwiY2F0ZWdvcmllcyIsIm5hbWUiLCJzbHVnIiwiaW1hZ2UiLCJsaXZlQmVzdFNlbGxlcnMiLCJpZCIsInNrdSIsInByb2R1Y3RUeXBlIiwicHVyY2hhc2VNb2RlIiwicmVndWxhclByaWNlIiwic2FsZVByaWNlIiwiY2F0ZWdvcnkiLCJicmFuZCIsInNob3J0RGVzY3JpcHRpb24iLCJmdWxsRGVzY3JpcHRpb24iLCJtYWluSW1hZ2UiLCJnYWxsZXJ5SW1hZ2VzIiwic3RvY2tRdWFudGl0eSIsImxvd1N0b2NrVGhyZXNob2xkIiwic3RvY2tTdGF0dXMiLCJ0ZWNobmljYWxTcGVjcyIsImZlYXR1cmVzIiwiYXBwbGljYXRpb25zIiwiaXNGZWF0dXJlZCIsImlzQmVzdFNlbGxlciIsImlzTmV3Iiwic3RhdHVzIiwiZG9jdW1lbnRzIiwidGFncyIsImNyZWF0ZWRBdCIsInVwZGF0ZWRBdCIsInNlY3RvcnMiLCJ0aXRsZSIsImJyYW5kcyIsImZhcUl0ZW1zIiwicSIsImEiLCJoZXJvU2xpZGVzIiwidGFnIiwic3VidGl0bGUiLCJsaWZlc3R5bGVJbWFnZSIsImJ1dHRvblRleHQiLCJsaW5rIiwiSG9tZVBhZ2UiLCJvcGVuRmFxIiwic2V0T3BlbkZhcSIsImFjdGl2ZVNsaWRlSWR4Iiwic2V0QWN0aXZlU2xpZGVJZHgiLCJ0b2dnbGVGYXEiLCJpbmRleCIsImhhbmRsZVByZXZTbGlkZSIsInByZXYiLCJsZW5ndGgiLCJoYW5kbGVOZXh0U2xpZGUiLCJjdXJyZW50U2xpZGUiLCJkaXYiLCJzdHlsZSIsImJhY2tncm91bmRDb2xvciIsIm1pbkhlaWdodCIsImNvbG9yIiwic2VjdGlvbiIsImJhY2tncm91bmQiLCJwYWRkaW5nIiwicG9zaXRpb24iLCJvdmVyZmxvdyIsImJvcmRlckJvdHRvbSIsImNsYXNzTmFtZSIsInBhZGRpbmdSaWdodCIsImRpc3BsYXkiLCJhbGlnbkl0ZW1zIiwiZ2FwIiwibWFyZ2luQm90dG9tIiwic3BhbiIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsImxldHRlclNwYWNpbmciLCJ0ZXh0VHJhbnNmb3JtIiwiZm9udEZhbWlseSIsImhlaWdodCIsIndpZHRoIiwiaDEiLCJsaW5lSGVpZ2h0IiwicCIsIm1heFdpZHRoIiwiZmxleFdyYXAiLCJocmVmIiwidGV4dERlY29yYXRpb24iLCJ0cmFuc2l0aW9uIiwic2l6ZSIsImVuY29kZVVSSUNvbXBvbmVudCIsInRhcmdldCIsInJlbCIsImJvcmRlciIsImJ1dHRvbiIsIm9uQ2xpY2siLCJhcmlhLWxhYmVsIiwic3ZnIiwidmlld0JveCIsImZpbGwiLCJwYXRoIiwiZCIsInN0cm9rZSIsInN0cm9rZVdpZHRoIiwic3Ryb2tlTGluZWNhcCIsInN0cm9rZUxpbmVqb2luIiwianVzdGlmeUNvbnRlbnQiLCJib3hTaGFkb3ciLCJ6SW5kZXgiLCJzcmMiLCJhbHQiLCJvYmplY3RGaXQiLCJmaWx0ZXIiLCJ1bm9wdGltaXplZCIsInByaW9yaXR5IiwibGVmdCIsImZsZXhEaXJlY3Rpb24iLCJTdHJpbmciLCJwYWRTdGFydCIsIm1hcmdpbiIsInRyYW5zZm9ybSIsImgzIiwidGV4dEFsaWduIiwiaDIiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiYm9yZGVyUmFkaXVzIiwiYm9yZGVyVG9wIiwiYXNwZWN0UmF0aW8iLCJtYXAiLCJwcm9kdWN0IiwibWFyZ2luVG9wIiwicyIsImluc2V0IiwiYiIsIml0ZW0iLCJpZHgiLCJjdXJzb3IiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==
//# sourceURL=webpack-internal:///(ssr)/./app/page.tsx

export default HomePage;
