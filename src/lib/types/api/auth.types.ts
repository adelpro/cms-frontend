/**
 * Authentication API Types
 * 
 * This file contains all type definitions related to authentication,
 * user management, and OAuth operations.
 */

/**
 * User profile schema returned by the API
 * Represents the complete user profile data
 */
export interface UserProfileSchema {
  /** Unique identifier for the user */
  id: string;

  /** User's email address */
  email: string;

  /** User's full name */
  name: string;

  /** User's phone number (optional) */
  phone: string | null;

  /** Whether the user account is active */
  is_active: boolean;

  /** Whether the user has completed their profile */
  is_profile_completed: boolean;

  /** User's biography */
  bio: string;

  /** Summary of the user's project */
  project_summary: string;

  /** URL to the user's project */
  project_url: string;

  /** User's job title */
  job_title: string;

  /** Account creation timestamp */
  created_at: string;

  /** Last profile update timestamp */
  updated_at: string;
}

/**
 * User update request schema
 * Used for updating user profile information
 */
export interface UserUpdateSchema {
  /** User's full name */
  name?: string | null;

  /** User's phone number */
  phone?: string | null;

  /** User's biography */
  bio?: string;

  /** Summary of the user's project */
  project_summary?: string;

  /** URL to the user's project */
  project_url?: string;

  /** User's job title */
  job_title?: string;
}

/**
 * Token response schema
 * Returned after successful login or registration
 */
export interface TokenResponseSchema {
  /** JWT access token */
  access: string;

  /** JWT refresh token */
  refresh: string;

  /** User data (structure may vary) */
  user: Record<string, unknown>;
}

/**
 * Login request schema
 * Used for email/password authentication
 */
export interface LoginSchema {
  /** User's email address */
  email: string;

  /** User's password */
  password: string;
}

/**
 * Registration request schema
 * Used for creating a new user account
 */
export interface RegisterSchema {
  /** User's email address */
  email: string;

  /** User's password */
  password: string;

  /** User's full name (optional) */
  name?: string;

  /** User's phone number (optional) */
  phone?: string;

  /** User's job title (optional) */
  job_title?: string;
}

/**
 * Refresh token request schema
 * Used for obtaining a new access token
 */
export interface RefreshTokenIn {
  /** Refresh token to exchange for new access token */
  refresh: string;
}

/**
 * Refresh token response schema
 * Contains the new access token and optionally a new refresh token
 */
export interface RefreshTokenOut {
  /** New JWT access token */
  access: string;

  /** New JWT refresh token (optional) */
  refresh?: string | null;
}

/**
 * Logout request schema
 * Used for invalidating tokens on the server
 */
export interface LogoutIn {
  /** Refresh token to invalidate (optional) */
  refresh?: string | null;
}

/**
 * OAuth2 authorization response schema
 * Contains the authorization URL and state for OAuth flows
 */
export interface OAuth2AuthorizeResponseSchema {
  /** OAuth authorization URL to redirect user to */
  authorization_url: string;

  /** State parameter for CSRF protection */
  state: string;
}

/**
 * Authentication provider type
 */
export type AuthProvider = 'email' | 'google' | 'github';

/**
 * User role type for authorization
 */
export type UserRole = 'user' | 'publisher' | 'admin';

