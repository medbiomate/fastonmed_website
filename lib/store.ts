import { SiteChromeSettings, SiteChromeMenuItem,
  Product,
  ProductCategory,
  Brand,
  Order,
  Customer,
  Enquiry,
  Coupon,
  BlogPost,
  PageContent,
  StoreSettings,
  RedirectRule,
  NotFoundLog,
  AdminActivityLog,
  OrderStatus
} from './types';

import {
  initialCategories,
  initialBrands,
  initialProducts,
  initialOrders,
  initialCustomers,
  initialEnquiries,
  initialCoupons,
  initialBlogPosts,
  initialPages,
  initialStoreSettings,
  initialRedirects
} from './mock-data';

export const defaultSiteChromeSettings: SiteChromeSettings = {
  headerLayout: "classic",
  headerLogo: "/fastonmed-logo.svg",
  headerMenu: [
    { label: "Home", url: "/" },
    { label: "Shop", url: "/shop" },
    { label: "About Us", url: "/about-us" },
    { label: "Contact", url: "/contact" }
  ],
  headerBg: "#ffffff",
  headerText: "#0f172a",
  headerAccent: "#51b291",
  footerLayout: "fastonmed-wide",
  footerLogo: "/fastonmed-logo.svg",
  footerEmail: "sales@fastonmed.com",
  footerPhone: "+971 50 889 3589 / +971 50 889 3586",
  footerAddress: "Dubai, United Arab Emirates",
  footerExploreTitle: "Quick Links",
  footerExploreLinks: [
    { label: "Home", url: "/" },
    { label: "Shop Catalog", url: "/shop" },
    { label: "About FastonMed", url: "/about-us" },
    { label: "Contact Clinical Team", url: "/contact" },
    { label: "Medical Blog & Insights", url: "/blog" }
  ],
  footerCategoriesTitle: "Product Categories",
  footerCategoriesLinks: [
    { label: "Cold-Chain Medical Refrigeration", url: "/product-category/accessories" },
    { label: "Hospital & Clinic Furniture", url: "/product-category/hospital-furniture" },
    { label: "Surgical & Sterile Consumables", url: "/product-category/consumables-and-disposables" },
    { label: "Diagnostic Patient Monitors", url: "/product-category/general-medical-devices" }
  ],
  footerCustomerTitle: "Compliance & Support",
  footerCustomerLinks: [
    { label: "Terms & Conditions", url: "/terms-conditions" },
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Shipping & Delivery UAE", url: "/shipping-delivery" },
    { label: "Warranty & Returns", url: "/returns-exchanges" }
  ],
  footerCopyright: "© 2026 FastonMed (FASTONMED TRADING L.L.C). All Rights Reserved.",
  footerBg: "#0f172a",
  footerText: "#ffffff",
  footerLink: "#94a3b8"
};

// Singleton in-memory state with lazy initialization
class DataStore {
  private products: Product[] = [];
  private categories: ProductCategory[] = [];
  private brands: Brand[] = [];
  private orders: Order[] = [];
  private customers: Customer[] = [];
  private enquiries: Enquiry[] = [];
  private coupons: Coupon[] = [];
  private blogPosts: BlogPost[] = [];
  private pages: PageContent[] = [];
  private settings: StoreSettings = initialStoreSettings;
  private redirects: RedirectRule[] = [];
  private notFoundLogs: NotFoundLog[] = [];
  private activityLogs: AdminActivityLog[] = [];

  constructor() {
    this.resetToDefaults();
  }

