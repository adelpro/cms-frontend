"use client";

import { createContext, useContext, ReactNode } from "react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/middleware";

interface LocaleContextType {
  locale: Locale;
  dict: Dictionary;
  isRTL: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
  locale: Locale;
  dict: Dictionary;
}

export function LocaleProvider({ children, locale, dict }: LocaleProviderProps) {
  const isRTL = locale === 'ar';

  return (
    <LocaleContext.Provider value={{ locale, dict, isRTL }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

// Utility hook for common translation patterns
export function useTranslation() {
  const { dict } = useLocale();
  
  const t = (key: keyof Dictionary) => dict[key];
  
  return { t, dict };
}
