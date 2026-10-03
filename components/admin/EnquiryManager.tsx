'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  Mail,
  Phone,
  RefreshCw,
  Search,
  Trash2,
  X,
} from 'lucide-react';

type Enquiry = {
  id: string;
  clientName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  category?: string;
  product?: string;
  stage?: string;
  notes?: string;
  createdAt?: string;
};

// Helper: parse [Tag: Value] patterns from website RFQ notes
function parseEnquiryNotes(rawNotes?: string) {
  if (!rawNotes) return { tags: [] as { label: string; value: string }[], message: '' };

  const tags: { label: string; value: string }[] = [];
  const tagRegex = /\[([^:]+):\s*([^\]]+)\]/g;
  let match;
  while ((match = tagRegex.exec(rawNotes)) !== null) {
    tags.push({ label: match[1].trim(), value: match[2].trim() });
  }

  let message = rawNotes.replace(/\[[^\]]+\]/g, '').trim();
  message = message.replace(/^notes?:\s*/i, '').trim();

  return { tags, message };
}

function formatEnquiryDate(dateStr?: string) {
  if (!dateStr) return { date: '—', time: '' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: dateStr, time: '' };

    const dateFormatted = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const timeFormatted = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    return { date: dateFormatted, time: timeFormatted };
  } catch {
    return { date: dateStr || '—', time: '' };
  }
}

