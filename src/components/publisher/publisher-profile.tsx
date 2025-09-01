"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Building2, Globe, ArrowLeft } from 'lucide-react';
import type { Dictionary, Locale } from '@/lib/i18n/types';
import { logical, spacing } from '@/lib/styles/logical';
import { cn } from '@/lib/utils';

interface Publisher {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  website?: string;
  email?: string;
  joinDate: string;
}

interface Asset {
  id: string;
  title: string;
  description: string;
  license: string;
  category: string;
  licenseColor: 'green' | 'yellow' | 'red';
}

interface PublisherProfileProps {
  publisherId: string;
  dict: Dictionary;
  locale: Locale;
}

export function PublisherProfile({ publisherId, dict, locale }: PublisherProfileProps) {
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);

  useEffect(() => {
    // Mock publisher data
    const mockPublisher: Publisher = {
      id: publisherId,
      name: 'مؤسسة الترجمة الإسلامية',
      description: 'نبذة مختصرة ومعلومات عن الناشر - معلومات عن الناشر مختصرة. مؤسسة متخصصة في ترجمة النصوص الإسلامية وإنتاج الموارد التعليمية عالية الجودة للمجتمع المسلم حول العالم. نهدف إلى توفير ترجمات دقيقة ومفهومة تساعد في نشر المعرفة الإسلامية.',
      website: 'https://islamic-translation.org',
      email: 'info@islamic-translation.org',
      joinDate: '2020-03-15'
    };

    const mockAssets: Asset[] = [
      {
        id: '1',
        title: 'ترجمة القرآن الكريم',
        description: 'ترجمة شاملة للقرآن الكريم باللغة الإنجليزية',
        license: 'CC BY',
        category: 'Translation',
        licenseColor: 'green'
      },
      {
        id: '2',
        title: 'تفسير ابن كثير مترجم',
        description: 'ترجمة مختارات من تفسير ابن كثير',
        license: 'CC BY-SA',
        category: 'Translation',
        licenseColor: 'yellow'
      },
      {
        id: '3',
        title: 'أسماء الله الحسنى',
        description: 'شرح وترجمة أسماء الله الحسنى',
        license: 'CC BY',
        category: 'Translation',
        licenseColor: 'green'
      },
      {
        id: '4',
        title: 'الأحاديث النبوية مترجمة',
        description: 'مجموعة من الأحاديث النبوية الصحيحة مع الترجمة',
        license: 'CC BY-NC',
        category: 'Translation',
        licenseColor: 'yellow'
      },
      {
        id: '5',
        title: 'دعاء ختم القرآن',
        description: 'دعاء ختم القرآن الكريم مترجم',
        license: 'CC0',
        category: 'Translation',
        licenseColor: 'green'
      }
    ];

    setPublisher(mockPublisher);
    setAssets(mockAssets);
  }, [publisherId]);

  const categories = [
    'Translation',
    'Transliteration', 
    'Quran Corpus',
    'Quran Audio',
    'Quran Illustration/Font',
    'Tafsir'
  ];

  const licenses = [
    { id: 'cc0', name: 'CC0/ Public Domain', label: 'مفتوح بالكامل', color: 'green' },
    { id: 'cc-by', name: 'CC BY', label: 'إسناد', color: 'green' },
    { id: 'cc-by-sa', name: 'CC BY-SA', label: 'إسناد ومشاركة بالمثل', color: 'yellow' },
    { id: 'cc-by-nd', name: 'CC BY-ND', label: 'إسناد بلا اشتقاق', color: 'yellow' },
    { id: 'cc-by-nc', name: 'CC BY-NC', label: 'إسناد واستخدام غيرتجاري', color: 'yellow' },
    { id: 'cc-by-nc-sa', name: 'CC BY-NC-SA', label: 'إسناد غيرتجاري، مشاركة بالمثل', color: 'red' },
    { id: 'cc-by-nc-nd', name: 'CC BY-NC-ND', label: 'إسناد غيرتجاري بلا اشتقاق', color: 'red' }
  ];

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(asset.category);
    const matchesLicense = selectedLicenses.length === 0 || selectedLicenses.includes(asset.license);
    return matchesCategory && matchesLicense;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const handleLicenseChange = (license: string, checked: boolean) => {
    if (checked) {
      setSelectedLicenses(prev => [...prev, license]);
    } else {
      setSelectedLicenses(prev => prev.filter(l => l !== license));
    }
  };

  if (!publisher) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle>تصنيف الموارد</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map(category => (
                <div key={category} className={cn("flex items-center", spacing.gapSm)}>
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                  />
                  <label htmlFor={`category-${category}`} className="text-sm cursor-pointer">
                    {category}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* License Filter */}
          <Card>
            <CardHeader>
              <CardTitle>رخصة الموارد (CreativeCommons)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {licenses.map(license => (
                <div key={license.id} className="space-y-2">
                  <div className={cn("flex items-center", spacing.gapSm)}>
                    <div className={cn("w-3 h-3 rounded-full", {
                      'bg-green-500': license.color === 'green',
                      'bg-yellow-500': license.color === 'yellow',
                      'bg-red-500': license.color === 'red'
                    })} />
                    <span className="font-medium">{license.label}</span>
                  </div>
                  <div className={cn("flex items-center", spacing.gapSm, logical.marginStart('5'))}>
                    <Checkbox
                      id={`license-${license.id}`}
                      checked={selectedLicenses.includes(license.name)}
                      onCheckedChange={(checked) => handleLicenseChange(license.name, checked as boolean)}
                    />
                    <label htmlFor={`license-${license.id}`} className="text-sm cursor-pointer">
                      {license.name}
                    </label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          {/* Publisher Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={publisher.avatar} alt={publisher.name} />
                    <AvatarFallback className="text-2xl bg-primary/10">
                      <Building2 className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{publisher.name}</h1>
                    <p className="text-muted-foreground leading-relaxed">
                      {publisher.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {publisher.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={publisher.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          الموقع الإلكتروني
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>انضم في {new Date(publisher.joinDate).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources List */}
          <div>
            <h2 className="text-xl font-bold mb-6">
              قائمة الموارد ({filteredAssets.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAssets.map(asset => (
                <Card key={asset.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{asset.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-muted-foreground text-sm">{asset.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{asset.license}</Badge>
                      <Badge variant="secondary">{asset.category}</Badge>
                    </div>
                    
                    <div className={cn("flex", logical.justifyEnd)}>
                      <Button size="sm" asChild>
                        <Link href={`/${locale}/store/asset/${asset.id}`}>عرض التفاصيل</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">لم يتم العثور على موارد تطابق المرشحات المحددة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
