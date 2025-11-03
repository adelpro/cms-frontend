import { Component, input } from '@angular/core';
import { Asset } from '../../models/assets.model';
import { LicenseTagComponent } from '../../../../shared/components/license-tag/license-tag.component';
import { Categories } from '../../../../core/enums/categories.enum';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-asset-card',
  imports: [LicenseTagComponent, TranslatePipe, RouterLink, NzButtonComponent],
  styleUrl: './asset-card.component.less',
  template: `
    <div class="asset-card">
      <div class="asset-card__header">
        <i [class]="icon"></i>
        <app-license-tag [license]="asset().license" [muted]="true" />
      </div>
      <div class="asset-card__content">
        <div class="content-wrapper">
          <div class="main-content">
            <div class="text-content">
              <h3>{{ asset().name }}</h3>
              <p>{{ asset().description }}</p>
            </div>
            <div class="publisher-info">
              <div class="publisher-text">
                <span class="label">{{ 'UI.PUBLISHER_LABEL' | translate }}</span>
                <a routerLink="/publisher/{{ asset().publisher.id }}">{{ asset().publisher.name }}</a>
              </div>
            </div>
          </div>
          <div class="button-container">
            <a nz-button nzSize="large" routerLink="/gallery/asset/{{ asset().id }}" class="w-full">
              <i class="bx bx-eye"></i>
              {{ 'GALLERY.VIEW_DETAILS' | translate }}
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AssetCardComponent {
  asset = input.required<Asset>();

  get icon() {
    switch (this.asset().category) {
      case Categories.MUSHAF:
        return 'bx bx-book-bookmark';
      case Categories.TAFSIR:
        return 'bx bx-file-detail';
      case Categories.RECITATION:
        return 'bx bx-microphone';
      default:
        return 'bx bx-file';
    }
  }
}
