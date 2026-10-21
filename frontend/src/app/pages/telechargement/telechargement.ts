
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';
import { LanguageService, AppLanguage } from '../../services/languages';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-telechargement',
  imports: [RouterLink, AsyncPipe, TranslatePipe, FormsModule],
  templateUrl: './telechargement.html',
  styleUrl: './telechargement.scss',
})
export class Telechargement implements AfterViewInit, OnDestroy {
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


  @ViewChild('backgroundVideo')
  backgroundVideo!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.backgroundVideo?.nativeElement;

    if (!video) {
      return;
    }

    video.muted = true;
    video.loop = true;

    video.play().catch((error: unknown) => {
      console.error(
        'Impossible de démarrer la vidéo de téléchargement :',
        error,
      );
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    const video = this.backgroundVideo?.nativeElement;

    if (video) {
      video.pause();
    }
  }
}
