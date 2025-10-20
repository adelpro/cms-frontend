import { notFound } from 'next/navigation';

import { AssetStore } from '@/components/store';
import { isValidLocale, type Locale } from '@/i18n';

interface StorePageProps {
  params: Promise<{ locale: string }>;
}

export default async function StorePage({ params }: StorePageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const validatedLocale = locale as Locale;

  return <AssetStore locale={validatedLocale} />;
}
