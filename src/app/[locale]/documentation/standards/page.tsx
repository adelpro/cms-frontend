import { notFound } from 'next/navigation';

import { ContentStandards } from '@/components/documentation';
import { isValidLocale, type Locale } from '@/i18n';

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
