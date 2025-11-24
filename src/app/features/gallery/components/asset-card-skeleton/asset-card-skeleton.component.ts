import { Component } from '@angular/core';

@Component({
  selector: 'app-asset-card-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-card" aria-hidden="true">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-subtitle"></div>
      <div class="skeleton skeleton-button"></div>
    </div>
  `,
  styleUrl: './asset-card-skeleton.component.less',
})
export class AssetCardSkeletonComponent {}
