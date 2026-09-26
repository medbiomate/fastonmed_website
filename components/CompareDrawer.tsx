'use client';

import React from 'react';
import Image from 'next/image';
import { X, Layers, Trash2, ShoppingBag } from 'lucide-react';
import { useApp } from '@/lib/context';

export default function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare, isCompareOpen, setIsCompareOpen, addToCart } = useApp();

  if (!isCompareOpen || compareList.length === 0) return null;

  // Aggregate all unique specification keys across selected products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.technicalSpecs || {})))
  );

  return (
    <div className="modal-overlay" onClick={() => setIsCompareOpen(false)}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '1080px', width: '95%', padding: '28px', maxHeight: '88vh' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Medical Equipment Comparison</h3>
            <span className="badge badge-primary">{compareList.length} items</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={clearCompare}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
            <button
              onClick={() => setIsCompareOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr>
                <th style={{ width: '20%', padding: '12px', textAlign: 'left', backgroundColor: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-color)' }}>
                  Criteria
                </th>
                {compareList.map(p => (
                  <th
                    key={p.id}
                    style={{
                      width: `${80 / compareList.length}%`,
                      padding: '12px',
                      textAlign: 'center',
                      backgroundColor: 'var(--bg-subtle)',
                      borderBottom: '2px solid var(--border-color)',
                      position: 'relative'
                    }}
                  >
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)' }}
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                    <div style={{ width: '90px', height: '90px', margin: '0 auto 8px', position: 'relative' }}>
                      {p.mainImage && (
                        <Image src={p.mainImage} alt={p.name} width={90} height={90} style={{ objectFit: 'contain' }} unoptimized />
                      )}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                      {p.name}
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '1rem', marginBottom: '8px' }}>
                      AED {(p.salePrice || p.regularPrice).toLocaleString()}
                    </div>
                    {p.purchaseMode === 'cart' && (
                      <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                        <ShoppingBag size={12} /> Add
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Brand</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    {p.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Category</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    {p.category}
                  </td>
                ))}
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}>Warranty</td>
                {compareList.map(p => (
                  <td key={p.id} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border-color)', color: 'var(--primary-dark)', fontWeight: 600 }}>
                    {p.warrantyPeriod || '1 Year Standard'}
                  </td>
                ))}
              </tr>
              {allSpecKeys.map(specKey => (
                <tr key={specKey}>
                  <td style={{ padding: '10px 12px', fontWeight: 600, borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    {specKey}
                  </td>
                  {compareList.map(p => (
                    <td key={p.id} style={{ padding: '10px 12px', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                      {p.technicalSpecs?.[specKey] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
