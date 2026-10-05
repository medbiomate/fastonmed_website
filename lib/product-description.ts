import sanitizeHtml from 'sanitize-html';

export function productDescriptionHtml(value: string): string {
  const safe = sanitizeHtml(value);
  const parts = safe.split(/(<p>[\s\S]*?<\/p>|<ul[\s\S]*?<\/ul>|<ol[\s\S]*?<\/ol>)/gi);
  const result: string[] = [];
  let list: string[] = [];
  let inListSection = false;
  const flush = () => { if (list.length) result.push(`<ul>${list.join('')}</ul>`); list = []; };
  for (const part of parts) {
    if (!part) continue;
    const text = part.replace(/<[^>]+>/g, '').trim();
    if (/^<p>\s*<(b|strong)>/i.test(part) && /^(Key Features|Use Cases|Ideal For|Product Specifications)$/i.test(text)) {
      flush();
      inListSection = /^(Key Features|Use Cases)$/i.test(text);
      result.push(part);
    } else if (inListSection && /^<p>/i.test(part)) {
      if (text) list.push(`<li>${part.replace(/^<p>|<\/p>$/gi, '')}</li>`);
    } else if (inListSection && !text && !/<(?:ul|ol)/i.test(part)) {
      // Ignore whitespace separating pasted list paragraphs.
    } else {
      flush();
      inListSection = false;
      result.push(part);
    }
  }
  flush();
  return result.join('');
}
