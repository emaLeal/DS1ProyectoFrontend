import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, User } from './auth.types'
import { Router } from '@angular/router';
import { environment } from '../../../public/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: boolean = false;
  constructor(private httpClient: HttpClient, private router: Router
  ) { }

  login(login: Login) {
    const url: string = environment.baseUrl + environment.authentication.login;
    return this.httpClient
      .post(url, login)
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
  }

  get getProfile() {
    return JSON.parse(localStorage.getItem('user_data')!)
  }


  get isAuthenticated(): boolean {
    return this.auth;
  }
}
