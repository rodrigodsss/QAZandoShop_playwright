import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  readonly productContainer: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly productImage: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly successToast: Locator;
  readonly breadcrumb: Locator;
  readonly categoryBadge: Locator;

  constructor(page: Page) {
    super(page);

    this.productContainer = page.locator('.product-single-one, .product-details-content, .product_details_one').first();
    this.productTitle = page.locator('.product-title, .title, h2').first();
    this.productPrice = page.locator('.price, .product-price').first();
    this.productDescription = page.locator('.product-description, .description, p').nth(1);
    this.productImage = page.locator('.product-details-image img, .image img').first();
    this.quantityInput = page.locator('input[type="number"]').first();
    this.addToCartButton = page.locator('button.add-to-cart, button:has-text("Add to cart")').first();
    this.successToast = page.locator('.swal2-popup, .toast, .alert-success, text=/sucesso|added/i').first();
    this.breadcrumb = page.locator('.breadcrumb, .page-breadcrumb').first();
    this.categoryBadge = page.locator('.badges, .badge').first();
  }

  async waitForProductLoaded() {
    await expect(this.productTitle).toBeVisible({ timeout: 15_000 });
    await expect(this.productPrice).toBeVisible();
  }

  async setQuantity(qty: number) {
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill('');
    await this.quantityInput.fill(qty.toString());
  }

  async addToCart(quantity = 1) {
    await expect(this.addToCartButton).toBeVisible();

    if (quantity > 1 && (await this.quantityInput.count()) > 0) {
      await this.setQuantity(quantity);
    }

    await this.addToCartButton.click();
    await this.page.waitForTimeout(300);
  }

  async assertProductLoaded() {
    await this.waitForProductLoaded();
  }

  async assertAddedToCart() {
    await expect(this.successToast).toBeVisible({ timeout: 10_000 });
  }

  async assertProductTitleContains(text: string) {
    await expect(this.productTitle).toContainText(text);
  }

  async assertProductPriceVisible() {
    await expect(this.productPrice).toBeVisible();
  }

  async getProductTitle(): Promise<string> {
    const text = await this.productTitle.textContent();
    return text?.trim() ?? '';
  }

  async getProductPrice(): Promise<string> {
    const text = await this.productPrice.textContent();
    return text?.trim() ?? '';
  }
}
