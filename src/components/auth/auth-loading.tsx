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
        'min-h-screen bg-background flex items-center justify-center',
        logical.paddingInline('4')
      )}
    >
      <div className='text-center space-y-4'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto' />
        <p className='text-muted-foreground text-sm'>{displayMessage}</p>
      </div>
    </div>
  );
}
