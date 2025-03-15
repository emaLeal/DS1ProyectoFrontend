import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  login(document_id: number, password: string) {
    const url: string = 'http://localhost:8000/api/auth/login/';
    return this.httpClient.post(url, { document_id, password }).subscribe(value => {
      const token = JSON.stringify(value)
      localStorage.setItem('token', token)
    });
  }
}
