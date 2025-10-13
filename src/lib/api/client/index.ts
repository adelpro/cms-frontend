/**
 * API Client Barrel Export
 * 
 * This file exports all API client utilities for convenient importing.
 * 
 * @example
 * import { apiGet, apiPost, buildUrlWithParams } from '@/lib/api/client';
 */

export {
  API_BASE_URL,
  getAuthHeaders,
  apiRequest,
  apiGet,
  apiPost,
  apiPut,
  apiPatch,
  apiDelete,
  buildUrlWithParams,
} from './base';

export type {
  ApiRequestOptions,
} from './base';

export {
  handleApiError,
  handleApiResponse,
  parseErrorResponse,
  isNetworkError,
  isAuthError,
  getErrorMessage,
} from './error-handler';

