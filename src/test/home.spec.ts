import { test, expect } from '@playwright/test';

test('Verificar que las nuevas secciones se muestran correctamente', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Verificar que la sección de noticias se muestra correctamente
  await expect(page.locator('text=Noticias')).toBeVisible();

  // Verificar que la sección de recursos adicionales se muestra correctamente
  await expect(page.locator('text=Recursos Adicionales')).toBeVisible();

  // Verificar que la sección de eventos se muestra correctamente
  await expect(page.locator('text=Eventos')).toBeVisible();
});

test('Verificar que los enlaces en las nuevas secciones funcionan correctamente', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Hacer clic en el primer enlace de la sección de noticias
  await page.click('text=Nueva lección sobre la cultura Kamëntsá');

  // Verificar que se navega a la página correcta
  await expect(page).toHaveURL('http://localhost:5173/lessons/1');

  // Volver a la página de inicio
  await page.goBack();

  // Hacer clic en el primer enlace de la sección de recursos adicionales
  await page.click('text=Diccionario Kamëntsá-Español');

  // Verificar que se navega a la página correcta
  await expect(page).toHaveURL('https://example.com/dictionary');

  // Volver a la página de inicio
  await page.goBack();

  // Hacer clic en el primer enlace de la sección de eventos
  await page.click('text=Celebración del Día de la Lengua Kamëntsá');

  // Verificar que se navega a la página correcta
  await expect(page).toHaveURL('https://example.com/events/1');
});