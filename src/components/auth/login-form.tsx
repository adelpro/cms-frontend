"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/auth-provider';
import type { Locale } from '@/i18n';
import { validateLoginForm } from '@/lib/validations';
import { loginUser } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface LoginFormProps {
  locale: Locale;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  
  const { login } = useAuth();

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate form
    const validation = validateLoginForm(formData, t);
    if (!validation.isValid) {
      const fieldErrors: Record<string, string> = {};
      validation.errors.forEach(error => {
        fieldErrors[error.field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await loginUser(formData.email, formData.password);
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
      } else {
        setSubmitError(response.error || t('errors.validationError'));
      }
    } catch (error) {
      console.error('Login error:', error);
      setSubmitError(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

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
      <form onSubmit={handleEmailLogin} className="space-y-6">
        {/* Show submit error */}
        {submitError && (
          <div className="p-3 rounded-md border bg-destructive/10 border-destructive/20 text-destructive text-sm text-center">
            {submitError}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="block text-sm font-medium text-[#333333] text-start">
            {t('auth.email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('forms.placeholders.email')}
            value={formData.email}
            onChange={handleInputChange('email')}
            className={cn(
              "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              errors.email && "border-destructive focus:ring-destructive"
            )}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-destructive text-sm text-start">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="block text-sm font-medium text-[#333333] text-start">
            {t('auth.password')}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('forms.placeholders.password')}
            value={formData.password}
            onChange={handleInputChange('password')}
            className={cn(
              "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              errors.password && "border-destructive focus:ring-destructive"
            )}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-destructive text-sm text-start">{errors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#2F504B] hover:bg-[#2F504B]/90 text-white rounded-md text-base font-medium flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <span className="text-lg">←</span>
          {isLoading ? t('common.loading') : t('auth.login')}
        </Button>
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
