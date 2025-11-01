/**
 * User Domain Model
 *
 * This file contains the internal user model used throughout the application.
 * This is separate from API types to allow for a clean separation between
 * API contracts and internal domain logic.
 */

import type { AuthProvider, UserRole } from '../api';

/**
 * Internal user model
 * Represents a user within the application domain
 */
export interface User {
  /** Unique user identifier */
  id: string;

  /** User's email address */
  email: string;

  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** User's full name */
  fullName?: string;

  /** User's job title */
  jobTitle?: string;

  /** User's phone number */
  phoneNumber?: string;

  /** User's biography */
  bio?: string;

  /** User's project summary */
  projectSummary?: string;

  /** User's project URL */
  projectUrl?: string;

  /** Authentication provider used */
  provider: AuthProvider;

  /** User's role in the system */
  role?: UserRole;

  /** Whether user's profile is completed */
  profileCompleted: boolean;

  /** Whether user account is active */
  isActive?: boolean;

  /** Account creation date */
  createdAt?: Date;

  /** Last update date */
  updatedAt?: Date;
}

/**
 * User profile update data
 * Data structure for updating user profile
 */
export interface UserProfileUpdate {
  /** User's full name */
  name?: string;

  /** User's phone number */
  phone?: string;

  /** User's biography */
  bio?: string;

  /** User's project summary */
  projectSummary?: string;

  /** User's project URL */
  projectUrl?: string;

  /** User's job title */
  jobTitle?: string;
}

/**
 * User authentication credentials
 */
export interface UserCredentials {
  /** User's email address */
  email: string;

  /** User's password */
  password: string;
}

/**
 * User registration data
 */
export interface UserRegistration extends UserCredentials {
  /** User's first name */
  firstName: string;

  /** User's last name */
  lastName: string;

  /** User's job title (optional) */
  jobTitle?: string;

  /** User's phone number (optional) */
  phoneNumber?: string;
}
