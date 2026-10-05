/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Keep native worker pools small on shared hosting.
  experimental: { cpus: 2, imgOptConcurrency: 1 },
  images: {
    // Product images should open in the browser, not download on navigation.
    contentDispositionType: 'inline',
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' }
    ]
  },
  async redirects() {
    return [
      { source: '/equipment-for/:slug', destination: '/facilities/:slug', permanent: true },
      { source: '/ar/equipment-for/:slug', destination: '/ar/facilities/:slug', permanent: true },
      { source: '/home', destination: '/', permanent: true },
      { source: '/compare-2', destination: '/compare', permanent: true },
      { source: '/wishlist-2', destination: '/wishlist', permanent: true },
      { source: '/shop-2', destination: '/shop', permanent: true },
      { source: '/cart-2', destination: '/cart', permanent: true },
      { source: '/checkout-2', destination: '/checkout', permanent: true },
      { source: '/my-account-2', destination: '/my-account', permanent: true },
      { source: '/refund_returns-2', destination: '/returns-exchanges', permanent: true },
      { source: '/privacy-policy-2', destination: '/privacy-policy', permanent: true }
    ];
  }
};

module.exports = nextConfig;
