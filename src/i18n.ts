import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['ar', 'en'] as const;
export const defaultLocale = 'ar' as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

// Helper function to get messages for server components
export async function getMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    // Fallback to default locale
    return (await import(`./messages/${defaultLocale}.json`)).default;
  }
}

// Validation function
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Helper functions
export function getOppositeLocale(currentLocale: Locale): Locale {
  return currentLocale === 'ar' ? 'en' : 'ar';
}

export const localeNames = {
  ar: 'العربية',
  en: 'English',
} as const;
