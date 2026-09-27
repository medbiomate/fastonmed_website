'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();

  // Hide in /admin
  if (pathname?.startsWith('/admin')) return null;

  const defaultMsg = encodeURIComponent('Hello FastonMed, I am browsing your medical equipment store and would like to speak with a sales specialist.');
  const waUrl = `https://wa.me/971508893589?text=${defaultMsg}`;

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .whatsapp-floating-btn {
            bottom: 16px !important;
            right: 16px !important;
            width: 48px !important;
            height: 48px !important;
          }
          .whatsapp-floating-btn svg {
            width: 26px !important;
            height: 26px !important;
          }
        }
      `}</style>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact FastonMed via WhatsApp"
        className="whatsapp-floating-btn"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#25d366',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
          zIndex: 900,
          cursor: 'pointer',
          transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          textDecoration: 'none'
        }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 12px 28px rgba(37, 211, 102, 0.5)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
      }}
    >
      <MessageCircle size={32} />
    </a>
    </>
  );
}
