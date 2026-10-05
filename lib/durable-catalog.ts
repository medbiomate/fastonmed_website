import { readDurableProductCatalog } from './hostinger-db';

let snapshot: any[] | null = null;
let expiresAt = 0;
let pending: Promise<any[] | null> | null = null;
let generation = 0;

export function invalidateDurableCatalog() {
  generation++;
  expiresAt = 0;
  pending = null;
}

// Database records take precedence over deploy-time files, including drafts and trash.
export async function getDurableCatalog(): Promise<any[] | null> {
  if (Date.now() < expiresAt) return snapshot;
  if (!pending) {
    const version = generation;
    const request = readDurableProductCatalog().then(products => {
      if (version === generation) {
        snapshot = products;
        expiresAt = Date.now() + (products === null ? 1000 : 10_000);
      }
      return products;
    }).finally(() => {
      if (version === generation) pending = null;
    });
    pending = request;
  }
  return pending;
}
