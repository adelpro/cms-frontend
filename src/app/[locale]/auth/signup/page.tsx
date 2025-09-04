import { AuthLayout } from '@/components/auth/auth-layout';
import { SignupForm } from '@/components/auth/signup-form';
import { validateAndGetLocale, validateLocaleForMetadata } from '@/lib/locale-utils';
import type { PageProps } from '@/lib/types';

export default async function SignupPage({ params }: PageProps) {
  const locale = await validateAndGetLocale(params);

  return (
    <AuthLayout locale={locale}>
      <SignupForm locale={locale} />
    </AuthLayout>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const locale = await validateLocaleForMetadata(params);
  
  if (!locale) {
    return {};
  }

  return {
    title: 'Sign Up - Itqan CMS',
    description: 'Create your account in Itqan',
  };
}
