"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/providers/auth-provider';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { formLogical, typography } from '@/lib/styles/logical';
import { validateProfileCompletionForm } from '@/lib/validations';
import { completeUserProfile } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface ProfileCompletionFormProps {
  dict: Dictionary;
  locale: Locale;
  isSkippable?: boolean;
}

export function ProfileCompletionForm({ dict, isSkippable = false }: ProfileCompletionFormProps) {
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
    const validation = validateProfileCompletionForm(formData, dict);
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
        setSubmitError(response.error || dict.auth.validation.signupFailed);
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      setSubmitError(dict.auth.validation.networkError);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className={cn(
          typography.heading,
          "text-2xl font-bold text-foreground"
        )}>
          {dict.auth.completeProfileTitle}
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          {dict.auth.completeProfileDescription}
        </p>
      </div>

      {/* Profile Completion Form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="space-y-4">
              <div className={formLogical.fieldset}>
                <Label htmlFor="businessModel" className={cn(formLogical.label, "text-lg")}>
                  {dict.auth.businessModelQuestion}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Textarea
                  id="businessModel"
                  placeholder={dict.auth.businessModelPlaceholder}
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
                  {dict.auth.projectLink}
                </Label>
                <Input
                  id="projectLink"
                  type="url"
                  placeholder={dict.auth.projectLinkPlaceholder}
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
                  {dict.auth.teamSizeQuestion}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="teamSize"
                  type="text"
                  placeholder={dict.auth.teamSizePlaceholder}
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
                {dict.auth.aboutYourselfQuestion}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                id="aboutYourself"
                placeholder={dict.auth.aboutYourselfPlaceholder}
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
            <div className="flex gap-3 justify-end">
              {isSkippable && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  {dict.ui.skip || 'تخطي'}
                </Button>
              )}
              <Button
                type="submit"
                className="min-w-[150px]"
                disabled={isLoading}
              >
                {isLoading ? dict.loading : dict.auth.saveAndContinue}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
