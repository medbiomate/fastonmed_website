'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { Archive, BarChart3, BookOpen, ChevronDown, ChevronRight, ExternalLink, FileText, Files, FolderTree, Image as ImageIcon, LayoutDashboard, MessageSquare, Package, PanelLeftClose, PanelLeftOpen, Settings, ShoppingCart, Tag } from 'lucide-react';
import { store } from '@/lib/store';

type NavItem = { label: string; href: string; count?: number };
type NavGroupProps = { label: string; icon: ReactNode; items: NavItem[]; count?: number; initiallyOpen?: boolean };

function NavGroup({ label, icon, items, count, initiallyOpen }: NavGroupProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentQuery = searchParams.toString();
  const fullUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname;

  const isItemActive = (href: string) => {
    if (href.includes('?')) {
      return fullUrl === href;
    }
    return pathname === href && !currentQuery;
  };

  const active = items.some((item) => isItemActive(item.href));
  const [open, setOpen] = useState(Boolean(initiallyOpen || active));
  return (
    <div className={`tk-nav-group${open ? ' open' : ''}`}>
      <button className={`tk-nav-parent${active ? ' active' : ''}`} onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="tk-nav-parent-main">{icon}<span className="tk-nav-title">{label}</span></span>
        <span className="tk-nav-meta">{typeof count === 'number' && <span className="tk-nav-count">{count}</span>}{open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</span>
      </button>
      {open && (
        <div className="tk-nav-submenu">
          {items.map((item) => (
            <Link key={item.href + item.label} href={item.href} className={isItemActive(item.href) ? 'active' : ''}>
              <span>{item.label}</span>
              {typeof item.count === 'number' && <span className="tk-nav-count">{item.count}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [folded, setFolded] = useState(false);
  const products = store.getProducts({ status: 'all' });
  const orders = store.getOrders();
  const customers = store.getCustomers();
  const enquiries = store.getEnquiries();
  const posts = store.getBlogPosts();
  const pages = store.getPages();
  const pendingOrders = orders.filter((order) => ['pending_payment', 'processing'].includes(order.status)).length;
  const direct = (href: string, label: string, icon: ReactNode) => <Link href={href} className={`tk-nav-parent tk-nav-link${pathname === href ? ' active' : ''}`}><span className="tk-nav-parent-main">{icon}<span className="tk-nav-title">{label}</span></span></Link>;

  return (
    <aside className={`tk-admin-navigation${folded ? ' folded' : ''}`}>
      <div>
        <div className="tk-nav-section-label">OVERVIEW</div>
        {direct('/admin', 'Dashboard', <LayoutDashboard size={18} />)}
        <div className="tk-nav-section-label">CATALOG</div>
        <NavGroup label="Products" icon={<Package size={18} />} count={products.length} initiallyOpen items={[{ label: 'All Products', href: '/admin/products' }, { label: 'Add Product', href: '/admin/products/new' }, { label: 'Categories', href: '/admin/categories' }, { label: 'Brands', href: '/admin/brands' }, { label: 'Inventory', href: '/admin/inventory' }]} />
        <NavGroup label="Media" icon={<ImageIcon size={18} />} items={[{ label: 'Library', href: '/admin/media' }]} />
        <div className="tk-nav-section-label">COMMERCE</div>
        <NavGroup label="Orders" icon={<ShoppingCart size={18} />} count={pendingOrders || orders.length} items={[{ label: 'All Orders', href: '/admin/orders' }, { label: 'Customers', href: '/admin/customers', count: customers.length }]} />
        <NavGroup label="Enquiries" icon={<MessageSquare size={18} />} count={enquiries.length} items={[{ label: 'All Enquiries', href: '/admin/enquiries' }]} />
        {direct('/admin/reports', 'Reports', <BarChart3 size={18} />)}
        <div className="tk-nav-section-label">CONTENT</div>
        <NavGroup label="Posts" icon={<BookOpen size={18} />} count={posts.length} items={[{ label: 'All Posts', href: '/admin/content/blog' }, { label: 'Add Post', href: '/admin/content/blog/new' }, { label: 'Categories', href: '/admin/content/blog/categories' }]} />
        <NavGroup label="Pages" icon={<Files size={18} />} count={3} items={[{ label: 'Core Pages', href: '/admin/content/pages?type=core', count: 5 }, { label: 'SEO Pages', href: '/admin/content/pages?type=seo', count: 38 }, { label: 'Other Pages', href: '/admin/content/pages?type=other', count: 5 }]} />
        <NavGroup label="Content Tools" icon={<FileText size={18} />} items={[{ label: 'FAQs', href: '/admin/content/faqs' }, { label: 'Reviews', href: '/admin/content/reviews' }, { label: 'Comments', href: '/admin/content/comments' }]} />
        <NavGroup label="Header & Footer" icon={<FolderTree size={18} />} items={[{ label: "Header", href: "/admin/appearance/header" }, { label: "Footer", href: "/admin/appearance/footer" }]} />
        {direct('/admin/coupons', 'Coupons', <Tag size={18} />)}
        <div className="tk-nav-section-label">SYSTEM</div>
        <NavGroup label="Website" icon={<Archive size={18} />} items={[{ label: 'SEO', href: '/admin/seo' }, { label: 'Redirects', href: '/admin/seo/redirects' }]} />
        <NavGroup label="Settings" icon={<Settings size={18} />} items={[{ label: 'Store Settings', href: '/admin/settings' }, { label: 'Users & Access', href: '/admin/settings/users' }]} />
      </div>
      <div className="tk-nav-footer">
        <Link href="/" target="_blank"><ExternalLink size={15} /><span>View website ↗</span></Link>
        <button onClick={() => setFolded((value) => !value)}>{folded ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}<span>Collapse menu</span></button>
      </div>
    </aside>
  );
}
