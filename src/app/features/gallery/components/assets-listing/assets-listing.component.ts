import { Component, inject, signal } from '@angular/core';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { AssetsService } from '../../services/assets.service';
import { AssetCardComponent } from '../asset-card/asset-card.component';

@Component({
  selector: 'app-assets-listing',
  imports: [FiltersComponent, AssetCardComponent],
  templateUrl: './assets-listing.component.html',
  styleUrl: './assets-listing.component.less'
})
export class AssetsListingComponent {
  private readonly assetsService = inject(AssetsService);

  assets = signal<any[]>([]);
  categoriesSelection = signal<string[]>([]);
  searchQuery = signal<string>('');
  licensesSelection = signal<string[]>([]);
  
  constructor() {
    this.getAssets();
  }

  getAssets() {
    this.assetsService.getAssets(this.categoriesSelection(), this.searchQuery(), this.licensesSelection()).subscribe((assets) => {
      this.assets.set(assets.results);
      console.log(this.assets());
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
