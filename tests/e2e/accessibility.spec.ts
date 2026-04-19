import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Acessibilidade', () => {
  test('@regression deve navegar para Login via teclado', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.loginLink.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regression campos de login devem ser acessiveis via Tab', async ({ page }) => {
    await page.goto('/login');
    const email = page.locator('#user').first();
    const password = page.locator('#password').first();
    await expect(email).toBeVisible();
    await email.focus();
    await page.keyboard.press('Tab');
    await expect(password).toBeFocused();
  });

  test('@regression imagens dos produtos devem ter atributo alt', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const images = page.locator('.product_wrappers_one img, .product_item_two img');
    if (await images.count() === 0) test.skip();
    expect(await images.first().getAttribute('alt')).not.toBeNull();
  });

  test('@regression botoes devem ter texto ou aria-label', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const buttons = page.locator('button.add-to-cart, .product_button button, .product_button .action');
    if (await buttons.count() === 0) test.skip();
    const btn = buttons.first();
    const textContent = (await btn.textContent())?.trim();
    const ariaLabel = await btn.getAttribute('aria-label');
    const title = await btn.getAttribute('title');
    expect(textContent || ariaLabel || title).toBeTruthy();
  });

  test('@regression paginas devem ter title', async ({ page }) => {
    for (const route of ['/', '/login', '/register', '/cart']) {
      await page.goto(route);
      await page.waitForTimeout(300);
      expect((await page.title()).trim().length, `Titulo vazio em ${route}`).toBeGreaterThan(0);
    }
  });

  test('@regression links de navegacao devem ter texto descritivo', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    const navLinks = page.locator('a[href="/login"], a[href="/register"], .main-menu-link');
    const count = await navLinks.count();

    for (let i = 0; i < Math.min(count, 8); i++) {
      const link = navLinks.nth(i);
      if (!(await link.isVisible().catch(() => false))) {
        continue;
      }
      const text = (await link.textContent())?.trim();
      const ariaLabel = await link.getAttribute('aria-label');
      expect(text || ariaLabel).toBeTruthy();
    }
  });

  test('@regression inputs do login devem ter identificacao acessivel', async ({ page }) => {
    await page.goto('/login');
    const inputs = page.locator('input:not([type="hidden"])');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const placeholder = await input.getAttribute('placeholder');
      const ariaLabel = await input.getAttribute('aria-label');
      const id = await input.getAttribute('id');
      let hasLabel = false;
      if (id) {
        hasLabel = (await page.locator(`label[for="${id}"]`).count()) > 0;
      }
      expect(placeholder || ariaLabel || hasLabel, `Input ${i} sem identificacao acessivel`).toBeTruthy();
    }
  });

  test('@regression navbar deve funcionar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const home = new HomePage(page);
    await home.open();
    const hasNavLinks = await home.loginLink.isVisible().catch(() => false);
    const hasHamburger = await page.locator('.offside-menu, .fa-bars, .mobile-header').isVisible().catch(() => false);
    expect(hasNavLinks || hasHamburger).toBe(true);
  });
});
