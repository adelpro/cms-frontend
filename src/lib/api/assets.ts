import { env } from '@/lib/env';

// API base URL according to the API contract
const API_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL;

// API Types based on the new contract
export interface CategoryChoice {
  value: 'recitation' | 'mushaf' | 'tafsir';
}

export interface StatusChoice {
  value: 'draft' | 'ready';
}

export interface IntendedUseChoice {
  value: 'commercial' | 'non-commercial';
}

// Publisher types
export interface ListAssetPublisherOut {
  id: number;
  name: string;
}

export interface DetailAssetPublisherOut {
  id: number;
  name: string;
  description: string;
}

export interface DetailPublisherOut {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  website: string;
  is_verified: boolean;
  contact_email: string;
  icon_url: string | null;
}

// Asset types
export interface ListAssetOut {
  id: number;
  category: string;
  name: string;
  description: string;
  publisher: ListAssetPublisherOut;
  license: string;
}

export interface DetailAssetSnapshotOut {
  image_url: string;
  title: string;
  description: string;
}

export interface DetailAssetResourceOut {
  id: number;
}

export interface DetailAssetOut {
  id: number;
  category: string;
  name: string;
  description: string;
  long_description: string;
  thumbnail_url: string;
  publisher: DetailAssetPublisherOut;
  resource: DetailAssetResourceOut;
  license: string;
  snapshots: DetailAssetSnapshotOut[];
}

// Paginated response types
export interface PagedListAssetOut {
  results: ListAssetOut[];
  count: number;
}

// Access request types
export interface RequestAccessIn {
  purpose: string;
  intended_use: IntendedUseChoice['value'];
}

export interface AccessRequestOut {
  id: number;
  asset_id: number;
  purpose: string;
  intended_use: string;
  status: string;
  created_at: string;
}

export interface AccessGrantOut {
  id: number;
  asset_id: number;
  expires_at: string | null;
  is_active: boolean;
}

export interface AccessRequestResponseOut {
  request: AccessRequestOut;
  access: AccessGrantOut | null;
}

export interface AssetAccessStatusOut {
  has_access: boolean;
  requires_approval: boolean;
}

// Resource types
export interface ListResourcePublisherOut {
  id: number;
  name: string;
}

export interface DetailResourcePublisherOut {
  id: number;
  name: string;
  description: string;
}

export interface ListResourceOut {
  id: number;
  category: string;
  name: string;
  description: string;
  status: string;
  publisher: ListResourcePublisherOut;
  created_at: string;
  updated_at: string;
}

export interface DetailResourceOut {
  id: number;
  category: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  publisher: DetailResourcePublisherOut;
  created_at: string;
  updated_at: string;
}

export interface PagedListResourceOut {
  results: ListResourceOut[];
  count: number;
}

export interface CreateResourceIn {
  name: string;
  description: string;
  category: CategoryChoice['value'];
  publisher_id: number;
}

export interface UpdateResourceIn {
  name?: string | null;
  description?: string | null;
  category?: CategoryChoice['value'] | null;
  status?: StatusChoice['value'] | null;
}

export interface ResourceOut {
  id: number;
  category: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  publisher_id: number;
  created_at: string;
  updated_at: string;
}

// Common response types
export interface OkSchema {
  message: string;
}

export interface ApiErrorResponse {
  error_name: string;
  message: string;
  extra?: unknown;
}

// Legacy license interface for backward compatibility (using mock data)
export interface ApiLicenseDetails {
  code: string;
  name: string;
  short_name: string;
  url: string;
  icon_url: string;
  summary: string;
  full_text: string;
  legal_code_url: string;
  license_terms: Array<{
    title: string;
    description: string;
    order: number;
  }>;
  permissions: Array<{ key: string; label: string; description: string }>;
  conditions: Array<object>;
  limitations: Array<{ key: string; label: string; description: string }>;
  usage_count: number;
  is_default: boolean;
}

export interface ApiPublisherDetails {
  id: number;
  name: string;
  description: string;
  bio?: string;
  thumbnail_url?: string;
  cover_url?: string | null;
  location?: string | null;
  website?: string | null;
  verified?: boolean;
  social_links?: {
    twitter?: string | null;
    github?: string | null;
  };
  stats?: {
    resources_count: number;
    assets_count: number;
    total_downloads: number;
    joined_at: string;
  };
  assets?: ApiAssetSummary[];
}

