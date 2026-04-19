import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
  });

  test('@smoke deve carregar a home corretamente', async ({ page }) => {
    const home = new HomePage(page);
    await expect(page).toHaveURL(/automationpratice/);
    await home.assertProductsVisible();
  });

  test('@smoke deve exibir navbar', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.navbar).toBeVisible();
  });

  test('@smoke deve exibir produtos', async ({ page }) => {
    const home = new HomePage(page);
    expect(await home.productCards.count()).toBeGreaterThan(0);
  });

  test('@smoke deve exibir link de login', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.loginLink).toBeVisible();
  });

  test('@smoke deve exibir link de cadastro', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.registerLink).toBeVisible();
  });

  test('@smoke deve navegar para login', async ({ page }) => {
    const home = new HomePage(page);
    await home.goToLogin();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regression deve navegar para cadastro', async ({ page }) => {
    const home = new HomePage(page);
    await home.goToRegister();
    await expect(page).toHaveURL(/\/register$/);
  });

  test('@regression deve navegar para carrinho', async ({ page }) => {
    const home = new HomePage(page);
    await home.goToCart();
    await expect(page).toHaveURL(/\/cart$/);
  });

  test('@regression card deve ter titulo e preco', async ({ page }) => {
    const home = new HomePage(page);
    const firstCard = home.productCards.first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard.locator('.title a, .product_title a')).toBeVisible();
    await expect(firstCard.locator('.price, .item_price')).toBeVisible();
  });

  test('@regression card deve ter botao de adicionar', async ({ page }) => {
    const home = new HomePage(page);
    await home.productCards.first().hover();
    await expect(home.addToCartButtons.first()).toBeVisible();
  });

  test('@regression deve renderizar em mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();
  });
});
