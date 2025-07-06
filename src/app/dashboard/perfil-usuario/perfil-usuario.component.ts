import { Component, OnInit } from '@angular/core';
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
export class PerfilUsuarioComponent implements OnInit {
  usuario!: Usuario | null;

  ngOnInit() {
    const userData = localStorage.getItem('user_data'); //trae el usuario del localStorage
    // Verifica si userData existe y es un string válido
    if (userData) {
      const data = JSON.parse(userData);
      this.usuario = {
        foto: '',
        name: data.name,
        last_name: data.last_name,
        email: data.email,
        document_type: data.document_type,
        document_id: data.document_id,
        address: data.address,
        birth_date: data.birth_date,
        cell_phone: data.cell_phone,
        role: data.role,
        phone: data.phone,
        gender: data.gender
      };
    } else {
      this.usuario = null;
    }
  }
}
