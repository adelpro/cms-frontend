import { AuthLayout } from '@/components/auth/auth-layout';
import { LoginForm } from '@/components/auth/login-form';
import { validateAndGetLocale, validateLocaleForMetadata } from '@/lib/locale-utils';
import type { PageProps } from '@/lib/types';

export default async function LoginPage({ params }: PageProps) {
  const locale = await validateAndGetLocale(params);

  return (
    <AuthLayout locale={locale}>
      <LoginForm locale={locale} />
    </AuthLayout>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await validateLocaleForMetadata(params);

  if (!locale) {
    return {};
  }

  return {
    title: 'Login - Itqan CMS',
    description: 'Log in to your account in Itqan',
  };
}
