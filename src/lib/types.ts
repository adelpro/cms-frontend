/**
 * Common type definitions for the application
 */

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
  params: Promise<{
    locale: string;
  } & T>;
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
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Asset category type for type safety
 */
export type AssetCategory = 'mushaf' | 'tafsir' | 'recitation';

/**
 * License type for better type safety
 */
export interface License {
  code: string;
  name: string;
}

/**
 * Publisher information interface
 */
export interface Publisher {
  id: number;
  name: string;
  thumbnail_url: string;
  bio?: string;
}

/**
 * Common asset interface
 */
export interface Asset {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  category: AssetCategory;
  license: License;
  publisher: Publisher;
}

/**
 * User role type for authorization
 */
export type UserRole = 'user' | 'publisher' | 'admin';

/**
 * Theme type for consistent theming
 */
export type Theme = 'light' | 'dark' | 'system';
