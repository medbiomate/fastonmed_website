import type { Product } from './types';

export const facilityEquipment = {
  hospitals: { title: 'Hospitals & Medical Centers', description: 'Equipment for hospital wards, patient care and operating departments.', image: 'hospitals', terms: ['hospital furniture', 'patient monitor', 'infusion', 'surgical', 'operating', 'hospital bed', 'defibrillator'] },
  clinics: { title: 'Medical Polyclinics & Centers', description: 'Diagnostic, examination and sterilization equipment for outpatient facilities.', image: 'polyclinics', terms: ['diagnostic', 'ecg', 'blood pressure', 'examination', 'autoclave', 'vital signs', 'otoscope', 'ophthalmoscope'] },
  laboratories: { title: 'Clinical Laboratories', description: 'Laboratory equipment, sample handling and medical cold storage.', image: 'laboratories', terms: ['laboratory', 'centrifuge', 'microscope', 'biosafety', 'specimen', 'biobase'] },
  'icu-emergency': { title: 'ICU & Emergency Units', description: 'Monitoring, respiratory support and emergency equipment for critical care.', image: 'icu-emergency', terms: ['patient monitor', 'defibrillator', 'ventilator', 'infusion', 'syringe pump', 'resuscita', 'emergency', 'oxygen concentrator', 'suction machine'] },
  radiology: { title: 'Radiology & Imaging Centers', description: 'Imaging systems and accessories for clinical assessment.', image: 'radiology', terms: ['ultrasound', 'diagnostic imaging', 'medical imaging', 'radiology', 'x-ray', 'transducer', 'radiation'] },
  dental: { title: 'Dental Clinics & Surgeries', description: 'Dental equipment, instruments and sterilization products.', image: 'dental', terms: ['dental', 'autoclave', 'sterilization', 'scaler', 'apex locator', 'endodont', 'curing light'] },
  physiotherapy: { title: 'Rehabilitation & Physiotherapy', description: 'Therapy, rehabilitation and mobility equipment for clinical recovery programmes.', image: 'physiotherapy', terms: ['physiotherapy', 'rehabilitation', 'electrotherapy', 'shockwave', 'pressure wave', 'traction', 'wheelchair', 'walker', 'tens', 'mobility'] },
  pharmacy: { title: 'Pharmacies & Cold Chains', description: 'Medical refrigeration and temperature control equipment for healthcare storage.', image: 'pharmacies', terms: ['refrigerator', 'freezer', 'cold chain', 'vaccine', 'temperature logger', 'data logger', 'specimen transport'] },
} as const;
export function getFacilityProducts(products: Product[], slug: keyof typeof facilityEquipment) {
  const terms = facilityEquipment[slug].terms;
  return products.filter(product => {
    const text = `${product.category} ${product.name}`.toLowerCase().replace(/&amp;/g, '&');
    return terms.some(term => text.includes(term));
  });
}
