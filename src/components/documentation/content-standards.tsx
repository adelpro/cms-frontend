'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Hash, Square, BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';

interface ContentStandardsProps {
  locale: Locale;
}

export function ContentStandards({ locale }: ContentStandardsProps) {
  const t = useTranslations();

  return (
    <div className="max-width-container px-4 py-8">
      {/* Go Back Link */}
      <div className="mb-6">
        <Link
          href={`/${locale}`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('ui.goBack')}
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-3">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-foreground text-4xl font-bold">{t('contentStandards.title')}</h1>
            <p className="text-muted-foreground text-lg">{t('contentStandards.description')}</p>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <span>{t('contentStandards.version')}: 1.0.0</span>
              <span>•</span>
              <span>
                {t('contentStandards.lastUpdated')}: {new Date('2023-12-01').toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Verse Usage Standards */}
          <div id="verse-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Hash className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.verseUsage.title')}</h2>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.verseUsage.description')}</p>
            </div>

            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {t('contentStandards.verseUsage.guidelines')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                    {t('contentStandards.verseUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                    {t('contentStandards.verseUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></span>
                    {t('contentStandards.verseUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.verseUsage.exampleText')}
              </p>
              <code className="mt-2 block rounded bg-green-100 p-2 font-mono text-sm text-green-800">
                {t('contentStandards.verseUsage.exampleCode')}
              </code>
            </div>
          </div>

          {/* Words Usage Standards */}
          <div id="words-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Square className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.wordsUsage.title')}</h2>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.wordsUsage.description')}</p>
            </div>

            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {t('contentStandards.wordsUsage.guidelines')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600"></span>
                    {t('contentStandards.wordsUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600"></span>
                    {t('contentStandards.wordsUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-600"></span>
                    {t('contentStandards.wordsUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.wordsUsage.exampleText')}
              </p>
              <code className="mt-2 block rounded bg-green-100 p-2 font-mono text-sm text-green-800">
                {t('contentStandards.wordsUsage.exampleCode')}
              </code>
            </div>
          </div>

          {/* Tafsir Usage Standards */}
          <div id="tafsir-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.tafsirUsage.title')}</h2>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.tafsirUsage.description')}</p>
            </div>

            <div className="ml-4 space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  {t('contentStandards.tafsirUsage.guidelines')}
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600"></span>
                    {t('contentStandards.tafsirUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600"></span>
                    {t('contentStandards.tafsirUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-purple-600"></span>
                    {t('contentStandards.tafsirUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.tafsirUsage.exampleText')}
              </p>
              <code className="mt-2 block rounded bg-green-100 p-2 font-mono text-sm text-green-800">
                {t('contentStandards.tafsirUsage.exampleCode')}
              </code>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Square className="h-5 w-5" />
                  {t('contentStandards.onThisPage')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link
                  href="#verse-usage"
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {t('contentStandards.verseUsage.title')}
                </Link>
                <Link
                  href="#words-usage"
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {t('contentStandards.wordsUsage.title')}
                </Link>
                <Link
                  href="#tafsir-usage"
                  className="text-muted-foreground hover:text-foreground block text-sm transition-colors"
                >
                  {t('contentStandards.tafsirUsage.title')}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t border-gray-200 pt-8">
        <p className="text-muted-foreground text-center text-sm">{t('contentStandards.footer')}</p>
      </div>
    </div>
  );
}
