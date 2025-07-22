import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../usuarios/usuarios.service';
import { OfertasService } from '../../services/ofertas.service';
import { PostulantesService } from '../../services/postulantes.service';
import { Observable } from 'rxjs';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReporteConfirmacionComponent } from './reporte-confirmacion.component';
@Component({
  selector: 'app-reports',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent {
  reporteForm: FormGroup;
  datosExcel: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UsuariosService,
    private ofertasService: OfertasService,
    private postulantesService: PostulantesService,
    private dialog: MatDialog
  ) {

    this.reporteForm = this.fb.group({
      tipo: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    });
  }

  private servicioPorTipo: Record<string, () => Observable<any>> = {
    Usuarios: () => this.userService.getUsers(),
    Ofertas: () => this.ofertasService.getOfertas(),
    Postulaciones: () => this.postulantesService.getPostulaciones()
  };


  generarReporte() {
    if (this.reporteForm.invalid) {
      this.reporteForm.markAllAsTouched(); // Muestra errores
      return;
    }
    const tipo = this.reporteForm.value.tipo;

    const servicio = this.servicioPorTipo[tipo];

    if (!servicio) {
      console.warn('Tipo de reporte no válido:', tipo);
      return;
    }

    servicio().subscribe({
      next: (data) => {
        this.datosExcel = this.filtrarPorFechas(data, tipo);
        this.exportarExcel(tipo);
        console.log(data);

      },
      error: (error) => {
        console.error(`Error al cargar ${tipo.toLowerCase()}:`, error);
      }
    });
  }

  exportarExcel(tipo: string): void {

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datosExcel);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Reporte': worksheet },
      SheetNames: ['Reporte']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `Reporte-${tipo}.xlsx`);

    this.dialog.open(ReporteConfirmacionComponent, {
      width: '350px'
    });

  }

  private filtrarPorFechas(data: any[], tipo: string): any[] {
    const inicio = new Date(this.reporteForm.value.fechaInicio);
    const fin = new Date(this.reporteForm.value.fechaFin);

    // Ajustamos fin para incluir todo el día
    fin.setHours(23, 59, 59, 999);

    // Campo de fecha según el tipo
    let campoFecha = '';

    switch (tipo) {
      case 'Usuarios':
        campoFecha = 'date_joined';
        break;
      case 'Ofertas':
        campoFecha = 'start_date';
        break;
      case 'Postulaciones':
        campoFecha = 'application_date';
        break;
    }

    return data.filter((item) => {
      const fecha = new Date(item[campoFecha]);
      return fecha >= inicio && fecha <= fin;
    });
  }

}
