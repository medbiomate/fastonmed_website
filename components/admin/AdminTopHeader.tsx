'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Plus, Search, LogOut, ChevronDown, User as UserIcon, Shield } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

const routeMeta: Record<string, { breadcrumb: string; action: string; href: string }> = {
  '/admin': { breadcrumb: 'Dashboard / Overview', action: 'Add Product', href: '/admin/products/new' },
  '/admin/products': { breadcrumb: 'Products / All Products', action: 'Add Product', href: '/admin/products/new' },
  '/admin/products/new': { breadcrumb: 'Products / Add Product', action: 'All Products', href: '/admin/products' },
  '/admin/categories': { breadcrumb: 'Products / Categories', action: 'Add Product', href: '/admin/products/new' },
  '/admin/brands': { breadcrumb: 'Products / Brands', action: 'Add Product', href: '/admin/products/new' },
  '/admin/inventory': { breadcrumb: 'Commerce / Inventory', action: 'All Products', href: '/admin/products' },
  '/admin/orders': { breadcrumb: 'Commerce / Orders', action: 'View Store', href: '/' },
  '/admin/customers': { breadcrumb: 'Commerce / Customers', action: 'View Orders', href: '/admin/orders' },
  '/admin/enquiries': { breadcrumb: 'Operations / Enquiries', action: 'View Store', href: '/' },
  '/admin/reports': { breadcrumb: 'Reports / Analytics', action: 'View Orders', href: '/admin/orders' },
  '/admin/coupons': { breadcrumb: 'Marketing / Coupons', action: 'Add Coupon', href: '/admin/coupons' },
  '/admin/content/blog': { breadcrumb: 'Posts / All Posts', action: 'Add Post', href: '/admin/content/blog/new' },
  '/admin/content/blog/new': { breadcrumb: 'Posts / Add Post', action: 'All Posts', href: '/admin/content/blog' },
  '/admin/content/blog/categories': { breadcrumb: 'Posts / Categories', action: 'Add Post', href: '/admin/content/blog/new' },
  '/admin/content/pages': { breadcrumb: 'Pages / All Pages', action: 'Add Page', href: '/admin/content/pages/new' },
  '/admin/content/banners': { breadcrumb: 'Appearance / Banners', action: 'Add Banner', href: '/admin/content/banners' },
  '/admin/content/menus': { breadcrumb: 'Appearance / Navigation', action: 'Edit Menu', href: '/admin/content/menus' },
  '/admin/media': { breadcrumb: 'Media / Library', action: 'Add Media', href: '/admin/media' },
  '/admin/seo': { breadcrumb: 'Website / SEO', action: 'Redirects', href: '/admin/seo/redirects' },
  '/admin/seo/redirects': { breadcrumb: 'Website / Redirects', action: 'SEO Settings', href: '/admin/seo' },
  '/admin/settings': { breadcrumb: 'Settings / Store', action: 'Users', href: '/admin/settings/users' },
  '/admin/settings/users': { breadcrumb: 'Users / Access', action: 'Store Settings', href: '/admin/settings' }
};

export default function AdminTopHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const meta = useMemo(
    () => routeMeta[pathname] ?? { breadcrumb: 'FastonMed Console', action: 'Add Product', href: '/admin/products/new' },
    [pathname]
  );

  useEffect(() => {
    // Load logged in admin user
    fetch('/api/admin/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data?.authenticated && data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});

    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const editing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if ((event.metaKey && event.key.toLowerCase() === 'k') || (event.key === '/' && !editing)) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleShortcut);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleShortcut);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch {
      window.location.href = '/admin/login';
    }
  };

  const displayName = currentUser?.name || 'FastonMed Admin';
  const displayRole = currentUser?.role || 'Administrator';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="tk-admin-header">
      <div className="tk-admin-header-left">
        <Link href="/admin" className="tk-admin-brand" title="FastonMed Console">
          <Image src="/fastonmed-logo.png" alt="FastonMed" width={137} height={31} priority />
          <span>Console</span>
        </Link>
        <div className="tk-admin-breadcrumb"><i>/</i>{meta.breadcrumb}</div>
      </div>

      <label className="tk-admin-search">
        <Search size={16} />
        <input
          ref={searchRef}
          aria-label="Quick search"
          placeholder="Search products, orders, pages… (Press ⌘K or /)"
          onKeyDown={(event) => {
            if (event.key === 'Enter' && event.currentTarget.value.trim()) {
              router.push(`/admin/products?search=${encodeURIComponent(event.currentTarget.value.trim())}`);
            }
          }}
        />
        <kbd>⌘K</kbd>
      </label>

      <div className="tk-admin-header-right">
        <Link href="/" target="_blank" className="tk-header-button secondary">
          <ExternalLink size={15} /> Live Store ↗
        </Link>
        <Link href={meta.href} className="tk-header-button primary">
          <Plus size={15} /> {meta.action}
        </Link>

        {/* User Profile & Sign Out dropdown */}
        <div style={{ position: 'relative' }} ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              textAlign: 'left'
            }}
          >
            <div className="tk-admin-user" style={{ cursor: 'pointer' }}>
              <div className="tk-avatar">{initial}<span /></div>
              <div>
                <strong>{displayName}</strong>
                <small>{displayRole}</small>
              </div>
              <ChevronDown size={14} color="#94a3b8" style={{ marginLeft: 2 }} />
            </div>
          </button>

          {/* Dropdown Menu */}
          {userMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: 230,
                backgroundColor: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06)',
                padding: '12px',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <div style={{ paddingBottom: 10, borderBottom: '1px solid #f1f5f9', marginBottom: 8 }}>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>
                  {displayName}
                </div>
                {currentUser?.email && (
                  <div style={{ fontSize: '0.76rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser.email}
                  </div>
                )}
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: 6,
                    padding: '2px 8px',
                    borderRadius: 12,
                    backgroundColor: '#eaf7f2',
                    color: '#2f6b57',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {displayRole}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link
                  href="/admin/settings/users"
                  onClick={() => setUserMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 6,
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 500,
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Shield size={15} color="#64748b" />
                  <span>Users &amp; Roles</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 6,
                    color: '#ef4444',
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <LogOut size={15} color="#ef4444" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
