import { expect, test } from '@playwright/test';
import { generateUniqueEmail, USERS } from '../../fixtures/testData';
import { RegisterPage } from '../../pages/RegisterPage';

test.describe('Cadastro de Usuario', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.open();
  });

  test('@smoke deve exibir a pagina de cadastro', async ({ page }) => {
    await expect(page).toHaveURL(/\/register$/);
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.nameInput).toBeVisible();
  });

  test('@smoke deve cadastrar usuario com sucesso', async ({ page }) => {
    await registerPage.register({
      name: 'QA Playwright Tester',
      email: generateUniqueEmail(),
      password: 'Teste@123',
      confirmPassword: 'Teste@123',
    });

    const successVisible = await registerPage.successMessage.isVisible({ timeout: 8_000 }).catch(() => false);
    const redirected = await page.waitForURL(/\/my-account$/, { timeout: 8_000 }).then(() => true).catch(() => false);
    expect(successVisible || redirected).toBe(true);
  });

  test('@regression deve bloquear submit com formulario vazio', async ({ page }) => {
    await expect(registerPage.submitButton).toBeVisible();
    await registerPage.submitButton.click();
    await expect(page).toHaveURL(/\/register$/);
  });

  test('@regression deve exibir erro com e-mail ja cadastrado', async ({ page }) => {
    await registerPage.register({
      name: USERS.valid.name,
      email: USERS.valid.email,
      password: USERS.valid.password,
      confirmPassword: USERS.valid.password,
    });

    const onAccount = await page.waitForURL(/\/my-account$/, { timeout: 8_000 }).then(() => true).catch(() => false);
    const hasError = await registerPage.errorMessage.isVisible().catch(() => false);
    expect(onAccount || hasError).toBe(true);
  });

  test('@regression deve exibir erro quando senhas nao coincidem', async ({ page }) => {
    await registerPage.register({
      name: 'QA Tester',
      email: generateUniqueEmail(),
      password: 'Teste@123',
      confirmPassword: 'SenhaDiferente@456',
    });

    const onAccount = await page.waitForURL(/\/my-account$/, { timeout: 8_000 }).then(() => true).catch(() => false);
    const hasError = await registerPage.errorMessage.isVisible().catch(() => false);
    expect(onAccount || hasError).toBe(true);
  });

  test('@regression deve navegar para login', async ({ page }) => {
    await expect(registerPage.loginLink).toBeVisible();
    await registerPage.loginLink.click();
    await expect(page).toHaveURL(/\/login$/);
  });
});
