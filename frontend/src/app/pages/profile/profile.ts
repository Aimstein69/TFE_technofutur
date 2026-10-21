
import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProfileUser {
  id: string;
  username: string;
  email: string;
  language: string;
  isVerified: boolean;
}

interface ProfileResponse {
  user: ProfileUser;
}

@Component({
  selector: 'app-profile',
  imports: [RouterLink, TranslatePipe, AsyncPipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private readonly http = inject(HttpClient);
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


  user: ProfileUser | null = null;
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const token = this.authService.getToken();

    if (!token) {
      this.authService.logout();
      void this.router.navigate(['/login']);
      return;
    }

    this.http.get<ProfileResponse>(
      'http://localhost:3000/users/me',
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
      },
    ).subscribe({
      next: (response) => {
        this.user = response.user;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.authService.logout();
          void this.router.navigate(['/login']);
          return;
        }

        this.errorMessage = 'Impossible de charger votre profil.';
        this.cdr.detectChanges();
      },
    });
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/']);
  }
}
