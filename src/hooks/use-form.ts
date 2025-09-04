/**
 * Custom hook for form state management with validation and error handling
 */

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import type { ValidationResult } from '@/lib/validations';
import type { FormState } from '@/lib/types';

interface UseFormOptions<T> {
  /** Initial form data */
  initialData: T;
  /** Validation function */
  validate: (data: T, t: (key: string) => string) => ValidationResult;
  /** Submit handler function */
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string; [key: string]: any }>;
  /** Optional success callback */
  onSuccess?: (result: any) => void;
}

interface UseFormReturn<T> {
  /** Current form data */
  formData: T;
  /** Current form errors */
  errors: Record<string, string>;
  /** Loading state */
  isLoading: boolean;
  /** Submit error message */
  submitError: string;
  /** Handle input change */
  handleInputChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Handle form submission */
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  /** Reset form to initial state */
  resetForm: () => void;
  /** Set specific field value */
  setFieldValue: (field: keyof T, value: string) => void;
  /** Set specific field error */
  setFieldError: (field: keyof T, error: string) => void;
  /** Clear all errors */
  clearErrors: () => void;
}

/**
 * Custom hook for managing form state, validation, and submission
 */
export function useForm<T extends Record<string, string>>({
  initialData,
  validate,
  onSubmit,
  onSuccess
}: UseFormOptions<T>): UseFormReturn<T> {
  const t = useTranslations();
  
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = useCallback((field: keyof T) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
      
      // Clear field error when user starts typing
      if (errors[field as string]) {
        setErrors(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    
    // Validate form
    const validation = validate(formData, t);
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
      const result = await onSubmit(formData);
      
      if (result.success) {
        onSuccess?.(result);
      } else {
        setSubmitError(result.error || t('errors.validationError'));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(t('errors.networkError'));
    } finally {
      setIsLoading(false);
    }
  }, [formData, validate, onSubmit, onSuccess, t]);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setSubmitError('');
    setIsLoading(false);
  }, [initialData]);

  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setSubmitError('');
  }, []);

  return {
    formData,
    errors,
    isLoading,
    submitError,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    clearErrors
  };
}
