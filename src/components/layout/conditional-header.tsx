"use client";

import { usePathname } from 'next/navigation';
import { Header } from './header';
import type { Dictionary, Locale } from '@/lib/i18n/types';

interface ConditionalHeaderProps {
  dict: Dictionary;
  locale: Locale;
}

export function ConditionalHeader({ dict, locale }: ConditionalHeaderProps) {
  const pathname = usePathname();
  
  // Don't render header on the home page or auth pages
  const isHomePage = pathname === `/${locale}`;
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);
  
  if (isHomePage || isAuthPage) {
    return null;
  }
  
  return <Header dict={dict} locale={locale} />;
}
