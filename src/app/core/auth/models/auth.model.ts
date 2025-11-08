/**
 * Authentication models based on the Itqan CMS API schema
 */

// export interface User { // OLD USER MODEL
//   id: number;
//   email: string;
//   name: string;
//   first_name: string;
//   last_name: string;
//   phone_number?: string;
//   title?: string;
//   avatar_url?: string;
//   bio?: string;
//   organization?: string;
//   location?: string;
//   website?: string;
//   github_username?: string;
//   email_verified: boolean;
//   profile_completed: boolean;
//   auth_provider: 'email' | 'google' | 'github';
// }

export interface User {
  id: string; // TODO: Change to number
  name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_profile_completed: boolean;
}

// export interface AuthResponse { // OLD AUTH RESPONSE MODEL
//   access_token: string;
//   refresh_token: string;
//   user: User;
// }

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// export interface RegisterRequest { // OLD REGISTER REQUEST MODEL
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   phone_number?: string;
//   title?: string;
// }

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string; // +201012345678 +966555555555 format
  job_title: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

// export interface RefreshTokenResponse { // OLD REFRESH TOKEN RESPONSE MODEL
//   access_token: string;
// }

export interface RefreshTokenResponse {
  access: string;
  refresh: string;
}

// export interface UpdateProfileRequest { // OLD UPDATE PROFILE REQUEST MODEL
//   name?: string;
//   first_name?: string;
//   last_name?: string;
//   phone_number?: string;
//   title?: string;
//   bio?: string;
//   organization?: string;
//   location?: string;
//   website?: string;
//   github_username?: string;
// }

export interface UpdateProfileRequest {
  bio?: string;
  project_summary?: string;
  project_url?: string;
}

// export interface UpdateProfileResponse {
//   message: string;
//   profile: {
//     id: number;
//     profile_completed: boolean;
//   };
// }

export interface UpdateProfileResponse {
  id: string;
  email: string;
  name: string;
  phone: string;
  is_active: boolean;
  is_profile_completed: boolean;
  bio: string;
  project_summary: string;
  project_url: string;
  job_title: string;
  created_at: string;
  updated_at: string;
}

// API Error interfaces
export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// Form validation interfaces
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
