import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

export interface NavigationLink {
  link: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe, NgClass],
  styleUrls: ['./navigation-menu.component.less'],
  template: `
    <nav class="nav-menu">
      @for (link of links(); track link.link) {
        <a
          [routerLink]="link.link"
          routerLinkActive="nav-menu__link--active"
          class="nav-menu__link"
          [ngClass]="{'nav-menu__link--disabled': link.disabled}"
        >
          {{ link.label | translate }}
        </a>
      }
    </nav>
  `
})
export class NavigationMenuComponent {
  links = input.required<NavigationLink[]>();
}
