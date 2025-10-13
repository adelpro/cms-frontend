/**
 * API Module Barrel Export
 * 
 * This is the main entry point for all API-related functionality.
 * It re-exports client utilities, services, and types.
 * 
 * @example
 * // Import services
 * import { loginUser, getAssets } from '@/lib/api';
 * 
 * // Import client utilities
 * import { apiGet, buildUrlWithParams } from '@/lib/api';
 */

// Re-export API client utilities
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
  handleApiError,
  handleApiResponse,
  parseErrorResponse,
  isNetworkError,
  isAuthError,
  getErrorMessage,
} from './client';

export type {
  ApiRequestOptions,
} from './client';

// Re-export all API services
export {
  // Auth services
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  startGoogleOAuth,
  startGitHubOAuth,
  
  // Assets services
  getAssets,
  getAssetDetails,
  getAssetAccessStatus,
  requestAssetAccess,
  downloadAsset,
  getResources,
  getResourceDetails,
  createResource,
  updateResource,
  partialUpdateResource,
  deleteResource,
  downloadOriginalResource,
  getPublisherDetails,
} from './services';

