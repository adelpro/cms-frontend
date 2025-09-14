/**
 * Authentication API service
 * Handles all authentication-related API calls according to the API contract
 */

import { env } from '@/lib/env';

// API base URL according to the API contract
const API_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL + "/api/v1";

// API response types based on the contract
export interface ApiUser {
  id: number;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string | null;
  title: string | null;
  avatar_url: string | null;
  bio: string | null;
  organization: string | null;
  location: string | null;
  website: string | null;
  github_username: string | null;
  email_verified: boolean;
  profile_completed: boolean;
  auth_provider: 'email' | 'google' | 'github';
}

export interface ApiAuthResponse {
  access_token: string;
  refresh_token: string;
  user: ApiUser;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export interface ApiProfileUpdateRequest {
  name: string;
  bio?: string;
  organization?: string;
  location?: string;
  website?: string;
  github_username?: string;
}

export interface ApiProfileUpdateResponse {
  message: string;
  profile: {
    id: number;
    profile_completed: boolean;
  };
}

// Helper function to handle API responses
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred'
      }
    }));
    
    throw new Error(errorData.error.message);
  }
  
  return response.json();
}

// Helper function to get auth headers
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

/**
 * Register user with email/password
 */
export async function registerUser(data: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  title: string;
  phone_number: string;
}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<ApiAuthResponse>(response);
}

/**
 * Login user with email/password
 */
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<ApiAuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<ApiAuthResponse>(response);
}

/**
 * Get user profile
 */
export async function getUserProfile(token: string): Promise<ApiUser> {
  const response = await fetch(`${API_BASE_URL}/auth/profile`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  
  return handleApiResponse<ApiUser>(response);
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string, 
  data: ApiProfileUpdateRequest
): Promise<ApiProfileUpdateResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<ApiProfileUpdateResponse>(response);
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<{ access_token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  
  return handleApiResponse<{ access_token: string }>(response);
}

/**
 * Logout user
 */
export async function logoutUser(token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    // Don't handle auth errors for logout - just log and continue
    console.warn('Logout API call failed:', response.status, response.statusText);
    // We'll still clear local storage even if the API call fails
  }
}

/**
 * Convert API user to internal user format
 */
export function convertApiUserToUser(apiUser: ApiUser): {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  provider: 'email' | 'google' | 'github';
  profileCompleted: boolean;
} {
  return {
    id: apiUser.id.toString(),
    email: apiUser.email,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    jobTitle: apiUser.title || undefined,
    phoneNumber: apiUser.phone_number || undefined,
    provider: apiUser.auth_provider,
    profileCompleted: apiUser.profile_completed,
  };
}
