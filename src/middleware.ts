import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n/utils';
import type { Locale } from '@/lib/i18n/types';

// Validate if a string is a valid locale with type safety
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Get locale from request with proper validation
function getLocale(request: NextRequest): Locale {
  // Check if locale is in URL path
  const pathname = request.nextUrl.pathname;
  const pathSegments = pathname.split('/').filter(Boolean);
  
  if (pathSegments.length > 0) {
    const potentialLocale = pathSegments[0];
    if (isValidLocale(potentialLocale)) {
      return potentialLocale;
    }
  }

  // Check Accept-Language header with proper parsing
  const acceptLanguage = request.headers.get('Accept-Language');
  if (acceptLanguage) {
    // Parse Accept-Language header properly
    const languages = acceptLanguage
      .split(',')
      .map(lang => lang.trim().split(';')[0].split('-')[0])
      .filter(Boolean);
    
    // Find first supported language, prioritizing Arabic
    for (const lang of languages) {
      if (lang === 'ar') return 'ar';
    }
    for (const lang of languages) {
      if (isValidLocale(lang)) return lang as Locale;
    }
  }

  // Default to Arabic
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a valid locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    const url = new URL(`/${locale}${pathname}`, request.url);
    
    // Add security headers
    const response = NextResponse.redirect(url);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    return response;
  }

  // Add security headers to all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}
