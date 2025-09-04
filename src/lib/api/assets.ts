import { env } from '@/lib/env';

// Use local mock server for development, production API for production
const API_BASE_URL = `${env.NEXT_PUBLIC_BACKEND_URL}/mock-api`;

// API Types based on the contract
export interface ApiLicense {
  code: string;
  name: string;
}

export interface ApiPublisher {
  id: number;
  name: string;
  thumbnail_url: string;
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
  download_count: number;
  file_size: string;
}

export interface ApiAssetDetails extends ApiAsset {
  snapshots: Array<{
    thumbnail_url: string;
    title: string;
    description: string;
  }>;
  resource: {
    id: number;
    title: string;
    description: string;
  };
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
  };
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
  download_url?: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
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
    category?: 'mushaf' | 'tafsir' | 'recitation';
    license_code?: string;
  }
): Promise<ApiAssetsResponse> {
  const url = new URL(`${API_BASE_URL}/assets`);
  
  if (filters?.category) {
    url.searchParams.append('category', filters.category);
  }
  if (filters?.license_code) {
    url.searchParams.append('license_code', filters.license_code);
  }

  const response = await fetch(url.toString(), {
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
