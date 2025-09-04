"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const t = useTranslations();
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label={t('ui.breadcrumb')}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && item.href ? (
            // Home icon for first item if it's a link
            <Link
              href={item.href}
              className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={16} className="h-4 w-4" />
            </Link>
          ) : item.href ? (
            // Clickable link
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            // Current page (non-clickable)
            <span className={cn(
              "font-medium",
              item.isCurrentPage ? "text-foreground" : "text-muted-foreground"
            )}>
              {item.label}
            </span>
          )}
          
          {/* Separator (chevron) - don't show after last item */}
          {index < items.length - 1 && (
            <ChevronRight size={16} className="h-4 w-4 text-muted-foreground" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
