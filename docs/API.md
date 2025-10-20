# API Integration Guide

**Version**: 1.0  
**Last Updated**: October 20, 2025  
**Project**: Itqan CMS (Next.js 15 + TypeScript + ShadCN)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#requestresponse-examples)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Pagination](#pagination)
8. [TypeScript Integration](#typescript-integration)
9. [Testing API Integration](#testing-api-integration)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Itqan CMS frontend integrates with a RESTful API backend to provide comprehensive digital asset management functionality. This guide covers all aspects of API integration, from authentication to error handling.

### Base URL Configuration

```typescript
// Environment-specific API URLs
const API_URLS = {
  development: 'https://develop.api.cms.itqan.dev',
  staging: 'https://staging.api.cms.itqan.dev',
  production: 'https://api.cms.itqan.dev',
};

// Current API base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
```

### API Client Architecture

```typescript
// Centralized API client
class ApiClient {
  private baseURL: string;
  private headers: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async request<T>(endpoint: string, options: RequestOptions): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: { ...this.headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }
}
```

---

## Authentication

### Token-Based Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are included in the `Authorization` header.

```typescript
// Token storage utilities
export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('auth_token', token);
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  },
};
```

### Authentication Headers

```typescript
// Get authentication headers
export function getAuthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Language': getCurrentLocaleForHeaders(),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}
```

### Login Flow

```typescript
// 1. User submits login form
const loginData = {
  email: 'user@example.com',
  password: 'password123',
};

// 2. API call to login endpoint
const response = await fetch(`${API_BASE_URL}/auth/login/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData),
});

// 3. Handle response
if (response.ok) {
  const data = await response.json();
  // Store tokens
  tokenStorage.setToken(data.access);
  // Update auth context
  login(data.user, data.access);
} else {
  // Handle error
  const error = await response.json();
  throw new Error(error.message);
}
```

### Token Refresh

```typescript
// Automatic token refresh
export async function refreshToken(refreshToken: string): Promise<RefreshTokenOut> {
  const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  return response.json();
}
```

---

## API Endpoints

### Authentication Endpoints

#### POST /auth/login/

**Description**: Authenticate user with email and password  
**Request Body**:

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response**:

```typescript
interface LoginResponse {
  access: string; // JWT access token
  refresh: string; // JWT refresh token
  user: UserProfile; // User profile data
}
```

#### POST /auth/register/

**Description**: Register new user account  
**Request Body**:

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  job_title?: string;
}
```

#### GET /auth/profile/

**Description**: Get current user profile  
**Headers**: `Authorization: Bearer <token>`

**Response**:

```typescript
interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  project_summary?: string;
  project_url?: string;
  job_title?: string;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}
```

#### PUT /auth/profile/

**Description**: Update user profile  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:

```typescript
interface UpdateProfileRequest {
  name?: string;
  bio?: string;
  project_summary?: string;
  project_url?: string;
}
```

### Asset Endpoints

#### GET /assets/

**Description**: Get paginated list of assets  
**Query Parameters**:

```typescript
interface AssetListFilters {
  category?: string[]; // Filter by categories
  license_code?: string[]; // Filter by license codes
  search?: string; // Search query
  ordering?: string; // Sort order
  page?: number; // Page number
  page_size?: number; // Items per page
}
```

**Response**:

```typescript
interface AssetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Asset[];
}

interface Asset {
  id: number;
  name: string;
  description: string;
  category: string;
  license: string;
  publisher: {
    id: number;
    name: string;
  };
}
```

#### GET /assets/{id}/

**Description**: Get detailed asset information  
**Headers**: `Authorization: Bearer <token>` (optional)

**Response**:

```typescript
interface AssetDetails {
  id: number;
  name: string;
  description: string;
  long_description: string;
  category: string;
  license: string;
  thumbnail_url: string;
  publisher: {
    id: number;
    name: string;
    description: string;
  };
  resource: {
    id: number;
  };
  snapshots: Array<{
    image_url: string;
    title: string;
    description: string;
  }>;
}
```

#### GET /assets/{id}/access-status/

**Description**: Check user's access status for an asset  
**Headers**: `Authorization: Bearer <token>`

**Response**:

```typescript
interface AccessStatus {
  has_access: boolean;
  requires_approval: boolean;
}
```

#### POST /assets/{id}/request-access/

**Description**: Request access to a restricted asset  
**Headers**: `Authorization: Bearer <token>`  
**Request Body**:

```typescript
interface AccessRequest {
  purpose: string;
  intended_use: 'commercial' | 'non-commercial';
}
```

#### GET /assets/{id}/download/

**Description**: Get download URL for an asset  
**Headers**: `Authorization: Bearer <token>`

**Response**:

```typescript
interface DownloadResponse {
  download_url: string;
}
```

### Publisher Endpoints

#### GET /publishers/{id}/

