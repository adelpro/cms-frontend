/**
 * Authentication API service
 * Handles all authentication-related API calls according to the API contract
 */

import { env } from '@/lib/env';

// API base URL with mock-api prefix as required
const API_BASE_URL = `${env.NEXT_PUBLIC_BACKEND_URL}/mock-api`;

// API response types based on the contract
export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  title?: string;
  phone_number?: string;
  avatar_url?: string;
  bio?: string;
  organization?: string;
  location?: string;
  website?: string;
  github_username?: string;
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
    throw new Error('Logout failed');
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
    jobTitle: apiUser.title,
    phoneNumber: apiUser.phone_number,
    provider: apiUser.auth_provider,
    profileCompleted: apiUser.profile_completed,
  };
}
