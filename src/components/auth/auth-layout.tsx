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
          "w-full max-w-md",
          responsive.paddingInlineResponsive
        )}
      >
        <div className={cn(
          "bg-card text-card-foreground rounded-xl border shadow-lg",
          logical.paddingInline('6'),
          "py-8 space-y-6"
        )}>
          {children}
        </div>
      </div>
    </div>
  );
}
