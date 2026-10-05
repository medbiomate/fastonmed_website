'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

const brands = [
  ['Alcan Cylinders', 'alcan-cylinders', 'al-can.png'],
  ['Ameda', 'ameda', 'ameda.webp'],
  ['Amoul', 'amoul', 'amoul.png'],
  ['Amplivox', 'amplivox', 'amplivox.svg'],
  ['Aquarius', 'aquarius', ''],
  ['Aveus', 'aveus', 'aveus.png'],
  ['Aveus Instruments', 'aveus-instruments', 'aveus.png'],
  ['Beurer', 'beurer', 'beurer.svg'],
  ['BIOBASE', 'biobase', 'biobase.png'],
  ['Bionet', 'bionet', 'bionet.svg'],
  ['Bistos', 'bistos', 'bistos.png'],
  ['BMC Medical Co. Ltd.', 'bmc-medical-co-ltd', 'bmc.png'],
  ['BPL Medical Technologies', 'bpl-medical-technologies', 'bpl.png'],
  ['CA-MI Italy', 'cami-italy', 'cami.png'],
  ['Chattanooga', 'chattanooga', 'chattanooga.svg'],
  ['Contec', 'contec', 'contec.png'],
  ['Derma Tech', 'derma-tech', ''],
  ['GIMA S.p.A', 'gima-s-p-a', 'gima.jpg'],
  ['Haier Biomedical', 'haier-biomedical', 'haier.png'],
  ['IcanClave', 'icanclave', 'icanclave.svg'],
  ['KellyMed', 'kellymed', 'kellymed.png'],
  ['Laufer Schneller', 'laufer-schneller', 'laufer.webp'],
  ['medfit', 'medfit', 'medfit.png'],
  ['MIR', 'mir', 'mir.png'],
  ['Woodpecker', 'woodpecker', 'woodpecker.png'],
  ['Qualmedi', 'qualmedi', 'qualmedi.png'],
];

export default function AssociatedBrands() {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  const { localizeUrl } = useLocale();
  const scroll = (direction: number) => track.current?.scrollBy({ left: direction * track.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  return <section className="fm-associated-brands" aria-labelledby="associated-brands-title">
    <div className="container">
      <div className="fm-associated-header"><div><h2 id="associated-brands-title">Associated Brands</h2><p>We are associated with these medical equipment brands. Explore their products at Fastonmed.</p></div><div className="fm-associated-arrows"><button aria-label="Previous brands" disabled={position.start} onClick={() => scroll(-1)}><ChevronLeft size={20} /></button><button aria-label="Next brands" disabled={position.end} onClick={() => scroll(1)}><ChevronRight size={20} /></button></div></div>
      <div className="fm-associated-track" ref={track} tabIndex={0} aria-label="Associated medical equipment brands" onScroll={() => { const el = track.current; if (el) setPosition({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 }); }}>
        {brands.map(([name, slug, logo]) => <Link key={slug} href={localizeUrl(`/brand/${slug}`)} className={`fm-associated-card ${['haier.png', 'icanclave.svg', 'laufer.webp'].includes(logo) ? 'fm-associated-dark' : ''}`}>
          {logo ? <img src={`/images/brands/${logo}`} alt={`${name} logo`} loading="lazy" width={160} height={60} /> : <strong>{name}</strong>}
          <span>{name}</span>
        </Link>)}
      </div>
    </div>
  </section>;
}
