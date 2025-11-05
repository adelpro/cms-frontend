import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ImageCarouselComponent } from '../../../../shared/components/image-carousel/image-carousel.component';
import { AssetsService } from '../../services/assets.service';
import { AssetDetails } from '../../models/assets.model';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { BreadcrumbComponent } from '../../../../shared/components/breadcrumb/breadcrumb.component';
import { LicenseTagComponent } from '../../../../shared/components/license-tag/license-tag.component';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-details-page',
  standalone: true,
  imports: [
    RouterModule,
    ImageCarouselComponent,
    BreadcrumbComponent,
    LicenseTagComponent,
    TranslateModule,
    NzButtonModule,
    NzTagModule,
    NzIconModule,
    NzSpinModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './asset-details.page.html',
  styleUrl: './asset-details.page.less'
})
export class AssetDetailsPage {
  private readonly assetsService = inject(AssetsService);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly id = this.route.snapshot.params['id'];
  asset = signal<AssetDetails | null>(null);
  images = signal<string[]>([]);
  loading = signal<boolean>(true);
  isModalVisible = signal<boolean>(false);
  isLicenseModalVisible = signal<boolean>(false);
  canConfirmLicense = signal<boolean>(false);
  
  accessRequestForm: FormGroup;

  usageOptions = [
    { value: 'commercial' },
    { value: 'non-commercial' }
  ];

  constructor() {
    this.accessRequestForm = this.fb.group({
      intended_use: ['', [Validators.required]],
      purpose: ['', [Validators.required]]
    });
  }
  
  ngOnInit() {
    this.getAssetDetails(this.id);
  }

  getAssetDetails(id: string) {
    this.loading.set(true);
    this.assetsService.getAssetDetails(id).subscribe({
      next: (asset) => {
        this.asset.set(asset);
        this.images.set(asset.snapshots.map((snapshot) => environment.API_BASE_URL + snapshot.image_url));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getCategoryIcon(category: string): string { // TODO: move this function to a shared utility
    switch (category) {
      case 'mushaf':
        return 'book-bookmark';
      case 'tafsir':
        return 'file-detail';
      case 'recitation':
        return 'microphone';
      default:
        return 'file';
    }
  }

  downloadResource() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const asset = this.asset();
    if (!asset?.id) {
      return;
    }

    // Open access request modal instead of directly downloading
    this.openAccessRequestModal();
  }

  openAccessRequestModal() {
    this.isModalVisible.set(true);
  }

  closeAccessRequestModal() {
    this.isModalVisible.set(false);
    this.accessRequestForm.reset();
  }

  handleModalCancel() {
    this.closeAccessRequestModal();
  }

  handleModalOk() {
    if (this.accessRequestForm.valid) {
      const asset = this.asset();
      if (!asset?.id) {
        return;
      }

      const formData = {
        intended_use: this.accessRequestForm.value.intended_use,
        purpose: this.accessRequestForm.value.purpose
      };

      this.http.post(`${environment.API_BASE_URL}/assets/${asset.id}/request-access/`, formData).subscribe({
        next: () => {
          this.closeAccessRequestModal();
          this.openLicenseModal();
        },
        error: (error) => {
          console.error('Access request failed:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.accessRequestForm.controls).forEach(key => {
        this.accessRequestForm.get(key)?.markAsTouched();
      });
    }
  }

  openLicenseModal() {
    this.isLicenseModalVisible.set(true);
    this.canConfirmLicense.set(false);
  }

  closeLicenseModal() {
    this.isLicenseModalVisible.set(false);
    this.canConfirmLicense.set(false);
  }

  handleLicenseScroll(event: Event) {
    const element = event.target as HTMLElement;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight;
    const clientHeight = element.clientHeight;
    
    // Check if scrolled to bottom (with 5px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      this.canConfirmLicense.set(true);
    }
  }

  get showScrollHint(): boolean {
    return !this.canConfirmLicense();
  }

  handleLicenseConfirm() {
    // TODO: Handle license confirmation
    this.closeLicenseModal();
    // Proceed with download
    const asset = this.asset();
    if (asset?.id) {
      this.downloadFile(`${environment.API_BASE_URL}/assets/${asset.id}/download/`, `${asset.name || 'asset'}.zip`);
    }
  }

  downloadOriginalResource() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    const asset = this.asset();
    if (!asset?.resource?.id) {
      return;
    }

    this.downloadFile(`${environment.API_BASE_URL}/resources/${asset.resource.id}/download/`, `${asset.name || 'resource'}_original.zip`);
  }

  private downloadFile(url: string, filename: string): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    // Authorization header is automatically added by global interceptor
    this.http.get(url, { 
      responseType: 'blob',
      observe: 'response'
    }).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) {
          return;
        }

        // Get filename from Content-Disposition header if available
        const contentDisposition = response.headers.get('Content-Disposition');
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        // Create blob URL and download
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (error) => {
        console.error('Download failed:', error);
      }
    });
  }

  getLicenseType(license: string): any {
    return license;
  }
}
