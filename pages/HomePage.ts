import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  readonly navbar: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly cartIcon: Locator;
  readonly productCards: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;
  readonly addToCartButtons: Locator;

  constructor(page: Page) {
    super(page);

    this.navbar = page.locator('.header-section, .mobile-header').first();
    this.loginLink = page.locator('a[href="/login"]').first();
    this.registerLink = page.locator('a[href="/register"]').first();
    this.cartIcon = page.locator('.header-action-link a:has(.fa-shopping-bag), a[href="/cart"]').first();
    this.productCards = page.locator('.product_wrappers_one, .product_item_two');
    this.productTitles = this.productCards.locator('.title a, .product_title a');
    this.productPrices = this.productCards.locator('.price, .item_price');
    this.addToCartButtons = this.productCards.locator('button.add-to-cart, button:has-text("Add to cart")');
  }

  async open() {
    await this.navigate('/shop');
    await expect(this.productCards.first()).toBeVisible({ timeout: 20_000 });
  }

  async goToLogin() {
    await expect(this.loginLink).toBeVisible();
    await this.loginLink.click();
    await this.assertURL(/\/login$/);
  }

  async goToRegister() {
    await expect(this.registerLink).toBeVisible();
    await this.registerLink.click();
    await this.assertURL(/\/register$/);
  }

  async goToCart() {
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await this.assertURL(/\/cart$/);
  }

  async addProductToCartByIndex(index = 0) {
    const card = this.productCards.nth(index);
    const button = this.addToCartButtons.nth(index);
    await expect(card).toBeVisible();
    await card.hover();
    await button.click({ force: true });
  }

  async clickProductByIndex(index = 0) {
    const link = this.productTitles.nth(index);
    await expect(link).toBeVisible();
    await link.click();
  }

  async assertProductsVisible() {
    await expect(this.productCards.first()).toBeVisible();
  }

  async assertProductCountGreaterThan(min: number) {
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(min);
  }
}
