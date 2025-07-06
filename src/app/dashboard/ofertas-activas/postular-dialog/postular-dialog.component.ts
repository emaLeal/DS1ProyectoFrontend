import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Role, RolesService } from '../../roles/roles.service';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Postulacion } from './postular.types';

interface Usuario {
  name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  phone?: string;
  document_id: string;
  identification_type: string;
  birth_date: string | Date;
  gender: string;
  address: string;
  role: number;
  role_id?: string;
  password?: string;
  confirm_password?: string;
}

@Component({
  selector: 'app-postular-dialog',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './postular-dialog.component.html',
  styleUrl: './postular-dialog.component.css'
})
export class PostularDialogComponent {
  form: Postulacion = {
    applicant_document: "",
    job_offer_id: 0,
    undergraduate_title: "",
    postgraduate_title: "",
    motivation: "",
    resume: "",
    phone: "",
    application_date: ""
  }


  constructor(
    private dialogRef: MatDialogRef<PostularDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usuariosService: UsuariosService
  ) {
    this.form = { ...data.postulateData }
  }


  cancelar(): void {
    this.dialogRef.close();
  }

 
  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
