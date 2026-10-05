'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Wrench, ArrowRight } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

export default function PurchaseGuide({ onEnquire }: { onEnquire: (type: 'Sales' | 'Service') => void }) {
  const [active, setActive] = useState<'Sales' | 'Service'>('Sales');
  const { localizeUrl } = useLocale();
  const service = active === 'Service';
  const steps = service ? [
    ['Share your equipment details', 'Tell us the brand, model, location and the issue or support you need. Include the serial number and any fault messages where available.'],
    ['Discuss the service scope', 'Our team reviews your request and confirms the available support, assessment requirements, quotation and scheduling.'],
    ['Confirm and coordinate', 'Approve the agreed scope and arrange access to the equipment. Contact our team for updates and follow-up support.']
  ] : [
    ['Find the right equipment', 'Browse products by category or brand. Compare specifications, accessories and suitability for your facility.'],
    ['Request a quote or place an order', 'For products available to purchase online, add them to your cart. For bulk orders or equipment advice, share your models, quantities and delivery location with our sales team.'],
    ['Confirm your order and delivery', 'Review availability, pricing and delivery details before confirming. Discuss installation, training and after-sales support where needed.']
  ];
  return <section className="fm-purchase-guide"><div className="container">
    <h2>How to buy products or request services</h2>
    <p className="fm-purchase-subtitle">A simple way to connect with Fastonmed, from equipment selection to technical support.</p>
    <div className="fm-purchase-tabs" role="tablist" aria-label="Products and services">
      {(['Sales', 'Service'] as const).map(type => <button key={type} type="button" role="tab" id={`purchase-tab-${type}`} aria-controls={`purchase-panel-${type}`} aria-selected={active === type} tabIndex={active === type ? 0 : -1} onClick={() => setActive(type)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = event.key === 'Home' ? 'Sales' : event.key === 'End' ? 'Service' : active === 'Sales' ? 'Service' : 'Sales'; setActive(next); document.getElementById(`purchase-tab-${next}`)?.focus(); } }}>{type === 'Sales' ? <ShoppingBag size={18} /> : <Wrench size={18} />}{type === 'Sales' ? 'Buy equipment' : 'Request a service'}</button>)}
    </div>
    <div className="fm-purchase-panel" role="tabpanel" id={`purchase-panel-${active}`} aria-labelledby={`purchase-tab-${active}`}>
      <img src={service ? '/images/hero-medical-light.jpg' : '/images/hero-medical-equipment.jpg'} alt={service ? 'Hospital room with a patient monitor, infusion equipment and an adjustable bed' : 'Patient monitors, ultrasound system, defibrillator and infusion equipment'} width={service ? 1368 : 1024} height={service ? 768 : 1024} loading="lazy" />
      <div><ol className="fm-purchase-steps">{steps.map(([title, body], index) => <li key={title}><span aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
      <div className="fm-purchase-actions"><button type="button" onClick={() => onEnquire(active)}>{service ? 'Send a service enquiry' : 'Request a quotation'}<ArrowRight size={16} /></button>{!service && <Link href={localizeUrl('/shop')}>Browse products <ArrowRight size={16} /></Link>}</div></div>
    </div>
  </div></section>;
}
