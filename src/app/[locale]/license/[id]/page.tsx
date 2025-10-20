import { notFound } from 'next/navigation';

import { LicenseDetails } from '@/components/documentation';
import { isValidLocale, type Locale } from '@/i18n';

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
