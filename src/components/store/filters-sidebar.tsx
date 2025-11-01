'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ListFilter, ScrollText, ScanSearch, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { spacing } from '@/lib/styles/logical';
import { useTranslations } from 'next-intl';

interface FiltersSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategories: string[];
  setSelectedCategories: (cats: string[]) => void;
  selectedLicenses: string[];
  setSelectedLicenses: (licenses: string[]) => void;
  isCategoryFilterOpen: boolean;
  setIsCategoryFilterOpen: (open: boolean) => void;
  isLicenseFilterOpen: boolean;
  setIsLicenseFilterOpen: (open: boolean) => void;
}

export default function FiltersSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategories,
  setSelectedCategories,
  selectedLicenses,
  setSelectedLicenses,
  isCategoryFilterOpen,
  setIsCategoryFilterOpen,
  isLicenseFilterOpen,
  setIsLicenseFilterOpen,
}: FiltersSidebarProps) {
  const t = useTranslations();

  const categories = [
    { key: 'translation', label: t('categories.translation') },
    { key: 'tafsir', label: t('categories.tafsir') },
    { key: 'audio', label: t('categories.quranAudio') },
  ];

  const licenses = [
    { id: 'CC0', name: 'CC0/ Public Domain', label: t('licenses.cc0'), color: 'green' },
    { id: 'CC-BY', name: 'CC BY', label: t('licenses.ccBy'), color: 'green' },
    { id: 'CC-BY-SA', name: 'CC BY-SA', label: t('licenses.ccBySa'), color: 'yellow' },
    { id: 'CC-BY-ND', name: 'CC BY-ND', label: t('licenses.ccByNd'), color: 'yellow' },
    { id: 'CC-BY-NC', name: 'CC BY-NC', label: t('licenses.ccByNc'), color: 'yellow' },
    { id: 'CC-BY-NC-SA', name: 'CC BY-NC-SA', label: t('licenses.ccByNcSa'), color: 'red' },
    { id: 'CC-BY-NC-ND', name: 'CC BY-NC-ND', label: t('licenses.ccByNcNd'), color: 'red' },
  ];

  const handleCategoryChange = (key: string, checked: boolean) =>
    setSelectedCategories(
      checked ? [...selectedCategories, key] : selectedCategories.filter((c) => c !== key),
    );

  const handleLicenseChange = (name: string, checked: boolean) =>
    setSelectedLicenses(
      checked ? [...selectedLicenses, name] : selectedLicenses.filter((l) => l !== name),
    );

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ScanSearch size={24} /> {t('ui.searchInResources')}
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
              <ListFilter size={24} /> {t('ui.categoryFilters')}
            </div>
            <div className="lg:hidden">
              {isCategoryFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn('space-y-3', 'lg:block', isCategoryFilterOpen ? 'block' : 'hidden')}
        >
          {categories.map((cat) => (
            <div key={cat.key} className={cn('flex items-center', spacing.gapSm)}>
              <Checkbox
                id={`category-${cat.key}`}
                checked={selectedCategories.includes(cat.key)}
                onCheckedChange={(checked) => handleCategoryChange(cat.key, checked as boolean)}
              />
              <label htmlFor={`category-${cat.key}`} className="cursor-pointer text-sm">
                {cat.label}
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
              <ScrollText size={24} /> {t('ui.licenseFilters')}
            </div>
            <div className="lg:hidden">
              {isLicenseFilterOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent
          className={cn('space-y-3', 'lg:block', isLicenseFilterOpen ? 'block' : 'hidden')}
        >
          {licenses.map((license) => (
            <div key={license.id} className={cn('flex flex-col', spacing.gapSm)}>
              <div className={cn('flex items-center', spacing.gapSm)}>
                <Checkbox
                  id={`license-${license.id}`}
                  checked={selectedLicenses.includes(license.name)}
                  onCheckedChange={(checked) =>
                    handleLicenseChange(license.name, checked as boolean)
                  }
                />
                <label htmlFor={`license-${license.id}`} className="cursor-pointer text-sm">
                  {license.label}
                </label>
              </div>
              <Badge
                className={`h-6 w-fit px-2 text-xs text-white ${
                  license.color === 'green'
                    ? 'bg-emerald-500'
                    : license.color === 'yellow'
                      ? 'bg-amber-500'
                      : 'bg-red-500'
                }`}
              >
                {license.id.toUpperCase()}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
