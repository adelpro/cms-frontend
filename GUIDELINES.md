# Itqan CMS - Development Guidelines

## 📋 Overview

This document establishes the development standards, best practices, and guidelines for maintaining the Itqan CMS codebase. All developers and AI agents **MUST** follow these guidelines to ensure consistency, quality, and protection of core features.

## 🎯 Core Principles

### 1. **Quality Standards**
- **Type Safety First**: Everything must be strictly typed with TypeScript
- **SSR Compliance**: Maintain server-side rendering excellence
- **Performance Focus**: Optimize for speed and minimal bundle size
- **Security Priority**: Implement security best practices
- **Accessibility**: Ensure WCAG compliance

### 2. **UI/UX Standards**
- **shadcn/ui Only**: Use ONLY shadcn/ui components for UI implementation
- **Tailwind CSS**: All styling must use Tailwind CSS classes
- **Design System**: Maintain consistency with established design tokens
- **Responsive Design**: Responsive design with proper breakpoint consistency

### 3. **Localization Standards**
- **Multilingual First**: ALL text content MUST be localized from day one
- **No Single-Language Text**: NEVER use hardcoded strings in any language
- **Translation-Driven Development**: Add translations before implementing UI
- **Cultural Adaptation**: Consider RTL/LTR and cultural differences

### 4. **Consistency Rules**
- **Uniform Naming**: Follow established naming conventions
- **Structured Organization**: Maintain clean file/folder hierarchy
- **Code Style**: Use consistent formatting and patterns
- **Documentation**: Document all public APIs and complex logic

## 🏗️ Architecture Guidelines

### **Directory Structure - STRICTLY ENFORCED**

```
src/
├── app/                          # Next.js App Router (CORE - DO NOT MODIFY STRUCTURE)
│   ├── [locale]/                 # Dynamic locale routing (PROTECTED)
│   │   ├── layout.tsx            # Root layout (CRITICAL - SSR)
│   │   ├── page.tsx              # Homepage (CRITICAL - SSR)
│   │   ├── loading.tsx           # Loading UI
│   │   ├── error.tsx             # Error boundary
│   │   └── not-found.tsx         # 404 page
│   ├── globals.css               # Global styles (CRITICAL - RTL/LTR)
│   └── favicon.ico
├── components/                   # React components
│   ├── ui/                       # Atomic UI components (shadcn/ui)
│   ├── providers/                # React context providers (PROTECTED)
│   │   ├── locale-provider.tsx   # I18n context (CRITICAL)
│   │   └── theme-provider.tsx    # Theme context (CRITICAL)
│   ├── [feature-name]/           # Feature-specific components
│   └── *.tsx                     # Shared components
├── lib/                          # Utility libraries
│   ├── i18n/                     # Internationalization (PROTECTED)
│   │   ├── types.ts              # I18n type definitions (CRITICAL)
│   │   ├── utils.ts              # Locale utilities (CRITICAL)
│   │   └── dictionaries.ts       # Translation loading (CRITICAL)
│   ├── styles/                   # Style utilities
│   │   └── logical.ts            # CSS logical properties (CRITICAL)
│   ├── utils.ts                  # General utilities
│   └── env.ts                    # Environment configuration (PROTECTED)
├── dictionaries/                 # Translation files (PROTECTED)
│   ├── ar.json                   # Arabic translations (CRITICAL)
│   └── en.json                   # English translations (CRITICAL)

└── middleware.ts                 # Next.js middleware (CRITICAL - ROUTING)
```

### **Protected/Critical Files - REQUIRE SPECIAL CARE**

#### 🔒 **CRITICAL FILES (Extreme caution required)**
- `src/middleware.ts` - Routing and security
- `src/app/[locale]/layout.tsx` - SSR root layout
- `src/lib/i18n/types.ts` - Type definitions
- `src/lib/i18n/utils.ts` - Core i18n logic
- `src/app/globals.css` - RTL/LTR styles
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

#### 🛡️ **PROTECTED DIRECTORIES (Review required)**
- `src/lib/i18n/` - Internationalization system
- `src/components/providers/` - React contexts
- `src/dictionaries/` - Translation files
- `src/lib/styles/` - Styling system

## 📝 Naming Conventions

### **Files and Directories**
```typescript
// ✅ CORRECT
components/language-switcher.tsx    // kebab-case for files
lib/i18n/utils.ts                  // kebab-case for files
// ❌ INCORRECT
components/LanguageSwitcher.tsx     // PascalCase not allowed
lib/i18n/Utils.ts                  // PascalCase not allowed
```

