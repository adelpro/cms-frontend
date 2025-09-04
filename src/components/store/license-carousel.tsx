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
License Agreement for ${assetTitle}

License Type: ${license.toUpperCase()}

TERMS AND CONDITIONS

1. GRANT OF LICENSE
By downloading this resource, you agree to comply with the terms of the ${license} license.

2. PERMITTED USES
- You may use this resource for personal and commercial projects
- You may modify and adapt the resource for your needs
- You must provide appropriate attribution when required

3. RESTRICTIONS
- You may not redistribute the original files without permission
- You may not claim ownership of the original work
- Commercial use may require additional permissions

4. WARRANTIES AND LIABILITY
This resource is provided "as is" without warranties of any kind.
The publisher is not liable for any damages arising from use of this resource.

5. TERMINATION
This license terminates automatically if you violate any terms.
Upon termination, you must cease all use and delete all copies.

By clicking "Accept", you acknowledge that you have read and agree to these terms.
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