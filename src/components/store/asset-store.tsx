"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { logical, spacing } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface Asset {
  id: string;
  title: string;
  description: string;
  license: string;
  publisher: string;
  category: string;
  licenseColor: 'green' | 'yellow' | 'red';
}

interface AssetStoreProps {
  dict: Dictionary;
  locale: Locale;
}

export function AssetStore({ dict, locale }: AssetStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);
  const itemsPerPage = 10;

  // Mock data
  useEffect(() => {
    const mockAssets: Asset[] = dict.mockData.assets.map((asset, index) => ({
      id: (index + 1).toString(),
      title: asset.title,
      description: asset.description,
      license: ['CC BY', 'CC BY-SA', 'CC0', 'CC BY-NC', 'CC BY-ND'][index] || 'CC BY',
      publisher: asset.publisher,
      category: ['Translation', 'Tafsir', 'Quran Corpus', 'Quran Audio', 'Quran Illustration/Font'][index] || 'Translation',
      licenseColor: (['green', 'yellow', 'green', 'yellow', 'yellow'][index] || 'green') as 'green' | 'yellow' | 'red'
    }));
    setAssets(mockAssets);
  }, [dict.mockData.assets]);

  const categories = [
    { key: 'Translation', label: dict.categories.translation },
    { key: 'Transliteration', label: dict.categories.transliteration },
    { key: 'Quran Corpus', label: dict.categories.quranCorpus },
    { key: 'Quran Audio', label: dict.categories.quranAudio },
    { key: 'Quran Illustration/Font', label: dict.categories.quranIllustrationFont },
    { key: 'Tafsir', label: dict.categories.tafsir }
  ];

  const licenses = [
    { id: 'cc0', name: 'CC0/ Public Domain', label: dict.licenses.cc0, color: 'green' },
    { id: 'cc-by', name: 'CC BY', label: dict.licenses.ccBy, color: 'green' },
    { id: 'cc-by-sa', name: 'CC BY-SA', label: dict.licenses.ccBySa, color: 'yellow' },
    { id: 'cc-by-nd', name: 'CC BY-ND', label: dict.licenses.ccByNd, color: 'yellow' },
    { id: 'cc-by-nc', name: 'CC BY-NC', label: dict.licenses.ccByNc, color: 'yellow' },
    { id: 'cc-by-nc-sa', name: 'CC BY-NC-SA', label: dict.licenses.ccByNcSa, color: 'red' },
    { id: 'cc-by-nc-nd', name: 'CC BY-NC-ND', label: dict.licenses.ccByNcNd, color: 'red' }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(asset.category);
    const matchesLicense = selectedLicenses.length === 0 || selectedLicenses.includes(asset.license);
    
    return matchesSearch && matchesCategory && matchesLicense;
  });

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{dict.store.title}</h1>
        
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={dict.ui.searchInResources}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                {dict.ui.categoryFilters}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
            <CardHeader>
              <CardTitle className="text-lg">{dict.ui.licenseFilters}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {licenses.map(license => (
                <div key={license.id} className={cn("flex items-center", spacing.gapSm)}>
                  <Checkbox
                    id={`license-${license.id}`}
                    checked={selectedLicenses.includes(license.name)}
                    onCheckedChange={(checked) => handleLicenseChange(license.name, checked as boolean)}
                  />
                  <div className={cn("flex items-center", spacing.gapSm, logical.marginStart('5'))}>
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      license.color === 'green' && "bg-green-500",
                      license.color === 'yellow' && "bg-yellow-500", 
                      license.color === 'red' && "bg-red-500"
                    )} />
                    <label htmlFor={`license-${license.id}`} className="text-sm cursor-pointer">
                      {license.label}
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Assets Grid */}
        <div className="lg:col-span-3">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{dict.ui.noResultsFound}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {paginatedAssets.map((asset) => (
                  <Card key={asset.id} className="hover:shadow-md transition-shadow h-fit">
                    <CardContent className="p-6">
                      <div className="flex flex-col h-full">
                        <div className="flex-1 mb-4">
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{asset.title}</h3>
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{asset.description}</p>
                          
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">
                              <span className="font-medium">{dict.ui.publisherLabel}</span> {asset.publisher}
                            </div>
                            <Badge 
                              variant="outline"
                              className={cn(
                                "w-fit text-xs",
                                asset.licenseColor === 'green' && 'border-green-500 text-green-700 bg-green-50',
                                asset.licenseColor === 'yellow' && 'border-yellow-500 text-yellow-700 bg-yellow-50',
                                asset.licenseColor === 'red' && 'border-red-500 text-red-700 bg-red-50'
                              )}
                            >
                              {asset.license}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <Button asChild size="sm" className="w-full">
                            <Link href={`/${locale}/store/asset/${asset.id}`}>
                              {dict.ui.viewDetails}
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
