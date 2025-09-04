import { LicenseDetails } from '@/components/documentation';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
import { notFound } from 'next/navigation';

interface LicensePageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function LicensePage({ params }: LicensePageProps) {
  const { locale, id } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;

  return <LicenseDetails licenseId={id} locale={validatedLocale} />;
}
