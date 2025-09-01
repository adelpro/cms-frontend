"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useTranslation } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/types";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const params = useParams();
  const locale = (params?.locale || 'en') as Locale;
  const { dict } = useTranslation();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="h-16 w-16 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {dict.ui.somethingWentWrong}
          </h1>
          <p className="text-muted-foreground">
            {dict.ui.errorDescription}
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-muted rounded-lg text-start">
            <p className="text-sm font-mono text-muted-foreground break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                {dict.ui.errorId} {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            className={cn("gap-2")}
          >
            <RefreshCw className="h-4 w-4" />
            {dict.ui.tryAgain}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => { window.location.href = `/${locale}`; }}
          >
            {dict.ui.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
