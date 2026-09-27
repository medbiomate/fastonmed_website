'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Languages,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Edit3,
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  FileText,
  Package,
  Layers,
  Sparkles,
  Zap,
  BarChart3,
  Database,
  Lock,
  X
} from 'lucide-react';
import type { TranslationRecord, TranslationStatus, EntityType } from '@/lib/translation-store';

export default function TranslationManager() {
  const [activeTab, setActiveTab] = useState<'translations' | 'terms' | 'telemetry'>('translations');
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<TranslationRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [summary, setSummary] = useState<any>({
    total: 0,
    translated: 0,
    missing: 0,
    outdated: 0,
    manually_edited: 0,
    failed: 0,
    total_requests: 0,
    characters_translated_total: 0,
    characters_translated_today: 0,
    characters_translated_month: 0,
    cache_hits: 0,
    api_calls_avoided: 0,
    failed_requests: 0,
  });
  const [protectedTerms, setProtectedTerms] = useState<string[]>([]);
  const [newTerm, setNewTerm] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 30;

  // Edit Modal
  const [editingRecord, setEditingRecord] = useState<TranslationRecord | null>(null);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  // Retranslating state
  const [retranslatingId, setRetranslatingId] = useState<string | null>(null);

  // Bulk translating state
  const [bulkTranslating, setBulkTranslating] = useState(false);
  const [bulkMessage, setBulkMessage] = useState('');

  // Notification message
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchTranslations = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({
        search,
        entityType: entityFilter,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/translations?${q.toString()}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records || []);
        setTotalRecords(data.totalRecords || 0);
        setSummary(data.summary || {});
        setProtectedTerms(data.protectedTerms || []);
      }
    } catch (err) {
      console.error('Failed to load translations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, [search, entityFilter, statusFilter, page]);

  const showNotice = (type: 'success' | 'error', text: string) => {
    setNotice({ type, text });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSaveManualEdit = async () => {
    if (!editingRecord) return;
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingRecord.id,
          translatedText: editText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', 'Manual translation saved and locked from auto-overwrite.');
        setEditingRecord(null);
        fetchTranslations();
      } else {
        showNotice('error', data.error || 'Failed to save translation.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Network error.');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleRetranslate = async (record: TranslationRecord) => {
    setRetranslatingId(record.id);
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'retranslate',
          entityType: record.entity_type,
          entityId: record.entity_id,
          fieldName: record.field_name,
          sourceText: record.source_text,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', `Field retranslated and saved to database.`);
        fetchTranslations();
      } else {
        showNotice('error', data.error || 'Retranslation failed.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Network error.');
    } finally {
      setRetranslatingId(null);
    }
  };

  const handleAddTerm = async () => {
    const term = newTerm.trim();
    if (!term) return;
    if (protectedTerms.includes(term)) {
      showNotice('error', 'Term is already in the protected list.');
      return;
    }
    const updated = [...protectedTerms, term];
    setProtectedTerms(updated);
    setNewTerm('');
    await saveTerms(updated);
  };

  const handleDeleteTerm = async (termToDelete: string) => {
    const updated = protectedTerms.filter((t) => t !== termToDelete);
    setProtectedTerms(updated);
    await saveTerms(updated);
  };

  const saveTerms = async (termsList: string[]) => {
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'save_terms',
          terms: termsList,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', 'Protected terms updated.');
      } else {
        showNotice('error', 'Failed to update protected terms.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Error saving terms.');
    }
  };

  const handleBulkTranslate = async () => {
    setBulkTranslating(true);
    setBulkMessage('Translating next batch of missing product records…');
    try {
      const res = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'bulk_translate_products',
          limit: 5,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showNotice('success', `Batch complete! Translated ${data.translatedCount} products to Arabic.`);
        fetchTranslations();
      } else {
        showNotice('error', data.error || 'Bulk translation failed.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Network error.');
    } finally {
      setBulkTranslating(false);
      setBulkMessage('');
    }
  };

  const getPreviewUrl = (record: TranslationRecord) => {
    if (record.entity_type === 'product') {
      return `/ar/product/${record.entity_id}`;
    }
    if (record.entity_type === 'category') {
      return `/ar/product-category/${record.entity_id}`;
    }
    if (record.entity_type === 'post') {
      return `/ar/blog/${record.entity_id}`;
    }
    if (record.entity_type === 'page') {
      return `/ar/${record.entity_id}`;
    }
    return '/ar';
  };

  const totalTranslated = (summary.translated || 0) + (summary.manually_edited || 0);
  const totalItems = Math.max(1, summary.total || 1);
  const translatedPercentage = Math.round((totalTranslated / totalItems) * 100);

  return (
    <div className="tk-admin-content" style={{ padding: '24px 32px' }}>
      {/* HEADER */}
      <div className="tk-page-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            MULTILINGUAL & LOCALIZATION
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f2923', margin: '4px 0 0' }}>
            Translation Management
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', margin: '4px 0 0' }}>
            Database-backed English ↔ Arabic translation system with zero-waste Google Cloud Translation API caching.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleBulkTranslate}
            disabled={bulkTranslating}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#134e4a',
              color: '#ffffff',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: bulkTranslating ? 'wait' : 'pointer',
              opacity: bulkTranslating ? 0.7 : 1,
            }}
          >
            <Sparkles size={16} />
            {bulkTranslating ? 'Translating…' : 'Translate Missing Products'}
          </button>

          <Link
            href="/ar"
            target="_blank"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              backgroundColor: '#f1f5f9',
              color: '#0f2923',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.88rem',
              border: '1px solid #cbd5e1',
            }}
          >
            <Globe size={16} />
            Preview Arabic Storefront <ExternalLink size={14} />
          </Link>
        </div>
      </div>

      {notice && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 8,
            marginBottom: 20,
            fontSize: '0.9rem',
            fontWeight: 600,
            backgroundColor: notice.type === 'success' ? '#dcfce7' : '#fee2e2',
            color: notice.type === 'success' ? '#166534' : '#991b1b',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          {notice.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          {notice.text}
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Fields</span>
            <Database size={18} color="#64748b" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2923' }}>{(summary.total || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.76rem', color: '#94a3b8', marginTop: 4 }}>Stored database records</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase' }}>Arabic Translated</span>
            <CheckCircle2 size={18} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>
            {(summary.translated || 0).toLocaleString()}
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#166534', marginLeft: 8 }}>({translatedPercentage}%)</span>
          </div>
          <div style={{ fontSize: '0.76rem', color: '#16a34a', marginTop: 4 }}>Active in production</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6b21a8', textTransform: 'uppercase' }}>Manually Edited</span>
            <Lock size={18} color="#9333ea" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#9333ea' }}>{(summary.manually_edited || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.76rem', color: '#6b21a8', marginTop: 4 }}>Protected against overwrite</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>Outdated Fields</span>
            <AlertTriangle size={18} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>{(summary.outdated || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.76rem', color: '#b45309', marginTop: 4 }}>Source English modified</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: '16px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>API Calls Avoided</span>
            <Zap size={18} color="#2563eb" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#2563eb' }}>{(summary.api_calls_avoided || 0).toLocaleString()}</div>
          <div style={{ fontSize: '0.76rem', color: '#2563eb', marginTop: 4 }}>Direct database hits</div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid #cbd5e1', marginBottom: 20 }}>
        <button
          onClick={() => setActiveTab('translations')}
          style={{
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '0.92rem',
            border: 'none',
            borderBottom: activeTab === 'translations' ? '3px solid #134e4a' : '3px solid transparent',
            color: activeTab === 'translations' ? '#134e4a' : '#64748b',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Languages size={18} />
          Translation Repository ({totalRecords})
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          style={{
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '0.92rem',
            border: 'none',
            borderBottom: activeTab === 'terms' ? '3px solid #134e4a' : '3px solid transparent',
            color: activeTab === 'terms' ? '#134e4a' : '#64748b',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <ShieldCheck size={18} />
          Protected Medical Terms ({protectedTerms.length})
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          style={{
            padding: '10px 20px',
            fontWeight: 700,
            fontSize: '0.92rem',
            border: 'none',
            borderBottom: activeTab === 'telemetry' ? '3px solid #134e4a' : '3px solid transparent',
            color: activeTab === 'telemetry' ? '#134e4a' : '#64748b',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <BarChart3 size={18} />
          API Telemetry & Cost Control
        </button>
      </div>

      {/* TAB 1: TRANSLATIONS LIST */}
      {activeTab === 'translations' && (
        <div>
          {/* SEARCH & FILTERS BAR */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 12,
              padding: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: 16,
              display: 'flex',
              gap: 14,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by text, ID, or field…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Entity:</span>
              <select
                value={entityFilter}
                onChange={(e) => {
                  setEntityFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="all">All Entities</option>
                <option value="product">Products</option>
                <option value="category">Categories</option>
                <option value="page">Pages</option>
                <option value="post">Blog Articles</option>
                <option value="ui">UI Strings</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
              >
                <option value="all">All Statuses</option>
                <option value="translated">Translated</option>
                <option value="manually_edited">Manually Edited (Locked)</option>
                <option value="outdated">Outdated</option>
                <option value="missing">Missing</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <button
              onClick={() => fetchTranslations()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 8,
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff',
                fontSize: '0.88rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* TRANSLATIONS TABLE */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 16px' }}>Entity &amp; Field</th>
                    <th style={{ padding: '12px 16px', width: '32%' }}>English (Source)</th>
                    <th style={{ padding: '12px 16px', width: '32%' }}>Arabic (Database Stored)</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                        Loading stored translations…
                      </td>
                    </tr>
                  ) : records.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#64748b' }}>
                        No translation records found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    records.map((r) => {
                      const isManual = r.translation_status === 'manually_edited';
                      const isOutdated = r.translation_status === 'outdated';
                      const isFailed = r.translation_status === 'failed';
                      const isRetranslating = retranslatingId === r.id;

                      let statusBadge = (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#dcfce7', color: '#166534' }}>
                          <CheckCircle2 size={12} /> Translated
                        </span>
                      );

                      if (isManual) {
                        statusBadge = (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#f3e8ff', color: '#6b21a8' }}>
                            <Lock size={12} /> Manually Edited
                          </span>
                        );
                      } else if (isOutdated) {
                        statusBadge = (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#fef3c7', color: '#92400e' }}>
                            <AlertTriangle size={12} /> Outdated
                          </span>
                        );
                      } else if (isFailed) {
                        statusBadge = (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 20, fontSize: '0.74rem', fontWeight: 700, backgroundColor: '#fee2e2', color: '#991b1b' }}>
                            <XCircle size={12} /> Failed
                          </span>
                        );
                      }

                      return (
                        <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#166534', backgroundColor: '#eaf7f2', padding: '2px 6px', borderRadius: 4 }}>
                                {r.entity_type}
                              </span>
                              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{r.field_name}</span>
                            </div>
                            <div style={{ fontWeight: 600, color: '#0f2923', fontSize: '0.84rem' }}>
                              {r.entity_id}
                            </div>
                          </td>

                          <td style={{ padding: '12px 16px', verticalAlign: 'top', color: '#334155' }}>
                            <div style={{ maxHeight: '80px', overflowY: 'auto', fontSize: '0.86rem', lineHeight: 1.4 }}>
                              {r.source_text}
                            </div>
                          </td>

                          <td style={{ padding: '12px 16px', verticalAlign: 'top', color: '#0f2923' }} dir="rtl">
                            <div style={{ maxHeight: '80px', overflowY: 'auto', fontSize: '0.86rem', lineHeight: 1.4, fontFamily: 'var(--font-tajawal), Cairo, sans-serif' }}>
                              {r.translated_text || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>غير مترجم بعد</span>}
                            </div>
                          </td>

                          <td style={{ padding: '12px 16px', verticalAlign: 'top' }}>
                            {statusBadge}
                            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>
                              Provider: {r.translation_provider}
                            </div>
                          </td>

                          <td style={{ padding: '12px 16px', verticalAlign: 'top', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                onClick={() => {
                                  setEditingRecord(r);
                                  setEditText(r.translated_text || '');
                                }}
                                title="Edit Arabic translation manually"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: 6,
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#334155',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                }}
                              >
                                <Edit3 size={13} /> Edit
                              </button>

                              <button
                                onClick={() => handleRetranslate(r)}
                                disabled={isRetranslating}
                                title="Call Google Translation API once to retranslate this field"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: 6,
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#134e4a',
                                  cursor: isRetranslating ? 'wait' : 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 4,
                                  fontSize: '0.78rem',
                                  fontWeight: 600,
                                }}
                              >
                                <RefreshCw size={13} className={isRetranslating ? 'spin' : ''} />
                                {isRetranslating ? 'Translating…' : 'API Translate'}
                              </button>

                              <Link
                                href={getPreviewUrl(r)}
                                target="_blank"
                                title="Preview on live Arabic website"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: 6,
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#0f2923',
                                  display: 'flex',
                                  alignItems: 'center',
                                  textDecoration: 'none',
                                }}
                              >
                                <ExternalLink size={13} />
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <div style={{ fontSize: '0.84rem', color: '#64748b' }}>
                Showing page {page} of {Math.max(1, Math.ceil(totalRecords / limit))} ({totalRecords} total entries)
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    backgroundColor: page <= 1 ? '#f1f5f9' : '#ffffff',
                    cursor: page <= 1 ? 'not-allowed' : 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  Previous
                </button>
                <button
                  disabled={page * limit >= totalRecords}
                  onClick={() => setPage(p => p + 1)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 6,
                    border: '1px solid #cbd5e1',
                    backgroundColor: page * limit >= totalRecords ? '#f1f5f9' : '#ffffff',
                    cursor: page * limit >= totalRecords ? 'not-allowed' : 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROTECTED MEDICAL TERMS */}
      {activeTab === 'terms' && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
          <div style={{ maxWidth: 800 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f2923', marginBottom: 8 }}>
              Protected Medical &amp; Technical Terminology
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 20 }}>
              Terms in this list are automatically wrapped with <code>translate=&quot;no&quot;</code> before being submitted to the Google Cloud Translation API. This guarantees that vital clinical acronyms (e.g. ECG, AED, ICU), manufacturer brand names (e.g. Philips, Mindray), model codes, SKUs, and regulatory identifiers are NEVER blindly or inaccurately translated into Arabic.
            </p>

            <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
              <input
                type="text"
                placeholder="Enter term to protect (e.g. Holter, BiPAP, Medtronic)…"
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTerm();
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.92rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleAddTerm}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '10px 20px',
                  backgroundColor: '#134e4a',
                  color: '#ffffff',
                  borderRadius: 8,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Add Term
              </button>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {protectedTerms.map((term) => (
                <span
                  key={term}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 12px',
                    borderRadius: 20,
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#1e293b',
                  }}
                >
                  <Lock size={12} color="#166534" />
                  {term}
                  <button
                    onClick={() => handleDeleteTerm(term)}
                    title={`Remove ${term}`}
                    style={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      color: '#94a3b8',
                      display: 'flex',
                      alignItems: 'center',
                      padding: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TELEMETRY & COST CONTROL */}
      {activeTab === 'telemetry' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2923', marginBottom: 16 }}>
              API Request Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Total Content Requests</span>
                <strong style={{ color: '#0f2923' }}>{(summary.total_requests || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Served from Database (0 API Calls)</span>
                <strong style={{ color: '#16a34a' }}>{(summary.api_calls_avoided || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Database Cache Hit Ratio</span>
                <strong style={{ color: '#16a34a' }}>
                  {summary.total_requests ? Math.round(((summary.cache_hits || 0) / summary.total_requests) * 100) : 100}%
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>API Calls Failed / Resiliently Caught</span>
                <strong style={{ color: '#991b1b' }}>{(summary.failed_requests || 0).toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#ffffff', borderRadius: 12, padding: 24, border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f2923', marginBottom: 16 }}>
              Google Cloud API Character Meter
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Characters Sent Today</span>
                <strong style={{ color: '#0f2923' }}>{(summary.characters_translated_today || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Characters Sent This Month</span>
                <strong style={{ color: '#0f2923' }}>{(summary.characters_translated_month || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Total Characters All-Time</span>
                <strong style={{ color: '#0f2923' }}>{(summary.characters_translated_total || 0).toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Google Free Tier Limit (Monthly)</span>
                <strong style={{ color: '#166534' }}>500,000 characters / month</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL EDIT MODAL */}
      {editingRecord && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              maxWidth: 640,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f2923', margin: 0 }}>
                  Edit Arabic Translation
                </h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  {editingRecord.entity_type} &bull; {editingRecord.entity_id} &bull; {editingRecord.field_name}
                </span>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                English Source (Read-only)
              </label>
              <div
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#f8fafc',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.88rem',
                  color: '#334155',
                  maxHeight: 120,
                  overflowY: 'auto',
                }}
              >
                {editingRecord.source_text}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                Approved Arabic Translation (RTL)
              </label>
              <textarea
                dir="rtl"
                rows={5}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.94rem',
                  fontFamily: 'var(--font-tajawal), Cairo, sans-serif',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.76rem', color: '#6b21a8', marginTop: 6 }}>
                <Lock size={12} /> Saving this edit marks it as <strong>manually_edited</strong> and protects it from being overwritten by future automated Google API calls.
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                onClick={() => setEditingRecord(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveManualEdit}
                disabled={savingEdit}
                style={{
                  padding: '9px 20px',
                  borderRadius: 8,
                  border: 'none',
                  backgroundColor: '#134e4a',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: savingEdit ? 'wait' : 'pointer',
                  opacity: savingEdit ? 0.7 : 1,
                }}
              >
                {savingEdit ? 'Saving…' : 'Save & Lock Translation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
