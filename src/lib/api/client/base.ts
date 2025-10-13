/**
 * Base API Client
 * 
 * This file contains the base HTTP client configuration and utilities
 * for making API requests. It provides a centralized place for
 * authentication, headers, and common request logic.
 */

import { env } from '@/lib/env';
import { getCurrentLocaleForHeaders } from '@/lib/utils';
import { handleApiResponse } from './error-handler';

/**
 * API base URL from environment configuration
 */
export const API_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Request options for API calls
 */
export interface ApiRequestOptions extends RequestInit {
  /** Authentication token to include in headers */
  token?: string;
  
  /** Additional custom headers */
  customHeaders?: HeadersInit;
  
  /** Whether to include credentials */
  includeCredentials?: boolean;
}

/**
 * Constructs authorization headers for API requests
 * 
 * Creates a headers object with authentication, content-type,
 * and locale information.
 * 
 * @param token - Optional authentication token
 * @param customHeaders - Optional additional headers
 * @returns Headers object ready for fetch request
 * 
 * @example
 * ```typescript
 * const headers = getAuthHeaders(token);
 * fetch(url, { headers });
 * ```
 */
export function getAuthHeaders(token?: string, customHeaders?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': getCurrentLocaleForHeaders(),
  };
  
  if (customHeaders) {
    Object.assign(headers, customHeaders);
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Makes an authenticated API request
 * 
 * Generic HTTP client that handles authentication, headers,
 * and response parsing automatically.
 * 
 * @param endpoint - API endpoint path (relative to base URL)
 * @param options - Request options including token and method
 * @returns Promise resolving to the typed response data
 * 
 * @example
 * ```typescript
 * const user = await apiRequest<UserProfileSchema>('/auth/profile/', {
 *   token: accessToken,
 *   method: 'GET',
 * });
 * ```
 */
export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { token, customHeaders, includeCredentials, ...fetchOptions } = options;
  
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = getAuthHeaders(token, customHeaders);
  
  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers,
  };
  
  if (includeCredentials) {
    requestOptions.credentials = 'include';
  }
  
  const response = await fetch(url, requestOptions);
  
  return handleApiResponse<T>(response);
}

/**
 * Makes a GET request to the API
 * 
 * @param endpoint - API endpoint path
 * @param token - Optional authentication token
 * @param customHeaders - Optional additional headers
 * @returns Promise resolving to the typed response data
 * 
 * @example
 * ```typescript
 * const assets = await apiGet<PagedListAssetOut>('/assets/', token);
 * ```
 */
export async function apiGet<T>(
  endpoint: string,
  token?: string,
  customHeaders?: HeadersInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
    token,
    customHeaders,
  });
}

/**
 * Makes a POST request to the API
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param token - Optional authentication token
 * @param customHeaders - Optional additional headers
 * @returns Promise resolving to the typed response data
 * 
 * @example
 * ```typescript
 * const response = await apiPost<TokenResponseSchema>('/auth/login/', {
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 * ```
 */
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  token?: string,
  customHeaders?: HeadersInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    token,
    customHeaders,
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Makes a PUT request to the API
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param token - Authentication token
 * @param customHeaders - Optional additional headers
 * @returns Promise resolving to the typed response data
 */
export async function apiPut<T>(
  endpoint: string,
  data: unknown,
  token: string,
  customHeaders?: HeadersInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PUT',
    token,
    customHeaders,
    body: JSON.stringify(data),
  });
}

/**
 * Makes a PATCH request to the API
 * 
 * @param endpoint - API endpoint path
 * @param data - Request body data
 * @param token - Authentication token
 * @param customHeaders - Optional additional headers
 * @returns Promise resolving to the typed response data
 */
export async function apiPatch<T>(
  endpoint: string,
  data: unknown,
  token: string,
  customHeaders?: HeadersInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    token,
    customHeaders,
    body: JSON.stringify(data),
  });
}

/**
 * Makes a DELETE request to the API
 * 
 * @param endpoint - API endpoint path
 * @param token - Authentication token
 * @param customHeaders - Optional additional headers
 * @returns Promise resolving to the typed response data
 */
export async function apiDelete<T>(
  endpoint: string,
  token: string,
  customHeaders?: HeadersInit
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    token,
    customHeaders,
  });
}

/**
 * Builds URL with query parameters
 * 
 * Constructs a URL with query string from an object of parameters.
 * Handles arrays, null values, and proper encoding.
 * 
 * @param baseUrl - Base URL or endpoint
 * @param params - Object containing query parameters
 * @returns Complete URL with query string
 * 
 * @example
 * ```typescript
 * const url = buildUrlWithParams('/assets/', {
 *   category: ['mushaf', 'tafsir'],
 *   page: 1,
 *   page_size: 20,
 * });
 * // Result: '/assets/?category=mushaf&category=tafsir&page=1&page_size=20'
 * ```
 */
export function buildUrlWithParams(
  baseUrl: string,
  params?: Record<string, string | number | boolean | string[] | number[] | undefined | null>
): string {
  if (!params) return baseUrl;
  
  const queryParts: string[] = [];
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return; // Skip undefined/null values
    }
    
    if (Array.isArray(value)) {
      // Handle array parameters (e.g., category=mushaf&category=tafsir)
      value.forEach(item => {
        queryParts.push(`${key}=${encodeURIComponent(String(item))}`);
      });
    } else {
      // Handle single values
      queryParts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  });
  
  if (queryParts.length === 0) {
    return baseUrl;
  }
  
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryParts.join('&')}`;
}

