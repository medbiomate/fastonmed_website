'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

type Props = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  onChange: (event: { target: { value: string } }) => void;
};

export default function EnquirySelect({ children, value, onChange, style, className, id, ...props }: Props) {
  const generatedId = useId();
  const menuId = `${generatedId}-menu`;
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = React.Children.toArray(children).flatMap(child => {
    if (!React.isValidElement<{ children?: React.ReactNode; value?: string }>(child)) return [];
    const nodes = child.type === React.Fragment ? React.Children.toArray(child.props.children) : [child];
    return nodes.filter(React.isValidElement).map(node => node as React.ReactElement<{ value: string; children: React.ReactNode }>);
  });
  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', close);
    root.current?.querySelector<HTMLButtonElement>('[role="option"][aria-selected="true"]')?.focus();
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  return <div ref={root} className="enquiry-select">
    <button id={id} ref={trigger} type="button" className={className} style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'start', gap: 12, cursor: 'pointer' }}
      aria-label={props['aria-label']} aria-haspopup="listbox" aria-expanded={open} aria-controls={open ? menuId : undefined}
      onClick={() => setOpen(!open)} onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); } }}>
      <span>{options.find(option => option.props.value === value)?.props.children}</span><ChevronDown size={17} aria-hidden="true" />
    </button>
    {open && <div id={menuId} role="listbox" aria-label={props['aria-label'] || 'Select an option'} className="enquiry-select-menu" onKeyDown={event => {
      const items = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
      const index = items.indexOf(document.activeElement as HTMLButtonElement);
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus(); }
      if (event.key === 'Tab') setOpen(false);
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
        items[next]?.focus();
      }
    }}>
      {options.map(option => <button type="button" role="option" aria-selected={option.props.value === value} key={option.props.value} onClick={() => { onChange({ target: { value: option.props.value } }); setOpen(false); trigger.current?.focus(); }}>
        <span>{option.props.children}</span>{option.props.value === value && <Check size={16} aria-hidden="true" />}
      </button>)}
    </div>}
    <style>{`
      .enquiry-select { position: relative; }
      .enquiry-select-menu { position: absolute; top: calc(100% + 6px); inset-inline: 0; z-index: 30; padding: 5px; background: white; border: 1px solid #dce9e3; border-radius: 12px; box-shadow: 0 12px 32px rgba(15,23,42,.14); max-height: 260px; overflow-y: auto; }
      .enquiry-select-menu button { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 11px 12px; border: 0; border-radius: 7px; background: white; color: #334155; font: inherit; font-size: .82rem; text-align: start; cursor: pointer; }
      .enquiry-select-menu button:hover, .enquiry-select-menu button:focus-visible { background: #f0f8f4; color: #00875a; outline: none; }
      .enquiry-select-menu button[aria-selected="true"] { background: #e5f6ef; color: #00875a; font-weight: 700; }
    `}</style>
  </div>;
}
