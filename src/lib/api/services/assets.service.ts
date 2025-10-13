/**
 * Assets API Service
 * 
 * This service handles all asset-related API operations including:
 * - Asset listing and filtering
 * - Asset details retrieval
 * - Access requests and permissions
 * - Asset downloads
 * - Resource management
 * - Publisher information
 * 
 * All functions use the centralized API client for consistent error handling
 * and request formatting.
 */

import { apiGet, apiPost, apiPut, apiPatch, apiDelete, buildUrlWithParams } from '../client';
import type {
  PagedListAssetOut,
  DetailAssetOut,
  AssetAccessStatusOut,
  RequestAccessIn,
  AccessRequestResponseOut,
  DownloadResponseOut,
  PagedListResourceOut,
  DetailResourceOut,
  CreateResourceIn,
  UpdateResourceIn,
  ResourceOut,
  DetailPublisherOut,
  AssetListFilters,
  ResourceListFilters,
} from '@/lib/types/api/assets.types';
import type { OkSchema } from '@/lib/types/api/common.types';

// ============================================================================
// Asset Operations
// ============================================================================

/**
 * Retrieves a paginated list of assets
 * 
 * Fetches assets with optional filtering by category, license, and search query.
 * Supports pagination and sorting.
 * 
 * @param token - Optional access token for authenticated requests
 * @param filters - Filter and pagination options
 * @returns Promise resolving to paginated asset list
 * 
 * @example
 * ```typescript
 * const assets = await getAssets(token, {
 *   category: ['mushaf', 'tafsir'],
 *   license_code: ['cc0'],
 *   search: 'quran',
 *   page: 1,
 *   page_size: 20,
 * });
 * ```
 */
export async function getAssets(
  token?: string,
  filters?: AssetListFilters
): Promise<PagedListAssetOut> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = buildUrlWithParams('/assets/', filters as any);
  return apiGet<PagedListAssetOut>(url, token);
}

/**
 * Retrieves detailed information for a specific asset
 * 
 * Fetches complete asset details including snapshots, publisher info,
 * and technical specifications.
 * 
 * @param assetId - Unique asset identifier
 * @param token - Optional access token for authenticated requests
 * @returns Promise resolving to detailed asset information
 * @throws Error if asset not found
 * 
 * @example
 * ```typescript
 * const asset = await getAssetDetails(123, token);
 * console.log(asset.name, asset.long_description);
 * ```
 */
export async function getAssetDetails(
  assetId: number,
  token?: string
): Promise<DetailAssetOut> {
  return apiGet<DetailAssetOut>(`/assets/${assetId}/`, token);
}

/**
 * Checks the current user's access status for an asset
 * 
 * Determines whether the user has access to download the asset
 * and whether approval is required.
 * 
 * @param assetId - Unique asset identifier
 * @param token - Access token for authentication
 * @returns Promise resolving to access status information
 * 
 * @example
 * ```typescript
 * const status = await getAssetAccessStatus(123, token);
 * if (status.has_access) {
 *   // Show download button
 * } else if (status.requires_approval) {
 *   // Show request access button
 * }
 * ```
 */
export async function getAssetAccessStatus(
  assetId: number,
  token: string
): Promise<AssetAccessStatusOut> {
  return apiGet<AssetAccessStatusOut>(`/assets/${assetId}/access-status/`, token);
}

/**
 * Requests access to a restricted asset
 * 
 * Submits an access request for assets that require approval.
 * Returns the created request and optionally an access grant if auto-approved.
 * 
 * @param assetId - Unique asset identifier
 * @param data - Access request details (purpose and intended use)
 * @param token - Access token for authentication
 * @returns Promise resolving to access request and optional grant
 * 
 * @example
 * ```typescript
 * const response = await requestAssetAccess(123, {
 *   purpose: 'Research project on Quranic studies',
 *   intended_use: 'non-commercial',
 * }, token);
 * 
 * if (response.access) {
 *   // Access granted immediately
 * } else {
 *   // Request pending approval
 * }
 * ```
 */
export async function requestAssetAccess(
  assetId: number,
  data: RequestAccessIn,
  token: string
): Promise<AccessRequestResponseOut> {
  return apiPost<AccessRequestResponseOut>(`/assets/${assetId}/request-access/`, data, token);
}

/**
 * Downloads an asset
 * 
 * Retrieves the download URL for an asset. The user must have access
 * to the asset (either public or granted access).
 * 
 * @param assetId - Unique asset identifier
 * @param token - Access token for authentication
 * @returns Promise resolving to download URL
 * @throws Error if user doesn't have access
 * 
 * @example
 * ```typescript
 * const { download_url } = await downloadAsset(123, token);
 * const fullUrl = `${API_BASE_URL}${download_url}`;
 * window.location.href = fullUrl;
 * ```
 */
export async function downloadAsset(
  assetId: number,
  token: string
): Promise<DownloadResponseOut> {
  return apiGet<DownloadResponseOut>(`/assets/${assetId}/download/`, token);
}

// ============================================================================
// Resource Operations
// ============================================================================

/**
 * Retrieves a paginated list of resources
 * 
 * Fetches resources with optional filtering by category, status, and publisher.
 * Supports pagination and sorting.
 * 
 * @param token - Optional access token for authenticated requests
 * @param filters - Filter and pagination options
 * @returns Promise resolving to paginated resource list
 * 
 * @example
 * ```typescript
 * const resources = await getResources(token, {
 *   category: ['mushaf'],
 *   status: ['ready'],
 *   publisher_id: [1, 2, 3],
 * });
 * ```
 */
