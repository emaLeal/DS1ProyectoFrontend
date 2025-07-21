import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../public/environment';
import { Observable, forkJoin } from 'rxjs';

export interface Postulante {
  id: number;
  document_id: string;
  nombre: string;
  apellido: string;
  email: string;
  oferta: string;
  estado: string;
  creador_oferta: string;
}

export interface Postulacion {
  id: number;
  applicant_document: string;
  job_offer_id: number;
  undergraduate_title: string;
  postgraduate_title: string;
  motivation: string;
  resume: string;
  phone: string;
  application_date: string;
}

export interface UsuarioPostulante {
  name: string;
  last_name: string;
  phone: string;
  cell_phone: string;
  email: string;
  document_id: string;
  gender: string;
  address: string;
  identification_type: string;
  birth_date: string;
  role: number;
  role_description: string;
}

export interface OfertaBasica {
  id: number;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostulantesService {
  constructor(private http: HttpClient) { }

  getPostulantes() {
    const url = environment.baseUrl + environment.postulants.getPostulants;
    return this.http.get<Postulante[]>(url);
  }

  getPostulaciones(): Observable<Postulacion[]> {
    const url = environment.baseUrl + '/postulation/getall/';
    return this.http.get<Postulacion[]>(url);
  }

  getUsuariosPostulantes(): Observable<UsuarioPostulante[]> {
    const url = environment.baseUrl + '/applicant/getall/';
    return this.http.get<UsuarioPostulante[]>(url);
  }

  getOfertasBasicas(): Observable<OfertaBasica[]> {
    const url = environment.baseUrl + '/offer/getall/';
    return this.http.get<OfertaBasica[]>(url);
  }
}
