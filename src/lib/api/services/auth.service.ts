/**
 * Authentication API Service
 *
 * This service handles all authentication-related API operations including:
 * - User registration and login
 * - Profile management
 * - Token refresh and logout
 * - OAuth2 flows (Google, GitHub)
 *
 * All functions use the centralized API client for consistent error handling
 * and request formatting.
 */

import type {
  UserProfileSchema,
  UserUpdateSchema,
  TokenResponseSchema,
  LoginSchema,
  RegisterSchema,
  RefreshTokenIn,
  RefreshTokenOut,
  LogoutIn,
  OAuth2AuthorizeResponseSchema,
} from '@/lib/types/api/auth.types';

import { apiGet, apiPost, apiPut } from '../client';

// ============================================================================
// Authentication Operations
// ============================================================================

/**
 * Registers a new user account
 *
 * Creates a new user account with email and password authentication.
 * Returns access and refresh tokens upon successful registration.
 *
 * @param data - User registration data (email, password, optional profile info)
 * @returns Promise resolving to tokens and user data
 * @throws Error if registration fails (e.g., email already exists)
 *
 * @example
 * ```typescript
 * const response = await registerUser({
 *   email: 'user@example.com',
 *   password: 'securePassword123',
 *   name: 'John Doe',
 *   job_title: 'Developer',
 * });
 * // Store tokens and redirect user
 * ```
 */
export async function registerUser(data: RegisterSchema): Promise<TokenResponseSchema> {
  return apiPost<TokenResponseSchema>('/auth/register/', data);
}

/**
 * Authenticates a user with email and password
 *
 * Logs in an existing user and returns access and refresh tokens.
 *
 * @param data - Login credentials (email and password)
 * @returns Promise resolving to tokens and user data
 * @throws Error if credentials are invalid or user doesn't exist
 *
 * @example
 * ```typescript
 * const response = await loginUser({
 *   email: 'user@example.com',
 *   password: 'password123',
 * });
 * // Store tokens in storage
 * tokenStorage.setTokens(response.access, response.refresh);
 * ```
 */
export async function loginUser(data: LoginSchema): Promise<TokenResponseSchema> {
  return apiPost<TokenResponseSchema>('/auth/login/', data);
}

/**
 * Logs out the current user
 *
 * Invalidates the refresh token on the server. This is a best-effort operation;
 * local tokens are cleared regardless of API success.
 *
 * @param token - Access token for authentication
 * @param refreshToken - Refresh token to invalidate (optional)
 * @returns Promise that resolves when logout completes
 *
 * @example
 * ```typescript
 * await logoutUser(accessToken, refreshToken);
 * // Clear local storage
 * tokenStorage.clearTokens();
 * router.push('/login');
 * ```
 */
export async function logoutUser(token: string, refreshToken?: string): Promise<void> {
  const body: LogoutIn = {};
  if (refreshToken) {
    body.refresh = refreshToken;
  }

  try {
    await apiPost<void>('/auth/logout/', body, token);
  } catch (error) {
    // Don't throw on logout errors - log and continue
    console.warn('Logout API call failed:', error);
    // Local storage should still be cleared by the caller
  }
}

/**
 * Refreshes the access token
 *
 * Exchanges a refresh token for a new access token. Optionally returns
 * a new refresh token as well (token rotation).
 *
 * @param refreshToken - Valid refresh token
 * @returns Promise resolving to new access token and optionally new refresh token
 * @throws Error if refresh token is invalid or expired
 *
 * @example
 * ```typescript
 * try {
 *   const response = await refreshToken(currentRefreshToken);
 *   tokenStorage.setAccessToken(response.access);
 *   if (response.refresh) {
 *     tokenStorage.setRefreshToken(response.refresh);
 *   }
 * } catch (error) {
 *   // Refresh token expired, redirect to login
 *   router.push('/login');
 * }
 * ```
 */
export async function refreshToken(refreshToken: string): Promise<RefreshTokenOut> {
  const data: RefreshTokenIn = { refresh: refreshToken };
  return apiPost<RefreshTokenOut>('/auth/token/refresh/', data);
}

// ============================================================================
// Profile Management
// ============================================================================

/**
 * Retrieves the current user's profile
 *
 * Fetches complete profile information for the authenticated user.
 *
 * @param token - Access token for authentication
 * @returns Promise resolving to user profile data
 * @throws Error if token is invalid or user not found
 *
 * @example
 * ```typescript
 * const profile = await getUserProfile(accessToken);
 * console.log(`Welcome, ${profile.name}!`);
 * ```
 */
export async function getUserProfile(token: string): Promise<UserProfileSchema> {
  return apiGet<UserProfileSchema>('/auth/profile/', token);
}

/**
 * Updates the current user's profile
 *
 * Updates one or more profile fields. Only provided fields are updated;
 * omitted fields remain unchanged.
 *
 * @param token - Access token for authentication
 * @param data - Profile fields to update
 * @returns Promise resolving to updated user profile
 * @throws Error if validation fails or token is invalid
 *
 * @example
 * ```typescript
 * const updated = await updateUserProfile(token, {
 *   name: 'Jane Doe',
 *   bio: 'Software engineer passionate about open source',
 *   project_url: 'https://github.com/username/project',
 * });
 * ```
 */
export async function updateUserProfile(
  token: string,
  data: UserUpdateSchema
): Promise<UserProfileSchema> {
  return apiPut<UserProfileSchema>('/auth/profile/', data, token);
}

// ============================================================================
// OAuth2 Operations
// ============================================================================

/**
 * Initiates Google OAuth2 authentication flow
 *
 * Returns the authorization URL to redirect the user to for Google login.
 * The state parameter should be stored for CSRF protection.
 *
 * @returns Promise resolving to authorization URL and state
 * @throws Error if OAuth provider configuration is invalid
 *
 * @example
 * ```typescript
 * const { authorization_url, state } = await startGoogleOAuth();
 * sessionStorage.setItem('oauth_state', state);
 * window.location.href = authorization_url;
 * ```
 */
export async function startGoogleOAuth(): Promise<OAuth2AuthorizeResponseSchema> {
  return apiGet<OAuth2AuthorizeResponseSchema>('/auth/oauth/google/authorize/');
}

/**
 * Initiates GitHub OAuth2 authentication flow
 *
 * Returns the authorization URL to redirect the user to for GitHub login.
 * The state parameter should be stored for CSRF protection.
 *
 * @returns Promise resolving to authorization URL and state
 * @throws Error if OAuth provider configuration is invalid
 *
 * @example
 * ```typescript
 * const { authorization_url, state } = await startGitHubOAuth();
 * sessionStorage.setItem('oauth_state', state);
 * window.location.href = authorization_url;
 * ```
 */
export async function startGitHubOAuth(): Promise<OAuth2AuthorizeResponseSchema> {
  return apiGet<OAuth2AuthorizeResponseSchema>('/auth/oauth/github/authorize/');
}
