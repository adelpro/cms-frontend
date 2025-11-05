import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublisherService, Publisher } from '../../services/publisher.service';
import { FiltersComponent } from '../../../../shared/components/filters/filters.component';
import { AssetCardComponent } from '../../../../features/gallery/components/asset-card/asset-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-publisher-details-page',
  standalone: true,
  imports: [
    FiltersComponent,
    AssetCardComponent,
    TranslateModule,
    BreadcrumbComponent
  ],
  templateUrl: './publisher-details.page.html',
  styleUrl: './publisher-details.page.less'
})
export class PublisherDetailsPage implements OnInit {
  private readonly publisherService = inject(PublisherService);
  private readonly route = inject(ActivatedRoute);

  readonly id = this.route.snapshot.params['id'];
  publisher = signal<Publisher | null>(null);
  assets = signal<any[]>([]);
  loading = signal<boolean>(true);
  
  categoriesSelection = signal<string[]>([]);
  searchQuery = signal<string>('');
  licensesSelection = signal<string[]>([]);

  ngOnInit() {
    this.getPublisherDetails();
    this.getAssets();
  }

  getPublisherDetails() {
    this.loading.set(true);
    this.publisherService.getPublisher(this.id).subscribe({
      next: (publisher) => {
        this.publisher.set(publisher);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getAssets() {
    this.publisherService.getPublisherAssets(
      this.id,
      this.categoriesSelection(),
      this.searchQuery(),
      this.licensesSelection()
    ).subscribe({
      next: (response) => {
        this.assets.set(response.results);
      }
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

  getPublisherIconUrl(): string {
    const publisher = this.publisher();
    if (publisher?.icon_url) {
      return publisher.icon_url.startsWith('http') 
        ? publisher.icon_url 
        : environment.API_BASE_URL + publisher.icon_url;
    }
    return '';
  }
}
