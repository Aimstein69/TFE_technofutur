
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type AppLanguage = 'fr' | 'en' | 'de' | 'pt' | 'ru' | 'zh';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translate = inject(TranslateService);

  readonly languages: AppLanguage[] = [
    'fr',
    'en',
    'de',
    'pt',
    'ru',
    'zh',
  ];

  constructor() {
    this.translate.addLangs(this.languages);
    this.translate.setFallbackLang('fr');

    const savedLanguage = localStorage.getItem('privatechat-language');

    const language: AppLanguage =
      this.isSupported(savedLanguage) ? savedLanguage : 'fr';

    this.setLanguage(language);
  }

  setLanguage(language: AppLanguage): void {
    if (!this.isSupported(language)) {
      return;
    }

    localStorage.setItem('privatechat-language', language);
    this.translate.use(language);
  }

  getCurrentLanguage(): string {
    return this.translate.getCurrentLang() || 'fr';
  }

  private isSupported(value: string | null): value is AppLanguage {
    return value !== null &&
      this.languages.includes(value as AppLanguage);
  }
}