export interface ApiLicenseDetails {
  code: string;
  name: string;
  short_name: string;
  url: string;
  icon_url: string;
  summary: string;
  full_text: string;
  legal_code_url: string;
  license_terms: Array<{
    title: string;
    description: string;
    order: number;
  }>;
  permissions: Array<{ key: string; label: string; description: string }>;
  conditions: Array<object>;
  limitations: Array<{ key: string; label: string; description: string }>;
  usage_count: number;
  is_default: boolean;
}

// Utility functions
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
}

function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

// API Functions
export async function getAssets(
  token?: string,
  filters?: {
    category?: string[]; // Array of categories
    license_code?: string[]; // Array of license codes
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }
): Promise<PagedListAssetOut> {
  const queryParts: string[] = [];
  
  if (filters?.category && filters.category.length > 0) {
    filters.category.forEach(cat => queryParts.push(`category=${cat}`));
  }
  if (filters?.license_code && filters.license_code.length > 0) {
    filters.license_code.forEach(license => queryParts.push(`license_code=${license}`));
  }
  if (filters?.search) {
    queryParts.push(`search=${encodeURIComponent(filters.search)}`);
  }
  if (filters?.ordering) {
    queryParts.push(`ordering=${encodeURIComponent(filters.ordering)}`);
  }
  if (filters?.page) {
    queryParts.push(`page=${filters.page}`);
  }
  if (filters?.page_size) {
    queryParts.push(`page_size=${filters.page_size}`);
  }
  
  const baseUrl = `${API_BASE_URL}/assets/`;
  const finalUrl = queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
  
  console.log('Final URL being sent:', finalUrl);

  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<PagedListAssetOut>(response);
}

export async function getAssetDetails(
  assetId: number,
  token?: string
): Promise<DetailAssetOut> {
  const url = `${API_BASE_URL}/assets/${assetId}/`;
  console.log('Fetching asset details from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Asset details response status:', response.status);
  console.log('Asset details response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Asset details error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Asset details response data:', data);
  
  return data;
}

export async function requestAssetAccess(
  assetId: number,
  data: RequestAccessIn,
  token: string
): Promise<AccessRequestResponseOut> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}/request-access/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleApiResponse<AccessRequestResponseOut>(response);
}

export async function getAssetAccessStatus(
  assetId: number,
  token: string
): Promise<AssetAccessStatusOut> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}/access-status/`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<AssetAccessStatusOut>(response);
}

export async function downloadAsset(
  assetId: number,
  token: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}/download/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.message);
  }

  return response.blob();
}

export async function downloadOriginalResource(
  resourceId: number,
  token: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/download/`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.message);
  }

  return response.blob();
}

export async function getPublisherDetails(
  publisherId: number,
  token?: string
): Promise<DetailPublisherOut> {
  const url = `${API_BASE_URL}/publishers/${publisherId}/`;
  console.log('Fetching publisher details from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Publisher details response status:', response.status);
  console.log('Publisher details response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Publisher details error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Publisher details response data:', data);
  
  return data;
}

// Resource API Functions
export async function getResources(
  token?: string,
  filters?: {
    category?: CategoryChoice['value'][];
    status?: StatusChoice['value'][];
    publisher_id?: number[];
    search?: string;
    ordering?: string;
    page?: number;
    page_size?: number;
  }
): Promise<PagedListResourceOut> {
  const queryParts: string[] = [];
  
  if (filters?.category && filters.category.length > 0) {
    filters.category.forEach(cat => queryParts.push(`category=${cat}`));
  }
  if (filters?.status && filters.status.length > 0) {
    filters.status.forEach(status => queryParts.push(`status=${status}`));
  }
  if (filters?.publisher_id && filters.publisher_id.length > 0) {
    filters.publisher_id.forEach(id => queryParts.push(`publisher_id=${id}`));
  }
  if (filters?.search) {
    queryParts.push(`search=${encodeURIComponent(filters.search)}`);
  }
  if (filters?.ordering) {
    queryParts.push(`ordering=${encodeURIComponent(filters.ordering)}`);
  }
  if (filters?.page) {
    queryParts.push(`page=${filters.page}`);
  }
  if (filters?.page_size) {
    queryParts.push(`page_size=${filters.page_size}`);
  }
  
  const baseUrl = `${API_BASE_URL}/resources/`;
  const finalUrl = queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
  
  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<PagedListResourceOut>(response);
}

