import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-fonctionnalites',
  imports: [RouterLink, RouterLinkActive, AsyncPipe, TranslatePipe, FormsModule],
  templateUrl: './fonctionnalites.html',
  styleUrl: './fonctionnalites.scss',
})
export class Fonctionnalites {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

   private readonly languageService = inject(LanguageService);
    
    readonly languages: AppLanguage[] = ['fr', 'en', 'de', 'pt', 'ru', 'zh'];
    get currentLanguage(): string {
      return this.languageService.getCurrentLanguage();
    }
    changeLanguage(language: AppLanguage): void {
      this.languageService.setLanguage(language);
    }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}