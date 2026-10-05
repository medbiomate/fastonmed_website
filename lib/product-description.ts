import sanitizeHtml from 'sanitize-html';

export function productDescriptionHtml(value: string): string {
  const safe = sanitizeHtml(value);
  // Older pasted descriptions store feature lists as consecutive paragraphs.
  // Convert only named list sections; leave prose and existing lists intact.
  return safe.replace(/(<p>\s*<(?:b|strong)>\s*(?:Key Features|Use Cases)\s*<\/(?:b|strong)>\s*<\/p>)((?:\s*<p>[\s\S]*?<\/p>)*?)(?=\s*<p>\s*<(?:b|strong)>\s*(?:Key Features|Use Cases|Ideal For|Product Specifications)\s*<\/(?:b|strong)>\s*<\/p>|$)/gi,
    (section, heading: string, paragraphs: string) => {
      const items = [...paragraphs.matchAll(/<p>([\s\S]*?)<\/p>/gi)].map(match => match[1]).filter(item => item.replace(/<[^>]+>/g, '').trim());
      return items.length ? `${heading}<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>` : section;
    });
}
