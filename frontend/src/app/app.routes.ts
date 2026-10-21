import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';

import {authGuard} from './guards/auth.guard';

import { VerifyEmail } from './pages/verify-email/verify-email';
import { ForgotPassword } from './pages/forgot-password/forgot-password';
import { ResetPassword } from './pages/reset-password/reset-password';

import { Fonctionnalites } from './pages/fonctionnalites/fonctionnalites';
import { Securite } from './pages/securite/securite';
import { Telechargement } from './pages/telechargement/telechargement';
import { Apropos } from './pages/apropos/apropos';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: Home,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'profile',
    component: Profile,
    canActivate:[authGuard],
  },
  {
    path: 'verify-email',
    component: VerifyEmail,
  },
  
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  { path: 'reset-password',
    component: ResetPassword,
  },
  {
  path: 'fonctionnalites',
  component: Fonctionnalites,
  },
  {
  path: 'securite',
  component: Securite,
  },
  {
  path: 'telechargement',
  component: Telechargement,
  canActivate:[authGuard],
  },
  {
  path: 'apropos',
  component: Apropos,
  },

  {
    path: '**',
    component: NotFound,
  },
];