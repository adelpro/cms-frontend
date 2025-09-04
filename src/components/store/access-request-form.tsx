"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { formLogical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { requestAssetAccess } from '@/lib/api/assets';
import { tokenStorage } from '@/lib/auth';

interface AccessRequestFormProps {
  assetId: number;
  assetTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function AccessRequestForm({ assetId, assetTitle, onSuccess, onCancel }: AccessRequestFormProps) {
  const t = useTranslations();
  const [formData, setFormData] = useState({
    purpose: '',
    intended_use: 'non-commercial' as 'commercial' | 'non-commercial'
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear submit error when user makes changes
    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.purpose.trim()) {
      newErrors.purpose = t('ui.requiredFieldError');
    }
    
    if (!formData.intended_use) {
      newErrors.intended_use = t('ui.requiredFieldError');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSubmitError('');
    
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        throw new Error(t('ui.unauthorized'));
      }

      const response = await requestAssetAccess(assetId, {
        purpose: formData.purpose,
        intended_use: formData.intended_use
      }, token);

      // Handle success based on response status
      if (response.status === 'approved') {
        onSuccess();
      } else {
        // For pending requests, still call onSuccess to close form
        onSuccess();
      }
    } catch (error) {
      console.error('Access request error:', error);
      setSubmitError(error instanceof Error ? error.message : t('ui.accessRequestFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">{t('ui.accessRequestTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {assetTitle}
        </p>
      </div>

      {/* Show submit error */}
      {submitError && (
        <div className="p-3 rounded-md border bg-destructive/10 border-destructive/20 text-destructive text-sm text-center">
          {submitError}
        </div>
      )}

      <div className="space-y-4">
        <div className={formLogical.fieldset}>
          <Label htmlFor="purpose" className={cn(formLogical.label, "text-base")}>
            {t('ui.accessRequestQuestion')} {t('common.required')}
          </Label>
          <Textarea
            id="purpose"
            name="purpose"
            placeholder={t('ui.accessRequestReason')}
            value={formData.purpose}
            onChange={handleChange}
            className={cn(
              formLogical.input,
              "min-h-[100px] resize-none",
              errors.purpose && "border-destructive focus-visible:border-destructive"
            )}
            rows={4}
            aria-invalid={!!errors.purpose}
          />
          {errors.purpose && (
            <p className={formLogical.errorText}>{errors.purpose}</p>
          )}
        </div>

        <div className={formLogical.fieldset}>
          <Label htmlFor="intended_use" className={cn(formLogical.label, "text-base")}>
            {t('ui.intendedUseQuestion')} {t('common.required')}
          </Label>
          <select
            id="intended_use"
            name="intended_use"
            value={formData.intended_use}
            onChange={handleChange}
            className={cn(
              formLogical.input,
              "h-10",
              errors.intended_use && "border-destructive focus-visible:border-destructive"
            )}
            aria-invalid={!!errors.intended_use}
          >
            <option value="non-commercial">{t('ui.nonCommercialUse')}</option>
            <option value="commercial">{t('ui.commercialUse')}</option>
          </select>
          {errors.intended_use && (
            <p className={formLogical.errorText}>{errors.intended_use}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? t('ui.sending') : t('common.continue')}
        </Button>
      </div>
    </form>
  );
}
