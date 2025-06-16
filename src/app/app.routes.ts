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

import { isSuperUser } from './authentication/guards/authentication.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [isSuperUser], // ✅ Requiere estar logueado
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
      { path: '', component: AgregarComponent },
    ]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
