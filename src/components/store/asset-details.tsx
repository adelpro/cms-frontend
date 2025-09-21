"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  FileText,
  Eye,
  BookOpen,
  FileText as FileTextIcon,
  CloudDownload,
  ScrollText,
  SquareDashedMousePointer,
  Languages,
  AlertCircle,
  RefreshCw,
  ScanEye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AccessRequestForm } from "./access-request-form";
import { LicenseCarousel } from "./license-carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Locale } from "@/i18n";
import { direction } from "@/lib/styles/logical";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { getAssetDetails, downloadAsset, downloadOriginalResource } from "@/lib/api/assets";
import { tokenStorage } from "@/lib/auth";
import { useTranslations } from "next-intl";
import { env } from "@/lib/env";

interface AssetDetailsType {
  id: number;
  title: string;
  description: string;
  long_description: string;
  thumbnail_url: string;
  category: 'mushaf' | 'tafsir' | 'recitation';
  license: {
    code: string;
    name: string;
    short_name: string;
    url: string;
    icon_url: string;
    summary: string;
    full_text: string;
    legal_code_url: string;
    license_terms: Array<{
      title: string;
      description: string;
      order: number;
    }>;
    permissions: Array<{ key: string; label: string; description: string }>;
    conditions: Array<object>;
    limitations: Array<{ key: string; label: string; description: string }>;
    usage_count: number;
    is_default: boolean;
  };
  snapshots: Array<{
    thumbnail_url: string; // image url ( the image that will be shown in the carousel)
    title: string;
    description: string;
  }>;
  publisher: {
    id: number;
    name: string;
    thumbnail_url: string;
    bio: string | null;
    verified: boolean;
  };
  resource: {
    id: number;
    title: string;
    description: string;
  } | null;
  technical_details: {
    file_size: string;
    format: string;
    encoding: string;
    version: string;
    language: string;
  };
  stats: {
    download_count: number;
    view_count: number;
    created_at: string;
    updated_at: string;
  };
  access: {
    has_access: boolean;
    requires_approval: boolean;
  };
  related_assets: Array<{
    id: number;
    title: string;
    thumbnail_url: string;
  }>;
}

interface AssetDetailsProps {
  assetId: string;
  locale: Locale;
}

