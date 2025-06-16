import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

// Verifica si el usuario tiene sesión iniciada
export const isAuthenticated: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};

// Verifica si NO es superusuario (role 3)
export const isSuperUser: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user = authService.getProfile;
  if (user.role === 3) return false;
  return true;
};
