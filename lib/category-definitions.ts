export interface CategorySpecialtyConfig {
  slug: string;
  aliases: string[];
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  badge: string;
  illustration: string;
  subcategories: {
    id: string;
    label: string;
    matches: (cat: string, name: string) => boolean;
  }[];
  matches: (cat: string, name: string) => boolean;
}

export const CATEGORY_SPECIALTIES: Record<string, CategorySpecialtyConfig> = {
  'patient-monitoring': {
    slug: 'patient-monitoring',
    aliases: [
      'patient-monitoring-equipment',
      'patient-monitoring-devices',
      'multi-parameter-patient-monitors',
      'patient-monitors'
    ],
    title: 'Patient Monitoring Systems',
    shortTitle: 'Patient Monitoring',
    subtitle: 'Multi-Parameter ICU Monitors, Telemetry Units & ECG Systems',
    description:
      'High-precision patient monitoring systems engineered for intensive care units, emergency rooms, surgical suites, and general hospital wards across Dubai and the UAE with high clinical reliability and accuracy.',
    badge: 'CLINICAL GRADE ACCURACY',
    illustration: '/images/illustrations/patient-monitoring.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Patient Monitoring',
        matches: () => true
      },
      {
        id: 'multiparameter',
        label: 'Multi-Parameter Monitors',
        matches: (c, n) => /multi-parameter|multiparameter|av-pro|av-max|pm-|patient monitor/i.test(c + ' ' + n)
      },
      {
        id: 'ecg',
        label: 'ECG Machines & Telemetry',
        matches: (c, n) => /ecg|holter|cardiup|telemetry/i.test(c + ' ' + n)
      },
      {
        id: 'vital-signs',
        label: 'Vital Signs & BP Monitors',
        matches: (c, n) => /vital sign|blood pressure|ambulatory|sphygmo/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      /patient monitor|ecg|vital signs|blood pressure|ambulatory.*monitor|holter/i.test(c + ' ' + n)
  },

  'icu-equipment': {
    slug: 'icu-equipment',
    aliases: [
      'icu-critical-care',
      'critical-care-equipment',
      'icu-care',
      'critical-care'
    ],
    title: 'ICU & Critical Care Equipment',
    shortTitle: 'ICU & Critical Care',
    subtitle: 'High-Acuity ICU Ventilators, Infusion Pumps & Defibrillators',
    description:
      'Certified life-support equipment, mechanical ventilators, automated external defibrillators (AEDs), infusion therapy systems, and high-vacuum medical suction units for critical care units across UAE hospitals.',
    badge: 'CRITICAL LIFE-SUPPORT CERTIFIED',
    illustration: '/images/illustrations/icu-care.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Critical Care',
        matches: () => true
      },
      {
        id: 'ventilators',
        label: 'Ventilators & Respiratory',
        matches: (c, n) => /ventilator|respiratory|cpap|bipap|oxygen|airway/i.test(c + ' ' + n)
      },
      {
        id: 'defibrillators',
        label: 'Defibrillators & AEDs',
        matches: (c, n) => /defibrillator|aed|shock/i.test(c + ' ' + n)
      },
      {
        id: 'infusion',
        label: 'Infusion & Syringe Pumps',
        matches: (c, n) => /infusion|syringe pump|perfusion/i.test(c + ' ' + n)
      },
      {
        id: 'suction',
        label: 'Medical Suction Units',
        matches: (c, n) => /suction|aspirator/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      /icu|critical care|ventilator|defibrillator|infusion|suction|cpap|bipap|aed|respiratory equipment/i.test(
        c + ' ' + n
      )
  },

  'pharmacy-refrigerators': {
    slug: 'pharmacy-refrigerators',
    aliases: [
      'medical-cold-storage',
      'laboratory-refrigerators',
      'cold-storage',
      'vaccine-storage'
    ],
    title: 'Medical Cold Storage & Pharmacy Refrigerators',
    shortTitle: 'Medical Cold Storage',
    subtitle: 'Certified 2–8°C Pharmacy Fridges & Biofreezers',
    description:
      'Precision temperature-controlled pharmaceutical refrigerators, biofreezers, and vaccine cold-chain storage systems engineered to maintain strict 2–8°C compliance with digital data-logging for UAE clinical pharmacies.',
    badge: '2–8°C COLD CHAIN CERTIFIED',
    illustration: '/images/illustrations/medical-cold-storage.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Cold Storage',
        matches: () => true
      },
      {
        id: 'pharmacy',
        label: 'Pharmacy Fridges (2-8°C)',
        matches: (c, n) => /pharmacy|refrigerat|hyc|medicine fridge/i.test(c + ' ' + n)
      },
      {
        id: 'freezers',
        label: 'Biofreezers & Deep Freezers',
        matches: (c, n) => /freezer|cryo|deep freeze|-20|-40|-86/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      /refrigerat|cold storage|freezer|chiller|vaccine storage|cold chain/i.test(c + ' ' + n)
  },

  'radiology-equipments': {
    slug: 'radiology-equipments',
    aliases: [
      'ultrasound-radiology',
      'ultrasound-machines',
      'diagnostic-imaging-equipment',
      'medical-imaging'
    ],
    title: 'Ultrasound & Radiology Equipment',
    shortTitle: 'Ultrasound & Radiology',
    subtitle: 'Color Doppler Ultrasound Systems, Digital X-Ray & Diagnostics',
    description:
      'Advanced medical imaging systems including color Doppler ultrasound scanners, mobile digital radiography (X-ray) machines, diagnostic transducers, and radiation protection equipment for UAE imaging centers.',
    badge: 'HIGH-RESOLUTION DIAGNOSTIC IMAGING',
    illustration: '/images/illustrations/ultrasound-radiology.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Imaging & Radiology',
        matches: () => true
      },
      {
        id: 'ultrasound',
        label: 'Ultrasound Machines',
        matches: (c, n) => /ultrasound|echograph|doppler|probe/i.test(c + ' ' + n)
      },
      {
        id: 'xray',
        label: 'X-Ray & Accessories',
        matches: (c, n) => /x-ray|radiology|radiograph|c-arm/i.test(c + ' ' + n)
      },
      {
        id: 'diagnostic',
        label: 'Diagnostic Imaging Devices',
        matches: (c, n) => /imaging|endoscopy|camera system/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      /ultrasound|radiology|x-ray|imaging|doppler|endoscopy camera/i.test(c + ' ' + n)
  },

  'laboratory-equipment': {
    slug: 'laboratory-equipment',
    aliases: [
      'clinical-laboratory',
      'laboratory-centrifuges',
      'autoclave-machines',
      'lab-equipment'
    ],
    title: 'Clinical Laboratory Equipment',
    shortTitle: 'Clinical Laboratory',
    subtitle: 'Biochemistry Analyzers, Centrifuges & Biosafety Cabinets',
    description:
      'High-throughput clinical chemistry analyzers, refrigerated centrifuges, steam autoclaves, laboratory microscopes, and sterile containment apparatus engineered for clinical pathology and research labs in the UAE.',
    badge: 'ISO & CLINICAL PATHOLOGY GRADE',
    illustration: '/images/illustrations/clinical-laboratory.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Laboratory Systems',
        matches: () => true
      },
      {
        id: 'centrifuges',
        label: 'Centrifuges & Mixers',
        matches: (c, n) => /centrifuge|shaker|mixer|vortex/i.test(c + ' ' + n)
      },
      {
        id: 'autoclaves',
        label: 'Autoclaves & Sterilizers',
        matches: (c, n) => /autoclave|steriliz/i.test(c + ' ' + n)
      },
      {
        id: 'microscopes',
        label: 'Microscopes & Optics',
        matches: (c, n) => /microscope|optic/i.test(c + ' ' + n)
      },
      {
        id: 'analyzers',
        label: 'Analyzers & Tests',
        matches: (c, n) => /analyzer|prp|audiometer|spirometry/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      /laboratory|centrifuge|analyzer|microscope|autoclave|biochemistry|prp tube|sterilization equipment/i.test(
        c + ' ' + n
      )
  },

  'hospital-furniture': {
    slug: 'hospital-furniture',
    aliases: [
      'medical-furniture',
      'hospital-beds',
      'examination-couches',
      'patient-transport'
    ],
    title: 'Hospital Furniture & Clinical Couches',
    shortTitle: 'Hospital Furniture',
    subtitle: 'Electric Hospital Beds, Examination Couches & Patient Mobility',
    description:
      'Durable, antimicrobial medical furniture engineered for hospital wards, ICU rooms, day surgery centers, and examination clinics across Dubai and Abu Dhabi. Meets statutory UAE hospital safety standards.',
    badge: 'ANTIMICROBIAL HOSPITAL-GRADE FINISH',
    illustration: '/images/illustrations/hospital-furniture.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Hospital Furniture',
        matches: () => true
      },
      {
        id: 'beds-couches',
        label: 'Beds & Exam Couches',
        matches: (c, n) => /bed|couch|treatment chair|traction table|tilt table/i.test(c + ' ' + n)
      },
      {
        id: 'wheelchairs',
        label: 'Wheelchairs & Mobility',
        matches: (c, n) => /wheelchair|mobility|stretcher|scooter/i.test(c + ' ' + n)
      },
      {
        id: 'trolleys',
        label: 'Medical Trolleys & Carts',
        matches: (c, n) => /trolley|cart|crash cart/i.test(c + ' ' + n)
      },
      {
        id: 'chairs-stools',
        label: 'Doctor & Operator Chairs',
        matches: (c, n) => /chair|stool|phlebotomy|donation/i.test(c + ' ' + n) && !/wheelchair/i.test(c + ' ' + n)
      }
    ],
    matches: (c, n) =>
      (/furniture|couch|bed|wheelchair|trolley|chair|stool|table|stretcher/i.test(c + ' ' + n) &&
        !/dressing|bandage|catheter|glove|consumable|disposable/i.test(c + ' ' + n))
  }
};