export function AssetDetails({ assetId, locale }: AssetDetailsProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const router = useRouter();
  const [asset, setAsset] = useState<AssetDetailsType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [showLicenseCarousel, setShowLicenseCarousel] = useState(false);
  const isRTL = direction.isRTL(locale);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = tokenStorage.getToken();
        console.log('Loading asset details for ID:', assetId);
        
        const assetData = await getAssetDetails(parseInt(assetId), token || undefined);
        console.log('Asset data received:', assetData);
        
        if (!assetData) {
          console.error('No asset data received from API');
          setError(t('ui.noAssetDataReceived'));
          setAsset(null);
          return;
        }
        
        // API now returns asset data directly
        if (!assetData.id) {
          console.error('Invalid asset data structure');
          setError(t('ui.invalidAssetDataStructure'));
          setAsset(null);
          return;
        }
        
        // Convert new API format to expected format
        const convertedAsset: AssetDetailsType = {
          id: assetData.id,
          title: assetData.name,
          description: assetData.description,
          long_description: assetData.long_description,
          thumbnail_url: assetData.thumbnail_url,
          category: assetData.category as 'mushaf' | 'tafsir' | 'recitation',
          license: {
            code: assetData.license.toLowerCase().replace(/\s+/g, '-'),
            name: assetData.license,
            short_name: assetData.license,
            url: '',
            icon_url: '',
            summary: '',
            full_text: '',
            legal_code_url: '',
            license_terms: [],
            permissions: [],
            conditions: [],
            limitations: [],
            usage_count: 0,
            is_default: false,
          },
          snapshots: assetData.snapshots.map(snapshot => ({
            thumbnail_url: snapshot.image_url,
            title: snapshot.title,
            description: snapshot.description,
          })),
          publisher: {
            id: assetData.publisher.id,
            name: assetData.publisher.name,
            thumbnail_url: '',
            bio: assetData.publisher.description,
            verified: false,
          },
          resource: {
            id: assetData.resource.id,
            title: `Resource ${assetData.resource.id}`,
            description: 'Resource description not available',
          },
          technical_details: {
            file_size: 'Unknown',
            format: 'Unknown',
            encoding: 'Unknown',
            version: 'Unknown',
            language: 'Unknown',
          },
          stats: {
            download_count: 0,
            view_count: 0,
            created_at: '',
            updated_at: '',
          },
          access: {
            has_access: false, // Should be checked separately
            requires_approval: false,
          },
          related_assets: [],
        };
        
        setAsset(convertedAsset);
        console.log('Asset set successfully:', assetData);
      } catch (err) {
        console.error('Error loading asset details:', err);
        setError(err instanceof Error ? err.message : t('ui.assetNotFound'));
        setAsset(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [assetId, t]);



  const handleDownloadClick = () => {
    // Check if user is authenticated
    if (!user) {
      // Navigate to login if not authenticated, but preserve the current page in the URL for potential return
      router.push(
        `/${locale}/auth/login?returnTo=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }
    setShowAccessRequest(true);
  };


  const handleDownload = async () => {
    if (!asset) return;
    
    try {
      const token = tokenStorage.getToken();
      if (!token) {
        throw new Error(t('ui.unauthorized'));
      }

      const blob = await downloadAsset(asset.id, token);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setShowLicenseCarousel(false);
    } catch (err) {
      console.error('Error downloading asset:', err);
      setError(err instanceof Error ? err.message : t('ui.downloadFailed'));
    }
  };

  const handleDownloadOriginalResourceClick = () => {
    // Check if user is authenticated
    if (!user) {
      // Navigate to login if not authenticated, but preserve the current page in the URL for potential return
      router.push(
        `/${locale}/auth/login?returnTo=${encodeURIComponent(
          window.location.pathname
        )}`
      );
      return;
    }
    handleDownloadOriginalResource();
  };

  const handleDownloadOriginalResource = async () => {
    if (!asset || !asset.resource) return;

    try {
      const token = tokenStorage.getToken();
      if (!token) {
        throw new Error(t('ui.unauthorized'));
      }

      const blob = await downloadOriginalResource(asset.resource.id, token);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${asset.resource.title}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error downloading original resource:', err);
      setError(err instanceof Error ? err.message : t('ui.downloadFailed'));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">{t('ui.loadingAssetDetails')}</p>
          <p className="text-sm text-muted-foreground">Loading asset ID: {assetId}</p>
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-xl font-semibold text-foreground">
            {t('ui.assetNotFound')}
          </h2>
          <p className="text-muted-foreground">
            {error || 'Asset data is missing'}
          </p>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Asset ID: {assetId}
            </p>
            <p className="text-sm text-muted-foreground">
              Error: {error || 'No asset data'}
            </p>
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            {t('ui.tryAgain')}
          </Button>
        </div>
      </div>
    );
  }

  const getLicenseColor = (licenseCode: string): 'green' | 'yellow' | 'red' => {
    if (licenseCode === 'cc0' || licenseCode === 'cc-by') return 'green';
    if (licenseCode === 'cc-by-sa' || licenseCode === 'cc-by-nd' || licenseCode === 'cc-by-nc') return 'yellow';
    return 'red';
  };

  const getAssetType = (category: string): string => {
    switch (category) {
      case 'mushaf': return 'Mushaf';
      case 'tafsir': return 'Tafsir';
      case 'recitation': return 'Recitation';
      default: return category;
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: t('navigation.home'), href: `/${locale}` },
            { label: t('navigation.store'), href: `/${locale}/store` },
            { label: asset.title, isCurrentPage: true },
          ]}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content - Left Side */}
        <div className="flex-1 space-y-6">
          {/* Asset Header with Title and Category Badge */}
          <div className="space-y-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold text-foreground">
                {asset.title}
              </h1>
              <Badge
                variant="outline"
                className="flex items-center gap-2 px-3 py-1 bg-white"
              >
                <Languages size={24} />
                <span>{getAssetType(asset.category)}</span>
              </Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-base">
              {asset.description}
            </p>
          </div>

          {/* Content Preview Section */}
          <Card className="bg-transparent shadow-none mt-8 ps-10 md:ps-0">
            <CardHeader className="p-0 w-[calc(100%-40px)] max-w-full">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ScanEye className="h-5 w-5" />
                {t('ui.contentPreview')}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <Carousel className="w-full" isRTL={isRTL}>
                  <CarouselContent>
                    {(Array.isArray(asset.snapshots) && asset.snapshots.length > 0) 
                      ? asset.snapshots.map((snapshot, index) => (
                        <CarouselItem key={index}>
                        <div className="flex">
                          <div className="w-full max-w-[calc(100%-40px)]  h-[500px] bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {snapshot.thumbnail_url ? (
                              <>
                                <Image
                                  src={`${env.NEXT_PUBLIC_BACKEND_URL}${snapshot.thumbnail_url}`}
                                  alt={snapshot.title || `Snapshot ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
                                  onClick={() => window.open(`${env.NEXT_PUBLIC_BACKEND_URL}${snapshot.thumbnail_url}`, '_blank')}
                                  onError={(e) => {
                                    // Fallback to placeholder if image fails to load
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                {/* Fallback placeholder (hidden by default) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60 hidden items-center justify-center">
                                  <div className="text-muted-foreground text-center p-4">
                                    <FileTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">{snapshot.title}</p>
                                  </div>
                                </div>
                              </>
                            ) : (
                              /* Image placeholder with diagonal stripes for snapshots without thumbnail_url */
                              <>
                                <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60"></div>
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    backgroundImage: `repeating-linear-gradient(
                                    45deg,
                                    transparent,
                                    transparent 10px,
                                    rgba(255,255,255,0.1) 10px,
                                    rgba(255,255,255,0.1) 20px
                                  )`,
                                  }}
                                ></div>
                                <div className="relative z-10 text-muted-foreground text-center p-4">
                                  <FileTextIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">{snapshot.title}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </CarouselItem>
                    ))
                      : (
                        <CarouselItem>
                          <div className="flex justify-center">
                            <div className="w-full max-w-md h-48 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60"></div>
                              <div className="relative z-10 text-muted-foreground text-center p-4">
                                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No preview available</p>
                              </div>
                            </div>
                          </div>
                        </CarouselItem>
                      )}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
          {/* Resource Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SquareDashedMousePointer size={24} />
                {t('ui.resourceActions')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col gap-1">
              <Link href={`/${locale}/documentation/standards`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer bg-neutral-100 hover:bg-neutral-200"
                >
                  <FileText className="h-4 w-4 ms-2" />
                  {t('ui.usageStandards')}
                </Button>
              </Link>

              <Link href={`/${locale}/license/${asset.license.code}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer bg-neutral-100 hover:bg-neutral-200"
                >
                  <FileText className="h-4 w-4 ms-2" />
                  {t('store.viewLicense')}
                </Button>
              </Link>

              <Button
                onClick={handleDownloadOriginalResourceClick}
                variant="outline"
                size="lg"
                className="w-full justify-center cursor-pointer mt-2"
                disabled={!asset.resource?.id}
              >
                {t('ui.downloadOriginalResource')}
                <CloudDownload className="h-4 w-4 ms-2" />
              </Button>

              <Button
                onClick={handleDownloadClick}
                size="lg"
                className="w-full justify-center bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
              >
                {t('ui.downloadResource')}
                <CloudDownload className="h-4 w-4 ms-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Publisher Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen size={24} />
                {t('ui.publisherLabel')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/publisher/${asset.publisher.id}`}
                className="text-muted-foreground hover:underline hover:text-primary text-base cursor-pointer"
              >
                {asset.publisher.name}
              </Link>
              {asset.publisher.bio && (
                <p className="text-sm text-muted-foreground mt-2">
                  {asset.publisher.bio}
                </p>
              )}
            </CardContent>
          </Card>

          {/* License Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ScrollText size={24} />
                {t('ui.licenseInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-base">{asset.license.name}</p>

              <Badge
                variant="outline"
                className={cn(
                  "text-xs border-0 text-white h-6 px-2 w-fit",
                  getLicenseColor(asset.license.code) === 'green' && "bg-emerald-500",
                  getLicenseColor(asset.license.code) === 'yellow' && "bg-amber-500",
                  getLicenseColor(asset.license.code) === 'red' && "bg-red-500"
                )}
              >
                {asset.license.code.toUpperCase().replace("-", " ")}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Access Request Dialog */}
      <Dialog open={showAccessRequest} onOpenChange={setShowAccessRequest}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('ui.accessRequestTitle')}</DialogTitle>
          </DialogHeader>
          <AccessRequestForm
            assetId={asset.id}
            assetTitle={asset.title}
            onSuccess={() => {
              setShowAccessRequest(false);
              setShowLicenseCarousel(true);
            }}
            onCancel={() => setShowAccessRequest(false)}
          />
        </DialogContent>
      </Dialog>

      {/* License Carousel Dialog */}
      <Dialog open={showLicenseCarousel} onOpenChange={setShowLicenseCarousel}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('ui.licenseTermsTitle')}</DialogTitle>
          </DialogHeader>
          <LicenseCarousel
            assetTitle={asset.title}
            license={asset.license.code}
            onAccept={handleDownload}
            onCancel={() => setShowLicenseCarousel(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
