import { LicenseDetails } from '@/components/documentation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';
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
  const dict = await getDictionary(validatedLocale);

  return <LicenseDetails licenseId={id} dict={dict} locale={validatedLocale} />;
}
