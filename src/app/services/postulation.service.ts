import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  postular(data: any): Observable<any> {
    const url = environment.baseUrl + environment.postulations.postulate
    
    return this.httpClient.post(url, data, {
      headers: this.getAuthHeaders()
    })
  }

  deletePostulation(id: number) {
    const url = environment.baseUrl + `/postulation/delete/${id}/`;
    return this.httpClient.delete(url, {
      headers: this.getAuthHeaders()
    });
  }

  updatePostulation(id: number, data: any) {
    const url = environment.baseUrl + `/postulation/update/${id}/`;
    return this.httpClient.put(url, data, {
      headers: this.getAuthHeaders()
    });
  }
}
