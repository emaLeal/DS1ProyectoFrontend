import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- Importante para [(ngModel)]

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  roles = [
    { id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema' },
    { id: 2, nombre: 'Director de Talento Humano', descripcion: 'Gestiona postulaciones y ofertas' },
  ];

  rolesFiltrados = [...this.roles];
  filtro = '';
  mostrarFormulario = false;
  rolSeleccionado: any = null;

  form = {
    nombre: '',
    descripcion: ''
  };

  filtrarRoles() {
    this.rolesFiltrados = this.roles.filter(rol =>
      rol.nombre.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirFormulario() {
    this.form = { nombre: '', descripcion: '' };
    this.rolSeleccionado = null;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  editarRol(rol: any) {
    this.rolSeleccionado = rol;
    this.form = { ...rol };
    this.mostrarFormulario = true;
  }

  guardarRol() {
    if (this.rolSeleccionado) {
      this.rolSeleccionado.nombre = this.form.nombre;
      this.rolSeleccionado.descripcion = this.form.descripcion;
    } else {
      const nuevo = {
        id: this.roles.length + 1,
        ...this.form
      };
      this.roles.push(nuevo);
    }
    this.filtrarRoles();
    this.cerrarFormulario();
  }

  eliminarRol(id: number) {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      this.roles = this.roles.filter(r => r.id !== id);
      this.filtrarRoles();
    }
  }
}
