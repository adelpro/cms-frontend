import { AssetDetails } from '@/components/store';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
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

  return <AssetDetails assetId={id} locale={validatedLocale} />;
}
