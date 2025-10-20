/**
 * Performance monitoring and optimization utilities
 */

// Web Vitals types
interface WebVitalsMetric {
  name: string;
  value: number;
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
}

/**
 * Web Vitals monitoring
 */
export function reportWebVitals(metric: WebVitalsMetric) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
  }

  // Send to analytics service in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics, Vercel Analytics, etc.
    // gtag('event', metric.name, {
    //   value: Math.round(metric.value),
    //   event_category: 'Web Vitals',
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
}

/**
 * Performance observer for custom metrics
 */
export class PerformanceMonitor {
  private observer: PerformanceObserver | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          this.handleEntry(entry);
        }
      });
    }
  }

  start() {
    if (this.observer) {
      try {
        this.observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      } catch (error) {
        console.warn('Performance monitoring not supported:', error);
      }
    }
  }

  stop() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private handleEntry(entry: PerformanceEntry) {
    // Log performance entries in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Entry:', entry);
    }

    // Track specific metrics
    switch (entry.name) {
      case 'first-contentful-paint':
      case 'largest-contentful-paint':
      case 'first-input-delay':
      case 'cumulative-layout-shift':
        reportWebVitals({
          name: entry.name,
          value: entry.duration,
          delta: entry.duration,
          id: entry.name,
          navigationType: 'navigate',
        });
        break;
    }
  }

  /**
   * Measure custom performance metrics
   */
  measure(name: string, startMark?: string, endMark?: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      try {
        if (startMark && endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.mark(`${name}-start`);
          return () => {
            performance.mark(`${name}-end`);
            performance.measure(name, `${name}-start`, `${name}-end`);
          };
        }
      } catch (error) {
        console.warn('Performance measurement failed:', error);
      }
    }
    return () => {};
  }
}

/**
 * Image loading performance
 */
export function measureImageLoad(src: string): Promise<number> {
  return new Promise(resolve => {
    const startTime = performance.now();
    const img = new Image();

    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };

    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };

    img.src = src;
  });
}

/**
 * Component render performance
 */
export function measureComponentRender(componentName: string) {
  const startTime = performance.now();

  return () => {
    const renderTime = performance.now() - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time:`, `${renderTime.toFixed(2)}ms`);
    }

    // Track slow renders
    if (renderTime > 16) {
      // More than one frame at 60fps
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  };
}

/**
 * API response time monitoring
 */
export function measureApiCall(endpoint: string) {
  const startTime = performance.now();

  return (response: Response) => {
    const responseTime = performance.now() - startTime;

    if (process.env.NODE_ENV === 'development') {
      console.log(`API ${endpoint} response time:`, `${responseTime.toFixed(2)}ms`);
    }

    // Track slow API calls
    if (responseTime > 1000) {
      // More than 1 second
      console.warn(`Slow API call detected: ${endpoint} took ${responseTime.toFixed(2)}ms`);
    }

    return response;
  };
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage() {
  if (typeof window !== 'undefined' && 'memory' in performance) {
    const memory = (
      performance as {
        memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number };
      }
    ).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
      limit: memory.jsHeapSizeLimit,
    };
  }
  return null;
}

/**
 * Network information
 */
export function getNetworkInfo() {
  if (typeof window !== 'undefined' && 'connection' in navigator) {
    const connection = (
      navigator as {
        connection: { effectiveType: string; downlink: number; rtt: number; saveData: boolean };
      }
    ).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
}

/**
 * Performance optimization utilities
 */

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    return new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });
  }
  return null;
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }
}

/**
 * Prefetch resources for better performance
 */
export function prefetchResource(href: string) {
  if (typeof document !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();
