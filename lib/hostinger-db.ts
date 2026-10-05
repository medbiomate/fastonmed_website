import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;
let lastDbFailureTime = 0;
const DB_FAILURE_COOLDOWN_MS = 30_000;

export function isDbInCooldown(): boolean {
  return Date.now() - lastDbFailureTime < DB_FAILURE_COOLDOWN_MS;
}

export function recordDbFailure(): void {
  lastDbFailureTime = Date.now();
}

export function getHostingerDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.HOSTINGER_DB_HOST || (process.env.NODE_ENV === 'production' ? '127.0.0.1' : 'srv679.hstgr.io'),
      port: Number(process.env.HOSTINGER_DB_PORT || 3306),
      user: process.env.HOSTINGER_DB_USER || 'u304645447_fastonmed',
      password: process.env.HOSTINGER_DB_PASSWORD || 'FastonMed_DbPass_2026#!',
      database: process.env.HOSTINGER_DB_NAME || 'u304645447_fastonmed',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 1500,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
  return pool;
}

export async function saveProductToHostingerDb(p: any): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    const slug = String(p.slug || '').slice(0, 255);
    let id = String(p.id || 'prod-' + Date.now());

    // Deduplicate by slug so multiple records don't conflict
    if (slug) {
      try {
        const [existing] = await db.query<any[]>(
          'SELECT id FROM products WHERE slug = ? LIMIT 1',
          [slug]
        );
        if (Array.isArray(existing) && existing.length > 0 && existing[0]?.id) {
          id = existing[0].id;
          p.id = id;
        }
      } catch {}
    }

    const name = String(p.name || 'Unnamed Product').slice(0, 500);
    const sku = String(p.sku || p.model || '').slice(0, 100);
    const category = String(p.category || 'General').slice(0, 255);
    const brand = String(p.brand || '').slice(0, 255);
    const model = String(p.model || '').slice(0, 255);
    const status = String(p.status || 'published').slice(0, 50);
    const sellingPrice = Number(p.sellingPrice || p.regularPrice || 0) || 0;
    const regularPrice = Number(p.regularPrice || 0) || 0;
    const salePrice = p.salePrice ? Number(p.salePrice) : null;
    const inStock = Number(p.inStock ?? 1);
    const stockStatus = String(p.stockStatus || 'instock').slice(0, 50);
    const image = String(p.image || '');
    const description = String(p.description || '');
    const rawData = JSON.stringify(p);

    await db.query(
      `INSERT INTO products (id, slug, name, sku, category, brand, model, status, selling_price, regular_price, sale_price, in_stock, stock_status, image, description, raw_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         slug = VALUES(slug),
         sku = VALUES(sku),
         category = VALUES(category),
         brand = VALUES(brand),
         model = VALUES(model),
         status = VALUES(status),
         selling_price = VALUES(selling_price),
         regular_price = VALUES(regular_price),
         sale_price = VALUES(sale_price),
         in_stock = VALUES(in_stock),
         stock_status = VALUES(stock_status),
         image = VALUES(image),
         description = VALUES(description),
         raw_data = VALUES(raw_data),
         updated_at = CURRENT_TIMESTAMP`,
      [id, slug, name, sku, category, brand, model, status, sellingPrice, regularPrice, salePrice, inStock, stockStatus, image, description, rawData]
    );

    // Audit log
    await db.query(
      `INSERT INTO app_audit_log (event_type, entity_type, entity_id, source, payload)
       VALUES ('UPSERT_PRODUCT', 'product', ?, 'website', ?)`,
      [id, JSON.stringify({ id, name, status, updatedAt: new Date().toISOString() })]
    ).catch(() => {});

    return true;
  } catch (err) {
    console.error('Hostinger DB: Error saving product:', err);
    return false;
  }
}

export async function deleteProductFromHostingerDb(id: string): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    await db.query(
      `INSERT INTO app_audit_log (event_type, entity_type, entity_id, source, payload)
       VALUES ('DELETE_PRODUCT', 'product', ?, 'website', ?)`,
      [id, JSON.stringify({ id, deletedAt: new Date().toISOString() })]
    ).catch(() => {});
    return true;
  } catch (err) {
    console.error('Hostinger DB: Error deleting product:', err);
    return false;
  }
}

export async function saveLeadToHostingerDb(lead: any): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    await db.query(
      `INSERT INTO leads_enquiries (id, client_name, contact_name, email, phone, enquiry_type, category, product, quantity, estimated_value, stage, source, assigned_to, notes, raw_data, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         client_name = VALUES(client_name),
         contact_name = VALUES(contact_name),
         email = VALUES(email),
         phone = VALUES(phone),
         stage = VALUES(stage),
         notes = VALUES(notes),
         raw_data = VALUES(raw_data),
         updated_at = CURRENT_TIMESTAMP`,
      [
        lead.id,
        lead.clientName || '',
        lead.contactName || '',
        lead.email || '',
        lead.phone || '',
        lead.enquiryType || 'Sales',
        lead.category || 'Website Enquiry',
        lead.product || '',
        lead.quantity || 1,
        lead.estimatedValue || 0,
        lead.stage || 'New Lead',
        lead.source || 'Website',
        lead.assignedTo || 'Unassigned',
        lead.notes || '',
        JSON.stringify(lead),
        lead.createdAt ? new Date(lead.createdAt) : new Date()
      ]
    );

    await db.query(
      `INSERT INTO app_audit_log (event_type, entity_type, entity_id, source, payload)
       VALUES ('NEW_ENQUIRY', 'lead', ?, 'website', ?)`,
      [lead.id, JSON.stringify({ id: lead.id, clientName: lead.clientName, email: lead.email })]
    ).catch(() => {});

    return true;
  } catch (err) {
    console.error('Hostinger DB: Error saving lead:', err);
    return false;
  }
}

