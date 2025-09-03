"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Download,
  FileText,
  Eye,
  BookOpen,
  FileText as FileTextIcon,
  MousePointer,
  CloudDownload,
  ScrollText,
  SquareDashedMousePointer,
  Languages,
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
import type { Dictionary, Locale } from "@/lib/i18n/types";
import { direction } from "@/lib/styles/logical";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";

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
  contentPreviewImages: string[];
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
  const isRTL = direction.isRTL(locale);

  useEffect(() => {
    // Mock asset data
    const mockAsset: AssetDetailsType = {
      id: assetId,
      title: dict.mockData.assetTitle,
      description: dict.mockData.assetDescription,
      license: "cc-by",
      publisher: dict.mockData.assetPublisher,
      publisherId: "publisher-1",
      category: "Translation",
      contentPreview: dict.mockData.assetContentPreview,
      contentPreviewImages: dict.mockData.contentPreviewImages,
    };
    setAsset(mockAsset);
  }, [
    assetId,
    dict.mockData.assetTitle,
    dict.mockData.assetDescription,
    dict.mockData.assetPublisher,
    dict.mockData.assetContentPreview,
    dict.mockData.contentPreviewImages,
  ]);

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
            { label: asset.title, isCurrentPage: true },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Header with Title and Category Badge */}
          <div className="space-y-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-5xl font-bold text-foreground">
                {asset.title}
              </h1>
              <Badge
                variant="outline"
                className="flex items-center gap-2 px-3 py-1"
              >
                <Languages size={24} />
                <span>{asset.category}</span>
              </Badge>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-base">
              {asset.description}
            </p>
          </div>

          {/* Content Preview Section */}
          <Card className="bg-transparent shadow-none mt-8">
            <CardHeader className="p-0">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5" />
                {dict.ui.contentPreview}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <Carousel className="w-full">
                  <CarouselContent>
                    {asset.contentPreviewImages.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="flex justify-center">
                          <div className="w-full max-w-md h-48 bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {/* Mock image placeholder with diagonal stripes */}
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
                              <p className="text-sm">Preview {index + 1}</p>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious
                    className={cn(
                      "absolute left-2 top-1/2 transform -translate-y-1/2",
                      isRTL && "left-auto right-2"
                    )}
                  />
                  <CarouselNext
                    className={cn(
                      "absolute right-2 top-1/2 transform -translate-y-1/2",
                      isRTL && "right-auto left-2"
                    )}
                  />
                </Carousel>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6 max-w-[300px]">
          {/* Resource Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <SquareDashedMousePointer size={24} />
                {dict.ui.resourceActions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 flex flex-col gap-1">
              <Link href={`/${locale}/documentation/standards`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer bg-neutral-100 hover:bg-neutral-200"
                >
                  <FileText className="h-4 w-4 ml-2" />
                  {dict.ui.usageStandards}
                </Button>
              </Link>

              <Link href={`/${locale}/license/${asset.id}`}>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer bg-neutral-100 hover:bg-neutral-200"
                >
                  <FileText className="h-4 w-4 ml-2" />
                  {dict.store.viewLicense}
                </Button>
              </Link>

              <Button
                onClick={handleDownloadClick}
                size="lg"
                className="mt-2 w-full justify-center bg-primary-600 hover:bg-primary-700 text-white cursor-pointer"
              >
                {dict.ui.downloadResource}
                <CloudDownload className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Publisher Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen size={24} />
                {dict.ui.publisherLabel}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/${locale}/publisher/${asset.publisherId}`}
                className="text-muted-foreground hover:underline hover:text-primary text-base cursor-pointer"
              >
                {asset.publisher}
              </Link>
            </CardContent>
          </Card>

          {/* License Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ScrollText size={24} />
                {dict.ui.licenseInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-base">{dict.licenses.cc0}</p>

              <Badge
                variant="outline"
                className={cn(
                  "text-xs border-0 text-white h-6 px-2 w-fit",
                  (asset.license === "cc-by" || asset.license === "cc0") &&
                    "bg-emerald-500",
                  (asset.license === "cc-by-sa" ||
                    asset.license === "cc-by-nd" ||
                    asset.license === "cc-by-nc") &&
                    "bg-amber-500",
                  (asset.license === "cc-by-nc-sa" ||
                    asset.license === "cc-by-nc-nd") &&
                    "bg-red-500"
                )}
              >
                {asset.license.toUpperCase().replace("-", " ")}
              </Badge>
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
              window.open("/mock-download.pdf", "_blank");
            }}
            onCancel={() => setShowLicenseCarousel(false)}
            dict={dict}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
