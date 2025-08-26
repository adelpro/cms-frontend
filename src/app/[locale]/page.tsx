import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { LanguageSwitcher } from "@/components/language-switcher";
import { rtlClass } from "@/lib/rtl-utils";
import type { Locale } from "@/middleware";

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Header with title and language switcher */}
      <div className={rtlClass(
        "flex items-center gap-4", 
        "flex items-center gap-4 flex-row-reverse", 
        isRTL
      )}>
        <h1 className="text-4xl font-bold text-center">
          {dict.welcome}
        </h1>
        <LanguageSwitcher currentLocale={locale} />
      </div>
      
      {/* Description */}
      <p className="text-lg text-muted-foreground text-center max-w-md leading-relaxed">
        {dict.description}
      </p>
      
      {/* Action buttons */}
      <div className={rtlClass(
        "flex gap-4", 
        "flex gap-4 flex-row-reverse", 
        isRTL
      )}>
        <Button variant="default" className="min-w-[120px]">
          {dict.getStarted}
        </Button>
        <Button variant="outline" className="min-w-[120px]">
          {dict.learnMore}
        </Button>
      </div>
      
      {/* Demo section to showcase RTL layout */}
      <div className="mt-12 p-6 border rounded-lg max-w-2xl w-full">
        <h2 className={rtlClass(
          "text-xl font-semibold mb-4 text-left",
          "text-xl font-semibold mb-4 text-right",
          isRTL
        )}>
          {locale === 'ar' ? 'مثال على التخطيط' : 'Layout Example'}
        </h2>
        
        <div className={rtlClass(
          "flex justify-between items-center p-4 bg-muted rounded-md",
          "flex justify-between items-center p-4 bg-muted rounded-md flex-row-reverse",
          isRTL
        )}>
          <span className="font-medium">
            {locale === 'ar' ? 'النص الرئيسي' : 'Main Text'}
          </span>
          <Button variant="secondary" size="sm">
            {dict.edit}
          </Button>
        </div>
        
        <div className={rtlClass(
          "mt-4 text-sm text-muted-foreground text-left",
          "mt-4 text-sm text-muted-foreground text-right",
          isRTL
        )}>
          {locale === 'ar' 
            ? 'هذا مثال يوضح كيفية تكيف التخطيط مع اللغة العربية وتخطيط RTL'
            : 'This example shows how the layout adapts to Arabic language and RTL direction'
          }
        </div>
      </div>
      
      {/* Original test button */}
      <Button variant="destructive" size="icon" className="mt-8">
        ×
      </Button>
    </div>
  );
}
