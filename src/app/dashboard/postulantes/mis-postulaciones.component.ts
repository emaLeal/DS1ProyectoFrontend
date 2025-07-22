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

@Component({
  selector: 'app-mis-postulaciones',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <h2 style="margin-bottom: 12px;">{{'my_postulants.tittle' | translate}}</h2>
    <div class="tabla-scroll">
      <table mat-table [dataSource]="postulaciones" class="mat-elevation-z8 tabla-simple">
        <ng-container matColumnDef="oferta">
          <th mat-header-cell *matHeaderCellDef>{{'my_postulants.offer' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{getOfertaNombre(p.job_offer_id)}}</td>
        </ng-container>
        <ng-container matColumnDef="application_date">
          <th mat-header-cell *matHeaderCellDef>{{'my_postulants.date' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{p.application_date | date:'yyyy-MM-dd'}}</td>
        </ng-container>
        <ng-container matColumnDef="motivation">
          <th mat-header-cell *matHeaderCellDef>{{'my_postulants.motivation' | translate}}</th>
          <td mat-cell *matCellDef="let p">{{p.motivation}}</td>
        </ng-container>
        <ng-container matColumnDef="acciones">
          <th mat-header-cell *matHeaderCellDef>{{'my_postulants.actions' | translate}}</th>
          <td mat-cell *matCellDef="let p">
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
  displayedColumns = ['oferta', 'application_date', 'motivation', 'acciones'];

  constructor(
    private postulantesService: PostulantesService,
    private postulationService: PostulationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    translate: TranslateService
  ) {
    super(translate)
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user_data')!);
    this.postulantesService.getPostulaciones().subscribe((data: any) => {
      this.postulaciones = data.filter((p: any) => String(p.applicant_document).trim() === String(user.document_id).trim());
    });
    this.postulantesService.getOfertasBasicas().subscribe((ofertas: any) => {
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
} 