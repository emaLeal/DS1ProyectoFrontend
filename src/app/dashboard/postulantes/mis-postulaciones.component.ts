import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostulantesService, Postulacion, OfertaBasica } from './postulantes.service';
import { PostulationService } from '../../services/postulation.service';
import { MatDialog } from '@angular/material/dialog';
import { OfertaDetalleModalComponent } from '../ofertas/ofertas-lista/oferta-detalle-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mis-postulaciones',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <h2 style="margin-bottom: 12px;">Mis postulaciones</h2>
    <div class="tabla-scroll">
      <table mat-table [dataSource]="postulaciones" class="mat-elevation-z8 tabla-simple">
        <ng-container matColumnDef="oferta">
          <th mat-header-cell *matHeaderCellDef>Oferta</th>
          <td mat-cell *matCellDef="let p">{{getOfertaNombre(p.job_offer_id)}}</td>
        </ng-container>
        <ng-container matColumnDef="application_date">
          <th mat-header-cell *matHeaderCellDef>Fecha</th>
          <td mat-cell *matCellDef="let p">{{p.application_date | date:'yyyy-MM-dd'}}</td>
        </ng-container>
        <ng-container matColumnDef="motivation">
          <th mat-header-cell *matHeaderCellDef>Motivación</th>
          <td mat-cell *matCellDef="let p">{{p.motivation}}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let p">
            <button mat-icon-button color="primary" (click)="verDetallesOferta(p.job_offer_id)">
              <mat-icon>visibility</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="eliminarPostulacion(p)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `
})
export class MisPostulacionesComponent implements OnInit {
  postulaciones: Postulacion[] = [];
  ofertas: OfertaBasica[] = [];
  displayedColumns = ['oferta', 'application_date', 'motivation', 'acciones'];

  constructor(
    private postulantesService: PostulantesService,
    private postulationService: PostulationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    this.postulantesService.getPostulaciones().subscribe(data => {
      this.postulaciones = data.filter(p => String(p.applicant_document).trim() === String(user.document_id).trim());
    });
    this.postulantesService.getOfertasBasicas().subscribe(ofertas => {
      this.ofertas = ofertas;
    });
  }

  getOfertaNombre(id: number): string {
    const oferta = this.ofertas.find(o => o.id === id);
    return oferta ? oferta.title : id.toString();
  }

  verDetallesOferta(id: number) {
    this.postulantesService.getOfertasBasicas().subscribe(() => {
      this.dialog.open(OfertaDetalleModalComponent, {
        width: '500px',
        data: this.ofertas.find(o => o.id === id)
      });
    });
  }

  eliminarPostulacion(postulacion: Postulacion) {
    if (confirm('¿Estás seguro de que deseas eliminar esta postulación?')) {
      this.postulationService.deletePostulation(postulacion.id).subscribe({
        next: () => {
          this.postulaciones = this.postulaciones.filter(p => p.id !== postulacion.id);
          this.snackBar.open('Postulación eliminada correctamente', 'Cerrar', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('No se pudo eliminar la postulación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
} 