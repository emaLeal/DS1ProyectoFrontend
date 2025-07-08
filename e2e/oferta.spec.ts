import { test, expect } from '@playwright/test';
import { loginUsuario } from './utils';


const DATAOFERT = {
  titulo: 'Oferta prueba',
  responsabilidad: 'Datos de prueba',
  responsabilidad2: 'Datos de prueba 2',
  salario: "3000000",
  fecha_inicio: "01-01-2025",
  fecha_final: "01-06-2025",
}

const CREDENCIALES = {
  documento: "1110283134",
  password: "Contraseña1."
}
test('Crear_oferta', async ({ page }) => {
  test.setTimeout(180000); // 3 minutos
  await loginUsuario(page, CREDENCIALES)
  await page.goto('http://localhost:4200/dashboard/crear-oferta', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  await page.type('input[name="title"]', DATAOFERT.titulo, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.type('textarea[name="responsibilities"]', DATAOFERT.responsabilidad, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.locator('mat-select[data-testid="education-select"]').click({ force: true });
  await page.waitForSelector('mat-option');
  await page.click('mat-option >> text="Profesional"');
  await page.waitForTimeout(1000);

  await page.locator('mat-select[data-testid="rank"]').click({ force: true });
  await page.waitForSelector('mat-option');
  await page.click('mat-option >> text="Senior"');
  await page.waitForTimeout(1000);

  await page.type('textarea[name="other_requirements"]', DATAOFERT.responsabilidad2, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.click('mat-select[data-testid="job_type"]');
  await page.waitForSelector('mat-option');
  await page.click('mat-option >> text="Tiempo Completo"');
  await page.waitForTimeout(1000);

  await page.fill('input[name="salary"]', "");
  await page.type('input[name="salary"]', DATAOFERT.salario, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.fill('input[name="start_date"]', "");
  await page.type('input[name="start_date"]', DATAOFERT.fecha_inicio, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.fill('input[name="end_date"]', "");
  await page.type('input[name="end_date"]', DATAOFERT.fecha_final, { delay: 100 });
  await page.waitForTimeout(2000);

  await page.click('button[name="submit"]');
  await page.waitForTimeout(5000);

});

test('Editar_oferta', async ({ page }) => {
  test.setTimeout(180000); // 3 minutos
  await loginUsuario(page, CREDENCIALES)
  await page.goto('http://localhost:4200/dashboard/ver-ofertas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const filaUsuario = page.locator('tr.table-data-row', {
    hasText: 'Oferta prueba' // o nombre, documento, etc.
  });

  await filaUsuario.locator('button >> mat-icon:text("edit")').click();
  await page.waitForTimeout(3000);

  await page.fill('input[name="title"]','');
  await page.type('input[name="title"]', "Editar oferta prueba", { delay: 100 });
  await page.waitForTimeout(1000);

  await page.locator('mat-select[data-testid="education-select"]').click({ force: true });
  await page.waitForSelector('mat-option');
  await page.click('mat-option >> text="Bachiller"');
  await page.waitForTimeout(1000);

  await page.click('mat-select[data-testid="job_type"]');
  await page.waitForSelector('mat-option');
  await page.click('mat-option >> text="Prácticas"');
  await page.waitForTimeout(1000);

  await page.fill('input[name="salary"]', "");
  await page.type('input[name="salary"]', '1000000', { delay: 100 });
  await page.waitForTimeout(3000);

  await page.click('button[name="edit_offer"]');
  await page.waitForTimeout(5000);
  

})

test('Eliminar_oferta', async ({ page }) => {
  test.setTimeout(180000); // 3 minutos
  await loginUsuario(page, CREDENCIALES)
  await page.goto('http://localhost:4200/dashboard/ver-ofertas', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  const filaUsuario = page.locator('tr.table-data-row', {
    hasText: 'Editar oferta prueba' // o nombre, documento, etc.
  });

  await filaUsuario.locator('button >> mat-icon:text("delete")').click();
  await page.waitForTimeout(3000);

  await page.click('button[name="button_delete"]');
  await page.waitForTimeout(5000);

})