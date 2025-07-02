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
interface Postulante {
  foto: string;
  nombre: string;
  apellido: string;
  genero: string;
  cargo: string;
  email: string;
  oferta: string;
  estado: string;
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
  displayedColumns: string[] = ['foto', 'nombre', 'email', 'oferta', 'estado', 'acciones'];

  cargos = ['Desarrollador', 'Diseñador', 'Analista', 'Comercial'];

  postulantes: Postulante[] = [
    { 
      foto: 'assets/default-avatar.png',
      nombre: 'Juan', 
      apellido: 'Pérez', 
      genero: 'Masculino', 
      cargo: 'Desarrollador', 
      email: 'juan@correo.com',
      oferta: 'Desarrollador Frontend',
      estado: 'Activo'
    },
    { 
      foto: 'assets/default-avatar.png',
      nombre: 'María', 
      apellido: 'Gómez', 
      genero: 'Femenino', 
      cargo: 'Diseñador', 
      email: 'maria@correo.com',
      oferta: 'Diseñador UI/UX',
      estado: 'Activo'
    },
    { 
      foto: 'assets/default-avatar.png',
      nombre: 'Carlos', 
      apellido: 'López', 
      genero: 'Masculino', 
      cargo: 'Analista', 
      email: 'carlos@correo.com',
      oferta: 'Analista de Datos',
      estado: 'Inactivo'
    }
  ];

  postulantesFiltrados() {
    return this.postulantes.filter(p =>
      (this.filtroGenero ? p.genero === this.filtroGenero : true) &&
      (this.filtroCargo ? p.cargo === this.filtroCargo : true)
    );
  }

  limpiarFiltros() {
    this.filtroGenero = '';
    this.filtroCargo = '';
  }

  loadApplicants() {

  } 
}

