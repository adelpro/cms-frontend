# Contributing to Itqan CMS

First off, thank you for considering contributing to Itqan CMS! It's people like you that make this project great. 🎉

This document provides guidelines for contributing to the project. Following these guidelines helps maintain code quality and makes the contribution process smooth for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

## 🤝 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

### Our Standards

- **Be respectful:** Treat everyone with respect and kindness
- **Be collaborative:** Work together towards common goals
- **Be inclusive:** Welcome and support people of all backgrounds
- **Be professional:** Maintain professional conduct in all interactions

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git** for version control
- A GitHub account
- Basic knowledge of Next.js, React, and TypeScript

### Initial Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR-USERNAME/cms-frontend.git
   cd cms-frontend
   ```

3. **Add upstream remote:**

   ```bash
   git remote add upstream https://github.com/Itqan-community/cms-frontend.git
   ```

4. **Install dependencies:**

   ```bash
   npm install
   ```

5. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

6. **Run the development server:**
   ```bash
   npm run dev
   ```

## 💻 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create and switch to a new branch
git checkout -b feature/your-feature-name
```

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features (e.g., `feature/asset-filtering`)
- `fix/` - Bug fixes (e.g., `fix/login-validation`)
- `docs/` - Documentation changes (e.g., `docs/api-guide`)
- `refactor/` - Code refactoring (e.g., `refactor/auth-service`)
- `test/` - Adding tests (e.g., `test/asset-service`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)

### 2. Make Your Changes

Follow our [Development Guidelines](./GUIDELINES.md) while making changes:

- Write clean, readable code
- Follow TypeScript best practices
- Use existing patterns and conventions
- Add appropriate error handling
- Ensure all text is internationalized

### 3. Test Your Changes

```bash
# Run linter
npm run lint

# Run type checking
npm run type-check

# Build the project
npm run build
```

Ensure all checks pass before committing.

### 4. Commit Your Changes

Follow our commit message conventions:

```bash
git add .
git commit -m "feat: add asset filtering by category"
```

