import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegisterPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly pageTitle: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    super(page);

    this.nameInput = page.locator('#user, input[placeholder="Nome"], input[placeholder="name"]').first();
    this.emailInput = page.locator('#email').first();
    this.passwordInput = page.locator('#password, input[type="password"]').first();
    this.confirmPasswordInput = page.locator('input[name*="confirm"], input[id*="confirm"]').first();
    this.submitButton = page.getByRole('button', { name: /^cadastrar$/i }).last();
    this.errorMessage = page.locator('.swal2-popup, .alert-danger, span.text-danger, [role="alert"]').first();
    this.successMessage = page.locator('.swal2-popup, .alert-success, text=/Cadastro realizado|Bem-vindo/i').first();
    this.pageTitle = page.locator('h1, h2, h3').filter({ hasText: /cadastro/i }).first();
    this.loginLink = page.locator('a[href="/login"]').first();
  }

  async open() {
    await this.navigate('/register');
    await expect(this.emailInput).toBeVisible({ timeout: 15_000 });
  }

  async fillForm(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) {
    await this.fillField(this.nameInput, data.name);
    await this.fillField(this.emailInput, data.email);
    await this.fillField(this.passwordInput, data.password);

    if (data.confirmPassword !== undefined && (await this.confirmPasswordInput.count()) > 0) {
      await this.fillField(this.confirmPasswordInput, data.confirmPassword);
    }
  }

  async submit() {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) {
    await this.fillForm(data);
    await this.submit();
  }

  async assertRegistrationSuccess() {
    const onAccountPage = this.page.url().includes('/my-account');
    const successVisible = await this.successMessage.isVisible().catch(() => false);
    expect(onAccountPage || successVisible).toBe(true);
  }

  async assertFieldError(message?: string) {
    await expect(this.errorMessage).toBeVisible();

    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async assertOnRegisterPage() {
    await expect(this.emailInput).toBeVisible();
  }
}
