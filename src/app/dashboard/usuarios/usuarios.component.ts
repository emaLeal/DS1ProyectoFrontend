import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from './usuarios.service';
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
import { trigger, style, animate, transition } from '@angular/animations';
import { RolesService, Role } from '../roles/roles.service';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { UserDetailsModalComponent } from './user-details-modal/user-details-modal.component';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface ColorGradient {
  start: string;
  end: string;
}

interface PredefinedColors {
  [key: number]: ColorGradient;
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-in', style({ opacity: 1, transform: 'scale(1)' })),
      ])
    ])
  ]
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  roles: Role[] = [];
  filtroRol: string = '';
  filtroBusqueda: string = '';
  filtroDocumento: string = '';
  mensajeToast: string = '';
  toastClass: string = '';
  mostrarFormulario = false;
  cargando = false;

  nuevoUsuario: any = {
    name: '',
    last_name: '',
    email: '',
    cell_phone: '',
    phone: '',
    document_id: '',
    identification_type: '',
    birth_date: null, // antes era ''
    gender: '',
    address: '',
    role_id: '',
    password: '',
    confirm_password: ''
  };

  requisitosPassword = {
    length: false,
    hasUpper: false,
    hasLower: false,
    hasNumber: false,
    hasSpecial: false
  };
  cumpleRequisitosPassword = false;

  constructor(
    private userService: UsuariosService,
    private rolesService: RolesService,
    private dialog: MatDialog,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarRoles() {
    this.rolesService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.mostrarToast('Error al cargar roles', 'error');
      }
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.mostrarToast('Error al cargar usuarios', 'error');
        this.cargando = false;
      }
    });
  }

  crearUsuario() {
    if (!this.validarFormulario()) {
      return;
    }

    this.cargando = true;

    // Preparar datos para enviar
    const usuarioParaEnviar: any = {
      name: this.nuevoUsuario.name,
      last_name: this.nuevoUsuario.last_name,
      email: this.nuevoUsuario.email,
      cell_phone: this.nuevoUsuario.cell_phone ? this.nuevoUsuario.cell_phone.toString() : '',
      phone: this.nuevoUsuario.phone ? this.nuevoUsuario.phone.toString() : '',
      document_id: this.nuevoUsuario.document_id.toString(),
      identification_type: this.nuevoUsuario.identification_type,
      birth_date: this.formatearFecha(this.nuevoUsuario.birth_date),
      gender: this.nuevoUsuario.gender,
      address: this.nuevoUsuario.address,
      role: parseInt(this.nuevoUsuario.role_id)
    };

    // Solo incluir contraseña si se proporciona una nueva o es un usuario nuevo
    if (!this.nuevoUsuario.id || this.nuevoUsuario.password) {
      usuarioParaEnviar.password = this.nuevoUsuario.password;
    }

    console.log('Datos a enviar:', usuarioParaEnviar);

    if (this.nuevoUsuario.id) {
      // Actualizar usuario existente
      this.userService.updateUser(usuarioParaEnviar.document_id, usuarioParaEnviar).subscribe({
        next: () => {
          this.mostrarToast('Usuario actualizado exitosamente', 'success');
          this.cerrarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error completo al actualizar:', err);
          console.error('Detalles del error:', err.error);
          this.mostrarToast(this.obtenerMensajeError(err), 'error');
          this.cargando = false;
        }
      });
    } else {
      // Crear nuevo usuario
      this.userService.createUser(usuarioParaEnviar).subscribe({
        next: () => {
          this.mostrarToast('Usuario creado exitosamente', 'success');
          this.cerrarFormulario();
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error completo al crear:', err);
          console.error('Detalles del error:', err.error);
          if (err.error && typeof err.error === 'object') {
            Object.keys(err.error).forEach(key => {
              console.error(`Error en campo ${key}:`, err.error[key]);
            });
          }
          this.mostrarToast(this.obtenerMensajeError(err), 'error');
          this.cargando = false;
        }
      });
    }
  }

  // Función para formatear la fecha al formato esperado por el backend
  formatearFecha(fecha: any): string {
    if (!fecha) return '';
    const d = new Date(fecha);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDocumentInput(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.nuevoUsuario.document_id = value;
  }

  onCellPhoneInput(event: any) {
    const value = event.target.value.replace(/[^0-9]/g, '');
    this.nuevoUsuario.cell_phone = value;
  }

  onCellPhoneChange(value: string) {
    this.nuevoUsuario.cell_phone = value.replace(/[^0-9]/g, '');
  }

  onPasswordInput() {
    const value = this.nuevoUsuario.password || '';
    this.requisitosPassword.length = value.length >= 8;
    this.requisitosPassword.hasUpper = /[A-Z]/.test(value);
    this.requisitosPassword.hasLower = /[a-z]/.test(value);
    this.requisitosPassword.hasNumber = /[0-9]/.test(value);
    this.requisitosPassword.hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/]/.test(value);
    this.cumpleRequisitosPassword =
      this.requisitosPassword.length &&
      this.requisitosPassword.hasUpper &&
      this.requisitosPassword.hasLower &&
      this.requisitosPassword.hasNumber &&
      this.requisitosPassword.hasSpecial;
  }

  validarFormulario(): boolean {
    // Validar campos requeridos
    const camposRequeridos = [
      'name',
      'last_name',
      'email',
      'document_id',
      'identification_type',
      'role_id',
      'birth_date',
      'gender',
      'cell_phone',
      'address'
    ];

    for (const campo of camposRequeridos) {
      if (!this.nuevoUsuario[campo]) {
        this.mostrarToast(this.traducirCampoRequerido(campo), 'error');
        return false;
      }
    }

    // Validar contraseñas solo para usuarios nuevos
    if (!this.nuevoUsuario.id) {
      if (!this.nuevoUsuario.password) {
        this.mostrarToast('La contraseña es obligatoria', 'error');
        return false;
      }
      if (this.nuevoUsuario.password !== this.nuevoUsuario.confirm_password) {
        this.mostrarToast('Las contraseñas no coinciden', 'error');
        return false;
      }
    } else {
      if (this.nuevoUsuario.password || this.nuevoUsuario.confirm_password) {
        if (this.nuevoUsuario.password !== this.nuevoUsuario.confirm_password) {
          this.mostrarToast('Las contraseñas no coinciden', 'error');
          return false;
        }
      }
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(this.nuevoUsuario.email)) {
      this.mostrarToast('Ingresa un correo electrónico válido.', 'error');
      return false;
    }

    // Validar documento: solo números, entre 6 y 15 dígitos
    if (!/^[0-9]{6,15}$/.test(this.nuevoUsuario.document_id)) {
      this.mostrarToast('El número de documento debe tener entre 6 y 15 dígitos y solo números', 'error');
      return false;
    }

    // Validar teléfono celular: solo números, al menos 10 dígitos
    if (!/^[0-9]{10,}$/.test(this.nuevoUsuario.cell_phone)) {
      this.mostrarToast('El número de celular debe tener al menos 10 dígitos', 'error');
      return false;
    }

    // Validar teléfono fijo: solo números, entre 7 y 10 dígitos
    if (this.nuevoUsuario.phone && !/^[0-9]{7,10}$/.test(this.nuevoUsuario.phone)) {
      this.mostrarToast('El teléfono fijo debe tener entre 7 y 10 dígitos', 'error');
      return false;
    }

    // Validar dirección: al menos 5 caracteres
    if (this.nuevoUsuario.address && this.nuevoUsuario.address.length < 5) {
      this.mostrarToast('La dirección debe tener al menos 5 caracteres', 'error');
      return false;
    }

    return true;
  }

  traducirCampoRequerido(campo: string): string {
    const traducciones: { [key: string]: string } = {
      name: 'El nombre es obligatorio',
      last_name: 'El apellido es obligatorio',
      email: 'El correo electrónico es obligatorio',
      document_id: 'El número de documento es obligatorio',
      identification_type: 'El tipo de documento es obligatorio',
      role_id: 'El rol es obligatorio',
      birth_date: 'La fecha de nacimiento es obligatoria',
      gender: 'El género es obligatorio',
      cell_phone: 'El número de celular es obligatorio',
      address: 'La dirección es obligatoria'
    };
    return traducciones[campo] || `El campo ${campo.replace('_', ' ')} es obligatorio`;
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

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.nuevoUsuario = this.usuarioVacio();
    this.cargando = false;
  }

  usuarioVacio() {
    return {
      name: '',
      last_name: '',
      email: '',
      cell_phone: '',
      phone: '',
      document_id: '',
      identification_type: '',
      birth_date: null, // antes era ''
      gender: '',
      address: '',
      role_id: '',
      password: '',
      confirm_password: ''
    };
  }

  editarUsuario(usuario: any) {
    const dialogRef = this.dialog.open(EditarUsuarioComponent, {
      width: '800px',
      data: { usuario: usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargarUsuarios();
        this.mostrarToast('Usuario actualizado exitosamente', 'success');
      }
    });
  }

  borrarUsuario(usuario: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: '¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.',
        usuario: usuario
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.cargando = true;
        this.userService.deleteUser(usuario.document_id).subscribe({
          next: () => {
            this.usuarios = this.usuarios.filter((u: any) => u.document_id !== usuario.document_id);
            this.mostrarToast(`Usuario ${usuario.name} eliminado exitosamente`, 'success');
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

  getRoleName(role: number | string): string {
    const roleNum = typeof role === 'string' ? parseInt(role) : role;
    const foundRole = this.roles.find(r => r.id === roleNum);
    return foundRole ? foundRole.description : 'Rol Desconocido';
  }

  getRoleStyle(roleId: number): SafeStyle {
    // Lista de colores predefinidos para los primeros roles
    const predefinedColors: PredefinedColors = {
      1: { start: '#071FDB', end: '#0519a3' }, // Azul
      2: { start: '#4caf50', end: '#45a049' }, // Verde
      3: { start: '#ff9800', end: '#f57c00' }, // Naranja
      4: { start: '#9c27b0', end: '#7b1fa2' }, // Morado
      5: { start: '#00bcd4', end: '#0097a7' }  // Cyan
    };

    // Si el rol tiene un color predefinido, usarlo
    if (predefinedColors[roleId]) {
      const { start, end } = predefinedColors[roleId];
      return this.sanitizer.bypassSecurityTrustStyle(
        `linear-gradient(135deg, ${start} 0%, ${end} 100%)`
      );
    }

    // Para roles nuevos, generar un color único basado en el ID
    const hue = (roleId * 137.508) % 360; // Número áureo para distribución uniforme
    const saturation = 75;
    const lightness = 45;
    const darkerLightness = 35;

    // Crear un gradiente con el color generado
    const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    const darkerColor = `hsl(${hue}, ${saturation}%, ${darkerLightness}%)`;

    return this.sanitizer.bypassSecurityTrustStyle(
      `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`
    );
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error') {
    this.mensajeToast = mensaje;
    this.toastClass = `toast toast-${tipo}`;
    setTimeout(() => {
      this.mensajeToast = '';
    }, 4000);
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
      const documento = this.filtroDocumento.toLowerCase();

      const cumpleDocumento = documento
        ? (usuario.document_id?.toLowerCase().includes(documento))
        : true;
      return cumpleRol && cumpleBusqueda && cumpleDocumento;
    });
  }

  esCelularValido(valor: string): boolean {
    return /^[0-9]{10,}$/.test(valor);
  }

  esDocumentoValido(valor: string): boolean {
    return /^[0-9]{6,15}$/.test(valor);
  }

  esTelefonoFijoValido(valor: string): boolean {
    return /^[0-9]{7,10}$/.test(valor);
  }

  onPhoneChange(value: string) {
    this.nuevoUsuario.phone = value.replace(/[^0-9]/g, '');
  }

  verDetalles(usuario: any) {
    const dialogRef = this.dialog.open(UserDetailsModalComponent, {
      width: '600px',
      data: { usuario: usuario, roles: this.roles }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.action === 'edit') {
          this.editarUsuario(result.usuario);
        } else if (result.action === 'delete') {
          this.borrarUsuario(result.usuario);
        }
      }
    });
  }

  blockNonNumeric(event: KeyboardEvent) {
    if (!/[0-9]/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Tab' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      event.preventDefault();
    }
  }
}