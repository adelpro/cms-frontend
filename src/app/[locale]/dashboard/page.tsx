import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

interface DashboardPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;

  return <DashboardContent locale={validatedLocale} />;
}

export async function generateMetadata({ params }: DashboardPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }
  
  const validatedLocale = locale as Locale;

  return {
    title: validatedLocale === 'ar' ? 'لوحة التحكم - منصة المطورين' : 'Dashboard - Developer Platform',
    description: 'Developer dashboard for managing projects and resources',
  };
}
