/**
 * API Types Barrel Export
 *
 * This file exports all API-related types for convenient importing.
 * Import from this file instead of individual type files.
 *
 * @example
 * import type { UserProfileSchema, ListAssetOut, ApiErrorResponse } from '@/lib/types/api';
 */

// Common types
export type {
  ApiErrorResponse,
  OkSchema,
  ApiResponse,
  PagedResponse,
  CategoryChoice,
  StatusChoice,
  IntendedUseChoice,
  OrderingOption,
  BaseListFilters,
} from './common.types';

// Auth types
export type {
  UserProfileSchema,
  UserUpdateSchema,
  TokenResponseSchema,
  LoginSchema,
  RegisterSchema,
  RefreshTokenIn,
  RefreshTokenOut,
  LogoutIn,
  OAuth2AuthorizeResponseSchema,
  AuthProvider,
  UserRole,
} from './auth.types';

// Assets, Resources, and Publishers types
export type {
  ListAssetPublisherOut,
  DetailAssetPublisherOut,
  DetailPublisherOut,
  ListResourcePublisherOut,
  DetailResourcePublisherOut,
  ListAssetOut,
  DetailAssetSnapshotOut,
  DetailAssetResourceOut,
  DetailAssetOut,
  PagedListAssetOut,
  ListResourceOut,
  DetailResourceOut,
  PagedListResourceOut,
  CreateResourceIn,
  UpdateResourceIn,
  ResourceOut,
  RequestAccessIn,
  AccessRequestOut,
  AccessGrantOut,
  AccessRequestResponseOut,
  AssetAccessStatusOut,
  DownloadResponseOut,
  AssetListFilters,
  ResourceListFilters,
} from './assets.types';
