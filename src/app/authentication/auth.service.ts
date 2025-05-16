import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login, UserForm } from './auth.types'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: boolean = false;
  constructor(private httpClient: HttpClient, private router: Router
  ) { }

  login(login: Login) {
    const url: string = 'http://localhost:8000/api/auth/login/';
    return this.httpClient
      .post(url, login)
      .subscribe((value: any) => {
        const token = value;
        const JSONToken = JSON.stringify(value)
        localStorage.setItem('token', JSONToken);
        this.auth = true;
        let urlProfile: string = 'http://localhost:8000/api/auth/get_profile'
        return this.httpClient.get(urlProfile, { headers: { 'authorization': `Bearer ${token.access}` } }).subscribe(user => {
          localStorage.setItem('user_data', JSON.stringify(user))
          this.router.navigate(['/dashboard']);
        })
      });
  }

  register(userForm: UserForm) {
    console.log(userForm);
    const url: string = 'http://localhost:8000/api/auth/register/';
    return this.httpClient
      .post(url, userForm)
      .subscribe((value) => {
        const token = JSON.stringify(value);
        localStorage.setItem('token', token);
        this.auth = true;
      });
  }

  get getProfile() {
    return JSON.parse(localStorage.getItem('user_data')!)
  }


  get isAuthenticated(): boolean {
    return this.auth;
  }
}
