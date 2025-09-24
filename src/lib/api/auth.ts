/**
 * Authentication API service
 * Handles all authentication-related API calls according to the API contract
 */

import { env } from '@/lib/env';

// API base URL according to the API contract
const API_BASE_URL = env.NEXT_PUBLIC_BACKEND_URL;

// API response types based on the new contract
export interface UserProfileSchema {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  is_active: boolean;
  is_profile_completed: boolean;
  bio: string;
  project_summary: string;
  project_url: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}

export interface UserUpdateSchema {
  name?: string | null;
  phone?: string | null;
  bio?: string;
  project_summary?: string;
  project_url?: string;
  job_title?: string;
}

export interface TokenResponseSchema {
  access: string;
  refresh: string;
  user: Record<string, unknown>;
}

export interface LoginSchema {
  email: string;
  password: string;
}

export interface RegisterSchema {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  job_title?: string;
}

export interface RefreshTokenIn {
  refresh: string;
}

export interface RefreshTokenOut {
  access: string;
  refresh?: string | null;
}

export interface LogoutIn {
  refresh?: string | null;
}

export interface OAuth2AuthorizeResponseSchema {
  authorization_url: string;
  state: string;
}

// Legacy interface for backward compatibility
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
  error_name: string;
  message: string;
  extra?: unknown;
}

export interface OkSchema {
  message: string;
}

// Legacy interfaces for backward compatibility
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
      error_name: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred'
    }));
    
    throw new Error(errorData.message);
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
export async function registerUser(data: RegisterSchema): Promise<TokenResponseSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/register/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<TokenResponseSchema>(response);
}

/**
 * Login user with email/password
 */
export async function loginUser(data: LoginSchema): Promise<TokenResponseSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<TokenResponseSchema>(response);
}

/**
 * Get user profile
 */
export async function getUserProfile(token: string): Promise<UserProfileSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: 'GET',
    headers: getAuthHeaders(token),
  });
  
  return handleApiResponse<UserProfileSchema>(response);
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  token: string, 
  data: UserUpdateSchema
): Promise<UserProfileSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/profile/`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(data),
  });
  
  return handleApiResponse<UserProfileSchema>(response);
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenOut> {
  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ refresh: refreshToken }),
  });
  
  return handleApiResponse<RefreshTokenOut>(response);
}

/**
 * Logout user
 */
export async function logoutUser(token: string, refreshToken?: string): Promise<void> {
  const body: LogoutIn = {};
  if (refreshToken) {
    body.refresh = refreshToken;
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/logout/`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(body),
  });
  
  if (!response.ok) {
    // Don't handle auth errors for logout - just log and continue
    console.warn('Logout API call failed:', response.status, response.statusText);
    // We'll still clear local storage even if the API call fails
  }
}

/**
 * Start Google OAuth2 authorization
 */
export async function startGoogleOAuth(): Promise<OAuth2AuthorizeResponseSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/oauth/google/authorize/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleApiResponse<OAuth2AuthorizeResponseSchema>(response);
}

/**
 * Start GitHub OAuth2 authorization
 */
export async function startGitHubOAuth(): Promise<OAuth2AuthorizeResponseSchema> {
  const response = await fetch(`${API_BASE_URL}/auth/oauth/github/authorize/`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  return handleApiResponse<OAuth2AuthorizeResponseSchema>(response);
}

/**
 * Convert new API user profile to internal user format
 */
export function convertUserProfileToUser(userProfile: UserProfileSchema): {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  phoneNumber?: string;
  provider: 'email' | 'google' | 'github';
  profileCompleted: boolean;
} {
  const nameParts = userProfile.name.split(' ');
  return {
    id: userProfile.id,
    email: userProfile.email,
    firstName: nameParts[0] || '',
    lastName: nameParts.slice(1).join(' ') || '',
    jobTitle: userProfile.job_title || undefined,
    phoneNumber: userProfile.phone || undefined,
    provider: 'email', // Default, would need to be determined from auth context
    profileCompleted: userProfile.is_profile_completed,
  };
}

/**
 * Convert legacy API user to internal user format (backward compatibility)
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

/**
 * Convert TokenResponseSchema to legacy ApiAuthResponse format
 */
export function convertTokenResponseToApiAuthResponse(tokenResponse: TokenResponseSchema): ApiAuthResponse {
  return {
    access_token: tokenResponse.access,
    refresh_token: tokenResponse.refresh,
    user: tokenResponse.user as unknown as ApiUser,
  };
}
