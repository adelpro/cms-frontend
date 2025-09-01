import { ContentStandards } from '@/components/documentation';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';
import { notFound } from 'next/navigation';

interface ContentStandardsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContentStandardsPage({ params }: ContentStandardsPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);

  return <ContentStandards dict={dict} locale={validatedLocale} />;
}
