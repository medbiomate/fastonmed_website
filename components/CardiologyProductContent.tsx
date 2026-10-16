'use client';

import { useEffect, useRef } from 'react';

export default function CardiologyProductContent({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const cleanups: (() => void)[] = [];
    container.querySelectorAll<HTMLFormElement>('form[data-product]').forEach((form) => {
      const submit = (event: Event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const text = [
          `Hello Fastonmed, I would like a quotation for ${form.dataset.product}.`,
          `Facility: ${data.get('facility')}`,
          `Delivery: ${data.get('location')}`,
          `Quantity: ${data.get('quantity')}`,
          `Requirements: ${data.get('requirements') || 'Please advise on the available configuration.'}`,
          'Please confirm availability, AED price including VAT, delivery, installation, training and warranty.'
        ].join('\n');
        const url = `https://wa.me/971508893589?text=${encodeURIComponent(text)}`;
        const status = form.querySelector('.form-status');
        if (status) {
          status.replaceChildren();
          const link = document.createElement('a');
          link.href = url;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = 'Open your prepared enquiry in WhatsApp ↗';
          status.append('Review your draft in WhatsApp before sending. ', link);
        }
        window.open(url, '_blank', 'noopener,noreferrer');
      };
      form.addEventListener('submit', submit);
      cleanups.push(() => form.removeEventListener('submit', submit));
    });

    container.querySelectorAll<HTMLElement>('#therapeutic-cards-grid, .dark .cards.three').forEach((track, index) => {
      const cards = [...track.children] as HTMLElement[];
      const mobile = window.matchMedia('(max-width: 600px)');
      track.id ||= `clinical-use-slider-${index}`;
      track.setAttribute('aria-label', index === 0 ? 'Product advantages' : 'Clinical uses');
      const controls = document.createElement('div');
      controls.className = 'mobile-slider-controls';
      controls.innerHTML = '<p class="slider-hint">Swipe to explore</p><div class="mobile-slider-actions"><button type="button" class="slider-prev" aria-label="Previous card">←</button><span class="mobile-slider-counter" aria-live="polite" aria-atomic="true"></span><button type="button" class="slider-next" aria-label="Next card">→</button></div>';
      track.after(controls);
      const prev = controls.querySelector<HTMLButtonElement>('.slider-prev')!;
      const next = controls.querySelector<HTMLButtonElement>('.slider-next')!;
      const counter = controls.querySelector('.mobile-slider-counter')!;
      prev.setAttribute('aria-controls', track.id);
      next.setAttribute('aria-controls', track.id);
      let current = 0;
      let frame = 0;
      const update = () => {
        if (!mobile.matches) return;
        const start = track.getBoundingClientRect().left;
        const distances = cards.map(card => Math.abs(card.getBoundingClientRect().left - start));
        current = distances.indexOf(Math.min(...distances));
        prev.disabled = current === 0;
        next.disabled = current === cards.length - 1;
        counter.textContent = `${current + 1} / ${cards.length}`;
      };
      const go = (step: number) => {
        const target = Math.max(0, Math.min(cards.length - 1, current + step));
        track.scrollTo({
          left: track.scrollLeft + cards[target].getBoundingClientRect().left - track.getBoundingClientRect().left,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      };
      const previous = () => go(-1);
      const following = () => go(1);
      const scroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
      const keydown = (event: KeyboardEvent) => {
        if (!mobile.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
        event.preventDefault();
        go(event.key === 'ArrowRight' ? 1 : -1);
      };
      const configure = () => {
        if (mobile.matches) { track.tabIndex = 0; track.setAttribute('role', 'region'); }
        else { track.removeAttribute('tabindex'); track.removeAttribute('role'); }
        update();
      };
      prev.addEventListener('click', previous);
      next.addEventListener('click', following);
      track.addEventListener('scroll', scroll, { passive: true });
      track.addEventListener('keydown', keydown);
      mobile.addEventListener('change', configure);
      window.addEventListener('resize', update, { passive: true });
      configure();
      cleanups.push(() => {
        controls.remove();
        cancelAnimationFrame(frame);
        prev.removeEventListener('click', previous);
        next.removeEventListener('click', following);
        track.removeEventListener('scroll', scroll);
        track.removeEventListener('keydown', keydown);
        mobile.removeEventListener('change', configure);
        window.removeEventListener('resize', update);
      });
    });
    return () => cleanups.forEach(cleanup => cleanup());
  }, [html]);

  return <div id="cardiology-product" ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
