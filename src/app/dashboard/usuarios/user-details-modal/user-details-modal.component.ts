import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    TranslateModule
  ],
  template: `
<div class="modal-container">
  <mat-card class="details-card">
    <div class="modal-header">
      <div class="header-title">
        <mat-icon>person</mat-icon>
        <span>{{ 'userDetails.titulo' | translate }}</span>
      </div>
    </div>

    <mat-card-content class="card-content">
      <div class="user-details">
        <!-- Información Personal -->
        <div class="detail-section">
          <h3>{{ 'userDetails.informacionPersonal' | translate }}</h3>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.nombre' | translate }}</span>
            <span class="value">{{data.usuario.name}} {{data.usuario.last_name}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.documento' | translate }}</span>
            <span class="value">{{data.usuario.identification_type}} {{data.usuario.document_id}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.genero' | translate }}</span>
            <span class="value">{{getGender(data.usuario.gender)}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.fechaNacimiento' | translate }}</span>
            <span class="value">{{data.usuario.birth_date | date:'dd/MM/yyyy'}}</span>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="detail-section">
          <h3>{{ 'userDetails.informacionContacto' | translate }}</h3>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.email' | translate }}</span>
            <span class="value">{{data.usuario.email}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.telefonoFijo' | translate }}</span>
            <span class="value">{{data.usuario.phone || ('userDetails.noRegistrado' | translate)}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.telefonoCelular' | translate }}</span>
            <span class="value">{{data.usuario.cell_phone || ('userDetails.noRegistrado' | translate)}}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.direccion' | translate }}</span>
            <span class="value">{{data.usuario.address}}</span>
          </div>
        </div>

        <!-- Información del Sistema -->
        <div class="detail-section">
          <h3>{{ 'userDetails.informacionSistema' | translate }}</h3>
          <div class="detail-row">
            <span class="label">{{ 'userDetails.rol' | translate }}</span>
            <span class="value">{{getRoleName(data.usuario.role)}}</span>
          </div>
        </div>
      </div>
    </mat-card-content>

    <mat-card-actions align="end">
      <button mat-raised-button color="primary" (click)="onEdit()">
        <mat-icon>edit</mat-icon>
        {{ 'userDetails.editar' | translate }}
      </button>
      <button mat-raised-button color="warn" (click)="onDelete()">
        <mat-icon>delete</mat-icon>
        {{ 'userDetails.eliminar' | translate }}
      </button>
      <button mat-button (click)="onClose()" name="cerrar">
        {{ 'userDetails.cerrar' | translate }}
      </button>
    </mat-card-actions>
  </mat-card>
</div>
  `,
  styles: [`
    .modal-container {
      height: calc(100vh - 100px);
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    .details-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    .modal-header {
      background: linear-gradient(135deg, #1654DB 0%, #1848B8 100%);
      padding: 20px;
      border-radius: 4px 4px 0 0;
    }

    .header-title {
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      font-size: 1.5rem;
      font-weight: 500;
    }

    .header-title mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .card-content {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      margin: 0;
    }

    .user-details {
      padding: 0;
      max-width: 100%;
    }

    .detail-section {
      margin-bottom: 24px;
      width: 100%;
    }

    .detail-section h3 {
      color: #1654DB;
      margin-bottom: 16px;
      font-size: 1.1em;
      border-bottom: 2px solid #1654DB;
      padding-bottom: 8px;
    }

    .detail-row {
      display: flex;
      margin-bottom: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 4px;
      width: 100%;
    }

    .label {
      font-weight: 500;
      min-width: 150px;
      color: #495057;
    }

    .value {
      color: #212529;
      flex: 1;
      word-break: break-word;
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 8px;
      justify-content: flex-end;
      background: #f8f9fa;
      border-top: 1px solid #dee2e6;
      margin: 0;
    }

    button {
      margin: 0;
    }

    /* Estilo para la barra de desplazamiento */
    .card-content::-webkit-scrollbar {
      width: 8px;
    }

    .card-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    .card-content::-webkit-scrollbar-thumb {
      background: #1654DB;
      border-radius: 4px;
    }

    .card-content::-webkit-scrollbar-thumb:hover {
      background: #1848B8;
    }
  `]
})
export class UserDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  getGender(gender: string): string {
    const genderMap: { [key: string]: string } = {
      'M': 'Masculino',
      'F': 'Femenino',
      'O': 'Otro'
    };
    return genderMap[gender] || gender;
  }

  getRoleName(role: number): string {
    const roleMap: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Usuario',
      3: 'Super Usuario'
    };
    return roleMap[role] || `Rol ${role}`;
  }

  onEdit(): void {
    this.dialogRef.close({ action: 'edit', usuario: this.data.usuario });
  }

  onDelete(): void {
    this.dialogRef.close({ action: 'delete', usuario: this.data.usuario });
  }

  onClose(): void {
    this.dialogRef.close();
  }
} 