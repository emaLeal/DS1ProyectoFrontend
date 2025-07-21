import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, User } from './auth.types'
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: boolean = false;

  constructor(private httpClient: HttpClient, private router: Router) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        const firstError = Object.values(error.error)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else {
          errorMessage = JSON.stringify(error.error);
        }
      }
    }
    return throwError(() => errorMessage);
  }

  login(login: Login) {
    const url: string = environment.baseUrl + environment.authentication.login;
    return this.httpClient
      .post(url, login)
      .pipe(
        catchError(this.handleError)
      );
  }

  register(userForm: User): Observable<any> {
    const url: string = environment.baseUrl + environment.authentication.register;
    return this.httpClient
      .post(url, userForm)
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(email: string) {
    const url = environment.baseUrl + environment.authentication.resetPassword
    return this.httpClient.post(url, { email })
  }

  confirmResetPassword(form: any) {
    const body = form.value
    delete body.confirmPassword
    const url = environment.baseUrl + environment.authentication.confirmResetPassword + body.token
    return this.httpClient.post(url, body)
  }

  get getProfile() {
    return JSON.parse(localStorage.getItem('user_data')!)
  }

  get isAuthenticated(): boolean {
    return this.auth;
  }

  private getAuthHeaders(): HttpHeaders {
    const tokenString = localStorage.getItem('token');
    let token;
    try {
      token = JSON.parse(tokenString!);
    } catch (e) {
      // Si no se puede parsear como JSON, usar el token directamente
      token = { access: tokenString };
    }

    return new HttpHeaders({
      'authorization': `Bearer ${token.access}`,
      'Content-Type': 'application/json'
    });
  }
}
