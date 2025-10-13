/**
 * Utilities Barrel Export
 * 
 * This file exports all utility functions for convenient importing.
 * 
 * @example
 * import { convertListAssetToAsset, validators } from '@/lib/utils';
 */

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

export type {
  ValidationError,
  ValidationResult,
} from './validation.utils';

