"use client";

import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/components/providers/locale-provider";
import type { Locale } from "@/lib/i18n/types";

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale || 'en') as Locale;
  const { dict } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
          <h2 className="text-2xl font-bold text-foreground">
            {dict.ui.pageNotFound}
          </h2>
          <p className="text-muted-foreground">
            {dict.ui.pageNotFoundDesc}
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Button asChild className={cn("gap-2")}>
            <Link href={`/${locale}`}>
              <Home className="h-4 w-4" />
              {dict.ui.goHome}
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className={cn("gap-2")}
          >
            <ArrowLeft className="h-4 w-4" />
            {dict.ui.goBack}
          </Button>
        </div>
      </div>
    </div>
  );
}
