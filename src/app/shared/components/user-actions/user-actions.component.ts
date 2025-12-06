import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';

@Component({
  selector: 'app-user-actions',
  standalone: true,
  imports: [RouterLink, TranslatePipe, UserAvatarComponent, NzButtonComponent],
  styleUrls: ['./user-actions.component.less'],
  template: `
    @if (authService.isAuthenticated()) {
      <div class="user-actions">
        <app-user-avatar [user]="authService.currentUser()" size="md"></app-user-avatar>
        <button
          nz-button
          nzDanger
          (click)="onLogout()"
          [title]="'NAVIGATION.LOGOUT' | translate"
          class="btn__icon ant-btn-floating"
        >
          <i class="bx bx-arrow-out-left-square-half ltr-flip"></i>
          <span class="sr-only">{{ 'NAVIGATION.LOGOUT' | translate }}</span>
        </button>
      </div>
    } @else {
      <a [routerLink]="['/login']" nz-button class="ant-btn-floating">
        {{ 'AUTH.LOGIN.SUBMIT_BUTTON' | translate }}
      </a>
    }
  `,
})
export class UserActionsComponent {
  readonly authService = inject(AuthService);

  mobileMode = input(false);

  logoutClicked = output<void>();

  onLogout(): void {
    this.logoutClicked.emit();
  }
}
