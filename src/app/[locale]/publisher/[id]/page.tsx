import { PublisherProfile } from '@/components/publisher';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
import { notFound } from 'next/navigation';

interface PublisherPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function PublisherPage({ params }: PublisherPageProps) {
  const { locale, id } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;

  return <PublisherProfile publisherId={id} locale={validatedLocale} />;
}
