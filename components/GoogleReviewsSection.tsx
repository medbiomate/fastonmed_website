'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ExternalLink, MapPin, Star } from 'lucide-react';

export const GOOGLE_REVIEWS_URL = 'https://share.google/zWzPzh4XjEJlQcKK6';
export const GOOGLE_MAPS_URL = 'https://www.google.com/maps/place/Fastonmed+Trading+L.L.C/data=!4m2!3m1!1s0x0:0x97cb43ef418cd11b';

type DisplayReview = { id?: string; name: string; reviews?: string; date: string; excerpt?: string; text?: string; rating?: number; authorUrl?: string; photoUrl?: string };

const realGoogleReviews: DisplayReview[] = [
  { name: 'ramees biomedical', reviews: '1 review', date: '2 months ago', excerpt: 'After sales and service support is very useful.' },
  { name: 'Shahid Muhammed', reviews: '2 reviews · 1 photo', date: '2 months ago', excerpt: 'We are 100% satisfied on their service.' },
  { name: 'Anees Anzy', reviews: '3 reviews', date: '2 months ago', excerpt: '' },
  { name: 'MOHAMED LABEEB', reviews: '4 reviews', date: '2 months ago', excerpt: 'Products are good quality.' },
  { name: 'Jannath Suhshad', reviews: '7 reviews', date: '2 months ago', excerpt: 'Their customer service is outstanding.' }
];

