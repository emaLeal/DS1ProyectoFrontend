import { test, expect } from '@playwright/test';

const DATAUSER = {
  documento: '1234567890',
  password: 'Contraseña1.',
  name: 'usuario prueba',
  last_name: "prueba",
  birth_date:"01-01-2001",
  email:"prueba231@gmail.com",
  cell_phone:"3162118888",
  phone:"371235765",
  address:"Calle 22 #40-32. prueba"


}

test.describe('Prueba de Login', () => {

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
    await page.type('input[formControlName="name"]', DATAUSER.name, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="last_name"]', DATAUSER.last_name, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.click('mat-select[formControlName="identification_type"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option >> text="Cédula de Ciudadanía"');
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="document_id"]', DATAUSER.documento, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="birth_date"]', DATAUSER.birth_date, { delay: 100 });
    await page.waitForTimeout(1000);


    await page.click('mat-select[formControlName="gender"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option >> text="Masculino"');
    await page.waitForTimeout(1000);

    await page.click('button[name="button1"]');
    await page.waitForTimeout(2000);

    console.log("llenando segundo apartado.....");

    await page.type('input[formControlName="email"]', DATAUSER.email, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="cell_phone"]', DATAUSER.cell_phone, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="phone"]', DATAUSER.phone, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="address"]', DATAUSER.address, { delay: 100 });
    await page.waitForTimeout(1000);
    
    await page.click('button[name="button2"]');
    await page.waitForTimeout(2000);

    await page.type('input[formControlName="password"]', DATAUSER.password, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[formControlName="confirmPassword"]', DATAUSER.password, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.click('button[name="submit"]');
    await page.waitForTimeout(5000);



  });

  test('login exitoso', async ({ page }) => {
    // Configurar timeout más largo
    test.setTimeout(180000); // 3 minutos

    // Establecer modo de prueba en localStorage
    await page.addInitScript(() => {
      localStorage.setItem('PLAYWRIGHT_TEST', 'true');
    });

    console.log('Navegando a la página de login...');
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });

    // Esperar a que el formulario esté visible
    console.log('Esperando que el formulario esté visible...');
    await page.waitForSelector('form', { timeout: 10000 });

    // Esperar un momento antes de empezar a llenar el formulario
    await page.waitForTimeout(2000);

    // Llenar el documento
    console.log('Llenando documento...');
    await page.fill('input[formControlName="document_id"]', '');
    await page.waitForTimeout(1000);
    await page.type('input[formControlName="document_id"]', DATAUSER.documento, { delay: 100 });
    await page.waitForTimeout(2000);

    // Llenar la contraseña
    console.log('Llenando contraseña...');
    await page.fill('input[formControlName="password"]', '');
    await page.waitForTimeout(1000);
    await page.type('input[formControlName="password"]', DATAUSER.password, { delay: 100 });
    await page.waitForTimeout(2000);

    // Esperar a que el botón esté habilitado
    console.log('Esperando que el botón esté habilitado...');
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
    await page.waitForTimeout(2000);

    // Hacer clic en el botón de login
    console.log('Haciendo clic en el botón de login...');
    await page.click('button[type="submit"]');

    // Esperar a que la redirección al dashboard se complete
    console.log('Esperando redirección al dashboard...');
    await page.waitForURL('**/dashboard', { timeout: 20000 });

    // Verificar que estamos en el dashboard
    console.log('Verificando URL del dashboard...');
    await expect(page).toHaveURL(/.*dashboard/);

    // Esperar un momento para ver el resultado
    await page.waitForTimeout(5000);

    console.log('Login exitoso completado');
  });

  test('crear rol "estudiantes" después de login', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos

    // Establecer modo de prueba en localStorage
    await page.addInitScript(() => {
      localStorage.setItem('PLAYWRIGHT_TEST', 'true');
    });

    // Login
    await page.goto('http://localhost:4200/login', { waitUntil: 'networkidle' });
    await page.waitForSelector('form', { timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.fill('input[formControlName="document_id"]', '1107102338');
    await page.waitForTimeout(500);
    await page.fill('input[formControlName="password"]', 'Hernan5515095');
    await page.waitForTimeout(500);
    await page.waitForSelector('button[type="submit"]:not([disabled])', { timeout: 10000 });
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 20000 });
    await expect(page).toHaveURL(/.*dashboard/);
    await page.waitForTimeout(1000);

    // Ir directamente a la sección de roles
    await page.goto('http://localhost:4200/dashboard/roles', { waitUntil: 'networkidle' });
    await page.waitForURL('**/dashboard/roles', { timeout: 10000 });
    await expect(page).toHaveURL(/.*dashboard\/roles/);
    await page.waitForTimeout(1000);

    // Hacer clic en el botón de agregar nuevo rol (clase .create-button)
    await page.click('button.create-button');
    await page.waitForSelector('input[name="description"]', { timeout: 5000 });
    await page.fill('input[name="description"]', 'estudiantes');
    await page.waitForTimeout(500);
    // Hacer clic en el botón de guardar (type submit y texto Actualizar)
    await page.click('button[type="submit"]:has-text("Actualizar")');
    await page.waitForTimeout(2000);

    // Verificar que el nuevo rol aparece en la lista
    const rolExiste = await page.isVisible('text=estudiantes');
    expect(rolExiste).toBeTruthy();
  });
}); 