import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../public/environment';


export interface Role {
  id: number;
  description: string;
}

export interface CreateRoleRequest {
  id?: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private apiUrl = 'http://localhost:8000/api/roles/';

  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    const url: string = environment.baseUrl + environment.role.getRoles
    return this.http.get<Role[]>(url)
      .pipe(catchError(this.handleError));
  }

  createRole(role: CreateRoleRequest): Observable<Role> {
    const url: string = environment.baseUrl + environment.role.createRole
    console.log('Datos recibidos en el servicio:', role);
    console.log('URL:', `${this.apiUrl}create/`);

    // Crear el payload limpio sin modificar el objeto original
    const payload: any = {
      description: role.description
    };

    // Solo incluir ID si está presente y es válido
    if (role.id !== undefined && role.id !== null && role.id > 0) {
      payload.id = role.id;
    }

    console.log('Payload final enviado al backend:', payload);

    return this.http.post<Role>(url, payload)
      .pipe(catchError(this.handleError));
  }

  updateRole(id: number, role: Partial<Role>): Observable<Role> {
    const url: string = environment.baseUrl + environment.role.updateRole + id + '/'
    return this.http.put<Role>(url, role)
      .pipe(catchError(this.handleError));
  }

  deleteRole(id: number): Observable<void> {
    const url = environment.baseUrl + environment.role.deleteRole + id + '/'
    return this.http.delete<void>(url)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del lado del servidor
      console.error('Error completo del servidor:', error);
      console.error('Status:', error.status);
      console.error('Error body:', error.error);
      console.error('Headers:', error.headers);

      switch (error.status) {
        case 400:
          // Mostrar el mensaje específico del servidor si está disponible
          if (error.error && typeof error.error === 'object') {
            if (error.error.message) {
              errorMessage = error.error.message;
            } else if (error.error.detail) {
              errorMessage = error.error.detail;
            } else if (error.error.description) {
              errorMessage = `Error en description: ${error.error.description}`;
            } else {
              errorMessage = 'Datos inválidos: ' + JSON.stringify(error.error);
            }
          } else if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else {
            errorMessage = 'Datos inválidos';
          }
          break;
        case 404:
          errorMessage = 'Rol no encontrado';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}