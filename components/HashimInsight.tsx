import { Quote, Linkedin, PenLine } from 'lucide-react';

const profile = 'https://www.linkedin.com/in/hashim-vp-ab7491221/';
function Profile({ author = false }: { author?: boolean }) {
  return <a className="fm-hashim-profile" href={profile} target="_blank" rel="noopener noreferrer">
    <span className="fm-hashim-avatar" aria-hidden="true">HV</span>
    <span>{author && <span className="fm-hashim-credit"><PenLine size={14} /> Written by</span>}<strong>Hashim VP</strong><small>Biomedical Engineer · Fastonmed</small></span>
    <Linkedin size={18} aria-hidden="true" />
  </a>;
}
export default function HashimInsight() {
  return <section className="fm-hashim-insight"><div className="container">
    <article><Quote size={26} aria-hidden="true" /><h2>Choose equipment around your clinical needs</h2>
      <blockquote>“The right ECG machine is the one that matches the clinical requirement”</blockquote>
      <p>Hashim’s procurement advice highlights workflow compatibility, serviceability and lifecycle costs alongside specifications. Share your facility’s requirements with Fastonmed to discuss equipment options and the support available.</p>
      <a className="fm-hashim-source" href="https://ae.linkedin.com/company/fastonmed-trading-llc" target="_blank" rel="noopener noreferrer">From Hashim’s equipment procurement advice on LinkedIn</a>
    </article><Profile />
  </div></section>;
}
export function HashimAuthorCredit() { return <div className="container fm-hashim-author"><Profile author /></div>; }
