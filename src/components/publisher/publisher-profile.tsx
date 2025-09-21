"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Building2, Globe, ArrowLeft, MapPin, CheckCircle2, Github, Twitter } from 'lucide-react';
import type { Locale } from '@/i18n';
import { logical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { getPublisherDetails, convertDetailPublisherToApiPublisherDetails, type ApiPublisherDetails } from '@/lib/api/assets';
import { tokenStorage } from '@/lib/auth';
import { useTranslations } from 'next-intl';

interface ConvertedAsset {
  id: string;
  title: string;
  description: string;
  license: string;
  category: string;
  licenseColor: 'green' | 'yellow' | 'red';
  has_access: boolean;
  download_count: number;
  file_size: string;
}

interface PublisherProfileProps {
  publisherId: string;
  locale: Locale;
}

export function PublisherProfile({ publisherId, locale }: PublisherProfileProps) {
  const t = useTranslations();
  const [publisher, setPublisher] = useState<ApiPublisherDetails | null>(null);
  const [assets, setAssets] = useState<ConvertedAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchPublisherData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const token = tokenStorage.getToken();
        const publisherData = await getPublisherDetails(parseInt(publisherId), token || undefined);
        
        // Convert new API format to expected format
        const convertedPublisher = convertDetailPublisherToApiPublisherDetails(publisherData);
        setPublisher(convertedPublisher);
        
        // Note: New API doesn't return assets in publisher details
        // We would need to make a separate call to get assets by publisher
        setAssets([]);
      } catch (err) {
        console.error('Error fetching publisher data:', err);
        setError(err instanceof Error ? err.message : t('ui.publisherNotFound'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublisherData();
  }, [publisherId, t]);


  const filteredAssets = assets;


  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-destructive">{error}</div>
      </div>
    );
  }

  if (!publisher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{t('ui.publisherNotFound')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href={`/${locale}/store`}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 ms-2" />
          {t('ui.backToStore')}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        {/* <div className="w-full lg:w-80 space-y-6"> */}
          {/* Category Filter */}
          {/* <Card>
            <CardHeader>
              <CardTitle>تصنيف الموارد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map(category => (
                <div key={category} className={cn("flex items-center", spacing.gapSm)}>
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card> */}

          {/* License Filter */}
          {/* <Card>
            <CardHeader>
              <CardTitle>رخصة الموارد (CreativeCommons)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {licenses.map(license => (
                <div key={license.id} className="space-y-2">
                  <div className={cn("flex items-center", spacing.gapSm)}>
                    <div className={cn("w-3 h-3 rounded-full", {
                      'bg-green-500': license.color === 'green',
                      'bg-yellow-500': license.color === 'yellow',
                      'bg-red-500': license.color === 'red'
                    })} />
                    <span className="font-medium">{license.label}</span>
                  </div>
                  <div className={cn("flex items-center", spacing.gapSm, logical.marginStart('5'))}>
                    <Checkbox
                      id={`license-${license.id}`}
                      checked={selectedLicenses.includes(license.name)}
                      onCheckedChange={(checked) => handleLicenseChange(license.name, checked as boolean)}
                    />
                    <label htmlFor={`license-${license.id}`} className="text-sm cursor-pointer">
                      {license.name}
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div> */}

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Publisher Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={publisher.thumbnail_url} alt={publisher.name} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      <Building2 className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{publisher.name}</h1>
                      {publisher.verified && (
                        <div title={t('ui.verifiedPublisher')}>
                          <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      {publisher.description}
                    </p>
                    {publisher.bio && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {publisher.bio}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {publisher.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{publisher.location}</span>
                      </div>
                    )}
                    {publisher.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={publisher.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {t('ui.website')}
                        </a>
                      </div>
                    )}
                    {publisher.social_links?.twitter && (
                      <div className="flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        <a 
                          href={`https://twitter.com/${publisher.social_links.twitter.replace('@', '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {publisher.social_links.twitter}
                        </a>
                      </div>
                    )}
                    {publisher.social_links?.github && (
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        <a 
                          href={`https://github.com/${publisher.social_links.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {publisher.social_links.github}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{t('ui.joinedOn')} {publisher.stats?.joined_at ? new Date(publisher.stats.joined_at).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US') : 'N/A'}</span>
                    </div>
                  </div>

                  {/* Publisher Stats */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{publisher.stats?.resources_count || 0}</div>
                      <div className="text-muted-foreground">{t('ui.resources')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{publisher.stats?.assets_count || 0}</div>
                      <div className="text-muted-foreground">{t('ui.assets')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{publisher.stats?.total_downloads?.toLocaleString() || '0'}</div>
                      <div className="text-muted-foreground">{t('ui.totalDownloads')}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources List */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {t('ui.publisherAssets')} ({filteredAssets.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssets.map(asset => (
                <Card key={asset.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg flex-1">{asset.title}</CardTitle>
                      {asset.has_access && (
                        <div title={t('ui.hasAccess')}>
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm">{asset.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn({
                          'border-green-500 text-green-700': asset.licenseColor === 'green',
                          'border-yellow-500 text-yellow-700': asset.licenseColor === 'yellow',
                          'border-red-500 text-red-700': asset.licenseColor === 'red'
                        })}
                      >
                        {asset.license}
                      </Badge>
                      <Badge variant="secondary">{asset.category}</Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{asset.download_count.toLocaleString()} {t('ui.downloads')}</span>
                      <span>{asset.file_size}</span>
                    </div>
                    
                    <div className={cn("flex", logical.justifyEnd)}>
                      <Button size="sm" asChild>
                        <Link href={`/${locale}/store/asset/${asset.id}`}>{t('ui.viewDetails')}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('ui.noAssetsMatchingFilters')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
