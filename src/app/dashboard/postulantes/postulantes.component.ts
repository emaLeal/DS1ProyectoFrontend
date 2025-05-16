import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-postulantes',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './postulantes.component.html',
  styleUrl: './postulantes.component.css'
})
export class PostulantesComponent {
  filtroGenero = '';
  filtroCargo = '';

  cargos = ['Desarrollador', 'Diseñador', 'Analista', 'Comercial'];

  postulantes = [
    { nombre: 'Juan', apellido: 'Pérez', genero: 'Masculino', cargo: 'Desarrollador', correo: 'juan@correo.com' },
    { nombre: 'María', apellido: 'Gómez', genero: 'Femenino', cargo: 'Diseñador', correo: 'maria@correo.com' },
    { nombre: 'Carlos', apellido: 'López', genero: 'Masculino', cargo: 'Analista', correo: 'carlos@correo.com' }
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
}

