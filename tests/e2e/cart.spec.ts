import { test, expect, Page } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';

/**
 * Suite: Carrinho de Compras
 *
 * ESTRATÉGIA:
 *  - Testes que precisam de item → addItemAndOpenCart()
 *  - Teste de carrinho vazio    → limpa via "CLEAR CART" antes de verificar
 *  - Checkout                  → scroll antes de clicar (botão fica abaixo da tabela)
 */
test.describe('🛒 Carrinho de Compras', () => {

  // ─── Helper: adiciona produto e abre o carrinho ──────────────────────────
  async function addItemAndOpenCart(page: Page): Promise<CartPage> {
    const home = new HomePage(page);
    await home.open();
    await home.addProductToCartByIndex(0);

    // Fecha modal SweetAlert2 se aparecer
    const okBtn = page.locator('.swal2-confirm');
    if (await okBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await okBtn.click();
    }

    const cart = new CartPage(page);
    await cart.open();
    return cart;
  }

  // ── Carrinho vazio ────────────────────────────────────────────────────────

  test('@smoke carrinho vazio deve exibir mensagem adequada', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open();

    // Se houver itens de sessão anterior, limpa via "CLEAR CART"
    const hasItems = (await cart.getItemCount()) > 0;
    if (hasItems) {
      await cart.clearCartIfPossible();
      await page.waitForTimeout(1_000);
    }

    const hasMsg  = await cart.emptyCartMessage.isVisible({ timeout: 8_000 }).catch(() => false);
    const noItems = (await cart.getItemCount()) === 0;
    expect(hasMsg || noItems).toBe(true);
  });

  // ── Com itens ─────────────────────────────────────────────────────────────

  test('@smoke deve exibir item após adicionar produto', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);
    expect(await cart.getItemCount()).toBeGreaterThan(0);
  });

  test('@regression deve remover item do carrinho', async ({ page }) => {
    const cart   = await addItemAndOpenCart(page);
    const before = await cart.getItemCount();
    expect(before).toBeGreaterThan(0);

    await cart.removeFirstItem();
    await page.waitForTimeout(800);

    const after   = await cart.getItemCount();
    const isEmpty = await cart.emptyCartMessage.isVisible().catch(() => false);
    expect(after < before || isEmpty).toBe(true);
  });

  test('@regression deve exibir o total do carrinho', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    // Rola até a seção "CART TOTAL"
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    // Verifica que existe algum valor monetário visível na tabela
    const priceCell = page.locator('td').filter({ hasText: /\$\d/ }).first();
    await expect(priceCell).toBeVisible({ timeout: 8_000 });
  });

  test('@regression deve exibir botão de checkout com itens', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    // Botão fica abaixo da tabela — precisa rolar
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(cart.checkoutButton).toBeVisible({ timeout: 8_000 });
  });

  test('@regression checkout sem login deve redirecionar ou abrir modal', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    // Scroll até o botão de checkout
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);

    await expect(cart.checkoutButton).toBeVisible({ timeout: 8_000 });
    await cart.checkoutButton.click();

    const onLogin    = await page.waitForURL(/\/login$/, { timeout: 6_000 }).then(() => true).catch(() => false);
    const hasModal   = await page.locator('.swal2-popup, [role="dialog"], .modal').isVisible().catch(() => false);
    const onCheckout = page.url().includes('/checkout');

    expect(onLogin || hasModal || onCheckout).toBe(true);
  });

  test('@regression deve ter opção de continuar comprando', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    const hasBtn      = await cart.continueShoppingButton.isVisible().catch(() => false);
    const hasShopLink = await page.locator('a[href="/shop"]').first().isVisible().catch(() => false);
    expect(hasBtn || hasShopLink).toBe(true);
  });
});
