'use client';

import { logical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface AuthLoadingProps {
  message?: string;
}

export function AuthLoading({ message }: AuthLoadingProps) {
  // Fallback message since we can't use useTranslation here (AuthLoading is used in AuthProvider)
  const displayMessage = message || 'Loading...';

  return (
    <div
      className={cn(
        'bg-background flex min-h-screen items-center justify-center',
        logical.paddingInline('4'),
      )}
    >
      <div className="space-y-4 text-center">
        <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground text-sm">{displayMessage}</p>
      </div>
    </div>
  );
}
