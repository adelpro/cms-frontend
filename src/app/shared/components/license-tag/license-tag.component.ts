import { NgClass } from '@angular/common';
import { Component, HostListener, Input, OnInit, inject, input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Licenses, LicensesColors } from '../../../core/enums/licenses.enum';

@Component({
  selector: 'app-license-tag',
  standalone: true,
  imports: [NgClass, NzTagModule, NzIconModule, NzPopoverModule, NzDrawerModule],
  templateUrl: './license-tag.component.html',
  styleUrls: ['./license-tag.component.less'],
})
export class LicenseTagComponent implements OnInit {
  @Input() license!: Licenses;

  showPopover = false;
  isMobileView = false;
  muted = input<boolean>(false);

  private translate = inject(TranslateService);

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth <= 768;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (typeof window !== 'undefined') {
      this.isMobileView = window.innerWidth <= 768;
    }
  }

  togglePopover() {
    this.showPopover = !this.showPopover;
  }

  get nzColor() {
    return LicensesColors[this.license];
  }

  get description() {
    return this.translate.instant(`LICENSES_DESCRIPTIONS.${this.license}`);
  }
}
