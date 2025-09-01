import { AssetStore } from '@/components/store';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';
import { notFound } from 'next/navigation';

interface StorePageProps {
  params: Promise<{ locale: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);

  return <AssetStore dict={dict} locale={validatedLocale} />;
}
