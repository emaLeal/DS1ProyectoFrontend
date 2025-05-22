import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../public/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private httpClient: HttpClient) { }

  getUsers() {
    const url: string = environment.baseUrl + environment.users.getUsers

    return this.httpClient.get(url, {headers: {
      'authorization': `Bearer ${JSON.parse(localStorage.getItem('token')!).access}`
    }})
  }
}
