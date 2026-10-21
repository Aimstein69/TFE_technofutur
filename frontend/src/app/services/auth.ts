import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  language: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    language: string;
    isVerified: boolean;
  };
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user:{
    id:string;
    username:string;
    email:string;
    language:string;
    isVerified:boolean;
  }
}

export interface VerifyEmailResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/auth';

  private readonly authenticatedSubject = new BehaviorSubject<boolean>(
    this.hasStoredToken(),
  );

  readonly authenticated$ = this.authenticatedSubject.asObservable();

  private hasStoredToken(): boolean {
    return (
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('access_token') !== null
    );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${this.apiUrl}/register`,
      data,
    );
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      data,
    );
  }

  verifyEmail(token: string): Observable<VerifyEmailResponse> {
    return this.http.get<VerifyEmailResponse>(
      `${this.apiUrl}/verify-email`,
      { params: { token } },
    );
  }

  forgotPassword(
    data: ForgotPasswordRequest,
  ): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(
      `${this.apiUrl}/forgot-password`,
      data,
    );
  }

  resetPassword(
    data: ResetPasswordRequest,
  ): Observable<ResetPasswordResponse> {
    return this.http.post<ResetPasswordResponse>(
      `${this.apiUrl}/reset-password`,
      data,
    );
  }

  getToken(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return this.hasStoredToken();
  }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
    this.authenticatedSubject.next(true);
  }


logout(): void {
  const token = this.getToken();

  if (!token) {
    this.clearLocalSession();
    return;
  }

  this.http.post(
    `${this.apiUrl}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).subscribe({
    next: () => {
      this.clearLocalSession();
    },
    error: (error) => {
      console.error(
        'La révocation de la session a échoué.',
        error,
      );

      this.clearLocalSession();
    },
  });
}

private clearLocalSession(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
  }

  this.authenticatedSubject.next(false);
}

}
