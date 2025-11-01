import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const isProduction = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: !isProduction,
  productionBrowserSourceMaps: isProduction,

  compiler: {
    removeConsole: isProduction && { exclude: ['error'] },
  },
  // Enable experimental features for better i18n support
  experimental: {
    // cacheComponents: true,
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
    inlineCss: true,
    webVitalsAttribution: ['CLS', 'LCP'],
    reactCompiler: true,
    esmExternals: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.cms.itqan.dev',
      },
      {
        protocol: 'https',
        hostname: 'staging.api.cms.itqan.dev',
      },
      {
        protocol: 'https',
        hostname: 'develop.api.cms.itqan.dev',
      },
    ],
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
