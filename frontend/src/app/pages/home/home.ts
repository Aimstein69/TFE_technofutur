import { ChangeDetectorRef, Component, inject} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService, AppLanguage } from '../../services/languages';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterLink, AsyncPipe, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly languageService = inject(LanguageService);
  
  readonly languages: AppLanguage[] = ['fr', 'en', 'de', 'pt', 'ru', 'zh'];
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }


  username = '';
  email = '';
  password = '';
  language = 'fr';

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  showVerificationModal = false;

  register(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.authService
      .register({
        username: this.username,
        email: this.email,
        password: this.password,
        language: this.language,
      })
      .subscribe({
        next: (_response) => {
          this.successMessage = '';
          this.errorMessage = '';
          this.password = '';
          this.isLoading = false;

          this.showVerificationModal = true;
          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Erreur inscription :', error);
          console.error('Statut HTTP :', error.status);
          console.error('Réponse du backend :', error.error);

          this.errorMessage =
            error.error?.message instanceof Array
              ? error.error.message.join(' ')
              : error.error?.message ||
                'Impossible de créer le compte. Réessaie plus tard.';

          this.isLoading = false;
        },
      });
  }

  closeVerificationModal(): void {
    this.showVerificationModal = false;
  }
  logout(): void {
  this.authService.logout();
  void this.router.navigate(['/']);
}
}