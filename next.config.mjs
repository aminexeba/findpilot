/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Index routes
      { source: '/about', destination: '/index/about' },
      { source: '/brokerage', destination: '/index/brokerage' },
      { source: '/contact', destination: '/index/contact' },
      { source: '/pricing', destination: '/index/pricing' },
      { source: '/privacy', destination: '/index/privacy' },
      { source: '/services', destination: '/index/services' },

      // Navpages routes
      { source: '/article', destination: '/navpages/article' },
      { source: '/article/:splat*', destination: '/navpages/article/:splat*' },
      { source: '/finance', destination: '/navpages/finance' },
      { source: '/hotel', destination: '/navpages/hotel' },
      { source: '/insurance', destination: '/navpages/insurance' },
      { source: '/job', destination: '/navpages/job' },
      { source: '/product', destination: '/navpages/product' },
      { source: '/service', destination: '/navpages/service' },

      // Sitemaps
      { source: '/sitemap-static.xml', destination: '/sitemap-static' },
      { source: '/sitemap-dynamic.xml', destination: '/sitemap-dynamic' },
      { source: '/sitemap.xml', destination: '/sitemap-dynamic' },
    ];
  },
};

export default nextConfig;