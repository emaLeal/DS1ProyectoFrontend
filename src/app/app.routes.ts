import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostulantesComponent } from './dashboard/postulantes/postulantes.component';
import { OfertasActivasComponent } from './dashboard/ofertas-activas/ofertas-activas.component';
import { OfertasCerradasComponent } from './dashboard/ofertas-cerradas/ofertas-cerradas.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { RolesComponent } from './dashboard/roles/roles.component';
import { AgregarComponent } from './dashboard/agregar/agregar.component';
import { CrearOfertaComponent } from './dashboard/ofertas/crear-oferta/crear-oferta.component';
import { EditarOfertaComponent } from './dashboard/ofertas/editar-oferta/editar-oferta.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { PerfilUsuarioComponent } from './dashboard/perfil-usuario/perfil-usuario.component';

import { isAuthenticated, isSuperUser } from './authentication/guards/authentication.guard';
import { OfertasListaComponent } from './dashboard/ofertas/ofertas-lista/ofertas-lista.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { TodosPostulantesComponent } from './dashboard/postulantes/todos-postulantes.component';
import { GraphicsComponent } from './dashboard/graphics/graphics.component';
import { ReportsComponent } from './dashboard/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password/:token', component: ChangePasswordComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [isAuthenticated], // ✅ Requiere estar logueado
    children: [
      {
        path: 'postulantes',
        component: PostulantesComponent,
        canActivate: [isSuperUser] // 👈 Bloquear si rol === 3
      },
      { path: 'ofertas-activas', component: OfertasActivasComponent },
      { path: 'ofertas-cerradas', component: OfertasCerradasComponent },
      { path: 'crear-oferta', component: CrearOfertaComponent },
      { path: 'editar-oferta/:id', component: EditarOfertaComponent },
      {
        path: 'ver-ofertas',
        component: OfertasListaComponent,
        canActivate: [isSuperUser] // ✅ Solo para usuarios con rol distinto a 3
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [isSuperUser] // ✅ Solo para usuarios con rol distinto a 3
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [isSuperUser] // ✅ Solo para usuarios con rol distinto a 3
      },
      { path: 'agregar', component: AgregarComponent },
      {path : 'perfil', component: PerfilUsuarioComponent},
      { path: '', component: GraphicsComponent },
      { path: 'reportes', component: ReportsComponent },

      {
        path: 'todos-postulantes',
        component: TodosPostulantesComponent
      },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];
