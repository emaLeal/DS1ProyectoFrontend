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
    application_date: ""
  }


  constructor(
    private dialogRef: MatDialogRef<PostularDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private postulationService: PostulationService
  ) {
    this.form = {
      ...this.form,
      job_offer_id: data.usuario.job_offer_id,
      applicant_document: data.usuario.applicant_document,
      phone: data.usuario.phone
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
    const year = currentdate.getFullYear()
    const month = currentdate.getMonth().toString().length == 1 ? '0' + (currentdate.getMonth() + 1) : currentdate.getMonth() + 1
    const day = currentdate.getDate().toString().length == 1 ? '0' + currentdate.getDate() : currentdate.getDate()
    const hour = currentdate.getHours().toString().length == 1 ? '0' + currentdate.getHours() : currentdate.getHours()
    const minutes = currentdate.getMinutes().toString().length == 1 ? '0' + currentdate.getMinutes() : currentdate.getMinutes()
    const seconds = currentdate.getSeconds().toString().length == 1 ? '0' + currentdate.getSeconds() : currentdate.getSeconds()
    const application_date = year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds
    this.form = { ...this.form, application_date }
    this.postulationService.postular(this.form).subscribe(value => {
      console.log(value)
      this.dialogRef.close(true)
    })

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
