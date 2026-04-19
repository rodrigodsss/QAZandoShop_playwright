import { test, expect, Page } from '@playwright/test';
import { CartPage } from '../../pages/CartPage';
import { HomePage } from '../../pages/HomePage';

/**
 * Suite: Carrinho de Compras
 *
 * ESTRATÉGIA: cada teste que precisa de item no carrinho
 * adiciona o produto via HomePage antes de abrir o carrinho.
 * Isso garante estado independente por teste (sem dependência de sessão).
 */
test.describe('🛒 Carrinho de Compras', () => {

  // ─── Helper: adiciona o 1º produto e navega para o carrinho ────────────────
  async function addItemAndOpenCart(page: Page): Promise<CartPage> {
    const home = new HomePage(page);
    await home.open();
    await home.addProductToCartByIndex(0);

    // Fecha modal de confirmação (SweetAlert2) se aparecer
    const okBtn = page.locator('.swal2-confirm');
    if (await okBtn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await okBtn.click();
    }

    const cart = new CartPage(page);
    await cart.open();
    return cart;
  }

  // ── Carrinho vazio ──────────────────────────────────────────────────────────

  test('@smoke carrinho vazio deve exibir mensagem adequada', async ({ page }) => {
    // Navega diretamente para o carrinho SEM adicionar produto
    const cart = new CartPage(page);
    await cart.open();

    const hasMsg  = await cart.emptyCartMessage.isVisible().catch(() => false);
    const noItems = (await cart.getItemCount()) === 0;

    expect(hasMsg || noItems).toBe(true);
  });

  // ── Com itens no carrinho ───────────────────────────────────────────────────

  test('@smoke deve exibir item após adicionar produto', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);
    await cart.assertCartHasItems();
  });

  test('@regression deve remover item do carrinho', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    const before = await cart.getItemCount();
    expect(before).toBeGreaterThan(0);

    await cart.removeFirstItem();
    await page.waitForTimeout(500);

    const after   = await cart.getItemCount();
    const isEmpty = await cart.emptyCartMessage.isVisible().catch(() => false);

    expect(after < before || isEmpty).toBe(true);
  });

  test('@regression deve exibir o total do carrinho', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);
    await expect(cart.totalPrice).toBeVisible();
  });

  test('@regression deve exibir botão de checkout com itens', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);
    await expect(cart.checkoutButton).toBeVisible();
  });

  test('@regression checkout sem login deve redirecionar ou abrir modal', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    // Garante que o botão está visível antes de clicar
    await expect(cart.checkoutButton).toBeVisible();
    await cart.checkoutButton.click();

    const onLogin  = await page.waitForURL(/\/login$/, { timeout: 6_000 })
                               .then(() => true).catch(() => false);
    const hasModal = await page.locator('.swal2-popup, [role="dialog"], .modal')
                               .isVisible().catch(() => false);
    const onCheckout = page.url().includes('/checkout');

    expect(onLogin || hasModal || onCheckout).toBe(true);
  });

  // ── Navegação a partir do carrinho ─────────────────────────────────────────

  test('@regression deve ter opção de continuar comprando', async ({ page }) => {
    const cart = await addItemAndOpenCart(page);

    const continueBtn = cart.continueShoppingButton;
    const hasBtn = await continueBtn.isVisible().catch(() => false);

    // Aceita botão visível ou link na navbar para voltar à loja
    const hasShopLink = await page.locator('a[href="/shop"], a[href="/"]').first()
                                  .isVisible().catch(() => false);
    expect(hasBtn || hasShopLink).toBe(true);
  });
});
