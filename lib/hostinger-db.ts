import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getHostingerDbPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.HOSTINGER_DB_HOST || 'srv679.hstgr.io',
      port: Number(process.env.HOSTINGER_DB_PORT || 3306),
      user: process.env.HOSTINGER_DB_USER || 'u304645447_fastonmed',
      password: process.env.HOSTINGER_DB_PASSWORD || 'FastonMed_DbPass_2026#!',
      database: process.env.HOSTINGER_DB_NAME || 'u304645447_fastonmed',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
  return pool;
}

export async function saveProductToHostingerDb(p: any): Promise<boolean> {
  try {
    const db = getHostingerDbPool();
    const id = String(p.id || 'prod-' + Date.now());
    const name = String(p.name || 'Unnamed Product').slice(0, 500);
    const slug = String(p.slug || '').slice(0, 255);
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

export async function loadProductsFromHostingerDb(): Promise<any[]> {
  try {
    const db = getHostingerDbPool();
    const [rows] = await db.query<any[]>('SELECT raw_data FROM products WHERE status != "trash"');
    if (Array.isArray(rows) && rows.length > 0) {
      return rows.map((r) => {
        try {
          return typeof r.raw_data === 'string' ? JSON.parse(r.raw_data) : r.raw_data;
        } catch {
          return null;
        }
      }).filter(Boolean);
    }
  } catch (err) {
    console.warn('Hostinger DB query error:', err);
  }
  return [];
}

export async function getProductBySlugOrIdFromHostingerDb(slugOrId: string): Promise<any | null> {
  try {
    const db = getHostingerDbPool();
    const clean = decodeURIComponent(slugOrId).trim().toLowerCase().replace(/\/+$/, '');
    
    // 1. Direct match on slug, id, sku, or lower(slug)
    const [rows] = await db.query<any[]>(
      'SELECT raw_data FROM products WHERE slug = ? OR id = ? OR sku = ? OR LOWER(slug) = ? LIMIT 1',
      [clean, clean, clean, clean]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      const raw = rows[0].raw_data;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }

    // 2. Fallback fuzzy match on slug
    if (clean.length > 3) {
      const [fuzzyRows] = await db.query<any[]>(
        'SELECT raw_data FROM products WHERE slug LIKE ? LIMIT 1',
        [`%${clean}%`]
      );

      if (Array.isArray(fuzzyRows) && fuzzyRows.length > 0) {
        const raw = fuzzyRows[0].raw_data;
        return typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    }
  } catch (err) {
    console.warn('Hostinger DB getProductBySlug error:', err);
  }
  return null;
}

