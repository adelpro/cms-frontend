# Testing Guide

**Version**: 1.0  
**Last Updated**: October 20, 2025  
**Project**: Itqan CMS (Next.js 15 + TypeScript + ShadCN)

---

## 📋 Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Framework Setup](#testing-framework-setup)
3. [Writing Tests](#writing-tests)
4. [Running Tests](#running-tests)
5. [Test Coverage](#test-coverage)
6. [Mocking Strategies](#mocking-strategies)
7. [Testing Best Practices](#testing-best-practices)
8. [Debugging Tests](#debugging-tests)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## Testing Philosophy

### Testing Pyramid

```
    /\
   /  \
  / E2E \     ← Few, high-level tests
 /______\
/        \
/Integration\ ← Some, medium-level tests
/____________\
/              \
/   Unit Tests   \ ← Many, low-level tests
/________________\
```

### Testing Strategy

1. **Unit Tests (70%)**: Test individual functions, components, and utilities
2. **Integration Tests (20%)**: Test component interactions and API integration
3. **End-to-End Tests (10%)**: Test complete user workflows

### Testing Principles

- **Fast**: Tests should run quickly
- **Reliable**: Tests should be deterministic
- **Isolated**: Tests should not depend on each other
- **Clear**: Tests should be easy to understand
- **Maintainable**: Tests should be easy to update

---

## Testing Framework Setup

### Dependencies

```bash
# Install testing dependencies
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

### Vitest Configuration

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

### Test Setup

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

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:ci": "vitest run --coverage"
  }
}
```

---

## Writing Tests

### Unit Tests

#### Testing Utility Functions

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

  it('should reject email without domain', () => {
    expect(validators.email('test@', t)).toBeTruthy();
  });
});

describe('Password Validator', () => {
  const t = (key: string) => key;

  it('should validate strong password', () => {
    expect(validators.password('password123', t)).toBeNull();
  });

  it('should reject short password', () => {
    expect(validators.password('123', t)).toBeTruthy();
  });

  it('should reject empty password', () => {
    expect(validators.password('', t)).toBeTruthy();
  });
});

describe('Login Form Validation', () => {
  const t = (key: string) => key;

  it('should validate correct login data', () => {
    const formData = {
      email: 'test@example.com',
      password: 'password123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should reject invalid login data', () => {
    const formData = {
      email: 'invalid-email',
      password: '123',
    };

    const result = validateLoginForm(formData, t);
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
```

#### Testing Custom Hooks

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

  it('should validate form on submit', async () => {
    const mockValidate = vi.fn().mockReturnValue({
      isValid: false,
      errors: [{ field: 'email', message: 'Email is required' }],
    });

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: '', password: '' },
        validate: mockValidate,
        onSubmit: async () => ({ success: true }),
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as any);
    });

    expect(mockValidate).toHaveBeenCalled();
    expect(result.current.errors.email).toBe('Email is required');
  });

  it('should handle successful submission', async () => {
    const mockOnSuccess = vi.fn();
    const mockOnSubmit = vi.fn().mockResolvedValue({ success: true });

    const { result } = renderHook(() =>
      useForm({
        initialData: { email: 'test@example.com', password: 'password123' },
        validate: () => ({ isValid: true, errors: [] }),
        onSubmit: mockOnSubmit,
        onSuccess: mockOnSuccess,
      })
    );

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as any);
    });

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(mockOnSuccess).toHaveBeenCalledWith({ success: true });
  });
});
```

### Component Tests

#### Testing UI Components

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

  it('should show loading state', () => {
    render(<Button loading>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should apply correct variant classes', () => {
    const { rerender } = render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-destructive');

    rerender(<Button variant="outline">Cancel</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-8');

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('h-11');
  });
});
```

#### Testing Form Components

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

  it('should clear errors when user starts typing', async () => {
    const user = userEvent.setup();
    render(<LoginForm locale="en" />);

    // Submit empty form to trigger errors
    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Start typing in email field
    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    // Error should be cleared
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  it('should handle successful login', async () => {
    const mockLogin = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      login: mockLogin,
      user: null,
      isAuthenticated: false
    });

    const user = userEvent.setup();
    render(<LoginForm locale="en" />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Note: This would require mocking the API call
    // In a real test, you'd mock the loginUser function
  });
});
```

### Integration Tests

#### Testing API Integration

```typescript
// src/lib/api/__tests__/assets.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAssets, getAssetDetails } from '../services/assets.service';

// Mock the API client
vi.mock('../client', () => ({
  apiGet: vi.fn(),
}));

import { apiGet } from '../client';

describe('Assets Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch assets with filters', async () => {
    const mockAssets = {
      count: 2,
      results: [
        { id: 1, name: 'Asset 1', category: 'mushaf' },
        { id: 2, name: 'Asset 2', category: 'tafsir' },
      ],
    };

    vi.mocked(apiGet).mockResolvedValue(mockAssets);

    const filters = { category: ['mushaf'], page: 1 };
    const result = await getAssets('token', filters);

    expect(apiGet).toHaveBeenCalledWith('/assets/?category=mushaf&page=1', 'token');
    expect(result).toEqual(mockAssets);
  });

  it('should fetch asset details', async () => {
    const mockAsset = {
      id: 1,
      name: 'Asset 1',
      description: 'Description',
      category: 'mushaf',
    };

    vi.mocked(apiGet).mockResolvedValue(mockAsset);

    const result = await getAssetDetails(1, 'token');

    expect(apiGet).toHaveBeenCalledWith('/assets/1/', 'token');
    expect(result).toEqual(mockAsset);
  });

  it('should handle API errors', async () => {
    vi.mocked(apiGet).mockRejectedValue(new Error('API Error'));

    await expect(getAssets('token')).rejects.toThrow('API Error');
  });
});
```

---

## Running Tests

### Local Development

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:ci

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Commands

```bash
# Run specific test file
npm run test button.test.tsx

# Run tests matching pattern
npm run test -- --grep "Button"

# Run tests in specific directory
npm run test src/components/ui/

# Run tests with verbose output
npm run test -- --reporter=verbose
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/index.html
```

---

## Test Coverage

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80, // 80% line coverage
        functions: 80, // 80% function coverage
        branches: 75, // 75% branch coverage
        statements: 80, // 80% statement coverage
      },
    },
  },
});
```

### Coverage Exclusions

```typescript
// Files to exclude from coverage
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
];
```

### Coverage Goals

- **Utilities**: 90%+ coverage
- **Hooks**: 85%+ coverage
- **Components**: 80%+ coverage
- **Services**: 85%+ coverage
- **Overall**: 80%+ coverage

---

## Mocking Strategies

### API Mocking with MSW

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
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      },
    });
  }),

  http.get(`${API_URL}/auth/profile/`, () => {
    return HttpResponse.json({
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      profile_completed: true,
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

  http.get(`${API_URL}/assets/1/`, () => {
    return HttpResponse.json({
      id: 1,
      name: 'Test Asset 1',
      description: 'Test description',
      long_description: 'Long description',
      category: 'mushaf',
      license: 'CC0',
      thumbnail_url: 'https://example.com/thumb.jpg',
      publisher: {
        id: 1,
        name: 'Publisher 1',
        description: 'Publisher description',
      },
      resource: { id: 1 },
      snapshots: [],
    });
  }),
];
```

### Component Mocking

```typescript
// Mock external components
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}));

// Mock hooks
vi.mock('@/hooks/use-form', () => ({
  useForm: () => ({
    formData: { email: '', password: '' },
    errors: {},
    isLoading: false,
    handleInputChange: vi.fn(),
    handleSubmit: vi.fn()
  })
}));

// Mock context providers
vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn()
  })
}));
```

### Environment Mocking

```typescript
// Mock environment variables
vi.mock('@/lib/env', () => ({
  env: {
    NEXT_PUBLIC_BACKEND_URL: 'https://test-api.example.com',
    NODE_ENV: 'test',
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

---

## Testing Best Practices

### 1. Test Structure (AAA Pattern)

```typescript
describe('Component Name', () => {
  it('should do something', () => {
    // Arrange - Set up test data and mocks
    const mockData = { id: 1, name: 'Test' };
    const mockFn = vi.fn();

    // Act - Execute the function/component
    const result = componentFunction(mockData);

    // Assert - Verify the result
    expect(result).toBe('expected');
    expect(mockFn).toHaveBeenCalledWith(mockData);
  });
});
```

### 2. Descriptive Test Names

```typescript
// Good test names
describe('Button Component', () => {
  it('should render with correct text content');
  it('should call onClick handler when clicked');
  it('should be disabled when disabled prop is true');
  it('should show loading state when loading prop is true');
});

// Bad test names
describe('Button', () => {
  it('works');
  it('test 1');
  it('should work');
});
```

### 3. Test Data Management

```typescript
// Create test data factories
const createMockUser = (overrides = {}) => ({
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  ...overrides
});

const createMockAsset = (overrides = {}) => ({
  id: 1,
  name: 'Test Asset',
  description: 'Test description',
  category: 'mushaf',
  ...overrides
});

// Use in tests
it('should display user name', () => {
  const user = createMockUser({ name: 'John Doe' });
  render(<UserProfile user={user} />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
});
```

### 4. Async Testing

```typescript
// Test async functions
it('should handle async operations', async () => {
  const mockApiCall = vi.fn().mockResolvedValue({ data: 'test' });

  const result = await mockApiCall();

  expect(result).toEqual({ data: 'test' });
  expect(mockApiCall).toHaveBeenCalledOnce();
});

// Test async components
it('should load data on mount', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Data loaded')).toBeInTheDocument();
  });
});
```

### 5. Error Testing

```typescript
// Test error states
it('should handle API errors', async () => {
  const mockApiCall = vi.fn().mockRejectedValue(new Error('API Error'));

  await expect(mockApiCall()).rejects.toThrow('API Error');
});

// Test error boundaries
it('should display error message when component fails', () => {
  const ThrowError = () => {
    throw new Error('Test error');
  };

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );

  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
});
```

---

## Debugging Tests

### Test Debugging Tools

```typescript
// Debug component rendering
import { screen, debug } from '@testing-library/react';

it('should render correctly', () => {
  render(<MyComponent />);
  debug(); // Prints the rendered HTML
});

// Debug specific elements
it('should have correct content', () => {
  render(<MyComponent />);
  debug(screen.getByRole('button')); // Debug specific element
});
```

### Console Logging in Tests

```typescript
// Enable console logging in tests
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
```

### Test Timeout Issues

```typescript
// Increase timeout for slow tests
it('should handle slow operation', async () => {
  // Test implementation
}, 10000); // 10 second timeout
```

---

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
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

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
```

### Pre-commit Hooks

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "vitest related --run"]
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Tests Not Running

