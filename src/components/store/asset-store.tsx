'use client';

import React from 'react';
import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useAssetsStore } from '@/hooks/use-assets-store';
import type { Locale } from '@/i18n';
import { useReportWebVitals } from 'next/web-vitals';

const logWebVitals = (metric: string) => console.log(metric);

// Dynamic imports with individual skeletons
const FiltersSidebar = dynamic(() => import('./filters-sidebar'), {
  ssr: false,
  loading: () => (
    <div className="space-y-3">
      <div className="h-10 w-3/4 animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
      <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
    </div>
  ),
});

const AssetList = dynamic(() => import('./asset-list'), {
  ssr: false,
  loading: () => (
    <div className="mb-8 grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 animate-pulse rounded bg-gray-200" />
      ))}
    </div>
  ),
});

interface AssetStoreProps {
  locale: Locale;
}

export const AssetStore: React.FC<AssetStoreProps> = ({ locale }) => {
  useReportWebVitals(logWebVitals);
  const t = useTranslations();

  const {
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
  } = useAssetsStore({ locale, itemsPerPage: 10 });

  return (
    <div className="max-width-container px-4 py-8">
      <h1 className="mb-5 text-3xl font-bold">{t('store.title')}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-5">
        {/* Filters */}
        <FiltersSidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedLicenses={selectedLicenses}
          setSelectedLicenses={setSelectedLicenses}
          isCategoryFilterOpen={isCategoryFilterOpen}
          setIsCategoryFilterOpen={setIsCategoryFilterOpen}
          isLicenseFilterOpen={isLicenseFilterOpen}
          setIsLicenseFilterOpen={setIsLicenseFilterOpen}
        />

        {/* Asset List */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <AssetList assets={[]} locale={locale} />
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => setCurrentPage(1)}>
                Try Again
              </Button>
            </div>
          ) : assets.length === 0 ? (
            <div className="py-12 text-center">{t('ui.noResultsFound')}</div>
          ) : (
            <>
              <AssetList assets={assets} locale={locale} />

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
                        className={
                          currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                        }
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
};
