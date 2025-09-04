import { notFound } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';

interface SignupPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SignupPage({ params }: SignupPageProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;

  return (
    <AuthLayout locale={validatedLocale}>
      <SignupForm locale={validatedLocale} />
    </AuthLayout>
  );
}

export async function generateMetadata({ params }: SignupPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }
  
  const validatedLocale = locale as Locale;

  return {
    title: 'Sign Up - Itqan CMS',
    description: 'Create your account in Itqan',
  };
}
