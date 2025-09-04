import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  // Enable experimental features for better i18n support
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
  },
  
  // Configure redirects to default to Arabic store page
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar/store',
        permanent: false,
      },
      {
        source: '/ar',
        destination: '/ar/store',
        permanent: false,
      },
      {
        source: '/en',
        destination: '/en/store',
        permanent: false,
      },
    ];
  },
  
  // Configure rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/ar/sitemap.xml',
      },
    ];
  },
};

export default withNextIntl(nextConfig);