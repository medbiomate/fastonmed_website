export interface CategorySpecialtyConfig {
  slug: string;
  aliases: string[];
  title: string;
  titleAr?: string;
  shortTitle: string;
  shortTitleAr?: string;
  subtitle: string;
  subtitleAr?: string;
  description: string;
  descriptionAr?: string;
  badge: string;
  badgeAr?: string;
  illustration: string;
  subcategories: {
    id: string;
    label: string;
    labelAr?: string;
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
    titleAr: 'أنظمة وشاشات مراقبة المرضى',
    shortTitle: 'Patient Monitoring',
    shortTitleAr: 'مراقبة المرضى',
    subtitle: 'Multi-Parameter ICU Monitors, Telemetry Units & ECG Systems',
    subtitleAr: 'شاشات العناية المركزة متعددة المعايير، أجهزة التخطيط والقياس عن بعد',
    description:
      'High-precision patient monitoring systems engineered for intensive care units, emergency rooms, surgical suites, and general hospital wards across Dubai and the UAE with high clinical reliability and accuracy.',
    descriptionAr:
      'أنظمة مراقبة المرضى عالية الدقة المصممة لوحدات العناية المركزة، وغرف الطوارئ، وأجنحة العمليات الجراحية، والأقسام العامة في مستشفيات دبي والإمارات بدقة سريرية وموثوقية فائقة.',
    badge: 'CLINICAL GRADE ACCURACY',
    badgeAr: 'دقة سريرية معتمدة',
    illustration: '/images/illustrations/patient-monitoring.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Patient Monitoring',
        labelAr: 'جميع أجهزة مراقبة المرضى',
        matches: () => true
      },
      {
        id: 'multiparameter',
        label: 'Multi-Parameter Monitors',
        labelAr: 'شاشات متعددة المعايير',
        matches: (c, n) => /multi-parameter|multiparameter|av-pro|av-max|pm-|patient monitor/i.test(c + ' ' + n)
      },
      {
        id: 'ecg',
        label: 'ECG Machines & Telemetry',
        labelAr: 'أجهزة تخطيط القلب والقياس',
        matches: (c, n) => /ecg|holter|cardiup|telemetry/i.test(c + ' ' + n)
      },
      {
        id: 'vital-signs',
        label: 'Vital Signs & BP Monitors',
        labelAr: 'العلامات الحيوية وضغط الدم',
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
    titleAr: 'أجهزة ومعدات العناية المركزة (ICU)',
    shortTitle: 'ICU & Critical Care',
    shortTitleAr: 'العناية المركزة',
    subtitle: 'High-Acuity ICU Ventilators, Infusion Pumps & Defibrillators',
    subtitleAr: 'أجهزة التنفس الاصطناعي للعناية المركزة، مضخات الحقن وأجهزة الصدمات',
    description:
      'Certified life-support equipment, mechanical ventilators, automated external defibrillators (AEDs), infusion therapy systems, and high-vacuum medical suction units for critical care units across UAE hospitals.',
    descriptionAr:
      'أجهزة دعم الحياة المعتمدة، أجهزة التنفس الاصطناعي والميكانيكي، أجهزة مزيل الرجفان الخارجية (AED)، أنظمة العلاج بالحقن الوريدي، ووحدات الشفط الطبي عالية الفراغ لأقسام العناية المركزة في مستشفيات الإمارات.',
    badge: 'CRITICAL LIFE-SUPPORT CERTIFIED',
    badgeAr: 'معتمدة لدعم الحياة الحرجة',
    illustration: '/images/illustrations/icu-care.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Critical Care',
        labelAr: 'جميع العناية المركزة',
        matches: () => true
      },
      {
        id: 'ventilators',
        label: 'Ventilators & Respiratory',
        labelAr: 'أجهزة التنفس والرعاية الرئوية',
        matches: (c, n) => /ventilator|respiratory|cpap|bipap|oxygen|airway/i.test(c + ' ' + n)
      },
      {
        id: 'defibrillators',
        label: 'Defibrillators & AEDs',
        labelAr: 'أجهزة الصدمات وAED',
        matches: (c, n) => /defibrillator|aed|shock/i.test(c + ' ' + n)
      },
      {
        id: 'infusion',
        label: 'Infusion & Syringe Pumps',
        labelAr: 'مضخات الحقن والسرنجة',
        matches: (c, n) => /infusion|syringe pump|perfusion/i.test(c + ' ' + n)
      },
      {
        id: 'suction',
        label: 'Medical Suction Units',
        labelAr: 'وحدات الشفط الطبي',
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
    titleAr: 'ثلاجات الأدوية وحفظ العينات الطبية',
    shortTitle: 'Medical Cold Storage',
    shortTitleAr: 'التبريد الطبي',
    subtitle: 'Certified 2–8°C Pharmacy Fridges & Biofreezers',
    subtitleAr: 'ثلاجات صيدلانية معتمدة 2–8 درجات مئوية ومجمدات بيولوجية',
    description:
      'Precision temperature-controlled pharmaceutical refrigerators, biofreezers, and vaccine cold-chain storage systems engineered to maintain strict 2–8°C compliance with digital data-logging for UAE clinical pharmacies.',
    descriptionAr:
      'ثلاجات حفظ الأدوية دقيقة التحكم، المجمدات البيولوجية فائقة البرودة، وأنظمة سلسلة التبريد للقاحات المصممة للامتثال لدرجة حرارة 2-8 مئوية مع مسجلات بيانات رقمية لصيدليات ومستشفيات الإمارات.',
    badge: '2–8°C COLD CHAIN CERTIFIED',
    badgeAr: 'معتمد لسلسلة التبريد 2–8° مئوية',
    illustration: '/images/illustrations/medical-cold-storage.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Cold Storage',
        labelAr: 'جميع أجهزة التبريد الطبي',
        matches: () => true
      },
      {
        id: 'pharmacy',
        label: 'Pharmacy Fridges (2-8°C)',
        labelAr: 'ثلاجات الصيدلية (2-8°م)',
        matches: (c, n) => /pharmacy|refrigerat|hyc|medicine fridge/i.test(c + ' ' + n)
      },
      {
        id: 'freezers',
        label: 'Biofreezers & Deep Freezers',
        labelAr: 'المجمدات الحيوية والعميقة',
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
    titleAr: 'أجهزة السونار والأشعة التشخيصية',
    shortTitle: 'Ultrasound & Radiology',
    shortTitleAr: 'السونار والأشعة',
    subtitle: 'Color Doppler Ultrasound Systems, Digital X-Ray & Diagnostics',
    subtitleAr: 'أجهزة الموجات فوق الصوتية دوبلر الملونة، الأشعة السينية الرقمية والمعدات التشخيصية',
    description:
      'Advanced medical imaging systems including color Doppler ultrasound scanners, mobile digital radiography (X-ray) machines, diagnostic transducers, and radiation protection equipment for UAE imaging centers.',
    descriptionAr:
      'أنظمة التصوير الطبي المتطورة بما في ذلك أجهزة الموجات فوق الصوتية (الدوبلر الملون)، أجهزة الأشعة السينية الرقمية المتنقلة، المجسات التشخيصية، ومعدات الحماية من الإشعاع لمراكز التصوير في الإمارات.',
    badge: 'HIGH-RESOLUTION DIAGNOSTIC IMAGING',
    badgeAr: 'تصوير تشخيصي عالي الدقة',
    illustration: '/images/illustrations/ultrasound-radiology.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Imaging & Radiology',
        labelAr: 'جميع أجهزة الأشعة والتصوير',
        matches: () => true
      },
      {
        id: 'ultrasound',
        label: 'Ultrasound Machines',
        labelAr: 'أجهزة السونار والموجات فوق الصوتية',
        matches: (c, n) => /ultrasound|echograph|doppler|probe/i.test(c + ' ' + n)
      },
      {
        id: 'xray',
        label: 'X-Ray & Accessories',
        labelAr: 'الأشعة السينية ومستلزماتها',
        matches: (c, n) => /x-ray|radiology|radiograph|c-arm/i.test(c + ' ' + n)
      },
      {
        id: 'diagnostic',
        label: 'Diagnostic Imaging Devices',
        labelAr: 'أجهزة التصوير التشخيصي',
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
    titleAr: 'أجهزة ومعدات المختبرات السريرية',
    shortTitle: 'Clinical Laboratory',
    shortTitleAr: 'المختبرات السريرية',
    subtitle: 'Biochemistry Analyzers, Centrifuges & Biosafety Cabinets',
    subtitleAr: 'محللات الكيمياء الحيوية، أجهزة الطرد المركزي وخزانات الأمان الحيوي',
    description:
      'High-throughput clinical chemistry analyzers, refrigerated centrifuges, steam autoclaves, laboratory microscopes, and sterile containment apparatus engineered for clinical pathology and research labs in the UAE.',
    descriptionAr:
      'محللات الكيمياء السريرية عالية الإنتاجية، أجهزة الطرد المركزي المبردة، أجهزة التعقيم بالبخار (الأوتوكلاف)، المجاهر المخبرية، ومعدات الاحتواء المعقمة لمختبرات التحاليل والأبحاث في الإمارات.',
    badge: 'ISO & CLINICAL PATHOLOGY GRADE',
    badgeAr: 'مطابقة لمعايير المختبرات الطبية',
    illustration: '/images/illustrations/clinical-laboratory.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Laboratory Systems',
        labelAr: 'جميع الأنظمة المخبرية',
        matches: () => true
      },
      {
        id: 'centrifuges',
        label: 'Centrifuges & Mixers',
        labelAr: 'أجهزة الطرد المركزي والمخالط',
        matches: (c, n) => /centrifuge|shaker|mixer|vortex/i.test(c + ' ' + n)
      },
      {
        id: 'autoclaves',
        label: 'Autoclaves & Sterilizers',
        labelAr: 'أجهزة التعقيم والأوتوكلاف',
        matches: (c, n) => /autoclave|steriliz/i.test(c + ' ' + n)
      },
      {
        id: 'microscopes',
        label: 'Microscopes & Optics',
        labelAr: 'المجاهر والأنظمة البصرية',
        matches: (c, n) => /microscope|optic/i.test(c + ' ' + n)
      },
      {
        id: 'analyzers',
        label: 'Analyzers & Tests',
        labelAr: 'المحللات والاختبارات الطبية',
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
    titleAr: 'أثاث المستشفيات وأسِرّة الفحص السريري',
    shortTitle: 'Hospital Furniture',
    shortTitleAr: 'أثاث المستشفيات',
    subtitle: 'Electric Hospital Beds, Examination Couches & Patient Mobility',
    subtitleAr: 'أسِرّة المستشفيات الكهربائية، أرائك الفحص وأنظمة نقل المرضى',
    description:
      'Durable, antimicrobial medical furniture engineered for hospital wards, ICU rooms, day surgery centers, and examination clinics across Dubai and Abu Dhabi. Meets statutory UAE hospital safety standards.',
    descriptionAr:
      'أثاث طبي متين ومضاد للميكروبات مصمم لأجنحة المستشفيات، غرف العناية المركزة، مراكز جراحة اليوم الواحد، والعيادات في دبي وأبوظبي، ومطابق للمعايير الصحية المعتمدة في الإمارات.',
    badge: 'ANTIMICROBIAL HOSPITAL-GRADE FINISH',
    badgeAr: 'مضاد للميكروبات ومطابق للمستشفيات',
    illustration: '/images/illustrations/hospital-furniture.svg',
    subcategories: [
      {
        id: 'all',
        label: 'All Hospital Furniture',
        labelAr: 'جميع أثاث المستشفيات',
        matches: () => true
      },
      {
        id: 'beds-couches',
        label: 'Beds & Exam Couches',
        labelAr: 'الأسِرّة وأرائك الفحص',
        matches: (c, n) => /bed|couch|treatment chair|traction table|tilt table/i.test(c + ' ' + n)
      },
      {
        id: 'wheelchairs',
        label: 'Wheelchairs & Mobility',
        labelAr: 'الكراسي المتحركة والتنقل',
        matches: (c, n) => /wheelchair|mobility|stretcher|scooter/i.test(c + ' ' + n)
      },
      {
        id: 'trolleys',
        label: 'Medical Trolleys & Carts',
        labelAr: 'عربات نقل المستلزمات والطوارئ',
        matches: (c, n) => /trolley|cart|crash cart/i.test(c + ' ' + n)
      },
      {
        id: 'chairs-stools',
        label: 'Doctor & Operator Chairs',
        labelAr: 'كراسي الأطباء والفحص',
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
    titleAr: 'العناية المركزة (ICU)',
    desc: 'High-acuity ICU ventilators, infusion pumps & defibrillators.',
    descAr: 'أجهزة التنفس الاصطناعي للعناية المركزة، مضخات الحقن وأجهزة الصدمات.',
    illustration: '/images/illustrations/icu-care.svg'
  },
  {
    slug: 'patient-monitoring',
    title: 'Patient Monitoring',
    titleAr: 'مراقبة المرضى',
    desc: 'Multi-parameter monitors, ECG & wireless telemetry units.',
    descAr: 'شاشات متعددة المعايير، أجهزة تخطيط القلب والقياس اللاسلكي عن بعد.',
    illustration: '/images/illustrations/patient-monitoring.svg'
  },
  {
    slug: 'pharmacy-refrigerators',
    title: 'Medical Cold Storage',
    titleAr: 'التبريد الطبي والصيدلاني',
    desc: 'Certified 2–8°C pharmacy fridges & biofreezers.',
    descAr: 'ثلاجات صيدلانية معتمدة 2–8 درجات مئوية ومجمدات بيولوجية عميقة.',
    illustration: '/images/illustrations/medical-cold-storage.svg'
  },
  {
    slug: 'radiology-equipments',
    title: 'Ultrasound & Radiology',
    titleAr: 'السونار والأشعة',
    desc: 'Color Doppler ultrasound systems & mobile digital X-ray.',
    descAr: 'أنظمة الموجات فوق الصوتية الملونة وأجهزة الأشعة السينية الرقمية المتنقلة.',
    illustration: '/images/illustrations/ultrasound-radiology.svg'
  },
  {
    slug: 'laboratory-equipment',
    title: 'Clinical Laboratory',
    titleAr: 'المختبرات السريرية',
    desc: 'Biochemistry analyzers, centrifuges & biosafety cabinets.',
    descAr: 'محللات الكيمياء الحيوية، أجهزة الطرد المركزي وخزانات الأمان الحيوي.',
    illustration: '/images/illustrations/clinical-laboratory.svg'
  },
  {
    slug: 'hospital-furniture',
    title: 'Hospital Furniture',
    titleAr: 'أثاث المستشفيات',
    desc: 'Electric hospital beds, examination couches & dental units.',
    descAr: 'أسِرّة المستشفيات الكهربائية، أرائك الفحص والوحدات السريرية.',
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

