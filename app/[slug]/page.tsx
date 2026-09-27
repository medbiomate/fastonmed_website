import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Award,
  Clock,
  Sparkles,
  HeartHandshake,
  TrendingUp,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';
import { getSharedEditorialPage } from '@/lib/server-pages';
import { getAllProducts } from '@/lib/server-catalog';
import EditorialPageClient, {
  CategoryItem,
  IndustryItem,
  BrandPartner,
} from '@/components/EditorialPageClient';
import type { Product } from '@/lib/types';
import type { FAQItem } from '@/lib/editorial-pages';
import NotFound from '@/app/not-found';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getSharedEditorialPage(slug);
  if (!page) {
    return {
      title: 'Page Not Found | Best Medical Equipment Supplier in UAE | FastonMed',
      robots: { index: false, follow: true }
    };
  }

  const title = `${page.title} | Best Medical Equipment Supplier in UAE | FastonMed`;
  const description =
    page.description ||
    `${page.title} – FastonMed is the Best Medical Equipment Supplier in UAE. Certified clinical solutions, ICU ventilators, and hospital equipment across Dubai and Abu Dhabi.`;
  const canonicalUrl = `https://www.fastonmed.com/${slug}`;

  return {
    title,
    description,
    keywords: [
      page.title,
      'Best Medical Equipment Supplier in UAE',
      'Medical Equipment Supplier in UAE',
      'Hospital Supplies UAE',
      'Biomedical Engineering UAE',
      'FastonMed Healthcare'
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'FastonMed Healthcare Equipment LLC',
      locale: 'en_AE',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

// 12 Product Categories matching the authentic Fastonmed architecture
const HEALTHCARE_CATEGORIES: CategoryItem[] = [
  { name: 'Accessories', slug: 'accessories', image: '/images/original/accessories-1.jpeg' },
  { name: 'Consumables and Disposables', slug: 'consumables-and-disposables', image: '/images/original/consumables-1.jpeg' },
  { name: 'Dermatology Equipment', slug: 'dermatology-equipment', image: '/images/original/WhatsApp-Image-2025-06-28-at-18.29.38-1-1.jpeg' },
  { name: 'Dental Equipment', slug: 'dental-equipments', image: '/images/original/dental-chair-1.jpeg' },
  { name: 'ENT Equipment', slug: 'ent-equipments', image: '/images/original/ent-1.jpeg' },
  { name: 'General Medical Devices', slug: 'general-medical-devices', image: '/images/original/genaral-equipments-1.jpeg' },
  { name: 'Hospital Furniture', slug: 'hospital-furniture', image: '/images/original/WhatsApp-Image-2025-06-28-at-18.29.37-1.jpeg' },
  { name: 'Gynecology Equipment', slug: 'labor-room-equipments', image: '/images/original/gynocology-1.jpeg' },
  { name: 'Laboratory Equipment', slug: 'laboratory-equipment', image: '/images/original/laborotory-equipments-1.jpeg' },
  { name: 'Ophthalmology Equipment', slug: 'ophthalmology-equipments', image: '/images/original/ofthemology-1.jpeg' },
  { name: 'Physiotherapy Equipment', slug: 'physiotherapy-equipments', image: '/images/original/phsyotherapy-1.jpeg' },
  { name: 'Radiology Equipment', slug: 'radiology-equipments', image: '/images/original/radiology-1.jpeg' },
];

// 6 Healthcare Industries Supported
const HEALTHCARE_INDUSTRIES: IndustryItem[] = [
  {
    title: 'Hospitals',
    subtitle: 'Multi-specialty institutions',
    image: '/images/original/hospital-image-1.webp',
  },
  {
    title: 'Clinics',
    subtitle: 'General & specialty care',
    image: '/images/original/clinic-1.webp',
  },
  {
    title: 'Diagnostic Centers',
    subtitle: 'Advanced testing systems',
    image: '/images/original/diagnostic-centers-1.webp',
  },
  {
    title: 'Pharmacies',
    subtitle: 'Medical devices & aids',
    image: '/images/original/pharmacy-1.webp',
  },
  {
    title: 'Home Healthcare',
    subtitle: 'Patient-friendly solutions',
    image: '/images/original/home-healthcare-1.webp',
  },
  {
    title: 'Government Projects',
    subtitle: 'Public health infrastructure',
    image: '/images/original/govermnet-project-1.webp',
  },
];

// Brand Partners
const BRAND_PARTNERS: BrandPartner[] = [
  { name: 'Authorized Medical Partner', image: '/images/original/images-35-1.png' },
  { name: 'MIR Medical Spirometry', image: '/images/original/MIR-logo-e1782554862181-1.png' },
  { name: 'Global Biomedical Solutions', image: '/images/original/0000_9eeb216787af38a69b7d8b3817ff9b5c7336100e-2.webp' },
  { name: 'Healthcare Manufacturer', image: '/images/original/images-36-1.png' },
  { name: 'Clinical Instruments', image: '/images/original/download-16-1.png' },
  { name: 'Certified Devices', image: '/images/original/download-17-1.png' },
];

// Fallback UAE healthcare procurement FAQs
const DEFAULT_HEALTHCARE_FAQS: FAQItem[] = [
  {
    question: 'Are all equipment and medical supplies certified for clinical use in the UAE?',
    answer:
      'Yes. FastonMed provides genuine medical devices and equipment that conform to international quality standards (CE, ISO, FDA) with official manufacturer warranties.',
  },
  {
    question: 'How quickly can FastonMed deliver equipment across Dubai and other Emirates?',
    answer:
      'In-stock equipment and consumables are dispatched promptly with standard 1–2 business day delivery across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain.',
  },
  {
    question: 'Do you provide professional installation and biomedical calibration services?',
    answer:
      'Yes. Our dedicated biomedical engineering and technical team provides complete on-site installation, operational calibration, and staff handover training for healthcare facilities.',
  },
  {
    question: 'Does FastonMed assist with complete hospital, clinic, or specialized department setup?',
    answer:
      'Absolutely. We assist healthcare entrepreneurs, hospital administrators, and clinic directors with turnkey equipment planning, procurement lists, room layouts, and lifecycle maintenance contracts (AMC/CMC).',
  },
];

export default async function EditorialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getSharedEditorialPage(slug);
  if (!page) notFound();

  // Load catalog products to intelligently populate the featured equipment grid
  const allProducts = await getAllProducts();

  let featuredProducts: Product[] = [];

  // 1. If explicit product IDs are assigned to this page, prioritize them
  if (page.featuredProductIds && page.featuredProductIds.length > 0) {
    const idSet = new Set(page.featuredProductIds.map((id) => id.toLowerCase()));
    featuredProducts = allProducts.filter(
      (p) => idSet.has(p.id.toLowerCase()) || idSet.has(p.slug.toLowerCase())
    );
  }

  // 2. If needed, match products by category or specialty keywords
  if (featuredProducts.length < 4) {
    const targetCategory = (page.featuredCategory || '').toLowerCase();
    const slugKeywords = slug.replace(/-/g, ' ').toLowerCase().split(/\s+/).filter((w) => w.length > 3);

    const additionalMatches = allProducts.filter((p) => {
      if (featuredProducts.some((fp) => fp.id === p.id)) return false;
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();

      if (targetCategory && cat.includes(targetCategory)) return true;
      return slugKeywords.some((kw) => name.includes(kw) || cat.includes(kw));
    });

    featuredProducts.push(...additionalMatches.slice(0, 8 - featuredProducts.length));
  }

  // 3. Fallback to top products if still under minimum
  if (featuredProducts.length < 4) {
    const existingIds = new Set(featuredProducts.map((p) => p.id));
    const fallbacks = allProducts.filter(
      (p) => !existingIds.has(p.id) && p.mainImage && !p.mainImage.includes('placeholder')
    );
    featuredProducts.push(...fallbacks.slice(0, 8 - featuredProducts.length));
  }

  const faqs = (page.faqs && page.faqs.length > 0) ? page.faqs : DEFAULT_HEALTHCARE_FAQS;
  const heroImage = page.heroImage || (slug.includes('dental') ? '/products/dental-chair.jpg' : '/images/original/hospital-image-1.webp');

  // WhatsApp enquiry link for hero CTA
  const heroWaMessage = encodeURIComponent(
    `Hello FastonMed UAE,\nI am viewing your page "${page.title}" and would like to enquire about your equipment solutions and pricing.`
  );
  const heroWaLink = `https://wa.me/971508893589?text=${heroWaMessage}`;

  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      {/* BREADCRUMB STRIP (Low-Profile SEO Hierarchy) */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #eef2f6',
          padding: '6px 0',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <nav
            aria-label="Breadcrumb"
            className="seo-breadcrumb"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.68rem',
              color: '#94a3b8',
              flexWrap: 'wrap',
              lineHeight: 1.2
            }}
          >
            <Link href="/" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
              Home
            </Link>
            <ChevronRight size={10} color="#cbd5e1" />
            <Link href="/shop" style={{ color: '#94a3b8', textDecoration: 'none', fontWeight: 500 }}>
              Equipment & Solutions
            </Link>
            <ChevronRight size={10} color="#cbd5e1" />
            <span style={{ color: '#64748b', fontWeight: 500 }}>{page.title}</span>
          </nav>
        </div>
      </div>

      {/* HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #f4fbf7 50%, #ffffff 100%)',
          borderBottom: '1px solid #e2ece7',
          padding: 'clamp(48px, 6vw, 76px) 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'clamp(32px, 5vw, 60px)',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Eyebrow, H1, Lead Copy, CTAs */}
            <div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 30,
                  backgroundColor: '#dcfce7',
                  color: '#166534',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                }}
              >
                <ShieldCheck size={16} />
                {page.eyebrow || 'Trusted Across UAE'}
              </span>

              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 3.25rem)',
                  lineHeight: 1.15,
                  fontWeight: 900,
                  color: '#0f2923',
                  margin: '0 0 20px',
                  letterSpacing: '-0.025em',
                }}
              >
                {page.title}
              </h1>

              <div
                style={{
                  fontSize: 'clamp(0.96rem, 1.15vw, 1.08rem)',
                  lineHeight: 1.75,
                  color: '#475569',
                  display: 'grid',
                  gap: 14,
                  marginBottom: 32,
                }}
              >
                {page.description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <a
                  href="#featured-equipment"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '13px 28px',
                    backgroundColor: '#134e4a',
                    color: '#ffffff',
                    borderRadius: 30,
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(19, 78, 74, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Explore Equipment
                </a>

                <a
                  href={heroWaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '13px 26px',
                    backgroundColor: '#25D366',
                    color: '#ffffff',
                    borderRadius: 30,
                    fontSize: '0.94rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <MessageCircle size={18} />
                  Buy via WhatsApp
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'clamp(280px, 35vw, 420px)',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px -12px rgba(15, 41, 35, 0.15)',
                  border: '1px solid #d1ded9',
                  backgroundColor: '#ffffff',
                }}
              >
                <Image
                  src={heroImage}
                  alt={page.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 540px"
                  style={{ objectFit: 'cover' }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    right: 16,
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    padding: '12px 18px',
                    borderRadius: 12,
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        backgroundColor: '#dcfce7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#166534',
                      }}
                    >
                      <Award size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f2923' }}>
                        FastonMed Dubai
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Certified Healthcare Equipment Supplier
                      </div>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      backgroundColor: '#134e4a',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: 20,
                    }}
                  >
                    UAE Official
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 CORE VALUE PILLARS STRIP */}
      <section
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #edf2f0',
          padding: '24px 0',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {[
              { label: 'International Quality Standards', icon: ShieldCheck },
              { label: 'Fast UAE-Wide Delivery', icon: Clock },
              { label: 'Installation & After-Sales', icon: Stethoscope },
              { label: 'Dedicated Biomedical Support', icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    backgroundColor: '#f8faf9',
                    border: '1px solid #e2ebe7',
                    borderRadius: 12,
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: '#e6f4ea',
                      color: '#1b7a54',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2923' }}>
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDITORIAL NARRATIVE & CLINICAL BENEFIT SECTIONS */}
      {page.sections && page.sections.length > 0 && (
        <section
          style={{
            padding: '64px 0',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #edf2f0',
          }}
        >
          <div className="container" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'grid', gap: 36 }}>
              {page.sections.map((sec, idx) => {
                const hasPoints = sec.points && sec.points.length > 0;
                return (
                  <article
                    key={sec.title || idx}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 18,
                      border: '1px solid #e2ebe7',
                      padding: 'clamp(28px, 4vw, 44px)',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                    }}
                  >
                    <h2
                      style={{
                        fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)',
                        fontWeight: 800,
                        color: '#0f2923',
                        margin: '0 0 16px',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {sec.title}
                    </h2>

                    <div style={{ display: 'grid', gap: 14, color: '#475569', lineHeight: 1.8, fontSize: '0.96rem' }}>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} style={{ margin: 0 }}>
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* BENEFIT CARDS (Clinical Excellence, Patient Comfort, Operational Efficiency, etc.) */}
                    {hasPoints && (
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                          gap: 16,
                          marginTop: 28,
                        }}
                      >
                        {sec.points!.map((point, ptIdx) => {
                          // Select icon based on index or keyword
                          const icons = [Sparkles, HeartHandshake, Clock, ShieldCheck, Award, TrendingUp];
                          const IconComp = icons[ptIdx % icons.length];
                          return (
                            <div
                              key={ptIdx}
                              style={{
                                backgroundColor: '#f8faf9',
                                border: '1px solid #d9e6e1',
                                borderRadius: 12,
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                              }}
                            >
                              <div
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  backgroundColor: '#dcfce7',
                                  color: '#166534',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <IconComp size={18} />
                              </div>
                              <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f2923' }}>
                                {point}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CLIENT-SIDE INTERACTIVE LAYOUT: Categories, Featured Products Grid, Industries, Brand Partners, FAQs Accordion, Contact Form */}
      <EditorialPageClient
        slug={slug}
        title={page.title}
        categories={HEALTHCARE_CATEGORIES}
        featuredProducts={featuredProducts}
        industries={HEALTHCARE_INDUSTRIES}
        partners={BRAND_PARTNERS}
        faqs={faqs}
      />
    </main>
  );
}
