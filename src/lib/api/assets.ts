import { env } from '@/lib/env';

// API base URL according to the API contract
const API_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL + "/api/v1";

// API Types based on the contract
export interface ApiLicense {
  code: string;
  name: string;
}

export interface ApiLicenseSummary {
  code: string;
  name: string;
  short_name: string;
  icon_url: string;
  is_default: boolean;
}

export interface ApiPublisher {
  id: number;
  name: string;
  thumbnail_url: string;
  bio?: string;
  verified?: boolean;
}

export interface ApiPublisherSummary {
  id: number;
  name: string;
  thumbnail_url: string;
  bio: string | null;
  verified: boolean;
}

export interface ApiAssetSummary {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  category: 'mushaf' | 'tafsir' | 'recitation';
  license: ApiLicenseSummary;
  publisher: ApiPublisherSummary;
  has_access: boolean;
  download_count: number;
  file_size: string;
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
  download_count: number;
  file_size: string;
}

export interface ApiAssetDetails {
  id: number;
  title: string;
  description: string;
  long_description: string;
  thumbnail_url: string;
  category: 'mushaf' | 'tafsir' | 'recitation';
  license: ApiLicenseDetails; // Full license details, not summary
  snapshots: Array<{
    thumbnail_url: string;
    title: string;
    description: string;
  }>;
  publisher: ApiPublisherSummary;
  resource: {
    id: number;
    title: string;
    description: string;
  } | null;
  technical_details: {
    file_size: string;
    format: string;
    encoding: string;
    version: string;
    language: string;
  };
  stats: {
    download_count: number;
    view_count: number;
    created_at: string;
    updated_at: string;
  };
  access: {
    has_access: boolean;
    requires_approval: boolean;
  };
  related_assets: Array<{
    id: number;
    title: string;
    thumbnail_url: string;
  }>;
}

export interface ApiAssetsResponse {
  assets: ApiAsset[];
}

export interface ApiAssetDetailsResponse {
  asset: ApiAssetDetails;
}

export interface ApiAccessRequest {
  purpose: string;
  intended_use: 'commercial' | 'non-commercial';
}

export interface ApiAccessRequestResponse {
  request_id: number;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  access?: {
    download_url: string;
    expires_at: string | null;
    granted_at: string;
  } | null;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiPublisherDetails {
  id: number;
  name: string;
  description: string;
  bio: string | null;
  thumbnail_url: string;
  cover_url: string | null;
  location: string | null;
  website: string | null;
  verified: boolean;
  social_links: {
    twitter?: string | null;
    github?: string | null;
  };
  stats: {
    resources_count: number;
    assets_count: number;
    total_downloads: number;
    joined_at: string;
  };
  assets: ApiAssetSummary[];
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
    throw new Error(errorData.error.message);
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
    category?: string; // Now supports comma-separated values like "mushaf,tafsir"
    license_code?: string; // Now supports comma-separated values like "cc0,cc-by-4.0"
  }
): Promise<ApiAssetsResponse> {
  // Manually construct query string to avoid URL encoding of commas
  const queryParts: string[] = [];
  
  if (filters?.category) {
    queryParts.push(`category=${filters.category}`);
    console.log('Category filter - Original:', filters.category);
  }
  if (filters?.license_code) {
    queryParts.push(`license_code=${filters.license_code}`);
    console.log('License filter - Original:', filters.license_code);
  }
  
  // Construct URL with unencoded query string
  const baseUrl = `${API_BASE_URL}/assets`;
  const finalUrl = queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;
  
  console.log('Final URL being sent:', finalUrl);

  const response = await fetch(finalUrl, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  return handleApiResponse<ApiAssetsResponse>(response);
}

export async function getAssetDetails(
  assetId: number,
  token?: string
): Promise<ApiAssetDetails> {
  const url = `${API_BASE_URL}/assets/${assetId}`;
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
  data: ApiAccessRequest,
  token: string
): Promise<ApiAccessRequestResponse> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}/request-access/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });

  return handleApiResponse<ApiAccessRequestResponse>(response);
}

export async function downloadAsset(
  assetId: number,
  token: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/assets/${assetId}/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.error.message);
  }

  return response.blob();
}

