'use client';

import { logoutUser } from '@/lib/auth';
import { getLocalizedError } from '@/lib/error-messages';

/**
 * Global HTTP Interceptor for handling authentication errors
 * Similar to Angular's HTTP Interceptor, this wraps the native fetch function
 * to automatically handle 401/403 responses across the entire application
 */

class HttpInterceptor {
  private static instance: HttpInterceptor;
  private logoutCallback?: () => void;
  private originalFetch: typeof fetch;

  private constructor() {
    // Store the original fetch function
    if (typeof window !== 'undefined') {
      this.originalFetch = window.fetch.bind(window);
    } else {
      this.originalFetch = fetch;
    }
    this.setupInterceptor();
  }

  static getInstance(): HttpInterceptor {
    if (!HttpInterceptor.instance) {
      HttpInterceptor.instance = new HttpInterceptor();
    }
    return HttpInterceptor.instance;
  }

  /**
   * Set the logout callback function that will be called when auth errors occur
   */
  setLogoutCallback(callback: () => void): void {
    this.logoutCallback = callback;
  }

  /**
   * Check if a response indicates an authentication error
   */
  private isAuthError(response: Response): boolean {
    return response.status === 401 || response.status === 403;
  }

  /**
   * Check if the request URL should be excluded from auth error handling
   */
  private shouldExcludeFromAuthHandling(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;

      // Exclude login and register endpoints to prevent redirect loops
      const excludedPaths = ['/auth/login', '/auth/register', '/auth/signup'];

      return excludedPaths.some(path => pathname.includes(path));
    } catch {
      return false;
    }
  }

  /**
   * Handle authentication errors by logging out and redirecting
   */
  private async handleAuthError(response: Response): Promise<never> {
    console.warn('Authentication error detected by global interceptor:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      timestamp: new Date().toISOString(),
    });

    // Clear local storage
    logoutUser();

    // Call the logout callback if it's set (from AuthProvider)
    if (this.logoutCallback) {
      this.logoutCallback();
    } else {
      // Fallback: redirect to login page
      if (typeof window !== 'undefined') {
        const currentLocale = window.location.pathname.split('/')[1] || 'ar';
        window.location.href = `/${currentLocale}/auth/login`;
      }
    }

    // Throw a specific error that can be caught by calling code
    throw new Error(getLocalizedError('errors.authenticationFailed'));
  }

  /**
   * Setup the global fetch interceptor
   */
  private setupInterceptor(): void {
    if (typeof window === 'undefined') return;

    // Override the global fetch function
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      try {
        // Call the original fetch function
        const response = await this.originalFetch(input, init);

        // Check for auth errors on all responses
        if (!response.ok && this.isAuthError(response)) {
          // Get the URL from the request
          const url =
            typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

          // Skip auth error handling for excluded URLs
          if (!this.shouldExcludeFromAuthHandling(url)) {
            await this.handleAuthError(response);
          }
        }

        return response;
      } catch (error) {
        // Re-throw any errors that aren't auth-related
        throw error;
      }
    };
  }

  /**
   * Restore the original fetch function (useful for testing)
   */
  restoreOriginalFetch(): void {
    if (typeof window !== 'undefined') {
      window.fetch = this.originalFetch;
    }
  }

  /**
   * Get the original fetch function
   */
  getOriginalFetch(): typeof fetch {
    return this.originalFetch;
  }
}

// Export singleton instance
export const httpInterceptor = HttpInterceptor.getInstance();

// Export the class for testing purposes
export { HttpInterceptor };
