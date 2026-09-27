import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type TranslationStatus = 'missing' | 'translated' | 'outdated' | 'manually_edited' | 'failed';
export type TranslationProvider = 'google' | 'manual' | 'static';
export type EntityType = 'product' | 'category' | 'page' | 'post' | 'ui' | 'meta' | 'custom';

export interface TranslationRecord {
  id: string; // composite key: entity_type:entity_id:field_name:target_language
  entity_type: EntityType;
  entity_id: string;
  field_name: string;
  source_language: string; // 'en'
  target_language: string; // 'ar'
  source_text: string;
  translated_text: string;
  source_hash: string;
  translation_status: TranslationStatus;
  translation_provider: TranslationProvider;
  created_at: string;
  updated_at: string;
  translated_at?: string;
  manual_translation_review_required?: boolean;
}

export interface TranslationUsageStats {
  total_requests: number;
  characters_translated_total: number;
  characters_translated_today: number;
  characters_translated_month: number;
  cache_hits: number;
  api_calls_avoided: number;
  failed_requests: number;
  last_reset_day: string;
  last_reset_month: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const TRANSLATIONS_FILE = path.join(DATA_DIR, 'translations.json');
const USAGE_FILE = path.join(DATA_DIR, 'translation-usage.json');

export function computeSourceHash(text: string): string {
  if (!text) return '';
  return crypto.createHash('sha256').update(text.trim()).digest('hex').slice(0, 16);
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

class TranslationStore {
  private records: Map<string, TranslationRecord> = new Map();
  private hashIndex: Map<string, TranslationRecord> = new Map();
  private usage: TranslationUsageStats = {
    total_requests: 0,
    characters_translated_total: 0,
    characters_translated_today: 0,
    characters_translated_month: 0,
    cache_hits: 0,
    api_calls_avoided: 0,
    failed_requests: 0,
    last_reset_day: getTodayKey(),
    last_reset_month: getMonthKey(),
  };
  private isLoaded = false;
  private saveTimeout: NodeJS.Timeout | null = null;
  private usageSaveTimeout: NodeJS.Timeout | null = null;

  constructor() {
    this.ensureLoaded();
  }

  private ensureLoaded() {
    if (this.isLoaded) return;
    this.isLoaded = true;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(TRANSLATIONS_FILE)) {
        const raw = fs.readFileSync(TRANSLATIONS_FILE, 'utf-8');
        const list: TranslationRecord[] = JSON.parse(raw);
        if (Array.isArray(list)) {
          for (const item of list) {
            const key = this.makeKey(item.entity_type, item.entity_id, item.field_name, item.target_language);
            this.records.set(key, item);
            if (item.source_hash && item.translated_text && item.translation_status !== 'failed') {
              this.hashIndex.set(`${item.target_language}:${item.source_hash}`, item);
            }
          }
        }
      }

      if (fs.existsSync(USAGE_FILE)) {
        const rawUsage = fs.readFileSync(USAGE_FILE, 'utf-8');
        const parsedUsage = JSON.parse(rawUsage);
        this.usage = { ...this.usage, ...parsedUsage };
        this.checkUsageResets();
      }
    } catch (err) {
      console.error('[TranslationStore] Error loading files:', err);
    }
  }

  public makeKey(entity_type: string, entity_id: string, field_name: string, target_language: string): string {
    return `${entity_type}:${entity_id}:${field_name}:${target_language}`.toLowerCase();
  }

  public getRecord(
    entity_type: EntityType,
    entity_id: string,
    field_name: string,
    target_language = 'ar'
  ): TranslationRecord | null {
    this.ensureLoaded();
    const key = this.makeKey(entity_type, entity_id, field_name, target_language);
    return this.records.get(key) || null;
  }

  public findReusableByHash(source_hash: string, target_language = 'ar'): TranslationRecord | null {
    this.ensureLoaded();
    if (!source_hash) return null;
    return this.hashIndex.get(`${target_language}:${source_hash}`) || null;
  }

