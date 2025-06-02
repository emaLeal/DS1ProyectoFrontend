import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirmation-dialog">
      <h2 mat-dialog-title>
        <mat-icon>warning</mat-icon>
        {{ data.titulo }}
      </h2>

      <mat-dialog-content>
        <div class="confirmation-content">
          <p class="confirmation-message">{{ data.mensaje }}</p>
          <p class="user-details" *ngIf="data.usuario">
            <strong>Nombre:</strong> {{ data.usuario.name }} {{ data.usuario.last_name }}<br>
            <strong>Documento:</strong> {{ data.usuario.document_id }}<br>
            <strong>Email:</strong> {{ data.usuario.email }}
          </p>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
          Cancelar
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          <mat-icon>delete</mat-icon>
          Eliminar
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      padding: 24px;
      max-width: 400px;
    }

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #d32f2f;
      margin: 0 0 20px 0;
      font-size: 1.5rem;
    }

    .confirmation-content {
      margin-bottom: 24px;
    }

    .confirmation-message {
      font-size: 1.1rem;
      color: rgba(0, 0, 0, 0.87);
      margin-bottom: 16px;
    }

    .user-details {
      background: #f5f5f5;
      padding: 16px;
      border-radius: 8px;
      margin: 0;
      line-height: 1.6;
    }

    mat-dialog-actions {
      margin: 0;
      padding: 0;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
