/**
 * Assets, Resources, and Publishers API Types
 *
 * This file contains all type definitions related to assets, resources,
 * publishers, and access management.
 */

import type {
  CategoryChoice,
  StatusChoice,
  IntendedUseChoice,
  PagedResponse,
} from './common.types';

// ============================================================================
// Publisher Types
// ============================================================================

/**
 * Publisher information in asset list view
 * Minimal publisher data for list displays
 */
export interface ListAssetPublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Publisher name */
  name: string;
}

/**
 * Publisher information in asset detail view
 * Extended publisher data with description
 */
export interface DetailAssetPublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Publisher name */
  name: string;

  /** Publisher description */
  description: string;
}

/**
 * Complete publisher profile data
 * Full publisher information including contact details and verification status
 */
export interface DetailPublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Publisher name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Publisher description */
  description: string;

  /** Publisher physical address */
  address: string;

  /** Publisher website URL */
  website: string;

  /** Verification status */
  is_verified: boolean;

  /** Contact email address */
  contact_email: string;

  /** Publisher icon/logo URL */
  icon_url: string | null;
}

/**
 * Publisher information in resource list view
 */
export interface ListResourcePublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Publisher name */
  name: string;
}

/**
 * Publisher information in resource detail view
 */
export interface DetailResourcePublisherOut {
  /** Unique identifier for the publisher */
  id: number;

  /** Publisher name */
  name: string;

  /** Publisher description */
  description: string;
}

// ============================================================================
// Asset Types
// ============================================================================

/**
 * Asset in list view
 * Minimal asset data for list/grid displays
 */
export interface ListAssetOut {
  /** Unique identifier for the asset */
  id: number;

  /** Asset category */
  category: string;

  /** Asset name */
  name: string;

  /** Asset description */
  description: string;

  /** Publisher information */
  publisher: ListAssetPublisherOut;

  /** License name */
  license: string;
}

/**
 * Asset snapshot/preview image
 * Represents a preview image with metadata
 */
export interface DetailAssetSnapshotOut {
  /** URL to the snapshot image */
  image_url: string;

  /** Snapshot title */
  title: string;

  /** Snapshot description */
  description: string;
}

/**
 * Resource reference in asset detail
 * Links an asset to its parent resource
 */
export interface DetailAssetResourceOut {
  /** Unique identifier for the resource */
  id: number;
}

/**
 * Asset in detail view
 * Complete asset data including snapshots and full descriptions
 */
export interface DetailAssetOut {
  /** Unique identifier for the asset */
  id: number;

  /** Asset category */
  category: string;

  /** Asset name */
  name: string;

  /** Short description */
  description: string;

  /** Detailed description */
  long_description: string;

  /** Thumbnail image URL */
  thumbnail_url: string;

  /** Publisher information */
  publisher: DetailAssetPublisherOut;

  /** Parent resource reference */
  resource: DetailAssetResourceOut;

  /** License name */
  license: string;

  /** Preview snapshots */
  snapshots: DetailAssetSnapshotOut[];
}

/**
 * Paginated asset list response
 */
export interface PagedListAssetOut extends PagedResponse<ListAssetOut> {
  /** Array of assets */
  results: ListAssetOut[];

  /** Total count of assets */
  count: number;
}

// ============================================================================
// Resource Types
// ============================================================================

/**
 * Resource in list view
 * Minimal resource data for list displays
 */
export interface ListResourceOut {
  /** Unique identifier for the resource */
  id: number;

  /** Resource category */
  category: string;

  /** Resource name */
  name: string;

  /** Resource description */
  description: string;

  /** Resource status */
  status: string;

  /** Publisher information */
  publisher: ListResourcePublisherOut;

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

/**
 * Resource in detail view
 * Complete resource data including slug
 */
export interface DetailResourceOut {
  /** Unique identifier for the resource */
  id: number;

  /** Resource category */
  category: string;

  /** Resource name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Resource description */
  description: string;

  /** Resource status */
  status: string;

