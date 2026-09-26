'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, Mail, ChevronRight } from 'lucide-react';

const announcements = [
  '⚙️ Reliable Equipment, Exceptional Care.',
  '💡 Empowering Healthcare with Precision Technology.',
  '🔧 Complete Solutions — From Sales to Service.',
  '💼 Bringing Advanced Medical Equipment to Your Doorstep.'
];

export default function Topbar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#51b291', color: '#ffffff', fontSize: '0.82rem', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
      <div className="container flex items-center justify-between">
        {/* Left: Contact Info */}
        <div className="flex items-center gap-4" style={{ fontWeight: 500 }}>
          <a href="tel:+971508893589" className="flex items-center gap-2" style={{ color: '#ffffff', opacity: 0.95 }}>
            <Phone size={13} />
            <span>+971 508 893 589</span>
          </a>
          <span style={{ opacity: 0.4 }}>|</span>
          <a href="mailto:sales@fastonmed.com" className="flex items-center gap-2" style={{ color: '#ffffff', opacity: 0.95 }}>
            <Mail size={13} />
            <span>sales@fastonmed.com</span>
          </a>
        </div>

        {/* Center: Rotating Announcement Slider */}
        <div className="flex items-center justify-center flex-1" style={{ textAlign: 'center', padding: '0 16px' }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.01em', transition: 'all 0.3s ease' }}>
            {announcements[index]}
          </span>
        </div>

        {/* Right: Currency & Fast Admin Link */}
        <div className="flex items-center gap-3">
          <span style={{ fontWeight: 600, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '12px' }}>
            AED (د.إ)
          </span>
          <Link href="/admin" style={{ color: '#ffffff', opacity: 0.9, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Admin Console</span>
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
