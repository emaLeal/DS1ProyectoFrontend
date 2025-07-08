import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../usuarios/usuarios.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RolesService, Role } from '../../roles/roles.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfertasService, JobOffer } from '../../../services/ofertas.service';
import { ConfirmDialogComponent } from '../../usuarios/confirm-dialog.component';


@Component({
  selector: 'app-ofertas-lista',
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatSnackBarModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    // UserDetailsModalCompozent
  ],
  templateUrl: './ofertas-lista.component.html',
  styleUrl: './ofertas-lista.component.css'
})
export class OfertasListaComponent implements OnInit {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;
  usuarios: any[] = [];
  roles: Role[] = [];
  filtroRol: string = '';
  filtroBusqueda: string = '';
  ofertas: JobOffer[] = [];
  ofertasFiltradas: JobOffer[] = [];
  mensajeToast: string = '';
  toastClass: string = '';
  mostrarFormulario = false;
  cargando = false;

    constructor(
    private ofertasService: OfertasService,
    private userService: UsuariosService,
    private rolesService: RolesService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
    this.cargarOfertas();
  }

  cargarRoles() {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        // this.mostrarToast('Error al cargar roles', 'error');
      }
    });
  }

  cargarOfertas() {
      this.cargando = true;
    this.ofertasService.getOfertas().subscribe({
      next: (data) => {
        this.ofertas = data;
        this.cargando = false;
        console.log("Ofertas recibidas:", this.ofertas);
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }


  cargarUsuarios() {
    // this.cargando = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        // this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        // this.mostrarToast('Error al cargar usuarios', 'error');
        // this.cargando = false;
      }
    });
  }

  get aplicarFiltros() {
    return this.ofertasFiltradas = this.ofertas.filter(oferta => {
      const salario = oferta.salary;
      const rango = oferta.rank === 'SemiSenior' ? 'Semi Senior' : oferta.rank;
      return (
        (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || rango === this.filtroRango) &&
        (this.filtroSalario === null || salario >= this.filtroSalario)
      );
    });
  }

  get usuariosFiltrados() {
    const texto = this.filtroBusqueda.toLowerCase();
    return this.usuarios.filter((usuario: any) => {
      const cumpleRol = this.filtroRol ? usuario.role.toString() === this.filtroRol : true;
      const cumpleBusqueda = texto
        ? (usuario.name?.toLowerCase().includes(texto) ||
           usuario.last_name?.toLowerCase().includes(texto) ||
           usuario.email?.toLowerCase().includes(texto))
        : true;
      return cumpleRol && cumpleBusqueda;
    });
  }

  borrarOferta(oferta: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: '¿Estás seguro que deseas eliminar esta oferta? Esta acción no se puede deshacer.',
        oferta: oferta
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargando = true;
        this.ofertasService.eliminarOferta(oferta.id).subscribe({
          next: () => {
            this.cargarOfertas()
            this.mostrarToast(`oferta eliminado exitosamente`, 'success');
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
            this.mostrarToast(this.obtenerMensajeError(err), 'error');
            this.cargando = false;
          }
        });
      }
    });
  }
  
    obtenerMensajeError(error: any): string {
    console.log('Error completo recibido:', error);
    
    if (error.error && typeof error.error === 'object') {
      // Si el error contiene múltiples campos con error
      const errores = Object.entries(error.error)
        .map(([campo, mensaje]) => `${campo}: ${mensaje}`)
        .join('\n');
      return errores || 'Error en los datos ingresados';
    }
    
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.detail) {
      return error.error.detail;
    }
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.status === 400) {
      return 'Datos inválidos. Por favor verifica la información.';
    }
    if (error.status === 409) {
      return 'Ya existe un usuario con ese documento o email.';
    }
    return 'Error al procesar la solicitud. Por favor intenta de nuevo.';
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeToast = mensaje;
    this.toastClass = `toast toast-${tipo}`;
    setTimeout(() => {
      this.mensajeToast = '';
    }, 4000);
  }

}


