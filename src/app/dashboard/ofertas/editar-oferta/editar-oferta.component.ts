import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { JobOffer, OfertasService } from '../../../services/ofertas.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-editar-oferta',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule
  ],
  template: `
    <div class="form-container" [@fadeIn]>
      <mat-card class="form-card">
        <mat-card-header>
          <mat-icon mat-card-avatar>edit</mat-icon>
          <mat-card-title>Editar Oferta Laboral</mat-card-title>
          <mat-card-subtitle>Modifique los detalles de la oferta</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form #ofertaForm="ngForm" class="offer-form" (ngSubmit)="guardar()">
            <!-- Información Básica -->
            <div class="form-section">
              <h3>
                <mat-icon>info</mat-icon>
                Información Básica
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Título de la Oferta</mat-label>
                  <input matInput [(ngModel)]="oferta.title" name="title" required maxlength="10" #title="ngModel">
                  <mat-error *ngIf="title.invalid && (title.dirty || title.touched)">
                    <span *ngIf="title.errors?.['required']">El título es requerido</span>
                    <span *ngIf="title.errors?.['maxlength']">El título no puede tener más de 10 caracteres</span>
                  </mat-error>
                  <mat-hint align="end">{{title.value?.length || 0}}/10</mat-hint>
                  <mat-icon matSuffix>title</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Responsabilidades</mat-label>
                  <textarea matInput [(ngModel)]="oferta.responsibilities" name="responsibilities" required rows="4" #responsibilities="ngModel"></textarea>
                  <mat-error *ngIf="responsibilities.invalid && (responsibilities.dirty || responsibilities.touched)">
                    Las responsabilidades son requeridas
                  </mat-error>
                  <mat-icon matSuffix>assignment</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Requisitos -->
            <div class="form-section">
              <h3>
                <mat-icon>school</mat-icon>
                Requisitos
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Nivel de Educación</mat-label>
                  <mat-select [(ngModel)]="oferta.education_level" name="education_level" required #education="ngModel">
                    <mat-option value="Bachiller">Bachiller</mat-option>
                    <mat-option value="Técnico">Técnico</mat-option>
                    <mat-option value="Tecnólogo">Tecnólogo</mat-option>
                    <mat-option value="Profesional">Profesional</mat-option>
                    <mat-option value="Especialización">Especialización</mat-option>
                    <mat-option value="Maestría">Maestría</mat-option>
                    <mat-option value="Doctorado">Doctorado</mat-option>
                  </mat-select>
                  <mat-error *ngIf="education.invalid && (education.dirty || education.touched)">
                    El nivel de educación es requerido
                  </mat-error>
                  <mat-icon matSuffix>school</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Rango</mat-label>
                  <mat-select [(ngModel)]="oferta.rank" name="rank" required #rank="ngModel">
                    <mat-option value="Junior">Junior</mat-option>
                    <mat-option value="Semi Senior">Semi Senior</mat-option>
                    <mat-option value="Senior">Senior</mat-option>
                    <mat-option value="Lead">Lead</mat-option>
                  </mat-select>
                  <mat-error *ngIf="rank.invalid && (rank.dirty || rank.touched)">
                    El rango es requerido
                  </mat-error>
                  <mat-icon matSuffix>trending_up</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Otros Requisitos</mat-label>
                  <textarea matInput [(ngModel)]="oferta.other_requirements" name="other_requirements" required rows="4" #requirements="ngModel"></textarea>
                  <mat-error *ngIf="requirements.invalid && (requirements.dirty || requirements.touched)">
                    Los otros requisitos son requeridos
                  </mat-error>
                  <mat-icon matSuffix>list_alt</mat-icon>
                </mat-form-field>
              </div>
            </div>

            <!-- Detalles del Empleo -->
            <div class="form-section">
              <h3>
                <mat-icon>business_center</mat-icon>
                Detalles del Empleo
              </h3>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Tipo de Empleo</mat-label>
                  <mat-select [(ngModel)]="oferta.job_type" name="job_type" required #jobType="ngModel">
                    <mat-option value="Tiempo Completo">Tiempo Completo</mat-option>
                    <mat-option value="Medio Tiempo">Medio Tiempo</mat-option>
                    <mat-option value="Freelance">Freelance</mat-option>
                    <mat-option value="Temporal">Temporal</mat-option>
                    <mat-option value="Prácticas">Prácticas</mat-option>
                  </mat-select>
                  <mat-error *ngIf="jobType.invalid && (jobType.dirty || jobType.touched)">
                    El tipo de empleo es requerido
                  </mat-error>
                  <mat-icon matSuffix>work</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Salario</mat-label>
                  <input matInput type="number" [(ngModel)]="oferta.salary" name="salary" required min="1" #salary="ngModel">
                  <mat-error *ngIf="salary.invalid && (salary.dirty || salary.touched)">
                    El salario es requerido y debe ser mayor a 0
                  </mat-error>
                  <mat-icon matSuffix>attach_money</mat-icon>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Inicio</mat-label>
                  <input matInput [matDatepicker]="startPicker" [(ngModel)]="oferta.start_date" name="start_date" required #startDate="ngModel">
                  <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
                  <mat-datepicker #startPicker></mat-datepicker>
                  <mat-error *ngIf="startDate.invalid && (startDate.dirty || startDate.touched)">
                    La fecha de inicio es requerida
                  </mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>Fecha de Fin</mat-label>
                  <input matInput [matDatepicker]="endPicker" [(ngModel)]="oferta.end_date" name="end_date" required #endDate="ngModel">
                  <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
                  <mat-datepicker #endPicker></mat-datepicker>
                  <mat-error *ngIf="endDate.invalid && (endDate.dirty || endDate.touched)">
                    La fecha de fin es requerida
                  </mat-error>
                </mat-form-field>
              </div>
            </div>

            <mat-card-actions align="end">
              <button mat-button type="button" (click)="cancelar()">
                <mat-icon>close</mat-icon>
                Cancelar
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="!ofertaForm.form.valid">
                <mat-icon>save</mat-icon>
                Guardar Cambios
              </button>
            </mat-card-actions>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .form-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .offer-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
    }

    .form-section {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .form-section h3 {
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      font-size: 1.1rem;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }

    mat-form-field {
      flex: 1;
    }

    textarea {
      min-height: 100px;
    }

    mat-card-header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 16px;
      border-radius: 8px 8px 0 0;
    }

    mat-card-title, mat-card-subtitle {
      color: white !important;
    }

    mat-card-actions {
      padding: 16px;
      gap: 8px;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class EditarOfertaComponent implements OnInit {
  @ViewChild('ofertaForm') ofertaForm!: NgForm;

  private ofertasService = inject(OfertasService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  oferta: JobOffer = {
    title: '',
    responsibilities: '',
    education_level: '',
    rank: '',
    other_requirements: '',
    job_type: '',
    salary: 0,
    start_date: new Date(),
    end_date: new Date(),
    status: 'active'
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarOferta(id);
    } else {
      this.mostrarMensaje('No se encontró el ID de la oferta', 'error');
      this.router.navigate(['/dashboard/ofertas-activas']);
    }
  }

  cargarOferta(id: string) {
    this.ofertasService.getOferta(Number(id)).subscribe({
      next: (oferta: JobOffer) => {
        this.oferta = {
          ...oferta,
          start_date: new Date(oferta.start_date),
          end_date: new Date(oferta.end_date)
        };
      },
      error: (error: Error) => {
        console.error('Error al cargar la oferta:', error);
        this.mostrarMensaje('Error al cargar la oferta', 'error');
        this.router.navigate(['/dashboard/ofertas-activas']);
      }
    });
  }

  guardar() {
    if (this.validarFormulario()) {
      const ofertaActualizada: Partial<JobOffer> = {
        ...this.oferta,
        start_date: this.formatearFecha(this.oferta.start_date),
        end_date: this.formatearFecha(this.oferta.end_date)
      };

      if (!this.oferta.id) {
        this.mostrarMensaje('Error: No se encontró el ID de la oferta', 'error');
        return;
      }

      this.ofertasService.actualizarOferta(this.oferta.id, ofertaActualizada).subscribe({
        next: () => {
          this.mostrarMensaje('Oferta actualizada exitosamente', 'success');
          this.router.navigate(['/dashboard/ofertas-activas']);
        },
        error: (error: Error) => {
          console.error('Error al actualizar la oferta:', error);
          this.mostrarMensaje('Error al actualizar la oferta', 'error');
        }
      });
    }
  }

  cancelar() {
    this.router.navigate(['/dashboard/ofertas-activas']);
  }

  private validarFormulario(): boolean {
    if (!this.ofertaForm.valid) {
      this.mostrarMensaje('Por favor complete todos los campos requeridos', 'error');
      return false;
    }

    if (this.oferta.end_date < this.oferta.start_date) {
      this.mostrarMensaje('La fecha de fin no puede ser anterior a la fecha de inicio', 'error');
      return false;
    }

    if (this.oferta.salary <= 0) {
      this.mostrarMensaje('El salario debe ser mayor a 0', 'error');
      return false;
    }

    return true;
  }

  private formatearFecha(fecha: any): string {
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    return fecha;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
} 