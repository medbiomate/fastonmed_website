'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { useLocale } from '@/lib/locale-context';

const faqs = [
  ['General', 'What is biomedical equipment?', 'Biomedical equipment includes devices and systems used for diagnosis, monitoring, treatment, rehabilitation and patient care. Examples include ECG machines, patient monitors, infusion pumps and laboratory analysers.'],
  ['General', 'What types of biomedical equipment are available?', 'Common types include diagnostic, patient monitoring, therapeutic, life support, laboratory, surgical, imaging, rehabilitation, hospital and clinical equipment, plus dermatology and aesthetic devices. Some devices serve more than one purpose.'],
  ['General', 'What medical equipment does Fastonmed supply?', 'Browse our catalog for diagnostic devices, patient monitors, respiratory and therapy equipment, laboratory products, hospital furniture, surgical instruments, consumables and specialist clinical equipment. Availability depends on the product and configuration.'],
  ['General', 'Do you supply hospitals and clinics?', 'Yes. Fastonmed supports equipment procurement for hospitals, clinics and other healthcare facilities. Share your department, intended use and equipment list so our team can help prepare a suitable quotation.'],
  ['General', 'Do you offer dermatology and aesthetic equipment?', 'Our catalog includes dermatology and aesthetic products. Tell us the intended procedure and facility requirements so we can discuss suitable options and their product-specific specifications.'],
  ['General', 'Can I buy medical equipment for home use?', 'Some products are designed for home use, while others require trained clinical operators. Check the manufacturer’s intended use and ask your healthcare professional which equipment suits your needs.'],
  ['Choosing Equipment', 'How do I choose the right medical equipment?', 'Start with the intended use, patient group and required measurements or treatment functions. Then compare specifications, accessories, compatibility, training, maintenance and ongoing costs. Our team can help compare options; clinical decisions should be made by your healthcare professionals.'],
  ['Choosing Equipment', 'Can you help me compare models and brands?', 'Yes. Share the models you are considering and your required features, budget and intended use. We can review available specifications and explain practical differences, subject to manufacturer information.'],
  ['Choosing Equipment', 'What information should I provide when requesting a quote?', 'Include the product or equipment type, quantity, required specifications, facility name, delivery location and preferred timeline. For replacement parts, include the brand, model and part number where available.'],
  ['Choosing Equipment', 'How do I check compatibility with existing equipment?', 'Provide the existing equipment’s brand, model, connector details and accessory or part number. Compatibility should be confirmed against manufacturer documentation before ordering or connecting a replacement.'],
  ['Choosing Equipment', 'Are all accessories included with a device?', 'Included accessories vary by model and package. Check the quotation for sensors, probes, cables, batteries, software and other items; optional accessories should be listed separately.'],
  ['Choosing Equipment', 'What is the difference between diagnostic and monitoring equipment?', 'Diagnostic equipment helps investigate a condition or assess a clinical parameter. Monitoring equipment tracks measurements over time. Some systems perform both functions, depending on their intended use.'],
  ['Orders & Pricing', 'Can I request bulk pricing?', 'Yes. Send your product list and quantities to request a bulk quotation. Pricing depends on the models, configuration, quantity and availability, and will be confirmed in your quotation.'],
  ['Orders & Pricing', 'How do I place an order?', 'Use the online purchase option where available, or contact our team through the enquiry form or WhatsApp for a quotation. Confirm the product, quantity, delivery details and agreed terms before completing your order.'],
  ['Orders & Pricing', 'Can I request a quotation for a complete clinic or department?', 'Yes. Share your equipment list, department requirements and timeline. Our team can discuss available products and prepare a quotation for the proposed setup.'],
  ['Orders & Pricing', 'How can I confirm stock availability?', 'Check the product page and contact our team for current availability, especially for urgent or bulk orders. Stock and lead times can change before an order is confirmed.'],
  ['Orders & Pricing', 'Can I request a specific brand or configuration?', 'Yes. Provide the brand, model and required configuration. We will confirm whether the requested option can be supplied and include the details in the quotation.'],
  ['Orders & Pricing', 'What payment methods and purchasing terms are available?', 'Available payment options are shown during checkout or stated in your quotation. Contact our team to discuss facility procurement requirements and confirm the terms for your order.'],
  ['Delivery', 'Do you deliver medical equipment across the UAE?', 'Fastonmed coordinates delivery for UAE customers. Provide your delivery address so our team can confirm service availability, delivery charges and the expected timeline for the equipment ordered.'],
  ['Delivery', 'How long does delivery take?', 'Delivery depends on stock, configuration and destination. Request a confirmed estimate for your order; specialised or sourced equipment may have a longer lead time than items already in stock.'],
  ['Delivery', 'Can I request urgent delivery?', 'Tell our team your required date and delivery location. We will check stock and logistics and confirm whether the requested timeline is achievable before you order.'],
  ['Delivery', 'Is installation or user training included?', 'Installation and training depend on the equipment and agreed supply package. Ask for these services to be specified in the quotation, including any site requirements and additional charges.'],
  ['Quality & Support', 'What quality checks does Fastonmed perform?', 'Fastonmed applies five layers of quality checks before equipment reaches the end user, with oversight from its biomedical engineering team. Ask our team about the checks and handover documentation applicable to your specific product.'],
  ['Quality & Support', 'Does medical equipment come with a warranty?', 'Warranty terms vary by manufacturer, model and supply agreement. Confirm the applicable warranty, coverage, exclusions and support arrangements in your quotation or product documentation.'],
  ['Quality & Support', 'Do you provide biomedical technical support?', 'Fastonmed’s biomedical engineering team supports equipment enquiries and after-sales coordination. Share the equipment brand, model, serial number and issue so the team can advise on the next steps.'],
  ['Quality & Support', 'Can you arrange maintenance or calibration?', 'Contact our service team with the equipment details and required service. Maintenance, calibration and service availability depend on the device and scope, and should be confirmed before scheduling.'],
  ['Quality & Support', 'How often should medical equipment be serviced?', 'Follow the manufacturer’s maintenance schedule and your facility’s procedures. Frequency depends on the device, usage and operating conditions. Keep service records and arrange checks when faults or performance concerns arise.'],
  ['Quality & Support', 'How do I request a repair or report a fault?', 'Use the Service enquiry option and provide the brand, model, serial number, fault description and any displayed error. Follow the manufacturer’s safety instructions and your facility’s process for taking faulty equipment out of use.'],
  ['Quality & Support', 'Can I request product certificates and technical documents?', 'Ask for the documents required for your procurement process, such as specifications, manuals or available manufacturer certificates. Documentation and regulatory status are product-specific and should be confirmed before purchase.'],
  ['Quality & Support', 'Can I order replacement parts and consumables?', 'Share the device brand, model and required part or consumable number. Our team can check availability and compatibility; substitutions should be confirmed against manufacturer requirements.'],
  ['Quality & Support', 'What should I do if an item arrives damaged or incorrect?', 'Contact our team promptly with your order reference, photos of the item and packaging, and a description of the issue. Keep the packaging and confirm the applicable resolution process with the team.'],
  ['Orders & Pricing', 'What is your return or cancellation policy?', 'Return and cancellation eligibility depends on the order terms, product condition and whether the equipment was specially sourced or configured. Ask for the applicable policy before confirming your order.'],
] as const;
const categories = ['All', 'General', 'Choosing Equipment', 'Orders & Pricing', 'Delivery', 'Quality & Support'];