### **React Components**
```typescript
// ✅ CORRECT - PascalCase for component names
export function LanguageSwitcher() {}
export function ThemeProvider() {}
export default function HomePage() {}

// ❌ INCORRECT
export function languageSwitcher() {}  // camelCase not allowed
export function theme_provider() {}    // snake_case not allowed
```

### **Variables and Functions**
```typescript
// ✅ CORRECT - camelCase
const currentLocale = 'ar';
const isValidLocale = (locale: string) => {};
const getDictionary = async () => {};

// ❌ INCORRECT
const current_locale = 'ar';           // snake_case not allowed
const IsValidLocale = () => {};        // PascalCase not allowed
```

### **Types and Interfaces**
```typescript
// ✅ CORRECT - PascalCase
type Locale = 'ar' | 'en';
interface HomePageProps {}
interface LocaleContextType {}

// ❌ INCORRECT
type locale = 'ar' | 'en';             // camelCase not allowed
interface homePageProps {}             // camelCase not allowed
```

### **Constants**
```typescript
// ✅ CORRECT - SCREAMING_SNAKE_CASE for global constants
const DEFAULT_LOCALE = 'ar';
const SUPPORTED_LOCALES = ['ar', 'en'];

// ✅ CORRECT - camelCase for local constants
const defaultLocale = 'ar';
const locales = ['ar', 'en'] as const;
```

## 🌍 Internationalization Guidelines

### **CRITICAL RULES - NEVER VIOLATE**

#### 1. **Locale Type Safety**
```typescript
// ✅ ALWAYS use the Locale type
import type { Locale } from '@/lib/i18n/types';

// ✅ ALWAYS validate before casting
if (!isValidLocale(locale)) {
  notFound();
}
const validatedLocale = locale as Locale;

// ❌ NEVER use string directly
const locale: string = 'ar'; // Wrong!
```

#### 2. **Translation Loading**
```typescript
// ✅ CORRECT - Server components
const dict = await getDictionary(locale);

// ✅ CORRECT - Client components
const { t, dict } = useTranslation();

// ❌ NEVER import translations directly
import ar from '@/dictionaries/ar.json'; // Wrong!
```

#### 3. **RTL/LTR Handling**
```typescript
// ✅ ALWAYS use logical properties
import { logical, direction } from '@/lib/styles/logical';

// ✅ CORRECT usage
className={cn(logical.paddingStart('4'), logical.textStart)}
const isRTL = direction.isRTL(locale);

// ❌ NEVER use hardcoded directional classes
className="pl-4 text-left" // Wrong! Not RTL-aware
```

#### 4. **URL Structure**
```typescript
// ✅ CORRECT pattern
/ar/            // Arabic homepage
/en/            // English homepage
/ar/about       // Arabic about page
/en/about       // English about page

// ❌ WRONG patterns
/about?lang=ar  // Query parameters not allowed
/ar-SA/         // Region codes not supported
```

### **Translation Management**

#### **🚨 MANDATORY LOCALIZATION RULE**
**ALL TEXT CONTENT MUST BE LOCALIZED - NO HARDCODED STRINGS ALLOWED**

- ✅ **ALL user-facing text** must use dictionary translations
- ✅ **ALL placeholders** must use dictionary translations  
- ✅ **ALL error messages** must use dictionary translations
- ✅ **ALL accessibility labels** must use dictionary translations
- ✅ **ALL button labels** must use dictionary translations
- ✅ **ALL form labels** must use dictionary translations

#### ❌ **FORBIDDEN PRACTICES**
```typescript
// ❌ NEVER use hardcoded strings
<Button>Download</Button>                    // Wrong!
<input placeholder="Search..." />            // Wrong!
<span>Loading...</span>                      // Wrong!
throw new Error("Invalid input");           // Wrong!
aria-label="Close dialog"                   // Wrong!

// ✅ ALWAYS use translations
<Button>{dict.actions.download}</Button>     // Correct!
<input placeholder={dict.ui.searchPlaceholder} />  // Correct!
<span>{dict.ui.loading}</span>              // Correct!
throw new Error(dict.errors.invalidInput); // Correct!
aria-label={dict.ui.closeDialog}           // Correct!
```

