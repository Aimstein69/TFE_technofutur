import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email',
  imports: [TranslatePipe],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.scss',
})
export class VerifyEmail implements AfterViewInit {
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
  private backgroundVideo!: ElementRef<HTMLVideoElement>;

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  private token = '';

  constructor() {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
  }

  ngAfterViewInit(): void {
    const video = this.backgroundVideo.nativeElement;

    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    video.load();

    const startVideo = (): void => {
      video.play().catch((error: unknown) => {
        console.warn(
          'La lecture automatique de la vidéo a été bloquée par le navigateur.',
          error,
        );
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      startVideo();
    } else {
      video.addEventListener('canplay', startVideo, { once: true });
    }
  }

  confirmEmail(): void {
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Le lien de confirmation est invalide.';
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    this.authService.verifyEmail(this.token).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.isLoading = false;

        void this.router.navigate(['/login'], {
          queryParams: { verified: 'true' },
        });
      },

      error: (error) => {
        this.errorMessage =
          error.error?.message ||
          'Impossible de confirmer cette adresse email. Le lien est peut-être expiré ou déjà utilisé.';

        this.isLoading = false;
      },
    });
  }
}