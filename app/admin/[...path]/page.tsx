import AdminResourcePage, { type AdminResourceItem } from '@/components/admin/AdminResourcePage';
import PageManager from '@/components/admin/PageManager';
import SiteChromeBuilder from '@/components/admin/SiteChromeBuilder';
import AdminSeoSuite from '@/components/admin/AdminSeoSuite';
import EnquiryManager from '@/components/admin/EnquiryManager';
import { getAllProducts } from '@/lib/server-catalog';
import { getSharedEditorialPages } from '@/lib/server-pages';
import { store } from '@/lib/store';

export const dynamic = 'force-dynamic';

function decodeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function getCategoryVisual(name: string, sampleImage?: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('furniture') || lower.includes('bed')) {
    return '/wp-content/uploads/2025/06/dione-100-homecare-electric-bed-510x352_large.jpg';
  }
  if (lower.includes('monitor') || lower.includes('vital signs')) {
    return '/wp-content/uploads/2025/10/av-pro-multiparameter-patient-monitor-uae.png';
  }
  if (lower.includes('refrigerat') || lower.includes('cold') || lower.includes('pharmacy')) {
    return '/images/original/Fridges-Pharmacy_Haier_HYC-309.png';
  }
  if (lower.includes('physiotherapy') || lower.includes('tecar') || lower.includes('electrotherapy') || lower.includes('shockwave')) {
    return '/images/original/phsyotherapy-1.jpeg';
  }
  if (lower.includes('ventilator') || lower.includes('icu') || lower.includes('critical care') || lower.includes('oxygen')) {
    return '/products/ventilator.jpg';
  }
  if (lower.includes('cardio') || lower.includes('ecg')) {
    return '/products/ecg-machine.jpg';
  }
  if (lower.includes('dental')) {
    return '/products/dental-chair.jpg';
  }
  if (lower.includes('ultrasound')) {
    return '/products/ultrasound.jpg';
  }
  if (sampleImage && sampleImage.trim().length > 5 && !sampleImage.includes('placeholder')) {
    return sampleImage;
  }
  if (lower.includes('consumable') || lower.includes('disposable')) {
    return '/wp-content/uploads/2025/07/103497-mueller_s_kinesiology_tape_pink-1024x1024-1-510x510_large.jpg';
  }
  return sampleImage || '/products/patient-monitor.jpg';
}

const meta: Record<string, [string, string, string, string]> = {
  products: ['Products', 'Catalogue', 'Manage medical products, pricing, stock and publishing status.', 'Add Product'],
  'products/new': ['Add Product', 'Catalogue', 'Create a product record for the Fastonmed storefront.', 'Create Draft'],
  categories: ['Categories', 'Catalogue', 'Organise medical equipment into storefront categories.', 'Add Category'],
  brands: ['Brands', 'Catalogue', 'Manage manufacturers and medical equipment brands.', 'Add Brand'],
  inventory: ['Inventory', 'Commerce', 'Monitor product stock and catalogue availability.', 'Add Stock Record'],
  media: ['Media Library', 'Content', 'Manage product images and website media.', 'Add Media'],
  orders: ['Orders', 'Commerce', 'Review and manage customer orders.', 'Add Order'],
  customers: ['Customers', 'Commerce', 'Manage customer and institutional buyer records.', 'Add Customer'],
  enquiries: ['Enquiries', 'Commerce', 'Track quotation and customer sales enquiries.', 'Add Enquiry'],
  reports: ['Reports', 'Analytics', 'Review catalogue, sales and content performance.', 'Create Report'],
  coupons: ['Coupons', 'Marketing', 'Manage promotional coupon rules.', 'Add Coupon'],
  'content/blog': ['Posts', 'Content', 'Publish healthcare articles and company updates.', 'Add Post'],
  'content/pages': ['Pages', 'Content', 'Manage the Fastonmed service, equipment and legal pages.', 'Add Page'],
  'content/faqs': ['FAQs', 'Content', 'Maintain frequently asked questions.', 'Add FAQ'],
  'content/reviews': ['Reviews', 'Content', 'Manage verified customer reviews and display status.', 'Add Review'],
  'content/comments': ['Comments', 'Content', 'Moderate website comments and feedback.', 'Add Comment'],
  seo: ['SEO', 'Website', 'Manage titles, descriptions, sitemap visibility and search settings.', 'Add SEO Rule'],
  'seo/redirects': ['Redirects', 'Website', 'Preserve old WordPress URLs with permanent redirects.', 'Add Redirect'],
  settings: ['Store Settings', 'System', 'Configure Fastonmed storefront and contact settings.', 'Save Setting'],
  'settings/users': ['Users & Access', 'System', 'Manage administrators and access roles.', 'Add User']
};