#### Adding New Translations
```json
// 1. Add to src/dictionaries/ar.json
{
  "newKey": "النص العربي"
}

// 2. Add to src/dictionaries/en.json  
{
  "newKey": "English text"
}

// 3. Update type in src/lib/i18n/types.ts
export type Dictionary = {
  // ... existing keys
  newKey: string;
};
```

#### Using Translations
```typescript
// ✅ Server components
export default async function MyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);
  
  return <h1>{dict.newKey}</h1>;
}

// ✅ Client components
"use client";
export function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('newKey')}</h1>;
}
```

### **🔄 Translation-Driven Development Workflow**

**CRITICAL: Translations MUST be added BEFORE implementing UI components**

#### **Step 1: Plan Text Content**
```typescript
// ✅ CORRECT - Plan all text content first
/*
Required translations for UserProfile component:
- profile.title: "User Profile" / "الملف الشخصي"
- profile.editButton: "Edit Profile" / "تحرير الملف"
- profile.avatarAlt: "User avatar" / "صورة المستخدم"
- profile.avatarFallback: "U" / "م"
- profile.saveButton: "Save Changes" / "حفظ التغييرات"
- profile.cancelButton: "Cancel" / "إلغاء"
*/
```

#### **Step 2: Add Translations to Dictionaries**
```json
// src/dictionaries/ar.json
{
  "profile": {
    "title": "الملف الشخصي",
    "editButton": "تحرير الملف",
    "avatarAlt": "صورة المستخدم",
    "avatarFallback": "م",
    "saveButton": "حفظ التغييرات",
    "cancelButton": "إلغاء"
  }
}

// src/dictionaries/en.json
{
  "profile": {
    "title": "User Profile",
    "editButton": "Edit Profile", 
    "avatarAlt": "User avatar",
    "avatarFallback": "U",
    "saveButton": "Save Changes",
    "cancelButton": "Cancel"
  }
}
```

#### **Step 3: Update Type Definitions**
```typescript
// src/lib/i18n/types.ts
export type Dictionary = {
  // ... existing keys
  profile: {
    title: string;
    editButton: string;
    avatarAlt: string;
    avatarFallback: string;
    saveButton: string;
    cancelButton: string;
  };
};
```

#### **Step 4: Implement UI with Translations**
```typescript
// ✅ CORRECT - UI implementation after translations are ready
"use client";
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import { logical } from '@/lib/styles/logical';

export function UserProfile() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <h2 className={cn(logical.textStart)}>{t('profile.title')}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={cn(logical.spaceBetween, "items-center")}>
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt={t('profile.avatarAlt')} />
            <AvatarFallback>{t('profile.avatarFallback')}</AvatarFallback>
          </Avatar>
          <div className="space-x-2">
            <Button variant="outline">
              {t('profile.cancelButton')}
            </Button>
            <Button>
              {t('profile.saveButton')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ❌ FORBIDDEN - Implementing UI before translations
export function UserProfile() {
  return (
    <Card>
      <CardHeader>
        <h2>User Profile</h2>  {/* Wrong! Hardcoded text */}
      </CardHeader>
      <CardContent>
        <Button>Edit Profile</Button>  {/* Wrong! Hardcoded text */}
      </CardContent>
    </Card>
  );
}
```

#### **Translation Workflow Checklist**
- [ ] **Plan**: List all text content needed
- [ ] **Translate**: Add to both `ar.json` and `en.json`
- [ ] **Type**: Update type definitions
- [ ] **Implement**: Build UI with translations
- [ ] **Test**: Verify in both languages
- [ ] **Review**: Check RTL/LTR compatibility

## 🎨 UI Implementation Guidelines

### **🚨 MANDATORY: shadcn/ui Components Only**

**ALL UI components MUST be implemented using shadcn/ui. No custom UI components without explicit approval.**

#### **✅ REQUIRED shadcn/ui Usage**
```typescript
// ✅ CORRECT - Use shadcn/ui components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// ✅ CORRECT - Component implementation
export function UserProfile() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <h2>{t('profile.title')}</h2>
      </CardHeader>
      <CardContent>
        <div className={cn(logical.spaceBetween, "gap-4")}>
          <Avatar>
            <AvatarImage src="/avatar.jpg" alt={t('profile.avatarAlt')} />
            <AvatarFallback>{t('profile.avatarFallback')}</AvatarFallback>
          </Avatar>
          <Button variant="outline">
            {t('profile.editButton')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ❌ FORBIDDEN - Custom UI components
const CustomButton = styled.button`...`;  // Wrong!
const MyCard = ({ children }) => <div className="custom-card">...</div>; // Wrong!
```

