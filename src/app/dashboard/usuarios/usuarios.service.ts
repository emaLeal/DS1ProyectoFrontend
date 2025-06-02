// usuarios.service.ts
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../public/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ 
  providedIn: 'root' 
})
export class UsuariosService {

  constructor(private httpClient: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = JSON.parse(localStorage.getItem('token')!);
    return new HttpHeaders({
      'authorization': `Bearer ${token.access}`,
      'Content-Type': 'application/json'
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error completo:', error);
    
    let errorMessage = 'Ha ocurrido un error';
    let statusCode = error.status;

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del backend
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.detail) {
        errorMessage = error.error.detail;
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos. Por favor verifica la información.';
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      } else if (error.status === 404) {
        errorMessage = 'Usuario no encontrado.';
      } else if (error.status === 409) {
        errorMessage = 'Ya existe un usuario con ese documento o email.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
      }
    }

    return throwError(() => ({
      message: errorMessage,
      status: statusCode,
      error: error.error
    }));
  }

  getUsers(): Observable<any[]> {
    const url = environment.baseUrl + environment.users.getUsers;
    return this.httpClient.get<any[]>(url, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }

  createUser(usuario: any): Observable<any> {
    const url = environment.baseUrl + '/auth/register/';
    return this.httpClient.post(url, usuario, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }

  updateUser(document_id: string, updatedUser: any): Observable<any> {
    const url = `${environment.baseUrl}/auth/update/${document_id}/`;
    return this.httpClient.put(url, updatedUser, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }

  deleteUser(document_id: string): Observable<any> {
    const url = `${environment.baseUrl}/auth/delete/${document_id}/`;
    return this.httpClient.delete(url, { 
      headers: this.getAuthHeaders() 
    }).pipe(catchError(this.handleError));
  }
}