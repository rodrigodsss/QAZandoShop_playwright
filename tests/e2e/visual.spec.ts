import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';

test.describe('👁️ Testes Visuais (Visual Regression)', () => {

  // ── Setup padrão ──────────────────────────────────────────────────────────

  test.beforeEach(async ({ page }) => {
    // viewport fixo → evita diffs inconsistentes
    await page.setViewportSize({ width: 1280, height: 800 });

    // desabilita animações globais
    await page.addStyleTag({
      content: `
        * {
          transition: none !important;
          animation: none !important;
        }
      `,
    });
  });

  // ── Home Page ─────────────────────────────────────────────────────────────

  test('@regression home — snapshot produtos', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();

    // estabiliza elementos dinâmicos
    await page.evaluate(() => {
      document.querySelectorAll('[data-dynamic], .timestamp')
        .forEach(el => (el as HTMLElement).style.visibility = 'hidden');
    });

    await expect(home.productCards.first()).toHaveScreenshot(
      'home-product-card.png',
      {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      }
    );
  });

  // ── Login ─────────────────────────────────────────────────────────────────

  test('@regression login — snapshot formulário', async ({ page }) => {
    const login = new LoginPage(page);
    await login.open();

    await expect(login.emailInput).toBeVisible();

    await expect(login.submitButton.locator('..')).toHaveScreenshot(
      'login-form.png',
      {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      }
    );
  });

  // ── Cadastro ──────────────────────────────────────────────────────────────

  test('@regression cadastro — snapshot formulário', async ({ page }) => {
    const register = new RegisterPage(page);
    await register.open();

    await expect(register.emailInput).toBeVisible();

    await expect(register.submitButton.locator('..')).toHaveScreenshot(
      'register-form.png',
      {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      }
    );
  });

  // ── Navbar ────────────────────────────────────────────────────────────────

  test('@regression navbar — desktop', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();

    await expect(home.navbar).toHaveScreenshot(
      'navbar-desktop.png',
      {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      }
    );
  });

  test('@regression navbar — mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const home = new HomePage(page);
    await home.open();

    await expect(home.navbar).toHaveScreenshot(
      'navbar-mobile.png',
      {
        maxDiffPixelRatio: 0.02,
        animations: 'disabled',
      }
    );
  });

  // ── Carrinho vazio ────────────────────────────────────────────────────────

  test('@regression carrinho vazio — snapshot', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.goToCart();

    const container = page.locator('#root, .container, main').first();

    await expect(container).toHaveScreenshot(
      'cart-empty.png',
      {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      }
    );
  });

  // ── Card de produto ───────────────────────────────────────────────────────

  test('@regression produto — snapshot card', async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();

    await expect(home.productCards.first()).toHaveScreenshot(
      'product-card.png',
      {
        maxDiffPixelRatio: 0.03,
        animations: 'disabled',
      }
    );
  });

});