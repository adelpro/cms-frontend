# Itqan CMS

<div align="center">

**A Modern, Multilingual Digital Asset Management System**

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 Overview

Itqan CMS is a modern, production-ready content management system built for managing and distributing Islamic digital assets. It features a full multilingual interface with native RTL (Right-to-Left) support, sophisticated access control, and a user-friendly asset discovery experience.

### Built With

- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS 4 with CSS logical properties
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Internationalization:** next-intl

## ✨ Features

### 🌍 Multilingual & Accessibility

- **Native i18n Support:** Arabic (default) and English with seamless language switching
- **RTL/LTR Layouts:** Automatic layout direction based on language
- **CSS Logical Properties:** Future-proof, direction-agnostic styling
- **WCAG Compliant:** Accessible design patterns throughout

### 📚 Asset Management

- **Advanced Search & Filtering:** Category, license, and keyword-based discovery
- **Rich Metadata:** Comprehensive asset information with preview snapshots
- **License Management:** Clear license information and terms display
- **Access Control:** Request-based access for restricted content

### 🔐 Authentication & Security

- **Email/Password Auth:** Secure user registration and login
- **OAuth2 Integration:** Google and GitHub authentication (ready)
- **Profile Management:** Complete user profile with project information
- **Token-based Auth:** JWT access and refresh token flow

### 🎨 Modern UX

- **Dark/Light Modes:** System-aware theme with manual override
- **Responsive Design:** Mobile-first, optimized for all screen sizes
- **Loading States:** Skeleton screens and optimistic UI updates
- **Error Handling:** User-friendly error messages with recovery options

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Itqan-community/cms-frontend.git
   cd cms-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Copy the example environment file
   cp .env.example .env.local

   # Edit .env.local with your configuration
   # Required: NEXT_PUBLIC_BACKEND_URL
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   ```
   http://localhost:3000
   ```

   The app will redirect to `/ar/store` (Arabic store page) by default.

### Environment Variables

| Variable                  | Description     | Required | Default |
| ------------------------- | --------------- | -------- | ------- |
| `NEXT_PUBLIC_BACKEND_URL` | Backend API URL | ✅ Yes   | -       |

See `.env.example` for a complete list of environment variables.

## 📁 Project Structure

```
itqan-cms/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/            # Internationalized routes
│   │   │   ├── auth/            # Authentication pages
│   │   │   ├── store/           # Asset store pages
│   │   │   ├── dashboard/       # User dashboard
│   │   │   └── layout.tsx       # Root layout with i18n
│   │   └── globals.css          # Global styles with theme
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # Base UI components (shadcn/ui)
│   │   ├── auth/                # Authentication components
│   │   ├── store/               # Store/asset components
│   │   └── providers/           # React context providers
│   │
│   ├── lib/                     # Core library code
│   │   ├── api/                 # API client & services
│   │   │   ├── client/          # HTTP client utilities
│   │   │   └── services/        # API service functions
│   │   ├── types/               # TypeScript types
│   │   │   ├── api/             # API contract types
│   │   │   └── models/          # Domain models
│   │   ├── utils/               # Utility functions
│   │   │   ├── conversion.utils.ts
│   │   │   └── validation.utils.ts
│   │   ├── styles/              # Style utilities
│   │   └── auth.ts              # Auth helpers
│   │
│   ├── messages/                # i18n translations
│   │   ├── ar.json             # Arabic translations
│   │   └── en.json             # English translations
│   │
│   ├── i18n.ts                 # i18n configuration
│   └── middleware.ts           # Next.js middleware (routing, security)
│
├── public/                      # Static assets
├── docs/                        # Documentation
└── .temp/                       # Temporary files (gitignored)
```

## 📚 Documentation

- **[Contributing Guide](./CONTRIBUTING.md)** - How to contribute to this project
- **[Development Guidelines](./GUIDELINES.md)** - Coding standards and best practices
- **[API Documentation](./docs/API.md)** - API integration guide
- **[Architecture Overview](./docs/ARCHITECTURE.md)** - System architecture and design decisions

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # Run TypeScript type checking
```

### Code Quality Standards

- **TypeScript:** Strict mode enabled
- **ESLint:** Next.js recommended rules
- **Formatting:** Consistent code style
- **i18n:** All user-facing text must be translated
- **RTL:** All layouts must support RTL/LTR

## 🤝 Contributing

We welcome contributions from the community! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

### Quick Contribution Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following our [guidelines](./GUIDELINES.md)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization for Next.js

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/Itqan-community/cms-frontend/issues)

---

<div align="center">

**Made with ❤️ by the Itqan Team**

[Website](https://cms.itqan.dev) • [Documentation](./docs) • [Report Bug](https://github.com/Itqan-community/cms-frontend/issues)

</div>