See [Commit Guidelines](#commit-guidelines) below for details.

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

Go to the repository on GitHub and open a Pull Request from your branch.

## 📝 Coding Standards

### General Principles

1. **Type Safety:** Everything must be strictly typed with TypeScript
2. **Internationalization:** All user-facing text must use translations
3. **RTL/LTR Support:** Use CSS logical properties exclusively
4. **Component Library:** Use only shadcn/ui components for UI
5. **Styling:** Use only Tailwind CSS for styling

### File Naming Conventions

```
✅ CORRECT:
- components/asset-store.tsx       (kebab-case for files)
- lib/api/auth.service.ts          (kebab-case for files)
- types/api/auth.types.ts          (kebab-case with .types suffix)

❌ INCORRECT:
- components/AssetStore.tsx        (PascalCase not allowed)
- lib/api/AuthService.ts           (PascalCase not allowed)
```

### Component Naming

```typescript
// ✅ CORRECT - PascalCase for components
export function AssetStore() {}
export default function HomePage() {}

// ❌ INCORRECT
export function assetStore() {} // camelCase not allowed
export function asset_store() {} // snake_case not allowed
```

### Import Organization

```typescript
// ✅ CORRECT - Organized imports
import React from 'react'; // External libraries
import { useRouter } from 'next/navigation'; // Next.js imports
import { Button } from '@/components/ui/button'; // Internal components
import { cn } from '@/lib/utils'; // Internal utilities
import type { Asset } from '@/lib/types'; // Type imports last
```

### Internationalization Requirements

**ALL TEXT MUST BE TRANSLATED - NO EXCEPTIONS**

```typescript
// ❌ NEVER use hardcoded strings
<Button>Download</Button>
<input placeholder="Search..." />
throw new Error("Something went wrong");

// ✅ ALWAYS use translations
import { useTranslations } from 'next-intl';

const t = useTranslations();
<Button>{t('actions.download')}</Button>
<input placeholder={t('ui.searchPlaceholder')} />
throw new Error(t('errors.somethingWentWrong'));
```

### RTL/LTR Support

**USE ONLY CSS LOGICAL PROPERTIES**

```typescript
// ❌ NEVER use physical directional properties
className="ml-4 text-left pl-4"

// ✅ ALWAYS use logical properties
import { logical } from '@/lib/styles/logical';

className={cn(
  logical.marginStart('4'),
  logical.textStart,
  logical.paddingStart('4')
)}
```

### API Integration

```typescript
// ✅ CORRECT - Use centralized API services
import { getAssets, getUserProfile } from '@/lib/api';

const assets = await getAssets(token, { category: ['mushaf'] });
const profile = await getUserProfile(token);

// ❌ INCORRECT - Don't call fetch directly
const response = await fetch('/api/assets');
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** A new feature
- **fix:** A bug fix
- **docs:** Documentation changes
- **style:** Code style changes (formatting, missing semicolons, etc.)
- **refactor:** Code refactoring without changing functionality
- **perf:** Performance improvements
- **test:** Adding or updating tests
- **chore:** Maintenance tasks, dependency updates

### Examples

```bash
# Feature
feat(store): add filtering by license type

# Bug fix
fix(auth): resolve login validation error

# Documentation
docs(api): update authentication examples

# Refactoring
refactor(services): consolidate error handling logic

# With body and footer
feat(assets): implement advanced search

Add full-text search across asset titles and descriptions.
Includes filter combinations and sort options.

Closes #123
```

### Commit Message Rules

- Use imperative mood ("add feature" not "added feature")
- Keep subject line under 72 characters
- Separate subject from body with a blank line
- Use body to explain what and why (not how)
- Reference issues in the footer

## 🔄 Pull Request Process

### Before Submitting

Ensure your PR meets these requirements:

- [ ] Code follows our coding standards
- [ ] All text is translated (no hardcoded strings)
- [ ] CSS uses logical properties
- [ ] TypeScript types are properly defined
- [ ] Linting passes (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Build succeeds (`npm run build`)
- [ ] Code is well-documented
- [ ] Commit messages follow conventions

### PR Description Template

```markdown
## Description

Brief description of what this PR does.

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Changes Made

- Change 1
- Change 2
- Change 3

## Screenshots (if applicable)

Add screenshots showing the changes.

## Checklist

- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] All text is properly translated
- [ ] I have tested in both Arabic and English
- [ ] I have tested in both RTL and LTR modes
```

### Review Process

1. **Automated Checks:** CI/CD will run linting and type checking
2. **Code Review:** Maintainers will review your code
3. **Feedback:** Address any requested changes
4. **Approval:** At least one maintainer approval required
5. **Merge:** Maintainer will merge your PR

### After Merge

- Your branch will be automatically deleted
- Update your local repository:
  ```bash
  git checkout main
  git pull upstream main
  ```

## 🧪 Testing

### Running Tests

```bash
# Run linter
npm run lint

# Run type checking
npm run type-check

# Build verification
npm run build
```

### Manual Testing Checklist

When testing your changes:

- [ ] Test in both Arabic (RTL) and English (LTR)
- [ ] Test in both light and dark themes
- [ ] Test on mobile and desktop viewports
- [ ] Test with keyboard navigation
- [ ] Test all error states
- [ ] Test loading states

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for all exported functions
- Document complex logic with inline comments
- Update relevant documentation files

### JSDoc Example

````typescript
/**
 * Retrieves a paginated list of assets
 *
 * @param token - Optional access token for authenticated requests
 * @param filters - Filter and pagination options
 * @returns Promise resolving to paginated asset list
 *
 * @example
 * ```typescript
 * const assets = await getAssets(token, {
 *   category: ['mushaf'],
 *   page: 1,
 *   page_size: 20,
 * });
 * ```
 */
export async function getAssets(
  token?: string,
  filters?: AssetListFilters
): Promise<PagedListAssetOut> {
  // Implementation
}
````

## ❓ Questions?

- **General Questions:** Use [GitHub Discussions](https://github.com/Itqan-community/cms-frontend/discussions)
- **Bug Reports:** Open an [Issue](https://github.com/Itqan-community/cms-frontend/issues)
- **Feature Requests:** Start a [Discussion](https://github.com/Itqan-community/cms-frontend/discussions)

## 🙏 Thank You!

Your contributions make this project better. We appreciate your time and effort in making Itqan CMS a great tool for the community.

---

**Remember:** Quality over quantity. A small, well-crafted PR is better than a large, messy one.

Happy Contributing! 🚀
