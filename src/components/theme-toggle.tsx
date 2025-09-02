"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useTranslation } from "@/components/providers/locale-provider";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const { dict } = useTranslation();
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
        <span className="sr-only">{dict.ui.loadingThemeToggle}</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="outline"
      size="icon-sm"
      onClick={toggleTheme}
      className="relative shadow-[0_10px_15px_-3px_rgba(0,0,0,0.06)]"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">
        {isDark ? dict.ui.switchToLightMode : dict.ui.switchToDarkMode}
      </span>
    </Button>
  );
}
