'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same dimensions to avoid layout shift
    return (
      <Button variant="outline" size="icon" disabled>
        <div className="h-4 w-4" />
        <span className="sr-only">Loading theme toggle</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      className="relative shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06)]"
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">{isDark ? t('theme.lightMode') : t('theme.darkMode')}</span>
    </Button>
  );
}
