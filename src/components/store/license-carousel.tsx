"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { logical } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import type { Dictionary } from '@/lib/i18n/types';

interface LicenseCarouselProps {
  assetTitle: string;
  license: string;
  onAccept: () => void;
  onCancel: () => void;
  dict: Dictionary;
}



export function LicenseCarousel({ assetTitle, license, onAccept, onCancel, dict }: LicenseCarouselProps) {
  // Build license content from dictionary
  const licenseContent = `${dict.licenseContent.section1Title}

${dict.licenseContent.section1Content}

${dict.licenseContent.termsAndConditions}
${dict.licenseContent.term1}
${dict.licenseContent.term2}
${dict.licenseContent.term3}

${dict.licenseContent.violation}

${dict.licenseContent.section2Title}

${dict.licenseContent.section2Content}

${dict.licenseContent.responsibilities}
${dict.licenseContent.responsibility1}
${dict.licenseContent.responsibility2}
${dict.licenseContent.responsibility3}

${dict.licenseContent.obligations}
${dict.licenseContent.obligation1}
${dict.licenseContent.obligation2}
${dict.licenseContent.obligation3}

${dict.licenseContent.section3Title}

${dict.licenseContent.section3Content}

${dict.ui.limitedWarranties}
${dict.ui.resourceAsIs}
${dict.ui.publisherNotLiable}

${dict.licenseContent.disputeResolution}
${dict.licenseContent.dispute1}
${dict.licenseContent.dispute2}
${dict.licenseContent.dispute3}

${dict.licenseContent.section4Title}

${dict.licenseContent.section4Content}`;

  const [canAccept, setCanAccept] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    // If user has already scrolled to end once, keep button enabled
    if (hasScrolledToEnd) {
      return;
    }

    const element = scrollRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const scrolledToEnd = scrollTop + clientHeight >= scrollHeight - 10; // 10px tolerance
      
      if (scrolledToEnd) {
        setHasScrolledToEnd(true);
        setCanAccept(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">{dict.ui.licenseReview}</h3>
        <p className="text-sm text-muted-foreground">
          {assetTitle} - {dict.ui.licenseText} {license}
        </p>
      </div>

      {/* Single Text Area with Vertical Scroll */}
      <Card className="h-[400px]">
        <CardContent className="p-6 h-full flex flex-col">
          <div 
            ref={scrollRef}
            className={cn(
              "flex-1 overflow-y-auto leading-relaxed text-muted-foreground",
              logical.textStart
            )}
            onScroll={handleScroll}
          >
            <div className="whitespace-pre-line">
              {licenseContent}
            </div>
          </div>

          {!hasScrolledToEnd && (
            <div className="text-center mt-4">
              <p className="text-sm text-amber-600">
                {dict.ui.pleaseReadFullContent}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          {dict.cancel}
        </Button>
        <Button 
          onClick={onAccept}
          disabled={!canAccept}
          className={cn(!canAccept && "opacity-50 cursor-not-allowed")}
        >
          {dict.confirm}
        </Button>
      </div>
    </div>
  );
}
