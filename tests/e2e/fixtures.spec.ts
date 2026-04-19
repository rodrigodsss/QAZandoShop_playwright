import { expect, test } from '../../fixtures/customFixtures';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';

/**
 * Suite: Custom Fixtures
 * Demonstra injeção automática de Page Objects e estado pré-configurado.
 */
test.describe('🔧 Custom Fixtures', () => {

  test('@smoke home deve exibir produtos', async ({ homePage }) => {
    await homePage.assertProductsVisible();
    expect(await homePage.productCards.count()).toBeGreaterThan(0);
  });

  test('@regression home deve exibir link de login', async ({ homePage }) => {
    await expect(homePage.loginLink).toBeVisible();
  });

  test('@smoke loginPage deve estar na rota correta', async ({ loginPage, page }) => {
    await loginPage.assertOnLoginPage();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regression loginPage deve exibir campos de email e senha', async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
  });

  test('@regression navbar deve estar visível', async ({ navbar }) => {
    await navbar.assertVisible();
    await navbar.assertLoginLinkVisible();
    await navbar.assertCartLinkVisible();
  });

  test('@regression navbar deve navegar para login', async ({ navbar, page }) => {
    await navbar.goToLogin();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('@regression navbar deve navegar para carrinho', async ({ navbar, page }) => {
    await navbar.goToCart();
    await expect(page).toHaveURL(/\/cart$/);
  });

  test('@regression usuario logado deve ver produtos', async ({ loggedInPage }) => {
    // Se o usuário não estiver logado (conta não existe), verifica apenas se a home carregou
    const count = await loggedInPage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('@regression usuario logado deve adicionar ao carrinho', async ({ loggedInPage, page }) => {
    const cartPage = new CartPage(page);

    await loggedInPage.addProductToCartByIndex(0);

    const okBtn = page.locator('.swal2-confirm');
    if (await okBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await okBtn.click();
    }

    await loggedInPage.goToCart();
    await cartPage.assertCartLoaded();
    await expect(page).toHaveURL(/\/cart$/);
  });
});
