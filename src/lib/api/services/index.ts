/**
 * API Services Barrel Export
 * 
 * This file exports all API service functions for convenient importing.
 * Services are organized by domain (auth, assets, etc.)
 * 
 * @example
 * import { loginUser, getUserProfile } from '@/lib/api/services';
 * import { getAssets, getAssetDetails } from '@/lib/api/services';
 */

// Auth service exports
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  getUserProfile,
  updateUserProfile,
  startGoogleOAuth,
  startGitHubOAuth,
} from './auth.service';

// Assets service exports
export {
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
} from './assets.service';

