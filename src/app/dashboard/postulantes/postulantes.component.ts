import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PostulantesService, Postulacion, UsuarioPostulante, OfertaBasica } from '../../services/postulantes.service';
import { forkJoin } from 'rxjs';

export interface PostulanteTabla {
  nombre: string;
  apellido: string;
  document_id: string;
  email: string;
  oferta: string;
  fecha_postulacion: string;
}

@Component({
  selector: 'app-postulantes',
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    TranslateModule
  ],
  standalone: true,
  templateUrl: './postulantes.component.html',
  styleUrl: './postulantes.component.css'
})
export class PostulantesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtroGenero = '';
  filtroCargo = '';
  filtroNombre = '';
  filtroCedula = '';
  displayedColumns: string[] = ['foto', 'nombre', 'email', 'oferta', 'estado', 'acciones'];

  cargos = ['Desarrollador', 'Diseñador', 'Analista', 'Comercial'];

  postulantes: PostulanteTabla[] = [];
  postulantesFiltrados: PostulanteTabla[] = [];
  user: any;
  isAdmin: boolean = false;

  constructor(private postulantesService: PostulantesService) {
    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.isAdmin = this.user?.role === 1;
    this.cargarPostulantes();
  }

  cargarPostulantes() {
    if (this.isAdmin) {
      forkJoin({
        postulaciones: this.postulantesService.getPostulaciones(),
        usuarios: this.postulantesService.getUsuariosPostulantes(),
        ofertas: this.postulantesService.getOfertasBasicas()
      }).subscribe(({ postulaciones, usuarios, ofertas }) => {
        this.postulantes = postulaciones.map(post => {
          const usuario = usuarios.find(u => u.document_id === post.applicant_document);
          const oferta = ofertas.find(o => o.id === post.job_offer_id);
          return usuario && oferta ? {
            nombre: usuario.name,
            apellido: usuario.last_name,
            document_id: usuario.document_id,
            email: usuario.email,
            oferta: oferta.title,
            fecha_postulacion: post.application_date
          } : null;
        }).filter(p => p !== null) as PostulanteTabla[];
        this.aplicarFiltros();
      });
    } else {
      // Lógica para no admin igual que antes
      this.postulantesService.getPostulantes().subscribe((data) => {
        this.postulantes = data.filter(p => p.creador_oferta === this.user.document_id) as any;
        this.aplicarFiltros();
      });
    }
  }

  aplicarFiltros() {
    this.postulantesFiltrados = this.postulantes.filter(p =>
      (!this.filtroNombre || (`${p.nombre} ${p.apellido}`.toLowerCase().includes(this.filtroNombre.toLowerCase()))) &&
      (!this.filtroCedula || p.document_id.includes(this.filtroCedula))
    );
  }

  onFiltroNombreChange(event: Event) {
    const valor = (event.target as HTMLInputElement)?.value || '';
    this.filtroNombre = valor;
    this.aplicarFiltros();
  }

  onFiltroCedulaChange(event: Event) {
    const valor = (event.target as HTMLInputElement)?.value || '';
    this.filtroCedula = valor;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtroGenero = '';
    this.filtroCargo = '';
  }

  loadApplicants() {

  } 
}

