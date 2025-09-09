import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { typography, spacing } from "@/lib/styles/logical";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  
  // Validate and cast locale
  const validatedLocale = locale as Locale;
  const t = await getTranslations();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 container-padding">
      {/* Header with title and controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <h1 className="text-4xl font-bold text-center">
          {t('common.welcome')}
        </h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher currentLocale={validatedLocale} />
          <ThemeToggle />
        </div>
      </div>
      
      {/* Description */}
      <p className={cn(typography.paragraph, "text-lg text-muted-foreground text-center max-w-md")}>
        {t('common.description')}
      </p>
      
      {/* Action buttons - automatically flow with text direction */}
      <div className={cn("flex", spacing.gapMd)}>
        <Button variant="default" className="min-w-[120px]">
          {t('common.getStarted')}
        </Button>
        <Button variant="outline" className="min-w-[120px]">
          {t('common.learnMore')}
        </Button>
      </div>

      {/* Main Navigation */}
      <div className="mt-8 p-6 border rounded-lg bg-card">
        <h3 className="text-lg font-semibold mb-4 text-center">
          {validatedLocale === 'ar' ? 'استكشف المحتوى' : 'Explore Content'}
        </h3>
        <div className={cn("flex flex-wrap justify-center", spacing.gapMd)}>
          <Button asChild variant="default">
            <Link href={`/${validatedLocale}/store`}>
              {validatedLocale === 'ar' ? 'متجر المحتوى' : 'Content Store'}
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/${validatedLocale}/documentation/standards`}>
              {validatedLocale === 'ar' ? 'معايير المحتوى' : 'Content Standards'}
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Dashboard link */}
      <Button variant="outline" className="mt-8" asChild>
        <Link href={`/${validatedLocale}/dashboard`}>
          {validatedLocale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}
        </Link>
      </Button>
    </div>
  );
}
