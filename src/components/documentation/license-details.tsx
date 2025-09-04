"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Info } from 'lucide-react';
import type { Locale } from '@/i18n';
import { cn } from '@/lib/utils';

interface LicenseDetailsProps {
  licenseId?: string;
  locale: Locale;
}

export function LicenseDetails({ licenseId, locale }: LicenseDetailsProps) {
  // Mock license data
  const license = {
    id: licenseId || 'cc-by',
    name: 'CC BY',
    fullName: 'Creative Commons Attribution 4.0 International',
    description: 'هذه الرخصة تسمح للآخرين بتوزيع ومزج وتعديل والبناء على عملك، حتى تجارياً، طالما أنهم ينسبون العمل الأصلي إليك.',
    permissions: [
      'الاستخدام التجاري',
      'التوزيع',
      'التعديل',
      'الاستخدام الخاص'
    ],
    conditions: [
      'ذكر المصدر',
      'الإشارة إلى التغييرات'
    ],
    limitations: [
      'المسؤولية',
      'الضمان'
    ],
    color: 'green' as 'green' | 'yellow' | 'red',
    officialUrl: 'https://creativecommons.org/licenses/by/4.0/'
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link 
          href={`/${locale}/store`}
          className="flex items-center text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4 ml-2" />
          العودة إلى المتجر
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Badge 
            variant="outline" 
            className={cn("text-lg px-4 py-2", {
              'border-green-500 text-green-700 bg-green-50': license.color === 'green',
              'border-yellow-500 text-yellow-700 bg-yellow-50': license.color === 'yellow',
              'border-red-500 text-red-700 bg-red-50': license.color === 'red'
            })}
          >
            {license.name}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-4">
          {license.fullName}
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {license.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              يُسمح بـ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {license.permissions.map((permission, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{permission}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              الشروط
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {license.conditions.map((condition, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">{condition}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              القيود
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {license.limitations.map((limitation, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            تفاصيل إضافية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">ملخص الرخصة</h3>
            <p className="text-muted-foreground leading-relaxed">
              رخصة Creative Commons Attribution 4.0 International هي واحدة من أكثر الرخص المفتوحة انتشاراً. 
              تسمح للمستخدمين بحرية كاملة في استخدام المحتوى بما في ذلك الاستخدام التجاري، 
              مع شرط وحيد وهو ذكر المؤلف الأصلي. هذه الرخصة مثالية للمشاريع التي تريد أقصى قدر من الانتشار والاستخدام.
            </p>
          </div>

          <div>
            <h3 className="font-medium mb-3">كيفية الإسناد</h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm font-mono" dir="ltr">
                &quot;العنوان&quot; by المؤلف مرخص تحت رخصة CC BY 4.0
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                يجب تضمين رابط إلى الرخصة ورابط إلى المصدر الأصلي
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">استخدامات شائعة</h3>
            <ul className="text-muted-foreground text-sm space-y-1">
              <li>• المحتوى التعليمي والأكاديمي</li>
              <li>• الترجمات والمحتوى المرجعي</li>
              <li>• البيانات والمجموعات المفتوحة</li>
              <li>• المشاريع التقنية مفتوحة المصدر</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center mt-6">
        <Button asChild>
          <a 
            href={license.officialUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            عرض النص القانونی الكامل
          </a>
        </Button>
        
        <Button variant="outline" asChild>
          <Link href={`/${locale}/documentation/standards`}>
            معايير الاستخدام
          </Link>
        </Button>
      </div>
    </div>
  );
}
