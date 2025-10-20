'use client';

import { usePathname } from 'next/navigation';

import type { Locale } from '@/i18n';

import { Header } from './header';

interface ConditionalHeaderProps {
  locale: Locale;
}

export function ConditionalHeader({ locale }: ConditionalHeaderProps) {
  const pathname = usePathname();

  // Don't render header on the home page or auth pages
  const isHomePage = pathname === `/${locale}`;
  const isAuthPage = pathname.startsWith(`/${locale}/auth`);

  if (isHomePage || isAuthPage) {
    return null;
  }

  return <Header locale={locale} />;
}
