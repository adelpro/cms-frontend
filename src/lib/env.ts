/**
 * Environment configuration with validation
 * Centralizes all environment variable handling with type safety
 */

// Environment configuration object
export const env = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Itqan CMS',
  NEXT_PUBLIC_APP_DESCRIPTION:
    process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'A modern multilingual CMS with RTL support',
  NEXT_PUBLIC_DEFAULT_LOCALE: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as 'ar' | 'en') || 'ar',
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || 'https://develop.api.cms.itqan.dev',
} as const;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Validation function (called during build)
export function validateEnv() {
  const required = {
    NODE_ENV: env.NODE_ENV,
  };

  for (const [key, value] of Object.entries(required)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return env;
}
