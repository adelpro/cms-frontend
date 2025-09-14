"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Hash, Square, BookOpen, Code } from 'lucide-react';
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
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('ui.goBack')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              {t('contentStandards.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('contentStandards.description')}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{t('contentStandards.version')}: 1.0.0</span>
              <span>•</span>
              <span>{t('contentStandards.lastUpdated')}: {new Date('2023-12-01').toLocaleDateString()}</span>
            </div>
          </div>

          {/* Verse Usage Standards */}
          <div id="verse-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Hash className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.verseUsage.title')}</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.verseUsage.description')}</p>
            </div>

            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t('contentStandards.verseUsage.guidelines')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.verseUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.verseUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.verseUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span> {t('contentStandards.verseUsage.exampleText')}
              </p>
              <code className="block mt-2 p-2 bg-green-100 text-green-800 rounded text-sm font-mono">
                {t('contentStandards.verseUsage.exampleCode')}
              </code>
            </div>
          </div>

          {/* Words Usage Standards */}
          <div id="words-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Square className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.wordsUsage.title')}</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.wordsUsage.description')}</p>
            </div>

            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t('contentStandards.wordsUsage.guidelines')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.wordsUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.wordsUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.wordsUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span> {t('contentStandards.wordsUsage.exampleText')}
              </p>
              <code className="block mt-2 p-2 bg-green-100 text-green-800 rounded text-sm font-mono">
                {t('contentStandards.wordsUsage.exampleCode')}
              </code>
            </div>
          </div>

          {/* Tafsir Usage Standards */}
          <div id="tafsir-usage" className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.tafsirUsage.title')}</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p>{t('contentStandards.tafsirUsage.description')}</p>
            </div>

            <div className="space-y-4 ml-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{t('contentStandards.tafsirUsage.guidelines')}</h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.tafsirUsage.guideline1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.tafsirUsage.guideline2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-600 rounded-full flex-shrink-0"></span>
                    {t('contentStandards.tafsirUsage.guideline3')}
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-medium">{t('contentStandards.example')}:</span> {t('contentStandards.tafsirUsage.exampleText')}
              </p>
              <code className="block mt-2 p-2 bg-green-100 text-green-800 rounded text-sm font-mono">
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
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.verseUsage.title')}
                </Link>
                <Link 
                  href="#words-usage" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.wordsUsage.title')}
                </Link>
                <Link 
                  href="#tafsir-usage" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.tafsirUsage.title')}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <p className="text-center text-sm text-muted-foreground">
          {t('contentStandards.footer')}
        </p>
      </div>
    </div>
  );
}