**Problem**: Tests not executing  
**Solution**: Check vitest configuration and dependencies

```bash
# Verify vitest installation
npm list vitest

# Check configuration
npx vitest --config vitest.config.ts
```

#### 2. Mock Not Working

**Problem**: Mocks not being applied  
**Solution**: Ensure mocks are defined before imports

```typescript
// Correct order
vi.mock('@/lib/api', () => ({
  getAssets: vi.fn(),
}));

import { getAssets } from '@/lib/api';
```

#### 3. Async Test Failures

**Problem**: Async operations not completing  
**Solution**: Use proper async/await patterns

```typescript
// Correct async testing
it('should handle async operation', async () => {
  const promise = asyncFunction();
  await expect(promise).resolves.toBe('expected');
});
```

#### 4. Component Not Rendering

**Problem**: Components not rendering in tests  
**Solution**: Check for missing providers or context

```typescript
// Wrap component with required providers
render(
  <AuthProvider>
    <ThemeProvider>
      <MyComponent />
    </ThemeProvider>
  </AuthProvider>
);
```

### Performance Issues

#### 1. Slow Tests

**Problem**: Tests running slowly  
**Solution**: Optimize mocks and reduce setup

```typescript
// Use beforeEach for common setup
beforeEach(() => {
  // Common setup
});

// Use afterEach for cleanup
afterEach(() => {
  vi.clearAllMocks();
});
```

#### 2. Memory Leaks

**Problem**: Tests consuming too much memory  
**Solution**: Clean up resources properly

```typescript
// Clean up timers
afterEach(() => {
  vi.clearAllTimers();
});

// Clean up DOM
afterEach(() => {
  cleanup();
});
```

---

## Best Practices Summary

### Do's ✅

- Write tests for all public functions and components
- Use descriptive test names
- Test both success and error cases
- Mock external dependencies
- Keep tests isolated and independent
- Use proper async/await patterns
- Clean up after each test
- Aim for high but realistic coverage

### Don'ts ❌

- Don't test implementation details
- Don't write tests that are too complex
- Don't rely on external services in tests
- Don't ignore failing tests
- Don't write tests that depend on each other
- Don't test third-party libraries
- Don't write tests without assertions
- Don't commit tests that don't pass

---

**Document Version**: 1.0  
**Last Updated**: October 20, 2025  
**Authors**: Itqan Development Team  
**Status**: Draft - Ready for Review

---

_This testing guide is a living document and should be updated as the testing strategy evolves._