export async function downloadOriginalResource(
  resourceId: number,
  token: string
): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/download`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json();
    throw new Error(errorData.error.message);
  }

  return response.blob();
}

export async function getPublisherDetails(
  publisherId: number,
  token?: string
): Promise<ApiPublisherDetails> {
  const url = `${API_BASE_URL}/publishers/${publisherId}`;
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

export async function getLicenseDetails(
  licenseCode: string,
  token?: string
): Promise<ApiLicenseDetails> {
  const url = `${API_BASE_URL}/licenses/${licenseCode}`;
  console.log('Fetching license details from:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('License details response status:', response.status);
  console.log('License details response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('License details error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('License details response data:', data);
  
  return data;
}

export interface ApiLicensesResponse {
  licenses: ApiLicenseSummary[];
}

export interface ApiLicenseSummary {
  code: string;
  name: string;
  short_name: string;
  icon_url: string;
  is_default: boolean;
}

export interface ApiAppConfig {
  version: string;
  features: {
    auto_approve_access: boolean;
    manual_license_review: boolean;
    advanced_analytics: boolean;
    api_access: boolean;
  };
  limits: {
    max_file_size_mb: number;
    max_files_per_resource: number;
    max_resources_per_publisher: number;
  };
  ui: {
    primary_color: string;
    dark_color: string;
    supported_locales: string[];
    default_locale: string;
  };
  categories: Array<{
    key: string;
    name: string;
    description: string;
  }>;
  external_links: {
    docs: string;
    support: string;
    github: string;
  };
}

export interface ApiHealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'healthy' | 'unhealthy';
    storage: 'healthy' | 'unhealthy';
    auth: 'healthy' | 'unhealthy';
  };
}

export interface ApiContentStandardsSubsection {
  title: string;
  content: string;
}

export interface ApiContentStandardsSection {
  title: string;
  content: string;
  subsections: ApiContentStandardsSubsection[];
  required_fields: string[];
  default_license: string;
}

export interface ApiFileFormatSpec {
  schema_url: string;
  example_url: string;
}

export interface ApiContentStandards {
  version: string;
  last_updated: string;
  sections: ApiContentStandardsSection[];
  file_formats: {
    supported: string[];
    recommended: string[];
    specifications: { [key: string]: ApiFileFormatSpec };
  };
}

/**
 * Get list of all available licenses
 */
export async function getLicenses(token?: string): Promise<ApiLicensesResponse> {
  const url = `${API_BASE_URL}/licenses`;
  console.log('Fetching licenses from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Licenses response status:', response.status);
  console.log('Licenses response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Licenses error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Licenses response data:', data);

  return data;
}

/**
 * Get application configuration
 */
export async function getAppConfig(token?: string): Promise<ApiAppConfig> {
  const url = `${API_BASE_URL}/config`;
  console.log('Fetching app config from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Config response status:', response.status);
  console.log('Config response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Config error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Config response data:', data);

  return data;
}

/**
 * Get system health status
 */
export async function getHealthStatus(token?: string): Promise<ApiHealthStatus> {
  const url = `${API_BASE_URL}/health`;
  console.log('Fetching health status from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Health response status:', response.status);
  console.log('Health response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Health error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Health response data:', data);

  return data;
}

/**
 * Get content standards
 */
export async function getContentStandards(token?: string): Promise<ApiContentStandards> {
  const url = `${API_BASE_URL}/content-standards`;
  console.log('Fetching content standards from:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });

  console.log('Content standards response status:', response.status);
  console.log('Content standards response headers:', response.headers);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Content standards error response:', errorText);
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Content standards response data:', data);

  return data;
}

// Type conversion functions for backward compatibility
export function convertApiAssetToAsset(apiAsset: ApiAsset) {
  return {
    id: apiAsset.id.toString(),
    title: apiAsset.title,
    description: apiAsset.description,
    license: apiAsset.license.name,
    publisher: apiAsset.publisher.name,
    category: apiAsset.category,
    licenseColor: getLicenseColor(apiAsset.license.code),
    type: getAssetType(apiAsset.category),
    thumbnail_url: apiAsset.thumbnail_url,
    has_access: apiAsset.has_access,
    download_count: apiAsset.download_count,
    file_size: apiAsset.file_size,
  };
}

export function convertApiAssetSummaryToAsset(apiAssetSummary: ApiAssetSummary) {
  return {
    id: apiAssetSummary.id.toString(),
    title: apiAssetSummary.title,
    description: apiAssetSummary.description,
    license: apiAssetSummary.license.name,
    publisher: apiAssetSummary.publisher.name,
    category: apiAssetSummary.category,
    licenseColor: getLicenseColor(apiAssetSummary.license.code),
    type: getAssetType(apiAssetSummary.category),
    thumbnail_url: apiAssetSummary.thumbnail_url,
    has_access: apiAssetSummary.has_access,
    download_count: apiAssetSummary.download_count,
    file_size: apiAssetSummary.file_size,
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
