'use client';

import React from 'react';
import { ShieldCheck, Award, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import TrustBar from '@/components/TrustBar';

export default function AboutPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '48px 0 80px' }}>
      <div className="container">
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', marginBottom: '56px' }}>
          <span style={{ color: '#51b291', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            About FastonMed
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            Empowering Healthcare Through Precision Engineering & Certified Supply
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, marginTop: '16px' }}>
            Based in Dubai, UAE, FastonMed (FASTONMED TRADING L.L.C) is a leading distributor of capital clinical equipment, temperature-controlled laboratory cold-chain systems, and biomedical maintenance contracts across the GCC region.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginBottom: '64px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '36px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eaf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={26} color="#51b291" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Our Mission
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
              To supply UAE hospitals, surgery centers, aesthetic clinics, and specialized dental practices with reliable, certified medical technology backed by rapid biomedical response times and transparent commercial terms.
            </p>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '36px', border: '1px solid #e2e8f0' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#eaf7f2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Award size={26} color="#51b291" />
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
              Quality & Compliance
            </h2>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
              All instruments and machinery conform to rigorous international quality and healthcare safety frameworks. Every shipment includes factory calibration documentation, serial verification, and full manufacturer warranty.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '48px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', textAlign: 'center' }}>
            FastonMed Clinical Capabilities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              'Direct Partnership with Global OEM Manufacturers',
              'Cold-Chain Logistics with Real-time GPS & Temperature Telemetry',
              'Biomedical Engineering Calibration Lab in Dubai',
              'Comprehensive Annual Maintenance Contracts (AMC)',
              'Clinical Training & Doctor Onboarding for High-Tech Systems',
              'Full Compliance with UAE FTA 5% Tax Invoicing & Customs Clearances'
            ].map((pillar, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <CheckCircle2 size={20} color="#51b291" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.92rem', color: '#334155', fontWeight: 500, lineHeight: 1.5 }}>{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ marginTop: '56px' }}>
        <TrustBar />
      </div>
    </div>
  );
}
