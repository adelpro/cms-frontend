/**
 * Common API Types
 * 
 * This file contains shared types used across different API endpoints.
 * These types are used for consistent API communication and error handling.
 */

/**
 * Standard API error response structure
 * Returned by the backend when an error occurs
 */
export interface ApiErrorResponse {
  /** Error identifier/code */
  error_name: string;
  
  /** Human-readable error message */
  message: string;
  
  /** Additional error context (optional) */
  extra?: unknown;
}

/**
 * Generic success response with a message
 * Used for operations that don't return specific data
 */
export interface OkSchema {
  /** Success message */
  message: string;
}

/**
 * Generic API response wrapper for consistent error handling
 * Can be used to wrap any response type
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;
  
  /** Response data (if successful) */
  data?: T;
  
  /** Error message (if failed) */
  error?: string;
  
  /** Additional message */
  message?: string;
}

/**
 * Paginated list response wrapper
 * Used for endpoints that return paginated results
 */
export interface PagedResponse<T> {
  /** Array of result items */
  results: T[];
  
  /** Total count of items */
  count: number;
  
  /** URL to next page (if available) */
  next?: string | null;
  
  /** URL to previous page (if available) */
  previous?: string | null;
}

/**
 * Category choice for resources and assets
 */
export type CategoryChoice = 'recitation' | 'mushaf' | 'tafsir';

/**
 * Status choice for resources
 */
export type StatusChoice = 'draft' | 'ready';

/**
 * Intended use choice for access requests
 */
export type IntendedUseChoice = 'commercial' | 'non-commercial';

/**
 * Sort ordering options
 */
export type OrderingOption = 'created_at' | '-created_at' | 'name' | '-name' | 'updated_at' | '-updated_at';

/**
 * Common filter parameters for list endpoints
 */
export interface BaseListFilters {
  /** Search query */
  search?: string;
  
  /** Sort ordering */
  ordering?: OrderingOption | string;
  
  /** Page number (1-indexed) */
  page?: number;
  
  /** Items per page */
  page_size?: number;
}

