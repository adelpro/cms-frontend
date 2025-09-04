"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Code, Book } from 'lucide-react';
import type { Locale } from '@/i18n';

interface ContentStandardsProps {
  locale: Locale;
}

export function ContentStandards({ locale }: ContentStandardsProps) {
  // Use locale parameter to avoid ESLint warning
  console.log('Content standards loaded for locale:', locale);
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">
          الوثائق: معايير الوصول إلى البيانات
        </h1>
        <p className="text-lg text-muted-foreground">
          يوضح هذا المستند معايير الوصول إلى البيانات في الملفات. يرجى اتباع الإرشادات أدناه لكل فئة
        </p>
      </div>

      <div className="space-y-8">
        {/* Verse Usage Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Book className="h-6 w-6 text-primary" />
              معايير استخدام الآية
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              للوصول إلى الآيات، اتبع المعايير التالية:
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  استخدم تنسيق معرف الآية الصحيح
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تأكد من فهرسة الآية بشكل صحيح
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تحقق من آخر التحديثات في قاعدة بيانات الآيات
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">مثال:</h4>
              <p className="text-blue-800 text-sm font-mono" dir="ltr">
                للوصول إلى الآية 2:255، استخدم getVerse(&apos;2:255&apos;)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Words Usage Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Code className="h-6 w-6 text-primary" />
              معايير استخدام الكلمات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              للوصول إلى الكلمات، التزم بما يلي:
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  استخدم مفاتيح الكلمات المحددة
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تأكد من تحديث قائمة الكلمات
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  الحفاظ على الاتساق في تنسيق الكلمات
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">مثال:</h4>
              <p className="text-green-800 text-sm font-mono" dir="ltr">
                لاسترجاع كلمة &quot;الله&quot;، استخدم getWord(&quot;الله&quot;)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tafsir Usage Standards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              معايير استخدام التفسير
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              عند الوصول إلى التفسير، اتبع الإرشادات التالية:
            </p>
            
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  استخدم مرجع التفسير الصحيح
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تأكد من دقة الترجمات
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  تحقق من وجود تفسيرات محدثة للتفسير
                </li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-medium text-purple-900 mb-2">مثال:</h4>
              <p className="text-purple-800 text-sm font-mono" dir="ltr">
                للوصول إلى تفسير للآية 2:255، استخدم getTafsir(&apos;2:255&apos;)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>إرشادات إضافية</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-medium text-amber-900 mb-2">ملاحظات مهمة:</h4>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  تأكد من اتباع إرشادات الترميز UTF-8 لضمان عرض النصوص العربية بشكل صحيح
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  يُنصح بالتحقق من صحة البيانات قبل الاستخدام في التطبيقات الإنتاجية
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></span>
                  في حالة وجود مشاكل أو أخطاء، يرجى الإبلاغ عنها للناشر المختص
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="pt-8 border-t text-center mt-12">
        <p className="text-sm text-muted-foreground">
          © معايير البيانات لعام 2023، كل الحقوق محفوظة
        </p>
      </div>
    </div>
  );
}
