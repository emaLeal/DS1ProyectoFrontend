import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  // Definimos la interfaz aquí mismo
  usuarios: {
    documento: string;
    nombreCompleto: string;
    email: string;
    code: string;
    telefono: string;
    rol: string;
    estatus: string;
  }[] = [
    {
      documento: '10101010',
      nombreCompleto: 'María García',
      email: 'maria@empresa.com',
      code: '+57',
      telefono: '3111111111',
      rol: 'Administrador',
      estatus: 'Activo'
    },
    {
      documento: '20202020',
      nombreCompleto: 'Carlos Rojas',
      email: 'carlos@empresa.com',
      code: '+57',
      telefono: '3222222222',
      rol: 'Director de talento Humano',
      estatus: 'Inactivo'
    }
  ];

  filtroRol: string = '';
  filtroEstado: string = '';
  filtroBusqueda: string = '';

  get usuariosFiltrados() {
    return this.usuarios.filter(usuario =>
      (!this.filtroRol || usuario.rol === this.filtroRol) &&
      (!this.filtroEstado || usuario.estatus === this.filtroEstado) &&
      (!this.filtroBusqueda || usuario.nombreCompleto.toLowerCase().includes(this.filtroBusqueda.toLowerCase()))
    );
  }

  editarUsuario(usuario: any) {
    alert(`Editar usuario: ${usuario.nombreCompleto}`);
  }

  borrarUsuario(usuario: any) {
    if (confirm(`¿Seguro que deseas eliminar a ${usuario.nombreCompleto}?`)) {
      this.usuarios = this.usuarios.filter(u => u !== usuario);
    }
  }
}
