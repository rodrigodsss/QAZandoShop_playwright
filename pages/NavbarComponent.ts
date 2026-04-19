import { expect, Locator, Page } from '@playwright/test';

export class NavbarComponent {
  readonly page: Page;
  readonly navbar: Locator;
  readonly brand: Locator;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly hamburgerToggle: Locator;
  readonly navCollapse: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('.header-section, .mobile-header').first();
    this.brand = page.locator('.logo a, .mobile-menu-logo a').first();
    this.loginLink = page.locator('a[href="/login"]').first();
    this.registerLink = page.locator('a[href="/register"]').first();
    this.cartLink = page.locator('.header-action-link a:has(.fa-shopping-bag), a[href="/cart"]').first();
    this.cartBadge = page.locator('.item-count').last();
    this.hamburgerToggle = page.locator('.offside-menu, .fa-bars').first();
    this.navCollapse = page.locator('.offcanvas-mobile-menu-wrapper').first();
  }

  async goToLogin() {
    await expect(this.loginLink).toBeVisible();
    await this.loginLink.click();
    await expect(this.page).toHaveURL(/\/login$/);
  }

  async goToRegister() {
    await expect(this.registerLink).toBeVisible();
    await this.registerLink.click();
    await expect(this.page).toHaveURL(/\/register$/);
  }

  async goToCart() {
    await this.page.goto('/cart', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveURL(/\/cart$/);
  }

  async goToHome() {
    await expect(this.brand).toBeVisible();
    await this.brand.click();
    await expect(this.page).toHaveURL(/\/$/);
  }

  async openMobileMenu() {
    if (await this.hamburgerToggle.isVisible().catch(() => false)) {
      await this.hamburgerToggle.click();
      await expect(this.navCollapse).toBeVisible();
    }
  }

  async assertVisible() {
    await expect(this.navbar).toBeVisible();
  }

  async assertLoginLinkVisible() {
    await expect(this.loginLink).toBeVisible();
  }

  async assertCartLinkVisible() {
    await expect(this.cartLink).toBeVisible();
  }

  async assertCartBadgeValue(expected: string) {
    await expect(this.cartBadge).toContainText(expected);
  }
}
