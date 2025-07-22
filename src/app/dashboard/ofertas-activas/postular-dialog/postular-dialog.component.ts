import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import { PostulationService } from '../../../services/postulation.service';

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
export class PostularDialogComponent implements OnInit {
  form: Postulacion = {
    applicant_document: "",
    job_offer_id: 0,
    undergraduate_title: "",
    postgraduate_title: "",
    motivation: "",
    resume: "",
    phone: "",
    application_date: "",
    resume_support: null,
    resume_filename: "",
    undergraduate_support: null,
    undergraduate_filename: "",
    postgraduate_support: null,
    postgraduate_filename: ""
  }

  // Variables para mostrar nombres de archivos
  undergraduateFileName: string = '';
  postgraduateFileName: string = '';
  resumeFileName: string = '';


  constructor(
    private dialogRef: MatDialogRef<PostularDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postulationService: PostulationService
  ) {
    if (data.modo === 'editar') {
      // Precarga todos los campos con los datos de la postulación
      this.form = { ...this.form, ...data.usuario };
    } else {
      this.form = {
        ...this.form,
        job_offer_id: data.usuario.job_offer_id,
        applicant_document: data.usuario.applicant_document,
        phone: data.usuario.phone
      };
    }
  }
  ngOnInit(): void {
    console.log(this.form)
  }


  cancelar(): void {
    this.dialogRef.close();
  }

  postular() {
    const currentdate = new Date();
    const year = currentdate.getFullYear();
    const month = String(currentdate.getMonth() + 1).padStart(2, '0');
    const day = String(currentdate.getDate()).padStart(2, '0');
    const hour = String(currentdate.getHours()).padStart(2, '0');
    const minutes = String(currentdate.getMinutes()).padStart(2, '0');
    const seconds = String(currentdate.getSeconds()).padStart(2, '0');
    
    const application_date = `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`;
    this.form.application_date = application_date;

    if (this.data.modo === 'editar') {
      // Lógica para edición
      this.dialogRef.close(this.form);
    } else {
      // Enviar como JSON
      this.postulationService.postular(this.form).subscribe({
        next: (value) => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al postular:', err);
          alert('Error al enviar la postulación');
        }
      });
    }
  }

  getBotonTexto() {
    return this.data.modo === 'editar' ? 'Guardar cambios' : 'Confirmar postulación';
  }


  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onResumeFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor seleccione un archivo PDF');
        return;
      }

      this.form.resume_filename = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convertir a base64
        const base64String = e.target;
        this.form.resume_support = base64String;
      };
      reader.readAsDataURL(file);
    }
  }


  onUnderGraduateFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor seleccione un archivo PDF');
        return;
      }

      this.form.undergraduate_filename = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convertir a base64
        const base64String = e.target.result;
        this.form.undergraduate_support = base64String;
      };
      reader.readAsDataURL(file);
    }
  }

  onPostGraduateFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        alert('Por favor seleccione un archivo PDF');
        return;
      }

      this.form.postgraduate_filename = file.name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convertir a base64
        const base64String = e.target.result;
        this.form.postgraduate_support = base64String;
      };
      reader.readAsDataURL(file);
    }
  }
}
