/**
 * API Error Handler
 *
 * This file contains centralized error handling logic for API requests.
 * It provides consistent error parsing and formatting across all API calls.
 */

import { getDefaultError } from '@/lib/error-messages';
import type { ApiErrorResponse } from '@/lib/types/api/common.types';

/**
 * Handles API response errors consistently
 *
 * Parses error responses from the API and extracts meaningful error messages.
 * Falls back to default error message if parsing fails.
 *
 * @param response - The failed HTTP response
 * @returns Promise that rejects with an Error containing the error message
 * @throws Error with the extracted or default error message
 *
 * @example
 * ```typescript
 * if (!response.ok) {
 *   const data = await handleApiError(response);
 * }
 * ```
 */
export async function handleApiError(response: Response): Promise<never> {
  try {
    const errorData: ApiErrorResponse = await response.json();

    // Prefer the message field over error_name
    const errorMessage = errorData.message || errorData.error_name || getDefaultError();
    throw new Error(errorMessage);
  } catch (error) {
    // If JSON parsing fails or error is already thrown
    if (error instanceof Error && error.message !== getDefaultError()) {
      throw error;
    }

    // Fallback to default error
    throw new Error(getDefaultError());
  }
}

/**
 * Handles API responses and extracts data or throws errors
 *
 * Generic function to handle both successful and failed API responses.
 * Automatically parses JSON and handles errors.
 *
 * @param response - The HTTP response to handle
 * @returns Promise resolving to the parsed response data
 * @throws Error if the response is not ok
 *
 * @example
 * ```typescript
 * const response = await fetch(url);
 * const data = await handleApiResponse<UserProfileSchema>(response);
 * ```
 */
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

/**
 * Safely parses error response for logging purposes
 *
 * Attempts to parse error response as JSON, falls back to text if that fails.
 * Useful for debugging and logging.
 *
 * @param response - The failed HTTP response
 * @returns Promise resolving to error details object
 *
 * @example
 * ```typescript
 * const errorDetails = await parseErrorResponse(response);
 * console.error('API Error:', errorDetails);
 * ```
 */
export async function parseErrorResponse(response: Response): Promise<{
  status: number;
  statusText: string;
  body: unknown;
}> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    try {
      body = await response.text();
    } catch {
      body = null;
    }
  }

  return {
    status: response.status,
    statusText: response.statusText,
    body,
  };
}

/**
 * Determines if an error is a network error
 *
 * @param error - The error to check
 * @returns True if the error is a network-related error
 *
 * @example
 * ```typescript
 * try {
 *   await fetchData();
 * } catch (error) {
 *   if (isNetworkError(error)) {
 *     // Handle network error
 *   }
 * }
 * ```
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }

  if (error instanceof Error) {
    return (
      error.message.includes('network') ||
      error.message.includes('NetworkError') ||
      error.message.includes('fetch')
    );
  }

  return false;
}

/**
 * Determines if an error is an authentication error
 *
 * @param error - The error to check or HTTP status code
 * @returns True if the error is authentication-related
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (error) {
 *   if (isAuthError(error)) {
 *     // Redirect to login
 *   }
 * }
 * ```
 */
export function isAuthError(error: unknown): boolean {
  if (typeof error === 'number') {
    return error === 401 || error === 403;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('unauthorized') ||
      message.includes('unauthenticated') ||
      message.includes('forbidden') ||
      message.includes('token')
    );
  }

  return false;
}

/**
 * Creates a user-friendly error message from an error object
 *
 * @param error - The error object
 * @param defaultMessage - Default message if extraction fails
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown, defaultMessage?: string): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return defaultMessage || getDefaultError();
}
