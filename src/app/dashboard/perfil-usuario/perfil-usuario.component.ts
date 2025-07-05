import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface Usuario {
  foto: string;
  name: string;
  last_name: string;
  email: string;
  document_type: string;
  document_id: string;
  address: string;
  birth_date: string;
  cell_phone: string;
  role: number;
  phone: string;
  gender: string;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent {
  // Datos simulados porq no se como traerlos del backend :(
  usuario: Usuario = {
    foto: 'assets/default-avatar.png',
    name: 'Valentina',
    last_name: 'Gomez',
    email: 'valentina@exampe.com',
    document_type: 'Cédula',
    document_id: '1098456788',
    address: 'Calle 56 #45-78',
    birth_date: '1998-08-15',
    cell_phone: '3204567890',
    role: 1,
    phone: '6047891234',
    gender: 'woman'
  };
}