**Description**: Get publisher details  
**Headers**: `Authorization: Bearer <token>` (optional)

**Response**:

```typescript
interface PublisherDetails {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  website: string;
  is_verified: boolean;
  contact_email: string;
  icon_url: string | null;
}
```

---

## Request/Response Examples

### Example 1: Get Assets with Filters

```typescript
// Request
const filters = {
  category: ['mushaf', 'tafsir'],
  license_code: ['CC0', 'CC-BY'],
  search: 'quran',
  page: 1,
  page_size: 20
};

const response = await fetch(`${API_BASE_URL}/assets/?${new URLSearchParams(filters)}`, {
  headers: getAuthHeaders(token)
});

// Response
{
  "count": 150,
  "next": "https://api.cms.itqan.dev/assets/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "name": "Al-Quran Al-Kareem",
      "description": "Complete Quran text with proper formatting",
      "category": "mushaf",
      "license": "CC0",
      "publisher": {
        "id": 1,
        "name": "Islamic Foundation"
      }
    }
  ]
}
```

### Example 2: User Login

```typescript
// Request
const loginData = {
  email: 'user@example.com',
  password: 'password123'
};

const response = await fetch(`${API_BASE_URL}/auth/login/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(loginData)
});

// Response
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "profile_completed": true
  }
}
```

### Example 3: Asset Access Request

```typescript
// Request
const accessRequest = {
  purpose: 'Research project on Quranic studies',
  intended_use: 'non-commercial'
};

const response = await fetch(`${API_BASE_URL}/assets/123/request-access/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(accessRequest)
});

// Response
{
  "request": {
    "id": 456,
    "asset_id": 123,
    "purpose": "Research project on Quranic studies",
    "intended_use": "non-commercial",
    "status": "pending",
    "created_at": "2025-10-20T10:30:00Z"
  },
  "access": null
}
```

---

## Error Handling

### HTTP Status Codes

| Status Code | Description           | Action                     |
| ----------- | --------------------- | -------------------------- |
| 200         | Success               | Process response data      |
| 201         | Created               | Process created resource   |
| 400         | Bad Request           | Show validation errors     |
| 401         | Unauthorized          | Redirect to login          |
| 403         | Forbidden             | Show access denied message |
| 404         | Not Found             | Show not found message     |
| 429         | Too Many Requests     | Show rate limit message    |
| 500         | Internal Server Error | Show generic error message |

### Error Response Format

```typescript
interface ApiErrorResponse {
  message: string;
  error_name?: string;
  details?: Record<string, string[]>;
  status_code: number;
}
```

### Error Handling Implementation

```typescript
// Centralized error handler
export async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json();
}

export async function handleApiError(response: Response): Promise<never> {
  try {
    const errorData: ApiErrorResponse = await response.json();
    const errorMessage = errorData.message || errorData.error_name || 'An error occurred';
    throw new Error(errorMessage);
  } catch (error) {
    if (error instanceof Error && error.message !== 'An error occurred') {
      throw error;
    }
    throw new Error('Network error. Please try again.');
  }
}
```

### Global Error Interceptor

```typescript
// HTTP interceptor for global error handling
class HttpInterceptor {
  private handleAuthError(response: Response): void {
    if (response.status === 401 || response.status === 403) {
      // Clear authentication
      tokenStorage.removeToken();
      // Update auth context
      logout();
      // Redirect to login
      window.location.href = '/auth/login';
    }
  }
}
```

---

## Rate Limiting

### Rate Limit Headers

The API includes rate limiting headers in responses:

```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string; // Requests per window
  'X-RateLimit-Remaining': string; // Remaining requests
  'X-RateLimit-Reset': string; // Reset timestamp
}
```

### Rate Limit Handling

```typescript
// Check rate limit headers
function checkRateLimit(response: Response): void {
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');

  if (remaining && parseInt(remaining) < 10) {
    console.warn(`Rate limit warning: ${remaining}/${limit} requests remaining`);
  }
}
```

---

## Pagination

### Pagination Parameters

```typescript
interface PaginationParams {
  page?: number; // Page number (1-based)
  page_size?: number; // Items per page (default: 20, max: 100)
}
```

### Pagination Response

```typescript
interface PaginatedResponse<T> {
  count: number; // Total number of items
  next: string | null; // URL for next page
  previous: string | null; // URL for previous page
  results: T[]; // Array of items
}
```

### Pagination Implementation

```typescript
// Build pagination URL
export function buildPaginationUrl(baseUrl: string, page: number, pageSize: number): string {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
  });
  return `${baseUrl}?${params}`;
}

// Handle pagination in components
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);

const loadAssets = async (page: number) => {
  const response = await getAssets(token, { page, page_size: 20 });
  setAssets(response.results);
  setTotalPages(Math.ceil(response.count / 20));
};
```

---

## TypeScript Integration

### Generated Types

```typescript
// API response types
export interface AssetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Asset[];
}

export interface Asset {
  id: number;
  name: string;
  description: string;
  category: string;
  license: string;
  publisher: Publisher;
}

// Request types
export interface AssetListFilters {
  category?: string[];
  license_code?: string[];
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}
```

### Type-Safe API Calls

```typescript
// Type-safe service functions
export async function getAssets(
  token?: string,
  filters?: AssetListFilters
): Promise<AssetListResponse> {
  const url = buildUrlWithParams('/assets/', filters);
  return apiGet<AssetListResponse>(url, token);
}

export async function getAssetDetails(assetId: number, token?: string): Promise<AssetDetails> {
  return apiGet<AssetDetails>(`/assets/${assetId}/`, token);
}
```

### Runtime Validation

```typescript
// Validate API responses at runtime
import { z } from 'zod';

const AssetSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  license: z.string(),
  publisher: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export function validateAsset(data: unknown): Asset {
  return AssetSchema.parse(data);
}
```

---

## Testing API Integration

### Mock API Responses

```typescript
// MSW handlers for testing
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get(`${API_BASE_URL}/assets/`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: 'Test Asset 1',
          description: 'Test description',
          category: 'mushaf',
          license: 'CC0',
          publisher: { id: 1, name: 'Test Publisher' },
        },
      ],
    });
  }),

  http.post(`${API_BASE_URL}/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }),
];
```

### API Testing Utilities

```typescript
// Test utilities for API calls
export async function mockApiCall<T>(endpoint: string, mockData: T): Promise<T> {
  // Mock implementation
  return new Promise(resolve => {
    setTimeout(() => resolve(mockData), 100);
  });
}

