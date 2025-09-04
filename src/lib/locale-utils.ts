/**
 * Locale validation utilities for consistent locale handling across pages
 */

import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n';
import type { ValidatedLocale } from './types';

/**
 * Validates locale from page params and returns validated locale or triggers 404
 * @param params Page params containing locale
 * @returns Validated locale
 */
export async function validateAndGetLocale(params: Promise<{ locale: string }>): Promise<ValidatedLocale> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    notFound();
  }
  
  return locale as ValidatedLocale;
}

/**
 * Validates locale from page params for metadata generation
 * @param params Page params containing locale
 * @returns Validated locale or null if invalid
 */
export async function validateLocaleForMetadata(params: Promise<{ locale: string }>): Promise<ValidatedLocale | null> {
  const { locale } = await params;
  
  if (!isValidLocale(locale)) {
    return null;
  }
  
  return locale as ValidatedLocale;
}

/**
 * Type-safe page props validator for standard pages
 */
export type ValidatedPageProps = {
  locale: ValidatedLocale;
};

/**
 * Type-safe page props validator for dynamic pages
 */
export type ValidatedDynamicPageProps<T extends Record<string, string>> = {
  locale: ValidatedLocale;
} & T;
