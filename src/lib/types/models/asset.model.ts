/**
 * Asset Domain Model
 * 
 * This file contains the internal asset models used throughout the application.
 * These models are separate from API types to allow for a clean separation
 * between API contracts and internal domain logic.
 */

/**
 * Asset category type (internal representation)
 */
export type AssetCategory = 'mushaf' | 'tafsir' | 'recitation';

/**
 * License color indicator
 * Visual indicator for license restrictions
 */
export type LicenseColor = 'green' | 'yellow' | 'red';

/**
 * Asset type based on category
 */
export type AssetType = 'translation' | 'tafsir' | 'audio';

/**
 * License information
 */
export interface License {
  /** License code (e.g., 'cc0', 'cc-by-4.0') */
  code: string;

  /** Full license name */
  name: string;

  /** Short license name */
  shortName?: string;

  /** License URL */
  url?: string;

  /** License icon URL */
  iconUrl?: string;
}

/**
 * Publisher information (minimal)
 */
export interface Publisher {
  /** Publisher unique identifier */
  id: number;

  /** Publisher name */
  name: string;

  /** Publisher icon/logo URL */
  iconUrl?: string;

  /** Publisher biography */
  bio?: string;

  /** Publisher description */
  description?: string;

  /** Whether publisher is verified */
  verified?: boolean;
}

/**
 * Asset snapshot/preview
 */
export interface AssetSnapshot {
  /** Snapshot image URL */
  thumbnailUrl: string;

  /** Snapshot title */
  title: string;

  /** Snapshot description */
  description: string;
}

/**
 * Asset model (list view)
 * Minimal asset data for list/grid displays
 */
export interface Asset {
  /** Asset unique identifier */
  id: string;

  /** Asset title */
  title: string;

  /** Asset description */
  description: string;

  /** Asset thumbnail URL */
  thumbnailUrl?: string;

  /** Asset category */
  category: AssetCategory | string;

  /** License information */
  license: string;

  /** License color indicator */
  licenseColor?: LicenseColor;

  /** Publisher name */
  publisher: string;

  /** Asset type */
  type?: AssetType;

  /** Whether current user has access */
  hasAccess?: boolean;

  /** Download count */
  downloadCount?: number;

  /** File size */
  fileSize?: string;
}

/**
 * Asset details model (detail view)
 * Complete asset information
 */
export interface AssetDetails extends Asset {
  /** Detailed description */
  longDescription: string;

  /** License information (full) */
  licenseInfo?: License;

  /** Publisher information (full) */
  publisherInfo?: Publisher;

  /** Preview snapshots */
  snapshots?: AssetSnapshot[];

  /** Technical details */
  technicalDetails?: {
    fileSize: string;
    format: string;
    encoding?: string;
    version?: string;
    language?: string;
  };

  /** Usage statistics */
  stats?: {
    downloadCount: number;
    viewCount?: number;
    createdAt: string;
    updatedAt: string;
  };

  /** Access information */
  access?: {
    hasAccess: boolean;
    requiresApproval?: boolean;
  };
}

/**
 * Asset filter options
 */
export interface AssetFilters {
  /** Search query */
  search?: string;

  /** Filter by categories */
  categories?: string[];

  /** Filter by licenses */
  licenses?: string[];

  /** Sort order */
  sortBy?: 'name' | 'date' | 'downloads';

  /** Sort direction */
  sortDirection?: 'asc' | 'desc';

  /** Current page */
  page?: number;

  /** Items per page */
  pageSize?: number;
}

/**
 * Asset access request data
 */
export interface AssetAccessRequest {
  /** Asset ID to request access for */
  assetId: number;

  /** Purpose of access */
  purpose: string;

  /** Intended use type */
  intendedUse: 'commercial' | 'non-commercial';
}

