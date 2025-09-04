"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/providers/auth-provider';
import type { Locale } from '@/i18n';
import { validateSignupForm } from '@/lib/validations';
import { signupUser, socialLogin } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface SignupFormProps {
  locale: Locale;
}

export function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    title: '',
    phoneNumber: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate form
    const validation = validateSignupForm(formData, t);
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
      const response = await signupUser(formData);
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
      } else {
        setSubmitError(response.error || t('errors.validationError'));
      }
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitError(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setSubmitError('');
    
    try {
      // Simulate getting social data (in real app, this would come from OAuth)
      const socialData = {
        firstName: provider === 'google' ? 'John' : 'Jane',
        lastName: provider === 'google' ? 'Doe' : 'Developer',
        email: `user@${provider}.com`
      };
      
      const response = await socialLogin(provider, socialData);
      
      if (response.success) {
        if (response.requiresProfileCompletion && response.user) {
          // User needs to complete profile - the AuthProvider will handle redirect
          login(response.user, 'temp_token');
        } else if (response.user && response.token) {
          // User signup complete
          login(response.user, response.token);
        }
      } else {
        setSubmitError(response.error || dict.auth.validation.signupFailed);
      }
    } catch (error) {
      console.error('Social signup error:', error);
      setSubmitError(dict.auth.validation.networkError);
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
          {t('auth.signupTitle')}
        </h1>
      </div>

      {/* Social Signup Buttons - Temporarily Commented Out */}
      {/* 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-12 lg:h-14",
            "bg-red-500 hover:bg-red-600 text-white border-red-500",
            "flex items-center justify-center gap-3 text-base lg:text-lg"
          )}
          onClick={() => handleSocialSignup('google')}
        >
          <svg className="size-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
                      {t('auth.loginWithGoogle')}
        </Button>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full h-12 lg:h-14",
            "bg-gray-900 hover:bg-gray-800 text-white border-gray-900",
            "flex items-center justify-center gap-3 text-base lg:text-lg"
          )}
          onClick={() => handleSocialSignup('github')}
        >
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
                      {t('auth.loginWithGitHub')}
        </Button>
      </div>
      */}

      {/* Divider - Removed since social signup is commented out */}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Show submit error */}
        {submitError && (
          <div className="p-3 rounded-md border bg-destructive/10 border-destructive/20 text-destructive text-sm text-center">
            {submitError}
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="block text-sm font-medium text-[#333333] text-start">
              {t('auth.firstName')}
            </Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange('firstName')}
              className={cn(
                "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.firstName && "border-destructive focus:ring-destructive"
              )}
              aria-invalid={!!errors.firstName}
            />
            {errors.firstName && (
              <p className="text-destructive text-sm text-start">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="block text-sm font-medium text-[#333333] text-start">
              {t('auth.lastName')}
            </Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange('lastName')}
              className={cn(
                "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
                errors.lastName && "border-destructive focus:ring-destructive"
              )}
              aria-invalid={!!errors.lastName}
            />
            {errors.lastName && (
              <p className="text-destructive text-sm text-start">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
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

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="block text-sm font-medium text-[#333333] text-start">
            {t('auth.title')}
          </Label>
          <Input
            id="title"
            type="text"
            placeholder={t('forms.placeholders.title')}
            value={formData.title}
            onChange={handleInputChange('title')}
            className={cn(
              "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              errors.title && "border-destructive focus:ring-destructive"
            )}
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p className="text-destructive text-sm text-start">{errors.title}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="block text-sm font-medium text-[#333333] text-start">
            {t('auth.phoneNumber')}
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder={t('forms.placeholders.phoneNumber')}
            value={formData.phoneNumber}
            onChange={handleInputChange('phoneNumber')}
            className={cn(
              "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              errors.phoneNumber && "border-destructive focus:ring-destructive"
            )}
            aria-invalid={!!errors.phoneNumber}
          />
          {errors.phoneNumber && (
            <p className="text-destructive text-sm text-start">{errors.phoneNumber}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#2F504B] hover:bg-[#2F504B]/90 text-white rounded-md text-base font-medium flex items-center justify-center gap-2"
          disabled={isLoading}
        >
          <span className="text-lg">←</span>
          {isLoading ? t('common.loading') : t('auth.signup')}
        </Button>
      </form>

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-[#333333]">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link
            href={`/${locale}/auth/login`}
            className="text-primary hover:underline font-medium"
          >
            {t('auth.loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
