/**
 * Reusable form field component with consistent styling and error handling
 */

import React from 'react';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';

interface BaseFormFieldProps {
  /** Field identifier */
  id: string;
  /** Field name for form data */
  name: string;
  /** Field label */
  label: string;
  /** Current field value */
  value: string;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  /** Error message if any */
  error?: string;
  /** Whether field is required */
  required?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether field is disabled */
  disabled?: boolean;
}

interface InputFieldProps extends BaseFormFieldProps {
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  /** Field variant */
  variant?: 'input';
}

interface TextareaFieldProps extends BaseFormFieldProps {
  /** Field variant */
  variant: 'textarea';
  /** Number of rows for textarea */
  rows?: number;
  /** Minimum height for textarea */
  minHeight?: string;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps;

/**
 * Reusable form field component with consistent styling
 */
export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  className,
  placeholder,
  disabled = false,
  ...props
}: FormFieldProps) {
  const baseInputClasses = cn(
    "w-full h-10 bg-white border border-gray-300 rounded-md px-4 text-start placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    error && "border-destructive focus:ring-destructive",
    className
  );

  const textareaClasses = cn(
    "w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-start placeholder:text-gray-400",
    "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
    "disabled:opacity-50 disabled:cursor-not-allowed resize-none",
    error && "border-destructive focus:ring-destructive",
    className
  );

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="block text-sm font-medium text-[#333333] text-start"
      >
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </Label>
      
      {props.variant === 'textarea' ? (
        <Textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={props.rows || 4}
          className={textareaClasses}
          style={props.minHeight ? { minHeight: props.minHeight } : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <Input
          id={id}
          name={name}
          type={props.type || 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}
      
      {error && (
        <p 
          id={`${id}-error`}
          className="text-destructive text-sm text-start"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
