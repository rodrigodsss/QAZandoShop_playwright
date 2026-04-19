import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator('#user, input[placeholder="Email"]').first();
    this.passwordInput = page.locator('#password, input[type="password"]').first();
    this.submitButton = page.getByRole('button', { name: /^login$/i }).last();
    this.errorMessage = page.locator('.swal2-popup, .alert-danger, .toast-error, span.text-danger, [role="alert"]').first();
    this.successMessage = page.locator('.swal2-popup, .alert-success, text=/Login realizado|sucesso/i').first();
    this.forgotPasswordLink = page.locator('text=/esqueci/i').first();
    this.registerLink = page.locator('a[href="/register"]').first();
    this.pageTitle = page.locator('h1, h2, h3').filter({ hasText: /login/i }).first();
  }

  async open() {
    await this.navigate('/login');
    await expect(this.emailInput).toBeVisible({ timeout: 15_000 });
  }

  async fillEmail(email: string) {
    await this.fillField(this.emailInput, email);
  }

  async fillPassword(password: string) {
    await this.fillField(this.passwordInput, password);
  }

  async submit() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.submit();
  }

  async assertLoginError(message?: string) {
    await expect(this.errorMessage).toBeVisible();

    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async assertLoginSuccess() {
    const onAccountPage = this.page.url().includes('/my-account');
    const successVisible = await this.successMessage.isVisible().catch(() => false);
    expect(onAccountPage || successVisible).toBe(true);
  }

  async assertLoggedIn() {
    await this.assertLoginSuccess();
  }

  async assertOnLoginPage() {
    await expect(this.emailInput).toBeVisible();
  }
}
