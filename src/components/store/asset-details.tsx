"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Download, FileText, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AccessRequestForm } from './access-request-form';
import { LicenseCarousel } from './license-carousel';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { spacing } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/auth-provider';

interface AssetDetailsType {
  id: string;
  title: string;
  description: string;
  license: string;
  publisher: string;
  publisherId: string;
  category: string;
  icon?: string;
  originalVersion?: string;
  contentPreview: string;
}

interface AssetDetailsProps {
  assetId: string;
  dict: Dictionary;
  locale: Locale;
}

export function AssetDetails({ assetId, dict, locale }: AssetDetailsProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [asset, setAsset] = useState<AssetDetailsType | null>(null);
  const [showAccessRequest, setShowAccessRequest] = useState(false);
  const [showLicenseCarousel, setShowLicenseCarousel] = useState(false);

  useEffect(() => {
    // Mock asset data
    const mockAsset: AssetDetailsType = {
      id: assetId,
      title: dict.mockData.assetTitle,
      description: dict.mockData.assetDescription,
      license: 'CC BY',
      publisher: dict.mockData.assetPublisher,
      publisherId: 'publisher-1',
      category: 'Translation',
      contentPreview: dict.mockData.assetContentPreview
    };
    setAsset(mockAsset);
  }, [assetId, dict.mockData.assetTitle, dict.mockData.assetDescription, dict.mockData.assetPublisher, dict.mockData.assetContentPreview]);

  const handleDownloadClick = () => {
    // Check if user is authenticated
    if (!user) {
      // Navigate to login if not authenticated, but preserve the current page in the URL for potential return
      router.push(`/${locale}/auth/login?returnTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setShowAccessRequest(true);
  };

  const handleAccessRequestSubmit = () => {
    setShowAccessRequest(false);
    setShowLicenseCarousel(true);
  };

  if (!asset) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">{dict.ui.loadingData}</div>
      </div>
    );
  }

  return (
    <div className="max-width-container px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: dict.header.home, href: `/${locale}` },
            { label: dict.header.store, href: `/${locale}/store` },
            { label: asset.title, isCurrentPage: true }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">{asset.title}</CardTitle>
                  <div className={cn("flex items-center", spacing.gapSm)}>
                    <span className="text-muted-foreground">{dict.ui.publisherLabel}</span>
                    <Link 
                      href={`/${locale}/publisher/${asset.publisherId}`}
                      className="text-primary hover:underline"
                    >
                      {asset.publisher}
                    </Link>
                  </div>
                  <Badge variant="outline">{asset.category}</Badge>
                </div>
                {asset.icon && (
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{dict.ui.extendedDescription}</h3>
                <p className="text-muted-foreground leading-relaxed">{asset.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Content Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {dict.ui.contentPreview}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6 text-center">
                <p className="text-muted-foreground">{asset.contentPreview}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{dict.ui.resourceActions}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/${locale}/documentation/standards`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 ml-2" />
                  {dict.ui.usageStandards}
                </Button>
              </Link>
              
              <Link href={`/${locale}/license/${asset.id}`}>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 ml-2" />
                  {dict.store.viewLicense}
                </Button>
              </Link>

              <Button 
                onClick={handleDownloadClick}
                className="w-full justify-start"
              >
                <Download className="h-4 w-4 ml-2" />
                {dict.ui.downloadResource}
              </Button>

              {asset.originalVersion && (
                <Button variant="outline" className="w-full justify-start">
                  <ArrowLeft className="h-4 w-4 ml-2" />
                  {dict.ui.originalResourceVersion}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* License Info */}
          <Card>
            <CardHeader>
              <CardTitle>{dict.ui.licenseInfo}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="text-sm">{asset.license}</Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Access Request Dialog */}
      <Dialog open={showAccessRequest} onOpenChange={setShowAccessRequest}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dict.ui.accessRequestTitle}</DialogTitle>
          </DialogHeader>
          <AccessRequestForm 
            assetTitle={asset.title}
            onSubmit={handleAccessRequestSubmit}
            onCancel={() => setShowAccessRequest(false)}
            dict={dict}
          />
        </DialogContent>
      </Dialog>

      {/* License Carousel Dialog */}
      <Dialog open={showLicenseCarousel} onOpenChange={setShowLicenseCarousel}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{dict.ui.licenseTermsTitle}</DialogTitle>
          </DialogHeader>
          <LicenseCarousel 
            assetTitle={asset.title}
            license={asset.license}
            onAccept={() => {
              setShowLicenseCarousel(false);
              // Handle download logic here
              window.open('/mock-download.pdf', '_blank');
            }}
            onCancel={() => setShowLicenseCarousel(false)}
            dict={dict}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
