import { test, expect } from '@playwright/test';
import { loginUsuario } from './utils';

const CREDENCIALES = {
    documento: "1110283134",
    password: "Contraseña1."
}

test('Crear_postulacion', async ({ page }) => {
    test.setTimeout(180000); // 3 minutos
    await loginUsuario(page, CREDENCIALES)
    await page.goto('http://localhost:4200/dashboard/ofertas-activas', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const card = page.locator('.oferta-card', {
        hasText: 'Oferta prueba'
    });

    card.locator('button[name="crear_postulacion"]').click();
    await page.waitForTimeout(2000);

    await page.type('input[name="undergraduate_title"]', "Ingeniero prueba", { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="postgraduate_tittle"]', "Doctorado prueba", { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('input[name="motivation"]', "Aprender mas", { delay: 100 });
    await page.waitForTimeout(1000);

    await page.type('textarea[name="resume"]', "Perfil de prueba", { delay: 100 });
    await page.waitForTimeout(1000);


    await page.click('button[name="submit"]');
    await page.waitForTimeout(5000);
})