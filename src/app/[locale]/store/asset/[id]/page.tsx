import { AssetDetails } from '@/components/store';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';
import { notFound } from 'next/navigation';

interface AssetPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { locale, id } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);

  return <AssetDetails assetId={id} dict={dict} locale={validatedLocale} />;
}
