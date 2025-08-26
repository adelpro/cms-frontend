import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { layoutPatterns } from "@/lib/logical-utils";
import type { Locale } from "@/middleware";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 container-padding">
      {/* Header with title and language switcher */}
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold text-center">
          {dict.welcome}
        </h1>
        <LanguageSwitcher currentLocale={locale} />
      </div>
      
      {/* Description */}
      <p className="text-lg text-muted-foreground text-center max-w-md leading-relaxed">
        {dict.description}
      </p>
      
      {/* Action buttons - automatically flow with text direction */}
      <div className="flex gap-4">
        <Button variant="default" className="min-w-[120px]">
          {dict.getStarted}
        </Button>
        <Button variant="outline" className="min-w-[120px]">
          {dict.learnMore}
        </Button>
      </div>
      
      {/* Demo section to showcase automatic RTL layout */}
      <div className="mt-12 ps-6 pe-6 pt-6 pb-6 border rounded-lg max-w-2xl w-full">
        <h2 className="text-xl font-semibold mb-4 text-start">
          {locale === 'ar' ? 'مثال على التخطيط الذكي' : 'Smart Layout Example'}
        </h2>
        
        {/* This layout automatically adapts to RTL/LTR */}
        <div className={layoutPatterns.spaceBetween + " ps-4 pe-4 pt-4 pb-4 bg-muted rounded-md"}>
          <span className="font-medium">
            {locale === 'ar' ? 'النص الرئيسي' : 'Main Text'}
          </span>
          <Button variant="secondary" size="sm">
            {dict.edit}
          </Button>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground text-start">
          {locale === 'ar' 
            ? 'هذا المثال يستخدم الخصائص المنطقية في CSS للتكيف التلقائي مع اتجاه النص'
            : 'This example uses CSS logical properties to automatically adapt to text direction'
          }
        </div>
        
        {/* Additional demo: Icon positioning */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-primary rounded-full icon-start"></div>
            <span className="text-start">
              {locale === 'ar' ? 'أيقونة في البداية' : 'Icon at start'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-start">
              {locale === 'ar' ? 'أيقونة في النهاية' : 'Icon at end'}
            </span>
            <div className="w-4 h-4 bg-secondary rounded-full icon-end"></div>
          </div>
        </div>
      </div>
      
      {/* Original test button */}
      <Button variant="destructive" size="icon" className="mt-8">
        ×
      </Button>
    </div>
  );
}