#### **Adding New shadcn/ui Components**
```bash
# ✅ CORRECT - Add components via shadcn CLI
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add form

# ✅ CORRECT - Multiple components at once
npx shadcn@latest add button input label card
```

#### **Component Customization Rules**
```typescript
// ✅ CORRECT - Extend shadcn/ui components with Tailwind
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CustomButton({ className, ...props }) {
  return (
    <Button 
      className={cn(
        "custom-additional-styles",
        logical.paddingX('6'),
        className
      )}
      {...props}
    />
  );
}

// ❌ FORBIDDEN - Completely custom components
export function CustomButton() {
  return <div className="my-custom-button">...</div>; // Wrong!
}
```

### **🎨 Tailwind CSS - Exclusive Styling Solution**

**ALL styling MUST use Tailwind CSS. No CSS modules, styled-components, or custom CSS allowed.**

#### **✅ MANDATORY Tailwind Patterns**
```typescript
// ✅ CORRECT - Tailwind with logical properties
import { logical, layoutPatterns, spacing } from '@/lib/styles/logical';

className={cn(
  "bg-background border border-border rounded-lg",
  logical.paddingX('4'),
  logical.paddingY('6'),
  logical.marginStart('2'),
  layoutPatterns.spaceBetween,
  spacing.gapMd
)}

// ✅ CORRECT - Responsive design
className={cn(
  "flex flex-col",
  "sm:flex-row sm:items-center",
  "md:gap-6",
  "lg:px-8"
)}

// ✅ CORRECT - Theme-aware styling
className={cn(
  "bg-background text-foreground",
  "dark:bg-secondary dark:text-secondary-foreground",
  "border-border hover:border-accent"
)}
```

#### **❌ FORBIDDEN Styling Approaches**
```typescript
// ❌ NEVER use inline styles
<div style={{ padding: '16px', color: 'red' }}>...</div>

// ❌ NEVER use CSS modules
import styles from './component.module.css';
<div className={styles.container}>...</div>

// ❌ NEVER use styled-components
const StyledDiv = styled.div`
  padding: 16px;
  color: red;
`;

// ❌ NEVER use custom CSS classes without Tailwind
<div className="my-custom-class">...</div>
```

### **CSS Logical Properties - MANDATORY**

#### Always Use Logical Properties
```css
/* ✅ CORRECT - Logical properties */
.element {
  padding-inline-start: 1rem;    /* ps-4 */
  padding-inline-end: 1rem;      /* pe-4 */
  margin-inline-start: auto;     /* ms-auto */
  text-align: start;             /* text-start */
}

/* ❌ WRONG - Physical properties */
.element {
  padding-left: 1rem;            /* Not RTL-aware */
  padding-right: 1rem;           /* Not RTL-aware */
  margin-left: auto;             /* Not RTL-aware */
  text-align: left;              /* Not RTL-aware */
}
```

#### Tailwind Class Usage
```typescript
// ✅ CORRECT - Use logical utilities
import { logical, layoutPatterns, spacing } from '@/lib/styles/logical';

className={cn(
  logical.paddingStart('4'),     // ps-4
  logical.textStart,             // text-start
  layoutPatterns.spaceBetween,   // flex justify-between items-center
  spacing.gapMd                  // gap-4
)}

// ❌ WRONG - Physical directional classes
className="pl-4 text-left ml-auto" // Not RTL-aware
```

### **Component Styling Patterns**
```typescript
// ✅ CORRECT - Use cn() utility for class merging
import { cn } from '@/lib/utils';

className={cn(
  "base-classes",
  conditionalClass && "conditional-classes",
  props.className
)}

// ❌ WRONG - String concatenation
className={"base-classes " + (conditionalClass ? "conditional-classes" : "")}
```

## 🔒 Theme System Guidelines

### **Theme Provider Usage**
```typescript
// ✅ CORRECT - Use the enhanced provider
import { ThemeProvider } from '@/components/providers/theme-provider';

<ThemeProvider>
  {children}
</ThemeProvider>

// ❌ WRONG - Don't import next-themes directly in app code
import { ThemeProvider } from 'next-themes'; // Wrong!
```

### **Theme-Aware Components**
```typescript
// ✅ CORRECT - Client component with theme
"use client";
import { useTheme } from 'next-themes';

export function ThemeAwareComponent() {
  const { theme, setTheme } = useTheme();
  // Component logic
}
```

