# API Integration Guide

This document provides a comprehensive guide to integrating with the Itqan CMS API.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [API Services](#api-services)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## 🔍 Overview

The Itqan CMS uses a well-organized API layer with centralized client utilities and service-specific functions.

### API Architecture

```
src/lib/api/
├── client/              # HTTP client & utilities
│   ├── base.ts         # Base fetch wrapper
│   ├── error-handler.ts # Centralized error handling
│   └── index.ts        # Barrel export
│
└── services/            # API service functions
    ├── auth.service.ts  # Authentication operations
    ├── assets.service.ts # Assets, resources, publishers
    └── index.ts         # Barrel export
```

### Base URL Configuration

The API base URL is configured via environment variables:

```env
NEXT_PUBLIC_BACKEND_URL=https://api.cms.itqan.dev
```

## 🔐 Authentication

### Registration

```typescript
import { registerUser } from '@/lib/api';

const response = await registerUser({
  email: 'user@example.com',
  password: 'securePassword123',
  name: 'John Doe',
  job_title: 'Developer',
  phone: '+1234567890',
});

// Response structure
{
  access: 'eyJ...',      // JWT access token
  refresh: 'eyJ...',     // JWT refresh token
  user: { ... }          // User data
}
```

### Login

```typescript
import { loginUser } from '@/lib/api';

const response = await loginUser({
  email: 'user@example.com',
  password: 'password123',
});

// Store tokens
localStorage.setItem('access_token', response.access);
localStorage.setItem('refresh_token', response.refresh);
```

### Token Refresh

```typescript
import { refreshToken } from '@/lib/api';

try {
  const response = await refreshToken(currentRefreshToken);
  localStorage.setItem('access_token', response.access);
  
  // New refresh token might be provided (token rotation)
  if (response.refresh) {
    localStorage.setItem('refresh_token', response.refresh);
  }
} catch (error) {
  // Refresh token expired, redirect to login
  router.push('/login');
}
```

### Logout

```typescript
import { logoutUser } from '@/lib/api';

const accessToken = localStorage.getItem('access_token');
const refreshToken = localStorage.getItem('refresh_token');

await logoutUser(accessToken, refreshToken);

// Clear local storage
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');
```

### Profile Management

```typescript
import { getUserProfile, updateUserProfile } from '@/lib/api';

// Get profile
const profile = await getUserProfile(accessToken);

// Update profile
const updated = await updateUserProfile(accessToken, {
  name: 'Jane Doe',
  bio: 'Software engineer passionate about open source',
  project_url: 'https://github.com/username/project',
});
```

## 📚 API Services

### Assets

#### List Assets

```typescript
import { getAssets } from '@/lib/api';

const assets = await getAssets(token, {
  category: ['mushaf', 'tafsir'],  // Filter by categories
  license_code: ['cc0'],            // Filter by licenses
  search: 'quran',                  // Search query
  page: 1,                          // Page number
  page_size: 20,                    // Items per page
  ordering: '-created_at',          // Sort by newest first
});

// Response structure
{
  results: [                        // Array of assets
    {
      id: 1,
      name: 'Asset Name',
      description: 'Description',
      category: 'mushaf',
      license: 'CC0 1.0',
      publisher: {
        id: 1,
        name: 'Publisher Name'
      }
    },
    // ...
  ],
  count: 100                        // Total count
}
```

#### Get Asset Details

```typescript
import { getAssetDetails } from '@/lib/api';

const asset = await getAssetDetails(assetId, token);

// Response includes:
// - Full asset information
// - Publisher details
// - Snapshots/previews
// - License information
```

#### Check Access Status

```typescript
import { getAssetAccessStatus } from '@/lib/api';

const status = await getAssetAccessStatus(assetId, token);

if (status.has_access) {
  // User can download
} else if (status.requires_approval) {
  // Show request access form
}
```

#### Request Access

```typescript
import { requestAssetAccess } from '@/lib/api';

const response = await requestAssetAccess(assetId, {
  purpose: 'Research project on Quranic studies',
  intended_use: 'non-commercial',
}, token);

if (response.access) {
  // Access granted immediately
  console.log('Access granted!');
} else {
  // Request pending approval
  console.log('Request submitted for review');
}
```

#### Download Asset

```typescript
import { downloadAsset, API_BASE_URL } from '@/lib/api';

const { download_url } = await downloadAsset(assetId, token);

// Construct full URL and trigger download
const fullUrl = `${API_BASE_URL}${download_url}`;
window.location.href = fullUrl;
```

### Resources

#### List Resources

```typescript
import { getResources } from '@/lib/api';

const resources = await getResources(token, {
  category: ['mushaf'],
  status: ['ready'],
  publisher_id: [1, 2, 3],
  search: 'tafsir',
  page: 1,
  page_size: 20,
});
```

#### Create Resource

```typescript
import { createResource } from '@/lib/api';

const resource = await createResource({
  name: 'New Tafsir Collection',
  description: 'Comprehensive tafsir texts',
  category: 'tafsir',
  publisher_id: 1,
}, token);
```

#### Update Resource

```typescript
import { updateResource, partialUpdateResource } from '@/lib/api';

// Full update (all fields required)
const updated = await updateResource(resourceId, {
  name: 'Updated Name',
  description: 'Updated description',
  category: 'tafsir',
  status: 'ready',
}, token);

// Partial update (only provided fields)
const updated = await partialUpdateResource(resourceId, {
  status: 'ready',  // Only update status
}, token);
```

#### Delete Resource

```typescript
import { deleteResource } from '@/lib/api';

await deleteResource(resourceId, token);
console.log('Resource deleted successfully');
```

### Publishers

```typescript
import { getPublisherDetails } from '@/lib/api';

const publisher = await getPublisherDetails(publisherId, token);

// Response includes:
// - Publisher information
// - Verification status
// - Contact details
// - Statistics
```

## ⚠️ Error Handling

### Error Response Structure

```typescript
{
  error_name: 'VALIDATION_ERROR',  // Error identifier
  message: 'Email already exists',  // Human-readable message
  extra: { ... }                    // Additional context (optional)
}
```

### Handling Errors

```typescript
import { getErrorMessage, isAuthError, isNetworkError } from '@/lib/api';

try {
  const response = await getAssets(token);
} catch (error) {
  // Get user-friendly error message
  const message = getErrorMessage(error);
  
  // Check error type
  if (isAuthError(error)) {
    // Redirect to login
    router.push('/login');
  } else if (isNetworkError(error)) {
    // Show network error message
    toast.error('Network error. Please check your connection.');
  } else {
    // Show generic error
    toast.error(message);
  }
}
```

### Common Error Codes

| Error Code | Description | Action |
|------------|-------------|--------|
| `AUTHENTICATION_ERROR` | Invalid or missing token | Redirect to login |
| `VALIDATION_ERROR` | Invalid input data | Show validation errors |
| `NOT_FOUND` | Resource not found | Show 404 page |
| `PERMISSION_DENIED` | Insufficient permissions | Show error message |
| `RATE_LIMIT_EXCEEDED` | Too many requests | Ask user to wait |

## 💡 Best Practices

### 1. Use Centralized Services

```typescript
// ✅ CORRECT - Use service functions
import { getAssets } from '@/lib/api';
const assets = await getAssets(token, filters);

// ❌ INCORRECT - Don't call fetch directly
const response = await fetch(`${API_BASE_URL}/assets/`);
```

### 2. Handle Errors Properly

```typescript
// ✅ CORRECT - Comprehensive error handling
try {
  const data = await apiCall();
  return { success: true, data };
} catch (error) {
  console.error('API Error:', error);
  return {
    success: false,
    error: getErrorMessage(error)
  };
}
```

### 3. Use TypeScript Types

```typescript
import type { PagedListAssetOut, AssetListFilters } from '@/lib/types';

async function fetchAssets(
  filters: AssetListFilters
): Promise<PagedListAssetOut> {
  return getAssets(token, filters);
}
```

### 4. Build URLs with Parameters

```typescript
import { buildUrlWithParams } from '@/lib/api';

const url = buildUrlWithParams('/assets/', {
  category: ['mushaf', 'tafsir'],
  page: 1,
  page_size: 20,
});
// Result: '/assets/?category=mushaf&category=tafsir&page=1&page_size=20'
```

### 5. Token Management

```typescript
// Store tokens securely
import { tokenStorage } from '@/lib/auth';

// Get token
const token = tokenStorage.getToken();

// Set token
tokenStorage.setToken(accessToken);

// Remove token
tokenStorage.removeToken();

// Check authentication
const isAuth = tokenStorage.isAuthenticated();
```

## 🔄 Data Conversion

Convert API responses to internal models using conversion utilities:

```typescript
import { convertListAssetToAsset } from '@/lib/utils';
import type { ListAssetOut } from '@/lib/types';

const apiAsset: ListAssetOut = { /* ... */ };
const asset = convertListAssetToAsset(apiAsset);

// Now asset has the internal Asset model structure
```

## 📝 Complete Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getAssets } from '@/lib/api';
import { convertListAssetToAsset, getErrorMessage } from '@/lib/utils';
import { tokenStorage } from '@/lib/auth';
import type { Asset } from '@/lib/types';

export function AssetList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchAssets() {
      try {
        const token = tokenStorage.getToken();
        const response = await getAssets(token, {
          category: ['mushaf'],
          page: 1,
          page_size: 20,
        });
        
        const convertedAssets = response.results.map(convertListAssetToAsset);
        setAssets(convertedAssets);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssets();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {assets.map(asset => (
        <div key={asset.id}>{asset.title}</div>
      ))}
    </div>
  );
}
```

## 🔗 Related Documentation

- [Type Definitions](../src/lib/types/api/README.md)
- [Error Handling](../src/lib/api/client/error-handler.ts)
- [Conversion Utilities](../src/lib/utils/conversion.utils.ts)

