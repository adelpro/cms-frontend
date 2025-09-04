/**
 * Reusable form error display component
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  /** Error message to display */
  message: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show an icon */
  showIcon?: boolean;
  /** Error variant */
  variant?: 'default' | 'inline';
}

/**
 * Reusable component for displaying form errors
 */
export function FormError({
  message,
  className,
  showIcon = true,
  variant = 'default'
}: FormErrorProps) {
  if (!message) return null;

  const baseClasses = cn(
    "text-destructive",
    variant === 'default' && "p-3 rounded-md border bg-destructive/10 border-destructive/20 text-center",
    variant === 'inline' && "text-sm text-start",
    className
  );

  if (variant === 'inline') {
    return (
      <p className={baseClasses} role="alert">
        {message}
      </p>
    );
  }

  return (
    <div className={baseClasses} role="alert">
      <div className="flex items-center justify-center gap-2">
        {showIcon && <AlertCircle className="h-4 w-4" />}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