  public resetToDefaults() {
    this.products = JSON.parse(JSON.stringify(initialProducts));
    this.categories = JSON.parse(JSON.stringify(initialCategories));
    this.brands = JSON.parse(JSON.stringify(initialBrands));
    this.orders = JSON.parse(JSON.stringify(initialOrders));
    this.customers = JSON.parse(JSON.stringify(initialCustomers));
    this.enquiries = JSON.parse(JSON.stringify(initialEnquiries));
    this.coupons = JSON.parse(JSON.stringify(initialCoupons));
    this.blogPosts = JSON.parse(JSON.stringify(initialBlogPosts));
    this.pages = JSON.parse(JSON.stringify(initialPages));
    this.settings = JSON.parse(JSON.stringify(initialStoreSettings));
    this.redirects = JSON.parse(JSON.stringify(initialRedirects));
    this.notFoundLogs = [
      { id: 'nf-1', url: '/shop/old-discontinued-item', hitCount: 14, lastSeenAt: '2026-09-24T10:15:00Z' },
      { id: 'nf-2', url: '/wp-content/uploads/2023/ancient-doc.pdf', hitCount: 3, lastSeenAt: '2026-09-24T12:30:00Z' }
    ];
    this.activityLogs = [
      {
        id: 'act-1',
        userName: 'Saneen (Admin)',
        userRole: 'Super Admin',
        action: 'Price Update',
        module: 'Products',
        itemId: 'prod-fom-001',
        itemTitle: 'Haier Biomedical HYC-309',
        details: 'Updated sale price from AED 6,050 to AED 5,999',
        timestamp: '2026-09-24T14:30:00Z'
      },
      {
        id: 'act-2',
        userName: 'Warehouse Manager',
        userRole: 'Store Manager',
        action: 'Stock Adjustment',
        module: 'Inventory',
        itemId: 'prod-fom-004',
        itemTitle: 'GIMA First Aid Splints',
        details: 'Received +25 units from Italian shipment',
        timestamp: '2026-09-24T11:00:00Z'
      }
    ];
  }

  // --- Products ---
  public getProducts(options?: {
    category?: string;
    brand?: string;
    search?: string;
    status?: 'published' | 'draft' | 'all';
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price-asc' | 'price-desc' | 'name' | 'newest';
  }): Product[] {
    let list = [...this.products];

    if (options?.status && options.status !== 'all') {
      list = list.filter(p => p.status === options.status);
    }

    if (options?.category) {
      const catSlug = options.category.toLowerCase();
      list = list.filter(p => p.category.toLowerCase().includes(catSlug) || p.category.toLowerCase().replace(/\s+/g, '-').includes(catSlug));
    }

    if (options?.brand) {
      const bSlug = options.brand.toLowerCase();
      list = list.filter(p => p.brand.toLowerCase().includes(bSlug) || p.brand.toLowerCase().replace(/\s+/g, '-').includes(bSlug));
    }

    if (options?.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (options?.minPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.regularPrice) >= (options.minPrice || 0));
    }

    if (options?.maxPrice !== undefined) {
      list = list.filter(p => (p.salePrice || p.regularPrice) <= (options.maxPrice || Infinity));
    }

