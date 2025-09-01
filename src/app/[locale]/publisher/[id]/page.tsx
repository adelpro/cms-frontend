import { PublisherProfile } from '@/components/publisher';
import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';
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
  const dict = await getDictionary(validatedLocale);

  return <PublisherProfile publisherId={id} dict={dict} locale={validatedLocale} />;
}
