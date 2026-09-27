import { NextRequest, NextResponse } from 'next/server';
import { translationStore, EntityType, TranslationRecord } from '@/lib/translation-store';
import { getProtectedTerms, saveProtectedTerms } from '@/lib/protected-terms';
import { getOrTranslateField } from '@/lib/translation-service';
import { getAllProducts } from '@/lib/server-catalog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = (searchParams.get('search') || '').toLowerCase().trim();
    const entityType = searchParams.get('entityType') || 'all';
    const status = searchParams.get('status') || 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '25', 10)));

    const summary = translationStore.getSummaryStats();
    const allRecords = translationStore.getAllRecords();

    let filtered = allRecords;

    if (entityType !== 'all') {
      filtered = filtered.filter(r => r.entity_type === entityType);
    }

    if (status !== 'all') {
      filtered = filtered.filter(r => r.translation_status === status);
    }

    if (search) {
      filtered = filtered.filter(r =>
        r.id.toLowerCase().includes(search) ||
        r.entity_id.toLowerCase().includes(search) ||
        r.field_name.toLowerCase().includes(search) ||
        (r.source_text && r.source_text.toLowerCase().includes(search)) ||
        (r.translated_text && r.translated_text.toLowerCase().includes(search))
      );
    }

    // Sort: newest updated first
    filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    const totalRecords = filtered.length;
    const startIndex = (page - 1) * limit;
    const pagedRecords = filtered.slice(startIndex, startIndex + limit);

    const protectedTerms = getProtectedTerms();

    return NextResponse.json({
      success: true,
      summary,
      totalRecords,
      page,
      limit,
      totalPages: Math.ceil(totalRecords / limit),
      records: pagedRecords,
      protectedTerms,
    });
  } catch (err: any) {
    console.error('[API /api/admin/translations] GET Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'update') {
      const { id, translatedText } = body;
      if (!id || typeof translatedText !== 'string') {
        return NextResponse.json({ success: false, error: 'Missing id or translatedText' }, { status: 400 });
      }

      const all = translationStore.getAllRecords();
      const existing = all.find(r => r.id === id);
      if (!existing) {
        return NextResponse.json({ success: false, error: 'Translation record not found' }, { status: 404 });
      }

      const updated = translationStore.saveRecord({
        entity_type: existing.entity_type,
        entity_id: existing.entity_id,
        field_name: existing.field_name,
        target_language: existing.target_language,
        source_text: existing.source_text,
        translated_text: translatedText.trim(),
        translation_status: 'manually_edited',
        translation_provider: 'manual',
        manual_translation_review_required: false,
      });

      return NextResponse.json({ success: true, record: updated });
    }

    if (action === 'retranslate') {
      const { entityType, entityId, fieldName, sourceText } = body;
      if (!entityType || !entityId || !fieldName || !sourceText) {
        return NextResponse.json({ success: false, error: 'Missing translation parameters' }, { status: 400 });
      }

      const newTranslation = await getOrTranslateField({
        entity_type: entityType as EntityType,
        entity_id: entityId,
        field_name: fieldName,
        source_text: sourceText,
        forceRetranslate: true,
      });

      const updated = translationStore.getRecord(entityType, entityId, fieldName, 'ar');
      return NextResponse.json({ success: true, translatedText: newTranslation, record: updated });
    }

    if (action === 'save_terms') {
      const { terms } = body;
      if (!Array.isArray(terms)) {
        return NextResponse.json({ success: false, error: 'Terms must be an array of strings' }, { status: 400 });
      }
      const ok = saveProtectedTerms(terms);
      return NextResponse.json({ success: ok, protectedTerms: getProtectedTerms() });
    }

    if (action === 'bulk_translate_products') {
      const limit = Math.min(20, Math.max(1, body.limit || 5));
      const products = await getAllProducts();

      let translatedCount = 0;
      for (const p of products) {
        if (translatedCount >= limit) break;
        const nameRecord = translationStore.getRecord('product', p.slug, 'name', 'ar');
        if (!nameRecord || nameRecord.translation_status === 'missing' || nameRecord.translation_status === 'outdated') {
          await getOrTranslateField({
            entity_type: 'product',
            entity_id: p.slug,
            field_name: 'name',
            source_text: p.name,
          });
          const desc = p.shortDescription || p.fullDescription;
          if (desc) {
            await getOrTranslateField({
              entity_type: 'product',
              entity_id: p.slug,
              field_name: 'description',
              source_text: desc,
              format: 'html',
            });
          }
          translatedCount++;
        }
      }

      return NextResponse.json({
        success: true,
        translatedCount,
        summary: translationStore.getSummaryStats(),
      });
    }

    return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
  } catch (err: any) {
    console.error('[API /api/admin/translations] POST Error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
