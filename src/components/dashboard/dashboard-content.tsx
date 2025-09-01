"use client";

import Link from 'next/link';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { logical, typography } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface DashboardContentProps {
  dict: Dictionary;
  locale: Locale;
}

export function DashboardContent({ dict, locale }: DashboardContentProps) {
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
              {dict.ui.dashboard}
            </h1>
            <p className="text-muted-foreground mt-2">
              {dict.ui.welcomeUser.replace('{{name}}', `${user.firstName} ${user.lastName}`)}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            {dict.ui.logout}
          </Button>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className={typography.heading}>
                {dict.ui.accountInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{dict.auth.email}:</strong> {user.email}
              </div>
              <div>
                <strong>{dict.auth.firstName}:</strong> {user.firstName}
              </div>
              <div>
                <strong>{dict.auth.lastName}:</strong> {user.lastName}
              </div>
              {user.jobTitle && (
                <div>
                  <strong>{dict.auth.jobTitle}:</strong> {user.jobTitle}
                </div>
              )}
              {user.phoneNumber && (
                <div>
                  <strong>{dict.auth.phoneNumber}:</strong> {user.phoneNumber}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className={typography.heading}>
                {dict.ui.accountStatus}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <strong>{dict.ui.accountType}:</strong>{' '}
                {user.provider === 'email' 
                  ? dict.ui.emailAccount
                  : user.provider === 'google'
                  ? 'Google'
                  : 'GitHub'
                }
              </div>
              <div>
                <strong>{dict.ui.profileStatus}:</strong>{' '}
                <span className={user.profileCompleted ? 'text-green-600' : 'text-orange-600'}>
                  {user.profileCompleted 
                    ? dict.ui.complete
                    : dict.ui.incomplete
                  }
                </span>
              </div>
              <div>
                <strong>{dict.ui.memberSince}:</strong>{' '}
                {new Date().toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card>
          <CardHeader>
            <CardTitle className={typography.heading}>
              {dict.ui.welcomeToPlatform}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={cn(typography.paragraph, "text-muted-foreground")}>
              {dict.ui.loginSuccessMessage}
            </p>
            
            <div className="mt-6 flex flex-wrap gap-4">
              <Button asChild>
                <Link href={`/${locale}/store`}>
                  {dict.ui.assetStore}
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/${locale}/documentation/standards`}>
                  {dict.ui.usageStandardsLink}
                </Link>
              </Button>
              <Button variant="outline">
                {dict.ui.academy}
              </Button>
              <Button variant="outline">
                {dict.ui.projects}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
