import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PostulantesService, UsuarioPostulante } from '../../services/postulantes.service';
import './todos-postulantes.component.css';

@Component({
  selector: 'app-todos-postulantes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Todos los postulantes registrados</mat-card-title>
      <mat-card-content>
        <div class="tabla-scroll">
          <table mat-table [dataSource]="postulantes" class="mat-elevation-z8">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let p">{{p.name}}</td>
            </ng-container>
            <ng-container matColumnDef="last_name">
              <th mat-header-cell *matHeaderCellDef>Apellido</th>
              <td mat-cell *matCellDef="let p">{{p.last_name}}</td>
            </ng-container>
            <ng-container matColumnDef="document_id">
              <th mat-header-cell *matHeaderCellDef>Cédula</th>
              <td mat-cell *matCellDef="let p">{{p.document_id}}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>Email</th>
              <td mat-cell *matCellDef="let p">{{p.email}}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>Teléfono</th>
              <td mat-cell *matCellDef="let p">{{p.phone}}</td>
            </ng-container>
            <ng-container matColumnDef="cell_phone">
              <th mat-header-cell *matHeaderCellDef>Celular</th>
              <td mat-cell *matCellDef="let p">{{p.cell_phone}}</td>
            </ng-container>
            <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef>Género</th>
              <td mat-cell *matCellDef="let p">{{p.gender}}</td>
            </ng-container>
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Dirección</th>
              <td mat-cell *matCellDef="let p">{{p.address}}</td>
            </ng-container>
            <ng-container matColumnDef="identification_type">
              <th mat-header-cell *matHeaderCellDef>Tipo ID</th>
              <td mat-cell *matCellDef="let p">{{p.identification_type}}</td>
            </ng-container>
            <ng-container matColumnDef="birth_date">
              <th mat-header-cell *matHeaderCellDef>Fecha Nacimiento</th>
              <td mat-cell *matCellDef="let p">{{p.birth_date | date:'yyyy-MM-dd'}}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
      </mat-card-content>
    </mat-card>
  `
})
export class TodosPostulantesComponent implements OnInit {
  postulantes: UsuarioPostulante[] = [];
  displayedColumns = [
    'name', 'last_name', 'document_id', 'email', 'phone', 'cell_phone', 'gender', 'address', 'identification_type', 'birth_date'
  ];

  constructor(private postulantesService: PostulantesService) {}

  ngOnInit() {
    this.postulantesService.getUsuariosPostulantes().subscribe(data => {
      this.postulantes = data;
    });
  }
} 