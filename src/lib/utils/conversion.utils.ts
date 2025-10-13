/**
 * Conversion Utilities
 * 
 * This file contains utility functions for converting between different data formats,
 * particularly between API types and domain models.
 */

import type {
  UserProfileSchema,
  ListAssetOut,
  DetailAssetOut,
  DetailPublisherOut,
} from '../types/api';
import type {
  User,
  Asset,
  AssetDetails,
  Publisher,
  LicenseColor,
  AssetType,
} from '../types/models';

// ============================================================================
// User Conversions
// ============================================================================

/**
 * Converts API user profile to internal user model
 * 
 * @param userProfile - User profile data from API
 * @returns Internal user model
 * 
 * @example
 * const user = convertUserProfileToUser(apiUserProfile);
 */
export function convertUserProfileToUser(userProfile: UserProfileSchema): User {
  const nameParts = userProfile.name.split(' ');
  
  return {
    id: userProfile.id,
    email: userProfile.email,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    fullName: userProfile.name,
    jobTitle: userProfile.job_title || undefined,
    phoneNumber: userProfile.phone || undefined,
    bio: userProfile.bio || undefined,
    projectSummary: userProfile.project_summary || undefined,
    projectUrl: userProfile.project_url || undefined,
    provider: 'email', // Default, would need to be determined from auth context
    profileCompleted: userProfile.is_profile_completed,
    isActive: userProfile.is_active,
    createdAt: new Date(userProfile.created_at),
    updatedAt: new Date(userProfile.updated_at),
  };
}

// ============================================================================
// Asset Conversions
// ============================================================================

/**
 * Converts API list asset to internal asset model
 * 
 * @param listAsset - Asset data from list API
 * @returns Internal asset model
 * 
 * @example
 * const asset = convertListAssetToAsset(apiAsset);
 */
export function convertListAssetToAsset(listAsset: ListAssetOut): Asset {
  return {
    id: listAsset.id.toString(),
    title: listAsset.name,
    description: listAsset.description,
    license: listAsset.license,
    publisher: listAsset.publisher.name,
    category: listAsset.category,
    licenseColor: getLicenseColor(listAsset.license.toLowerCase().replace(/\s+/g, '-')),
    type: getAssetType(listAsset.category),
    thumbnailUrl: '', // Not provided in list view
    hasAccess: false, // Should be checked separately
    downloadCount: 0,
    fileSize: 'Unknown',
  };
}

/**
 * Converts API detail asset to internal asset details model
 * 
 * @param detailAsset - Detailed asset data from API
 * @returns Internal asset details model
 * 
 * @example
 * const assetDetails = convertDetailAssetToAssetDetails(apiAssetDetail);
 */
export function convertDetailAssetToAssetDetails(detailAsset: DetailAssetOut): AssetDetails {
  return {
    id: detailAsset.id.toString(),
    title: detailAsset.name,
    description: detailAsset.description,
    longDescription: detailAsset.long_description,
    thumbnailUrl: detailAsset.thumbnail_url,
    category: detailAsset.category,
    license: detailAsset.license,
    licenseColor: getLicenseColor(detailAsset.license.toLowerCase().replace(/\s+/g, '-')),
    publisher: detailAsset.publisher.name,
    type: getAssetType(detailAsset.category),
    hasAccess: false, // Should be checked separately
    publisherInfo: {
      id: detailAsset.publisher.id,
      name: detailAsset.publisher.name,
      description: detailAsset.publisher.description,
    },
    snapshots: detailAsset.snapshots?.map(snapshot => ({
      thumbnailUrl: snapshot.image_url,
      title: snapshot.title,
      description: snapshot.description,
    })),
  };
}

/**
 * Converts API publisher details to internal publisher model
 * 
 * @param detailPublisher - Publisher data from API
 * @returns Internal publisher model
 * 
 * @example
 * const publisher = convertDetailPublisherToPublisher(apiPublisher);
 */
export function convertDetailPublisherToPublisher(detailPublisher: DetailPublisherOut): Publisher {
  return {
    id: detailPublisher.id,
    name: detailPublisher.name,
    description: detailPublisher.description,
    bio: detailPublisher.description,
    verified: detailPublisher.is_verified,
    iconUrl: detailPublisher.icon_url || undefined,
  };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Determines license color based on license code
 * 
 * @param licenseCode - License code (e.g., 'cc0', 'cc-by-4.0')
 * @returns License color indicator
 * 
 * @example
 * const color = getLicenseColor('cc0'); // returns 'green'
 */
export function getLicenseColor(licenseCode: string): LicenseColor {
  const greenLicenses = ['cc0', 'cc-by', 'cc-by-4.0'];
  const yellowLicenses = ['cc-by-sa', 'cc-by-sa-4.0', 'cc-by-nd', 'cc-by-nd-4.0', 'cc-by-nc', 'cc-by-nc-4.0'];
  const redLicenses = ['cc-by-nc-sa', 'cc-by-nc-sa-4.0', 'cc-by-nc-nd', 'cc-by-nc-nd-4.0'];
  
  if (greenLicenses.includes(licenseCode)) return 'green';
  if (yellowLicenses.includes(licenseCode)) return 'yellow';
  if (redLicenses.includes(licenseCode)) return 'red';
  
  return 'green'; // default to green for unknown licenses
}

/**
 * Determines asset type based on category
 * 
 * @param category - Asset category
 * @returns Asset type
 * 
 * @example
 * const type = getAssetType('mushaf'); // returns 'translation'
 */
export function getAssetType(category: string): AssetType {
  switch (category) {
    case 'mushaf':
      return 'translation';
    case 'tafsir':
      return 'tafsir';
    case 'recitation':
      return 'audio';
    default:
      return 'translation';
  }
}

/**
 * Converts internal user registration data to API format
 * 
 * @param registration - User registration data
 * @returns API registration schema
 * 
 * @example
 * const apiData = convertUserRegistrationToApiFormat(registration);
 */
export function convertUserRegistrationToApiFormat(registration: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  jobTitle?: string;
  phoneNumber?: string;
}) {
  return {
    name: `${registration.firstName} ${registration.lastName}`.trim(),
    email: registration.email,
    password: registration.password,
    job_title: registration.jobTitle,
    phone: registration.phoneNumber,
  };
}

/**
 * Converts internal user profile update to API format
 * 
 * @param update - User profile update data
 * @returns API update schema
 * 
 * @example
 * const apiData = convertUserProfileUpdateToApiFormat(updateData);
 */
export function convertUserProfileUpdateToApiFormat(update: {
  name?: string;
  phone?: string;
  bio?: string;
  projectSummary?: string;
  projectUrl?: string;
  jobTitle?: string;
}) {
  return {
    name: update.name,
    phone: update.phone,
    bio: update.bio,
    project_summary: update.projectSummary,
    project_url: update.projectUrl,
    job_title: update.jobTitle,
  };
}