## ⚙️ Configuration Guidelines

### **Environment Variables**
```typescript
// ✅ ALWAYS use the env utility
import { env, isDevelopment } from '@/lib/env';

const backendUrl = env.NEXT_PUBLIC_BACKEND_URL;
if (isDevelopment) {
  console.log('Development mode');
}

// ❌ NEVER access process.env directly in components
const url = process.env.NEXT_PUBLIC_BACKEND_URL; // Wrong!
```

### **Next.js Configuration**
```typescript
// ✅ CRITICAL - next.config.ts structure
const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'], // Package optimization
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ar',     // CRITICAL - Default to Arabic
        permanent: false,
      },
    ];
  },
};
```



## 📦 Dependency Management

### **Package Installation Rules**
```bash
# ✅ CORRECT - Always specify exact versions for critical deps
npm install next@15.5.0
npm install react@19.1.0
npm install typescript@^5

# ✅ CORRECT - Group related dependencies
npm install @radix-ui/react-slot class-variance-authority clsx

# ❌ WRONG - Don't install without version specification for core deps
npm install next  # Could break compatibility
```

### **Import Guidelines**
```typescript
// ✅ CORRECT - Import order
import React from 'react';                    // External libraries
import { NextRequest } from 'next/server';    // Next.js imports
import { Button } from '@/components/ui/button'; // Internal components
import { cn } from '@/lib/utils';             // Internal utilities
import type { Locale } from '@/lib/i18n/types'; // Type imports last

// ✅ CORRECT - Group imports
import { 
  logical, 
  layoutPatterns, 
  spacing 
} from '@/lib/styles/logical';

// ❌ WRONG - Scattered imports
import { logical } from '@/lib/styles/logical';
import React from 'react';
import { spacing } from '@/lib/styles/logical';
```

## 🚨 Critical Security Rules

### **Middleware Security**
```typescript
// ✅ CRITICAL - Always include security headers
const response = NextResponse.next();
response.headers.set('X-Content-Type-Options', 'nosniff');
response.headers.set('X-Frame-Options', 'DENY');
response.headers.set('X-XSS-Protection', '1; mode=block');
```

### **Input Validation**
```typescript
// ✅ ALWAYS validate user inputs
function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// ✅ ALWAYS validate before using
if (!isValidLocale(userInput)) {
  throw new Error('Invalid locale');
}
```

## 🔄 Code Review Checklist

### **Before Submitting Changes**

#### ✅ **Type Safety**
- [ ] All variables are properly typed
- [ ] No `any` types used
- [ ] Proper type guards implemented
- [ ] Interface definitions updated

#### ✅ **UI Implementation**
- [ ] Uses ONLY shadcn/ui components
- [ ] No custom UI components created
- [ ] All styling uses Tailwind CSS classes
- [ ] No inline styles or CSS modules
- [ ] Proper responsive design implemented
- [ ] Theme-aware styling applied

#### ✅ **Internationalization**
- [ ] Uses Locale type correctly
- [ ] **NO HARDCODED STRINGS ANYWHERE** (use translations)
- [ ] ALL text uses dict.* pattern
- [ ] ALL placeholders use dict.* pattern
- [ ] ALL accessibility labels use dict.* pattern
- [ ] ALL button text uses dict.* pattern
- [ ] ALL error messages use dict.* pattern
- [ ] ALL tooltips use dict.* pattern
- [ ] Translations added BEFORE UI implementation
- [ ] RTL/LTR compatibility maintained
- [ ] Logical properties used for styling

#### ✅ **Performance**
- [ ] Server components preferred over client components
- [ ] Proper code splitting maintained
- [ ] No unnecessary re-renders
- [ ] Bundle size impact considered

#### ✅ **Architecture**
- [ ] File placed in correct directory
- [ ] Naming conventions followed
- [ ] No circular dependencies
- [ ] Proper error handling



#### ✅ **Build & Lint**
- [ ] `npm run build` succeeds
- [ ] `npm run lint` passes
- [ ] `npm run type-check` passes
- [ ] No console errors/warnings

## 🚫 Forbidden Practices

### **NEVER DO THESE**

