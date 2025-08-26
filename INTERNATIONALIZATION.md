# Internationalization (i18n) Implementation

This document describes the comprehensive internationalization implementation for Itqan CMS, supporting Arabic (RTL) and English (LTR) with Arabic as the default language.

## 🌍 Features

- ✅ **Full i18n Support**: Arabic and English languages
- ✅ **RTL/LTR Layout**: Automatic direction switching
- ✅ **Arabic Default**: Arabic is the default language
- ✅ **URL-based Routing**: `/ar/` and `/en/` prefixes
- ✅ **Auto-redirect**: Root `/` redirects to `/ar/`
- ✅ **SEO Friendly**: Proper metadata and URL structure
- ✅ **Type Safety**: Full TypeScript support
- ✅ **ShadCN/UI Compatible**: RTL-aware components

## 📁 File Structure

```
src/
├── middleware.ts                 # Locale detection and routing
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx           # Locale-aware layout
│   │   └── page.tsx             # Homepage with i18n
│   └── globals.css              # RTL/LTR styles
├── dictionaries/
│   ├── ar.json                  # Arabic translations
│   └── en.json                  # English translations
├── lib/
│   ├── dictionaries.ts          # Dictionary loader
│   ├── locale-provider.tsx      # Client-side context
│   ├── locale-utils.ts          # Utility functions
│   └── rtl-utils.ts             # RTL class helpers
└── components/
    └── language-switcher.tsx    # Language toggle
```

## 🔧 Key Components

### 1. Middleware (`src/middleware.ts`)
- Handles locale detection from URL and headers
- Redirects root `/` to `/ar/` (Arabic default)
- Validates locale parameters

### 2. Dynamic Layout (`src/app/[locale]/layout.tsx`)
- Sets `lang` and `dir` attributes
- Applies Arabic font styles
- Validates locale parameters

### 3. Translation System
- **Static Dictionaries**: JSON files for translations
- **Type Safety**: Full TypeScript interface
- **Server-side**: `getDictionary()` for SSR
- **Client-side**: `useTranslation()` hook

### 4. RTL Utilities (`src/lib/rtl-utils.ts`)
- `rtlClass()`: Conditional class application
- `autoRtlClass()`: Automatic LTR→RTL conversion
- `spacing`: Direction-aware spacing helpers

## 🎨 Styling Approach

### CSS Custom Variants
```css
@custom-variant rtl (&:is([dir="rtl"] *));
@custom-variant ltr (&:is([dir="ltr"] *));
```

### RTL-Specific Styles
```css
/* Automatic text direction */
[dir="rtl"] body {
  text-align: right;
}

/* Button icon ordering */
.rtl:flex-row-reverse
```

### Component Example
```tsx
<div className={rtlClass(
  "flex gap-4",              // LTR
  "flex gap-4 flex-row-reverse", // RTL
  isRTL
)}>
```

## 🚀 Usage Examples

### Server Components
```tsx
import { getDictionary } from "@/lib/dictionaries";
import type { Locale } from "@/middleware";

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  
  return <h1>{dict.welcome}</h1>;
}
```

### Client Components
```tsx
"use client";
import { useTranslation } from "@/lib/locale-provider";

export function MyComponent() {
  const { t } = useTranslation();
  return <button>{t('save')}</button>;
}
```

### RTL-Aware Styling
```tsx
import { rtlClass } from "@/lib/rtl-utils";

<div className={rtlClass(
  "text-left ml-4",    // LTR styles
  "text-right mr-4",   // RTL styles
  isRTL
)} />
```

## 🛣️ Routing

### URL Structure
- `/` → Redirects to `/ar/`
- `/ar/` → Arabic homepage
- `/en/` → English homepage
- `/ar/about` → Arabic about page
- `/en/about` → English about page

### Navigation
```tsx
import { useRouter } from "next/navigation";

const router = useRouter();
router.push(`/${newLocale}/about`);
```

## 📚 Dictionary Management

### Adding New Translations
1. Add keys to `src/dictionaries/ar.json`
2. Add corresponding keys to `src/dictionaries/en.json`
3. Update the `Dictionary` type in `src/lib/dictionaries.ts`

### Example Dictionary Entry
```json
// ar.json
{
  "newFeature": "ميزة جديدة"
}

// en.json
{
  "newFeature": "New Feature"
}
```

## 🎯 Best Practices

### 1. RTL Layout Design
- Use logical properties (`margin-inline-start` vs `margin-left`)
- Test all UI components in both directions
- Consider text expansion (Arabic text is often longer)

### 2. Typography
- Use appropriate fonts for Arabic (included in global styles)
- Consider line-height adjustments for Arabic text
- Test text alignment in both languages

### 3. Icons and Images
- Mirror directional icons in RTL (arrows, chevrons)
- Consider cultural appropriateness of images
- Test icon positioning with different text lengths

### 4. Forms and Inputs
- Ensure proper label alignment
- Test validation messages in both languages
- Consider different input methods (Arabic keyboard)

## 🔍 SEO Considerations

- Each locale has its own URL structure
- Proper `lang` and `dir` attributes
- Metadata can be localized per route
- Search engines can index both versions

## 🚦 Development Workflow

1. **Create new pages**: Always in `[locale]` directory
2. **Add translations**: Update both JSON files
3. **Test RTL**: Check layout in Arabic mode
4. **Type safety**: Update Dictionary interface if needed
5. **Accessibility**: Ensure screen readers work correctly

## 📱 Mobile Considerations

- RTL scrolling behavior
- Touch interactions (swipe direction)
- Keyboard layout switching
- App store descriptions in both languages

This implementation provides a solid foundation for a fully internationalized application with proper RTL support, following Next.js 15 best practices and modern web standards.
