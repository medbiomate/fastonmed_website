export type ProductType = 'simple' | 'variable';

export type PurchaseMode = 'cart' | 'quote' | 'enquire' | 'call_price';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'on_backorder';

export interface ProductVariation {
  id: string;
  sku: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  stockStatus: StockStatus;
  attributes: Record<string, string>; // e.g. { "Size": "Large", "Color": "Blue" }
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  productType: ProductType;
  purchaseMode: PurchaseMode;
  regularPrice: number;
  salePrice?: number;
  category: string;
  subCategory?: string;
  brand: string;
  model?: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  galleryImages: string[];
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  warrantyPeriod?: string;
  technicalSpecs: Record<string, string>;
  features: string[];
  applications: string[];
  documents: { title: string; url: string; size?: string }[];
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNew: boolean;
  status: 'published' | 'draft' | 'private';
  variations?: ProductVariation[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  displayOrder: number;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  websiteUrl?: string;
  productCount: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CartItem {
  id: string; // unique item key (productId + variationId)
  productId: string;
  variationId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  selectedAttributes?: Record<string, string>;
  maxStock: number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'stripe' | 'tabby' | 'cod' | 'bank_transfer';
export type PaymentStatus = 'unpaid' | 'authorized' | 'paid' | 'refunded' | 'failed';

export interface Address {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  emirate: string; // Dubai, Abu Dhabi, Sharjah, Ajman, RAK, Fujairah, UAQ
  postalCode?: string;
  country: string;
  phone: string;
  email: string;
}

export interface OrderItem {
  productId: string;
  variationId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. FOM-10824
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number; // UAE 5% VAT
  grandTotal: number;
  currency: 'AED';
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  billingAddress: Address;
  shippingAddress: Address;
  customerNotes?: string;
  adminNotes?: string;
  timeline: {
    status: OrderStatus;
    note: string;
    timestamp: string;
    user?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'blocked';
  savedAddresses: Address[];
  createdAt: string;
}

export interface Enquiry {
  id: string;
  enquiryNumber: string; // ENQ-2026-0012
  type: 'product_quote' | 'contact_form' | 'service_request' | 'whatsapp';
  productId?: string;
  productName?: string;
  customerName: string;
  company?: string;
  email: string;
  phone: string;
  quantity: number;
  message: string;
  sourceUrl?: string;
  status: 'new' | 'in_review' | 'quoted' | 'closed';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxSpend?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  authorRole?: string;
  authorImage?: string;
  reviewer?: string;
  reviewerRole?: string;
  reviewerImage?: string;
  showByline?: boolean;
  showAuthor?: boolean;
  showReviewer?: boolean;
  views?: number;
  status: 'published' | 'draft' | 'scheduled';
  publishedAt: string;
  scheduledAt?: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
}

export interface PageContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: 'published' | 'draft';
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  robotsDirective?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  focusKeyword?: string;
}

export interface RedirectRule {
  id: string;
  sourceUrl: string;
  destinationUrl: string;
  statusCode: 301 | 302;
  isActive: boolean;
  hitCount: number;
  lastHitAt?: string;
  createdAt: string;
}

export interface NotFoundLog {
  id: string;
  url: string;
  hitCount: number;
  lastSeenAt: string;
}

export interface AdminActivityLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  itemId: string;
  itemTitle: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface StoreSettings {
  storeName: string;
  supportPhone: string;
  salesEmail: string;
  whatsappNumber: string;
  currency: string;
  vatRate: number; // 5%
  freeShippingThreshold: number; // e.g. AED 500
  flatShippingRate: number; // AED 25
  address: string;
  announcementText: string;
}


export interface SiteChromeMenuItem {
  label: string;
  url: string;
  depth?: number;
}

export interface SiteChromeSettings {
  headerLayout: string;
  headerLogo: string;
  headerMenu: SiteChromeMenuItem[];
  headerBg: string;
  headerText: string;
  headerAccent: string;
  footerLayout: string;
  footerLogo: string;
  footerEmail: string;
  footerPhone: string;
  footerAddress: string;
  footerExploreTitle: string;
  footerExploreLinks: SiteChromeMenuItem[];
  footerCategoriesTitle: string;
  footerCategoriesLinks: SiteChromeMenuItem[];
  footerCustomerTitle: string;
  footerCustomerLinks: SiteChromeMenuItem[];
  footerCopyright: string;
  footerBg: string;
  footerText: string;
  footerLink: string;
}
