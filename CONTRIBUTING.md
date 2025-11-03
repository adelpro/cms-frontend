# Contributing to CMS Frontend

Thank you for your interest in contributing to the CMS Frontend project! We welcome contributions from the community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/cms-frontend.git`
3. Add the upstream repository: `git remote add upstream https://github.com/Itqan-community/cms-frontend.git`

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn package manager
- Git

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# The application will be available at http://localhost:4200
```

### Environment Configuration

The project uses multiple environments:

- `environment.ts` - Default development environment
- `environment.develop.ts` - Development deployment (develop branch)
- `environment.staging.ts` - Staging deployment (staging branch)
- `environment.prod.ts` - Production deployment (master branch)

## How to Contribute

### Reporting Bugs

- Check if the bug has already been reported in [Issues](https://github.com/Itqan-community/cms-frontend/issues)
- If not, create a new issue with:
  - Clear title and description
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable
  - Environment details (browser, OS, Node version)

### Suggesting Features

- Check existing issues and discussions
- Create a new issue with the "enhancement" label
- Provide detailed description and use cases
- Be open to discussion and feedback

### Code Contributions

1. **Create a branch** from `develop`:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clean, maintainable code
   - Follow the coding standards
   - Add tests if applicable
   - Update documentation

3. **Test your changes**:
   ```bash
   npm run test
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** from your fork to the `develop` branch

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update the README.md or documentation if needed
3. Make sure all tests pass
4. Ensure your branch is up to date with the base branch
5. Fill out the pull request template completely
6. Link any related issues
7. Request review from maintainers
8. Address any feedback or requested changes

### PR Title Format

Follow conventional commits format:
- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `style: format code`
- `refactor: restructure component`
- `test: add unit tests`
- `chore: update dependencies`

## Coding Standards

### Angular Style Guide

Follow the [Angular Style Guide](https://angular.dev/style-guide) for all Angular-specific code.

### TypeScript

- Use TypeScript strict mode
- Define proper types and interfaces
- Avoid using `any` type
- Use meaningful variable and function names

### Component Structure

```typescript
// Component naming: feature-name.component.ts
// Page naming: page-name.page.ts
// Service naming: service-name.service.ts

@Component({
  selector: 'app-component-name',
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.less']
})
export class ComponentNameComponent implements OnInit {
  // Properties
  
  // Constructor
  
  // Lifecycle hooks
  
  // Public methods
  
  // Private methods
}
```

### File Organization

- Follow the existing folder structure
- Group related files together
- Use index files for barrel exports when appropriate

### Styling

- Use LESS for styling
- Follow BEM naming convention for CSS classes
- Keep styles component-scoped
- Use theme variables for colors and spacing

### Code Formatting

- Use Prettier for code formatting
- Run `npm run format` before committing
- Pre-commit hooks will automatically format your code

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(auth): add login functionality

- Implement login form component
- Add authentication service
- Create auth guard for protected routes

Closes #123
```

```
fix(gallery): resolve image loading issue

Images were not loading properly due to incorrect path resolution.
Updated the asset service to handle relative paths correctly.

Fixes #456
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run e2e
```

## Questions or Need Help?

- Open a discussion in [GitHub Discussions](https://github.com/Itqan-community/cms-frontend/discussions)
- Join our community chat
- Email the maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in our README.md and release notes.

Thank you for contributing to CMS Frontend! 🎉

