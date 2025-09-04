"use client";

import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Locale } from '@/i18n';
import { logical, typography } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface DashboardContentProps {
  locale: Locale;
}

export function DashboardContent({ locale }: DashboardContentProps) {
  const t = useTranslations();
  const { user, logout } = useAuth();

  if (!user) {
    return null; // This shouldn't happen due to route protection
  }

  return (
    <div className={cn("min-h-screen bg-background", logical.paddingInline('4'), "py-8")}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className={cn(typography.heading, "text-3xl font-bold")}>
              {t('dashboard.title')}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.welcomeUser', { name: `${user.firstName} ${user.lastName}` })}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            {t('auth.logout')}
          </Button>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={typography.heading}>
                {t('dashboard.accountInfo')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{t('auth.email')}:</strong> {user.email}
              </div>
              <div>
                <strong>{t('auth.firstName')}:</strong> {user.firstName}
              </div>
              <div>
                <strong>{t('auth.lastName')}:</strong> {user.lastName}
              </div>
              {user.jobTitle && (
                <div>
                  <strong>{t('auth.title')}:</strong> {user.jobTitle}
                </div>
              )}
              {user.phoneNumber && (
                <div>
                  <strong>{t('auth.phoneNumber')}:</strong> {user.phoneNumber}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={typography.heading}>
                {t('dashboard.accountStatus')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{t('dashboard.accountType')}:</strong>{' '}
                {user.provider === 'email' 
                  ? t('dashboard.emailAccount')
                  : user.provider === 'google'
                  ? 'Google'
                  : 'GitHub'
                }
              </div>
              <div>
                <strong>{t('dashboard.profileStatus')}:</strong>{' '}
                <span className={user.profileCompleted ? 'text-green-600' : 'text-orange-600'}>
                  {user.profileCompleted 
                    ? t('common.complete')
                    : t('common.incomplete')
                  }
                </span>
              </div>
              <div>
                <strong>{t('dashboard.memberSince')}:</strong>{' '}
                {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle className={typography.heading}>
              {t('dashboard.welcomeToPlatform')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(typography.paragraph, "text-muted-foreground")}>
              {t('dashboard.loginSuccessMessage')}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/${locale}/store`}>
                  {t('store.title')}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/documentation/standards`}>
                  {t('documentation.standards')}
                </Link>
              </Button>
              <Button variant="outline">
                {t('dashboard.academy')}
              </Button>
              <Button variant="outline">
                {t('dashboard.projects')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
