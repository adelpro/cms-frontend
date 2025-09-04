"use client";

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface NextIntlProviderProps {
  children: ReactNode;
  locale: string;
  messages: Record<string, unknown>;
}

export function NextIntlProvider({ children, locale, messages }: NextIntlProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
