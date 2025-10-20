/**
 * Utilities Barrel Export
 *
 * This file exports all utility functions for convenient importing.
 *
 * @example
 * import { convertListAssetToAsset, validators, cn } from '@/lib/utils';
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { env } from '../env';

// Common utilities
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the current locale for API headers ('ar' | 'en').
 * Prefers the locale encoded in the URL (/ar/... or /en/...).
 */
export function getCurrentLocaleForHeaders(): 'ar' | 'en' {
  try {
    if (typeof window !== 'undefined') {
      const firstPath = window.location.pathname.split('/')[1];
      if (firstPath === 'ar' || firstPath === 'en') return firstPath;
    }
  } catch {}
  // Fallback to default
  return (env.NEXT_PUBLIC_DEFAULT_LOCALE as 'ar' | 'en') || 'ar';
}

/**
 * Navigates to the download URL to trigger automatic download
 * @param downloadUrl - The download URL path from the API response
 */
export function downloadFileFromUrl(downloadUrl: string): void {
  // Construct the full URL by combining backend URL with download path
  const fullUrl = `${env.NEXT_PUBLIC_BACKEND_URL}${downloadUrl}`;

  // Navigate to the download URL - browser will handle the download automatically
  window.location.href = fullUrl;
}

// Re-export conversion utilities
export {
  convertUserProfileToUser,
  convertListAssetToAsset,
  convertDetailAssetToAssetDetails,
  convertDetailPublisherToPublisher,
  getLicenseColor,
  getAssetType,
  convertUserRegistrationToApiFormat,
  convertUserProfileUpdateToApiFormat,
} from './conversion.utils';

// Re-export validation utilities
export {
  validators,
  validateLoginForm,
  validateSignupForm,
  validateProfileCompletionForm,
  validateSocialProfileForm,
} from './validation.utils';

export type { ValidationError, ValidationResult } from './validation.utils';
