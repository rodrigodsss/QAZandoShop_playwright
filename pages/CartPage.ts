import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

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

    this.cartItems = page.locator('.table_desc tbody tr, .cart_submit tbody tr');
    this.totalPrice = page.locator('.cart_amount, .offcanvas-cart-total-price-value').last();
    this.checkoutButton = page.locator('a:has-text("CHECKOUT"), a:has-text("Checkout"), .checkout_btn a').first();
    this.removeItemButtons = page.locator('.product_remove button, .product_remove a, button:has-text("Remove")');
    this.emptyCartMessage = page.locator('text=/YOUR CART IS EMPTY|No Item Found Inside Your Cart|carrinho vazio/i').first();
    this.quantityInputs = page.locator('input[type="number"]');
    this.continueShoppingButton = page.locator('a:has-text("Continue Shopping"), a[href="/shop"]').first();
    this.cartTitle = page.locator('h1, h2, h3, text=/Shopping Cart|Cart Total/i').first();
    this.clearCartButton = page.locator('button:has-text("Clear cart")').first();
  }

  async open() {
    await this.navigate('/cart');

    const pageReady = await Promise.any([
      this.cartTitle.waitFor({ state: 'visible', timeout: 15_000 }),
      this.emptyCartMessage.waitFor({ state: 'visible', timeout: 15_000 }),
      this.cartItems.first().waitFor({ state: 'visible', timeout: 15_000 }),
    ]).catch(() => null);

    expect(pageReady).not.toBeNull();
  }

  async clearCartIfPossible() {
    if (await this.clearCartButton.isVisible().catch(() => false)) {
      await this.clearCartButton.click();
      await this.page.waitForTimeout(500);
    }
  }

  async removeFirstItem() {
    await expect(this.removeItemButtons.first()).toBeVisible();
    await this.removeItemButtons.first().click();
    await this.page.waitForTimeout(300);
  }

  async updateQuantity(index: number, qty: number) {
    const input = this.quantityInputs.nth(index);
    await expect(input).toBeVisible();
    await input.fill('');
    await input.fill(qty.toString());
  }

  async proceedToCheckout() {
    await expect(this.checkoutButton).toBeVisible();
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await expect(this.continueShoppingButton).toBeVisible();
    await this.continueShoppingButton.click();
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
    const hasCartUrl = this.page.url().includes('/cart');
    const hasTitle = await this.cartTitle.isVisible().catch(() => false);
    const hasEmptyState = await this.emptyCartMessage.isVisible().catch(() => false);
    const hasItems = (await this.cartItems.count()) > 0;
    const hasCheckout = await this.checkoutButton.isVisible().catch(() => false);
    expect(hasCartUrl || hasTitle || hasEmptyState || hasItems || hasCheckout).toBe(true);
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }
}
