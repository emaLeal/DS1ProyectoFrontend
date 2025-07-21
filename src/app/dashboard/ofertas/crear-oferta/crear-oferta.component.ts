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
import { Router } from '@angular/router';
import { JobOffer, OfertasService } from '../../../services/ofertas.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-crear-oferta',
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
    MatCardModule,
    TranslateModule
  ],
  template: `
   <div class="form-container" [@fadeIn]>
  <mat-card class="form-card">
    <mat-card-header>
      <mat-icon mat-card-avatar>work</mat-icon>
      <mat-card-title>{{ 'crear-oferta.titleCard' | translate }}</mat-card-title>
      <mat-card-subtitle>{{ 'crear-oferta.subtitleCard' | translate }}</mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      <form #ofertaForm="ngForm" class="offer-form" (ngSubmit)="guardar()">
        <!-- Información Básica -->
        <div class="form-section">
          <h3>
            <mat-icon>info</mat-icon>
            {{ 'crear-oferta.basicInfo' | translate }}
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.title' | translate }}</mat-label>
              <input matInput [(ngModel)]="oferta.title" name="title" required maxlength="255" #title="ngModel">
              <mat-error *ngIf="title.invalid && (title.dirty || title.touched)">
                <span *ngIf="title.errors?.['required']">{{ 'crear-oferta.titleRequired' | translate }}</span>
                <span *ngIf="title.errors?.['maxlength']">{{ 'crear-oferta.titleMaxLength' | translate }}</span>
              </mat-error>
              <mat-hint align="end">{{title.value?.length || 0}}/255</mat-hint>
              <mat-icon matSuffix>title</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.responsibilities' | translate }}</mat-label>
              <textarea matInput [(ngModel)]="oferta.responsibilities" name="responsibilities" required rows="4" #responsibilities="ngModel"></textarea>
              <mat-error *ngIf="responsibilities.invalid && (responsibilities.dirty || responsibilities.touched)">
                {{ 'crear-oferta.responsibilitiesRequired' | translate }}
              </mat-error>
              <mat-icon matSuffix>assignment</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Requisitos -->
        <div class="form-section">
          <h3>
            <mat-icon>school</mat-icon>
            {{ 'crear-oferta.requirements' | translate }}
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.educationLevel' | translate }}</mat-label>
              <mat-select data-testid="education-select" [(ngModel)]="oferta.education_level" name="education_level" required maxlength="100" #education="ngModel">
                <mat-option value="Bachiller">{{ 'crear-oferta.Bachiller' | translate }}</mat-option>
                  <mat-option value="Técnico">{{ 'crear-oferta.Tecnico' | translate }}</mat-option>
                  <mat-option value="Tecnólogo">{{ 'crear-oferta.Tecnologo' | translate }}</mat-option>
                  <mat-option value="Profesional">{{ 'crear-oferta.Profesional' | translate }}</mat-option>
                  <mat-option value="Especialización">{{ 'crear-oferta.Especializacion' | translate }}</mat-option>
                  <mat-option value="Maestría">{{ 'crear-oferta.Maestria' | translate }}</mat-option>
                  <mat-option value="Doctorado">{{ 'crear-oferta.Doctorado' | translate }}</mat-option>
              </mat-select>
              <mat-error *ngIf="education.invalid && (education.dirty || education.touched)">
                {{ 'crear-oferta.educationLevelRequired' | translate }}
              </mat-error>
              <mat-icon matSuffix>school</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.rank' | translate }}</mat-label>
              <mat-select data-testid="rank"[(ngModel)]="oferta.rank" name="rank" required #rank="ngModel">
                <mat-option [value]="'Junior'">Junior</mat-option>
                <mat-option [value]="'SemiSenior'">Semi Senior</mat-option>
                <mat-option [value]="'Senior'">Senior</mat-option>
                <mat-option [value]="'Lead'">Lead</mat-option>
              </mat-select>
              <mat-error *ngIf="rank.invalid && (rank.dirty || rank.touched)">
                {{ 'crear-oferta.rankRequired' | translate }}
              </mat-error>
              <mat-icon matSuffix>trending_up</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.otherRequirements' | translate }}</mat-label>
              <textarea matInput [(ngModel)]="oferta.other_requirements" name="other_requirements" required rows="4" #requirements="ngModel"></textarea>
              <mat-error *ngIf="requirements.invalid && (requirements.dirty || requirements.touched)">
                {{ 'crear-oferta.otherRequirementsRequired' | translate }}
              </mat-error>
              <mat-icon matSuffix>list_alt</mat-icon>
            </mat-form-field>
          </div>
        </div>

        <!-- Detalles del Empleo -->
        <div class="form-section">
          <h3>
            <mat-icon>business_center</mat-icon>
            {{ 'crear-oferta.jobDetails' | translate }}
          </h3>
          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.jobType' | translate }}</mat-label>
              <mat-select data-testid="job_type" [(ngModel)]="oferta.job_type" name="job_type" required maxlength="50" #jobType="ngModel">
               <mat-option value="Tiempo Completo">{{ 'crear-oferta.TiempoCompleto' | translate }}</mat-option>
                  <mat-option value="Medio Tiempo">{{ 'crear-oferta.MedioTiempo' | translate }}</mat-option>
                  <mat-option value="Freelance">{{ 'crear-oferta.Freelance' | translate }}</mat-option>
                  <mat-option value="Temporal">{{ 'crear-oferta.Temporal' | translate }}</mat-option>
                  <mat-option value="Prácticas">{{ 'crear-oferta.Practicas' | translate }}</mat-option>
              </mat-select>
              <mat-error *ngIf="jobType.invalid && (jobType.touched || jobType.dirty || jobType.value === '' || jobType.value == null)">
                {{ 'crear-oferta.jobTypeRequired' | translate }}
              </mat-error>
              <mat-icon matSuffix>work</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.salary' | translate }}</mat-label>
              <input matInput type="number" [(ngModel)]="oferta.salary" name="salary" required min="1" max="9999999999.99" step="0.01" #salary="ngModel">
              <mat-error *ngIf="salary.invalid && (salary.dirty || salary.touched)">
                <span *ngIf="salary.errors?.['required']">{{ 'crear-oferta.salaryRequired' | translate }}</span>
                <span *ngIf="salary.errors?.['min']">{{ 'crear-oferta.salaryMin' | translate }}</span>
                <span *ngIf="salary.errors?.['max']">{{ 'crear-oferta.salaryMax' | translate }}</span>
              </mat-error>
              <mat-icon matSuffix>attach_money</mat-icon>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.startDate' | translate }}</mat-label>
              <input matInput
                     [matDatepicker]="pickerInicio"
                     [(ngModel)]="oferta.start_date"
                     name="start_date"
                     required
                     #fechaInicioInput="ngModel"
                     (blur)="fechaInicioInput.control.markAsTouched()"
                     (dateChange)="fechaInicioInput.control.markAsTouched()"
                     readonly>
              <mat-datepicker-toggle matSuffix [for]="pickerInicio"></mat-datepicker-toggle>
              <mat-datepicker #pickerInicio (closed)="fechaInicioInput.control.markAsTouched()"></mat-datepicker>
              <mat-error *ngIf="fechaInicioInput.invalid && (fechaInicioInput.touched || fechaInicioInput.dirty || !oferta.start_date)">
                <ng-container *ngIf="!oferta.start_date">
                  La fecha de inicio es obligatoria
                </ng-container>
                <ng-container *ngIf="fechaInicioInput.errors?.['matDatepickerParse']">
                  Ingresa una fecha válida
                </ng-container>
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>{{ 'crear-oferta.endDate' | translate }}</mat-label>
              <input matInput
                     [matDatepicker]="pickerFin"
                     [(ngModel)]="oferta.end_date"
                     name="end_date"
                     required
                     #fechaFinInput="ngModel"
                     (blur)="fechaFinInput.control.markAsTouched()"
                     (dateChange)="fechaFinInput.control.markAsTouched()"
                     readonly>
              <mat-datepicker-toggle matSuffix [for]="pickerFin"></mat-datepicker-toggle>
              <mat-datepicker #pickerFin (closed)="fechaFinInput.control.markAsTouched()"></mat-datepicker>
              <mat-error *ngIf="fechaFinInput.invalid && (fechaFinInput.touched || fechaFinInput.dirty || !oferta.end_date)">
                <ng-container *ngIf="!oferta.end_date">
                  La fecha de fin es obligatoria
                </ng-container>
                <ng-container *ngIf="fechaFinInput.errors?.['matDatepickerParse']">
                  Ingresa una fecha válida
                </ng-container>
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <mat-card-actions align="end">
          <button mat-button type="button" (click)="cancelar()">
            <mat-icon>close</mat-icon>
            {{ 'crear-oferta.cancel' | translate }}
          </button>
          <button mat-raised-button name="submit" color="primary" type="submit" [disabled]="!ofertaForm.form.valid || ofertaForm.form.pristine">
            <mat-icon>save</mat-icon>
            {{ 'crear-oferta.save' | translate }}
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
      margin-bottom: 20px;
    }

    mat-card-title {
      color: white;
      margin: 0;
      font-size: 1.5rem;
    }

    mat-card-subtitle {
      color: rgba(255, 255, 255, 0.8);
      margin: 8px 0 0 0;
    }

    mat-card-avatar {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      padding: 8px;
    }

    mat-card-actions {
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button[color="primary"] {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
    }

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .form-container {
        padding: 10px;
      }
    }

    mat-error {
      font-size: 12px;
      margin-top: 4px;
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class CrearOfertaComponent implements OnInit {
  @ViewChild('ofertaForm') ofertaForm!: NgForm;
  
  private ofertasService = inject(OfertasService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  oferta: JobOffer = {
    title: '',
    responsibilities: '',
    education_level: '',
    rank: '',
    other_requirements: '',
    job_type: '',
    salary: 0,
    start_date: '', // string vacío para cumplir el tipo
    end_date: '',   // string vacío para cumplir el tipo
    status: 'active'
  };

  ngOnInit() {
    const userData = localStorage.getItem('user_data');
    console.log('CrearOferta - User Data:', userData);
    
    if (userData) {
      const user = JSON.parse(userData);
      console.log('CrearOferta - Parsed User Data:', user);
      this.oferta.talent_director_document = user.document_id;
      console.log('CrearOferta - Set talent_director_document:', this.oferta.talent_director_document);
    } else {
      console.error('CrearOferta - No user data found');
      this.mostrarMensaje('Error: No se encontró la información del usuario', 'error');
      this.router.navigate(['/login']);
    }
  }

  guardar() {
    console.log('CrearOferta - Iniciando guardado de oferta');
    console.log('CrearOferta - Estado del formulario:', {
      valid: this.ofertaForm.form.valid,
      pristine: this.ofertaForm.form.pristine,
      touched: this.ofertaForm.form.touched
    });
    console.log('CrearOferta - Datos de la oferta:', this.oferta);
    console.log('CrearOferta - Valor del rango:', this.oferta.rank);

    // Asegura que el campo talent_director_document esté presente
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      this.oferta.talent_director_document = user.document_id;
    }

    if (this.validarFormulario()) {
      console.log('CrearOferta - Formulario válido, procediendo a guardar');
      this.ofertasService.crearOferta(this.oferta).subscribe({
        next: (ofertaCreada) => {
          console.log('CrearOferta - Oferta creada exitosamente:', ofertaCreada);
          this.mostrarMensaje('Oferta guardada exitosamente', 'success');
          this.router.navigate(['/dashboard/ofertas-activas']);
        },
        error: (error) => {
          console.error('CrearOferta - Error al guardar la oferta:', error);
          this.mostrarMensaje(error, 'error');
        }
      });
    } else {
      console.warn('CrearOferta - Formulario inválido');
      this.mostrarMensaje('Por favor complete todos los campos requeridos correctamente', 'error');
    }
  }

  cancelar() {
    this.router.navigate(['/dashboard/ofertas-activas']);
  }

  private validarFormulario(): boolean {
    console.log('CrearOferta - Validando formulario');
    console.log('CrearOferta - Estado del formulario:', {
      valid: this.ofertaForm.form.valid,
      pristine: this.ofertaForm.form.pristine,
      touched: this.ofertaForm.form.touched
    });
    console.log('CrearOferta - Datos de la oferta:', this.oferta);
    console.log('CrearOferta - Valor del rango:', this.oferta.rank);

    // Validar campos requeridos
    if (!this.oferta.title || !this.oferta.responsibilities || !this.oferta.education_level || 
        !this.oferta.rank || !this.oferta.other_requirements || !this.oferta.job_type || 
        !this.oferta.salary) {
      console.warn('CrearOferta - Campos requeridos faltantes');
      return false;
    }

    // Validar que el rango sea uno de los valores permitidos
    const rangosPermitidos = ['Junior', 'SemiSenior', 'Senior', 'Lead'];
    if (!rangosPermitidos.includes(this.oferta.rank)) {
      console.warn('CrearOferta - Rango no válido:', this.oferta.rank);
      this.mostrarMensaje('Por favor seleccione un rango válido', 'error');
      return false;
    }

    // Validar salario
    if (this.oferta.salary <= 0) {
      console.warn('CrearOferta - Salario inválido:', this.oferta.salary);
      this.mostrarMensaje('El salario debe ser mayor a 0', 'error');
      return false;
    }
    
    // Validar fechas
    const fechaInicio = new Date(this.oferta.start_date);
    const fechaFin = new Date(this.oferta.end_date);
    const hoy = new Date();
    
    // if (fechaInicio <= hoy) {
    //   console.warn('CrearOferta - Fecha de inicio inválida:', fechaInicio);
    //   this.mostrarMensaje('La fecha de inicio no puede ser anterior a hoy', 'error');
    //   return false;
    // }

    // if (fechaFin <= fechaInicio) {
    //   console.warn('CrearOferta - Fecha de fin inválida:', fechaFin);
    //   this.mostrarMensaje('La fecha de fin no puede ser anterior a la fecha de inicio', 'error');
    //   return false;
    // }

    console.log('CrearOferta - Validación exitosa');
    return true;
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
} 