export async function getResources(
  token?: string,
  filters?: ResourceListFilters
): Promise<PagedListResourceOut> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const url = buildUrlWithParams('/resources/', filters as any);
  return apiGet<PagedListResourceOut>(url, token);
}

/**
 * Retrieves detailed information for a specific resource
 * 
 * Fetches complete resource details including publisher information
 * and metadata.
 * 
 * @param resourceId - Unique resource identifier
 * @param token - Optional access token for authenticated requests
 * @returns Promise resolving to detailed resource information
 * @throws Error if resource not found
 * 
 * @example
 * ```typescript
 * const resource = await getResourceDetails(456, token);
 * ```
 */
export async function getResourceDetails(
  resourceId: number,
  token?: string
): Promise<DetailResourceOut> {
  return apiGet<DetailResourceOut>(`/resources/${resourceId}/`, token);
}

/**
 * Creates a new resource
 * 
 * Creates a new resource associated with a publisher.
 * Requires publisher permissions.
 * 
 * @param data - Resource creation data
 * @param token - Access token for authentication
 * @returns Promise resolving to created resource
 * @throws Error if user doesn't have publisher permissions
 * 
 * @example
 * ```typescript
 * const resource = await createResource({
 *   name: 'New Tafsir Collection',
 *   description: 'Comprehensive tafsir texts',
 *   category: 'tafsir',
 *   publisher_id: 1,
 * }, token);
 * ```
 */
export async function createResource(
  data: CreateResourceIn,
  token: string
): Promise<ResourceOut> {
  return apiPost<ResourceOut>('/resources/', data, token);
}

/**
 * Updates an existing resource (full update)
 * 
 * Replaces all resource fields with new values. All fields must be provided.
 * 
 * @param resourceId - Unique resource identifier
 * @param data - Complete resource data
 * @param token - Access token for authentication
 * @returns Promise resolving to updated resource
 * @throws Error if user doesn't have permissions or resource not found
 * 
 * @example
 * ```typescript
 * const updated = await updateResource(456, {
 *   name: 'Updated Resource Name',
 *   description: 'Updated description',
 *   category: 'tafsir',
 *   status: 'ready',
 * }, token);
 * ```
 */
export async function updateResource(
  resourceId: number,
  data: UpdateResourceIn,
  token: string
): Promise<ResourceOut> {
  return apiPut<ResourceOut>(`/resources/${resourceId}/`, data, token);
}

/**
 * Partially updates an existing resource
 * 
 * Updates only the provided fields, leaving others unchanged.
 * 
 * @param resourceId - Unique resource identifier
 * @param data - Partial resource data to update
 * @param token - Access token for authentication
 * @returns Promise resolving to updated resource
 * @throws Error if user doesn't have permissions or resource not found
 * 
 * @example
 * ```typescript
 * const updated = await partialUpdateResource(456, {
 *   status: 'ready', // Only update status
 * }, token);
 * ```
 */
export async function partialUpdateResource(
  resourceId: number,
  data: UpdateResourceIn,
  token: string
): Promise<ResourceOut> {
  return apiPatch<ResourceOut>(`/resources/${resourceId}/`, data, token);
}

/**
 * Deletes a resource
 * 
 * Permanently deletes a resource. This action cannot be undone.
 * 
 * @param resourceId - Unique resource identifier
 * @param token - Access token for authentication
 * @returns Promise resolving to success message
 * @throws Error if user doesn't have permissions or resource not found
 * 
 * @example
 * ```typescript
 * await deleteResource(456, token);
 * console.log('Resource deleted successfully');
 * ```
 */
export async function deleteResource(
  resourceId: number,
  token: string
): Promise<OkSchema> {
  return apiDelete<OkSchema>(`/resources/${resourceId}/`, token);
}

/**
 * Downloads the original resource file
 * 
 * Retrieves the download URL for a resource's original file.
 * Requires appropriate permissions.
 * 
 * @param resourceId - Unique resource identifier
 * @param token - Access token for authentication
 * @returns Promise resolving to download URL
 * @throws Error if user doesn't have access
 * 
 * @example
 * ```typescript
 * const { download_url } = await downloadOriginalResource(456, token);
 * const fullUrl = `${API_BASE_URL}${download_url}`;
 * window.location.href = fullUrl;
 * ```
 */
export async function downloadOriginalResource(
  resourceId: number,
  token: string
): Promise<DownloadResponseOut> {
  return apiGet<DownloadResponseOut>(`/resources/${resourceId}/download/`, token);
}

// ============================================================================
// Publisher Operations
// ============================================================================

/**
 * Retrieves detailed information for a specific publisher
 * 
 * Fetches complete publisher profile including verification status,
 * contact information, and statistics.
 * 
 * @param publisherId - Unique publisher identifier
 * @param token - Optional access token for authenticated requests
 * @returns Promise resolving to detailed publisher information
 * @throws Error if publisher not found
 * 
 * @example
 * ```typescript
 * const publisher = await getPublisherDetails(1, token);
 * console.log(publisher.name, publisher.is_verified);
 * ```
 */
export async function getPublisherDetails(
  publisherId: number,
  token?: string
): Promise<DetailPublisherOut> {
  return apiGet<DetailPublisherOut>(`/publishers/${publisherId}/`, token);
}

