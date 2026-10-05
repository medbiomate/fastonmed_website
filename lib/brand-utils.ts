export function brandName(value: string): string {
  return value.replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#0*39;|&apos;/gi, "'").replace(/&nbsp;/gi, ' ').trim().replace(/^aveus instruments$/i, 'Aveus');
}
export function brandSlug(value: string): string {
  return brandName(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
