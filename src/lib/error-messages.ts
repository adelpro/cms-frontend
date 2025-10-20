/**
 * Error message localization utility
 * Provides localized error messages for API responses
 */

// Import the translation messages
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

/**
 * Get a localized error message
 * @param key - The error message key
 * @param locale - The current locale ('en' or 'ar')
 * @returns Localized error message
 */
export function getLocalizedErrorMessage(key: string, locale: string = 'en'): string {
  const messages = locale === 'ar' ? arMessages : enMessages;

  // Navigate through nested object structure using dot notation
  const keys = key.split('.');
  let result: unknown = messages;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = (result as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found
      const enKeys = key.split('.');
      let enResult: unknown = enMessages;
      for (const enK of enKeys) {
        if (enResult && typeof enResult === 'object' && enK in enResult) {
          enResult = (enResult as Record<string, unknown>)[enK];
        } else {
          return key; // Return the key itself if not found anywhere
        }
      }
      return typeof enResult === 'string' ? enResult : key;
    }
  }

  return typeof result === 'string' ? result : key;
}

/**
 * Get the default localized "something went wrong" message
 * @param locale - The current locale ('en' or 'ar')
 * @returns Localized "something went wrong" message
 */
export function getDefaultErrorMessage(locale: string = 'en'): string {
  return getLocalizedErrorMessage('errors.somethingWentWrong', locale);
}

/**
 * Get the current locale from the browser or default to 'en'
 * @returns Current locale
 */
export function getCurrentLocale(): string {
  if (typeof window === 'undefined') {
    return 'en'; // Default for server-side rendering
  }

  // Try to get locale from the URL path
  const pathname = window.location.pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2})\//);
  if (localeMatch) {
    return localeMatch[1];
  }

  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'ar' ? 'ar' : 'en';
}

/**
 * Get a localized error message with automatic locale detection
 * @param key - The error message key
 * @returns Localized error message
 */
export function getLocalizedError(key: string): string {
  const locale = getCurrentLocale();
  return getLocalizedErrorMessage(key, locale);
}

/**
 * Get the default error message with automatic locale detection
 * @returns Localized default error message
 */
export function getDefaultError(): string {
  const locale = getCurrentLocale();
  return getDefaultErrorMessage(locale);
}
