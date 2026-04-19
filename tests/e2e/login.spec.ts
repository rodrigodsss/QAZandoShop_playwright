import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { USERS } from '../../fixtures/testData';

/**
 * Suite: Login
 *
 * Testes que dependem de usuário válido requerem conta criada no site.
 * Configure TEST_USER_EMAIL e TEST_USER_PASSWORD no .env ou
 * cadastre manualmente em /register.
 */
test.describe('🔐 Login', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  // ── Renderização ──────────────────────────────────────────────────────────

  test('@smoke deve exibir a página de login', async ({ page }) => {
    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  // ── Login válido ──────────────────────────────────────────────────────────

  test('@smoke deve realizar login com credenciais válidas', async ({ page }) => {
    await loginPage.login(USERS.valid.email, USERS.valid.password);

    // Aguarda redirecionamento pós-login (my-account ou home)
    const redirected = await Promise.any([
      page.waitForURL(/\/my-account$/, { timeout: 10_000 }),
      page.waitForURL(/\/$/, { timeout: 10_000 }),
      page.waitForURL(/\/shop$/, { timeout: 10_000 }),
    ]).then(() => true).catch(() => false);

    const successVisible = await loginPage.successMessage.isVisible({ timeout: 3_000 }).catch(() => false);
    const stillOnLogin   = page.url().includes('/login');

    expect(redirected || (successVisible && !stillOnLogin)).toBe(true);
  });

  // ── Validações ────────────────────────────────────────────────────────────

  test('@regression deve bloquear submit com formulário vazio', async ({ page }) => {
    await loginPage.submitButton.click();
    // Permanece na página de login — sem redirecionamento
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regression deve exibir erro com senha incorreta', async ({ page }) => {
    await loginPage.login(USERS.valid.email, USERS.invalid.password);

    const hasError   = await loginPage.errorMessage.isVisible({ timeout: 8_000 }).catch(() => false);
    const onLogin    = page.url().includes('/login');
    expect(hasError || onLogin).toBe(true);
  });

  test('@regression deve exibir erro com usuário inexistente', async ({ page }) => {
    await loginPage.login(USERS.invalid.email, USERS.invalid.password);

    const hasError = await loginPage.errorMessage.isVisible({ timeout: 8_000 }).catch(() => false);
    const onLogin  = page.url().includes('/login');
    expect(hasError || onLogin).toBe(true);
  });

  test('@regression não deve logar com senha vazia', async ({ page }) => {
    await loginPage.fillEmail(USERS.valid.email);
    await loginPage.submitButton.click();
    await expect(page).toHaveURL(/\/login$/);
  });

  // ── Navegação ─────────────────────────────────────────────────────────────

  test('@regression deve ter link para a página de cadastro', async ({ page }) => {
    await expect(loginPage.registerLink).toBeVisible();
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register$/);
  });
});
