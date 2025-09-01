"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Dictionary } from '@/lib/i18n/types';
import { formLogical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface AccessRequestFormProps {
  assetTitle: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  dict: Dictionary;
}

export function AccessRequestForm({ assetTitle, onSubmit, onCancel, dict }: AccessRequestFormProps) {
  const [formData, setFormData] = useState({
    reason: '',
    addedValue: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.reason.trim()) {
      newErrors.reason = dict.ui.requiredFieldError;
    }
    
    if (!formData.addedValue.trim()) {
      newErrors.addedValue = dict.ui.requiredFieldError;
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit({
        assetTitle,
        ...formData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Access request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium mb-2">{dict.ui.accessRequestTitle}</h3>
        <p className="text-sm text-muted-foreground">
          {assetTitle}
        </p>
      </div>

      <div className="space-y-4">
        <div className={formLogical.fieldset}>
          <Label htmlFor="reason" className={cn(formLogical.label, "text-base")}>
            {dict.ui.accessRequestQuestion} {dict.ui.required}
          </Label>
          <Textarea
            id="reason"
            name="reason"
            placeholder={dict.ui.accessRequestReason}
            value={formData.reason}
            onChange={handleChange}
            className={cn(
              formLogical.input,
              "min-h-[100px] resize-none",
              errors.reason && "border-destructive focus-visible:border-destructive"
            )}
            rows={4}
            aria-invalid={!!errors.reason}
          />
          {errors.reason && (
            <p className={formLogical.errorText}>{errors.reason}</p>
          )}
        </div>

        <div className={formLogical.fieldset}>
          <Label htmlFor="addedValue" className={cn(formLogical.label, "text-base")}>
            {dict.ui.addedValueQuestion} {dict.ui.required}
          </Label>
          <Textarea
            id="addedValue"
            name="addedValue"
            placeholder={dict.ui.projectBenefit}
            value={formData.addedValue}
            onChange={handleChange}
            className={cn(
              formLogical.input,
              "min-h-[100px] resize-none",
              errors.addedValue && "border-destructive focus-visible:border-destructive"
            )}
            rows={4}
            aria-invalid={!!errors.addedValue}
          />
          {errors.addedValue && (
            <p className={formLogical.errorText}>{errors.addedValue}</p>
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
          {dict.ui.cancel}
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="min-w-[100px]"
        >
          {isLoading ? dict.ui.sending : dict.ui.continue}
        </Button>
      </div>
    </form>
  );
}
