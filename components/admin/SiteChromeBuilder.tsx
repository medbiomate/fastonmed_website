'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, X, Laptop, Tablet, Smartphone, Eye } from 'lucide-react';
import { store } from '@/lib/store';
import { SiteChromeSettings, SiteChromeMenuItem } from '@/lib/types';

interface Props {
  initialPanel?: 'header' | 'footer';
}

export default function SiteChromeBuilder({ initialPanel = 'header' }: Props) {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<'header' | 'footer'>(initialPanel);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [savedBadge, setSavedBadge] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<SiteChromeSettings>(() => store.getSiteChrome());

  useEffect(() => {
    setActivePanel(initialPanel);
  }, [initialPanel]);

  // Sync settings
  const handleSave = () => {
    store.updateSiteChrome(settings);
    setSavedBadge(true);
    setTimeout(() => setSavedBadge(false), 2000);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('site-chrome-updated'));
    }
  };

  // Header Menu Operations
  const handleAddHeaderMenuItem = () => {
    setSettings(prev => ({
      ...prev,
      headerMenu: [
        ...prev.headerMenu,
        { label: 'New Link', url: '/', depth: 0 }
      ]
    }));
  };

  const handleUpdateHeaderMenuItem = (index: number, updates: Partial<SiteChromeMenuItem>) => {
    setSettings(prev => {
      const nextMenu = [...prev.headerMenu];
      nextMenu[index] = { ...nextMenu[index], ...updates };
      return { ...prev, headerMenu: nextMenu };
    });
  };

  const handleMoveHeaderMenuItem = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= settings.headerMenu.length) return;
    setSettings(prev => {
      const nextMenu = [...prev.headerMenu];
      const temp = nextMenu[index];
      nextMenu[index] = nextMenu[target];
      nextMenu[target] = temp;
      return { ...prev, headerMenu: nextMenu };
    });
  };

  const handleDeleteHeaderMenuItem = (index: number) => {
    setSettings(prev => ({
      ...prev,
      headerMenu: prev.headerMenu.filter((_, i) => i !== index)
    }));
  };

  // Footer Links Operations
  const handleAddFooterLink = (category: 'explore' | 'categories' | 'customer') => {
    const keyMap = {
      explore: 'footerExploreLinks',
      categories: 'footerCategoriesLinks',
      customer: 'footerCustomerLinks'
    } as const;
    const key = keyMap[category];
    setSettings(prev => ({
      ...prev,
      [key]: [...prev[key], { label: 'New Link', url: '/' }]
    }));
  };

  const handleUpdateFooterLink = (category: 'explore' | 'categories' | 'customer', index: number, updates: Partial<SiteChromeMenuItem>) => {
    const keyMap = {
      explore: 'footerExploreLinks',
      categories: 'footerCategoriesLinks',
      customer: 'footerCustomerLinks'
    } as const;
    const key = keyMap[category];
    setSettings(prev => {
      const nextList = [...prev[key]];
      nextList[index] = { ...nextList[index], ...updates };
      return { ...prev, [key]: nextList };
    });
  };

  const handleDeleteFooterLink = (category: 'explore' | 'categories' | 'customer', index: number) => {
    const keyMap = {
      explore: 'footerExploreLinks',
      categories: 'footerCategoriesLinks',
      customer: 'footerCustomerLinks'
    } as const;
    const key = keyMap[category];
    setSettings(prev => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index)
    }));
  };

  // Apply Presets
  const handleApplyPreset = () => {
    setSettings(prev => ({
      ...prev,
      footerLayout: 'fastonmed-wide',
      footerBg: '#0f172a',
      footerText: '#ffffff',
      footerLink: '#94a3b8',
      footerCopyright: '© 2026 FastonMed (FASTONMED TRADING L.L.C). All Rights Reserved.'
    }));
  };

  return (
    <div className="tk-builder-workspace">
      {/* Fixed Top Bar */}
      <header className="tk-builder-topbar">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
              {activePanel === 'header' ? 'Header Builder' : 'Footer Builder'}
            </h1>
            <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px' }}>
              Site appearance
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px', margin: 0 }}>
            {activePanel === 'header'
              ? 'Customize navigation layout, menu links, clinical branding, and header colors.'
              : 'Customize footer design, category links, contact info, copyright, and footer colors.'}
          </p>
        </div>

        {/* Panel Switcher & Save Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
            <button
              type="button"
              onClick={() => { setActivePanel('header'); router.push('/admin/appearance/header'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activePanel === 'header' ? '#ffffff' : 'transparent',
                color: activePanel === 'header' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Header
            </button>
            <button
              type="button"
              onClick={() => { setActivePanel('footer'); router.push('/admin/appearance/footer'); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                background: activePanel === 'footer' ? '#ffffff' : 'transparent',
                color: activePanel === 'footer' ? '#0f172a' : '#64748b',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              Footer
            </button>
          </div>

          <button
            onClick={handleSave}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: savedBadge ? '#10b981' : '#ffffff',
              color: savedBadge ? '#ffffff' : '#0f172a',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {savedBadge ? <Check size={16} /> : null}
            <span>{savedBadge ? 'Saved' : 'Save changes'}</span>
          </button>
        </div>
      </header>

      {/* Two Panes with Separate Scrollbars ("Sliders") */}
      <div className="tk-builder-columns">
        {/* Left Pane: Settings Form with its own Slider */}
        <section className="tk-builder-pane-left">
          {/* HEADER SETTINGS PANEL */}
          {activePanel === 'header' && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
            }}>
              <h2 style={{ margin: '0 0 18px', fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                Header settings
              </h2>

              {/* Header design */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Header design
                </label>
                <select
                  value={settings.headerLayout}
                  onChange={e => setSettings({ ...settings, headerLayout: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    padding: '0 12px',
                    fontSize: '13px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="classic">Classic — logo left</option>
                  <option value="centered">Centered navigation</option>
                  <option value="compact">Compact header</option>
                  <option value="minimal">Minimal navigation</option>
                  <option value="boxed">Boxed header</option>
                </select>
              </div>

              {/* Header logo picker */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Header logo
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    width: '110px',
                    height: '64px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dbe3ee',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
                  }}>
                    <img
                      src={settings.headerLogo}
                      alt="Header logo"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={settings.headerLogo}
                      onChange={e => setSettings({ ...settings, headerLogo: e.target.value })}
                      placeholder="/fastonmed-logo.svg"
                      style={{
                        width: '100%',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        padding: '0 10px',
                        fontSize: '12px',
                        marginBottom: '8px',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter Logo URL:', settings.headerLogo);
                        if (url !== null && url.trim()) setSettings({ ...settings, headerLogo: url.trim() });
                      }}
                      style={{
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Choose logo
                    </button>
                  </div>
                </div>
              </div>

              {/* Header Menu Items */}
              <div style={{ marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>Header menu</span>
                  <button
                    type="button"
                    onClick={handleAddHeaderMenuItem}
                    style={{
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    + Add menu item
                  </button>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  {settings.headerMenu.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        gap: '6px',
                        alignItems: 'center',
                        padding: '7px 10px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: (item.depth || 0) > 0 ? '#eff6ff' : '#f8fafc',
                        marginLeft: (item.depth || 0) > 0 ? '16px' : '0',
                        borderLeft: (item.depth || 0) > 0 ? '3px solid #2563eb' : '1px solid #e2e8f0'
                      }}
                    >
                      <span style={{ color: '#94a3b8', textAlign: 'center', cursor: 'grab', fontSize: '13px', flexShrink: 0 }}>::</span>

                      <input
                        type="text"
                        value={item.label}
                        onChange={e => handleUpdateHeaderMenuItem(idx, { label: e.target.value })}
                        placeholder="Label"
                        style={{ minWidth: '60px', flex: '1 1 80px', height: '32px', padding: '0 8px', fontSize: '12px', borderRadius: '5px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff' }}
                      />

                      <input
                        type="text"
                        value={item.url}
                        onChange={e => handleUpdateHeaderMenuItem(idx, { url: e.target.value })}
                        placeholder="/path"
                        style={{ minWidth: '60px', flex: '1 1 80px', height: '32px', padding: '0 8px', fontSize: '12px', borderRadius: '5px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#ffffff' }}
                      />

                      <div style={{ display: 'flex', gap: '3px', alignItems: 'center', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => handleUpdateHeaderMenuItem(idx, { depth: 0 })}
                          style={{ width: '26px', height: '26px', border: '1px solid #dbe3ee', borderRadius: '5px', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Outdent"
                        >
                          <ArrowLeft size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleUpdateHeaderMenuItem(idx, { depth: 1 })}
                          style={{ width: '26px', height: '26px', border: '1px solid #dbe3ee', borderRadius: '5px', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Indent as Submenu"
                        >
                          <ArrowRight size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveHeaderMenuItem(idx, -1)}
                          style={{ width: '26px', height: '26px', border: '1px solid #dbe3ee', borderRadius: '5px', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Move Up"
                        >
                          <ArrowUp size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveHeaderMenuItem(idx, 1)}
                          style={{ width: '26px', height: '26px', border: '1px solid #dbe3ee', borderRadius: '5px', background: '#fff', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Move Down"
                        >
                          <ArrowDown size={12} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteHeaderMenuItem(idx)}
                          style={{ width: '26px', height: '26px', border: '1px solid #fee2e2', borderRadius: '5px', background: '#fff', color: '#dc2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Remove Item"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color settings */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Header Colors
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Background</span>
                    <input
                      type="color"
                      value={settings.headerBg}
                      onChange={e => setSettings({ ...settings, headerBg: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Text</span>
                    <input
                      type="color"
                      value={settings.headerText}
                      onChange={e => setSettings({ ...settings, headerText: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Accent</span>
                    <input
                      type="color"
                      value={settings.headerAccent}
                      onChange={e => setSettings({ ...settings, headerAccent: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER SETTINGS PANEL */}
          {activePanel === 'footer' && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
            }}>
              <h2 style={{ margin: '0 0 18px', fontSize: '1.18rem', fontWeight: 800, color: '#0f172a' }}>
                Footer settings
              </h2>

              {/* Footer design dropdown */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Footer design
                </label>
                <select
                  value={settings.footerLayout}
                  onChange={e => setSettings({ ...settings, footerLayout: e.target.value })}
                  style={{
                    width: '100%',
                    height: '38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    padding: '0 12px',
                    fontSize: '13px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    outline: 'none'
                  }}
                >
                  <option value="fastonmed-wide">Fastonmed Wide — standard healthcare design</option>
                  <option value="columns">Standard four columns</option>
                  <option value="compact">Compact centered</option>
                  <option value="split">Logo and links split</option>
                  <option value="minimal">Minimal footer</option>
                  <option value="boxed">Boxed footer</option>
                </select>
              </div>

              {/* Fastonmed Wide Preset Card */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '72px 1fr auto',
                gap: '12px',
                alignItems: 'center',
                margin: '0 0 18px',
                padding: '12px',
                border: '1px solid #bfdbfe',
                borderRadius: '10px',
                backgroundColor: '#eff6ff'
              }}>
                <div style={{
                  width: '72px',
                  height: '44px',
                  borderRadius: '6px',
                  backgroundColor: '#0f172a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '9px',
                  fontWeight: 800
                }}>
                  Fastonmed
                </div>
                <div>
                  <b style={{ color: '#1e3a8a', fontSize: '12px', display: 'block' }}>Fastonmed Wide</b>
                  <small style={{ marginTop: '2px', color: '#64748b', fontSize: '10px', display: 'block' }}>
                    Logo, email, three link columns and full-width copyright divider
                  </small>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPreset}
                  style={{
                    border: '1px solid #2563eb',
                    borderRadius: '7px',
                    padding: '7px 11px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Use design
                </button>
              </div>

              {/* Footer logo */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Footer logo
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  backgroundColor: '#f8fafc'
                }}>
                  <div style={{
                    width: '110px',
                    height: '64px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #dbe3ee',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px'
                  }}>
                    <img
                      src={settings.footerLogo}
                      alt="Footer logo"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={settings.footerLogo}
                      onChange={e => setSettings({ ...settings, footerLogo: e.target.value })}
                      placeholder="/fastonmed-logo.svg"
                      style={{
                        width: '100%',
                        height: '34px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        padding: '0 10px',
                        fontSize: '12px',
                        marginBottom: '8px',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const url = prompt('Enter Footer Logo URL:', settings.footerLogo);
                        if (url !== null && url.trim()) setSettings({ ...settings, footerLogo: url.trim() });
                      }}
                      style={{
                        border: '1px solid #93c5fd',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        backgroundColor: '#eff6ff',
                        color: '#1d4ed8',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Choose logo
                    </button>
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email address
                </label>
                <input
                  type="text"
                  value={settings.footerEmail}
                  onChange={e => setSettings({ ...settings, footerEmail: e.target.value })}
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px' }}
                />
              </div>

              {/* Explore Column Links */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Explore heading
                </label>
                <input
                  type="text"
                  value={settings.footerExploreTitle}
                  onChange={e => setSettings({ ...settings, footerExploreTitle: e.target.value })}
                  style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Explore links</span>
                  <button
                    type="button"
                    onClick={() => handleAddFooterLink('explore')}
                    style={{ border: '1px solid #bfdbfe', borderRadius: '5px', padding: '3px 8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add link
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {settings.footerExploreLinks.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => handleUpdateFooterLink('explore', idx, { label: e.target.value })}
                        placeholder="Label"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={e => handleUpdateFooterLink('explore', idx, { url: e.target.value })}
                        placeholder="URL"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFooterLink('explore', idx)}
                        style={{ border: '1px solid #fee2e2', borderRadius: '4px', background: '#fff', color: '#dc2626', width: '28px', height: '28px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories Column Links */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Categories heading
                </label>
                <input
                  type="text"
                  value={settings.footerCategoriesTitle}
                  onChange={e => setSettings({ ...settings, footerCategoriesTitle: e.target.value })}
                  style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Category links</span>
                  <button
                    type="button"
                    onClick={() => handleAddFooterLink('categories')}
                    style={{ border: '1px solid #bfdbfe', borderRadius: '5px', padding: '3px 8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add link
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {settings.footerCategoriesLinks.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => handleUpdateFooterLink('categories', idx, { label: e.target.value })}
                        placeholder="Label"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={e => handleUpdateFooterLink('categories', idx, { url: e.target.value })}
                        placeholder="URL"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFooterLink('categories', idx)}
                        style={{ border: '1px solid #fee2e2', borderRadius: '4px', background: '#fff', color: '#dc2626', width: '28px', height: '28px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Column Links */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Customer care & compliance heading
                </label>
                <input
                  type="text"
                  value={settings.footerCustomerTitle}
                  onChange={e => setSettings({ ...settings, footerCustomerTitle: e.target.value })}
                  style={{ width: '100%', height: '34px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px', marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Customer care links</span>
                  <button
                    type="button"
                    onClick={() => handleAddFooterLink('customer')}
                    style={{ border: '1px solid #bfdbfe', borderRadius: '5px', padding: '3px 8px', background: '#eff6ff', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add link
                  </button>
                </div>
                <div style={{ display: 'grid', gap: '6px' }}>
                  {settings.footerCustomerLinks.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <input
                        type="text"
                        value={item.label}
                        onChange={e => handleUpdateFooterLink('customer', idx, { label: e.target.value })}
                        placeholder="Label"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <input
                        type="text"
                        value={item.url}
                        onChange={e => handleUpdateFooterLink('customer', idx, { url: e.target.value })}
                        placeholder="URL"
                        style={{ flex: 1, height: '30px', padding: '0 8px', fontSize: '12px', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFooterLink('customer', idx)}
                        style={{ border: '1px solid #fee2e2', borderRadius: '4px', background: '#fff', color: '#dc2626', width: '28px', height: '28px', cursor: 'pointer' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Copyright Text */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Copyright text
                </label>
                <input
                  type="text"
                  value={settings.footerCopyright}
                  onChange={e => setSettings({ ...settings, footerCopyright: e.target.value })}
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #cbd5e1', padding: '0 10px', fontSize: '13px' }}
                />
              </div>

              {/* Footer Colors */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Footer Colors
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Background</span>
                    <input
                      type="color"
                      value={settings.footerBg}
                      onChange={e => setSettings({ ...settings, footerBg: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Text</span>
                    <input
                      type="color"
                      value={settings.footerText}
                      onChange={e => setSettings({ ...settings, footerText: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Links</span>
                    <input
                      type="color"
                      value={settings.footerLink}
                      onChange={e => setSettings({ ...settings, footerLink: e.target.value })}
                      style={{ width: '32px', height: '24px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Pane: Live Interactive Mockup Stage with its own slider */}
        <aside className="tk-builder-pane-right">
          {/* Sticky Device Switcher Toolbar */}
          <div className="tk-builder-preview-sticky">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} style={{ color: '#64748b' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Live preview
              </span>
            </div>

            {/* Device switcher */}
            <div style={{ display: 'flex', background: '#ffffff', padding: '3px', borderRadius: '8px', border: '1px solid #dbe3ee', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 11px',
                  background: device === 'desktop' ? '#eff6ff' : 'transparent',
                  color: device === 'desktop' ? '#2563eb' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: device === 'desktop' ? '0 1px 2px rgba(37,99,235,0.1)' : 'none'
                }}
              >
                <Laptop size={13} />
                <span>Desktop</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice('tablet')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 11px',
                  background: device === 'tablet' ? '#eff6ff' : 'transparent',
                  color: device === 'tablet' ? '#2563eb' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: device === 'tablet' ? '0 1px 2px rgba(37,99,235,0.1)' : 'none'
                }}
              >
                <Tablet size={13} />
                <span>Tablet</span>
              </button>

              <button
                type="button"
                onClick={() => setDevice('mobile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '5px 11px',
                  background: device === 'mobile' ? '#eff6ff' : 'transparent',
                  color: device === 'mobile' ? '#2563eb' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: device === 'mobile' ? '0 1px 2px rgba(37,99,235,0.1)' : 'none'
                }}
              >
                <Smartphone size={13} />
                <span>Mobile</span>
              </button>
            </div>
          </div>

          {/* Scaled Preview Stage Container */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            width: '100%',
            transition: 'all 0.25s ease'
          }}>
            <div style={{
              width: device === 'desktop' ? '100%' : device === 'tablet' ? '580px' : '340px',
              backgroundColor: '#ffffff',
              boxShadow: '0 8px 30px rgba(15,23,42,0.1)',
              borderRadius: '12px',
              border: '1px solid #dbe2ea',
              overflow: 'hidden',
              transition: 'width 0.25s ease'
            }}>
              {/* Mockup Header */}
              <header style={{
                backgroundColor: settings.headerBg,
                color: settings.headerText,
                padding: device === 'mobile' ? '10px 14px' : '14px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: settings.headerLayout === 'centered' && device !== 'mobile' ? 'column' : 'row',
                gap: settings.headerLayout === 'centered' ? '10px' : '14px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={settings.headerLogo} alt="Logo" style={{ height: '24px', maxWidth: '110px', objectFit: 'contain' }} />
                </div>

                {device !== 'mobile' ? (
                  <nav style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '9px', fontWeight: 600 }}>
                    {settings.headerMenu.map((m, mIdx) => (
                      <span key={mIdx} style={{ color: settings.headerText, opacity: m.depth ? 0.75 : 1 }}>
                        {m.depth ? '↳ ' : ''}{m.label}
                      </span>
                    ))}
                  </nav>
                ) : (
                  <span style={{ fontSize: '14px', color: settings.headerText }}>☰</span>
                )}

                {device !== 'mobile' && (
                  <button
                    type="button"
                    style={{
                      backgroundColor: settings.headerAccent,
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '4px 10px',
                      fontSize: '8px',
                      fontWeight: 700
                    }}
                  >
                    Action
                  </button>
                )}
              </header>

              {/* Mockup Page Skeleton Body */}
              <main style={{
                minHeight: '160px',
                padding: '24px 20px',
                background: 'linear-gradient(145deg, #f8fafc, #edf2f7)'
              }}>
                <div style={{ height: '18px', width: '42%', backgroundColor: '#cbd5e1', borderRadius: '6px', marginBottom: '10px' }} />
                <div style={{ height: '10px', width: '80%', backgroundColor: '#dbe3ee', borderRadius: '4px', marginBottom: '8px' }} />
                <div style={{ height: '10px', width: '65%', backgroundColor: '#dbe3ee', borderRadius: '4px' }} />
              </main>

              {/* Mockup Footer */}
              <footer style={{
                backgroundColor: settings.footerBg,
                color: settings.footerText,
                padding: device === 'mobile' ? '20px 14px' : '24px 22px 16px',
                fontSize: '9px',
                display: 'grid',
                gridTemplateColumns: device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(90px, 1fr))',
                gap: device === 'mobile' ? '16px' : '14px 16px',
                overflow: 'hidden'
              }}>
                {/* Brand Col */}
                <div>
                  <img src={settings.footerLogo} alt="Logo" style={{ height: '22px', maxWidth: '100px', objectFit: 'contain', marginBottom: '8px' }} />
                  <div style={{ color: settings.footerLink, fontSize: '8px', opacity: 0.85 }}>{settings.footerEmail}</div>
                </div>

                {/* Explore */}
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px', fontSize: '10px', color: settings.footerText }}>
                    {settings.footerExploreTitle}
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {settings.footerExploreLinks.slice(0, 5).map((l, lIdx) => (
                      <span key={lIdx} style={{ color: settings.footerLink, fontSize: '8px' }}>{l.label}</span>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px', fontSize: '10px', color: settings.footerText }}>
                    {settings.footerCategoriesTitle}
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {settings.footerCategoriesLinks.slice(0, 5).map((l, lIdx) => (
                      <span key={lIdx} style={{ color: settings.footerLink, fontSize: '8px' }}>{l.label}</span>
                    ))}
                  </div>
                </div>

                {/* Compliance / Support */}
                <div>
                  <strong style={{ display: 'block', marginBottom: '6px', fontSize: '10px', color: settings.footerText }}>
                    {settings.footerCustomerTitle}
                  </strong>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {settings.footerCustomerLinks.slice(0, 5).map((l, lIdx) => (
                      <span key={lIdx} style={{ color: settings.footerLink, fontSize: '8px' }}>{l.label}</span>
                    ))}
                  </div>
                </div>

                {/* Full-Width Copyright Divider */}
                <div style={{
                  gridColumn: device === 'mobile' ? 'auto' : '1 / -1',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  paddingTop: '10px',
                  fontSize: '8px',
                  color: settings.footerLink,
                  opacity: 0.75
                }}>
                  {settings.footerCopyright}
                </div>
              </footer>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
