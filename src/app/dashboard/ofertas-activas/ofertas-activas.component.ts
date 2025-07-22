import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OfertasService, JobOffer } from '../../services/ofertas.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PostularDialogComponent } from './postular-dialog/postular-dialog.component';
import { Router } from '@angular/router';
import { OfertaDetalleModalComponent } from '../ofertas/ofertas-lista/oferta-detalle-modal.component';

@Component({
  selector: 'app-ofertas-activas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './ofertas-activas.component.html',
  styleUrls: ['./ofertas-activas.component.css']
})
export class OfertasActivasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;
  ofertas: JobOffer[] = [];
  ofertasFiltradas: JobOffer[] = [];
  postulateData: any = {}
  isAdmin: boolean = false;

  constructor(
    private ofertasService: OfertasService,
    private dialog: MatDialog,
    private router: Router
  ) {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    this.isAdmin = user?.role === 1 || user?.role?.id === 1;
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        // Solo mostrar ofertas activas
        this.ofertas = ofertas.filter(o => o.status === 'active');
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.ofertasFiltradas = this.ofertas.filter(oferta => {
      const salario = oferta.salary;
      const rango = oferta.rank === 'SemiSenior' ? 'Semi Senior' : oferta.rank;
      return (
        (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || rango === this.filtroRango) &&
        (this.filtroSalario === null || salario >= this.filtroSalario)
      );
    });
  }

  postulate(job_offer_id: any) {
    const userData = JSON.parse(localStorage.getItem('user_data')!)
    this.postulateData = {
      ...this.postulateData,
      applicant_document: userData.document_id,
      phone: userData.cell_phone,
      job_offer_id
    }
    const dialogRef = this.dialog.open(PostularDialogComponent, {
      width: '600px',
      data: { usuario: this.postulateData }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    });
  }

  verDetallesOferta(oferta: JobOffer) {
    this.dialog.open(OfertaDetalleModalComponent, {
      width: '500px',
      data: oferta
    });
  }
}
