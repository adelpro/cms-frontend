'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Languages, ReceiptText, Mic, Eye } from 'lucide-react';
import Link from 'next/link';
import type { Asset } from '@/hooks/use-assets-store';
import { useTranslations } from 'next-intl';

interface AssetCardProps {
  asset: Asset;
  locale: string;
}

export default function AssetCard({ asset, locale }: AssetCardProps) {
  const t = useTranslations();
  return (
    <Card className="h-full transition-shadow hover:shadow-lg">
      <CardHeader className="flex items-center justify-between gap-2">
        {asset.type === 'translation' && <Languages size={32} className="text-primary-400" />}
        {asset.type === 'tafsir' && <ReceiptText size={32} className="text-primary-400" />}
        {asset.type === 'audio' && <Mic size={32} className="text-primary-400" />}
        <Badge className="w-fit max-w-[130px] truncate border text-xs">{asset.license}</Badge>
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-between gap-4">
        <div>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold">{asset.title}</h3>
          <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{asset.description}</p>
          <div className="text-muted-foreground text-sm">
            <span className="font-medium">{t('ui.publisherLabel')}</span> {asset.publisher}
          </div>
        </div>
        <Button asChild size="lg" variant="outline" className="mt-auto w-full">
          <Link href={`/${locale}/store/asset/${asset.id}`}>
            {t('store.viewDetails')} <Eye size={16} />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
