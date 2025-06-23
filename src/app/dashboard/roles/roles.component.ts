import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { RolesService, Role, CreateRoleRequest } from './roles.service';
import { ConfirmDialogComponent, DialogData } from './confirm-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface ExtendedRole extends Role {
  icon?: string;
  name?: string;
  permissions?: string[];
  usersCount?: number;
  isDefault?: boolean;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatChipsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  roles: ExtendedRole[] = [];
  rolesFiltrados: ExtendedRole[] = [];
  filtro = '';
  mostrarFormulario = false;
  rolSeleccionado: ExtendedRole | null = null;
  cargando = false;
  
  form: { id: number | null; description: string } = {
    id: null,
    description: ''
  };

  displayedColumns: string[] = ['id', 'description', 'actions'];

  constructor(
    private rolesService: RolesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.cargarRoles();
  }

  openNewRoleDialog() {
    this.abrirFormulario();
  }

  editRole(role: ExtendedRole) {
    this.editarRol(role);
  }

  deleteRole(role: ExtendedRole) {
    this.eliminarRol(role);
  }

  cargarRoles() {
    this.cargando = true;
    this.rolesService.getRoles().subscribe({
      next: (data) => {
        // Extend the roles with additional properties
        this.roles = data.map(role => ({
          ...role,
          icon: 'security',
          name: role.description,
          permissions: ['Ver', 'Editar', 'Eliminar'],
          usersCount: 0,
          isDefault: role.id === 1
        }));
        this.rolesFiltrados = [...this.roles];
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.cargando = false;
        this.showSnackBar('Error al cargar roles', 'error');
      }
    });
  }

  filtrarRoles() {
    this.rolesFiltrados = this.roles.filter(rol =>
      rol.description.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }

  abrirFormulario() {
    this.form = { id: null, description: '' };
    this.rolSeleccionado = null;
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.rolSeleccionado = null;
    this.form = { id: null, description: '' };
  }

  editarRol(rol: ExtendedRole) {
    this.rolSeleccionado = rol;
    this.form = { id: rol.id, description: rol.description };
    this.mostrarFormulario = true;
  }

  guardarRol() {
    if (!this.form.description.trim()) {
      this.showSnackBar('La descripción del rol es requerida', 'error');
      return;
    }

    // Validar ID solo si se proporciona
    if (this.form.id !== null && this.form.id !== undefined) {
      const idNumber = Number(this.form.id);
      if (!Number.isInteger(idNumber) || idNumber <= 0) {
        this.showSnackBar('El ID debe ser un número entero positivo', 'error');
        return;
      }
    }

    this.cargando = true;

    if (this.rolSeleccionado) {
      // Actualizar rol existente
      if (this.form.id && Number(this.form.id) !== this.rolSeleccionado.id) {
        // Crear nuevo y eliminar anterior si el ID cambió
        const newRoleData: CreateRoleRequest = {
          id: Number(this.form.id),
          description: this.form.description
        };
        this.rolesService.createRole(newRoleData).subscribe({
          next: () => {
            if (this.rolSeleccionado) {
              this.rolesService.deleteRole(this.rolSeleccionado.id).subscribe({
                next: () => {
                  this.cargarRoles();
                  this.cerrarFormulario();
                  this.showSnackBar('Rol actualizado exitosamente', 'success');
                },
                error: (error) => {
                  console.error('Error al eliminar rol anterior:', error);
                  this.cargando = false;
                  this.showSnackBar('El nuevo rol se creó pero no se pudo eliminar el anterior', 'warn');
                  this.cargarRoles();
                }
              });
            }
          },
          error: (error) => {
            console.error('Error al crear nuevo rol:', error);
            this.cargando = false;
            this.showSnackBar('Error al actualizar el rol', 'error');
          }
        });
      } else {
        // Update normal si el ID no cambió
        const updateData: Partial<Role> = {
          description: this.form.description
        };
        this.rolesService.updateRole(this.rolSeleccionado.id, updateData).subscribe({
          next: () => {
            this.cargarRoles();
            this.cerrarFormulario();
            this.showSnackBar('Rol actualizado exitosamente', 'success');
          },
          error: (error) => {
            console.error('Error al actualizar rol:', error);
            this.cargando = false;
            this.showSnackBar('Error al actualizar el rol', 'error');
          }
        });
      }
    } else {
      // Crear nuevo rol
      const payload: CreateRoleRequest = {
        description: this.form.description
      };
      
      // Solo agregamos el ID si se especificó y es válido
      if (this.form.id !== null && 
          this.form.id !== undefined && 
          Number(this.form.id) > 0) {
        payload.id = Number(this.form.id);
      }
      // Si no se especifica ID o está vacío, no incluimos la propiedad id
      
      console.log('Payload a enviar:', payload); // Para debugging
      
      this.rolesService.createRole(payload).subscribe({
        next: () => {
          this.cargarRoles();
          this.cerrarFormulario();
          this.showSnackBar('Rol creado exitosamente', 'success');
        },
        error: (error) => {
          console.error('Error al crear rol:', error);
          this.cargando = false;
          this.showSnackBar('Error al crear el rol', 'error');
        }
      });
    }
  }

  eliminarRol(rol: ExtendedRole) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { 
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar el rol "${rol.description}"?`
      } as DialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargando = true;
        this.rolesService.deleteRole(rol.id).subscribe({
          next: () => {
            this.cargarRoles();
            this.showSnackBar('Rol eliminado exitosamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar rol:', error);
            this.cargando = false;
            this.showSnackBar('Error al eliminar el rol', 'error');
          }
        });
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error' | 'warn') {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: [`snackbar-${type}`]
    });
  }
}