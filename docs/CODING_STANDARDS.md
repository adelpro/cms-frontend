# Coding Standards

**Version**: 1.0  
**Last Updated**: October 20, 2025  
**Project**: Itqan CMS (Next.js 15 + TypeScript + ShadCN)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Code Style](#code-style)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [React Best Practices](#react-best-practices)
5. [File Organization](#file-organization)
6. [Naming Conventions](#naming-conventions)
7. [Import/Export Guidelines](#importexport-guidelines)
8. [Error Handling](#error-handling)
9. [Testing Standards](#testing-standards)
10. [Documentation Standards](#documentation-standards)
11. [Performance Guidelines](#performance-guidelines)
12. [Accessibility Standards](#accessibility-standards)

---

## Overview

This document outlines the coding standards and best practices for the Itqan CMS project. All contributors must follow these guidelines to maintain code quality, consistency, and readability.

### Tools Used

- **ESLint**: Code linting and quality enforcement
- **Prettier**: Code formatting
- **TypeScript**: Type safety and static analysis
- **Husky**: Git hooks for pre-commit checks
- **lint-staged**: Run linters on staged files

---

## Code Style

### Formatting Rules

All code is automatically formatted using Prettier with the following configuration:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Code Quality Rules

#### General Rules

- ✅ Use `const` and `let` instead of `var`
- ✅ Prefer arrow functions for callbacks
- ✅ Use template literals instead of string concatenation
- ✅ No `console.log` in production code (use `console.warn` or `console.error` if needed)
- ✅ No `debugger` statements in production code
- ✅ No `alert()` calls

#### Example

```typescript
// ✅ Good
const userName = 'john_doe';
const greeting = `Hello, ${userName}!`;
const handleClick = () => console.warn('Button clicked');

// ❌ Bad
var userName = 'john_doe';
const greeting = 'Hello, ' + userName + '!';
const handleClick = () => console.log('Button clicked');
```

---

## TypeScript Guidelines

### Type Safety

#### Strict Type Checking

- ✅ Always use explicit types for function parameters and return values
- ✅ Avoid `any` type (use `unknown` or specific types instead)
- ✅ Use type assertions sparingly and with proper type guards
- ✅ Prefer type imports for type-only imports

#### Example

```typescript
// ✅ Good
import type { User } from '@/types/user';
import { validateUser } from '@/utils/validation';

interface UserFormProps {
  user: User;
  onSubmit: (user: User) => Promise<void>;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
  // Component implementation
};

// ❌ Bad
import { User } from '@/types/user'; // Should be type import
import { validateUser } from '@/utils/validation';

const UserForm = ({ user, onSubmit }: any) => {
  // Avoid any
  // Component implementation
};
```

### Type Definitions

#### Interface vs Type

- ✅ Use `interface` for object shapes that might be extended
- ✅ Use `type` for unions, primitives, and computed types

```typescript
// ✅ Good - Interface for extensible objects
interface BaseUser {
  id: string;
  email: string;
}

interface User extends BaseUser {
  name: string;
  profile: UserProfile;
}

// ✅ Good - Type for unions and computed types
type Status = 'loading' | 'success' | 'error';
type UserKeys = keyof User;
```

### Null Safety

```typescript
// ✅ Good - Use optional chaining and nullish coalescing
const userName = user?.profile?.name ?? 'Anonymous';
const userAge = user?.age ?? 0;

// ✅ Good - Type guards
function isValidUser(user: unknown): user is User {
  return typeof user === 'object' && user !== null && 'id' in user;
}

// ❌ Bad - Unsafe property access
const userName = user.profile.name; // Could throw error
```

---

## React Best Practices

### Component Structure

#### Functional Components

- ✅ Use functional components with hooks
- ✅ Use TypeScript interfaces for props
- ✅ Destructure props in function parameters
- ✅ Use meaningful component names

```typescript
// ✅ Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size,
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
```

### Hooks Guidelines

#### Custom Hooks

- ✅ Prefix custom hooks with `use`
- ✅ Return objects for multiple values
- ✅ Use proper dependency arrays

```typescript
// ✅ Good
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { user, loading, error };
};
```

#### Hook Dependencies

```typescript
// ✅ Good - Proper dependency array
useEffect(() => {
  const fetchData = async () => {
    const data = await api.getData(userId);
    setData(data);
  };

  fetchData();
}, [userId]); // Include all dependencies

// ❌ Bad - Missing dependencies
useEffect(() => {
  const fetchData = async () => {
    const data = await api.getData(userId); // userId not in deps
    setData(data);
  };

  fetchData();
}, []); // Empty dependency array
```

### State Management

#### Local State

- ✅ Use `useState` for simple local state
- ✅ Use `useReducer` for complex state logic
- ✅ Keep state as close to where it's used as possible

#### Global State

- ✅ Use React Context for app-wide state
- ✅ Split contexts by domain (AuthContext, ThemeContext, etc.)
- ✅ Use custom hooks to consume context

```typescript
// ✅ Good - Context with custom hook
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## File Organization

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # Reusable UI components
│   ├── ui/                # Base UI components (ShadCN)
│   ├── auth/              # Authentication components
│   ├── store/             # Store/asset components
│   └── layout/            # Layout components
├── lib/                   # Core library code
│   ├── api/               # API client & services
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── styles/            # Style utilities
├── hooks/                 # Custom React hooks
├── messages/              # i18n translations
└── test/                  # Test utilities and mocks
```

### File Naming

#### Components

- ✅ Use PascalCase for component files: `UserProfile.tsx`
- ✅ Use kebab-case for directories: `user-profile/`
- ✅ Use descriptive names: `LoginForm.tsx` not `Form.tsx`

#### Utilities and Hooks

- ✅ Use camelCase: `formatDate.ts`, `useAuth.ts`
- ✅ Use descriptive names: `validateEmail.ts` not `validate.ts`

#### Types

- ✅ Use camelCase with `.types.ts` suffix: `user.types.ts`
- ✅ Group related types in single files

### File Structure

#### Component Files

```typescript
// 1. Imports (external, internal, types)
import React from 'react';
import { Button } from '@/components/ui/button';
import type { User } from '@/types/user';

// 2. Types and interfaces
interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
}

// 3. Component implementation
export const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // Component logic
  return (
    <div className="user-card">
      {/* JSX */}
    </div>
  );
};

// 4. Default export
export default UserCard;
```

---

## Naming Conventions

### Variables and Functions

- ✅ Use camelCase: `userName`, `getUserData`
- ✅ Use descriptive names: `isLoading` not `loading`
- ✅ Use boolean prefixes: `is`, `has`, `can`, `should`

```typescript
// ✅ Good
const isUserAuthenticated = true;
const hasPermission = checkPermission(user);
const canEditPost = user.role === 'admin';
const shouldShowModal = isOpen && !isLoading;

// ❌ Bad
const loading = true;
const permission = checkPermission(user);
const edit = user.role === 'admin';
const modal = isOpen && !isLoading;
```

### Constants

- ✅ Use SCREAMING_SNAKE_CASE: `API_BASE_URL`, `MAX_RETRY_ATTEMPTS`
- ✅ Group related constants in objects

```typescript
// ✅ Good
const API_ENDPOINTS = {
  USERS: '/api/users',
  AUTH: '/api/auth',
  ASSETS: '/api/assets',
} as const;

const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
} as const;
```

### CSS Classes

- ✅ Use kebab-case: `user-profile`, `btn-primary`
- ✅ Use BEM methodology for complex components: `card__header`, `card__content`

```typescript
// ✅ Good
<div className="user-profile">
  <div className="user-profile__header">
    <h2 className="user-profile__title">John Doe</h2>
  </div>
  <div className="user-profile__content">
    <p className="user-profile__email">john@example.com</p>
  </div>
</div>
```

---

## Import/Export Guidelines

### Import Order

1. React and React-related imports
2. Third-party libraries
3. Internal modules (components, utils, types)
4. Relative imports

```typescript
// ✅ Good - Proper import order
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/utils/validation';
import type { User } from '@/types/user';
import './UserForm.css';
```

### Import Types

- ✅ Use `import type` for type-only imports
- ✅ Use `import` for runtime imports

```typescript
// ✅ Good
import React from 'react';
import type { User } from '@/types/user';
import { validateUser } from '@/utils/validation';

// ❌ Bad
import React from 'react';
import { User } from '@/types/user'; // Should be type import
import { validateUser } from '@/utils/validation';
```

### Export Patterns

- ✅ Use named exports for utilities and hooks
- ✅ Use default exports for components
- ✅ Re-export from index files for clean imports

```typescript
// ✅ Good - Named exports for utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ✅ Good - Default export for components
const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return <div>{user.name}</div>;
};

export default UserProfile;
```

---

## Error Handling

### Error Boundaries

- ✅ Use error boundaries for component error handling
- ✅ Provide fallback UI for errors
- ✅ Log errors for debugging

```typescript
// ✅ Good - Error boundary usage
<ErrorBoundary fallback={<ErrorFallback />}>
  <UserProfile user={user} />
</ErrorBoundary>
```

### API Error Handling

- ✅ Use try-catch for async operations
- ✅ Provide meaningful error messages
- ✅ Handle different error types appropriately

```typescript
// ✅ Good - Proper error handling
const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw new Error('An unexpected error occurred');
  }
};
```

### Form Validation

- ✅ Validate on both client and server
- ✅ Show validation errors immediately
- ✅ Use consistent error message format

```typescript
// ✅ Good - Form validation
const validateForm = (data: FormData): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!data.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

---

## Testing Standards

### Test Structure

- ✅ Use AAA pattern (Arrange, Act, Assert)
- ✅ Use descriptive test names
- ✅ Test both success and error cases
- ✅ Mock external dependencies

```typescript
// ✅ Good - Test structure
describe('UserService', () => {
  it('should fetch user by ID successfully', async () => {
    // Arrange
    const userId = '123';
    const mockUser = { id: userId, name: 'John Doe' };
    jest.spyOn(api, 'get').mockResolvedValue({ data: mockUser });

    // Act
    const result = await userService.getUser(userId);

    // Assert
    expect(result).toEqual(mockUser);
    expect(api.get).toHaveBeenCalledWith(`/users/${userId}`);
  });
});
```

### Component Testing

- ✅ Test user interactions
- ✅ Test accessibility
- ✅ Test different props combinations

```typescript
// ✅ Good - Component testing
describe('Button Component', () => {
  it('should call onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be accessible', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

---

## Documentation Standards

### JSDoc Comments

- ✅ Document public APIs with JSDoc
- ✅ Include parameter and return type descriptions
- ✅ Provide usage examples

````typescript
/**
 * Validates an email address format
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 * @example
 * ```typescript
 * const isValid = validateEmail('user@example.com');
 * console.log(isValid); // true
 * ```
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
````

### README Files

- ✅ Include setup instructions
- ✅ Document API usage
- ✅ Provide examples
- ✅ List dependencies

### Code Comments

- ✅ Explain "why" not "what"
- ✅ Use comments for complex business logic
- ✅ Keep comments up to date

```typescript
// ✅ Good - Explains why
// We need to debounce the search to avoid excessive API calls
const debouncedSearch = useMemo(() => debounce(handleSearch, 300), [handleSearch]);

// ❌ Bad - Explains what (obvious from code)
// Set the user state to the new user
setUser(newUser);
```

---

## Performance Guidelines

### React Performance

- ✅ Use `React.memo` for expensive components
- ✅ Use `useMemo` and `useCallback` appropriately
- ✅ Avoid creating objects in render

```typescript
// ✅ Good - Memoized component
const ExpensiveComponent = React.memo<Props>(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return data.map(item => processItem(item));
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* Component JSX */}</div>;
});
```

### Bundle Optimization

- ✅ Use dynamic imports for code splitting
- ✅ Import only what you need
- ✅ Use tree shaking friendly imports

```typescript
// ✅ Good - Dynamic import
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Good - Tree shaking friendly
import { debounce } from 'lodash/debounce';

// ❌ Bad - Imports entire library
import _ from 'lodash';
```

---

## Accessibility Standards

### Semantic HTML

- ✅ Use proper HTML elements
- ✅ Use heading hierarchy (h1, h2, h3...)
- ✅ Use landmarks (main, nav, aside)

```typescript
// ✅ Good - Semantic HTML
<main>
  <header>
    <h1>User Profile</h1>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </nav>
  </header>
</main>
```

### ARIA Attributes

- ✅ Use ARIA labels for screen readers
- ✅ Use ARIA roles when needed
- ✅ Ensure keyboard navigation

```typescript
// ✅ Good - ARIA attributes
<button
  aria-label="Close dialog"
  aria-expanded={isOpen}
  onClick={handleClose}
>
  <CloseIcon aria-hidden="true" />
</button>
```

### Focus Management

- ✅ Ensure all interactive elements are focusable
- ✅ Use visible focus indicators
- ✅ Manage focus in modals and dialogs

---

## Commit Message Standards

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert previous commit

### Examples

```
feat(auth): add OAuth2 login support
fix(ui): resolve button alignment issue
docs(api): update authentication endpoints
refactor(utils): extract validation functions
test(auth): add login form tests
```

---

## Code Review Guidelines

### What to Look For

- ✅ Code follows style guidelines
- ✅ Proper error handling
- ✅ Adequate test coverage
- ✅ Performance considerations
- ✅ Accessibility compliance
- ✅ Security implications

### Review Process

1. Check code style and formatting
2. Verify functionality works as expected
3. Ensure tests are comprehensive
4. Review for potential bugs
5. Check performance implications
6. Verify accessibility compliance

---

## Tools and Automation

### Pre-commit Hooks

- ✅ ESLint checks
- ✅ Prettier formatting
- ✅ TypeScript type checking
- ✅ Test execution

### CI/CD Pipeline

- ✅ Automated testing
- ✅ Code quality checks
- ✅ Build verification
- ✅ Deployment automation

---

## Enforcement

### Automated Checks

- ESLint enforces code quality rules
- Prettier ensures consistent formatting
- TypeScript provides type safety
- Husky runs pre-commit hooks
- CI/CD pipeline validates all changes

### Manual Reviews

- All code changes require review
- Reviewers check compliance with standards
- Documentation updates are required for API changes

---

## Getting Help

### Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

### Questions

- Ask questions in team chat
- Create GitHub issues for clarifications
- Request code reviews for guidance

---

**Remember**: These standards are living documents. They should evolve with the project and team needs. When in doubt, prioritize code clarity and maintainability.

---

**Document Version**: 1.0  
**Last Updated**: October 20, 2025  
**Authors**: Itqan Development Team  
**Status**: Active - Enforced

---

_This document is enforced through automated tools and code reviews. All contributors must follow these standards._
