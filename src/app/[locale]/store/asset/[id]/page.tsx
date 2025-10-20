import { notFound } from 'next/navigation';

import { AssetDetails } from '@/components/store';
import { isValidLocale, type Locale } from '@/i18n';

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
