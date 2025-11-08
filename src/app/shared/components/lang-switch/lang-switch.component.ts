import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NzButtonComponent } from "ng-zorro-antd/button";

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  styleUrls: ['./lang-switch.component.less'],
  template: `
    <button nz-button
      [title]="langTooltip"
      (click)="toggleLang()"
      class="btn__icon ant-btn-floating"
    >
      <i class='lang-switch__icon bx bx-translate'></i> 
      <span class="sr-only">{{ langTooltip }}</span>
    </button>
  `,
  imports: [NzButtonComponent]
})
export class LangSwitchComponent {
  private translate = inject(TranslateService);

  get langTooltip() {
    return this.translate.getCurrentLang() === 'ar' ? 'English' : 'العربية';
  }

  toggleLang() {
    const current = this.translate.getCurrentLang() || 'ar';
    const next = current === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', next);
    window.location.reload();
  }
}