const AVATAR_COLORS = [
  { bg: '#f0fdf4', text: '#166534', border: '#bbf7d0' },
  { bg: '#f0f9ff', text: '#075985', border: '#bae6fd' },
  { bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  { bg: '#fff7ed', text: '#9a3412', border: '#fed7aa' },
  { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' },
];

function getInitials(name?: string) {
  if (!name) return 'EN';
  const clean = name.replace(/^(dr\.|eng\.|mr\.|mrs\.|ms\.)\s*/i, '').trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return (clean.slice(0, 2) || 'EN').toUpperCase();
}

function getAvatarStyle(name?: string) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name!.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

const STAGES = [
  { label: 'New Lead', bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', dot: '#10b981' },
  { label: 'Contacted', bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd', dot: '#0284c7' },
  { label: 'Qualified', bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe', dot: '#8b5cf6' },
  { label: 'Proposal Sent', bg: '#fffbeb', text: '#b45309', border: '#fde68a', dot: '#f59e0b' },
  { label: 'Closed', bg: '#f8fafc', text: '#475569', border: '#e2e8f0', dot: '#94a3b8' },
];

export default function EnquiryManager() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/enquiries', { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Unable to load enquiries');
      setItems(payload.enquiries || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const filtered = useMemo(() => items.filter((item) => {
    const matchesStage = stageFilter === 'ALL' || (item.stage || 'New Lead').toLowerCase() === stageFilter.toLowerCase();
    const searchTerms = [item.contactName, item.clientName, item.email, item.phone, item.category, item.product, item.notes]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    const matchesQuery = !query.trim() || searchTerms.includes(query.toLowerCase());
    return matchesStage && matchesQuery;
  }), [items, query, stageFilter]);

  const counts = useMemo(() => ({
    all: items.length,
    newLead: items.filter((x) => (x.stage || 'New Lead') === 'New Lead').length,
    contacted: items.filter((x) => x.stage === 'Contacted').length,
    qualified: items.filter((x) => x.stage === 'Qualified' || x.stage === 'Proposal Sent').length,
  }), [items]);

  const remove = async (item: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${item.contactName || item.clientName || 'this customer'}?`)) return;
    setDeleting(item.id);
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Delete failed');
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      if (selectedEnquiry?.id === item.id) setSelectedEnquiry(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ color: '#004d66', fontWeight: 700, fontSize: 11.5, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Website RFQs & Enquiries
          </div>
          <h1 style={{ margin: '4px 0 2px 0', fontSize: 26, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
            Inquiries
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>
            Direct customer equipment inquiries synchronized with the FastonMed CRM.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => void load()}
            disabled={loading}
            style={{
              padding: '8px 14px',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              background: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              color: '#334155',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Refreshing…' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All', count: counts.all },
            { id: 'New Lead', label: 'New Leads', count: counts.newLead, dot: '#10b981' },
            { id: 'Contacted', label: 'Contacted', count: counts.contacted, dot: '#0284c7' },
            { id: 'Qualified', label: 'Qualified', count: counts.qualified, dot: '#8b5cf6' },
          ].map((tab) => {
            const isActive = stageFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStageFilter(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 18,
                  fontSize: 12.5,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0f172a' : '#64748b',
                  background: isActive ? '#ffffff' : 'transparent',
                  border: isActive ? '1px solid #cbd5e1' : '1px solid transparent',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.dot && (
                  <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: tab.dot }} />
                )}
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '1px 6px',
                    borderRadius: 10,
                    backgroundColor: isActive ? '#f1f5f9' : '#e2e8f0',
                    color: isActive ? '#0f172a' : '#64748b',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', width: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contact, hospital, product…"
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '7px 28px 7px 34px',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              fontSize: 12.5,
              background: '#ffffff',
              color: '#0f172a',
              outline: 'none',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
        {error && <div style={{ padding: 18, color: '#b91c1c', fontSize: 13 }}>{error}</div>}

        {!error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#fbfcfd', borderBottom: '1px solid #f1f5f9', color: '#64748b', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 18px', width: '26%' }}>CONTACT</th>
                  <th style={{ padding: '12px 14px', width: '22%' }}>ORGANISATION</th>
                  <th style={{ padding: '12px 14px', width: '28%' }}>REQUIREMENT</th>
                  <th style={{ padding: '12px 14px', width: '12%' }}>STATUS</th>
                  <th style={{ padding: '12px 14px', width: '14%' }}>RECEIVED</th>
                  <th style={{ padding: '12px 18px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const avatar = getAvatarStyle(item.contactName || item.clientName);
                  const initials = getInitials(item.contactName);
                  const { tags, message } = parseEnquiryNotes(item.notes);
                  const { date, time } = formatEnquiryDate(item.createdAt);
                  const currentStage = STAGES.find((s) => s.label.toLowerCase() === (item.stage || 'New Lead').toLowerCase()) || STAGES[0];

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedEnquiry(item)}
                      style={{ borderBottom: '1px solid #f8fafc', cursor: 'pointer', transition: 'background 0.15s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {/* Contact */}
                      <td style={{ padding: '13px 18px', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              backgroundColor: avatar.bg,
                              color: avatar.text,
                              border: `1px solid ${avatar.border}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 11.5,
                              fontWeight: 700,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 13 }}>
                              {item.contactName || item.clientName || 'Direct Inquiry'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, fontSize: 11.5, color: '#64748b' }}>
                              {item.email && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <Mail size={11} /> {item.email}
                                </span>
                              )}
                              {item.phone && (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                                  <Phone size={11} /> {item.phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Organisation */}
                      <td style={{ padding: '13px 14px', verticalAlign: 'middle' }}>
                        {item.clientName ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Building2 size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                            <span style={{ fontWeight: 500, color: '#334155', fontSize: 12.5 }}>
                              {item.clientName}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: 12.5 }}>Private Request</span>
                        )}
                      </td>

                      {/* Requirement */}
                      <td style={{ padding: '13px 14px', verticalAlign: 'middle' }}>
                        <div style={{ maxWidth: 320 }}>
                          <div style={{ fontWeight: 600, color: '#0f172a', fontSize: 12.5 }}>
                            {item.product || item.category || 'Equipment RFQ'}
                          </div>
                          {tags.length > 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                              {tags.slice(0, 2).map((t, idx) => (
                                <span
                                  key={idx}
                                  style={{
                                    fontSize: 10.5,
                                    color: '#475569',
                                    backgroundColor: '#f1f5f9',
                                    padding: '1.5px 6px',
                                    borderRadius: 4,
                                  }}
                                >
                                  {t.value}
                                </span>
                              ))}
                            </div>
                          ) : message ? (
                            <div style={{ fontSize: 11.5, color: '#64748b', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {message}
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '13px 14px', verticalAlign: 'middle' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            backgroundColor: currentStage.bg,
                            color: currentStage.text,
                            border: `1px solid ${currentStage.border}`,
                            borderRadius: 18,
                            padding: '3px 8px',
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          <span style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: currentStage.dot }} />
                          {currentStage.label}
                        </span>
                      </td>

                      {/* Received */}
                      <td style={{ padding: '13px 14px', verticalAlign: 'middle' }}>
                        <div style={{ color: '#334155', fontSize: 12, fontWeight: 500 }}>{date}</div>
                        {time && <div style={{ color: '#94a3b8', fontSize: 10.5, marginTop: 2 }}>{time}</div>}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '13px 18px', textAlign: 'right', verticalAlign: 'middle' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedEnquiry(item)}
                            title="View details"
                            style={{
                              width: 28,
                              height: 28,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 6,
                              border: '1px solid #e2e8f0',
                              background: '#ffffff',
                              color: '#64748b',
                              cursor: 'pointer',
                            }}
                          >
                            <Eye size={13} />
                          </button>
                          <button
                            disabled={deleting === item.id}
                            onClick={() => void remove(item)}
                            title="Delete enquiry"
                            style={{
                              width: 28,
                              height: 28,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 6,
                              border: '1px solid transparent',
                              background: 'transparent',
                              color: '#94a3b8',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#fee2e2';
                              e.currentTarget.style.color = '#dc2626';
                              e.currentTarget.style.background = '#fef2f2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'transparent';
                              e.currentTarget.style.color = '#94a3b8';
                              e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
            No website enquiries found.
          </div>
        )}
      </div>

      {/* Detail Slide-over */}
      {selectedEnquiry && (
        <div
          onClick={() => setSelectedEnquiry(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              height: '100%',
              backgroundColor: '#ffffff',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              padding: '24px',
              gap: 20,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 7px', borderRadius: 4 }}>
                  WEBSITE RFQ
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>ID: {selectedEnquiry.id}</span>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Contact details */}
            <div style={{ padding: 16, backgroundColor: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>
                {selectedEnquiry.contactName || selectedEnquiry.clientName || 'Direct Inquiry'}
              </div>
              {selectedEnquiry.clientName && (
                <div style={{ fontSize: 13, color: '#475569', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Building2 size={13} style={{ color: '#94a3b8' }} /> {selectedEnquiry.clientName}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                {selectedEnquiry.email && (
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '7px 10px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#0f172a',
                      textDecoration: 'none',
                    }}
                  >
                    <Mail size={12} style={{ color: '#0284c7' }} /> Email Client
                  </a>
                )}
                {selectedEnquiry.phone && (
                  <a
                    href={`tel:${selectedEnquiry.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '7px 10px',
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 500,
                      color: '#0f172a',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={12} style={{ color: '#16a34a' }} /> Call Client
                  </a>
                )}
              </div>
            </div>

            {/* Requirement */}
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: 6 }}>
                Equipment Requested
              </div>
              <div style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 8 }}>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                  {selectedEnquiry.product || selectedEnquiry.category || 'Website RFQ'}
                </div>
                {(() => {
                  const { tags, message } = parseEnquiryNotes(selectedEnquiry.notes);
                  return (
                    <>
                      {tags.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 10 }}>
                          {tags.map((t, idx) => (
                            <div key={idx} style={{ padding: '6px 8px', background: '#f8fafc', borderRadius: 5, border: '1px solid #edf2f7' }}>
                              <div style={{ fontSize: 10, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{t.label}</div>
                              <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 500 }}>{t.value}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      {message && (
                        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                          <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Notes:</div>
                          <div style={{ fontSize: 12.5, color: '#1e293b', marginTop: 3 }}>{message}</div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Delete button in drawer footer */}
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={() => void remove(selectedEnquiry)}
                disabled={deleting === selectedEnquiry.id}
                style={{
                  padding: '7px 12px',
                  borderRadius: 6,
                  border: '1px solid #fee2e2',
                  background: 'transparent',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: 12.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Trash2 size={13} /> Delete Enquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
