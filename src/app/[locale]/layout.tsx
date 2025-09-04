import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isValidLocale } from "@/i18n";
import type { Locale } from "@/i18n";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NextIntlProvider } from "@/components/providers/next-intl-provider";
import { direction } from "@/lib/styles/logical";
import { ConditionalHeader } from "@/components/layout/conditional-header";
import { getMessages } from "@/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Itqan CMS",
  description: "A modern content management system",
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  
  // Validate locale with proper type safety
  if (!isValidLocale(locale)) {
    notFound();
  }

  // Type assertion after validation
  const validatedLocale = locale as Locale;
  const isRTL = direction.isRTL(validatedLocale);
  const dir = direction.getDir(validatedLocale);
  const messages = await getMessages(validatedLocale);

  return (
    <html lang={validatedLocale} dir={dir} suppressHydrationWarning>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          isRTL && "font-arabic"
        )}
      >
        <ThemeProvider>
          <NextIntlProvider locale={validatedLocale} messages={messages}>
            <AuthProvider locale={validatedLocale}>
              <ConditionalHeader locale={validatedLocale} />
              <main>
                {children}
              </main>
            </AuthProvider>
          </NextIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
