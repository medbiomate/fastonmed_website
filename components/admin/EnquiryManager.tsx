'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, RefreshCw, Search, Trash2 } from 'lucide-react';

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

export default function EnquiryManager() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

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

  const filtered = useMemo(() => items.filter((item) =>
    `${item.contactName} ${item.clientName} ${item.email} ${item.phone} ${item.category} ${item.product}`
      .toLowerCase().includes(query.toLowerCase())
  ), [items, query]);

  const remove = async (item: Enquiry) => {
    if (!confirm(`Delete the enquiry from ${item.contactName || item.clientName || 'this customer'}?`)) return;
    setDeleting(item.id);
    try {
      const response = await fetch('/api/admin/enquiries', {
        method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: item.id })
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || 'Delete failed');
      setItems((current) => current.filter((entry) => entry.id !== item.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  };

  return <div style={{ padding: '34px 42px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 24 }}>
      <div><div style={{ color: '#51b291', fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>COMMERCE · {items.length} LIVE ENQUIRIES</div><h1 style={{ margin: '8px 0', fontSize: 38 }}>Enquiries</h1><p style={{ margin: 0, color: '#64748b' }}>Website RFQs synchronized directly with the FastonMed CRM.</p></div>
      <button onClick={() => void load()} disabled={loading} style={{ padding: '10px 14px', border: '1px solid #dbe3ec', borderRadius: 9, background: '#fff', cursor: 'pointer', display: 'flex', gap: 7 }}><RefreshCw size={16}/>{loading ? 'Loading…' : 'Refresh'}</button>
    </div>
    <div style={{ background: '#fff', border: '1px solid #dde5ed', borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #e5eaf0', position: 'relative' }}><Search size={18} style={{ position: 'absolute', left: 30, top: 28, color: '#94a3b8' }}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries…" style={{ width: '100%', boxSizing: 'border-box', padding: '11px 15px 11px 42px', border: '1px solid #dbe3ec', borderRadius: 9, fontSize: 15 }}/></div>
      {error && <div style={{ padding: 22, color: '#b91c1c' }}>{error}</div>}
      {!error && <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ background: '#f8fafc', color: '#64748b', fontSize: 12, textAlign: 'left' }}><th style={{ padding: 14 }}>CONTACT</th><th>REQUIREMENT</th><th>STATUS</th><th>RECEIVED</th><th style={{ textAlign: 'right', paddingRight: 20 }}>ACTION</th></tr></thead><tbody>
        {filtered.map((item) => <tr key={item.id} style={{ borderTop: '1px solid #edf1f5' }}><td style={{ padding: 16 }}><strong>{item.contactName || item.clientName}</strong><div style={{ color: '#64748b', marginTop: 5, fontSize: 13 }}><Mail size={12} style={{ verticalAlign: -2 }}/> {item.email}<br/><Phone size={12} style={{ verticalAlign: -2 }}/> {item.phone}</div></td><td><strong>{item.product || item.category || 'Website RFQ'}</strong><div style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{item.clientName}</div></td><td><span style={{ color: '#15803d', background: '#dcfce7', borderRadius: 20, padding: '5px 10px', fontWeight: 700, fontSize: 12 }}>{item.stage || 'New Lead'}</span></td><td style={{ color: '#64748b' }}>{item.createdAt ? new Date(item.createdAt).toLocaleString('en-AE') : '—'}</td><td style={{ textAlign: 'right', paddingRight: 20 }}><button onClick={() => void remove(item)} disabled={deleting === item.id} aria-label="Delete enquiry" style={{ color: '#dc2626', background: '#fff', border: '1px solid #fecaca', borderRadius: 7, padding: 8, cursor: 'pointer' }}><Trash2 size={16}/></button></td></tr>)}
      </tbody></table>}
      {!loading && !error && filtered.length === 0 && <div style={{ padding: 46, textAlign: 'center', color: '#64748b' }}>No website enquiries found.</div>}
    </div>
  </div>;
}
