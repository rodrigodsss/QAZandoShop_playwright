import { expect, Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path = '/') {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async navigateAndValidate(path: string, validationLocator: Locator) {
    await this.navigate(path);
    await this.waitForElement(validationLocator);
  }

  async waitForPageReady(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async waitForElement(locator: Locator, timeout = 10_000) {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async click(locator: Locator) {
    await expect(locator).toBeVisible();
    await locator.click();
  }

  async fillField(locator: Locator, value: string) {
    await expect(locator).toBeVisible();
    await locator.fill('');
    await locator.fill(value);
  }

  async scrollToElement(locator: Locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async assertURL(expectedURL: string | RegExp) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async assertExactURL(expectedURL: string) {
    await expect(this.page).toHaveURL(expectedURL);
  }

  async assertTitle(title: string) {
    await expect(this.page).toHaveTitle(new RegExp(title, 'i'));
  }

  async assertVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }

  async assertText(locator: Locator, text: string) {
    await expect(locator).toContainText(text);
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `test-results/screenshots/${Date.now()}-${name}.png`,
      fullPage: true,
    });
  }

  async waitForTimeout(ms: number) {
    await this.page.waitForTimeout(ms);
  }
}
