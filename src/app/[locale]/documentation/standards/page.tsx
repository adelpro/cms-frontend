import { ContentStandards } from '@/components/documentation';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
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

  return <ContentStandards locale={validatedLocale} />;
}
