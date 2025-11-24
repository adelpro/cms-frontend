import { Component, inject, signal } from '@angular/core';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { Asset } from '../../models/assets.model';
import { AssetsService } from '../../services/assets.service';
import { AssetCardSkeletonComponent } from '../asset-card-skeleton/asset-card-skeleton.component';
import { AssetCardComponent } from '../asset-card/asset-card.component';

@Component({
  selector: 'app-assets-listing',
  imports: [FiltersComponent, AssetCardComponent, AssetCardSkeletonComponent],
  templateUrl: './assets-listing.component.html',
  styleUrl: './assets-listing.component.less',
})
export class AssetsListingComponent {
  private readonly assetsService = inject(AssetsService);

  assets = signal<Asset[]>([]);
  loading = signal<boolean>(false);
  categoriesSelection = signal<string[]>([]);
  searchQuery = signal<string>('');
  licensesSelection = signal<string[]>([]);

  constructor() {
    this.getAssets();
  }

  getAssets() {
    this.loading.set(true);
    this.assetsService
      .getAssets(this.categoriesSelection(), this.searchQuery(), this.licensesSelection())
      .subscribe({
        next: (response) => this.assets.set(response.results),
        complete: () => this.loading.set(false),
      });
  }

  searchQueryChange(event: string) {
    this.searchQuery.set(event);
    this.getAssets();
  }
  categoriesSelectionChange(event: string[]) {
    this.categoriesSelection.set(event);
    this.getAssets();
  }
  licensesSelectionChange(event: string[]) {
    this.licensesSelection.set(event);
    this.getAssets();
  }
}
