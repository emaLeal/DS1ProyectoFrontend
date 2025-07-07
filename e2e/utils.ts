import { test, expect, Page  } from '@playwright/test';


export async function loginUsuario(page: Page, DATAUSER: { documento: string; password: string }) {
  console.log('Iniciando login reutilizable...');

  // Guardar bandera en localStorage
  await page.addInitScript(() => {
    localStorage.setItem('PLAYWRIGHT_TEST', 'true');
  });

  await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
  await page.waitForSelector('form', { timeout: 10000 });

  await page.type('input[formControlName="document_id"]', DATAUSER.documento, { delay: 100 });
  await page.waitForTimeout(1000);
  await page.type('input[formControlName="password"]', DATAUSER.password),{ delay: 100 };

  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 20000 });
  console.log('Login exitoso.');
}
