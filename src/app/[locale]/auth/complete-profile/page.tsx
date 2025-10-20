import { notFound } from 'next/navigation';

import { AuthLayout } from '@/components/auth';
import { ProfileCompletionForm } from '@/components/auth/profile-completion-form';
import { isValidLocale, type Locale } from '@/i18n';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompleteProfilePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const validatedLocale = locale as Locale;

  return (
    <AuthLayout locale={validatedLocale}>
      <ProfileCompletionForm locale={validatedLocale} />
    </AuthLayout>
  );
}