    if (options?.sortBy) {
      if (options.sortBy === 'price-asc') {
        list.sort((a, b) => (a.salePrice || a.regularPrice) - (b.salePrice || b.regularPrice));
      } else if (options.sortBy === 'price-desc') {
        list.sort((a, b) => (b.salePrice || b.regularPrice) - (a.salePrice || a.regularPrice));
      } else if (options.sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sortBy === 'newest') {
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return list;
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find(p => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: `prod-fom-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    this.logActivity('Create', 'Products', newProduct.id, newProduct.name, 'Created new product');
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.logActivity('Update', 'Products', id, this.products[index].name, 'Updated product details');
    return this.products[index];
  }

  public deleteProduct(id: string): boolean {
    const p = this.products.find(item => item.id === id);
    if (!p) return false;
    this.products = this.products.filter(item => item.id !== id);
    this.logActivity('Delete', 'Products', id, p.name, 'Deleted product');
    return true;
  }

  public bulkUpdateProducts(ids: string[], updates: Partial<Product>): number {
    let count = 0;
    this.products = this.products.map(p => {
      if (ids.includes(p.id)) {
        count++;
        return { ...p, ...updates, updatedAt: new Date().toISOString() };
      }
      return p;
    });
    this.logActivity('Bulk Update', 'Products', ids.join(', '), `${count} products`, 'Bulk updated products');
    return count;
  }

  // --- Categories ---
  public getCategories(): ProductCategory[] {
    return [...this.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  public getCategoryBySlug(slug: string): ProductCategory | undefined {
    return this.categories.find(c => c.slug === slug);
  }

  public createCategory(cat: Omit<ProductCategory, 'id' | 'productCount'>): ProductCategory {
    const newCat: ProductCategory = {
      ...cat,
      id: `cat-${Date.now()}`,
      productCount: 0
    };
    this.categories.push(newCat);
    this.logActivity('Create', 'Categories', newCat.id, newCat.name, 'Created category');
    return newCat;
  }

  public updateCategory(id: string, updates: Partial<ProductCategory>): ProductCategory | undefined {
    const idx = this.categories.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.categories[idx] = { ...this.categories[idx], ...updates };
    this.logActivity('Update', 'Categories', id, this.categories[idx].name, 'Updated category');
    return this.categories[idx];
  }

  public deleteCategory(id: string): boolean {
    const c = this.categories.find(item => item.id === id);
    if (!c) return false;
    this.categories = this.categories.filter(item => item.id !== id);
    this.logActivity('Delete', 'Categories', id, c.name, 'Deleted category');
    return true;
  }

  // --- Brands ---
  public getBrands(): Brand[] {
    return [...this.brands];
  }

  public getBrandBySlug(slug: string): Brand | undefined {
    return this.brands.find(b => b.slug === slug);
  }

  public createBrand(brand: Omit<Brand, 'id' | 'productCount'>): Brand {
    const newBrand: Brand = {
      ...brand,
      id: `b-${Date.now()}`,
      productCount: 0
    };
    this.brands.push(newBrand);
    this.logActivity('Create', 'Brands', newBrand.id, newBrand.name, 'Created brand');
    return newBrand;
  }

  public updateBrand(id: string, updates: Partial<Brand>): Brand | undefined {
    const idx = this.brands.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    this.brands[idx] = { ...this.brands[idx], ...updates };
    this.logActivity('Update', 'Brands', id, this.brands[idx].name, 'Updated brand');
    return this.brands[idx];
  }

  public deleteBrand(id: string): boolean {
    const b = this.brands.find(item => item.id === id);
    if (!b) return false;
    this.brands = this.brands.filter(item => item.id !== id);
    this.logActivity('Delete', 'Brands', id, b.name, 'Deleted brand');
    return true;
  }

  // --- Orders ---
  public getOrders(): Order[] {
    return [...this.orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
    const orderNum = `FOM-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      timeline: [
        {
          status: orderData.status,
          note: 'Order successfully created',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Deduct inventory
    orderData.items.forEach(item => {
      this.adjustStock(item.productId, -item.quantity, 'Order Placed', orderNum);
    });

    this.orders.unshift(newOrder);
    this.logActivity('Create Order', 'Orders', newOrder.id, orderNum, `New order of AED ${orderData.grandTotal}`);
    return newOrder;
  }

  public updateOrderStatus(id: string, newStatus: OrderStatus, note?: string, user?: string): Order | undefined {
    const order = this.orders.find(o => o.id === id);
    if (!order) return undefined;

    const prevStatus = order.status;
    order.status = newStatus;
    order.updatedAt = new Date().toISOString();

    if (newStatus === 'cancelled' || newStatus === 'refunded') {
      // Restore stock
      order.items.forEach(item => {
        this.adjustStock(item.productId, item.quantity, `Order ${newStatus}`, order.orderNumber);
      });
    }

    order.timeline.push({
      status: newStatus,
      note: note || `Status changed from ${prevStatus} to ${newStatus}`,
      timestamp: new Date().toISOString(),
      user: user || 'Store Admin'
    });

    this.logActivity('Status Change', 'Orders', order.id, order.orderNumber, `Changed to ${newStatus}`);
    return order;
  }

  // --- Inventory ---
  public adjustStock(productId: string, delta: number, reason: string, referenceId?: string): boolean {
    const p = this.products.find(item => item.id === productId);
    if (!p) return false;

    const oldQty = p.stockQuantity;
    const newQty = Math.max(0, oldQty + delta);
    p.stockQuantity = newQty;
    p.stockStatus = newQty === 0 ? 'out_of_stock' : 'in_stock';
    p.updatedAt = new Date().toISOString();

    this.logActivity(
      'Stock Adjustment',
      'Inventory',
      productId,
      p.name,
      `${reason}: ${oldQty} -> ${newQty} (${delta >= 0 ? '+' : ''}${delta}) [${referenceId || 'N/A'}]`
    );
    return true;
  }

  // --- Customers ---
  public getCustomers(): Customer[] {
    return [...this.customers];
  }

  public getCustomerById(id: string): Customer | undefined {
    return this.customers.find(c => c.id === id);
  }

  public updateCustomerStatus(id: string, status: Customer['status']): Customer | undefined {
    const c = this.customers.find(item => item.id === id);
    if (!c) return undefined;
    c.status = status;
    this.logActivity('Update Status', 'Customers', id, `${c.firstName} ${c.lastName}`, `Changed status to ${status}`);
    return c;
  }

  // --- Enquiries & Quotes ---
  public getEnquiries(): Enquiry[] {
    return [...this.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public createEnquiry(enquiry: Omit<Enquiry, 'id' | 'enquiryNumber' | 'createdAt'>): Enquiry {
    const enqNum = `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      enquiryNumber: enqNum,
      createdAt: new Date().toISOString()
    };
    this.enquiries.unshift(newEnq);
    this.logActivity('New Enquiry', 'Enquiries', newEnq.id, enqNum, `Received quote request from ${enquiry.customerName}`);
    return newEnq;
  }

  public updateEnquiryStatus(id: string, status: Enquiry['status'], notes?: string): Enquiry | undefined {
    const enq = this.enquiries.find(e => e.id === id);
    if (!enq) return undefined;
    enq.status = status;
    if (notes) enq.notes = notes;
    this.logActivity('Update Enquiry', 'Enquiries', id, enq.enquiryNumber, `Status updated to ${status}`);
    return enq;
  }

  // --- Coupons ---
  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public getCouponByCode(code: string): Coupon | undefined {
    return this.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
  }

  public createCoupon(coupon: Omit<Coupon, 'id' | 'usageCount'>): Coupon {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cp-${Date.now()}`,
      usageCount: 0
    };
    this.coupons.push(newCoupon);
    this.logActivity('Create Coupon', 'Marketing', newCoupon.id, newCoupon.code, 'Created discount coupon');
    return newCoupon;
  }

  public updateCoupon(id: string, updates: Partial<Coupon>): Coupon | undefined {
    const idx = this.coupons.findIndex(c => c.id === id);
    if (idx === -1) return undefined;
    this.coupons[idx] = { ...this.coupons[idx], ...updates };
    this.logActivity('Update Coupon', 'Marketing', id, this.coupons[idx].code, 'Updated discount coupon');
    return this.coupons[idx];
  }

  public deleteCoupon(id: string): boolean {
    const c = this.coupons.find(item => item.id === id);
    if (!c) return false;
    this.coupons = this.coupons.filter(item => item.id !== id);
    this.logActivity('Delete Coupon', 'Marketing', id, c.code, 'Deleted discount coupon');
    return true;
  }

  // --- Blog & Pages ---
  public getBlogPosts(): BlogPost[] {
    return [...this.blogPosts].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  public getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find(b => b.slug === slug);
  }

  public createBlogPost(post: Omit<BlogPost, 'id' | 'publishedAt'>): BlogPost {
    const newPost: BlogPost = {
      ...post,
      id: `blog-${Date.now()}`,
      publishedAt: new Date().toISOString()
    };
    this.blogPosts.unshift(newPost);
    this.logActivity('Create Post', 'Content', newPost.id, newPost.title, 'Created blog post');
    return newPost;
  }

  public updateBlogPost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
    const idx = this.blogPosts.findIndex(b => b.id === id);
    if (idx === -1) return undefined;
    this.blogPosts[idx] = { ...this.blogPosts[idx], ...updates };
    this.logActivity('Update Post', 'Content', id, this.blogPosts[idx].title, 'Updated blog post');
    return this.blogPosts[idx];
  }

  public deleteBlogPost(id: string): boolean {
    const b = this.blogPosts.find(item => item.id === id);
    if (!b) return false;
    this.blogPosts = this.blogPosts.filter(item => item.id !== id);
    this.logActivity('Delete Post', 'Content', id, b.title, 'Deleted blog post');
    return true;
  }

  public getPages(): PageContent[] {
    return [...this.pages];
  }

  public getPageBySlug(slug: string): PageContent | undefined {
    return this.pages.find(p => p.slug === slug);
  }

  public createPage(page: Omit<PageContent, 'id' | 'updatedAt'>): PageContent {
    const newPage: PageContent = {
      ...page,
      id: `pg-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    this.pages.push(newPage);
    this.logActivity('Create Page', 'Content', newPage.id, newPage.title, 'Created page');
    return newPage;
  }

  public updatePage(id: string, updates: Partial<PageContent>): PageContent | undefined {
    const idx = this.pages.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    this.pages[idx] = { ...this.pages[idx], ...updates, updatedAt: new Date().toISOString() };
    this.logActivity('Update Page', 'Content', id, this.pages[idx].title, 'Updated page content');
    return this.pages[idx];
  }

  public deletePage(id: string): boolean {
    const p = this.pages.find(item => item.id === id);
    if (!p) return false;
    this.pages = this.pages.filter(item => item.id !== id);
    this.logActivity('Delete Page', 'Content', id, p.title, 'Deleted page');
    return true;
  }

  // --- Redirects & 404s ---
  public getRedirects(): RedirectRule[] {
    return [...this.redirects];
  }

  public createRedirect(rule: Omit<RedirectRule, 'id' | 'hitCount' | 'createdAt'>): RedirectRule {
    const newRule: RedirectRule = {
      ...rule,
      id: `red-${Date.now()}`,
      hitCount: 0,
      createdAt: new Date().toISOString()
    };
    this.redirects.push(newRule);
    this.logActivity('Create Redirect', 'SEO', newRule.id, rule.sourceUrl, `Redirect -> ${rule.destinationUrl}`);
    return newRule;
  }

  public deleteRedirect(id: string): boolean {
    this.redirects = this.redirects.filter(r => r.id !== id);
    return true;
  }

  public getNotFoundLogs(): NotFoundLog[] {
    return [...this.notFoundLogs].sort((a, b) => b.hitCount - a.hitCount);
  }

  public logNotFound(url: string) {
    const existing = this.notFoundLogs.find(l => l.url === url);
    if (existing) {
      existing.hitCount++;
      existing.lastSeenAt = new Date().toISOString();
    } else {
      this.notFoundLogs.push({
        id: `nf-${Date.now()}`,
        url,
        hitCount: 1,
        lastSeenAt: new Date().toISOString()
      });
    }
  }


  private siteChrome: SiteChromeSettings = defaultSiteChromeSettings;

  public getSiteChrome(): SiteChromeSettings {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("fastonmed_site_chrome");
        if (saved) return { ...this.siteChrome, ...JSON.parse(saved) };
      } catch {}
    }
    return { ...this.siteChrome };
  }

  public updateSiteChrome(updates: Partial<SiteChromeSettings>): SiteChromeSettings {
    this.siteChrome = { ...this.siteChrome, ...updates };
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("fastonmed_site_chrome", JSON.stringify(this.siteChrome));
      } catch {}
    }
    this.logActivity("Update Appearance", "Appearance", "chrome", "Header & Footer", "Updated header & footer settings");
    return { ...this.siteChrome };
  }

  // --- Settings & Activity ---
  public getStoreSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateStoreSettings(settings: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...settings };
    this.logActivity('Update Settings', 'Settings', 'store', 'Store Settings', 'Updated global settings');
    return this.settings;
  }

  public getActivityLogs(): AdminActivityLog[] {
    return [...this.activityLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private logActivity(action: string, module: string, itemId: string, itemTitle: string, details: string) {
    this.activityLogs.unshift({
      id: `act-${Date.now()}`,
      userName: 'Saneen (Admin)',
      userRole: 'Super Admin',
      action,
      module,
      itemId,
      itemTitle,
      details,
      timestamp: new Date().toISOString()
    });
    // Keep max 200 activity logs
    if (this.activityLogs.length > 200) {
      this.activityLogs.pop();
    }
  }
}

// Global singleton instance
const globalStore = (global as unknown as { __fastonmed_store?: DataStore }).__fastonmed_store || new DataStore();
if (process.env.NODE_ENV !== 'production') {
  (global as unknown as { __fastonmed_store?: DataStore }).__fastonmed_store = globalStore;
}

export const store = globalStore;