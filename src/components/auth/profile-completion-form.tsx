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
      projectDescription: '',
      projectLink: '',
      teamSize: '',
      aboutYourself: ''
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
          {/* Project Description */}
          <FormField
            id="projectDescription"
            name="projectDescription"
            variant="textarea"
            label={t('profile.projectQuestion')}
            value={formData.projectDescription}
            onChange={handleInputChange('projectDescription')}
            error={errors.projectDescription}
            placeholder={t('profile.businessModelPlaceholder')}
            required
            rows={4}
          />

          {/* Project Link */}
          <FormField
            id="projectLink"
            name="projectLink"
            type="url"
            label={t('profile.projectLinkLabel')}
            value={formData.projectLink}
            onChange={handleInputChange('projectLink')}
            error={errors.projectLink}
            placeholder={t('profile.teamSizePlaceholder')}
          />
        </div>

        {/* Personal Information Section */}
        <div className="space-y-4">
          {/* Section instruction */}
          <p className="text-sm text-[#333333] text-start">
            {t('profile.personalInfoInstruction')}
          </p>
          
          <FormField
            id="aboutYourself"
            name="aboutYourself"
            variant="textarea"
            label={t('profile.aboutYourself')}
            value={formData.aboutYourself}
            onChange={handleInputChange('aboutYourself')}
            error={errors.aboutYourself}
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