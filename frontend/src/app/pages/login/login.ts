
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route= inject(ActivatedRoute);
  private readonly languageService = inject(LanguageService);
  
  readonly languages: AppLanguage[] = ['fr', 'en', 'de', 'pt', 'ru', 'zh'];
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  identifier = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  login(): void {
    this.errorMessage = '';

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.authService.login({
      identifier: this.identifier,
      password: this.password,
    }).subscribe({
next: (response) => {
  this.authService.setToken(response.accessToken);
  this.password = '';
  this.isLoading = false;

  const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  const destination =
    returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
      ? returnUrl
      : '/profile';

  void this.router.navigateByUrl(destination);
},
      error: (error) => {
        this.errorMessage =
          error.error?.message instanceof Array
            ? error.error.message.join(' ')
            : error.error?.message ||
              'Connexion impossible. Vérifie tes identifiants.';

        this.isLoading = false;
      },
    });
  }
}
