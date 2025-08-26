"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { locales, type Locale } from "@/middleware";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
  };

  const getLanguageLabel = (locale: Locale) => {
    return locale === 'ar' ? 'عربي' : 'English';
  };

  const otherLocale = currentLocale === 'ar' ? 'en' : 'ar';

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => switchLanguage(otherLocale)}
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm">
        {getLanguageLabel(otherLocale)}
      </span>
    </Button>
  );
}
