import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { PostulantesService, UsuarioPostulante } from '../../services/postulantes.service';
import './todos-postulantes.component.css';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import TranslateLogic from '../../lib/translate/translate.class';

@Component({
  selector: 'app-todos-postulantes',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, TranslateModule],
  template: `
    <h2 style="margin-bottom: 12px;">{{'all_postulants.tittle' | translate}}</h2>
    <div class="tabla-scroll">
      <table mat-table [dataSource]="postulantes" class="mat-elevation-z8 tabla-simple">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.name' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.name}}</td>
            </ng-container>
            <ng-container matColumnDef="last_name">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.last_name' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.last_name}}</td>
            </ng-container>
             <ng-container matColumnDef="identification_type">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.id_type' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.identification_type}}</td>
            </ng-container>
            <ng-container matColumnDef="document_id">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.document_id' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.document_id}}</td>
            </ng-container>
            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.email' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.email}}</td>
            </ng-container>
            <ng-container matColumnDef="phone">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.phone' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.phone}}</td>
            </ng-container>
            <ng-container matColumnDef="cell_phone">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.cell_phone' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.cell_phone}}</td>
            </ng-container>
            <!-- <ng-container matColumnDef="gender">
              <th mat-header-cell *matHeaderCellDef>Género</th>
              <td mat-cell *matCellDef="let p">{{p.gender}}</td>
            </ng-container> -->
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>{{'all_postulants.address' | translate}}</th>
              <td mat-cell *matCellDef="let p">{{p.address}}</td>
            </ng-container>
           
            <!-- <ng-container matColumnDef="birth_date">
              <th mat-header-cell *matHeaderCellDef>Fecha Nacimiento</th>
              <td mat-cell *matCellDef="let p">{{p.birth_date | date:'yyyy-MM-dd'}}</td>
            </ng-container> -->
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </div>
  `
})
export class TodosPostulantesComponent extends TranslateLogic implements OnInit {
  postulantes: UsuarioPostulante[] = [];
  displayedColumns = [
    'name', 'last_name', 'identification_type', 'document_id', 'email', 'cell_phone', 'address',
  ];

  constructor(private postulantesService: PostulantesService, translate: TranslateService) {
    super(translate)
  }

  ngOnInit() {
    this.postulantesService.getUsuariosPostulantes().subscribe(data => {
      this.postulantes = data;
    });
  }
} 