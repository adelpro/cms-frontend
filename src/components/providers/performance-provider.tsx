'use client';

import { useEffect } from 'react';

import { performanceMonitor } from '@/lib/performance';

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Performance monitoring provider
 * Starts performance monitoring when the app loads
 */
export function PerformanceProvider({ children }: PerformanceProviderProps) {
  useEffect(() => {
    // Start performance monitoring
    performanceMonitor.start();

    // Cleanup on unmount
    return () => {
      performanceMonitor.stop();
    };
  }, []);

  return <>{children}</>;
}
