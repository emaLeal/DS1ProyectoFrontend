import { Injectable } from '@angular/core';
import { environment } from '../../../public/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostulationService {

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

  constructor(private httpClient: HttpClient
  ) { }

  postular(data: any) {
    const url = environment.baseUrl + environment.postulations.postulate
    
    return this.httpClient.post(url, data, {
      headers: this.getAuthHeaders()
    })
  }
}
