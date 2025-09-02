"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { getOppositeLocale, localeNames } from "@/lib/i18n/utils";
import type { Locale } from "@/lib/i18n/types";

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
    return localeNames[locale];
  };

  const otherLocale = getOppositeLocale(currentLocale);

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={() => switchLanguage(otherLocale)}
      className="relative shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06)]"
      title={`Switch to ${getLanguageLabel(otherLocale)}`}
      aria-label={`Switch to ${getLanguageLabel(otherLocale)}`}
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">
        Switch to {getLanguageLabel(otherLocale)}
      </span>
    </Button>
  );
}
