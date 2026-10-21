import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink, TranslatePipe],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements AfterViewInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly languageService = inject(LanguageService);
  
  readonly languages: AppLanguage[] = ['fr', 'en', 'de', 'pt', 'ru', 'zh'];
  get currentLanguage(): string {
    return this.languageService.getCurrentLanguage();
  }
  changeLanguage(language: AppLanguage): void {
    this.languageService.setLanguage(language);
  }

  @ViewChild('backgroundVideo')
  backgroundVideo!: ElementRef<HTMLVideoElement>;

  token = '';
  password = '';
  confirmPassword = '';
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  constructor() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';

    if (!this.token) {
      this.errorMessage =
        'Le lien de réinitialisation est absent ou invalide.';
    }
  }

  ngAfterViewInit(): void {
    const video = this.backgroundVideo.nativeElement;

    video.muted = true;
    video.loop = true;
    video.currentTime = 0;

    video.play().catch((error: unknown) => {
      console.error(
        'Impossible de démarrer la vidéo de fond :',
        error,
      );
    });
  }

  ngOnDestroy(): void {
    const video = this.backgroundVideo?.nativeElement;

    if (video) {
      video.pause();
    }
  }

  submit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.token) {
      this.errorMessage = 'Le lien de réinitialisation est invalide.';
      return;
    }

    if (this.password.length < 12) {
      this.errorMessage =
        'Le mot de passe doit contenir au moins 12 caractères.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les deux mots de passe ne correspondent pas.';
      return;
    }

    if (this.isLoading) return;

    this.isLoading = true;

    this.authService.resetPassword({
      token: this.token,
      newPassword: this.password,
    }).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.password = '';
        this.confirmPassword = '';
        this.isLoading = false;

        void this.router.navigate(['/login'], {
          queryParams: { passwordReset: 'true' },
        });
      },
      error: (error) => {
        this.errorMessage =
          error.error?.message instanceof Array
            ? error.error.message.join(' ')
            : error.error?.message ||
              'Le lien est peut-être expiré ou déjà utilisé.';

        this.isLoading = false;
      },
    });
  }
}