const emptyRows = (title: string): AdminResourceItem[] => [{ id: `ready-${title}`, title: `${title} workspace`, description: 'Connected and ready for records.', type: 'Fastonmed', status: 'Ready', updated: 'Just now' }];

export default async function AdminSection({
  params,
  searchParams
}: {
  params: Promise<{ path: string[] }>;
  searchParams?: Promise<{ type?: string }>;
}) {
  const key = (await params).path.join('/');
  const sParams = searchParams ? await searchParams : {};
  const pageType = sParams.type;
  if (key === 'appearance/header') return <SiteChromeBuilder initialPanel="header"/>;
  if (key === 'appearance/footer') return <SiteChromeBuilder initialPanel="footer"/>;
  if (key === 'content/pages') return <PageManager mode="list" initialType={pageType} />;
  if (key === 'seo' || key === 'seo/redirects') return <AdminSeoSuite />;
  if (key === 'enquiries') return <EnquiryManager />;
  let [title, eyebrow, description, actionLabel] = meta[key] || ['Admin Console', 'Fastonmed', 'Manage this website resource.', 'Add Record'];
  let items: AdminResourceItem[] = emptyRows(title);

  if (key === 'products' || key === 'inventory') {
    items = (await getAllProducts()).slice(0, 300).map((product) => ({
      id: product.id,
      title: decodeHtml(product.name),
      description: product.sku ? `SKU: ${product.sku}` : 'Medical SKU',
      type: decodeHtml(product.category || 'General Equipment'),
      status: (product.status === 'published' ? 'Live' : 'Draft') as AdminResourceItem['status'],
      updated: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-AE') : 'Recently',
      image: product.mainImage,
      price: product.salePrice && product.salePrice > 0 ? product.salePrice : product.regularPrice,
      slug: product.slug
    }));
  } else if (key === 'categories') {
    const products = await getAllProducts();
    const catData = new Map<string, { count: number; image?: string }>();

    products.forEach((product) => {
      const rawCat = product.category || '';
      const clean = decodeHtml(rawCat);
      if (!clean || clean.toLowerCase() === 'uncategorized') return;

      const existing = catData.get(clean);
      if (existing) {
        existing.count += 1;
        if (!existing.image && product.mainImage) {
          existing.image = product.mainImage;
        }
      } else {
        catData.set(clean, {
          count: 1,
          image: product.mainImage
        });
      }
    });

    items = [...catData.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, data], index) => ({
        id: `cat-${index}`,
        title: name,
        description: data.count === 1 ? '1 product catalogued' : `${data.count.toLocaleString()} products catalogued`,
        type: 'Department',
        status: 'Active' as AdminResourceItem['status'],
        updated: 'Live catalogue',
        image: getCategoryVisual(name, data.image),
        slug: `/shop?category=${encodeURIComponent(name)}`
      }));
  } else if (key === 'brands') {
    const brands = [...new Set((await getAllProducts()).map((product) => decodeHtml(product.brand)))].filter(Boolean);
    items = brands.map((name, index) => ({
      id: `brand-${index}`,
      title: name,
      description: 'Medical equipment manufacturer',
      type: 'Brand',
      status: 'Active' as AdminResourceItem['status'],
      updated: 'Live catalogue',
      slug: `/shop?search=${encodeURIComponent(name)}`
    }));
  } else if (key === 'orders') {
    const orders = store.getOrders();
    items = orders.map((order) => ({
      id: order.id,
      title: `Order #${order.orderNumber} - ${order.customerName}`,
      description: `${order.items.length} item(s) • ${order.paymentMethod.replace(/_/g, ' ')}`,
      type: order.paymentStatus === 'paid' ? 'Paid' : 'Pending Payment',
      status: (order.status === 'completed' || order.status === 'delivered' ? 'Live' : 'Active') as AdminResourceItem['status'],
      updated: new Date(order.createdAt).toLocaleDateString('en-AE'),
      price: order.grandTotal,
      image: order.items[0]?.image || '/products/patient-monitor.jpg'
    }));
  } else if (key === 'customers') {
    const customers = store.getCustomers();
    items = customers.map((c) => ({
      id: c.id,
      title: `${c.firstName} ${c.lastName}`,
      description: `${c.company || c.email} • ${c.phone}`,
      type: c.company ? 'Institution' : 'Individual',
      status: (c.status === 'active' ? 'Active' : 'Draft') as AdminResourceItem['status'],
      updated: new Date(c.createdAt).toLocaleDateString('en-AE')
    }));
  } else if (key === 'enquiries') {
    const enquiries = store.getEnquiries();
    items = enquiries.map((enq) => ({
      id: enq.id,
      title: `${enq.customerName} - ${enq.productName || enq.enquiryNumber}`,
      description: `${enq.company || enq.email} • ${enq.phone}`,
      type: enq.type.replace(/_/g, ' '),
      status: (enq.status === 'closed' || enq.status === 'quoted' ? 'Active' : 'Pending') as AdminResourceItem['status'],
      updated: new Date(enq.createdAt).toLocaleDateString('en-AE')
    }));
  } else if (key === 'content/pages') {
    const editorialPages = await getSharedEditorialPages();

    const corePages: AdminResourceItem[] = [
      {
        id: 'core-home',
        title: 'Home — Leading Medical Equipment Supplier in UAE',
        description: '/',
        type: 'Core Page',
        status: 'Live',
        updated: 'Today',
        slug: '/'
      },
      {
        id: 'core-shop',
        title: 'Shop — Medical Equipment & Hospital Supplies Store',
        description: '/shop',
        type: 'Core Page',
        status: 'Live',
        updated: 'Today',
        slug: '/shop'
      },
      {
        id: 'core-about',
        title: 'About Us — FastonMed Dubai',
        description: '/about-us',
        type: 'Core Page',
        status: 'Live',
        updated: 'Today',
        slug: '/about-us'
      },
      {
        id: 'core-contact',
        title: 'Contact Us — Sales & Biomedical Engineering UAE',
        description: '/contact',
        type: 'Core Page',
        status: 'Live',
        updated: 'Today',
        slug: '/contact'
      },
      {
        id: 'core-blog',
        title: 'Blog — Healthcare Technology & Clinical Insights',
        description: '/blog',
        type: 'Core Page',
        status: 'Live',
        updated: 'Today',
        slug: '/blog'
      }
    ];

    const seoPages: AdminResourceItem[] = editorialPages.map((page) => ({
      id: page.id,
      title: page.title,
      description: `/${page.slug}`,
      type: 'SEO Landing Page',
      status: (page.status === 'draft' ? 'Draft' : 'Live') as AdminResourceItem['status'],
      updated: page.updatedAt ? new Date(page.updatedAt).toLocaleDateString('en-AE') : 'Published',
      slug: `/${page.slug}`
    }));

    const otherPages: AdminResourceItem[] = [
      {
        id: 'other-privacy',
        title: 'Privacy Policy',
        description: '/privacy-policy',
        type: 'Legal Policy',
        status: 'Live',
        updated: '2026',
        slug: '/privacy-policy'
      },
      {
        id: 'other-terms',
        title: 'Terms & Conditions',
        description: '/terms-and-conditions',
        type: 'Legal Policy',
        status: 'Live',
        updated: '2026',
        slug: '/terms-and-conditions'
      },
      {
        id: 'other-refund',
        title: 'Return & Refund Policy',
        description: '/return-policy',
        type: 'Store Policy',
        status: 'Live',
        updated: '2026',
        slug: '/return-policy'
      },
      {
        id: 'other-shipping',
        title: 'Shipping & Delivery Policy',
        description: '/shipping-policy',
        type: 'Store Policy',
        status: 'Live',
        updated: '2026',
        slug: '/shipping-policy'
      },
      {
        id: 'other-services',
        title: 'Biomedical Equipment Services & Maintenance',
        description: '/services',
        type: 'Service Info',
        status: 'Live',
        updated: '2026',
        slug: '/services'
      }
    ];

    if (pageType === 'seo') {
      title = 'SEO Pages';
      description = 'Manage 38 high-converting SEO landing and healthcare equipment pages for Dubai & UAE.';
      actionLabel = 'Add SEO Page';
      items = seoPages;
    } else if (pageType === 'other') {
      title = 'Other Pages';
      description = 'Manage legal terms, privacy policy, refund policy and utility pages.';
      actionLabel = 'Add Other Page';
      items = otherPages;
    } else {
      title = 'Core Pages';
      description = 'Manage primary brand and storefront pages (Home, Shop, About, Contact, Blog).';
      actionLabel = 'Add Core Page';
      items = corePages;
    }
  }

  return <AdminResourcePage title={title} eyebrow={eyebrow} description={description} actionLabel={actionLabel} items={items}/>;
}
