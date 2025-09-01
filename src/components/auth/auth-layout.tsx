import type { Locale } from '@/lib/i18n/types';
import { direction, logical, responsive } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface AuthLayoutProps {
  children: React.ReactNode;
  locale: Locale;
  className?: string;
}

export function AuthLayout({ children, locale, className }: AuthLayoutProps) {

  return (
    <div 
      className={cn(
        "min-h-screen bg-background flex items-center justify-center",
        logical.paddingInline('4'),
        className
      )}
      dir={direction.getDir(locale)}
    >
      <div 
        className={cn(
          "w-full max-w-2xl lg:max-w-3xl",
          responsive.paddingInlineResponsive
        )}
      >
        <div className={cn(
          "bg-card text-card-foreground rounded-xl border shadow-lg",
          "px-4 sm:px-6 md:px-8 lg:px-12",
          "py-6 sm:py-8 lg:py-12 space-y-6"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}
