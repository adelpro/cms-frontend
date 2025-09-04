import { AssetStore } from '@/components/store';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
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

  return <AssetStore locale={validatedLocale} />;
}
