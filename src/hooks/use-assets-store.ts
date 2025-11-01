'use client';

import { useState, useEffect } from 'react';
import { getAssets } from '@/lib/api';
import { convertListAssetToAsset } from '@/lib/utils';
import { tokenStorage } from '@/lib/auth';
import type { Locale } from '@/i18n';

export interface Asset {
  id: string;
  title: string;
  description: string;
  license: string;
  publisher: string;
  type?: 'translation' | 'tafsir' | 'audio';
}

interface UseAssetsStoreProps {
  locale: Locale;
  itemsPerPage: number;
}

export function useAssetsStore({ itemsPerPage }: UseAssetsStoreProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
  const [isLicenseFilterOpen, setIsLicenseFilterOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load assets
  useEffect(() => {
    const loadAssets = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = tokenStorage.getToken();
        const filters: Record<string, unknown> = {
          page: currentPage,
          page_size: itemsPerPage,
          search: debouncedSearchQuery || undefined,
          category: selectedCategories.length ? selectedCategories : undefined,
          license_code: selectedLicenses.length ? selectedLicenses : undefined,
        };
        const response = await getAssets(token || undefined, filters);
        setAssets(response.results.map(convertListAssetToAsset));
        setTotalPages(Math.ceil(response.count / itemsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load assets');
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadAssets();
  }, [debouncedSearchQuery, selectedCategories, selectedLicenses, currentPage, itemsPerPage]);

  return {
    assets,
    totalPages,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    setSelectedCategories,
    selectedLicenses,
    setSelectedLicenses,
    currentPage,
    setCurrentPage,
    isCategoryFilterOpen,
    setIsCategoryFilterOpen,
    isLicenseFilterOpen,
    setIsLicenseFilterOpen,
  };
}
