'use client';

import React, { useState } from 'react';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface Props {
  title: string;
}

export default function AdminHeader({ title }: Props) {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSyncWooCommerce = async () => {
    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/admin/migration', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Synced ${data.importedCount} products!`);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setSyncResult(data.message || 'Sync failed');
      }
    } catch {
      setSyncResult('Sync error');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="tk-page-heading">
      <div>
        <h1>{title}</h1>
        <p>Manage and monitor FastonMed from one workspace.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {syncResult && <span style={{ fontSize: 12, color: '#15803d', fontWeight: 600 }}><CheckCircle2 size={14} /> {syncResult}</span>}
        <button onClick={handleSyncWooCommerce} disabled={syncing} className="tk-page-action">
          <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
          {syncing ? 'Syncing…' : 'Sync Catalog'}
        </button>
      </div>
    </div>
  );
}
