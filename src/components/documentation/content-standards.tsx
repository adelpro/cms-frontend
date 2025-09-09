"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ArrowLeft, Hash, Square, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n';
import { getContentStandards, type ApiContentStandards } from '@/lib/api/assets';
import { tokenStorage } from '@/lib/auth';

interface ContentStandardsProps {
  locale: Locale;
}

export function ContentStandards({ locale }: ContentStandardsProps) {
  const t = useTranslations();
  const [contentStandards, setContentStandards] = useState<ApiContentStandards | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchContentStandards = async () => {
      try {
        setIsLoading(true);
        setError('');
        
        const token = tokenStorage.getToken();
        const data = await getContentStandards(token || undefined);
        setContentStandards(data);
      } catch (err) {
        console.error('Error fetching content standards:', err);
        setError(err instanceof Error ? err.message : 'Failed to load content standards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContentStandards();
  }, []);

  if (isLoading) {
    return (
      <div className="max-width-container px-4 py-8">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !contentStandards) {
    return (
      <div className="max-width-container px-4 py-8">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">
            {t('ui.errorLoadingContent')}
          </h2>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t('ui.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

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
              <span>Version: {contentStandards.version}</span>
              <span>•</span>
              <span>Last updated: {new Date(contentStandards.last_updated).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Dynamic Content Sections from API */}
          {contentStandards.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  index === 0 ? 'bg-blue-100' : 
                  index === 1 ? 'bg-green-100' : 
                  index === 2 ? 'bg-purple-100' : 'bg-gray-100'
                }`}>
                  {index === 0 ? <Hash className="h-5 w-5 text-blue-600" /> :
                   index === 1 ? <Square className="h-5 w-5 text-green-600" /> :
                   index === 2 ? <FileText className="h-5 w-5 text-purple-600" /> :
                   <FileText className="h-5 w-5 text-gray-600" />}
                </div>
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              
              <div className="prose prose-gray max-w-none">
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              </div>

              {/* Subsections */}
              {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-4 ml-4">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="space-y-2">
                      <h3 className="text-lg font-medium">{subsection.title}</h3>
                      <div className="prose prose-sm prose-gray max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: subsection.content }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Required Fields */}
              {section.required_fields && section.required_fields.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Required Fields:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    {section.required_fields.map((field, fieldIndex) => (
                      <li key={fieldIndex} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full flex-shrink-0"></span>
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Default License */}
              {section.default_license && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Default License:</span> {section.default_license}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* File Formats Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">File Formats</h2>
            
            {/* Supported Formats */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Supported Formats</h3>
              <div className="flex flex-wrap gap-2">
                {contentStandards.file_formats.supported.map((format, index) => (
                  <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended Formats */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Recommended Formats</h3>
              <div className="flex flex-wrap gap-2">
                {contentStandards.file_formats.recommended.map((format, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {format}
                  </span>
                ))}
              </div>
            </div>

            {/* Format Specifications */}
            {Object.keys(contentStandards.file_formats.specifications).length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Format Specifications</h3>
                <div className="space-y-2">
                  {Object.entries(contentStandards.file_formats.specifications).map(([format, spec]) => (
                    <div key={format} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <div className="font-medium mb-1">{format}</div>
                      <div className="space-y-1">
                        <a 
                          href={spec.schema_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 block"
                        >
                          Schema Documentation ↗
                        </a>
                        <a 
                          href={spec.example_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 block"
                        >
                          Example File ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {contentStandards.sections.map((section, index) => (
                  <Link 
                    key={index}
                    href={`#section-${index}`} 
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </Link>
                ))}
                <Link 
                  href="#file-formats" 
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  File Formats
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
