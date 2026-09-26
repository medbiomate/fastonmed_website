'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GOOGLE_REVIEWS_URL } from './GoogleReviewsSection';

export default function TrustBar() {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #eef2f6',
        padding: '12px 16px',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.02)'
      }}
    >
      <style>{`
        .trust-bar-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 0.86rem;
        }
        .trust-bar-stars {
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        .trust-bar-star-box {
          width: 18px;
          height: 18px;
          background-color: #00b67a;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 2px;
        }
        .trust-bar-star-box svg {
          fill: #ffffff;
          width: 11px;
          height: 11px;
        }
        .trust-bar-link {
          color: #0f172a;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .trust-bar-link:hover {
          color: #1f7a5b;
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .trust-bar-container {
            font-size: 0.78rem !important;
            gap: 10px !important;
          }
          .trust-bar-divider {
            display: none !important;
          }
        }
      `}</style>
      <div className="container">
        <div className="trust-bar-container">
          {/* Google G Logo */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>Google Rating</span>
          </div>

          <span style={{ fontWeight: 800, color: '#0f172a' }}>5.0 RATING</span>

          {/* 5 Green Star boxes */}
          <div className="trust-bar-stars">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="trust-bar-star-box">
                <svg viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
            ))}
          </div>

          <span style={{ color: '#475569' }}>
            <strong>5.0 / 5.0</strong> from 5 public Google reviews
          </span>

          <span className="trust-bar-divider" style={{ color: '#cbd5e1' }}>•</span>

          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="trust-bar-link"
          >
            <span>See Reviews on Google</span>
            <ExternalLink size={13} color="#1f7a5b" />
          </a>
        </div>
      </div>
    </div>
  );
}
