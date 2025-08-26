/**
 * Logical Properties Utilities
 * 
 * This file provides utilities for CSS Logical Properties that work
 * automatically with RTL/LTR based on the document's dir attribute.
 * 
 * Benefits:
 * - No conditional logic needed
 * - Works automatically with dir="rtl" or dir="ltr"
 * - More performant than JavaScript-based solutions
 * - Standards-compliant CSS
 */

import { type ClassValue } from "clsx";
import { cn } from "./utils";

/**
 * Logical spacing utilities using CSS logical properties
 * These automatically adapt to RTL/LTR without JavaScript
 */
export const logical = {
  // Margin utilities
  marginStart: (size: string) => `ms-${size}`,
  marginEnd: (size: string) => `me-${size}`,
  marginInline: (size: string) => `mx-${size}`, // Tailwind's mx works with logical properties
  
  // Padding utilities  
  paddingStart: (size: string) => `ps-${size}`,
  paddingEnd: (size: string) => `pe-${size}`,
  paddingInline: (size: string) => `px-${size}`, // Tailwind's px works with logical properties
  
  // Text alignment
  textStart: "text-start",
  textEnd: "text-end",
  
  // Flexbox alignment
  justifyStart: "justify-start",
  justifyEnd: "justify-end",
  
  // Border utilities
  borderStart: "border-s",
  borderEnd: "border-e",
} as const;

/**
 * Direction-aware component class builder
 * Uses CSS logical properties instead of conditional classes
 */
export function logicalClass(...classes: ClassValue[]): string {
  return cn(classes);
}

/**
 * Common layout patterns using logical properties
 */
export const layoutPatterns = {
  // Container with logical padding
  container: "container-padding",
  
  // Flex layouts that respect text direction
  flexRowReverse: "flex flex-row-reverse", // Content flows opposite to text direction
  flexRow: "flex flex-row", // Content flows with text direction
  
  // Common spacing patterns
  spaceBetween: "flex justify-between items-center",
  spaceAround: "flex justify-around items-center",
  
  // Card layouts
  cardHeader: "flex justify-between items-center ps-4 pe-4",
  cardContent: "ps-4 pe-4",
  
  // Navigation patterns
  navItem: "ps-4 pe-4 text-start",
  navList: "flex gap-4",
} as const;

/**
 * Icon positioning utilities for RTL/LTR
 */
export const iconPosition = {
  start: "icon-start", // Icon appears at text start (left in LTR, right in RTL)
  end: "icon-end",     // Icon appears at text end (right in LTR, left in RTL)
} as const;

/**
 * Form-specific logical utilities
 */
export const formLogical = {
  label: "text-start font-medium",
  input: "text-start ps-3 pe-3",
  inputWithIcon: "ps-10 pe-3", // Space for start icon
  helpText: "text-start text-sm text-muted-foreground",
  errorText: "text-start text-sm text-destructive",
} as const;

/**
 * Helper to combine multiple logical classes
 */
export function combineLogical(...classGroups: (ClassValue | keyof typeof logical)[]): string {
  const resolvedClasses = classGroups.map(classGroup => {
    if (typeof classGroup === 'string' && classGroup in logical) {
      return logical[classGroup as keyof typeof logical];
    }
    return classGroup;
  });
  
  return cn(resolvedClasses);
}
