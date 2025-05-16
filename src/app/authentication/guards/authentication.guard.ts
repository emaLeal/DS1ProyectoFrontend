import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';


export const isSuperUser: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const user = authService.getProfile
  if (user.role === 3) return false
  console.log('E admin')
  return true
};
