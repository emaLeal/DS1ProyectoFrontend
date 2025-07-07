import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { RolesService, Role } from '../../roles/roles.service';
import { UsuariosService } from '../usuarios.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Usuario {
  name: string;
  last_name: string;
  email: string;
  cell_phone: string;
  phone?: string;
  document_id: string;
  identification_type: string;
  birth_date: string | Date;
  gender: string;
  address: string;
  role: number;
  role_id?: string;
  password?: string;
  confirm_password?: string;
}

@Component({
  selector: 'app-editar-usuario',
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
    TranslateModule
  ],
  template: `
  <div class="edit-dialog">
  <h2 mat-dialog-title>
    <mat-icon>edit_note</mat-icon>
    {{ 'editarUsuario.titulo' | translate }}
  </h2>

  <mat-dialog-content>
    <form #editForm="ngForm" class="edit-form">
      <!-- Información Personal -->
      <div class="form-section">
        <h3>
          <mat-icon>person</mat-icon>
          {{ 'editarUsuario.informacionPersonal' | translate }}
        </h3>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.nombre' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.name" name="name" required>
            <mat-icon matSuffix>badge</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.apellido' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.last_name" name="last_name" required>
            <mat-icon matSuffix>badge</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.tipoDocumento' | translate }}</mat-label>
            <mat-select [(ngModel)]="usuario.identification_type" name="identification_type" required>
              <mat-option value="CC">{{ 'editarUsuario.cedulaCiudadania' | translate }}</mat-option>
              <mat-option value="CE">{{ 'editarUsuario.cedulaExtranjeria' | translate }}</mat-option>
              <mat-option value="TI">{{ 'editarUsuario.tarjetaIdentidad' | translate }}</mat-option>
              <mat-option value="PP">{{ 'editarUsuario.pasaporte' | translate }}</mat-option>
            </mat-select>
            <mat-icon matSuffix>credit_card</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.numeroDocumento' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.document_id" name="document_id" required>
            <mat-icon matSuffix>pin</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.fechaNacimiento' | translate }}</mat-label>
            <input matInput [matDatepicker]="picker" [(ngModel)]="usuario.birth_date" name="birth_date" required>
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
            <mat-icon matSuffix>cake</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.genero' | translate }}</mat-label>
            <mat-select [(ngModel)]="usuario.gender" name="gender" required>
              <mat-option value="M">{{ 'editarUsuario.masculino' | translate }}</mat-option>
              <mat-option value="F">{{ 'editarUsuario.femenino' | translate }}</mat-option>
              <mat-option value="O">{{ 'editarUsuario.otro' | translate }}</mat-option>
            </mat-select>
            <mat-icon matSuffix>wc</mat-icon>
          </mat-form-field>
        </div>
      </div>

      <!-- Información de Contacto -->
      <div class="form-section">
        <h3>
          <mat-icon>contact_mail</mat-icon>
          {{ 'editarUsuario.informacionContacto' | translate }}
        </h3>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.email' | translate }}</mat-label>
            <input matInput type="email" [(ngModel)]="usuario.email" name="email" required>
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.telefonoCelular' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.cell_phone" name="cell_phone" required>
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.telefonoFijo' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.phone" name="phone">
            <mat-icon matSuffix>phone_in_talk</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.direccion' | translate }}</mat-label>
            <input matInput [(ngModel)]="usuario.address" name="address" required>
            <mat-icon matSuffix>home</mat-icon>
          </mat-form-field>
        </div>
      </div>

      <!-- Información de Cuenta -->
      <div class="form-section">
        <h3>
          <mat-icon>admin_panel_settings</mat-icon>
          {{ 'editarUsuario.informacionCuenta' | translate }}
        </h3>
        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.rol' | translate }}</mat-label>
            <mat-select [(ngModel)]="usuario.role_id" name="role" required>
              <mat-option *ngFor="let rol of roles" [value]="rol.id.toString()">
                {{ rol.description }}
              </mat-option>
            </mat-select>
            <mat-icon matSuffix>security</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.nuevaContrasena' | translate }}</mat-label>
            <input matInput type="password" [(ngModel)]="usuario.password" name="password">
            <mat-icon matSuffix>lock</mat-icon>
            <mat-hint>{{ 'editarUsuario.hintContrasena' | translate }}</mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'editarUsuario.confirmarContrasena' | translate }}</mat-label>
            <input matInput type="password" [(ngModel)]="usuario.confirm_password" name="confirm_password">
            <mat-icon matSuffix>lock_clock</mat-icon>
            <mat-hint>{{ 'editarUsuario.hintContrasena' | translate }}</mat-hint>
          </mat-form-field>
        </div>
      </div>
    </form>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button (click)="cancelar()">
      <mat-icon>close</mat-icon>
      {{ 'editarUsuario.cancelar' | translate }}
    </button>
    <button mat-raised-button color="primary" name="submit_editar" (click)="guardar()" [disabled]="!editForm.form.valid">
      <mat-icon>save</mat-icon>
      {{ 'editarUsuario.guardarCambios' | translate }}
    </button>
  </mat-dialog-actions>
</div>
  `,
  styles: [`
    .edit-dialog {
      padding: 20px;
      max-width: 800px;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1976d2;
      margin: 0 0 20px 0;
    }

    mat-dialog-actions {
      padding: 20px 0 0 0;
    }

    button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class EditarUsuarioComponent {
  usuario: Usuario;
  roles: Role[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private rolesService: RolesService,
    private usuariosService: UsuariosService
  ) {
    this.usuario = { ...data.usuario };
    this.usuario.role_id = this.usuario.role.toString();
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.validarFormulario()) {
      const usuarioActualizado: Partial<Usuario> = {
        name: this.usuario.name,
        last_name: this.usuario.last_name,
        email: this.usuario.email,
        cell_phone: this.usuario.cell_phone.toString(),
        phone: this.usuario.phone ? this.usuario.phone.toString() : '',
        document_id: this.usuario.document_id.toString(),
        identification_type: this.usuario.identification_type,
        birth_date: this.formatearFecha(this.usuario.birth_date),
        gender: this.usuario.gender,
        address: this.usuario.address,
        role: parseInt(this.usuario.role_id!)
      };

      if (this.usuario.password) {
        usuarioActualizado.password = this.usuario.password;
      }

      this.usuariosService.updateUser(this.usuario.document_id, usuarioActualizado).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error al actualizar usuario:', error);
        }
      });
    }
  }

  private validarFormulario(): boolean {
    // Validar que las contraseñas coincidan si se proporciona una nueva
    if (this.usuario.password || this.usuario.confirm_password) {
      if (this.usuario.password !== this.usuario.confirm_password) {
        return false;
      }
    }
    return true;
  }

  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
} 