"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Hash, Square } from 'lucide-react';
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
          </div>

          {/* Verse Usage Standards */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.verseUsage.title')}</h2>
            </div>
            <p className="text-muted-foreground">
              {t('contentStandards.verseUsage.description')}
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.verseUsage.point1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.verseUsage.point2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.verseUsage.point3')}
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.verseUsage.exampleText')}{' '}
                <code className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                  {t('contentStandards.verseUsage.exampleCode')}
                </code>
              </p>
            </div>
          </div>

          {/* Word Usage Standards */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Square className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.wordUsage.title')}</h2>
            </div>
            <p className="text-muted-foreground">
              {t('contentStandards.wordUsage.description')}
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.wordUsage.point1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.wordUsage.point2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.wordUsage.point3')}
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.wordUsage.exampleText')}{' '}
                <code className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                  {t('contentStandards.wordUsage.exampleCode')}
                </code>
              </p>
            </div>
          </div>

          {/* Tafsir Usage Standards */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold">{t('contentStandards.tafsirUsage.title')}</h2>
            </div>
            <p className="text-muted-foreground">
              {t('contentStandards.tafsirUsage.description')}
            </p>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.tafsirUsage.point1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.tafsirUsage.point2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.tafsirUsage.point3')}
              </li>
            </ul>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-medium">{t('contentStandards.example')}:</span>{' '}
                {t('contentStandards.tafsirUsage.exampleText')}{' '}
                <code className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono">
                  {t('contentStandards.tafsirUsage.exampleCode')}
                </code>
              </p>
            </div>
          </div>

          {/* Additional Guidelines */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('contentStandards.additionalGuidelines.title')}</h2>
            
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.additionalGuidelines.point1')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.additionalGuidelines.point2')}
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-foreground rounded-full mt-2 flex-shrink-0"></span>
                {t('contentStandards.additionalGuidelines.point3')}
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
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
                  href="#word-usage" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.wordUsage.title')}
                </Link>
                <Link 
                  href="#tafsir-usage" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.tafsirUsage.title')}
                </Link>
                <Link 
                  href="#additional-guidelines" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {t('contentStandards.additionalGuidelines.title')}
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
