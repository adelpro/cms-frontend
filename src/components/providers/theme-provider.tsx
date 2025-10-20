'use client';

import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes';
import * as React from 'react';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      // Enhanced default props for better UX
      attribute='class'
      defaultTheme='light'
      enableSystem={true}
      disableTransitionOnChange={false}
      storageKey='itqan-theme'
    >
      {children}
    </NextThemesProvider>
  );
}
