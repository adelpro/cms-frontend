import { getDictionary } from '@/lib/i18n/dictionaries';
import { isValidLocale } from '@/lib/i18n/utils';
import { notFound } from 'next/navigation';
import { AuthLayout } from '@/components/auth';
import { ProfileCompletionForm } from '@/components/auth/profile-completion-form';
import type { Locale } from '@/lib/i18n/types';

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CompleteProfilePage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { skippable } = await searchParams;
  
  if (!isValidLocale(locale)) {
    notFound();
  }

  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);
  const isSkippable = skippable === 'true';

  return (
    <AuthLayout locale={validatedLocale}>
      <ProfileCompletionForm 
        dict={dict} 
        locale={validatedLocale}
        isSkippable={isSkippable}
      />
    </AuthLayout>
  );
}