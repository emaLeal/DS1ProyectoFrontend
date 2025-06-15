import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../public/environment';

export interface JobOffer {
  id?: number;
  title: string;           // max 255 caracteres
  responsibilities: string; // texto
  start_date: string | Date;
  end_date: string | Date;
  education_level: string; // max 100 caracteres
  job_type: string;       // max 50 caracteres
  rank: string;           // max 10 caracteres
  other_requirements: string; // texto
  salary: number;         // decimal(10,2)
  status: 'active' | 'closed'; // max 20 caracteres
  talent_director_document?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfertasService {
  private apiUrl = environment.baseUrl + '/offer';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = error.error.message;
    } else {
      // Error del servidor
      if (typeof error.error === 'object') {
        // Si el error es un objeto, intentamos extraer mensajes específicos
        const errorMessages = [];
        for (const key in error.error) {
          if (error.error.hasOwnProperty(key)) {
            errorMessages.push(`${key}: ${error.error[key]}`);
          }
        }
        errorMessage = errorMessages.join('. ');
      } else if (typeof error.error === 'string') {
        errorMessage = error.error;
      }
    }

    return throwError(() => errorMessage);
  }

  private formatDate(date: string | Date): string {
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    return date;
  }

  getOfertas(): Observable<JobOffer[]> {
    return this.http.get<JobOffer[]>(`${this.apiUrl}/getall/`)
      .pipe(catchError(this.handleError));
  }

  getOferta(id: number): Observable<JobOffer> {
    return this.http.get<JobOffer>(`${this.apiUrl}/get/${id}/`)
      .pipe(catchError(this.handleError));
  }

  crearOferta(oferta: Omit<JobOffer, 'id'>): Observable<JobOffer> {
    // Asegurarse de que las fechas estén en el formato correcto
    const ofertaFormateada = {
      ...oferta,
      start_date: this.formatDate(oferta.start_date),
      end_date: this.formatDate(oferta.end_date)
    };

    console.log('Enviando oferta:', ofertaFormateada);

    return this.http.post<JobOffer>(`${this.apiUrl}/post/`, ofertaFormateada)
      .pipe(catchError(this.handleError));
  }

  actualizarOferta(id: number, oferta: Partial<JobOffer>): Observable<JobOffer> {
    // Formatear fechas si están presentes
    const ofertaFormateada = {
      ...oferta,
      ...(oferta.start_date && { start_date: this.formatDate(oferta.start_date) }),
      ...(oferta.end_date && { end_date: this.formatDate(oferta.end_date) })
    };

    return this.http.put<JobOffer>(`${this.apiUrl}/put/${id}/`, ofertaFormateada)
      .pipe(catchError(this.handleError));
  }

  eliminarOferta(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}/`)
      .pipe(catchError(this.handleError));
  }
} 