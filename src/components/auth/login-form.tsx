"use client";

import Link from 'next/link';
import Image from 'next/image';
import { FormField } from '@/components/ui/form-field';
import { SubmitButton } from '@/components/ui/submit-button';
import { FormError } from '@/components/ui/form-error';
import { useAuth } from '@/components/providers/auth-provider';
import { useForm } from '@/hooks/use-form';
import type { Locale } from '@/i18n';
import { validateLoginForm } from '@/lib/utils';
import { loginUser } from '@/lib/auth';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  locale: Locale;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations();
  const { login } = useAuth();

  const {
    formData,
    errors,
    isLoading,
    submitError,
    handleInputChange,
    handleSubmit
  } = useForm({
    initialData: {
      email: '',
      password: ''
    },
    validate: validateLoginForm,
    onSubmit: async (data) => {
      const response = await loginUser(data.email, data.password);
      return response;
    },
    onSuccess: (result) => {
      if (result.user && result.token) {
        login(result.user, result.token);
      }
    }
  });

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="text-center">
        <Image
          src="/logo.svg"
          alt="Itqan"
          width={50}
          height={50}
          className="mx-auto mb-3"
        />
      </div>

      {/* Welcome Message */}
      <div className="text-center space-y-3">
        <h1 className="text-[32px] font-bold text-[#333333]">
          {t('auth.loginTitle')}
        </h1>
        <p className="text-[18px] text-[#333333]">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Show submit error */}
        <FormError message={submitError} />

        <FormField
          id="email"
          name="email"
          type="email"
          label={t('auth.email')}
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          placeholder={t('forms.placeholders.email')}
          required
        />

        <FormField
          id="password"
          name="password"
          type="password"
          label={t('auth.password')}
          value={formData.password}
          onChange={handleInputChange('password')}
          error={errors.password}
          placeholder={t('forms.placeholders.password')}
          required
        />

        <SubmitButton
          isLoading={isLoading}
          loadingText={t('common.loading')}
          className="w-full"
          size="lg"
          showArrow
        >
          {t('auth.login')}
        </SubmitButton>
      </form>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-[#333333]">
          {t('auth.noAccount')}{' '}
          <Link
            href={`/${locale}/auth/signup`}
            className="text-primary hover:underline font-medium"
          >
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
