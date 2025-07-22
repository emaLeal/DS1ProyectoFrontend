import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-postulacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="display: flex; align-items: center; gap: 8px;">
      <mat-icon>info</mat-icon>
      Detalles de la Postulación
    </h2>
    <mat-dialog-content>
      <div style="margin-bottom: 12px;"><strong>Documento:</strong> {{ data.postulacion.applicant_document }}</div>
      <div style="margin-bottom: 12px;"><strong>Título Pregrado:</strong> {{ data.postulacion.undergraduate_title }}</div>
      <div style="margin-bottom: 12px;"><strong>Título Posgrado:</strong> {{ data.postulacion.postgraduate_title }}</div>
      <div style="margin-bottom: 12px;"><strong>Motivación:</strong> {{ data.postulacion.motivation }}</div>
      <div style="margin-bottom: 12px;"><strong>Resumen:</strong> {{ data.postulacion.resume }}</div>
      <div style="margin-bottom: 12px;"><strong>Teléfono:</strong> {{ data.postulacion.phone }}</div>
      <div style="margin-bottom: 12px;"><strong>Fecha de postulación:</strong> {{ data.postulacion.application_date }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">
        <mat-icon>close</mat-icon>
        Cerrar
      </button>
    </mat-dialog-actions>
  `
})
export class ViewPostulacionDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ViewPostulacionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
} 