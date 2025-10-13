/**
 * Domain Models Barrel Export
 * 
 * This file exports all domain model types for convenient importing.
 * Domain models represent the internal data structures used within
 * the application, separate from API contracts.
 * 
 * @example
 * import type { User, Asset, AssetDetails } from '@/lib/types/models';
 */

// User models
export type {
  User,
  UserProfileUpdate,
  UserCredentials,
  UserRegistration,
} from './user.model';

// Asset models
export type {
  AssetCategory,
  LicenseColor,
  AssetType,
  License,
  Publisher,
  AssetSnapshot,
  Asset,
  AssetDetails,
  AssetFilters,
  AssetAccessRequest,
} from './asset.model';