export async function getResourceDetails(
  resourceId: number,
  token?: string
): Promise<DetailResourceOut> {
  const url = `${API_BASE_URL}/resources/${resourceId}/`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function createResource(
  data: CreateResourceIn,
  token: string
): Promise<ResourceOut> {
  const response = await fetch(`${API_BASE_URL}/resources/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleApiResponse<ResourceOut>(response);
}

export async function updateResource(
  resourceId: number,
  data: UpdateResourceIn,
  token: string
): Promise<ResourceOut> {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleApiResponse<ResourceOut>(response);
}

export async function partialUpdateResource(
  resourceId: number,
  data: UpdateResourceIn,
  token: string
): Promise<ResourceOut> {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleApiResponse<ResourceOut>(response);
}

export async function deleteResource(
  resourceId: number,
  token: string
): Promise<OkSchema> {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<OkSchema>(response);
}

// Legacy type aliases for backward compatibility

// Legacy interfaces for backward compatibility
export interface ApiLicense {
  code: string;
  name: string;
}

export interface ApiPublisher {
  id: number;
  name: string;
  thumbnail_url?: string;
  bio?: string;
  verified?: boolean;
}

export interface ApiAsset {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  category: 'mushaf' | 'tafsir' | 'recitation';
  license: ApiLicense;
  publisher: ApiPublisher;
  has_access: boolean;
  download_count?: number;
  file_size?: string;
}

export type ApiAssetSummary = ApiAsset;

export interface ApiAssetsResponse {
  assets: ApiAsset[];
}

export interface ApiAssetDetails extends ApiAsset {
  long_description: string;
  snapshots?: Array<{
    thumbnail_url: string;
    title: string;
    description: string;
  }>;
  technical_details?: {
    file_size: string;
    format: string;
    encoding: string;
    version: string;
    language: string;
  };
  stats?: {
    download_count: number;
    view_count: number;
    created_at: string;
    updated_at: string;
  };
  access?: {
    has_access: boolean;
    requires_approval: boolean;
  };
}


// Conversion functions for backward compatibility
export function convertListAssetToApiAsset(listAsset: ListAssetOut): ApiAsset {
  return {
    id: listAsset.id,
    title: listAsset.name,
    description: listAsset.description,
    thumbnail_url: '', // Not provided in list view
    category: listAsset.category as 'mushaf' | 'tafsir' | 'recitation',
    license: {
      code: listAsset.license.toLowerCase().replace(/\s+/g, '-'),
      name: listAsset.license,
    },
    publisher: {
      id: listAsset.publisher.id,
      name: listAsset.publisher.name,
    },
    has_access: false, // Default, should be checked separately
  };
}

export function convertDetailAssetToApiAssetDetails(detailAsset: DetailAssetOut): ApiAssetDetails {
  return {
    id: detailAsset.id,
    title: detailAsset.name,
    description: detailAsset.description,
    long_description: detailAsset.long_description,
    thumbnail_url: detailAsset.thumbnail_url,
    category: detailAsset.category as 'mushaf' | 'tafsir' | 'recitation',
    license: {
      code: detailAsset.license.toLowerCase().replace(/\s+/g, '-'),
      name: detailAsset.license,
    },
    publisher: {
      id: detailAsset.publisher.id,
      name: detailAsset.publisher.name,
      bio: detailAsset.publisher.description,
    },
    has_access: false, // Should be checked separately
    snapshots: detailAsset.snapshots?.map(snapshot => ({
      thumbnail_url: snapshot.image_url,
      title: snapshot.title,
      description: snapshot.description,
    })),
  };
}

export function convertDetailPublisherToApiPublisherDetails(detailPublisher: DetailPublisherOut): ApiPublisherDetails {
  return {
    id: detailPublisher.id,
    name: detailPublisher.name,
    description: detailPublisher.description,
    thumbnail_url: detailPublisher.icon_url || '',
    bio: detailPublisher.description,
    verified: detailPublisher.is_verified,
    location: detailPublisher.address,
    website: detailPublisher.website,
  };
}

// Legacy conversion functions for backward compatibility
export function convertApiAssetToAsset(apiAsset: ApiAsset) {
  return {
    id: apiAsset.id.toString(),
    title: apiAsset.title,
    description: apiAsset.description,
    license: apiAsset.license?.name || 'Unknown License',
    publisher: apiAsset.publisher?.name || 'Unknown Publisher',
    category: apiAsset.category,
    licenseColor: getLicenseColor(apiAsset.license?.code || ''),
    type: getAssetType(apiAsset.category),
    thumbnail_url: apiAsset.thumbnail_url,
    has_access: apiAsset.has_access,
    download_count: apiAsset.download_count || 0,
    file_size: apiAsset.file_size || 'Unknown',
  };
}

export function convertApiAssetSummaryToAsset(apiAssetSummary: ApiAssetSummary) {
  return convertApiAssetToAsset(apiAssetSummary);
}

// New conversion functions for the updated API
export function convertListAssetToAsset(listAsset: ListAssetOut) {
  return {
    id: listAsset.id.toString(),
    title: listAsset.name,
    description: listAsset.description,
    license: listAsset.license,
    publisher: listAsset.publisher.name,
    category: listAsset.category,
    licenseColor: getLicenseColor(listAsset.license.toLowerCase().replace(/\s+/g, '-')),
    type: getAssetType(listAsset.category),
    thumbnail_url: '', // Not provided in list view
    has_access: false, // Should be checked separately
    download_count: 0,
    file_size: 'Unknown',
  };
}

function getLicenseColor(licenseCode: string): 'green' | 'yellow' | 'red' {
  const greenLicenses = ['cc0', 'cc-by-4.0'];
  const yellowLicenses = ['cc-by-sa-4.0', 'cc-by-nd-4.0', 'cc-by-nc-4.0'];
  const redLicenses = ['cc-by-nc-sa-4.0', 'cc-by-nc-nd-4.0'];
  
  if (greenLicenses.includes(licenseCode)) return 'green';
  if (yellowLicenses.includes(licenseCode)) return 'yellow';
  if (redLicenses.includes(licenseCode)) return 'red';
  return 'green'; // default
}

function getAssetType(category: string): 'translation' | 'tafsir' | 'audio' {
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

// Mock license data since the new API doesn't have license endpoints
const mockLicenseData: Record<string, ApiLicenseDetails> = {
  'cc-by': {
    code: 'cc-by',
    name: 'Creative Commons Attribution 4.0 International',
    short_name: 'CC BY 4.0',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    icon_url: 'https://licensebuttons.net/l/by/4.0/88x31.png',
    summary: 'This license allows reusers to distribute, remix, adapt, and build upon the material in any medium or format, so long as attribution is given to the creator.',
    full_text: 'You are free to share and adapt this work under the following terms: Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.',
    legal_code_url: 'https://creativecommons.org/licenses/by/4.0/legalcode',
    license_terms: [
      {
        title: 'Attribution',
        description: 'You must give appropriate credit, provide a link to the license, and indicate if changes were made.',
        order: 1
      }
    ],
    permissions: [
      { key: 'commercial-use', label: 'Commercial use', description: 'The licensed material may be used for commercial purposes.' },
      { key: 'modification', label: 'Modification', description: 'The licensed material may be modified and derivatives may be created.' },
      { key: 'distribution', label: 'Distribution', description: 'The licensed material may be distributed.' },
      { key: 'private-use', label: 'Private use', description: 'The licensed material may be used for private purposes.' }
    ],
    conditions: [
      { key: 'include-copyright', label: 'License and copyright notice', description: 'A copy of the license and copyright notice must be included with the licensed material.' }
    ],
    limitations: [],
    usage_count: 0,
    is_default: false
  },
  'cc0': {
    code: 'cc0',
    name: 'Creative Commons Zero v1.0 Universal',
    short_name: 'CC0 1.0',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    icon_url: 'https://licensebuttons.net/p/zero/1.0/88x31.png',
    summary: 'The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law.',
    full_text: 'No Copyright. The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.',
    legal_code_url: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
    license_terms: [],
    permissions: [
      { key: 'commercial-use', label: 'Commercial use', description: 'The licensed material may be used for commercial purposes.' },
      { key: 'modification', label: 'Modification', description: 'The licensed material may be modified and derivatives may be created.' },
      { key: 'distribution', label: 'Distribution', description: 'The licensed material may be distributed.' },
      { key: 'private-use', label: 'Private use', description: 'The licensed material may be used for private purposes.' }
    ],
    conditions: [],
    limitations: [],
    usage_count: 0,
    is_default: true
  }
};

/**
 * Get license details (mock implementation since new API doesn't have license endpoints)
 */
export async function getLicenseDetails(
  licenseCode: string,
  _token?: string
): Promise<ApiLicenseDetails> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const license = mockLicenseData[licenseCode] || mockLicenseData['cc-by'];
  return Promise.resolve(license);
}
