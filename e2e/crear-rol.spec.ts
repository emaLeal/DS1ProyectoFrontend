import { test, expect } from '@playwright/test';

const CREDENCIALES = {
  document: "1110283134",
  password: "Contraseña1."
}

test('crear y eliminar rol "estudiantes" después de login', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('PLAYWRIGHT_TEST', 'true');
  });

  // LOGIN
  await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
  await page.waitForSelector('form', { timeout: 10000 });
  await page.fill('input[formControlName="document_id"]', CREDENCIALES.document);
  await page.fill('input[formControlName="password"]', CREDENCIALES.password);
  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 20000 });

  // IR A ROLES Y CREAR ROL
  await page.goto('http://localhost:4200/dashboard/roles', { waitUntil: 'networkidle' });
  await page.waitForSelector('button.create-button', { timeout: 10000 });
  await page.click('button.create-button');
  await page.waitForSelector('input[name="description"]', { timeout: 5000 });
  await page.fill('input[name="description"]', 'estudiantes');
  await page.waitForTimeout(1000); // Pausa para ver el llenado
  await page.click('button[type="submit"]:has-text("Actualizar")');
  await page.waitForTimeout(2000); // Pausa para ver el rol creado

  // HACER SCROLL EN LA TABLA DE ROLES
  await page.evaluate(() => {
    const table = document.querySelector('.table-container');
    if (table) table.scrollTop = table.scrollHeight;
  });
  await page.waitForTimeout(1000);

  // VERIFICAR QUE EL ROL APARECE
  const rolLocator = page.locator('tr:has-text("estudiantes")');
  await rolLocator.scrollIntoViewIfNeeded();
  await expect(rolLocator).toBeVisible();
  await page.waitForTimeout(2000); // Pausa para ver el rol en la lista

  // ELIMINAR EL ROL "estudiantes"
  await rolLocator.locator('button[mat-icon-button][color="warn"]').click();
  await page.waitForTimeout(1000); // Pausa para ver el diálogo de confirmación
  await page.click('button:has-text("Eliminar")');
  await page.waitForTimeout(5000); // Pausa para ver el rol eliminado

  // Verifica que ya no está el rol
  const rolSigue = await page.isVisible('text=estudiantes');
  expect(rolSigue).toBeFalsy();
}); 