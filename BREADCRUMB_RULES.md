# Breadcrumb Usage Rules

## 📍 **When to Use Breadcrumbs**

### **✅ REQUIRED - Use breadcrumbs on:**
- **Asset Details Pages**: `/store/asset/[id]`
- **Publisher Profile Pages**: `/publisher/[id]`
- **License Detail Pages**: `/license/[id]`
- **Documentation Pages**: `/documentation/standards`
- **Any page that is 2+ levels deep** from the homepage

### **❌ NOT REQUIRED - Don't use breadcrumbs on:**
- **Homepage**: `/[locale]`
- **Main Section Pages**: `/store`, `/academy`, `/projects`, `/reports`
- **Authentication Pages**: `/auth/login`, `/auth/signup`

## 🎯 **Breadcrumb Structure**

### **Standard Pattern:**
```tsx
<Breadcrumb 
  items={[
    { label: dict.header.home, href: `/${locale}` },
    { label: dict.header.store, href: `/${locale}/store` },
    { label: asset.title, isCurrentPage: true }
  ]}
/>
```

### **Required Items:**
1. **Home**: Always first, always clickable, uses home icon
2. **Section**: The main section the page belongs to (e.g., Store, Academy)
3. **Current Page**: The actual page title, non-clickable, marked as `isCurrentPage: true`

## 🎨 **Styling Guidelines**

### **Visual Design:**
- **Position**: Top of page content, below header, above main content
- **Spacing**: `mb-6` (24px) margin bottom
- **Colors**: 
  - Links: `text-muted-foreground` with `hover:text-foreground`
  - Current page: `text-foreground` with `font-medium`
  - Separators: `text-muted-foreground`

### **Responsive Behavior:**
- **Mobile**: Compact spacing, same visual hierarchy
- **Desktop**: Maintains spacing and readability

## 🔧 **Implementation Example**

```tsx
import { Breadcrumb } from '@/components/ui/breadcrumb';

export function AssetDetails({ assetId, dict, locale }: AssetDetailsProps) {
  return (
    <div className="max-width-container px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: dict.header.home, href: `/${locale}` },
            { label: dict.header.store, href: `/${locale}/store` },
            { label: asset.title, isCurrentPage: true }
          ]}
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ... rest of content */}
      </div>
    </div>
  );
}
```

## 📱 **Accessibility Features**

### **Built-in Accessibility:**
- **ARIA Label**: `aria-label="Breadcrumb"`
- **Semantic Navigation**: Uses `<nav>` element
- **Screen Reader Support**: Proper heading structure
- **Keyboard Navigation**: All links are keyboard accessible

### **Best Practices:**
- **Clear Labels**: Use descriptive, user-friendly labels
- **Consistent Structure**: Maintain same pattern across all pages
- **Logical Hierarchy**: Ensure breadcrumb reflects actual navigation path

## 🚀 **Adding to New Pages**

### **Step 1: Import Component**
```tsx
import { Breadcrumb } from '@/components/ui/breadcrumb';
```

### **Step 2: Add Breadcrumb Section**
```tsx
<div className="mb-6">
  <Breadcrumb 
    items={[
      { label: dict.header.home, href: `/${locale}` },
      { label: "Section Name", href: `/${locale}/section` },
      { label: "Page Title", isCurrentPage: true }
    ]}
  />
</div>
```

### **Step 3: Use Global Container**
```tsx
<div className="max-width-container px-4 py-8">
  {/* Breadcrumb and content */}
</div>
```

## 📋 **Checklist for New Pages**

- [ ] **Breadcrumb Added**: Component imported and implemented
- [ ] **Correct Structure**: Home → Section → Current Page
- [ ] **Proper Styling**: `mb-6` margin, correct positioning
- **Global Container**: Uses `max-width-container` class
- [ ] **Accessibility**: Proper ARIA labels and semantic structure
- [ ] **Responsive**: Works on mobile and desktop
- [ ] **Consistent**: Follows established pattern

---

**Remember**: Breadcrumbs are essential for user navigation and should be implemented on ALL internal/sub pages to maintain consistent user experience and improve site usability.
