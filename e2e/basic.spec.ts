import { test, expect } from '@playwright/test';

test('navegación básica', async ({ page }) => {
  console.log('Iniciando prueba de navegación básica...');
  
  // Intentar navegar a la página de login
  console.log('Navegando a /login...');
  await page.goto('/login');
  
  // Esperar a que la página cargue
  console.log('Esperando a que la página cargue...');
  await page.waitForLoadState('networkidle');
  
  // Tomar una captura de pantalla
  console.log('Tomando captura de pantalla...');
  await page.screenshot({ path: 'login-page.png' });
  
  // Verificar que estamos en la página correcta
  console.log('Verificando URL...');
  expect(page.url()).toContain('/login');
  
  console.log('Prueba completada');
}); 