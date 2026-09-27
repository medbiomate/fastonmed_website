# FastonMed Website & Healthcare E-Commerce Platform

The official modern web portal for **FastonMed (FASTONMED TRADING L.L.C)** (Dubai, UAE). Built with Next.js 15, React 19, TypeScript, and custom styling.

## Features

- **Full E-Commerce Catalog & Shop**: Fast multi-category search, filtering, brand filtering, responsive product cards, and quotation/cart requests for 3,100+ medical devices.
- **Admin Control Panel (`/admin`)**:
  - Protected by session middleware and authentication.
  - Role-based permissions (Super Admin, Administrator, Shop Manager, Editor, Staff).
  - WooCommerce-style product management with real-time status filtering (All, Published, Draft, Trash).
  - High-performance multi-layer product cache (in-memory + disk cache fallback).
  - WordPress-style 3-column inline **Quick Edit** drawer for instant modifications (Title, Slug, Date, Author, Categories checkbox tree, Tags, Comments/Pings, and Status).
  - Blog post editor, SEO metadata management, and category taxonomy.
- **RFQ & Direct Enquiry Integration**: Seamless quote submission, WhatsApp ordering integration, and direct CRM sync.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailored CSS / CSS Modules
- **Icons**: Lucide React
- **Data & Caching**: Multi-tiered in-memory and local disk JSON cache with background CRM revalidation

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file:
```env
PORT=3002
CRM_BACKEND_URL=http://localhost:3000
FAST_API_URL=http://localhost:4000
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3002](http://localhost:3002) in your browser.

### 4. Admin Access
Navigate to [http://localhost:3002/admin](http://localhost:3002/admin).
Pre-configured accounts:
- `fuhad@fastonmed.com` (Super Admin)
- `hashim@fastonmed.com` (Administrator)
- `riyas@fastonmed.com` (Shop Manager)
- `admin@fastonmed.com` (Administrator)