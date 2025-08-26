import { type ClassValue } from "clsx";
import { cn } from "./utils";

/**
 * RTL-aware utility for handling directional classes
 */
export function rtlClass(
  ltrClasses: ClassValue,
  rtlClasses: ClassValue,
  isRTL: boolean
): string {
  return cn(isRTL ? rtlClasses : ltrClasses);
}

/**
 * Common RTL class mappings
 */
export const rtlMappings = {
  // Margins
  'ml-4': 'mr-4',
  'mr-4': 'ml-4',
  'ml-2': 'mr-2',
  'mr-2': 'ml-2',
  'ml-8': 'mr-8',
  'mr-8': 'ml-8',
  
  // Padding
  'pl-4': 'pr-4',
  'pr-4': 'pl-4',
  'pl-2': 'pr-2',
  'pr-2': 'pl-2',
  'pl-8': 'pr-8',
  'pr-8': 'pl-8',
  
  // Positioning
  'left-4': 'right-4',
  'right-4': 'left-4',
  'left-0': 'right-0',
  'right-0': 'left-0',
  
  // Borders
  'border-l': 'border-r',
  'border-r': 'border-l',
  'border-l-2': 'border-r-2',
  'border-r-2': 'border-l-2',
  
  // Flex
  'justify-start': 'justify-end',
  'justify-end': 'justify-start',
  
  // Text alignment
  'text-left': 'text-right',
  'text-right': 'text-left',
} as const;

/**
 * Automatically convert LTR classes to RTL equivalents
 */
export function autoRtlClass(classes: string, isRTL: boolean): string {
  if (!isRTL) return classes;
  
  let rtlClasses = classes;
  
  Object.entries(rtlMappings).forEach(([ltr, rtl]) => {
    rtlClasses = rtlClasses.replace(new RegExp(`\\b${ltr}\\b`, 'g'), rtl);
  });
  
  return rtlClasses;
}

/**
 * Direction-aware spacing utilities
 */
export const spacing = {
  marginStart: (size: string, isRTL: boolean) => isRTL ? `mr-${size}` : `ml-${size}`,
  marginEnd: (size: string, isRTL: boolean) => isRTL ? `ml-${size}` : `mr-${size}`,
  paddingStart: (size: string, isRTL: boolean) => isRTL ? `pr-${size}` : `pl-${size}`,
  paddingEnd: (size: string, isRTL: boolean) => isRTL ? `pl-${size}` : `pr-${size}`,
};
