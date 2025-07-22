import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-oferta-detalle-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <mat-card class="detalle-modal">
      <mat-card-header class="modal-header">
        <mat-card-title class="modal-title">
          <mat-icon color="primary">work</mat-icon>
          <span>Detalles de la Oferta</span>
        </mat-card-title>
      </mat-card-header>
      <mat-card-content *ngIf="data" class="modal-content">
        <div class="detalle-row"><span class="label">Título:</span> <span class="value">{{data.title}}</span></div>
        <div class="detalle-row"><span class="label">Responsabilidades:</span> <span class="value">{{data.responsibilities}}</span></div>
        <div class="detalle-row"><span class="label">Fecha de inicio:</span> <span class="value">{{data.start_date | date:'yyyy-MM-dd'}}</span></div>
        <div class="detalle-row"><span class="label">Fecha de fin:</span> <span class="value">{{data.end_date | date:'yyyy-MM-dd'}}</span></div>
        <div class="detalle-row"><span class="label">Nivel educativo:</span> <span class="value">{{data.education_level}}</span></div>
        <div class="detalle-row"><span class="label">Tipo de trabajo:</span> <span class="value">{{data.job_type}}</span></div>
        <div class="detalle-row"><span class="label">Rango:</span> <span class="value">{{data.rank}}</span></div>
        <div class="detalle-row"><span class="label">Otros requisitos:</span> <span class="value">{{data.other_requirements}}</span></div>
        <div class="detalle-row"><span class="label">Salario:</span> <span class="value">{{data.salary | currency:'COP':'symbol-narrow':'1.0-0'}}</span></div>
        <div class="detalle-row"><span class="label">Estado:</span> <span class="value status" [ngClass]="{'active': data.status === 'active', 'closed': data.status === 'closed'}">{{ traducirEstado(data.status) }}</span></div>
        <div class="detalle-row"><span class="label">Director (ID):</span> <span class="value">{{data.talent_director_document}}</span></div>
      </mat-card-content>
      <mat-card-actions align="end" class="modal-actions">
        <button mat-raised-button color="primary" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon> Cerrar
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .detalle-modal {
      max-width: 500px;
      margin: 0 auto;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(25, 118, 210, 0.10);
      background: #fff;
      padding: 0;
    }
    .modal-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      border-radius: 12px 12px 0 0;
      padding: 20px 24px 12px 24px;
    }
    .modal-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.3rem;
      color: white;
    }
    .modal-content {
      padding: 24px 24px 8px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .detalle-row {
      display: flex;
      gap: 8px;
      margin-bottom: 6px;
      font-size: 1.05rem;
    }
    .label {
      font-weight: 500;
      color: #1976d2;
      min-width: 140px;
      display: inline-block;
    }
    .value {
      color: #333;
      flex: 1;
      word-break: break-word;
    }
    .status.active { color: #388e3c; font-weight: 600; }
    .status.closed { color: #d32f2f; font-weight: 600; }
    .modal-actions {
      padding: 16px 24px 20px 24px;
      border-top: 1px solid #e0e0e0;
      background: #f8f9fa;
      border-radius: 0 0 12px 12px;
    }
    button[mat-raised-button] {
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  `]
})
export class OfertaDetalleModalComponent {
  constructor(
    public dialogRef: MatDialogRef<OfertaDetalleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  traducirEstado(status: string): string {
    if (status === 'active') return 'Activa';
    if (status === 'closed') return 'Cerrada';
    if (status === 'suspended') return 'Suspendida';
    return status;
  }
} 