  /** Publisher information */
  publisher: DetailResourcePublisherOut;

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

/**
 * Paginated resource list response
 */
export interface PagedListResourceOut extends PagedResponse<ListResourceOut> {
  /** Array of resources */
  results: ListResourceOut[];

  /** Total count of resources */
  count: number;
}

/**
 * Resource creation request
 * Data required to create a new resource
 */
export interface CreateResourceIn {
  /** Resource name */
  name: string;

  /** Resource description */
  description: string;

  /** Resource category */
  category: CategoryChoice;

  /** Publisher ID */
  publisher_id: number;
}

/**
 * Resource update request
 * Data that can be updated on a resource
 */
export interface UpdateResourceIn {
  /** Resource name */
  name?: string | null;

  /** Resource description */
  description?: string | null;

  /** Resource category */
  category?: CategoryChoice | null;

  /** Resource status */
  status?: StatusChoice | null;
}

/**
 * Complete resource data
 * Returned after create/update operations
 */
export interface ResourceOut {
  /** Unique identifier for the resource */
  id: number;

  /** Resource category */
  category: string;

  /** Resource name */
  name: string;

  /** URL-friendly slug */
  slug: string;

  /** Resource description */
  description: string;

  /** Resource status */
  status: string;

  /** Publisher ID */
  publisher_id: number;

  /** Creation timestamp */
  created_at: string;

  /** Last update timestamp */
  updated_at: string;
}

// ============================================================================
// Access Management Types
// ============================================================================

/**
 * Access request submission data
 * Data required to request access to an asset
 */
export interface RequestAccessIn {
  /** Purpose/reason for access request */
  purpose: string;

  /** Intended use type */
  intended_use: IntendedUseChoice;
}

/**
 * Access request data
 * Represents a user's request to access an asset
 */
export interface AccessRequestOut {
  /** Unique identifier for the access request */
  id: number;

  /** ID of the asset being requested */
  asset_id: number;

  /** Purpose/reason for access */
  purpose: string;

  /** Intended use type */
  intended_use: string;

  /** Request status (pending, approved, rejected) */
  status: string;

  /** Request creation timestamp */
  created_at: string;
}

/**
 * Access grant data
 * Represents granted access to an asset
 */
export interface AccessGrantOut {
  /** Unique identifier for the access grant */
  id: number;

  /** ID of the asset access is granted for */
  asset_id: number;

  /** Grant expiration timestamp (null if permanent) */
  expires_at: string | null;

  /** Whether the grant is currently active */
  is_active: boolean;
}

/**
 * Access request response
 * Combined request and grant information
 */
export interface AccessRequestResponseOut {
  /** The access request */
  request: AccessRequestOut;

  /** The access grant (if approved) */
  access: AccessGrantOut | null;
}

/**
 * Asset access status
 * Information about current user's access to an asset
 */
export interface AssetAccessStatusOut {
  /** Whether the user has access */
  has_access: boolean;

  /** Whether access requires approval */
  requires_approval: boolean;
}

// ============================================================================
// Download Types
// ============================================================================

/**
 * Download response
 * Contains the download URL for an asset or resource
 */
export interface DownloadResponseOut {
  /** Download URL path (relative to backend URL) */
  download_url: string;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Asset list filter parameters
 */
export interface AssetListFilters {
  /** Filter by categories */
  category?: string[];

  /** Filter by license codes */
  license_code?: string[];

  /** Search query */
  search?: string;

  /** Sort ordering */
  ordering?: string;

  /** Page number */
  page?: number;

  /** Items per page */
  page_size?: number;
}

/**
 * Resource list filter parameters
 */
export interface ResourceListFilters {
  /** Filter by categories */
  category?: CategoryChoice[];

  /** Filter by status */
  status?: StatusChoice[];

  /** Filter by publisher IDs */
  publisher_id?: number[];

  /** Search query */
  search?: string;

  /** Sort ordering */
  ordering?: string;

  /** Page number */
  page?: number;

  /** Items per page */
  page_size?: number;
}
