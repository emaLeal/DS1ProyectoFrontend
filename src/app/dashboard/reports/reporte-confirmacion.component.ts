import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-reporte-confirmacion',
  imports:[MatIcon],
  template: `
    <div class="dialog-container">
      <mat-icon class="icono-exito">check_circle</mat-icon>
      <h2 class="titulo">¡Reporte generado!</h2>
      <p class="mensaje">
        Tu reporte se ha generado y descargado correctamente.
      </p>
      <div class="acciones">
        <button mat-button class="boton-cerrar" (click)="cerrar()">Aceptar</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      text-align: center;
      padding: 24px;
    }

    .icono-exito {
      font-size: 48px;
      color: #4caf50;
      margin-bottom: 12px;
    }

    .titulo {
      font-weight: bold;
      margin: 0 0 10px 0;
      font-size: 22px;
    }

    .mensaje {
      margin: 0 0 20px 0;
      color: #555;
      font-size: 16px;
    }

    .acciones {
      display: flex;
      justify-content: center;
    }

    .boton-cerrar {
      background-color: #1976d2; /* Azul Material */
      color: white;
      font-weight: bold;
      padding: 6px 18px;
      border-radius: 4px;
    }

    .boton-cerrar:hover {
      background-color: #125ea5;
    }
  `]
})
export class ReporteConfirmacionComponent {
  constructor(private dialogRef: MatDialogRef<ReporteConfirmacionComponent>) {}

  cerrar() {
    this.dialogRef.close();
  }
}
