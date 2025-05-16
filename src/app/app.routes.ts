import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PostulantesComponent } from './dashboard/postulantes/postulantes.component';
import { OfertasActivasComponent } from './dashboard/ofertas-activas/ofertas-activas.component';
import { OfertasCerradasComponent } from './dashboard/ofertas-cerradas/ofertas-cerradas.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { RolesComponent } from './dashboard/roles/roles.component';
import { AgregarComponent } from './dashboard/agregar/agregar.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, //
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'postulantes', component: PostulantesComponent },
      { path: 'ofertas-activas', component: OfertasActivasComponent },
      { path: 'ofertas-cerradas', component: OfertasCerradasComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'agregar', component: AgregarComponent },
      { path: '', component: AgregarComponent },
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Redirige a login por defecto
  
];
