import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';
import { LangSwitchComponent } from '../../../../shared/components/lang-switch/lang-switch.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule, LangSwitchComponent],
  styleUrls: ['./login.page.less'],
  templateUrl: './login.page.html'
})
export class LoginPage {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly translate = inject(TranslateService);

  loginForm: FormGroup;
  errorMessage = signal<string>('');

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.isLoading.set(true);
      this.errorMessage.set('');

      const loginData: LoginRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          // if ((response as any)?.user?.profile_completed) {
          this.router.navigate(['/gallery']);
          // } else {
          //   this.router.navigate(['/complete-profile']);
          // }
        },
        error: (error) => {
          this.authService.isLoading.set(false);
          this.errorMessage.set(error?.error?.error?.message || this.translate.instant('AUTH.LOGIN.ERRORS.LOGIN_FAILED'));
        }
      });
    }
  }
}


