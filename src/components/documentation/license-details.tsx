'use client';

import React from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { ArrowLeft, ExternalLink, Info, RefreshCw, AlertCircle } from 'lucide-react';
import type { Locale } from '@/i18n';
// import { cn } from '@/lib/utils';
// import { getLicenseDetails, type ApiLicenseDetails } from '@/lib/api/assets';
// import { tokenStorage } from '@/lib/auth';
import { useTranslations } from 'next-intl';
import { getLicense } from '@/lib/licenses';

interface LicenseDetailsProps {
  licenseId?: string;
  locale: Locale;
}

export function LicenseDetails({ licenseId, locale }: LicenseDetailsProps) {
  const t = useTranslations();

  // Get license data from static data
  const license = getLicense(licenseId || 'CC0');

  // const [license, setLicense] = useState<ApiLicenseDetails | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string>('');

  // useEffect(() => {
  //   const fetchLicenseData = async () => {
  //     setIsLoading(true);
  //     setError('');

  //     try {
  //       const token = tokenStorage.getToken();
  //       const licenseData = await getLicenseDetails(licenseId || 'cc-by', token || undefined);
  //       setLicense(licenseData);
  //     } catch (err) {
  //       console.error('Error fetching license data:', err);
  //       setError(err instanceof Error ? err.message : t('ui.licenseNotFound'));
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchLicenseData();
  // }, [licenseId, t]);

  // // Helper function to determine license color based on code
  // const getLicenseColor = (code: string): 'green' | 'yellow' | 'red' => {
  //   const greenLicenses = ['cc0', 'cc-by-4.0'];
  //   const yellowLicenses = ['cc-by-sa-4.0', 'cc-by-nd-4.0', 'cc-by-nc-4.0'];
  //   const redLicenses = ['cc-by-nc-sa-4.0', 'cc-by-nc-nd-4.0'];

  //   if (greenLicenses.includes(code)) return 'green';
  //   if (yellowLicenses.includes(code)) return 'yellow';
  //   if (redLicenses.includes(code)) return 'red';
  //   return 'green'; // default
  // };

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto max-w-4xl px-4 py-8">
  //       <div className="text-center space-y-4">
  //         <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
  //         <p className="text-muted-foreground">{t('common.loading')}</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="container mx-auto max-w-4xl px-4 py-8">
  //       <div className="text-center space-y-4">
  //         <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
  //         <h2 className="text-xl font-semibold text-foreground">
  //           {t('ui.licenseNotFound')}
  //         </h2>
  //         <p className="text-muted-foreground">{error}</p>
  //         <Button onClick={() => window.location.reload()} variant="outline">
  //           {t('ui.tryAgain')}
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  if (!license) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-4 text-center">
          <h2 className="text-foreground text-xl font-semibold">{t('ui.licenseNotFound')}</h2>
          <p className="text-muted-foreground">{t('ui.licenseNotFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href={`/${locale}/store`}
          className="text-muted-foreground hover:text-primary flex items-center transition-colors"
        >
          <ArrowLeft className="ms-2 h-4 w-4" />
          {t('ui.backToStore')}
        </Link>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-center">
        {/* Big heading (license code capitalized) */}
        <h1 className="text-4xl font-bold uppercase">{license.code}</h1>

        {/* License name based on language */}
        <h2 className="text-muted-foreground text-2xl font-semibold">{license.name[locale]}</h2>

        {/* Button link to deed */}
        <div className="pt-4">
          <Button asChild size="lg">
            <a
              href={license.deedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-5 w-5" />
              {t('ui.viewLicenseDeed')}
            </a>
          </Button>
        </div>
      </div>

      {/* Commented out old content */}
      {/* 
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge 
            variant="outline" 
            className={cn("text-lg px-4 py-2", {
              'border-green-500 text-green-700 bg-green-50': getLicenseColor(license.code) === 'green',
              'border-yellow-500 text-yellow-700 bg-yellow-50': getLicenseColor(license.code) === 'yellow',
              'border-red-500 text-red-700 bg-red-50': getLicenseColor(license.code) === 'red'
            })}
          >
            {license.short_name}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {license.name}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {license.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              {t('ui.permissions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {license.permissions.length > 0 ? (
              <ul className="space-y-3">
                {license.permissions.map((permission, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      {permission.label || permission.description || permission.key}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">{t('ui.noPermissions')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              {t('ui.conditions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {license.conditions.length > 0 ? (
              <ul className="space-y-3">
                {license.conditions.map((condition, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">
                      {JSON.stringify(condition)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">{t('ui.noConditions')}</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              {t('ui.limitations')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {license.limitations.length > 0 ? (
              <ul className="space-y-3">
                {license.limitations.map((limitation, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      {limitation.label || limitation.description || limitation.key}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">{t('ui.noLimitations')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {license.license_terms && license.license_terms.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('ui.licenseTerms')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {license.license_terms
                .sort((a, b) => a.order - b.order)
                .map((term, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium mb-2">{term.title}</h4>
                    <p className="text-muted-foreground text-sm">{term.description}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            {t('ui.additionalDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">{t('ui.licenseSummary')}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {license.full_text}
            </p>
          </div>

        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-6">
        <Button asChild>
          <a 
            href={license.legal_code_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            {t('ui.viewFullLegalText')}
          </a>
        </Button>
        
        <Button variant="outline" asChild>
          <a 
            href={license.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            {t('ui.viewLicensePage')}
          </a>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href={`/${locale}/documentation/standards`}>
            {t('ui.usageStandards')}
          </Link>
        </Button>
      </div>
      */}
    </div>
  );
}
