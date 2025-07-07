import { test, expect } from '@playwright/test';
import { loginUsuario } from './utils';

const CREDENCIALES = {
    documento: "1110283134",
    password: "Contraseña1."
}

const DATAUSER = {
    documento: '111111111',
    password: 'Contraseña1.',
    name: 'usuario nuevo',
    last_name: "prueba",
    birth_date: "01-01-2001",
    email: "UsuarioNuevo@gmail.com",
    cell_phone: "3162118888",
    phone: "371235765",
    address: "Calle 22 #40-32. prueba"
}


test('Crear usuario', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos
    await loginUsuario(page, CREDENCIALES)
    await page.goto('http://localhost:4200/dashboard/usuarios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.click('button[name="Crear_usuario"]');
    await page.waitForTimeout(1000);

    console.log('Llenando datos...');
    await page.type('input[name="name"]', DATAUSER.name, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="last_name"]', DATAUSER.last_name, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.locator('mat-select[name="identification_type"]').click({ force: true });
    await page.waitForSelector('mat-option');
    await page.click('[data-testid="identification-CC"]');
    await page.waitForTimeout(1000);

    await page.type('input[name="document_id"]', DATAUSER.documento, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="birth_date"]', DATAUSER.birth_date, { delay: 100 });
    await page.waitForTimeout(1000);


    await page.click('mat-select[name="gender"]');
    await page.waitForSelector('mat-option');
    await page.click('[data-testid="M"]');
    await page.waitForTimeout(1000);


    await page.type('input[name="email"]', DATAUSER.email, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="cell_phone"]', DATAUSER.cell_phone, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="phone"]', DATAUSER.phone, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="address"]', DATAUSER.address, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.click('mat-select[name="role"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option >> text="Gestor de Talento"');
    await page.waitForTimeout(1000);

    await page.type('input[name="password"]', DATAUSER.password, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="confirm_password"]', DATAUSER.password, { delay: 100 });
    await page.waitForTimeout(1000);

    await page.click('button[name="submit"]');
    await page.waitForTimeout(5000);



})

test('Editar usuario', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos
    await loginUsuario(page, CREDENCIALES)
    await page.goto('http://localhost:4200/dashboard/usuarios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const filaUsuario = page.locator('tr.table-data-row', {
        hasText: 'UsuarioNuevo@gmail.com' // o nombre, documento, etc.
    });

    await filaUsuario.locator('button >> mat-icon:text("edit")').click();
    await page.waitForTimeout(1000);

    await page.fill('input[name="name"]',"")
    await page.type('input[name="name"]', "Carlos nuevo", { delay: 100 });
    await page.waitForTimeout(2000);

    await page.click('mat-select[name="role"]');
    await page.waitForSelector('mat-option');
    await page.click('mat-option >> text="Postulante"');
    await page.waitForTimeout(3000);

    const botonGuardar = page.locator('button[name="submit_editar"]');

    // Espera a que esté visible
    await expect(botonGuardar).toBeVisible();

    // Espera a que esté habilitado
    await expect(botonGuardar).toBeEnabled();

    // Ahora haz clic
    console.log(botonGuardar);
    
    await botonGuardar.click();
    await page.waitForTimeout(5000);

})

test('ver usuarios', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos
    await loginUsuario(page, CREDENCIALES)
    await page.goto('http://localhost:4200/dashboard/usuarios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    let filaUsuario = page.locator('tr.table-data-row', {
        hasText: 'UsuarioNuevo@gmail.com' // o nombre, documento, etc.
    });

    await filaUsuario.locator('button >> mat-icon:text("visibility")').click();
    await page.waitForTimeout(6000);
    
    await page.click('button[name="cerrar"]');
    await page.waitForTimeout(2000);

    filaUsuario = page.locator('tr.table-data-row', {
        hasText: 'prueba231@gmail.com' // o nombre, documento, etc.
    });

    await filaUsuario.locator('button >> mat-icon:text("visibility")').click();
    await page.waitForTimeout(6000);
    await page.waitForTimeout(2000);


})

test('Eliminar usuario', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos
    await loginUsuario(page, CREDENCIALES)
    await page.goto('http://localhost:4200/dashboard/usuarios', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const filaUsuario = page.locator('tr.table-data-row', {
        hasText: 'UsuarioNuevo@gmail.com' // o nombre, documento, etc.
    });

    await filaUsuario.locator('button >> mat-icon:text("delete")').click();
    await page.waitForTimeout(3000);

    await page.click('button[name="button_delete"]');
    await page.waitForTimeout(5000);


})