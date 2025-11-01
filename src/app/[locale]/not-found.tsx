'use client';

import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale || 'en') as Locale;
  const t = useTranslations();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-muted-foreground text-6xl font-bold">404</h1>
          <h2 className="text-foreground text-2xl font-bold">{t('errors.pageNotFound')}</h2>
          <p className="text-muted-foreground">{t('errors.pageNotFoundDesc')}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className={cn('gap-2')}>
            <Link href={`/${locale}`}>
              <Home className="h-4 w-4" />
              {t('ui.goHome')}
            </Link>
          </Button>

          <Button variant="outline" onClick={() => window.history.back()} className={cn('gap-2')}>
            <ArrowLeft className="h-4 w-4" />
            {t('ui.goBack')}
          </Button>
        </div>
      </div>
    </div>
  );
}
