
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),

    provideTranslateService({
      loader: provideTranslateHttpLoader({
        resources: [
          '/i18n/home-translate/',
          '/i18n/profile-translate/',
          '/i18n/fonctionnalites-translate/',
          '/i18n/about-translate/',
          '/i18n/login-translate/',
          '/i18n/securite-translate/',
          '/i18n/telechargement-translate/',
          '/i18n/forgot-pass-translate/',
          '/i18n/reset-pass-translate/',
          '/i18n/verify-email-translate/',
        ]
      }),
      fallbackLang: 'fr',
      lang: 'fr',
    }),
  ],
};
