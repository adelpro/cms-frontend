/**
 * Types Module Barrel Export
 *
 * This is the main entry point for all type definitions in the application.
 * Import types from this file for better organization and maintainability.
 *
 * @example
 * // API types
 * import type { UserProfileSchema, ListAssetOut } from '@/lib/types';
 *
 * // Domain models
 * import type { User, Asset } from '@/lib/types';
 *
 * // Common types
 * import type { PageProps, ApiResponse } from '@/lib/types';
 */

// Re-export all API types
export type {
  // Common API types
  ApiErrorResponse,
  OkSchema,
  ApiResponse,
  PagedResponse,
  CategoryChoice,
  StatusChoice,
  IntendedUseChoice,
  OrderingOption,
  BaseListFilters,

  // Auth API types
  UserProfileSchema,
  UserUpdateSchema,
  TokenResponseSchema,
  LoginSchema,
  RegisterSchema,
  RefreshTokenIn,
  RefreshTokenOut,
  LogoutIn,
  OAuth2AuthorizeResponseSchema,
  AuthProvider,
  UserRole,

  // Assets API types
  ListAssetPublisherOut,
  DetailAssetPublisherOut,
  DetailPublisherOut,
  ListResourcePublisherOut,
  DetailResourcePublisherOut,
  ListAssetOut,
  DetailAssetSnapshotOut,
  DetailAssetResourceOut,
  DetailAssetOut,
  PagedListAssetOut,
  ListResourceOut,
  DetailResourceOut,
  PagedListResourceOut,
  CreateResourceIn,
  UpdateResourceIn,
  ResourceOut,
  RequestAccessIn,
  AccessRequestOut,
  AccessGrantOut,
  AccessRequestResponseOut,
  AssetAccessStatusOut,
  DownloadResponseOut,
  AssetListFilters,
  ResourceListFilters,
} from './api';

// Re-export all domain models
export type {
  // User models
  User,
  UserProfileUpdate,
  UserCredentials,
  UserRegistration,

  // Asset models
  AssetCategory,
  LicenseColor,
  AssetType,
  License,
  Publisher,
  AssetSnapshot,
  Asset,
  AssetDetails,
  AssetFilters,
  AssetAccessRequest,
} from './models';

// Keep existing common types from the old types.ts
// These are application-level types, not API or domain models

import type { Locale } from '@/i18n';

/**
 * Standard page props interface for locale-based pages
 */
export interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

/**
 * Page props with additional dynamic params
 */
export interface DynamicPageProps<T extends Record<string, string> = Record<string, string>> {
  params: Promise<
    {
      locale: string;
    } & T
  >;
}

/**
 * Validated locale after locale validation
 */
export type ValidatedLocale = Locale;

/**
 * Form state type for consistent error handling
 */
export interface FormState<T> {
  data: T;
  errors: Record<string, string>;
  isLoading: boolean;
  submitError: string;
}

/**
 * Theme type for consistent theming
 */
export type Theme = 'light' | 'dark' | 'system';
