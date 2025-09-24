"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FormField } from '@/components/ui/form-field';
import { SubmitButton } from '@/components/ui/submit-button';
import { FormError } from '@/components/ui/form-error';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/providers/auth-provider';
import { useForm } from '@/hooks/use-form';
import type { Locale } from '@/i18n';
import { validateProfileCompletionForm } from '@/lib/validations';
import { completeUserProfile } from '@/lib/auth';
import { useTranslations } from 'next-intl';

interface ProfileCompletionFormProps {
  locale: Locale;
}

export function ProfileCompletionForm({ locale }: ProfileCompletionFormProps) {
  const t = useTranslations();
  const router = useRouter();
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
      project_summary: '',
      project_url: '',
      bio: ''
    },
    validate: validateProfileCompletionForm,
    onSubmit: async (data) => {
      const response = await completeUserProfile(data);
      return response;
    },
    onSuccess: (result) => {
      if (result.user && result.token) {
        login(result.user, result.token);
        // Redirect to store page after successful completion
        router.push(`/${locale}/store`);
      }
    }
  });

  const handleSkip = () => {
    // Redirect to store page if skipped
    router.push(`/${locale}/store`);
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

      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-[32px] font-bold text-[#333333]">
          {t('profile.completeProfileTitle')}
        </h1>
        <p className="text-[18px] text-[#333333]">
          {t('profile.completeProfileDescription')}
        </p>
      </div>

      {/* Profile Completion Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Show submit error */}
        <FormError message={submitError} />

        {/* Project Information Section */}
        <div className="space-y-6">
          {/* Project Summary */}
          <FormField
            id="project_summary"
            name="project_summary"
            variant="textarea"
            label={t('profile.projectQuestion')}
            value={formData.project_summary}
            onChange={handleInputChange('project_summary')}
            error={errors.project_summary}
            placeholder={t('profile.businessModelPlaceholder')}
            required
            rows={4}
          />

          {/* Project URL */}
          <FormField
            id="project_url"
            name="project_url"
            type="url"
            label={t('profile.projectLinkLabel')}
            value={formData.project_url}
            onChange={handleInputChange('project_url')}
            error={errors.project_url}
            placeholder={t('forms.placeholders.projectLink')}
          />
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          <FormField
            id="bio"
            name="bio"
            variant="textarea"
            label={t('profile.aboutYourself')}
            value={formData.bio}
            onChange={handleInputChange('bio')}
            error={errors.bio}
            placeholder={t('profile.selfIntroPlaceholder')}
            required
            rows={5}
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Save and Continue Button */}
          <SubmitButton
            isLoading={isLoading}
            loadingText={t('common.loading')}
            className="w-full bg-[#2F504B] hover:bg-[#2F504B]/90"
            size="lg"
          >
            {t('profile.saveAndContinue')}
          </SubmitButton>

          {/* Skip Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handleSkip}
            disabled={isLoading}
            className="w-full text-base bg-white hover:bg-gray-50"
          >
            {t('profile.doItLater')}
          </Button>
        </div>
      </form>
    </div>
  );
}