"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

interface LicenseCarouselProps {
  assetTitle: string;
  license: string;
  onAccept: () => void;
  onCancel: () => void;
}

export function LicenseCarousel({ assetTitle, license, onAccept, onCancel }: LicenseCarouselProps) {
  const t = useTranslations();
  const [hasReadToEnd, setHasReadToEnd] = useState(false);
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    if (isAtBottom && !hasReadToEnd) {
      setHasReadToEnd(true);
    }
  };

  const licenseContent = `
${t('license.agreementFor')} ${assetTitle}

${t('license.licenseType')}: ${license.toUpperCase()}

${t('license.termsAndConditions')}

1. ${t('license.grantOfLicense')}
${t('license.grantOfLicenseText', { license })}

2. ${t('license.permittedUses')}
- ${t('license.personalCommercialUse')}
- ${t('license.modifyAdapt')}
- ${t('license.provideAttribution')}

3. ${t('license.restrictions')}
- ${t('license.noRedistribution')}
- ${t('license.noOwnershipClaim')}
- ${t('license.commercialPermissions')}

4. ${t('license.warrantiesLiability')}
${t('license.asIsWarranty')}
${t('license.noLiability')}

5. ${t('license.termination')}
${t('license.terminationText')}
${t('license.terminationAction')}

${t('license.acceptanceText')}
  `;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <h3 className="text-xl font-medium mb-2">{t('ui.licenseTermsTitle')}</h3>
        <p className="text-sm text-muted-foreground">
          {assetTitle} - {license.toUpperCase()} {t('ui.licenseInfo')}
        </p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-0">
          <div 
            className="h-96 overflow-y-auto p-6 text-sm leading-relaxed text-start"
            onScroll={handleScroll}
          >
            <pre className="whitespace-pre-wrap font-sans">{licenseContent}</pre>
          </div>
          
          {!hasReadToEnd && (
            <div className="text-center py-3 bg-muted/50 text-sm text-muted-foreground">
              {t('ui.pleaseReadFullContent')}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="flex-1"
        >
          {t('common.cancel')}
        </Button>
        <Button 
          type="button"
          onClick={onAccept}
          disabled={!hasReadToEnd}
          className="flex-1 bg-primary hover:bg-primary/90"
        >
          {t('common.confirm')}
        </Button>
      </div>
    </div>
  );
}