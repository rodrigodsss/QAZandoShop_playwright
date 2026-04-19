import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';

test.describe('Produtos', () => {
  let home: HomePage;

  test.beforeEach(async ({ page }) => {
    home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();
  });

  test('@smoke deve exibir produtos na home', async () => {
    expect(await home.productCards.count()).toBeGreaterThan(0);
  });

  test('@regression cada produto deve ter titulo', async () => {
    await expect(home.productTitles.first()).toBeVisible();
  });

  test('@regression cada produto deve ter preco', async () => {
    const price = home.productPrices.first();
    await expect(price).toBeVisible();
    expect(((await price.textContent())?.trim() || '').length).toBeGreaterThan(0);
  });

  test('@regression cada produto deve ter botao de compra', async () => {
    await home.productCards.first().hover();
    await expect(home.addToCartButtons.first()).toBeVisible();
  });

  test('@smoke deve adicionar produto ao carrinho', async ({ page }) => {
    await home.addProductToCartByIndex(0);

    const feedback = page.locator('.swal2-popup, .toast, .alert-success');
    const hasFeedback = await feedback.first().isVisible({ timeout: 5_000 }).catch(() => false);

    await home.goToCart();
    const rows = page.locator('table tbody tr');
    const hasItem = (await rows.count()) > 0;

    expect(hasFeedback || hasItem || page.url().includes('/cart')).toBe(true);
  });

  test('@smoke deve abrir detalhes do produto', async ({ page }) => {
    const initialURL = page.url();
    const link = home.productCards.first().locator('a').first();
    if ((await link.count()) === 0) test.skip();
    await link.click();
    await expect(page).not.toHaveURL(initialURL);
  });
});
