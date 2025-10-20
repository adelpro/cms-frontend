/**
 * Reusable submit button component with consistent styling and loading states
 */

import React from 'react';

import { cn } from '@/lib/utils';

import { Button } from './button';

interface SubmitButtonProps {
  /** Button text when not loading */
  children: React.ReactNode;
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Text to show when loading */
  loadingText?: string;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'primary' | 'outline' | 'secondary';
  /** Button size */
  size?: 'default' | 'sm' | 'lg';
  /** Show arrow icon */
  showArrow?: boolean;
  /** Click handler for non-submit actions */
  onClick?: () => void;
  /** Button type */
  type?: 'submit' | 'button';
}

/**
 * Reusable submit button with consistent styling and loading states
 */
export function SubmitButton({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  className,
  variant = 'primary',
  size = 'default',
  showArrow = false,
  onClick,
  type = 'submit',
}: SubmitButtonProps) {
  const baseClasses = cn(
    // Base styles
    'flex items-center justify-center gap-2 font-medium transition-colors',
    // Size variants
    size === 'sm' && 'h-9 px-3 text-sm',
    size === 'default' && 'h-10 px-4 text-base',
    size === 'lg' && 'h-12 px-6 text-base',
    // Variant styles
    variant === 'primary' && 'bg-[#2F504B] hover:bg-[#2F504B]/90 text-white rounded-md',
    variant === 'default' && 'bg-primary hover:bg-primary/90 text-primary-foreground rounded-md',
    variant === 'outline' &&
      'border border-input bg-background hover:bg-accent hover:text-accent-foreground rounded-md',
    variant === 'secondary' &&
      'bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md',
    className
  );

  const isDisabled = disabled || isLoading;

  return (
    <Button type={type} className={baseClasses} disabled={isDisabled} onClick={onClick}>
      {showArrow && !isLoading && (
        <span className='text-lg' aria-hidden='true'>
          ←
        </span>
      )}
      {isLoading ? loadingText : children}
    </Button>
  );
}
