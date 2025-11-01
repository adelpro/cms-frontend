'use client';

import type { Locale } from '@/i18n';
import { direction, logical, responsive } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { LanguageSwitcher } from '../language-switcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  locale: Locale;
  className?: string;
}

export function AuthLayout({ children, locale, className }: AuthLayoutProps) {
  const t = useTranslations();

  return (
    <div
      className={cn('flex min-h-screen flex-col bg-[#F8F8F8]', className)}
      dir={direction.getDir(locale)}
    >
      {/* Dark grey top bar */}
      <div className="flex h-16 items-center justify-between px-4">
        <LanguageSwitcher currentLocale={locale} />
        <Button
          variant="ghost"
          size="lg"
          className="h-10 border-[1.25px] border-[#0A0A0A] px-4"
          asChild
        >
          <Link href={`/${locale}`}>
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {t('auth.returnToWebsite')}
            </span>
          </Link>
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 items-center justify-center">
        <div
          className={cn(
            'w-full max-w-md',
            logical.paddingInline('4'),
            responsive.paddingInlineResponsive,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
