import { notFound } from 'next/navigation';
import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { isValidLocale } from '@/i18n';
import type { Locale } from '@/i18n';

interface LoginPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  
  // Validate locale
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  const validatedLocale = locale as Locale;

  return (
    <AuthLayout locale={validatedLocale}>
      <LoginForm locale={validatedLocale} />
    </AuthLayout>
  );
}

export async function generateMetadata({ params }: LoginPageProps) {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return {};
  }
  
  const validatedLocale = locale as Locale;

  return {
    title: 'Login - Itqan CMS',
    description: 'Log in to your account in Itqan',
  };
}
