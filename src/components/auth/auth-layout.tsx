import type { Locale } from '@/lib/i18n/types';
import { direction, logical, responsive } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/i18n/dictionaries';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { LanguageSwitcher } from '../language-switcher';

interface AuthLayoutProps {
  children: React.ReactNode;
  locale: Locale;
  className?: string;
}

export async function AuthLayout({ children, locale, className }: AuthLayoutProps) {
  const dict = await getDictionary(locale);

  return (
    <div 
      className={cn(
        "min-h-screen bg-[#F8F8F8] flex flex-col",
        className
      )}
      dir={direction.getDir(locale)}
    >
      {/* Dark grey top bar */}
      <div className="h-16 flex items-center justify-between px-4">
        <LanguageSwitcher currentLocale={locale} />
        <Button
          variant="ghost"
          size="lg"
          className="h-10 px-4  border-[#0A0A0A] border-[1.25px]"
          asChild
        >
          <Link href={`/${locale}`}>
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              {dict.auth.returnToWebsite}
            </span>
          </Link>
        </Button>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          className={cn(
            "w-full max-w-md",
            logical.paddingInline('4'),
            responsive.paddingInlineResponsive
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
