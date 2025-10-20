# Refactoring Plan for Open-Source Contribution Readiness

**Version**: 1.0  
**Last Updated**: October 20, 2025  
**Project**: Itqan CMS (Next.js 15 + TypeScript + ShadCN)

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Phase 1: Documentation & Onboarding](#phase-1-documentation--onboarding)
3. [Phase 2: Code Quality & Standards](#phase-2-code-quality--standards)
4. [Phase 3: Testing Infrastructure](#phase-3-testing-infrastructure)
5. [Phase 4: Type Safety & Architecture](#phase-4-type-safety--architecture)
6. [Phase 5: Performance Optimization](#phase-5-performance-optimization)
7. [Phase 6: Accessibility & SEO](#phase-6-accessibility--seo)
8. [Phase 7: Security Hardening](#phase-7-security-hardening)
9. [Phase 8: Developer Experience](#phase-8-developer-experience)
10. [Phase 9: UI/UX Consistency](#phase-9-uiux-consistency)
11. [Phase 10: Deployment & CI/CD](#phase-10-deployment--cicd)

---

## Executive Summary

### Current State Analysis

**Strengths** ✅

- Well-structured Next.js 15 App Router architecture
- Strong TypeScript typing throughout
- Excellent i18n implementation with next-intl
- Comprehensive RTL/LTR support using CSS logical properties
- Clean API service layer with centralized error handling
- Good JSDoc documentation for functions
- Consistent component organization

**Critical Gaps** ⚠️

- **No test coverage** (0%) - Critical for open-source
- Missing API and Architecture documentation
- No `.env.example` file
- No CI/CD pipeline configuration
- Limited accessibility testing and implementation
- Performance optimizations needed
- Security improvements required
- Missing error boundaries
- No analytics or monitoring setup

### Refactoring Priorities

**Must-Have (Before Open-Source Launch)**

1. Complete testing infrastructure (Phase 3)
2. Documentation completion (Phase 1)
3. `.env.example` file (Phase 7)
4. Security hardening (Phase 7)
5. Error boundaries (Phase 4)

**Should-Have (First Month After Launch)** 6. Performance optimizations (Phase 5) 7. Accessibility improvements (Phase 6) 8. CI/CD pipeline (Phase 10) 9. Developer experience enhancements (Phase 8)

**Nice-to-Have (Ongoing)** 10. Advanced monitoring and analytics 11. Advanced performance features 12. Comprehensive E2E testing

---

## Phase 1: Documentation & Onboarding

**Goal**: Make the project accessible and understandable for new contributors.

### 1.1 Create Missing Documentation Files

#### Task 1.1.1: Create `.env.example`

**Priority**: Critical  
**Effort**: 15 minutes

```bash
# .env.example
# ============================================================================
# Itqan CMS Environment Configuration
# ============================================================================
# Copy this file to .env.local and fill in your values
# See README.md for detailed setup instructions

# ============================================================================
# REQUIRED VARIABLES
# ============================================================================

# Backend API URL (REQUIRED)
# Development: https://develop.api.cms.itqan.dev
# Staging: https://staging.api.cms.itqan.dev
# Production: https://api.cms.itqan.dev
NEXT_PUBLIC_BACKEND_URL=https://develop.api.cms.itqan.dev

# ============================================================================
# OPTIONAL VARIABLES
# ============================================================================

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Itqan CMS
NEXT_PUBLIC_APP_DESCRIPTION=A modern multilingual CMS with RTL support
NEXT_PUBLIC_DEFAULT_LOCALE=ar

# Analytics (Optional)
# Get your analytics ID from your analytics provider
NEXT_PUBLIC_ANALYTICS_ID=

# Error Tracking (Optional)
# Get your Sentry DSN from https://sentry.io
NEXT_PUBLIC_SENTRY_DSN=

# Feature Flags (Optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_ERROR_TRACKING=false

# Development Options
NODE_ENV=development
```

#### Task 1.1.2: Create `docs/ARCHITECTURE.md`

**Priority**: High  
**Effort**: 2 hours

Create comprehensive architecture documentation covering:

- System architecture diagram
- Data flow diagrams
- Component hierarchy
- API integration patterns
- State management approach
- Authentication flow
- File upload handling
- Caching strategy

#### Task 1.1.3: Create `docs/API.md`

**Priority**: High  
**Effort**: 1.5 hours

Create API integration guide covering:

- API endpoints reference
- Authentication mechanisms
- Request/response examples
- Error handling patterns
- Rate limiting considerations
- Pagination patterns

#### Task 1.1.4: Create `docs/TESTING.md`

**Priority**: High  
**Effort**: 1 hour

Create testing guide covering:

- Testing philosophy
- How to write tests
- Running tests locally
- Test coverage requirements
- Mocking strategies

### 1.2 Enhance Existing Documentation

#### Task 1.2.1: Improve README.md

**Priority**: Medium  
**Effort**: 1 hour

**Updates needed**:

- Add badges for build status, test coverage, license
- Add troubleshooting section
- Add FAQ section
- Improve setup instructions with common issues
- Add visual screenshots
- Add links to live demo

#### Task 1.2.2: Enhance CONTRIBUTING.md

**Priority**: Medium  
**Effort**: 30 minutes

**Updates needed**:

- Add "Good First Issue" guidelines
- Add pull request template reference
- Add code review checklist
- Add performance benchmarking guide

### 1.3 Create GitHub Templates

#### Task 1.3.1: Pull Request Template

**Priority**: High  
**Effort**: 20 minutes

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description

<!-- Provide a brief description of your changes -->

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Related Issues

<!-- Link related issues using #issue_number -->

Closes #

## Changes Made

## <!-- List the specific changes you made -->

-
-

## Testing Done

<!-- Describe the testing you performed -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed
- [ ] Tested in both Arabic (RTL) and English (LTR)
- [ ] Tested in light and dark modes
- [ ] Tested on mobile and desktop

## Screenshots (if applicable)

<!-- Add screenshots showing your changes -->

## Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented complex logic
- [ ] I have updated relevant documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] All new and existing tests pass locally
- [ ] All text is properly translated (no hardcoded strings)
- [ ] I have used CSS logical properties (no ml-/mr-/left/right)
```

#### Task 1.3.2: Issue Templates

**Priority**: High  
**Effort**: 30 minutes

Create issue templates:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/documentation.md`

---

## Phase 2: Code Quality & Standards

**Goal**: Ensure consistent code quality and enforce best practices.

### 2.1 Code Organization Improvements

#### Task 2.1.1: Extract Large Components

**Priority**: Medium  
**Effort**: 3 hours

**Components to refactor**:

1. **`asset-store.tsx` (419 lines)** - Extract into smaller components:

   ```typescript
   // Proposed structure:
   src/components/store/
   ├── asset-store.tsx (main container - ~100 lines)
   ├── asset-filters.tsx (filters sidebar - ~150 lines)
   │   ├── search-filter.tsx
   │   ├── category-filter.tsx
   │   └── license-filter.tsx
   ├── asset-grid.tsx (asset cards grid - ~100 lines)
   ├── asset-card.tsx (individual card - ~60 lines)
   └── asset-pagination.tsx (~40 lines)
   ```

2. **`login-form.tsx`** - Consider extraction if OAuth is added:
   ```typescript
   src/components/auth/
   ├── login-form.tsx
   ├── oauth-buttons.tsx (for Google/GitHub buttons)
   └── auth-form-wrapper.tsx (common form layout)
   ```

#### Task 2.1.2: Create Shared Hooks Directory

**Priority**: Low  
**Effort**: 1 hour

Organize hooks better:

```typescript
src/hooks/
├── index.ts (barrel export)
├── use-form.ts (✓ exists)
├── use-debounce.ts (NEW - extract from asset-store)
├── use-pagination.ts (NEW - extract pagination logic)
├── use-filters.ts (NEW - extract filter logic)
└── use-local-storage.ts (NEW - standardize localStorage access)
```

### 2.2 ESLint Configuration Enhancement

#### Task 2.2.1: Add Stricter ESLint Rules

**Priority**: Medium  
**Effort**: 30 minutes

Update `eslint.config.mjs`:

```javascript
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
        },
      ],

      // React specific
      'react/no-unescaped-entities': 'error',
      'react/jsx-no-target-blank': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Import organization
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];
```

### 2.3 Code Consistency Fixes

#### Task 2.3.1: Remove `console.log` Statements

**Priority**: High  
**Effort**: 30 minutes

**Files with console.log to address**:

- `src/components/store/asset-store.tsx` (line 124)
- Other files as discovered

**Action**: Replace with proper logging utility:

```typescript
// src/lib/logger.ts (NEW FILE)
const isDev = process.env.NODE_ENV === 'development';

export const logger = {
  debug: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(`[INFO] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
};
```

#### Task 2.3.2: Fix TypeScript `any` Usage

**Priority**: High  
**Effort**: 1 hour

**Files with `any` usage**:

- `src/lib/api/services/assets.service.ts` (lines 65, 206)

**Action**: Replace with proper types or use `unknown` with type guards.

---

## Phase 3: Testing Infrastructure

**Goal**: Achieve 80%+ test coverage with comprehensive testing.

### 3.1 Setup Testing Framework

#### Task 3.1.1: Install Testing Dependencies

**Priority**: Critical  
**Effort**: 30 minutes

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  @vitest/ui \
  vitest \
  @vitejs/plugin-react \
  jsdom \
  msw
```

#### Task 3.1.2: Configure Vitest

**Priority**: Critical  
**Effort**: 45 minutes

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'src/app/**/layout.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/error.tsx',
        'src/app/**/not-found.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/en/store',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: 'en' }),
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### 3.2 Write Unit Tests

#### Task 3.2.1: Test Utility Functions

**Priority**: Critical  
**Effort**: 3 hours

Create test files for:

```typescript
// src/lib/utils/__tests__/validation.utils.test.ts
import { describe, it, expect } from 'vitest';
import { validators, validateLoginForm, validateSignupForm } from '../validation.utils';

describe('Email Validator', () => {
  const t = (key: string) => key;

  it('should validate correct email', () => {
    expect(validators.email('test@example.com', t)).toBeNull();
  });

  it('should reject invalid email', () => {
    expect(validators.email('invalid-email', t)).toBeTruthy();
  });

  it('should reject empty email', () => {
    expect(validators.email('', t)).toBeTruthy();
  });
});

// Add more tests for all validators...
```

```typescript
// src/lib/utils/__tests__/conversion.utils.test.ts
import { describe, it, expect } from 'vitest';
import { convertListAssetToAsset } from '../conversion.utils';

describe('Asset Conversion', () => {
  it('should convert API asset to internal format', () => {
    const apiAsset = {
      id: 1,
      name: 'Test Asset',
      description: 'Test Description',
      category: 'mushaf',
      publisher: { id: 1, name: 'Test Publisher' },
      license: 'CC0',
    };

    const result = convertListAssetToAsset(apiAsset);

    expect(result).toMatchObject({
      id: '1',
      title: 'Test Asset',
      description: 'Test Description',
      publisher: 'Test Publisher',
      license: 'CC0',
    });
  });
});
```

#### Task 3.2.2: Test Custom Hooks

**Priority**: High  
**Effort**: 2 hours

```typescript
// src/hooks/__tests__/use-form.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useForm } from '../use-form';

describe('useForm Hook', () => {
  const mockTranslations = (key: string) => key;

  // Mock next-intl
  vi.mock('next-intl', () => ({
    useTranslations: () => mockTranslations,
  }));

  it('should initialize with initial data', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    expect(result.current.formData).toEqual({ email: '', password: '' });
    expect(result.current.errors).toEqual({});
    expect(result.current.isLoading).toBe(false);
  });

  it('should update form data on input change', () => {
    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: async () => ({ success: true }),
      })
    );

    act(() => {
      const event = {
        target: { value: 'test@example.com' },
      } as React.ChangeEvent<HTMLInputElement>;
      result.current.handleInputChange('email')(event);
    });

    expect(result.current.formData.email).toBe('test@example.com');
  });

  // Add more tests...
});
```

### 3.3 Write Component Tests

#### Task 3.3.1: Test UI Components

**Priority**: High  
**Effort**: 4 hours

```typescript
// src/components/ui/__tests__/button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../button';

describe('Button Component', () => {
  it('should render button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

#### Task 3.3.2: Test Form Components

**Priority**: High  
**Effort**: 3 hours

```typescript
// src/components/auth/__tests__/login-form.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../login-form';

// Mock the auth context
vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    login: vi.fn(),
    user: null,
    isAuthenticated: false
  })
}));

describe('LoginForm Component', () => {
  it('should render login form', () => {
    render(<LoginForm locale="en" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<LoginForm locale="en" />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  // Add more tests for successful submission, error handling, etc.
});
```

### 3.4 Write Integration Tests

#### Task 3.4.1: Setup MSW for API Mocking

**Priority**: High  
**Effort**: 2 hours

```typescript
// src/test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';
import { env } from '@/lib/env';

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export const handlers = [
  // Auth endpoints
  http.post(`${API_URL}/auth/login/`, () => {
    return HttpResponse.json({
      access: 'mock-access-token',
      refresh: 'mock-refresh-token',
    });
  }),

  http.get(`${API_URL}/auth/profile/`, () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      phone: '+123456789',
      bio: 'Test bio',
      project_summary: 'Test project',
    });
  }),

  // Assets endpoints
  http.get(`${API_URL}/assets/`, () => {
    return HttpResponse.json({
      count: 2,
      next: null,
      previous: null,
      results: [
        {
          id: 1,
          name: 'Test Asset 1',
          description: 'Test description 1',
          category: 'mushaf',
          publisher: { id: 1, name: 'Publisher 1' },
          license: 'CC0',
        },
        {
          id: 2,
          name: 'Test Asset 2',
          description: 'Test description 2',
          category: 'tafsir',
          publisher: { id: 2, name: 'Publisher 2' },
          license: 'CC-BY',
        },
      ],
    });
  }),
];
```

```typescript
// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

Update `src/test/setup.ts`:

```typescript
import { beforeAll, afterAll, afterEach } from 'vitest';
import { server } from './mocks/server';

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Clean up after all tests
afterAll(() => server.close());
```

### 3.5 Add Test Scripts

#### Task 3.5.1: Update package.json

**Priority**: Critical  
**Effort**: 5 minutes

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest run --coverage"
  }
}
```

---

## Phase 4: Type Safety & Architecture

**Goal**: Strengthen type safety and improve architectural patterns.

### 4.1 Error Boundaries

#### Task 4.1.1: Create Global Error Boundary

**Priority**: High  
**Effort**: 1 hour

```typescript
// src/components/error-boundary.tsx (NEW FILE)
'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We apologize for the inconvenience. An unexpected error occurred.
              </p>
              {this.state.error && (
                <details className="text-sm">
                  <summary className="cursor-pointer">Error details</summary>
                  <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <Button
                onClick={() => this.setState({ hasError: false })}
                className="w-full"
              >
                Try again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

#### Task 4.1.2: Integrate Error Boundary in Layout

**Priority**: High  
**Effort**: 15 minutes

Update `src/app/[locale]/layout.tsx`:

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

// ... existing code ...

return (
  <html lang={validatedLocale} dir={dir} suppressHydrationWarning>
    <body className={cn(/* ... */)}>
      <ErrorBoundary>
        <ThemeProvider>
          <NextIntlProvider locale={validatedLocale} messages={messages}>
            <AuthProvider locale={validatedLocale}>
              <ConditionalHeader locale={validatedLocale} />
              <main className="pt-16">
                {children}
              </main>
            </AuthProvider>
          </NextIntlProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </body>
  </html>
);
```

### 4.2 Enhance Type Definitions

#### Task 4.2.1: Create Domain Models

**Priority**: Medium  
**Effort**: 2 hours

Enhance existing models with stricter types:

```typescript
// src/lib/types/models/asset.model.ts
import { z } from 'zod';

// Define Zod schemas for runtime validation
export const AssetCategorySchema = z.enum(['mushaf', 'tafsir', 'recitation']);
export const LicenseColorSchema = z.enum(['green', 'yellow', 'red']);

export const AssetSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  license: z.string(),
  publisher: z.string(),
  category: AssetCategorySchema,
  licenseColor: LicenseColorSchema.optional(),
  type: z.enum(['translation', 'tafsir', 'audio']).optional(),
  thumbnailUrl: z.string().url().optional(),
  hasAccess: z.boolean().optional(),
  downloadCount: z.number().int().nonnegative().optional(),
  fileSize: z.string().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;
export type AssetCategory = z.infer<typeof AssetCategorySchema>;
export type LicenseColor = z.infer<typeof LicenseColorSchema>;
```

#### Task 4.2.2: Add Runtime Validation

**Priority**: Low  
**Effort**: 3 hours

Add Zod validation at API boundaries:

```typescript
// src/lib/api/services/assets.service.ts
import { AssetSchema } from '@/lib/types/models/asset.model';

export async function getAssetDetails(assetId: number, token?: string): Promise<DetailAssetOut> {
  const data = await apiGet<DetailAssetOut>(`/assets/${assetId}/`, token);

  // Runtime validation
  try {
    AssetSchema.parse(convertDetailAssetToAssetDetails(data));
  } catch (error) {
    console.error('Asset validation failed:', error);
    throw new Error('Invalid asset data received from API');
  }

  return data;
}
```

### 4.3 Improve State Management

#### Task 4.3.1: Create Centralized State Types

**Priority**: Low  
**Effort**: 1 hour

```typescript
// src/lib/types/state.types.ts (NEW FILE)
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface FilterState {
  search: string;
  categories: string[];
  licenses: string[];
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
```

---

## Phase 5: Performance Optimization

**Goal**: Improve application performance and user experience.

### 5.1 Image Optimization

#### Task 5.1.1: Add Image Optimization

**Priority**: High  
**Effort**: 1 hour

Update all `<Image />` components with proper sizing:

```typescript
// Example in asset-card.tsx
<Image
  src={asset.thumbnailUrl || '/placeholder-asset.png'}
  alt={asset.title}
  width={300}
  height={200}
  className="w-full h-48 object-cover"
  placeholder="blur"
  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
/>
```

### 5.2 Code Splitting & Lazy Loading

#### Task 5.2.1: Implement Dynamic Imports

**Priority**: Medium  
**Effort**: 2 hours

```typescript
// src/components/store/asset-store.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AccessRequestDialog = dynamic(
  () => import('./access-request-form').then(mod => ({ default: mod.AccessRequestForm })),
  { loading: () => <p>Loading...</p> }
);

const LicenseCarousel = dynamic(
  () => import('./license-carousel').then(mod => ({ default: mod.LicenseCarousel })),
  { ssr: false }
);
```

### 5.3 Caching Strategy

#### Task 5.3.1: Implement API Response Caching

**Priority**: Medium  
**Effort**: 2 hours

```typescript
// src/lib/cache.ts (NEW FILE)
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new Cache();
```

Use in API services:

```typescript
// src/lib/api/services/assets.service.ts
export async function getAssets(
  token?: string,
  filters?: AssetListFilters
): Promise<PagedListAssetOut> {
  const cacheKey = `assets:${JSON.stringify(filters)}`;
  const cached = apiCache.get<PagedListAssetOut>(cacheKey);

  if (cached) {
    return cached;
  }

  const url = buildUrlWithParams('/assets/', filters as any);
  const data = await apiGet<PagedListAssetOut>(url, token);

  apiCache.set(cacheKey, data, 5 * 60 * 1000); // Cache for 5 minutes
  return data;
}
```

### 5.4 Bundle Size Optimization

#### Task 5.4.1: Analyze Bundle Size

**Priority**: Medium  
**Effort**: 30 minutes

```bash
npm install --save-dev @next/bundle-analyzer
```

Update `next.config.ts`:

```typescript
import { BundleAnalyzerPlugin } from '@next/bundle-analyzer';

const withBundleAnalyzer = BundleAnalyzerPlugin({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = withBundleAnalyzer({
  // ... existing config
});
```

Add script to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build"
  }
}
```

---

## Phase 6: Accessibility & SEO

**Goal**: Ensure WCAG 2.1 AA compliance and optimize for search engines.

### 6.1 Accessibility Improvements

#### Task 6.1.1: Add ARIA Labels

**Priority**: High  
**Effort**: 3 hours

**Components requiring ARIA labels**:

1. Navigation elements
2. Interactive buttons without text
3. Form inputs (if not already labeled)
4. Dialog/Modal components
5. Pagination components

Example updates:

```typescript
// src/components/store/asset-store.tsx
<Input
  placeholder={t('ui.searchInResources')}
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full"
  aria-label={t('ui.searchInResources')}
  aria-describedby="search-help-text"
/>
<p id="search-help-text" className="sr-only">
  {t('ui.searchHelpText')}
</p>
```

#### Task 6.1.2: Keyboard Navigation

**Priority**: High  
**Effort**: 2 hours

Ensure all interactive elements are keyboard accessible:

```typescript
// Example: Asset card with keyboard support
<div
  role="article"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/${locale}/store/asset/${asset.id}`);
    }
  }}
  className="focus:outline-none focus:ring-2 focus:ring-primary"
