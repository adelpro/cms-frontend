"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Globe, ArrowLeft, MapPin, Languages, Mic, ReceiptText, ScanSearch, Eye, ListFilter, ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Locale } from '@/i18n';
import { spacing } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { getPublisherDetails, getAssets } from '@/lib/api';
import { convertListAssetToAsset } from '@/lib/utils';
import { tokenStorage } from '@/lib/auth';
import { env } from '../../lib/env';

// Publisher details type (from API)
type ApiPublisherDetails = {
  id: number;
  name: string;
  slug: string;
  description: string;
  address: string;
  website: string;
  is_verified: boolean;
  contact_email: string;
  icon_url: string | null;
  stats?: {
    resources_count: number;
    assets_count: number;
    total_downloads: number;
    joined_at: string;
  };
  assets?: Asset[];
};

interface Asset {
  id: string;
  title: string;
  description: string;
  license: string;
  publisher: string;
  category: string;
  licenseColor?: 'green' | 'yellow' | 'red';
  type?: 'translation' | 'tafsir' | 'audio';
  thumbnailUrl?: string;
  hasAccess?: boolean;
  downloadCount?: number;
  fileSize?: string;
}

interface PublisherProfileProps {
  publisherId: string;
  locale: Locale;
}

export function PublisherProfile({ publisherId, locale }: PublisherProfileProps) {
  const t = useTranslations();
  const [publisher, setPublisher] = useState<ApiPublisherDetails | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [isLicenseFilterOpen, setIsLicenseFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAssetsLoading, setIsAssetsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch publisher details
  useEffect(() => {
    const fetchPublisherData = async () => {
      setIsLoading(true);
      setError('');
      
      try {
        const token = tokenStorage.getToken();
        const publisherData = await getPublisherDetails(parseInt(publisherId), token || undefined);
        
        // Use publisher data directly
        setPublisher(publisherData as ApiPublisherDetails);
      } catch (err) {
        console.error('Error fetching publisher data:', err);
        setError(err instanceof Error ? err.message : t('ui.publisherNotFound'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublisherData();
  }, [publisherId, t]);

  // Load assets from API with publisher filter
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsAssetsLoading(true);
        setAssetsError(null);
        
        const token = tokenStorage.getToken();
        const filters: { category?: string[]; license_code?: string[]; search?: string; page?: number; page_size?: number; publisher_id?: number } = {
          page: currentPage,
          page_size: itemsPerPage,
          publisher_id: parseInt(publisherId)
        };
        
        // Apply search filter if provided
        if (debouncedSearchQuery.trim()) {
          filters.search = debouncedSearchQuery.trim();
        }
        
        // Apply category filter if selected - support multiple categories
        if (selectedCategories.length > 0) {
          const categoryMap: { [key: string]: string } = {
            'translation': 'mushaf',
            'tafsir': 'tafsir',
            'audio': 'recitation'
          };
          const mappedCategories = selectedCategories
            .map(cat => categoryMap[cat])
            .filter(Boolean); // Remove undefined values
          if (mappedCategories.length > 0) {
            filters.category = mappedCategories;
          }
        }
        
        // Apply license filter if selected - support multiple licenses
        if (selectedLicenses.length > 0) {
          const licenseMap: { [key: string]: string } = {
            'CC0/ Public Domain': 'CC0',
            'CC BY': 'CC-BY',
            'CC BY-SA': 'CC-BY-SA',
            'CC BY-ND': 'CC-BY-ND',
            'CC BY-NC': 'CC-BY-NC',
            'CC BY-NC-SA': 'CC-BY-NC-SA',
            'CC BY-NC-ND': 'CC-BY-NC-ND'
          };
          const mappedLicenses = selectedLicenses
            .map(license => licenseMap[license])
            .filter(Boolean); // Remove undefined values
          if (mappedLicenses.length > 0) {
            filters.license_code = mappedLicenses;
          }
        }
        
        console.log('Sending filters to API:', filters);
        const response = await getAssets(token || undefined, filters);
        const apiAssets = response.results.map(convertListAssetToAsset);
        setAssets(apiAssets);
        setTotalCount(response.count);
      } catch (err) {
        console.error('Failed to load assets:', err);
        setAssetsError(err instanceof Error ? err.message : t('ui.loadingAssetsError'));
        setAssets([]); // Set empty array on error
      } finally {
        setIsAssetsLoading(false);
      }
    };

    // Only load assets if we have a valid publisherId
    if (publisherId) {
      loadAssets();
    }
  }, [selectedCategories, selectedLicenses, debouncedSearchQuery, currentPage, publisherId, t]);


  const categories = [
    { key: 'translation', label: t('categories.translation') },
    { key: 'tafsir', label: t('categories.tafsir') },
    { key: 'audio', label: t('categories.quranAudio') }
  ];

  const licenses = [
    { id: 'CC0', name: 'CC0/ Public Domain', label: t('licenses.cc0'), color: 'green' },
    { id: 'CC-BY', name: 'CC BY', label: t('licenses.ccBy'), color: 'green' },
    { id: 'CC-BY-SA', name: 'CC BY-SA', label: t('licenses.ccBySa'), color: 'yellow' },
    { id: 'CC-BY-ND', name: 'CC BY-ND', label: t('licenses.ccByNd'), color: 'yellow' },
    { id: 'CC-BY-NC', name: 'CC BY-NC', label: t('licenses.ccByNc'), color: 'yellow' },
    { id: 'CC-BY-NC-SA', name: 'CC BY-NC-SA', label: t('licenses.ccByNcSa'), color: 'red' },
    { id: 'CC-BY-NC-ND', name: 'CC BY-NC-ND', label: t('licenses.ccByNcNd'), color: 'red' }
  ];

  // Assets are now filtered by the API, so we use them directly
  // Pagination is also handled by the API
  const displayAssets = assets;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
    setCurrentPage(1);
  };

  const handleLicenseChange = (license: string, checked: boolean) => {
    if (checked) {
      setSelectedLicenses([...selectedLicenses, license]);
    } else {
      setSelectedLicenses(selectedLicenses.filter(l => l !== license));
    }
    setCurrentPage(1);
  };


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
    <div className="max-width-container px-4 py-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-5">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Search Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ScanSearch size={24} className="flex-shrink-0" />
                {t('ui.searchInResources')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder={t('ui.searchInResources')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Category Filter */}
          <Card>
            <CardHeader 
              className="cursor-pointer lg:cursor-default"
              onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen)}
            >
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <ListFilter size={24} className="flex-shrink-0" />
                  {t('ui.categoryFilters')}
                </div>
                <div className="lg:hidden">
                  {isCategoryFilterOpen ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "space-y-3",
              "lg:block",
              isCategoryFilterOpen ? "block" : "hidden"
            )}>
              {categories.map(category => (
                <div key={category.key} className={cn("flex items-center", spacing.gapSm)}>
                  <Checkbox
                    id={`category-${category.key}`}
                    checked={selectedCategories.includes(category.key)}
                    onCheckedChange={(checked) => handleCategoryChange(category.key, checked as boolean)}
                  />
                  <label htmlFor={`category-${category.key}`} className="text-sm cursor-pointer">
                    {category.label}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* License Filter */}
          <Card>
            <CardHeader 
              className="cursor-pointer lg:cursor-default"
              onClick={() => setIsLicenseFilterOpen(!isLicenseFilterOpen)}
            >
              <CardTitle className="flex items-center justify-between text-base">
                <div className="flex items-center gap-2">
                  <ScrollText size={24} className="flex-shrink-0" />
                  {t('ui.licenseFilters')}
                </div>
                <div className="lg:hidden">
                  {isLicenseFilterOpen ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={cn(
              "space-y-3",
              "lg:block",
              isLicenseFilterOpen ? "block" : "hidden"
            )}>
              {licenses.map(license => (
                <div key={license.id} className={cn("flex flex-col", spacing.gapSm)}>
                  <div className={cn("flex items-center", spacing.gapSm)}>
                    <Checkbox
                      id={`license-${license.id}`}
                      checked={selectedLicenses.includes(license.name)}
                      onCheckedChange={(checked) => handleLicenseChange(license.name, checked as boolean)}
                    />
                    <label htmlFor={`license-${license.id}`} className="text-sm cursor-pointer">
                      {license.label}
                    </label>
                  </div>
                  <div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs border-0 text-white h-6 px-2 w-fit",
                        (license.id === 'CC-BY' || license.id === 'CC0') && "bg-emerald-500",
                        (license.id === 'CC-BY-SA' || license.id === 'CC-BY-ND' || license.id === 'CC-BY-NC') && "bg-amber-500",
                        (license.id === 'CC-BY-NC-SA' || license.id === 'CC-BY-NC-ND') && "bg-red-500"
                      )}
                    >
                      {license.id.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Publisher Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={`${env.NEXT_PUBLIC_BACKEND_URL}${publisher.icon_url}`} alt={publisher.name} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      <Building2 className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-2xl font-bold">{publisher.name}</h1>
                      {/* {publisher.verified && (
                        <div title={t('ui.verifiedPublisher')}>
                          <CheckCircle2 className="w-6 h-6 text-blue-500" />
                        </div>
                      )} */}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      {publisher.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {publisher.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{publisher.address}</span>
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
                    {/* Social links not provided by current API */}
                    {/* {publisher.social_links?.twitter && (
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
                    )} */}
                  </div>

                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assets List */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              {t('ui.publisherAssets')} ({totalCount})
            </h2>
            
            {isAssetsLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('ui.loadingAssets')}</p>
              </div>
            ) : assetsError ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">{assetsError}</p>
                <Button 
                  onClick={() => {
                    setAssetsError(null);
                    setIsAssetsLoading(true);
                    // Trigger reload by changing a dependency
                    setCurrentPage(1);
                  }}
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : assets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('ui.noResultsFound')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8 auto-rows-fr">
                  {displayAssets.map((asset) => (
                    <Card key={asset.id} className="shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.1),0px_10px_15px_-3px_rgba(0,0,0,0.1)] hover:shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_16px_20px_-5px_rgba(0,0,0,0.1)] transition-shadow h-full">
                      <CardHeader className="flex items-center justify-between gap-2">
                        {asset.type === 'translation' && (
                          <Languages size={32} className="text-primary-400" />
                        )}
                        {asset.type === 'tafsir' && (
                          <ReceiptText size={32} className="text-primary-400" />
                        )}
                        {asset.type === 'audio' && (
                          <Mic size={32} className="text-primary-400" />
                        )}
                        <Badge 
                          variant="outline"
                          className={cn("w-fit max-w-[130px] text-xs border border-neutral-200 truncate")}
                        >
                          {asset.license}
                        </Badge>
                      </CardHeader>
                      <CardContent className="h-full">
                        <div className="flex flex-col h-full gap-4">
                          <div className="flex-1 flex flex-col justify-between gap-14">
                            <div>
                              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{asset.title}</h3>
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{asset.description}</p>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground flex flex-col">
                                <span className="font-medium">{t('ui.publisherLabel')}</span> {asset.publisher}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-auto">
                            <Button asChild size="lg" variant="outline" className="w-full">
                              <Link href={`/${locale}/store/asset/${asset.id}`}>
                                {t('store.viewDetails')}
                                <Eye size={16} />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
