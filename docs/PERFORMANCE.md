# Performance Guide

**Version**: 1.0  
**Last Updated**: October 20, 2025  
**Project**: Itqan CMS (Next.js 15 + TypeScript + ShadCN)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Image Optimization](#image-optimization)
3. [Code Splitting & Lazy Loading](#code-splitting--lazy-loading)
4. [Bundle Analysis](#bundle-analysis)
5. [Performance Monitoring](#performance-monitoring)
6. [Optimization Best Practices](#optimization-best-practices)
7. [Performance Metrics](#performance-metrics)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This document outlines the performance optimization strategies implemented in the Itqan CMS project. The goal is to ensure fast loading times, smooth user interactions, and optimal resource utilization.

### Key Performance Features

- ✅ **Next.js Image Optimization** - Automatic image optimization and lazy loading
- ✅ **Code Splitting** - Dynamic imports for heavy components
- ✅ **Bundle Analysis** - Tools to analyze and optimize bundle size
- ✅ **Performance Monitoring** - Real-time performance tracking
- ✅ **Web Vitals** - Core Web Vitals monitoring and reporting
- ✅ **Resource Preloading** - Critical resource preloading strategies

---

## Image Optimization

### Next.js Image Component

The project uses Next.js Image component for automatic optimization:

```typescript
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="Itqan CMS"
  width={120}
  height={40}
  className="w-auto"
  priority // For above-the-fold images
/>
```

### Optimized Image Component

A custom `OptimizedImage` component provides additional features:

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage
  src={asset.thumbnailUrl}
  alt={asset.title}
  width={300}
  height={200}
  quality={75}
  placeholder="blur"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Features

- **Automatic Blur Placeholder** - Shows blur effect while loading
- **Error Handling** - Fallback UI for failed image loads
- **Loading States** - Skeleton loading animation
- **Responsive Sizing** - Automatic responsive image sizing
- **Quality Optimization** - Configurable image quality

### Image Configuration

```typescript
// next.config.ts
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
  ],
},
```

### Best Practices

1. **Use Next.js Image Component**

   ```typescript
   // ✅ Good
   <Image src="/logo.svg" alt="Logo" width={120} height={40} />

   // ❌ Bad
   <img src="/logo.svg" alt="Logo" />
   ```

2. **Set Appropriate Sizes**

   ```typescript
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   />
   ```

3. **Use Priority for Above-the-Fold Images**

   ```typescript
   <Image
     src="/hero.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority // Loads immediately
   />
   ```

4. **Optimize Image Quality**
   ```typescript
   <Image
     src="/photo.jpg"
     alt="Photo"
     width={800}
     height={600}
     quality={75} // Good balance of quality and size
   />
   ```

---

## Code Splitting & Lazy Loading

### Dynamic Imports

The project uses dynamic imports for heavy components:

```typescript
import { createDynamicImport } from '@/lib/dynamic-imports';

// Heavy components that should be lazy loaded
export const AssetDetails = createDynamicImport(() => import('@/components/store/asset-details'), {
  ssr: false,
});

export const AccessRequestForm = createDynamicImport(
  () => import('@/components/store/access-request-form'),
  { ssr: false }
);
```

### Usage in Components

```typescript
import { AssetDetails } from '@/lib/dynamic-imports';

function StorePage() {
  return (
    <div>
      <h1>Asset Store</h1>
      <AssetDetails assetId="123" />
    </div>
  );
}
```

### Pre-configured Dynamic Imports

The following components are pre-configured for lazy loading:

- `AccessRequestForm` - Form for requesting asset access
- `AssetDetails` - Detailed asset view
- `AssetStore` - Main asset store component
- `PublisherProfile` - Publisher profile page
- `LicenseDetails` - License information
- `ContentStandards` - Content standards documentation
- `Carousel` - Image carousel component
- `Dialog` - Modal dialog component

### Conditional Loading

```typescript
import { createConditionalImport } from '@/lib/dynamic-imports';

const ConditionalComponent = createConditionalImport(
  () => window.innerWidth > 768, // Only load on desktop
  () => import('@/components/DesktopOnlyComponent'),
  () => import('@/components/MobileComponent')
);
```

### Preloading Critical Components

```typescript
import { preloadComponent } from '@/lib/dynamic-imports';

// Preload on user interaction
function handleHover() {
  preloadComponent(() => import('@/components/HeavyComponent'));
}
```

---

## Bundle Analysis

### Bundle Analyzer Setup

The project includes Next.js Bundle Analyzer for analyzing bundle size:

```bash
# Analyze bundle size
npm run analyze

# Analyze server bundle
npm run analyze:server

# Analyze browser bundle
npm run analyze:browser
```

### Configuration

```typescript
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(withNextIntl(nextConfig));
```

### Bundle Optimization Strategies

1. **Tree Shaking**

   ```typescript
   // ✅ Good - Import only what you need
   import { debounce } from 'lodash/debounce';

   // ❌ Bad - Imports entire library
   import _ from 'lodash';
   ```

2. **Dynamic Imports for Heavy Libraries**

   ```typescript
   // ✅ Good - Load only when needed
   const HeavyLibrary = dynamic(() => import('heavy-library'));

   // ❌ Bad - Loads on every page
   import HeavyLibrary from 'heavy-library';
   ```

3. **Optimize Package Imports**
   ```typescript
   // next.config.ts
   experimental: {
     optimizePackageImports: ['lucide-react', 'date-fns'],
   }
   ```

### Bundle Size Targets

- **Initial Bundle**: < 250KB gzipped
- **Route Chunks**: < 100KB gzipped
- **Vendor Chunks**: < 500KB gzipped
- **Total Bundle**: < 1MB gzipped

---

## Performance Monitoring

### Web Vitals Monitoring

The project monitors Core Web Vitals:

```typescript
// src/lib/performance.ts
export function reportWebVitals(metric: WebVitalsMetric) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to Google Analytics, Vercel Analytics, etc.
  }
}
```

### Performance Observer

```typescript
import { performanceMonitor } from '@/lib/performance';

// Start monitoring
performanceMonitor.start();

// Measure custom metrics
const endMeasure = performanceMonitor.measure('component-render');
// ... component logic
endMeasure();
```

### Custom Metrics

```typescript
// Measure component render time
const endRender = measureComponentRender('AssetCard');
// ... render logic
endRender();

// Measure API response time
const measureApi = measureApiCall('/api/assets');
fetch('/api/assets').then(measureApi);
```

### Memory Monitoring

```typescript
import { getMemoryUsage } from '@/lib/performance';

const memory = getMemoryUsage();
if (memory) {
  console.log('Memory usage:', {
    used: `${(memory.used / 1024 / 1024).toFixed(2)}MB`,
    total: `${(memory.total / 1024 / 1024).toFixed(2)}MB`,
    limit: `${(memory.limit / 1024 / 1024).toFixed(2)}MB`,
  });
}
```

---

## Optimization Best Practices

### 1. Image Optimization

- Use Next.js Image component
- Set appropriate sizes and quality
- Use blur placeholders
- Implement lazy loading
- Optimize image formats (WebP, AVIF)

### 2. Code Splitting

- Lazy load heavy components
- Split vendor bundles
- Use dynamic imports for routes
- Preload critical components

### 3. Bundle Optimization

- Enable tree shaking
- Use optimized package imports
- Minimize dependencies
- Analyze bundle size regularly

### 4. Caching Strategies

- Use Next.js built-in caching
- Implement service worker caching
- Cache API responses
- Use CDN for static assets

### 5. Performance Monitoring

- Monitor Core Web Vitals
- Track custom metrics
- Set up performance budgets
- Regular performance audits

---

## Performance Metrics

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Additional Metrics

- **First Contentful Paint (FCP)**: < 1.8s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms

### Performance Budget

- **JavaScript**: < 250KB initial, < 100KB per route
- **CSS**: < 50KB initial
- **Images**: < 500KB total per page
- **Fonts**: < 100KB total

---

## Performance Tools

### Development Tools

```bash
# Bundle analysis
npm run analyze

# Performance monitoring
npm run dev # Includes performance monitoring

# Lighthouse audit
npx lighthouse http://localhost:3000
```

### Production Monitoring

- **Vercel Analytics** - Built-in performance monitoring
- **Google Analytics** - Web Vitals reporting
- **Sentry** - Error tracking and performance
- **New Relic** - Application performance monitoring

### Testing Tools

- **Lighthouse** - Performance auditing
- **WebPageTest** - Detailed performance analysis
- **Chrome DevTools** - Performance profiling
- **Bundle Analyzer** - Bundle size analysis

---

## Troubleshooting

### Common Performance Issues

#### 1. Large Bundle Size

**Problem**: Bundle size exceeds targets

**Solutions**:

- Use dynamic imports for heavy components
- Enable tree shaking
- Remove unused dependencies
- Optimize package imports

#### 2. Slow Image Loading

**Problem**: Images take too long to load

**Solutions**:

- Use Next.js Image component
- Implement lazy loading
- Optimize image formats
- Use appropriate sizes

#### 3. Poor Core Web Vitals

**Problem**: Web Vitals scores are low

**Solutions**:

- Optimize LCP (largest contentful paint)
- Reduce CLS (cumulative layout shift)
- Improve FID (first input delay)
- Use performance monitoring

#### 4. Memory Leaks

**Problem**: Memory usage increases over time

**Solutions**:

- Clean up event listeners
- Remove unused references
- Use React.memo for expensive components
- Monitor memory usage

### Performance Debugging

```typescript
// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  performanceMonitor.start();
}

// Measure specific operations
const measure = performanceMonitor.measure('api-call');
// ... API call
measure();
```

### Performance Checklist

- [ ] Images use Next.js Image component
- [ ] Heavy components are lazy loaded
- [ ] Bundle size is within targets
- [ ] Core Web Vitals are monitored
- [ ] Performance budgets are enforced
- [ ] Caching strategies are implemented
- [ ] Error boundaries are in place
- [ ] Memory leaks are prevented

---

## Performance Monitoring Setup

### 1. Enable Performance Provider

```typescript
// src/app/[locale]/layout.tsx
import { PerformanceProvider } from '@/components/providers/performance-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <PerformanceProvider>
          {children}
        </PerformanceProvider>
      </body>
    </html>
  );
}
```

### 2. Configure Web Vitals

```typescript
// src/app/[locale]/layout.tsx
import { reportWebVitals } from '@/lib/performance';

// Report Web Vitals
if (typeof window !== 'undefined') {
  reportWebVitals(console.log);
}
```

### 3. Set Up Analytics

```typescript
// src/lib/analytics.ts
export function trackPerformance(metric: WebVitalsMetric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
  });
}
```

---

## Performance Optimization Examples

### 1. Optimized Component

```typescript
import { memo, lazy, Suspense } from 'react';
import { OptimizedImage } from '@/components/ui/optimized-image';

// Lazy load heavy component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Memoize expensive component
const AssetCard = memo(({ asset }: { asset: Asset }) => {
  return (
    <div className="asset-card">
      <OptimizedImage
        src={asset.thumbnailUrl}
        alt={asset.title}
        width={300}
        height={200}
        quality={75}
      />
      <h3>{asset.title}</h3>
    </div>
  );
});

// Use with Suspense
function AssetList() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Optimized API Call

```typescript
import { measureApiCall } from '@/lib/performance';

export async function fetchAssets() {
  const measure = measureApiCall('/api/assets');

  const response = await fetch('/api/assets');
  measure(response);

  return response.json();
}
```

### 3. Optimized Image Gallery

```typescript
import { OptimizedImage } from '@/components/ui/optimized-image';
import { createIntersectionObserver } from '@/lib/performance';

function ImageGallery({ images }: { images: string[] }) {
  const observer = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Load image when visible
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
      }
    });
  });

  return (
    <div className="image-gallery">
      {images.map((src, index) => (
        <OptimizedImage
          key={index}
          src={src}
          alt={`Gallery image ${index + 1}`}
          width={400}
          height={300}
          quality={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ))}
    </div>
  );
}
```

---

## Conclusion

Performance optimization is an ongoing process that requires:

1. **Regular Monitoring** - Track performance metrics continuously
2. **Proactive Optimization** - Optimize before issues arise
3. **User-Centric Approach** - Focus on user experience metrics
4. **Continuous Improvement** - Regular performance audits and updates

By following the strategies outlined in this guide, the Itqan CMS project maintains excellent performance while providing a rich user experience.

---

**Document Version**: 1.0  
**Last Updated**: October 20, 2025  
**Authors**: Itqan Development Team  
**Status**: Active - Implemented

---

_This document is part of the refactoring plan and should be updated as new performance optimizations are implemented._
