import { test, expect } from '@playwright/test';


const DATAOFERT = {
  titulo: 'oferta prueba',
  responsabilidad: 'Datos de prueba',
  responsabilidad2: 'Datos de prueba 2',
  salario: "3000000",
  fecha_inicio: "01-01-2025",
  fecha_final: "01-06-2025",
}

const CREDENCIALES = {
  document: "1110283134",
  password: "Contraseña1."
}
test('register', async ({ page }) => {
  test.setTimeout(180000); // 3 minutos

  // Establecer modo de prueba en localStorage
  await page.addInitScript(() => {
    localStorage.setItem('PLAYWRIGHT_TEST', 'true');
  });

  await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });

  // Llenar el documento
  console.log('Llenando documento...');
  await page.fill('input[formControlName="document_id"]', '');
  await page.waitForTimeout(1000);
  await page.type('input[formControlName="document_id"]', CREDENCIALES.document, { delay: 100 });
  await page.waitForTimeout(2000);

  // Llenar la contraseña
  console.log('Llenando contraseña...');
  await page.fill('input[formControlName="password"]', '');
  await page.waitForTimeout(1000);
  await page.type('input[formControlName="password"]', CREDENCIALES.password, { delay: 100 });
  await page.waitForTimeout(1000);

  await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
  await page.waitForTimeout(1000);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

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
  await page.fill('input[name="end_date"]', DATAOFERT.fecha_final, { delay: 100 });
  await page.waitForTimeout(2000);

  await page.click('button[name="submit"]');
  await page.waitForTimeout(5000);



});

