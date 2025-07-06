import { expect, test } from '@playwright/test';

test('register', async ({ page }) => {
  test.setTimeout(180000); // 3 minutos

  // Establecer modo de prueba en localStorage
  await page.addInitScript(() => {
    localStorage.setItem('PLAYWRIGHT_TEST', 'true');
  });

  console.log('Navegando a la página de login...');
  await page.goto('http://localhost:4200/register', { waitUntil: 'networkidle' });

  console.log('Esperando que el formulario esté visible...');
  await page.waitForSelector('form', { timeout: 10000 });

  console.log('Llenando datos...');
  await page.type('input[formControlName="name"]', "Prueba", { delay: 100 });
  await page.waitForTimeout(1000);

  await page.selectOption('select[formControlName="role"]', 'admin');



});