export const OTHER_SPECIALTIES_LIST = [
  {
    slug: 'icu-equipment',
    title: 'ICU & Critical Care',
    desc: 'High-acuity ICU ventilators, infusion pumps & defibrillators.',
    illustration: '/images/illustrations/icu-care.svg'
  },
  {
    slug: 'patient-monitoring',
    title: 'Patient Monitoring',
    desc: 'Multi-parameter monitors, ECG & wireless telemetry units.',
    illustration: '/images/illustrations/patient-monitoring.svg'
  },
  {
    slug: 'pharmacy-refrigerators',
    title: 'Medical Cold Storage',
    desc: 'Certified 2–8°C pharmacy fridges & biofreezers.',
    illustration: '/images/illustrations/medical-cold-storage.svg'
  },
  {
    slug: 'radiology-equipments',
    title: 'Ultrasound & Radiology',
    desc: 'Color Doppler ultrasound systems & mobile digital X-ray.',
    illustration: '/images/illustrations/ultrasound-radiology.svg'
  },
  {
    slug: 'laboratory-equipment',
    title: 'Clinical Laboratory',
    desc: 'Biochemistry analyzers, centrifuges & biosafety cabinets.',
    illustration: '/images/illustrations/clinical-laboratory.svg'
  },
  {
    slug: 'hospital-furniture',
    title: 'Hospital Furniture',
    desc: 'Electric hospital beds, examination couches & dental units.',
    illustration: '/images/illustrations/hospital-furniture.svg'
  }
];

export function resolveSpecialtyConfig(slug: string): CategorySpecialtyConfig | null {
  const normalized = slug.toLowerCase().trim();
  for (const config of Object.values(CATEGORY_SPECIALTIES)) {
    if (config.slug === normalized || config.aliases.includes(normalized)) {
      return config;
    }
  }
  return null;
}
