<<<<<<< HEAD
import { HttpClient } from '@angular/common/http';
=======
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0
import { Injectable } from '@angular/core';
import { Login, User } from './auth.types'
import { Router } from '@angular/router';
import { environment } from '../../../public/environment';
<<<<<<< HEAD
=======
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: boolean = false;
<<<<<<< HEAD
  constructor(private httpClient: HttpClient, private router: Router
  ) { }
=======

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
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0

  login(login: Login) {
    const url: string = environment.baseUrl + environment.authentication.login;
    return this.httpClient
      .post(url, login)
<<<<<<< HEAD
      .subscribe((value: any) => {
        const token = value;
        const JSONToken = JSON.stringify(value)
        localStorage.setItem('token', JSONToken);
        this.auth = true;
        let urlProfile: string = environment.baseUrl + environment.authentication.profile
        return this.httpClient.get(urlProfile, { headers: { 'authorization': `Bearer ${token.access}` } }).subscribe(user => {
          localStorage.setItem('user_data', JSON.stringify(user))
          this.router.navigate(['/dashboard']);
        })
      });
  }

  register(userForm: User) {
    const url: string = environment.baseUrl + environment.authentication.register;
    return this.httpClient
      .post(url, userForm)
      .subscribe((value) => {
        alert("Te has registrado correctamente")
        this.router.navigate(['/login']);
      });
=======
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
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0
  }

  get getProfile() {
    return JSON.parse(localStorage.getItem('user_data')!)
  }

<<<<<<< HEAD

=======
>>>>>>> 7d23f567d5cd6d0829fa751721be5398cea4fbb0
  get isAuthenticated(): boolean {
    return this.auth;
  }
}
