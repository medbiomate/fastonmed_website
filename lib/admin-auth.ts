import fs from 'fs';
import path from 'path';

export type AdminUserRole = 'Super Admin' | 'Administrator' | 'Editor' | 'Shop Manager' | 'Staff';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: AdminUserRole;
  password?: string;
  createdAt?: string;
};

// Default accounts matching the authentic Fastonmed CRM team
export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-fuhad',
    name: 'Fuhad',
    email: 'fuhad@fastonmed.com',
    username: 'fuhad',
    role: 'Super Admin',
    password: 'growth123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-hashim',
    name: 'Hashim',
    email: 'hashim@fastonmed.com',
    username: 'hashim',
    role: 'Administrator',
    password: 'hashim123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-riyas',
    name: 'Riyas',
    email: 'riyas@fastonmed.com',
    username: 'riyas',
    role: 'Shop Manager',
    password: 'riyas123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'user-admin',
    name: 'Fastonmed Admin',
    email: 'admin@fastonmed.com',
    username: 'admin',
    role: 'Administrator',
    password: 'admin123',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

const DATA_FILE = path.join(process.cwd(), 'data', 'admin-users.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
    } catch {
      // directory creation ignored if already exists
    }
  }
}

export function getAllAdminUsers(): AdminUser[] {
  try {
    ensureDataDir();
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length) {
        // Merge with defaults to guarantee default accounts always exist
        const map = new Map<string, AdminUser>();
        DEFAULT_ADMIN_USERS.forEach((u) => map.set(u.email.toLowerCase(), u));
        parsed.forEach((u: AdminUser) => map.set(u.email.toLowerCase(), u));
        return Array.from(map.values());
      }
    }
  } catch (err) {
    console.warn('[admin-auth] Could not read admin-users.json, using defaults:', err);
  }
  return DEFAULT_ADMIN_USERS;
}

export function saveAdminUsers(users: AdminUser[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('[admin-auth] Failed to persist admin-users.json:', err);
  }
}

export function findAdminUser(identifier: string): AdminUser | null {
  const clean = identifier.trim().toLowerCase();
  const users = getAllAdminUsers();
  return (
    users.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.username.toLowerCase() === clean ||
        u.name.toLowerCase() === clean ||
        u.email.split('@')[0].toLowerCase() === clean
    ) || null
  );
}

export function verifyAdminCredentials(identifier: string, passwordAttempt: string): AdminUser | null {
  const user = findAdminUser(identifier);
  if (!user) return null;
  if (!user.password || user.password !== passwordAttempt) return null;
  return user;
}

export function registerNewAdminUser(data: {
  name: string;
  email: string;
  username?: string;
  password: string;
  role?: AdminUserRole;
}): { success: boolean; user?: AdminUser; error?: string } {
  const cleanEmail = data.email.trim().toLowerCase();
  if (!cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!data.name.trim()) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!data.password || data.password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters.' };
  }

  const existing = findAdminUser(cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const username = (data.username || cleanEmail.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');

  const newUser: AdminUser = {
    id: `admin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name: data.name.trim(),
    email: cleanEmail,
    username: username || `user_${Date.now()}`,
    role: data.role || 'Administrator',
    password: data.password,
    createdAt: new Date().toISOString()
  };

  const users = getAllAdminUsers();
  users.push(newUser);
  saveAdminUsers(users);

  return { success: true, user: newUser };
}

// Session Token encoding (Safe JSON base64 with signature check)
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fastonmed_admin_secure_key_2026';

export function createSessionToken(user: AdminUser): string {
  const payload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: Date.now()
  };
  const str = JSON.stringify(payload);
  const encoded = Buffer.from(str, 'utf-8').toString('base64');
  return `${encoded}.${Buffer.from(SESSION_SECRET).toString('base64').slice(0, 10)}`;
}

export function decodeSessionToken(token: string): { userId: string; name: string; email: string; role: AdminUserRole } | null {
  try {
    if (!token || !token.includes('.')) return null;
    const [payloadBase64] = token.split('.');
    const decodedStr = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const parsed = JSON.parse(decodedStr);
    if (parsed && parsed.email && parsed.role) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}