  public saveRecord(partial: Partial<TranslationRecord> & {
    entity_type: EntityType;
    entity_id: string;
    field_name: string;
    target_language: string;
    source_text: string;
  }): TranslationRecord {
    this.ensureLoaded();
    const key = this.makeKey(partial.entity_type, partial.entity_id, partial.field_name, partial.target_language);
    const existing = this.records.get(key);
    const now = new Date().toISOString();
    const source_hash = partial.source_hash || computeSourceHash(partial.source_text);

    const record: TranslationRecord = {
      id: key,
      entity_type: partial.entity_type,
      entity_id: partial.entity_id,
      field_name: partial.field_name,
      source_language: partial.source_language || 'en',
      target_language: partial.target_language,
      source_text: partial.source_text,
      translated_text: partial.translated_text ?? (existing?.translated_text || ''),
      source_hash,
      translation_status: partial.translation_status || existing?.translation_status || 'translated',
      translation_provider: partial.translation_provider || existing?.translation_provider || 'google',
      created_at: existing?.created_at || now,
      updated_at: now,
      translated_at: partial.translated_at || (partial.translated_text ? now : existing?.translated_at),
      manual_translation_review_required: partial.manual_translation_review_required ?? existing?.manual_translation_review_required ?? false,
    };

    this.records.set(key, record);
    if (record.source_hash && record.translated_text && record.translation_status !== 'failed') {
      this.hashIndex.set(`${record.target_language}:${record.source_hash}`, record);
    }

    this.scheduleSave();
    return record;
  }

  public saveBatch(records: TranslationRecord[]) {
    this.ensureLoaded();
    for (const record of records) {
      const key = this.makeKey(record.entity_type, record.entity_id, record.field_name, record.target_language);
      this.records.set(key, record);
      if (record.source_hash && record.translated_text && record.translation_status !== 'failed') {
        this.hashIndex.set(`${record.target_language}:${record.source_hash}`, record);
      }
    }
    this.scheduleSave();
  }

  public getAllRecords(): TranslationRecord[] {
    this.ensureLoaded();
    return Array.from(this.records.values());
  }

  public getUsageStats(): TranslationUsageStats {
    this.ensureLoaded();
    this.checkUsageResets();
    return { ...this.usage };
  }

  public recordApiUsage(characters: number, isSuccess = true) {
    this.ensureLoaded();
    this.checkUsageResets();
    this.usage.total_requests += 1;
    if (isSuccess) {
      this.usage.characters_translated_total += characters;
      this.usage.characters_translated_today += characters;
      this.usage.characters_translated_month += characters;
    } else {
      this.usage.failed_requests += 1;
    }
    this.scheduleUsageSave();
  }

  public recordCacheHit() {
    this.ensureLoaded();
    this.checkUsageResets();
    this.usage.total_requests += 1;
    this.usage.cache_hits += 1;
    this.usage.api_calls_avoided += 1;
    this.scheduleUsageSave();
  }

  private checkUsageResets() {
    const today = getTodayKey();
    const month = getMonthKey();

    if (this.usage.last_reset_day !== today) {
      this.usage.characters_translated_today = 0;
      this.usage.last_reset_day = today;
    }

    if (this.usage.last_reset_month !== month) {
      this.usage.characters_translated_month = 0;
      this.usage.last_reset_month = month;
    }
  }

  public getSummaryStats() {
    this.ensureLoaded();
    const records = Array.from(this.records.values());
    const total = records.length;
    let translated = 0;
    let missing = 0;
    let outdated = 0;
    let manually_edited = 0;
    let failed = 0;

    for (const r of records) {
      switch (r.translation_status) {
        case 'translated':
          translated++;
          break;
        case 'manually_edited':
          manually_edited++;
          break;
        case 'outdated':
          outdated++;
          break;
        case 'missing':
          missing++;
          break;
        case 'failed':
          failed++;
          break;
      }
    }

    const usage = this.getUsageStats();
    return {
      total,
      translated,
      missing,
      outdated,
      manually_edited,
      failed,
      ...usage,
    };
  }

  private scheduleSave() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.flushToFile();
    }, 500);
  }

  private scheduleUsageSave() {
    if (this.usageSaveTimeout) clearTimeout(this.usageSaveTimeout);
    this.usageSaveTimeout = setTimeout(() => {
      this.flushUsageToFile();
    }, 500);
  }

  private flushToFile() {
    try {
      const list = Array.from(this.records.values());
      fs.writeFileSync(TRANSLATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
    } catch (err) {
      console.error('[TranslationStore] Error writing translations file:', err);
    }
  }

  private flushUsageToFile() {
    try {
      fs.writeFileSync(USAGE_FILE, JSON.stringify(this.usage, null, 2), 'utf-8');
    } catch (err) {
      console.error('[TranslationStore] Error writing usage file:', err);
    }
  }
}

export const translationStore = new TranslationStore();
