"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import type { Locale } from '@/i18n';
import { useTranslations } from 'next-intl';
import { formLogical, typography } from '@/lib/styles/logical';
import { validateProfileCompletionForm } from '@/lib/validations';
import { completeUserProfile } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface ProfileCompletionFormProps {
  locale: Locale;
  isSkippable?: boolean;
}

export function ProfileCompletionForm({ locale, isSkippable = false }: ProfileCompletionFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    businessModel: '',
    projectLink: '',
    teamSize: '',
    aboutYourself: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  
  const { login, user } = useAuth();

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
    const validation = validateProfileCompletionForm(formData, t);
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
      const response = await completeUserProfile(formData);
      
      if (response.success && response.user && response.token) {
        login(response.user, response.token);
      } else {
        setSubmitError(response.error || t('errors.validationError'));
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      setSubmitError(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Skip profile completion for now
    if (user) {
      // Mark profile as skipped but allow access
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className={cn(
          typography.heading,
          "text-3xl lg:text-4xl font-bold text-foreground"
        )}>
          {t('profile.completeProfileTitle')}
        </h1>
        <p className="text-base lg:text-lg text-muted-foreground mt-4">
          {t('profile.completeProfileDescription')}
        </p>
      </div>

      {/* Profile Completion Form */}
      <Card>
        <CardContent className="pt-8 lg:pt-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Show submit error */}
            {submitError && (
              <div className={cn(
                "p-3 rounded-md border bg-destructive/10 border-destructive/20 text-destructive text-sm",
                formLogical.errorText
              )}>
                {submitError}
              </div>
            )}

            {/* Project Information Section */}
            <div className="space-y-6">
              <div className={formLogical.fieldset}>
                <Label htmlFor="businessModel" className={cn(formLogical.label, "text-lg")}>
                  {t('profile.businessModel')}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="businessModel"
                  placeholder={t('profile.businessModel')}
                  value={formData.businessModel}
                  onChange={handleInputChange('businessModel')}
                  required
                  className={cn(
                    formLogical.input,
                    "min-h-[100px] resize-none",
                    errors.businessModel && "border-destructive focus-visible:border-destructive"
                  )}
                  aria-invalid={!!errors.businessModel}
                  rows={4}
                />
                {errors.businessModel && (
                  <p className={formLogical.errorText}>{errors.businessModel}</p>
                )}
              </div>

              <div className={formLogical.fieldset}>
                <Label htmlFor="projectLink" className={formLogical.label}>
                  {t('forms.placeholders.projectLink')}
                </Label>
                <Input
                  id="projectLink"
                  type="url"
                  placeholder={t('forms.placeholders.projectLink')}
                  value={formData.projectLink}
                  onChange={handleInputChange('projectLink')}
                  className={cn(
                    formLogical.input,
                    errors.projectLink && "border-destructive focus-visible:border-destructive"
                  )}
                  aria-invalid={!!errors.projectLink}
                  dir="ltr"
                />
                {errors.projectLink && (
                  <p className={formLogical.errorText}>{errors.projectLink}</p>
                )}
              </div>

              <div className={formLogical.fieldset}>
                <Label htmlFor="teamSize" className={cn(formLogical.label, "text-lg")}>
                  {t('profile.teamSize')}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="teamSize"
                  type="text"
                  placeholder={t('profile.teamSize')}
                  value={formData.teamSize}
                  onChange={handleInputChange('teamSize')}
                  required
                  className={cn(
                    formLogical.input,
                    errors.teamSize && "border-destructive focus-visible:border-destructive"
                  )}
                  aria-invalid={!!errors.teamSize}
                />
                {errors.teamSize && (
                  <p className={formLogical.errorText}>{errors.teamSize}</p>
                )}
              </div>
            </div>

            {/* Personal Information Section */}
            <div className={formLogical.fieldset}>
              <Label htmlFor="aboutYourself" className={cn(formLogical.label, "text-lg")}>
                {t('profile.aboutYourself')}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="aboutYourself"
                placeholder={t('profile.aboutYourself')}
                value={formData.aboutYourself}
                onChange={handleInputChange('aboutYourself')}
                required
                className={cn(
                  formLogical.input,
                  "min-h-[120px] resize-none",
                  errors.aboutYourself && "border-destructive focus-visible:border-destructive"
                )}
                aria-invalid={!!errors.aboutYourself}
                rows={5}
              />
              {errors.aboutYourself && (
                <p className={formLogical.errorText}>{errors.aboutYourself}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
              {isSkippable && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="h-12 lg:h-14 text-base lg:text-lg min-w-[120px]"
                >
                  {t('common.skip')}
                </Button>
              )}
              <Button
                type="submit"
                className="h-12 lg:h-14 text-base lg:text-lg min-w-[180px]"
                disabled={isLoading}
              >
                {isLoading ? t('common.loading') : t('profile.saveAndContinue')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
