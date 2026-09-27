import { translationStore, computeSourceHash, EntityType, TranslationRecord } from './translation-store';
import { protectContent, cleanProtectedHtml } from './protected-terms';

interface TranslateFieldOptions {
  entity_type: EntityType;
  entity_id: string;
  field_name: string;
  source_text: string;
  source_language?: string;
  target_language?: string;
  format?: 'text' | 'html';
  forceRetranslate?: boolean;
}

const inFlightMap = new Map<string, Promise<string>>();

/**
 * Execute raw translation request to Google Cloud Translation API (v2)
 */
async function callGoogleTranslateApi(
  strings: string[],
  sourceLang = 'en',
  targetLang = 'ar',
  format: 'text' | 'html' = 'html'
): Promise<string[]> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.warn('[TranslationService] GOOGLE_TRANSLATE_API_KEY not configured. Falling back to source text.');
    return strings;
  }

  if (strings.length === 0) return [];

  // Protect terms & format
  const protectedStrings = strings.map(s => {
    const { protectedText } = protectContent(s);
    return protectedText;
  });

  const totalChars = strings.reduce((sum, s) => sum + s.length, 0);

  try {
    const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: protectedStrings,
        source: sourceLang,
        target: targetLang,
        format: format,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[TranslationService] Google API Error (${response.status}):`, errText);
      translationStore.recordApiUsage(totalChars, false);
      return strings; // graceful fallback to original English
    }

    const data = await response.json();
    const translations = data?.data?.translations;

    if (!Array.isArray(translations) || translations.length !== strings.length) {
      console.error('[TranslationService] Unexpected response structure from Google API:', data);
      translationStore.recordApiUsage(totalChars, false);
      return strings;
    }

    // Record successful API usage
    translationStore.recordApiUsage(totalChars, true);

    return translations.map((t: any) => {
      let raw = t.translatedText || '';
      // Ensure FastonMed brand name is intact
      raw = cleanProtectedHtml(raw);
      return raw;
    });
  } catch (error) {
    console.error('[TranslationService] Network error calling Google Translate API:', error);
    translationStore.recordApiUsage(totalChars, false);
    return strings; // graceful fallback to English
  }
}

/**
 * Retrieves a translated field from the database if valid, or fetches from Google API once and persists.
 * Minimizes Google API usage by checking source hash and in-flight mutex.
 */
export async function getOrTranslateField(options: TranslateFieldOptions): Promise<string> {
  const {
    entity_type,
    entity_id,
    field_name,
    source_text,
    source_language = 'en',
    target_language = 'ar',
    format = 'html',
    forceRetranslate = false,
  } = options;

  if (!source_text || typeof source_text !== 'string' || !source_text.trim()) {
    return source_text || '';
  }

  // If source and target are the same, no translation needed
  if (source_language === target_language) {
    return source_text;
  }

  const cleanSource = source_text.trim();
  const currentHash = computeSourceHash(cleanSource);

  // 1. STEP 1: CHECK DATABASE FIRST
  const existing = translationStore.getRecord(entity_type, entity_id, field_name, target_language);

  if (existing) {
    // If manually edited, ALWAYS preserve manual edit
    if (existing.translation_status === 'manually_edited') {
      if (existing.source_hash !== currentHash) {
        // Mark that English source changed so administrator can review
        translationStore.saveRecord({
          ...existing,
          manual_translation_review_required: true,
        });
      }
      translationStore.recordCacheHit();
      return existing.translated_text;
    }

    // If translated and source hash matches, return directly (0 API calls!)
    if (!forceRetranslate && existing.translation_status === 'translated' && existing.source_hash === currentHash) {
      translationStore.recordCacheHit();
      return existing.translated_text;
    }
  }

  // 2. STEP 2: CHECK REUSABLE TRANSLATION CACHE (same phrase used across different entities)
  if (!forceRetranslate) {
    const reusable = translationStore.findReusableByHash(currentHash, target_language);
    if (reusable && reusable.translated_text && reusable.translation_status !== 'failed') {
      // Re-use existing translation without calling Google
      translationStore.saveRecord({
        entity_type,
        entity_id,
        field_name,
        source_language,
        target_language,
        source_text: cleanSource,
        translated_text: reusable.translated_text,
        source_hash: currentHash,
        translation_status: 'translated',
        translation_provider: 'static',
      });
      translationStore.recordCacheHit();
      return reusable.translated_text;
    }
  }

  // 3. STEP 3: DEDUPLICATION LOCK (prevent 100 concurrent requests from triggering 100 API calls)
  const mutexKey = `${entity_type}:${entity_id}:${field_name}:${target_language}:${currentHash}`.toLowerCase();
  const inFlight = inFlightMap.get(mutexKey);
  if (inFlight) {
    return await inFlight;
  }

  // 4. STEP 4: CALL GOOGLE API ONCE, SAVE TO DATABASE, RETURN SAVED CONTENT
  const translationPromise = (async () => {
    try {
      const [translated] = await callGoogleTranslateApi([cleanSource], source_language, target_language, format);
      const isSuccess = translated && translated !== cleanSource;

      const savedRecord = translationStore.saveRecord({
        entity_type,
        entity_id,
        field_name,
        source_language,
        target_language,
        source_text: cleanSource,
        translated_text: translated || cleanSource,
        source_hash: currentHash,
        translation_status: isSuccess ? 'translated' : 'failed',
        translation_provider: 'google',
      });

      return savedRecord.translated_text;
    } finally {
      inFlightMap.delete(mutexKey);
    }
  })();

  inFlightMap.set(mutexKey, translationPromise);
  return await translationPromise;
}

/**
 * Translates multiple fields of an entity in a single compact batch Google API request
 * Only sends fields that are actually missing or outdated.
 */
export async function translateEntityFields<T extends Record<string, string>>(
  entity_type: EntityType,
  entity_id: string,
  fields: T,
  target_language = 'ar',
  forceRetranslate = false
): Promise<T> {
  const result: Record<string, string> = { ...fields };
  const missingFieldNames: string[] = [];
  const missingFieldSources: string[] = [];
  const missingFieldHashes: string[] = [];

  for (const [fieldName, sourceText] of Object.entries(fields)) {
    if (!sourceText || typeof sourceText !== 'string' || !sourceText.trim()) {
      result[fieldName] = sourceText;
      continue;
    }

    const clean = sourceText.trim();
    const hash = computeSourceHash(clean);
    const existing = translationStore.getRecord(entity_type, entity_id, fieldName, target_language);

    if (existing) {
      if (existing.translation_status === 'manually_edited') {
        result[fieldName] = existing.translated_text;
        translationStore.recordCacheHit();
        continue;
      }

      if (!forceRetranslate && existing.translation_status === 'translated' && existing.source_hash === hash) {
        result[fieldName] = existing.translated_text;
        translationStore.recordCacheHit();
        continue;
      }
    }

    // Check reusable cache
    if (!forceRetranslate) {
      const reusable = translationStore.findReusableByHash(hash, target_language);
      if (reusable && reusable.translated_text) {
        translationStore.saveRecord({
          entity_type,
          entity_id,
          field_name: fieldName,
          source_language: 'en',
          target_language,
          source_text: clean,
          translated_text: reusable.translated_text,
          source_hash: hash,
          translation_status: 'translated',
          translation_provider: 'static',
        });
        result[fieldName] = reusable.translated_text;
        translationStore.recordCacheHit();
        continue;
      }
    }

    // Needs translation
    missingFieldNames.push(fieldName);
    missingFieldSources.push(clean);
    missingFieldHashes.push(hash);
  }

  // If nothing is missing, all fields were served 100% from database/cache! (0 API calls)
  if (missingFieldNames.length === 0) {
    return result as T;
  }

  // Batch translate only the missing fields
  const translatedValues = await callGoogleTranslateApi(missingFieldSources, 'en', target_language, 'html');

  for (let i = 0; i < missingFieldNames.length; i++) {
    const fieldName = missingFieldNames[i];
    const sourceText = missingFieldSources[i];
    const sourceHash = missingFieldHashes[i];
    const translatedText = translatedValues[i] || sourceText;
    const isSuccess = Boolean(translatedText && translatedText !== sourceText);

    translationStore.saveRecord({
      entity_type,
      entity_id,
      field_name: fieldName,
      source_language: 'en',
      target_language,
      source_text: sourceText,
      translated_text: translatedText,
      source_hash: sourceHash,
      translation_status: isSuccess ? 'translated' : 'failed',
      translation_provider: 'google',
    });

    result[fieldName] = translatedText;
  }

  return result as T;
}

export interface SingleContentOptions {
  entityType: EntityType;
  entityId: string;
  fieldName: string;
  sourceText: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  isHtml?: boolean;
}

export async function getOrTranslateContent(options: SingleContentOptions): Promise<string> {
  return getOrTranslateField({
    entity_type: options.entityType,
    entity_id: options.entityId,
    field_name: options.fieldName,
    source_text: options.sourceText,
    source_language: options.sourceLanguage || 'en',
    target_language: options.targetLanguage || 'ar',
    format: options.isHtml ? 'html' : 'text',
  });
}

export interface BatchItem {
  fieldName: string;
  sourceText: string;
  isHtml?: boolean;
}

export interface BatchOptions {
  entityType: EntityType;
  entityId: string;
  items: BatchItem[];
  sourceLanguage?: string;
  targetLanguage?: string;
}

export async function getOrTranslateBatch(options: BatchOptions): Promise<Record<string, string>> {
  const fieldsMap: Record<string, string> = {};
  for (const item of options.items) {
    fieldsMap[item.fieldName] = item.sourceText;
  }
  return translateEntityFields(
    options.entityType,
    options.entityId,
    fieldsMap,
    options.targetLanguage || 'ar'
  );
}
