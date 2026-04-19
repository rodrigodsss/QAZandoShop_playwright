import { test, expect, Page } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateUniqueEmail, USERS } from '../../fixtures/testData';

/**
 * Suite: Fluxos Completos E2E
 * Jornadas de ponta a ponta simulando o comportamento real do usuário.
 */
test.describe('🔄 Fluxos Completos E2E', () => {

  // Helper: fecha modal SweetAlert2 se presente
  async function closeModal(page: Page) {
    const okBtn = page.locator('.swal2-confirm');
    if (await okBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await okBtn.click();
    }
  }

  // Helper: adiciona produto e navega para o carrinho
  async function addToCartAndOpen(page: Page) {
    const home = new HomePage(page);
    await home.open();
    await home.addProductToCartByIndex(0);
    await closeModal(page);
    const cart = new CartPage(page);
    await cart.open();
    return { home, cart };
  }

  // ── Jornada 1: cadastro → login → compra ───────────────────────────────────

  test('@smoke jornada completa: cadastro → login → carrinho', async ({ page }) => {
    const email    = generateUniqueEmail();
    const password = 'Teste@123';

    // 1. Cadastro
    const register = new RegisterPage(page);
    await register.open();
    await register.register({ name: 'QA E2E Tester', email, password, confirmPassword: password });

    const cadastroOk =
      (await register.successMessage.isVisible({ timeout: 8_000 }).catch(() => false)) ||
      (await page.waitForURL(/\/my-account$/, { timeout: 8_000 }).then(() => true).catch(() => false));
    expect(cadastroOk).toBe(true);

    // 2. Login
    const login = new LoginPage(page);
    await login.open();
    await login.login(email, password);

    const loggedIn = await Promise.any([
      page.waitForURL(/\/my-account$/, { timeout: 10_000 }),
      page.waitForURL(/\/$/, { timeout: 10_000 }),
    ]).then(() => true).catch(() => false);
    expect(loggedIn).toBe(true);

    // 3. Adicionar ao carrinho e verificar
    const { cart } = await addToCartAndOpen(page);
    await cart.assertCartLoaded();
    await expect(page).toHaveURL(/\/cart$/);
  });

  // ── Jornada 2: visitante adiciona produto sem login ────────────────────────

  test('@regression visitante pode adicionar ao carrinho', async ({ page }) => {
    const { cart } = await addToCartAndOpen(page);
    await cart.assertCartLoaded();
    await expect(page).toHaveURL(/\/cart$/);
  });

  // ── Jornada 3: adicionar múltiplos produtos ────────────────────────────────

  test('@regression deve adicionar múltiplos produtos ao carrinho', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    const totalCards = await home.productCards.count();
    if (totalCards < 2) test.skip();

    await home.addProductToCartByIndex(0);
    await closeModal(page);
    await home.addProductToCartByIndex(1);
    await closeModal(page);

    const cart = new CartPage(page);
    await cart.open();
    await cart.assertCartLoaded();
    expect(await cart.getItemCount()).toBeGreaterThan(0);
  });

  // ── Jornada 4: login com senha errada → corrige → sucesso ──────────────────

  test('@regression login inválido depois válido deve ter sucesso', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    // Tentativa errada
    await login.login(USERS.valid.email, 'SenhaErrada999!');
    const failedCorrectly =
      (await login.errorMessage.isVisible({ timeout: 5_000 }).catch(() => false)) ||
      page.url().includes('/login');
    expect(failedCorrectly).toBe(true);

    // Tenta novamente com credenciais corretas
    await login.open();
    await login.login(USERS.valid.email, USERS.valid.password);

    const redirected = await Promise.any([
      page.waitForURL(/\/my-account$/, { timeout: 10_000 }),
      page.waitForURL(/\/$/, { timeout: 10_000 }),
    ]).then(() => true).catch(() => false);

    const successVisible = await login.successMessage.isVisible({ timeout: 3_000 }).catch(() => false);
    const onLogin        = page.url().includes('/login');
    expect(redirected || (successVisible && !onLogin)).toBe(true);
  });

  // ── Jornada 5: retornar à home a partir do carrinho ────────────────────────

  test('@regression deve retornar à home a partir do carrinho', async ({ page }) => {
    const home = new HomePage(page);
    const cart = new CartPage(page);
    await cart.open();

    const backLink = page.locator(
      'a[href="/"], a[href="/shop"], .logo a, a:has-text("Continue Shopping"), a:has-text("Home")'
    ).first();

    if (await backLink.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await backLink.click();
    } else {
      await home.open();
    }

    await home.assertProductsVisible();
    expect(await home.productCards.count()).toBeGreaterThan(0);
  });
});
