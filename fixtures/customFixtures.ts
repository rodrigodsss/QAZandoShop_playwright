import { expect, test as base } from '@playwright/test';
import { CartPage } from '../pages/CartPage';
import { HomePage } from '../pages/HomePage';
import { LoginPage } from '../pages/LoginPage';
import { NavbarComponent } from '../pages/NavbarComponent';
import { USERS } from './testData';

type CustomFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  cartPage: CartPage;
  navbar: NavbarComponent;
  loggedInPage: HomePage;
};

export const test = base.extend<CustomFixtures>({

  homePage: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.open();
    await use(home);
  },

  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await use(login);
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  navbar: async ({ page }, use) => {
    const home = new HomePage(page);
    await home.open();
    await use(new NavbarComponent(page));
  },

  loggedInPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.open();
    await login.login(USERS.valid.email, USERS.valid.password);

    // Aguarda qualquer redirecionamento pós-login
    await Promise.any([
      page.waitForURL(/\/my-account$/, { timeout: 10_000 }),
      page.waitForURL(/\/$/, { timeout: 10_000 }),
      page.waitForURL(/\/shop$/, { timeout: 10_000 }),
    ]).catch(() => null);

    // Se ainda estiver no login, pula o teste (usuário não cadastrado)
    if (page.url().includes('/login')) {
      await use(new HomePage(page));
      return;
    }

    const home = new HomePage(page);
    await home.open();
    await use(home);
  },
});

export { expect } from '@playwright/test';
