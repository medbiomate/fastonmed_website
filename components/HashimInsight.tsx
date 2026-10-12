'use client';
import { publicArabic } from '@/lib/public-arabic';
import { useLocale } from '@/lib/locale-context';
import { Quote, ExternalLink, PenLine } from 'lucide-react';

const profile = 'https://www.linkedin.com/in/hashim-vp-ab7491221/';
function Profile({ author = false }: { author?: boolean }) {
 const { isArabic } = useLocale(); const ar = (text: string) => isArabic ? publicArabic(text) : text;
  return <a className="fm-hashim-profile" href={profile} target="_blank" rel="noopener noreferrer">
    <img className="fm-hashim-avatar" src="/images/team/hashim-vp.png" alt="Hashim VP" width={48} height={48} loading="lazy" />
    <span>{author && <span className="fm-hashim-credit"><PenLine size={14} />{ar("Written by")}</span>}<strong>Hashim VP</strong><small>{ar("Biomedical Engineer · Fastonmed")}</small></span>
    <ExternalLink size={18} aria-hidden="true" />
  </a>;
}
export default function HashimInsight() {
 const { isArabic } = useLocale(); const ar = (text: string) => isArabic ? publicArabic(text) : text;
  return <section className="fm-hashim-insight"><div className="container">
    <article><Quote size={26} aria-hidden="true" /><h2>{ar("Choose equipment around your clinical needs")}</h2>
      <blockquote>{ar("“The right ECG machine is the one that matches the clinical requirement”")}</blockquote>
      <p>{ar("Hashim’s procurement advice highlights workflow compatibility, serviceability and lifecycle costs alongside specifications. Share your facility’s requirements with Fastonmed to discuss equipment options and the support available.")}</p>
      <a className="fm-hashim-source" href="https://ae.linkedin.com/company/fastonmed-trading-llc" target="_blank" rel="noopener noreferrer">{ar("From Hashim’s equipment procurement advice on LinkedIn")}</a>
    </article><Profile />
  </div></section>;
}
export function HashimAuthorCredit() { return <div className="container fm-hashim-author"><Profile author /></div>; }