export default function HomeFAQs() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const { localizeUrl } = useLocale();
  const filtered = faqs.filter(([group, question, answer]) => (category === 'All' || category === group) && `${question} ${answer}`.toLowerCase().includes(search.toLowerCase()));
  return <section className="fm-home-faq" aria-labelledby="home-faq-title">
    <div className="container">
      <div className="fm-faq-heading"><h2 id="home-faq-title">Frequently Asked Questions</h2><p>Answers to common questions about medical equipment, procurement and support.</p></div>
      <div className="fm-faq-filters" role="group" aria-label="Filter FAQ topics">{categories.map(group => <button key={group} type="button" aria-pressed={category === group} onClick={() => setCategory(group)}>{group}</button>)}</div>
      <label className="fm-faq-search"><Search size={18} aria-hidden="true" /><input type="search" aria-label="Search frequently asked questions" placeholder="Search a question…" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <div className="fm-faq-list">{filtered.map(([group, question, answer]) => <details key={question} className="fm-faq-item"><summary><span>{question}</span><ChevronDown size={18} aria-hidden="true" /></summary><div><span className="fm-faq-topic">{group}</span><p>{answer}</p></div></details>)}</div>
      {!filtered.length && <p className="fm-faq-empty">No matching questions. Try another keyword or topic.</p>}
      <p className="fm-faq-contact">Need help with a specific product? <Link href={localizeUrl('/contact')}>Contact our team →</Link></p>
    </div>
  </section>;
}
