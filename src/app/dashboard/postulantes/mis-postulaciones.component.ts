import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PostulationService } from '../../services/postulation.service';
import { MatDialog } from '@angular/material/dialog';
import { OfertaDetalleModalComponent } from '../ofertas/ofertas-lista/oferta-detalle-modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import TranslateLogic from '../../lib/translate/translate.class';
import { PostularDialogComponent } from '../ofertas-activas/postular-dialog/postular-dialog.component';
import { ViewPostulacionDialogComponent } from './view-postulacion-dialog.component';
import { OfertaBasica, Postulacion, PostulantesService } from '../../services/postulantes.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-mis-postulaciones',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <h2 style="margin-bottom: 12px;">{{'my_applications.tittle' | translate}}</h2>
    <div class="tabla-scroll">
      <table mat-table [dataSource]="postulaciones" class="mat-elevation-z8 tabla-simple">
        <ng-container matColumnDef="job_offer_id">
          <th mat-header-cell *matHeaderCellDef>{{'my_applications.offer' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{getOfertaNombre(p.job_offer_id)}}</td>
        </ng-container>
        <ng-container matColumnDef="application_date">
          <th mat-header-cell *matHeaderCellDef>{{'my_applications.date' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{p.application_date | date:'yyyy-MM-dd'}}</td>
        </ng-container>
        <ng-container matColumnDef="motivation">
          <th mat-header-cell *matHeaderCellDef>{{'my_applications.motivation' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{p.motivation}}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>{{'my_applications.actions' | translate}}</th>
          <td mat-cell *matCellDef="let p">
            <div style="display: flex; gap: 8px; align-items: center;">
              <button mat-icon-button color="primary" (click)="verDetallesOferta(p.job_offer_id)">
                <mat-icon>visibility</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="verPostulacion(p)">
                <mat-icon>info</mat-icon>
              </button>
              <button mat-icon-button color="accent" (click)="editarPostulacion(p)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="eliminarPostulacion(p)">
                <mat-icon>delete</mat-icon>
              </button>
                <button mat-icon-button color="primary" (click)="descargarArchivos(p.undergraduate_support)">
    <mat-icon>download</mat-icon>
  </button>
            </div>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </div>
  `
})
export class MisPostulacionesComponent extends TranslateLogic implements OnInit {
  postulaciones: Postulacion[] = [];
  ofertas: OfertaBasica[] = [];
  displayedColumns = ['job_offer_id', 'application_date', 'motivation', 'acciones'];

  constructor(
    private postulantesService: PostulantesService,
    private postulationService: PostulationService,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    translate: TranslateService
  ) {
    super(translate)
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    this.postulantesService.getPostulaciones().subscribe((data: any) => {
      if (user.role === 1) {
        this.postulaciones = data;
      } else {
        this.postulaciones = data.filter((p: any) => String(p.applicant_document).trim() === String(user.document_id).trim());
      }
      console.log('Postulaciones cargadas:', this.postulaciones);
    });
    this.postulantesService.getOfertasBasicas().subscribe((ofertas: any) => {
      this.ofertas = ofertas;
    });
  }

  getOfertaNombre(id: any): string {
    if (id === undefined || id === null) return '';
    const oferta = this.ofertas.find(o => o.id === id);
    return oferta ? oferta.title : String(id);
  }

  verDetallesOferta(id: number) {
    this.postulantesService.getOfertasBasicas().subscribe(() => {
      this.dialog.open(OfertaDetalleModalComponent, {
        width: '500px',
        data: this.ofertas.find(o => o.id === id)
      });
    });
  }

  verPostulacion(postulacion: Postulacion) {
    this.dialog.open(ViewPostulacionDialogComponent, {
      width: '600px',
      data: { postulacion }
    });
  }

  editarPostulacion(postulacion: Postulacion) {
    const dialogRef = this.dialog.open(PostularDialogComponent, {
      width: '600px',
      data: { usuario: postulacion, modo: 'editar' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.postulationService.updatePostulation(postulacion.id, result).subscribe({
          next: () => {
            // Actualiza la tabla localmente
            Object.assign(postulacion, result);
            this.snackBar.open('Postulación actualizada correctamente', 'Cerrar', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('No se pudo actualizar la postulación', 'Cerrar', { duration: 3000 });
          }
        });
      }
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

  descargarArchivos(url: string): void {
    const link = document.createElement('a');
    link.href = "http://127.0.0.1:8000" + url;
    link.target = '_blank'; // para abrir en nueva pestaña, opcional
    link.download = ''; // opcional: nombre del archivo si lo deseas forzar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 