export async function saveAdminUserToHostingerDb(user: any): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    await db.query(
      `INSERT INTO admin_users (id, name, email, username, role, password_hash, raw_data)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         role = VALUES(role),
         password_hash = VALUES(password_hash),
         raw_data = VALUES(raw_data),
         updated_at = CURRENT_TIMESTAMP`,
      [
        user.id,
        user.name || '',
        user.email || '',
        user.username || user.email || '',
        user.role || 'Staff',
        user.password || '',
        JSON.stringify(user)
      ]
    );
    return true;
  } catch (err) {
    console.error('Hostinger DB: Error saving admin user:', err);
    return false;
  }
}

export async function saveBlogPostToHostingerDb(post: any): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    await db.query(
      `INSERT INTO blog_posts (id, slug, title, category, author, status, content, raw_data)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         slug = VALUES(slug),
         title = VALUES(title),
         category = VALUES(category),
         author = VALUES(author),
         status = VALUES(status),
         content = VALUES(content),
         raw_data = VALUES(raw_data),
         updated_at = CURRENT_TIMESTAMP`,
      [
        post.id,
        post.slug || '',
        post.title || 'Untitled',
        post.category || 'General',
        post.author || 'Fastonmed',
        post.status || 'published',
        post.content || '',
        JSON.stringify(post)
      ]
    );
    return true;
  } catch (err) {
    console.error('Hostinger DB: Error saving blog post:', err);
    return false;
  }
}

// null distinguishes an unavailable database from a valid empty catalog.
export async function readDurableProductCatalog(): Promise<any[] | null> {
  if (isDbInCooldown()) return null;
  try {
    const [rows] = await getHostingerDbPool().query<any[]>('SELECT id, status, raw_data FROM products');
    return rows.map((row) => {
      const product = typeof row.raw_data === 'string' ? JSON.parse(row.raw_data) : row.raw_data;
      if (!product || typeof product !== 'object') throw new Error('Invalid durable product record');
      return { ...product, id: row.id, status: row.status };
    });
  } catch (err) {
    recordDbFailure();
    console.warn('Hostinger DB catalog unavailable:', err);
    return null;
  }
}

export async function loadProductsFromHostingerDb(): Promise<any[]> {
  return (await readDurableProductCatalog() || []).filter(p => p.status !== 'trash');
}

export async function getProductBySlugOrIdFromHostingerDb(slugOrId: string): Promise<any | null> {
  if (isDbInCooldown()) return null;
  try {
    const db = getHostingerDbPool();
    const clean = decodeURIComponent(slugOrId).trim().toLowerCase().replace(/\/+$/, '');
    
    // 1. Direct match on slug, id, sku, or lower(slug) - prioritize published products with images
    const [rows] = await db.query<any[]>(
      `SELECT raw_data FROM products 
       WHERE (slug = ? OR id = ? OR sku = ? OR LOWER(slug) = ?) AND status != 'trash'
       ORDER BY (status = 'published') DESC, (image != '' AND image IS NOT NULL) DESC, updated_at DESC 
       LIMIT 1`,
      [clean, clean, clean, clean]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const raw = rows[0].raw_data;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }

    // 2. Fallback fuzzy match on slug
    if (clean.length > 3) {
      const [fuzzyRows] = await db.query<any[]>(
        `SELECT raw_data FROM products 
         WHERE slug LIKE ? AND status != 'trash'
         ORDER BY (status = 'published') DESC, (image != '' AND image IS NOT NULL) DESC, updated_at DESC 
         LIMIT 1`,
        [`%${clean}%`]
      );

      if (Array.isArray(fuzzyRows) && fuzzyRows.length > 0) {
        const raw = fuzzyRows[0].raw_data;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    }
  } catch (err) {
    recordDbFailure();
    console.warn('Hostinger DB getProductBySlug error:', err);
  }
  return null;
}

export async function saveMediaFileToHostingerDb(
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    const id = 'media-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    await db.query(
      `INSERT INTO media_files (id, filename, mime_type, data, size)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         mime_type = VALUES(mime_type),
         data = VALUES(data),
         size = VALUES(size)`,
      [id, filename, mimeType, buffer, buffer.length]
    );
    return true;
  } catch (err) {
    console.error('Hostinger DB: Error saving media file:', err);
    return false;
  }
}