```typescript
// ❌ NEVER modify core i18n types without approval
export type Locale = 'ar' | 'en' | 'fr'; // Requires architecture review

// ❌ NEVER bypass locale validation
const locale = pathname.split('/')[1] as Locale; // Wrong! Use validation

// ❌ NEVER use physical CSS properties in new code
className="ml-4 text-left" // Use logical properties instead

// ❌ NEVER import translations directly
import ar from '@/dictionaries/ar.json'; // Use getDictionary() instead

// ❌ NEVER use hardcoded strings - ALL TEXT MUST BE LOCALIZED
const buttonText = "Download";              // Wrong!
placeholder="Search..."                    // Wrong!
<span>Loading...</span>                     // Wrong!
throw new Error("Something went wrong");   // Wrong!
title="Click here"                         // Wrong!
aria-label="Close button"                 // Wrong!

// ❌ NEVER use custom UI components
<div className="custom-button">Click me</div>  // Wrong!
const MyButton = () => <button>...</button>;  // Wrong!

// ❌ NEVER use non-Tailwind styling
<div style={{ color: 'red' }}>...</div>       // Wrong!
import styles from './component.module.css';  // Wrong!

// ❌ NEVER modify middleware without extreme caution
// This file controls routing and security - requires careful review

// ❌ NEVER add client-side code to server components
"use client"; // Only when absolutely necessary

// ❌ NEVER use hardcoded theme values
const isDark = document.body.classList.contains('dark'); // Use useTheme()

// ❌ NEVER modify tsconfig.json paths without understanding impact
"paths": { "@/*": ["./different/path/*"] } // Could break everything
```

## 🔧 Development Workflow

### **Adding New Features**
1. **Plan**: Review architecture impact
2. **Design**: Follow established patterns
3. **Implement**: Use guidelines and conventions
4. **Review**: Self-check against guidelines
5. **Document**: Update relevant documentation

### **Modifying Existing Features**
1. **Understand**: Read existing code thoroughly
2. **Preserve**: Maintain backward compatibility
3. **Enhance**: Follow improvement patterns
4. **Validate**: Verify all affected areas work correctly
5. **Document**: Update changed behavior

### **Emergency Fixes**
1. **Assess**: Understand the urgency
2. **Isolate**: Minimize change scope
3. **Validate**: Verify fix doesn't break core features
4. **Document**: Explain the emergency change
5. **Follow-up**: Plan proper solution if needed

## 📚 Reference Quick Guide

### **Import Statements**
```typescript
// Type imports
import type { Locale } from '@/lib/i18n/types';

// I18n utilities
import { isValidLocale, direction } from '@/lib/i18n/utils';
import { getDictionary } from '@/lib/i18n/dictionaries';

// Styling utilities  
import { logical, layoutPatterns } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

// shadcn/ui Components (MANDATORY)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

// Providers
import { ThemeProvider } from '@/components/providers/theme-provider';
```

### **Common Patterns**
```typescript
// Page component pattern with shadcn/ui
export default async function MyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const validatedLocale = locale as Locale;
  const dict = await getDictionary(validatedLocale);
  
  return (
    <Card>
      <CardHeader>
        <h1 className={cn(logical.textStart)}>{dict.title}</h1>
      </CardHeader>
      <CardContent>
        <Button>{dict.actions.continue}</Button>
      </CardContent>
    </Card>
  );
}

// Client component pattern with shadcn/ui
"use client";
export function MyClientComponent() {
  const { t, locale, isRTL } = useTranslation();
  
  return (
    <div className={cn(logical.textStart)}>
      <Badge variant="secondary">{t('status.active')}</Badge>
      <Input 
        placeholder={t('form.searchPlaceholder')}
        className={cn(logical.marginStart('2'))}
      />
      <Button variant="outline" size="sm">
        {t('actions.search')}
      </Button>
    </div>
  );
}

// Form component pattern with shadcn/ui
"use client";
export function ContactForm() {
  const { t } = useTranslation();
  
  return (
    <Card>
      <CardHeader>
        <h2>{t('contact.title')}</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">{t('form.emailLabel')}</Label>
          <Input 
            id="email"
            type="email"
            placeholder={t('form.emailPlaceholder')}
          />
        </div>
        <Button type="submit" className="w-full">
          {t('form.submitButton')}
        </Button>
      </CardContent>
    </Card>
  );
}
```

---

## 🎯 **REMEMBER: These guidelines are MANDATORY**

Following these guidelines ensures:
- **Consistency** across the entire codebase
- **Quality** that meets production standards  
- **Maintainability** for future development
- **Protection** of critical features
- **Performance** optimization
- **Security** best practices

**Any deviation from these guidelines requires explicit approval and documentation of the reasoning.**