function GoogleMark({ size = 24 }: { size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>;
}

function Stars({ compact = false, rating = 5 }: { compact?: boolean; rating?: number }) {
  return <div className="google-review-stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(star => <span key={star} className={compact ? 'compact' : ''} style={{ opacity: star <= Math.round(rating) ? 1 : .28 }}><Star /></span>)}
  </div>;
}

export default function GoogleReviewsSection() {
  const [slide, setSlide] = useState(0);
  const [reviews, setReviews] = useState<DisplayReview[]>(realGoogleReviews);
  const [rating, setRating] = useState(5);
  const [reviewCount, setReviewCount] = useState(5);
  const [mapsUrl, setMapsUrl] = useState(GOOGLE_MAPS_URL);
  const [isLive, setIsLive] = useState(false);
  const slides = Math.ceil(reviews.length / 3);
  const visibleReviews = Array.from({ length: Math.min(3, reviews.length) }, (_, offset) => reviews[(slide * 3 + offset) % reviews.length]);

  useEffect(() => {
    fetch('/api/google-reviews')
      .then(response => response.ok ? response.json() : null)
      .then(data => {
        if (!data?.live || !data.reviews?.length) return;
        setReviews(data.reviews);
        setRating(data.rating || 5);
        setReviewCount(data.reviewCount || data.reviews.length);
        if (data.googleMapsUrl) setMapsUrl(data.googleMapsUrl);
        setIsLive(true);
        setSlide(0);
      })
      .catch(() => undefined);
  }, []);

  return <section id="reviews" className="google-reviews-section">
    <style>{`
      .google-reviews-section{padding:72px 0;background:#fff;border-block:1px solid #eef2f6}.google-reviews-heading{text-align:center;max-width:760px;margin:0 auto 34px}.google-reviews-kicker{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;color:#1f7a5b;background:#eaf7f2;font-size:.76rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase}.google-reviews-heading h2{margin:13px 0 10px;font-size:clamp(1.7rem,3.2vw,2.35rem);letter-spacing:-.03em}.google-reviews-heading p{color:#64748b;line-height:1.7;font-size:.93rem}.google-review-summary{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:26px 30px;margin-bottom:32px;border:1px solid #dfe7ef;border-radius:16px;background:#f8fafc;box-shadow:0 8px 24px rgba(15,23,42,.04)}.google-review-business{display:flex;align-items:center;gap:18px}.google-review-logo{width:62px;height:62px;display:grid;place-items:center;flex:none;border:1px solid #e1e8ef;border-radius:14px;background:#fff}.google-review-business h3{font-size:1.16rem}.google-review-score{display:flex;align-items:center;flex-wrap:wrap;gap:10px;margin-top:6px}.google-review-score strong{font-size:1.05rem}.google-review-score p{color:#475569;font-size:.86rem}.google-live-badge{padding:3px 7px;border-radius:99px;color:#13795b;background:#dcf8ec;font-size:.63rem;font-weight:800}.google-review-stars{display:flex;gap:3px}.google-review-stars span{width:25px;height:25px;display:grid;place-items:center;border-radius:3px;background:#fbbc04}.google-review-stars span.compact{width:22px;height:22px}.google-review-stars svg{width:15px;height:15px;fill:#fff;color:#fff}.google-review-actions{display:flex;gap:10px}.google-review-actions a{display:inline-flex;align-items:center;gap:8px;padding:11px 17px;border:1px solid #cbd5e1;border-radius:8px;color:#0f172a;background:#fff;font-size:.8rem;font-weight:800}.google-review-actions a:first-child{border-color:#0f172a;color:#fff;background:#0f172a}.google-review-slider{position:relative}.google-review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.google-review-card{min-height:212px;display:flex;flex-direction:column;justify-content:space-between;padding:22px;border:1px solid #e5eaf0;border-radius:13px;background:#fff;transition:.2s ease;animation:reviewSlideIn .35s ease}.google-review-card:hover{transform:translateY(-3px);border-color:#9ed5c2;box-shadow:0 14px 28px rgba(49,112,91,.1)}.google-review-card-top{display:flex;align-items:center;justify-content:space-between}.google-review-card blockquote{display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden;margin:19px 0;color:#334155;font-size:.9rem;line-height:1.65}.google-review-person{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:14px;border-top:1px solid #eef2f6}.google-review-avatar,.google-review-photo{width:38px;height:38px;display:grid;place-items:center;flex:none;border-radius:50%;object-fit:cover}.google-review-avatar{color:#fff;background:#268b70;font-size:.78rem;font-weight:800}.google-review-identity{display:flex;align-items:center;gap:10px}.google-review-identity strong{display:block;color:#172033;font-size:.82rem}.google-review-identity small,.google-review-date{display:block;color:#8a99ab;font-size:.68rem}.google-slider-controls{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:22px}.google-slider-arrow{width:38px;height:38px;display:grid;place-items:center;border:1px solid #dbe5e1;border-radius:50%;color:#245f50;background:#fff;cursor:pointer;transition:.2s ease}.google-slider-arrow:hover{border-color:#51b291;color:#fff;background:#51b291}.google-slider-dots{display:flex;gap:7px}.google-slider-dot{width:8px;height:8px;padding:0;border:0;border-radius:99px;background:#cddbd6;cursor:pointer;transition:.2s ease}.google-slider-dot.active{width:24px;background:#51b291}.google-review-source{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:22px;color:#64748b;font-size:.75rem}.google-review-source a{color:#1f7a5b;font-weight:800}.google-review-disclosure{max-width:780px;margin:14px auto 0;text-align:center;color:#94a3b8;font-size:.68rem;line-height:1.5}@keyframes reviewSlideIn{from{opacity:0;transform:translateX(12px)}to{opacity:1;transform:translateX(0)}}@media(max-width:900px){.google-review-summary{align-items:flex-start;flex-direction:column}.google-review-grid{grid-template-columns:repeat(2,1fr)}.google-review-card:nth-child(3){display:none}}@media(max-width:620px){.google-reviews-section{padding:52px 0}.google-review-summary{padding:20px}.google-review-business{align-items:flex-start}.google-review-logo{width:48px;height:48px}.google-review-actions{width:100%;flex-direction:column}.google-review-actions a{justify-content:center}.google-review-grid{grid-template-columns:1fr}.google-review-card:nth-child(2){display:none}}
    `}</style>
    <div className="container">
      <div className="google-reviews-heading">
        <span className="google-reviews-kicker"><GoogleMark size={16} /> Public Google reviews</span>
        <h2>Feedback published by our customers on Google</h2>
        <p>This section reflects Fastonmed Trading L.L.C’s public Google Business Profile. Reviewer names, ratings and dates are shown as published on Google.</p>
      </div>

      <div className="google-review-summary">
        <div className="google-review-business">
          <div className="google-review-logo"><GoogleMark size={34} /></div>
          <div><h3>Fastonmed Trading L.L.C</h3><div className="google-review-score"><strong>{rating.toFixed(1)}</strong><Stars rating={rating} /><p>Based on {reviewCount} Google reviews</p>{isLive && <small className="google-live-badge">Auto-updated</small>}</div></div>
        </div>
        <div className="google-review-actions">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"><Star size={15} fill="#facc15" color="#facc15" /> Write a review <ExternalLink size={13} /></a>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={15} /> View on Google Maps <ExternalLink size={13} /></a>
        </div>
      </div>

      <div className="google-review-slider">
        <div className="google-review-grid">
        {visibleReviews.map(review => <article key={`${slide}-${review.id || review.name}`} className="google-review-card">
          <div><div className="google-review-card-top"><Stars compact rating={review.rating || 5} /><GoogleMark size={18} /></div>{review.text || review.excerpt ? <blockquote>“{review.text || review.excerpt}”</blockquote> : <blockquote>Read this customer’s complete review on the public Google listing.</blockquote>}</div>
          <div className="google-review-person"><div className="google-review-identity">{review.photoUrl ? <Image className="google-review-photo" src={review.photoUrl} alt="" width={38} height={38} unoptimized /> : <span className="google-review-avatar">{review.name.split(' ').map(part => part[0]).join('').slice(0,2).toUpperCase()}</span>}<div>{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer"><strong>{review.name}</strong></a> : <strong>{review.name}</strong>}<small>{review.reviews ? `${review.reviews} on Google` : 'Google reviewer'}</small></div></div><span className="google-review-date">{review.date}</span></div>
        </article>)}
        </div>
        <div className="google-slider-controls" aria-label="Review slides">
          <button className="google-slider-arrow" onClick={() => setSlide(current => (current - 1 + slides) % slides)} aria-label="Previous reviews"><ChevronLeft size={19} /></button>
          <div className="google-slider-dots">{Array.from({ length: slides }, (_, index) => <button key={index} className={`google-slider-dot ${slide === index ? 'active' : ''}`} onClick={() => setSlide(index)} aria-label={`Show review slide ${index + 1}`} />)}</div>
          <button className="google-slider-arrow" onClick={() => setSlide(current => (current + 1) % slides)} aria-label="Next reviews"><ChevronRight size={19} /></button>
        </div>
      </div>

      <p className="google-review-source"><GoogleMark size={16} /> Rating and reviewer details verified against the public Google listing. <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">Read every review on Google <ExternalLink size={11} /></a></p>
      <p className="google-review-disclosure">Short excerpts are reproduced as published. No job titles, organizations, buyer-verification claims, or reviewer locations have been added.</p>
    </div>
  </section>;
}
