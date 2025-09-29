"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Languages, Mic, ReceiptText, ScanSearch, Eye, ListFilter, ScrollText, ChevronDown, ChevronUp } from 'lucide-react';
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
import { getAssets, convertListAssetToAsset } from '@/lib/api/assets';
import { tokenStorage } from '@/lib/auth';

interface Asset {
  id: string;
  title: string;
  description: string;
  license: string;
  publisher: string;
  category: string;
  licenseColor: 'green' | 'yellow' | 'red';
  type: 'translation' | 'tafsir' | 'audio';
  thumbnail_url?: string;
  has_access?: boolean;
  download_count?: number;
  file_size?: string;
}

interface AssetStoreProps {
  locale: Locale;
}

export function AssetStore({ locale }: AssetStoreProps) {
  // const { user } = useAuth(); // TODO: Implement user-specific features
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [isLicenseFilterOpen, setIsLicenseFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load assets from API
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = tokenStorage.getToken();
        const filters: { category?: string[]; license_code?: string[]; search?: string; page?: number; page_size?: number } = {
          page: currentPage,
          page_size: itemsPerPage
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
        setError(err instanceof Error ? err.message : t('ui.loadingAssetsError'));
        setAssets([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, [selectedCategories, selectedLicenses, debouncedSearchQuery, currentPage, t]);

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

  return (
         <div className="max-width-container px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold">{t('store.title')}</h1>
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

        {/* Assets Grid */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('ui.loadingAssets')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
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
  );
}