// Test API error handling
export async function testApiError(status: number, message: string) {
  const mockResponse = new Response(JSON.stringify({ message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

  await expect(handleApiResponse(mockResponse)).rejects.toThrow(message);
}
```

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors

**Problem**: Cross-origin requests blocked  
**Solution**: Ensure backend CORS configuration includes frontend domain

```typescript
// Backend CORS configuration should include:
const corsOptions = {
  origin: ['http://localhost:3000', 'https://cms.itqan.dev'],
  credentials: true,
};
```

#### 2. Token Expiration

**Problem**: 401 Unauthorized errors  
**Solution**: Implement automatic token refresh

```typescript
// Token refresh implementation
export async function apiRequestWithRefresh<T>(
  endpoint: string,
  options: RequestOptions
): Promise<T> {
  try {
    return await apiRequest<T>(endpoint, options);
  } catch (error) {
    if (error.message.includes('401')) {
      // Attempt token refresh
      const refreshed = await refreshToken();
      if (refreshed) {
        // Retry original request
        return await apiRequest<T>(endpoint, options);
      }
    }
    throw error;
  }
}
```

#### 3. Network Timeouts

**Problem**: Requests timing out  
**Solution**: Implement timeout handling

```typescript
// Timeout wrapper
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = 10000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

#### 4. Large Response Handling

**Problem**: Large API responses causing performance issues  
**Solution**: Implement streaming or pagination

```typescript
// Stream large responses
export async function* streamAssets(filters: AssetListFilters) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await getAssets(token, { ...filters, page });
    yield* response.results;

    hasMore = !!response.next;
    page++;
  }
}
```

### Debugging Tools

#### 1. Network Tab Inspection

- Check request/response headers
- Verify authentication tokens
- Monitor response times

#### 2. Console Logging

```typescript
// Debug API calls
export async function debugApiCall<T>(endpoint: string, options: RequestOptions): Promise<T> {
  console.log('API Call:', { endpoint, options });

  const startTime = Date.now();
  const response = await apiRequest<T>(endpoint, options);
  const duration = Date.now() - startTime;

  console.log('API Response:', { endpoint, duration, response });
  return response;
}
```

#### 3. API Response Validation

```typescript
// Validate API responses
export function validateApiResponse<T>(data: unknown, schema: z.ZodSchema<T>): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('API Response Validation Error:', error);
    throw new Error('Invalid API response format');
  }
}
```

---

## Best Practices

### 1. Error Handling

- Always handle API errors gracefully
- Provide user-friendly error messages
- Log errors for debugging

### 2. Performance

- Implement request caching where appropriate
- Use pagination for large datasets
- Debounce search requests

### 3. Security

- Never expose API keys in client code
- Validate all API responses
- Implement proper token management

### 4. User Experience

- Show loading states during API calls
- Provide offline fallbacks where possible
- Implement optimistic updates

---

**Document Version**: 1.0  
**Last Updated**: October 20, 2025  
**Authors**: Itqan Development Team  
**Status**: Draft - Ready for Review

---

_This API integration guide is a living document and should be updated as the API evolves._
