import { ChangeDetectorRef,Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly languages: AppLanguage[] = ['fr', 'en', 'de', 'pt', 'ru', 'zh'];
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }


  email = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  submit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.forgotPassword({
      email: this.email,
    })

.subscribe({

next: (response) => {
  console.log('Réponse du backend :', response);
  console.log('Avant affichage :', this.showResetEmailModal);

  this.successMessage = response.message;
  this.showResetEmailModal = true;
  this.isLoading = false;
  this.cdr.detectChanges();

  console.log('Après affichage :', this.showResetEmailModal);
},

  error: (error) => {
    this.errorMessage =
      error.error?.message instanceof Array
        ? error.error.message.join(' ')
        : error.error?.message ||
          'Impossible de traiter la demande. Réessaie plus tard.';

    this.isLoading = false;
    this.cdr.markForCheck();
  },
});

  }
  showResetEmailModal = false;
  closeResetEmailModal(): void {
  this.showResetEmailModal = false;
}
}
