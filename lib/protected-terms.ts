import fs from 'fs';
import path from 'path';

export const DEFAULT_PROTECTED_TERMS = [
  'FastonMed',
  'FASTONMED TRADING L.L.C',
  'ECG',
  'AED',
  'ICU',
  'MRI',
  'CT',
  'EEG',
  'EMG',
  'HFNC',
  'BiPAP',
  'CPAP',
  'PRP',
  'PPM',
  'AMC',
  'CMC',
  'OT',
  'NICU',
  'CCU',
  'ABPM',
  'TMT',
  'SPO2',
  'NIBP',
  'IV',
  'PCR',
  'Mindray',
  'Philips',
  'GE Healthcare',
  'Siemens',
  'Dräger',
  'Medtronic',
  'Baxter',
  'B. Braun',
  'Stryker',
  'Olympus',
  'Karl Storz',
  'Erbe',
  'Welch Allyn',
  'Zoll',
  'Defibtech',
  'Nihon Kohden',
  'ISO',
  'CE',
  'FDA',
  'DHCC',
  'SKU',
  'AED',
  'VAT',
  'TRN',
  'L.L.C',
  'LLC'
];

const TERMS_FILE = path.join(process.cwd(), 'data', 'protected-terms.json');

let cachedTerms: string[] | null = null;

export function getProtectedTerms(): string[] {
  if (cachedTerms) return cachedTerms;

  try {
    if (fs.existsSync(TERMS_FILE)) {
      const data = fs.readFileSync(TERMS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedTerms = Array.from(new Set([...DEFAULT_PROTECTED_TERMS, ...parsed]));
        return cachedTerms;
      }
    }
  } catch (err) {
    console.error('Error loading protected terms:', err);
  }

  cachedTerms = [...DEFAULT_PROTECTED_TERMS];
  return cachedTerms;
}

export function saveProtectedTerms(terms: string[]): boolean {
  try {
    cachedTerms = Array.from(new Set(terms.filter(t => Boolean(t && t.trim()))));
    const dir = path.dirname(TERMS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(TERMS_FILE, JSON.stringify(cachedTerms, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving protected terms:', err);
    return false;
  }
}

/**
 * Protect terms by wrapping them with <span class="notranslate" translate="no">...</span>
 * Google Cloud Translation API respects this and preserves the exact text.
 */
export function protectContent(text: string): { protectedText: string; tokens: Array<{ id: string; original: string }> } {
  if (!text || typeof text !== 'string') {
    return { protectedText: text || '', tokens: [] };
  }

  const terms = getProtectedTerms();
  // Sort descending by length so longer multi-word phrases match first
  const sortedTerms = [...terms].sort((a, b) => b.length - a.length);

  let processed = text;
  const tokens: Array<{ id: string; original: string }> = [];

  // Protect email addresses
  processed = processed.replace(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match) => {
    const id = `__PROT_EMAIL_${tokens.length}__`;
    tokens.push({ id, original: match });
    return `<span class="notranslate" translate="no">${match}</span>`;
  });

  // Protect URLs
  processed = processed.replace(/(https?:\/\/[^\s<>"']+)/g, (match) => {
    const id = `__PROT_URL_${tokens.length}__`;
    tokens.push({ id, original: match });
    return `<span class="notranslate" translate="no">${match}</span>`;
  });

  // Protect phone numbers
  processed = processed.replace(/(\+971[\s0-9-]{7,15})/g, (match) => {
    const id = `__PROT_PHONE_${tokens.length}__`;
    tokens.push({ id, original: match });
    return `<span class="notranslate" translate="no">${match}</span>`;
  });

  // Protect exact words/terms
  for (const term of sortedTerms) {
    if (!term || term.length < 2) continue;
    // Word boundary regex
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!<span class="notranslate" translate="no">)\\b(${escaped})\\b(?![^<]*<\\/span>)`, 'gi');
    processed = processed.replace(regex, `<span class="notranslate" translate="no">$1</span>`);
  }

  return { protectedText: processed, tokens };
}

/**
 * Unwraps <span class="notranslate" translate="no">...</span> back to clean text if desired,
 * or keeps clean HTML.
 */
export function cleanProtectedHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<span\s+class="notranslate"\s+translate="no">([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<span\s+translate="no"\s+class="notranslate">([\s\S]*?)<\/span>/gi, '$1');
}
