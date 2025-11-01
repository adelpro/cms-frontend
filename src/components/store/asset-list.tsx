import React from 'react';
import AssetCard from './asset-card';
import type { Asset } from '@/hooks/use-assets-store';

interface AssetListProps {
  assets: Asset[];
  locale: string;
}

export default function AssetList({ assets, locale }: AssetListProps) {
  return (
    <div className="mb-8 grid auto-rows-fr grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {assets.map((asset) => (
        <AssetCard key={asset.id} asset={asset} locale={locale} />
      ))}
    </div>
  );
}