>
  {/* Card content */}
</div>
```

#### Task 6.1.3: Focus Management

**Priority**: Medium  
**Effort**: 2 hours

Add focus trap for modals:

```typescript
// Install focus-trap-react
npm install focus-trap-react

// Update dialog components
import FocusTrap from 'focus-trap-react';

<FocusTrap active={isOpen}>
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    {/* Dialog content */}
  </Dialog>
</FocusTrap>
```

#### Task 6.1.4: Screen Reader Support

**Priority**: High  
**Effort**: 3 hours

Add proper headings hierarchy and landmarks:

```typescript
// src/components/store/asset-store.tsx
<div className="max-width-container px-4 py-8">
  <header className="mb-5">
    <h1 className="text-3xl font-bold">{t('store.title')}</h1>
  </header>

  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5">
    <aside aria-label="Filters">
      <h2 className="sr-only">{t('store.filters')}</h2>
      {/* Filters content */}
    </aside>

    <main aria-label="Assets grid">
      <h2 className="sr-only">{t('store.assetsResults')}</h2>
      {/* Assets grid */}
    </main>
  </div>
</div>
```

### 6.2 SEO Enhancements

#### Task 6.2.1: Add Structured Data

**Priority**: Medium  
**Effort**: 2 hours

```typescript
// src/app/[locale]/store/asset/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const asset = await getAssetDetails(Number(id));

  return {
    title: asset.name,
    description: asset.description,
    openGraph: {
      title: asset.name,
      description: asset.description,
      images: [asset.thumbnail_url],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: asset.name,
      description: asset.description,
      images: [asset.thumbnail_url],
    },
    // Structured data
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: asset.name,
        description: asset.description,
        image: asset.thumbnail_url,
        author: {
          '@type': 'Organization',
          name: asset.publisher.name,
        },
        license: asset.license,
      }),
    },
  };
}
```

#### Task 6.2.2: Create Sitemap

**Priority**: Medium  
**Effort**: 1 hour

```typescript
// src/app/sitemap.ts (NEW FILE)
import { MetadataRoute } from 'next';
import { getAssets } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://cms.itqan.dev';

  // Get all assets
  const assets = await getAssets(undefined, { page_size: 1000 });

  const assetUrls = assets.results.flatMap(asset => [
    {
      url: `${baseUrl}/ar/store/asset/${asset.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/store/asset/${asset.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]);

  return [
    {
      url: `${baseUrl}/ar/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/en/store`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...assetUrls,
  ];
}
```

#### Task 6.2.3: Add robots.txt

**Priority**: Low  
**Effort**: 10 minutes

```typescript
// src/app/robots.ts (NEW FILE)
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/complete-profile'],
      },
    ],
    sitemap: 'https://cms.itqan.dev/sitemap.xml',
  };
}
```

---

## Phase 7: Security Hardening

**Goal**: Ensure application security best practices.

### 7.1 Environment Variables Security

#### Task 7.1.1: Create `.env.example` File

**Priority**: Critical  
**Effort**: 15 minutes

✅ Already covered in Phase 1, Task 1.1.1

#### Task 7.1.2: Validate Environment Variables

**Priority**: High  
**Effort**: 30 minutes

Enhance `src/lib/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  NEXT_PUBLIC_BACKEND_URL: z.string().url(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_APP_NAME: z.string().default('Itqan CMS'),
  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('A modern multilingual CMS with RTL support'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['ar', 'en']).default('ar'),
  NEXT_PUBLIC_ANALYTICS_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

const envParsed = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
});

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:', envParsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables');
}

export const env = envParsed.data;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';
```

### 7.2 Content Security Policy

#### Task 7.2.1: Add CSP Headers

**Priority**: High  
**Effort**: 1 hour

Update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  // ... existing config

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};
```

### 7.3 Input Sanitization

#### Task 7.3.1: Add DOMPurify for User Input

**Priority**: Medium  
**Effort**: 1 hour

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

```typescript
// src/lib/sanitize.ts (NEW FILE)
import DOMPurify from 'dompurify';

export function sanitizeHtml(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: just strip all HTML tags
    return dirty.replace(/<[^>]*>?/gm, '');
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

export function sanitizeText(text: string): string {
  // Remove any HTML tags and escape special characters
  return text
    .replace(/<[^>]*>?/gm, '')
    .replace(/[<>]/g, '')
    .trim();
}
```

---

## Phase 8: Developer Experience

**Goal**: Improve developer productivity and contribution experience.

### 8.1 Developer Tools

#### Task 8.1.1: Add Prettier Configuration

**Priority**: Medium  
**Effort**: 20 minutes

```bash
npm install --save-dev prettier eslint-config-prettier
```

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Create `.prettierignore`:

```
.next
node_modules
build
dist
*.min.js
*.min.css
```

Update `package.json`:

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

#### Task 8.1.2: Add Husky for Git Hooks

**Priority**: Medium  
**Effort**: 30 minutes

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Update `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### 8.2 Development Documentation

#### Task 8.2.1: Create Development Guide

**Priority**: High  
**Effort**: 2 hours

Create `docs/DEVELOPMENT.md`:

````markdown
# Development Guide

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Git

### Initial Setup

\`\`\`bash

# Clone the repository

git clone https://github.com/Itqan-community/cms-frontend.git
cd cms-frontend

# Install dependencies

npm install

# Copy environment file

cp .env.example .env.local

# Edit .env.local with your configuration

# At minimum, set NEXT_PUBLIC_BACKEND_URL

# Run development server

npm run dev
\`\`\`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

[Add detailed project structure explanation]

## Coding Standards

[Reference CONTRIBUTING.md]

## Common Tasks

### Adding a New Page

### Adding a New Component

### Adding a New API Service

### Adding Translations

## Troubleshooting

[Add common issues and solutions]
\`\`\`

---

## Phase 9: UI/UX Consistency

**Goal**: Ensure consistent UI/UX across all components.

### 9.1 Component Library Audit

#### Task 9.1.1: Document Component Variants

**Priority**: Low  
**Effort**: 3 hours

Create `docs/COMPONENTS.md`:

```markdown
# Component Library

## Button Component

\`\`\`typescript
import { Button } from '@/components/ui/button';

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// States
<Button disabled>Disabled</Button>
<Button loading>Loading</Button>
\`\`\`

[Continue for all components]
```
````

### 9.2 Design Tokens

#### Task 9.2.1: Centralize Design Tokens

**Priority**: Low  
**Effort**: 2 hours

```typescript
// src/lib/design-tokens.ts (NEW FILE)
export const spacing = {
  xs: '0.25rem', // 4px
  sm: '0.5rem', // 8px
  md: '1rem', // 16px
  lg: '1.5rem', // 24px
  xl: '2rem', // 32px
  '2xl': '3rem', // 48px
} as const;

export const fontSize = {
  xs: '0.75rem', // 12px
  sm: '0.875rem', // 14px
  base: '1rem', // 16px
  lg: '1.125rem', // 18px
  xl: '1.25rem', // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;
```

---

## Phase 10: Deployment & CI/CD

**Goal**: Automate deployment and ensure quality checks.

### 10.1 GitHub Actions Setup

#### Task 10.1.1: Create CI Workflow

**Priority**: High  
**Effort**: 1 hour

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-and-type-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests with coverage
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: true

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_BACKEND_URL: ${{ secrets.NEXT_PUBLIC_BACKEND_URL }}
```

#### Task 10.1.2: Create Release Workflow

**Priority**: Medium  
**Effort**: 1 hour

Create `.github/workflows/release.yml`:

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          NEXT_PUBLIC_BACKEND_URL: ${{ secrets.NEXT_PUBLIC_BACKEND_URL }}

      - name: Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          draft: false
          prerelease: false
```

### 10.2 Deployment Configuration

#### Task 10.2.1: Update Netlify Configuration

**Priority**: High  
**Effort**: 30 minutes

Update `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  NEXT_PUBLIC_BACKEND_URL = "https://api.cms.itqan.dev"

[context.staging.environment]
  NEXT_PUBLIC_BACKEND_URL = "https://staging.api.cms.itqan.dev"

[context.develop.environment]
  NEXT_PUBLIC_BACKEND_URL = "https://develop.api.cms.itqan.dev"
```

---

## 🎯 Implementation Timeline

### Phase Priority Matrix

| Phase    | Priority     | Estimated Time | Dependencies |
| -------- | ------------ | -------------- | ------------ |
| Phase 1  | **CRITICAL** | 8-10 hours     | None         |
| Phase 2  | **HIGH**     | 6-8 hours      | Phase 1      |
| Phase 3  | **CRITICAL** | 20-25 hours    | Phase 2      |
| Phase 4  | **HIGH**     | 10-12 hours    | Phase 3      |
| Phase 5  | **MEDIUM**   | 8-10 hours     | Phase 4      |
| Phase 6  | **HIGH**     | 12-15 hours    | Phase 5      |
| Phase 7  | **CRITICAL** | 6-8 hours      | Phase 1      |
| Phase 8  | **MEDIUM**   | 6-8 hours      | Phase 2      |
| Phase 9  | **LOW**      | 6-8 hours      | Phase 5      |
| Phase 10 | **HIGH**     | 4-6 hours      | Phase 3      |

### Recommended Implementation Order

**Week 1: Critical Foundation**

- Phase 1: Documentation & Onboarding (Days 1-2)
- Phase 7: Security Hardening (Day 3)
- Phase 2: Code Quality (Days 4-5)

**Week 2-3: Testing Infrastructure**

- Phase 3: Testing Infrastructure (Complete week 2 and part of week 3)

**Week 4: Architecture & Performance**

- Phase 4: Type Safety & Architecture (Days 1-3)
- Phase 5: Performance Optimization (Days 4-5)

**Week 5: Polish & Deployment**

- Phase 6: Accessibility & SEO (Days 1-3)
- Phase 10: Deployment & CI/CD (Day 4)
- Phase 8: Developer Experience (Day 5)

**Ongoing: UI/UX**

- Phase 9: UI/UX Consistency (As needed)

---

## 🔧 Maintenance & Ongoing Tasks

### Monthly Tasks

- Review and update dependencies
- Check for security vulnerabilities (`npm audit`)
- Review test coverage and add missing tests
- Update documentation based on changes

### Quarterly Tasks

- Review and update architecture decisions
- Performance audit and optimization
- Accessibility audit
- Security audit

### Before Each Major Release

- Run full test suite
- Update CHANGELOG.md
- Update version in package.json
- Create release notes
- Tag release in Git

---

## 📊 Success Metrics

### Before Open-Source Launch

- [ ] Test coverage ≥ 80%
- [ ] All documentation complete
- [ ] No high/critical security vulnerabilities
- [ ] All ESLint rules passing
- [ ] TypeScript strict mode with no errors
- [ ] Accessibility audit passes WCAG 2.1 AA
- [ ] Performance score ≥ 90 (Lighthouse)
- [ ] SEO score ≥ 95 (Lighthouse)

### Post-Launch Goals (3 months)

- Maintain test coverage ≥ 85%
- Average PR review time < 48 hours
- Issue resolution time < 7 days
- Zero high/critical bugs in production

---

## 🚨 Breaking Changes Warning

> ⚠️ **Note**: This refactoring plan is designed to be **non-breaking**. All changes maintain backward compatibility with current functionality. However, the following sections may require careful consideration:

### Phase 4.1 - Error Boundaries

- **Impact**: Changes error handling behavior
- **Risk**: Low - Only affects error display, not functionality
- **Recommendation**: Test thoroughly in staging

### Phase 5.3 - Caching Strategy

- **Impact**: Changes data fetching behavior
- **Risk**: Medium - May affect data freshness
- **Recommendation**: Implement with feature flag, test cache invalidation

### Phase 7.2 - Content Security Policy

- **Impact**: May block external resources
- **Risk**: Medium - Could break integrations
- **Recommendation**: Test all external integrations, implement gradually

---

## 📝 Final Checklist

Before declaring the project "open-source ready":

### Documentation

- [ ] README.md updated with badges and clear instructions
- [ ] CONTRIBUTING.md enhanced with detailed guidelines
- [ ] ARCHITECTURE.md created
- [ ] API.md created
- [ ] TESTING.md created
- [ ] DEVELOPMENT.md created
- [ ] .env.example created
- [ ] All PR/Issue templates created

### Code Quality

- [ ] ESLint rules enforced
- [ ] Prettier configured
- [ ] No TypeScript `any` types (except explicit)
- [ ] No `console.log` statements in production code
- [ ] All components properly typed
- [ ] JSDoc comments for all exported functions

### Testing

- [ ] Unit tests for utilities (≥90% coverage)
- [ ] Unit tests for hooks (≥85% coverage)
- [ ] Component tests for UI components (≥80% coverage)
- [ ] Integration tests for key flows (≥75% coverage)
- [ ] MSW mocks for all API endpoints
- [ ] Test scripts in package.json

### Security

- [ ] Environment variables validated
- [ ] No sensitive data in code
- [ ] CSP headers configured
- [ ] Security headers configured
- [ ] Input sanitization implemented
- [ ] Dependencies audited (no high/critical vulnerabilities)

### Performance

- [ ] Image optimization implemented
- [ ] Dynamic imports for heavy components
- [ ] API response caching implemented
- [ ] Bundle size analyzed and optimized
- [ ] Lighthouse score ≥ 90

### Accessibility

- [ ] ARIA labels on all interactive elements
- [ ] Keyboard navigation working
- [ ] Focus management in modals
- [ ] Screen reader tested
- [ ] WCAG 2.1 AA compliant
- [ ] Lighthouse accessibility score ≥ 95

### SEO

- [ ] Meta tags on all pages
- [ ] Structured data implemented
- [ ] Sitemap generated
- [ ] robots.txt configured
- [ ] Lighthouse SEO score ≥ 95

### Deployment & CI/CD

- [ ] GitHub Actions CI configured
- [ ] GitHub Actions release workflow configured
- [ ] Netlify configuration updated
- [ ] Environment-specific configurations
- [ ] Pre-commit hooks configured

### Developer Experience

- [ ] Prettier configured
- [ ] Husky hooks configured
- [ ] Development guide created
- [ ] All scripts documented
- [ ] VS Code settings recommended

---

## 📚 Additional Resources

### Recommended Reading

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OWASP Security Best Practices](https://owasp.org/www-project-top-ten/)

### Tools & Extensions

- VS Code Extensions:
  - ESLint
  - Prettier
  - TypeScript Error Translator
  - GitLens
  - Tailwind CSS IntelliSense
- Browser Extensions:
  - React Developer Tools
  - axe DevTools (Accessibility)
  - Lighthouse

---

**Document Version**: 1.0  
**Last Updated**: October 20, 2025  
**Authors**: Itqan Development Team  
**Status**: Draft - Ready for Review

---

_This refactoring plan is a living document and should be updated as the project evolves._
