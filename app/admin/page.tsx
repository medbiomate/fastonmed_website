import Link from 'next/link';
import { ArrowUpRight, FileText, MessageSquare, Package, ShoppingCart } from 'lucide-react';
import { getAllProducts } from '@/lib/server-catalog';
import { getSharedEditorialPages } from '@/lib/server-pages';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [products, pages] = await Promise.all([getAllProducts(), getSharedEditorialPages()]);
  const cards = [
    { label: 'Products', value: products.length, note: 'Published catalogue records', href: '/admin/products', icon: Package },
    { label: 'Website pages', value: pages.length, note: 'Database-backed landing pages', href: '/admin/content/pages', icon: FileText },
    { label: 'Orders', value: 0, note: 'No orders requiring action', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Enquiries', value: 0, note: 'Customer sales requests', href: '/admin/enquiries', icon: MessageSquare }
  ];
  return <div><div className="tk-page-heading"><div><h1>Dashboard</h1><p>FastOnMed website administration console.</p></div><Link href="/admin/products/new" className="tk-page-action">Add Product</Link></div><main className="tk-dashboard-wrap">
    <section className="tk-welcome-card"><div><span>FASTONMED CONTROL CENTRE</span><h2>Website overview</h2><p>Manage the catalogue, content, enquiries, customers, SEO and storefront appearance from one workspace.</p></div><Link href="/" target="_blank">Open live store <ArrowUpRight size={16}/></Link></section>
    <section className="tk-stat-grid">{cards.map(({ label, value, note, href, icon: Icon }) => <Link href={href} className="tk-stat-card" key={label}><div className="tk-stat-icon"><Icon size={20}/></div><small>{label}</small><strong>{value.toLocaleString()}</strong><p>{note}</p></Link>)}</section>
    <section className="tk-dashboard-grid"><div className="tk-panel"><div className="tk-panel-head"><div><h3>Quick actions</h3><p>Common website management tasks</p></div></div><div className="tk-action-list">{[['Add a new product','/admin/products/new'],['Edit website pages','/admin/content/pages'],['Manage product categories','/admin/categories'],['Upload media','/admin/media'],['Edit header and footer','/admin/appearance/header'],['Review SEO and redirects','/admin/seo']].map(([label, href]) => <Link href={href} key={href}>{label}<ArrowUpRight size={15}/></Link>)}</div></div>
    <div className="tk-panel"><div className="tk-panel-head"><div><h3>System status</h3><p>Current website connections</p></div></div><div className="tk-status-list"><div><i className="ok"/><span><b>Shared database</b><small>Connected to Fastonmed CRM data</small></span></div><div><i className="ok"/><span><b>Product catalogue</b><small>{products.length.toLocaleString()} records available</small></span></div><div><i className="ok"/><span><b>Page sitemap</b><small>{pages.length} managed content pages</small></span></div></div></div></section>
  </main></div>;
}
