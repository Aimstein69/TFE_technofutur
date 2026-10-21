
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-not-found',
  standalone: true,
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound implements AfterViewInit, OnDestroy {
  @ViewChild('backgroundVideo')
  backgroundVideo!: ElementRef<HTMLVideoElement>;

  private retryTimer?: ReturnType<typeof setTimeout>;

  ngAfterViewInit(): void {
    const video = this.backgroundVideo.nativeElement;

    video.muted = true;
    video.currentTime = 0;

    video.play().catch((error: unknown) => {
      console.error('Erreur de lecture de la vidéo 404 :', error);
    });
  }

  ngOnDestroy(): void {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }

    const video = this.backgroundVideo?.nativeElement;

    if (video) {
      video.pause();
    }
  }
}
