import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from './usuarios.service';
import { User } from '../../authentication/auth.types';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  // Definimos la interfaz aquí mismo
  usuarios: any = []
  constructor(private userService: UsuariosService) { }

  ngOnInit() {
    this.cargarUsuarios()
  }

  cargarUsuarios() {
    this.userService.getUsers().subscribe((data) => {
      this.usuarios = data
      console.log('Datos recibidos', this.usuarios)
    },
      (error) => {
        console.log('Hubo un error')
      }
    )
  }

  filtroRol: string = '';
  filtroEstado: string = '';
  filtroBusqueda: string = '';

  editarUsuario(usuario: any) {
    alert(`Editar usuario: ${usuario.name}`);
  }

  borrarUsuario(usuario: any) {
    if (confirm(`¿Seguro que deseas eliminar a ${usuario.name}?`)) {
      this.usuarios = this.usuarios.filter((u: any) => u !== usuario);
    }
  }
}
