'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const params = useParams();
  const locale = (params?.locale || 'en') as Locale;
  const t = useTranslations();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="text-destructive h-16 w-16" />
        </div>

        <div className="space-y-2">
          <h1 className="text-foreground text-2xl font-bold">{t('errors.somethingWentWrong')}</h1>
          <p className="text-muted-foreground">{t('errors.errorDescription')}</p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted rounded-lg p-4 text-start">
            <p className="text-muted-foreground font-mono text-sm break-all">{error.message}</p>
            {error.digest && (
              <p className="text-muted-foreground mt-2 text-xs">
                {t('errors.errorId')} {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button onClick={reset} className={cn('gap-2')}>
            <RefreshCw className="h-4 w-4" />
            {t('ui.tryAgain')}
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              window.location.href = `/${locale}`;
            }}
          >
            {t('ui.goHome')}
          </Button>
        </div>
      </div>
    </div>
  );
}
