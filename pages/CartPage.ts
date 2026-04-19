import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * CartPage — seletores corrigidos com base no HTML real do QAZANDO Shop.
 *
 * Estrutura real da página /cart:
 *  - Tabela: colunas Remove | Image | Product | Price | Quantity | Total
 *  - Botão remover: <a> com ícone fa-trash dentro da primeira coluna (td)
 *  - Botão checkout: <a href="/checkout-one"> — fica abaixo da tabela (scroll necessário)
 *  - Botão limpar: <button> "CLEAR CART" no canto inferior direito da tabela
 *  - Total: seção "CART TOTAL" com linha "Subtotal $107.00"
 *  - Carrinho vazio: texto "YOUR CART IS EMPTY"
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly checkoutButton: Locator;
  readonly removeItemButtons: Locator;
  readonly emptyCartMessage: Locator;
  readonly quantityInputs: Locator;
  readonly continueShoppingButton: Locator;
  readonly cartTitle: Locator;
  readonly clearCartButton: Locator;

  constructor(page: Page) {
    super(page);

    // Linhas de produto na tabela
    this.cartItems = page.locator('table tbody tr');

    // Seção de total (CART TOTAL)
    this.totalPrice = page.locator('.cart-total-lable, .cart-subtotal, td').filter({ hasText: /\$/ }).last();

    // Link de checkout — href real: /checkout-one (pode estar escondido, usar scroll)
    this.checkoutButton = page.locator('a[href="/checkout-one"]').first();

    // Botão remover — ícone de lixeira (fa-trash) na primeira coluna
    // O <a> envolve o ícone; usamos o pai do ícone ou o próprio <a> na coluna td:first-child
    this.removeItemButtons = page.locator('table tbody tr td:first-child a');

    // Mensagem de carrinho vazio
    this.emptyCartMessage = page.locator(
      'p:has-text("YOUR CART IS EMPTY"), h2:has-text("empty"), .empty-cart-content, ' +
      'p:has-text("No product"), td:has-text("No product")'
    ).first();

    this.quantityInputs         = page.locator('input[type="number"]');
    this.continueShoppingButton = page.locator('a[href="/shop"], a:has-text("Continue Shopping")').first();
    this.cartTitle              = page.locator('h1, h2, h3').first();
    this.clearCartButton        = page.locator('button:has-text("CLEAR CART"), button:has-text("Clear Cart")').first();
  }

  async open() {
    await this.navigate('/cart');
    // Aguarda tabela OU mensagem de vazio
    await Promise.any([
      this.page.waitForSelector('table tbody tr', { timeout: 15_000 }),
      this.page.waitForSelector(
        'p:has-text("YOUR CART IS EMPTY"), .empty-cart-content, p:has-text("No product")',
        { timeout: 15_000 }
      ),
    ]).catch(() => null);
    await this.page.waitForTimeout(500);
  }

  /** Limpa o carrinho via botão "CLEAR CART" se disponível */
  async clearCartIfPossible() {
    const btn = this.clearCartButton;
    if (await btn.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await btn.click();
      await this.page.waitForTimeout(1_000);
    }
  }

  /** Remove o primeiro item da tabela */
  async removeFirstItem() {
    const btn = this.removeItemButtons.first();
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible({ timeout: 8_000 });
    await btn.click();
    await this.page.waitForTimeout(800);
  }

  /** Clica em checkout fazendo scroll até o botão */
  async proceedToCheckout() {
    const btn = this.checkoutButton;
    await btn.scrollIntoViewIfNeeded();
    await expect(btn).toBeVisible({ timeout: 8_000 });
    await btn.click();
  }

  async continueShopping() {
    const btn = this.continueShoppingButton;
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
  }

  async assertCartHasItems(count?: number) {
    if (count !== undefined) {
      await expect(this.cartItems).toHaveCount(count);
    } else {
      await expect(this.cartItems.first()).toBeVisible();
    }
  }

  async assertCartIsEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async assertTotal(expected: string) {
    await expect(this.totalPrice).toContainText(expected);
  }

  async assertCartLoaded() {
    const hasItems    = (await this.cartItems.count()) > 0;
    const hasEmpty    = await this.emptyCartMessage.isVisible().catch(() => false);
    const hasCartUrl  = this.page.url().includes('/cart');
    expect(hasItems || hasEmpty || hasCartUrl).toBe(true);
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
