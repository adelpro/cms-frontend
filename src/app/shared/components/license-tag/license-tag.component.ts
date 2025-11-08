import { Component, input } from '@angular/core';
import { NzTagComponent } from 'ng-zorro-antd/tag';
import { Licenses, LicensesColors } from '../../../core/enums/licenses.enum';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-license-tag',
  imports: [NzTagComponent, NgClass],
  template: `
    <nz-tag [nzColor]="nzColor" [ngClass]="{muted: muted()}">{{ license() }}</nz-tag>
  `
})
export class LicenseTagComponent {
  license = input.required<Licenses>();
  muted = input<boolean>(false);

  get nzColor() {
    return LicensesColors[this.license()];
  }
}
