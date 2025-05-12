import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component'; // Asegúrate de que la ruta sea correcta

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, //
  { path: '', redirectTo: 'login', pathMatch: 'full' } // Redirige a login por defecto
];
