import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { LoginPage } from '../../pages/LoginPage';

test.describe('⚡ Performance & Rede', () => {

  // ── Tempo de carregamento ─────────────────────────────────────────────────

  test('@regression home deve carregar rapidamente', async ({ page }) => {
    const home = new HomePage(page);

    const start = performance.now();
    await home.open();
    await home.assertProductsVisible();
    const elapsed = performance.now() - start;

    expect(elapsed, `Home demorou ${elapsed.toFixed(0)}ms`).toBeLessThan(10_000);
  });

  test('@regression login deve carregar rapidamente', async ({ page }) => {
    const login = new LoginPage(page);

    const start = performance.now();
    await login.open();
    await expect(login.emailInput).toBeVisible();
    const elapsed = performance.now() - start;

    expect(elapsed, `Login demorou ${elapsed.toFixed(0)}ms`).toBeLessThan(8_000);
  });

  // ── Console errors ────────────────────────────────────────────────────────

  test('@regression home não deve ter erros críticos no console', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();

    const relevantErrors = errors.filter(e =>
      !e.includes('extension') &&
      !e.includes('favicon') &&
      !e.includes('ERR_BLOCKED_BY_CLIENT') &&
      !e.includes('net::ERR')
    );

    expect(relevantErrors, `Erros no console: ${relevantErrors.join(', ')}`).toHaveLength(0);
  });

  // ── Status HTTP ───────────────────────────────────────────────────────────

  test('@regression home deve retornar status 200', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    expect(response!.status()).toBe(200);
  });

  test('@regression não deve haver respostas 5xx', async ({ page }) => {
    const failed: string[] = [];

    page.on('response', res => {
      if (res.status() >= 500) {
        failed.push(`${res.status()} - ${res.url()}`);
      }
    });

    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();

    expect(failed, `Erros 5xx: ${failed.join(', ')}`).toHaveLength(0);
  });

  // ── Conteúdo mínimo ──────────────────────────────────────────────────────

  test('@smoke home deve renderizar produtos', async ({ page }) => {
    const home = new HomePage(page);

    await home.open();
    await home.assertProductsVisible();

    const count = await home.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  // ── Imagens ──────────────────────────────────────────────────────────────

  test('@regression imagens não devem falhar', async ({ page }) => {
    const broken: string[] = [];

    page.on('response', res => {
      const url = res.url();

      if (
        /\.(png|jpg|jpeg|webp)/i.test(url) &&
        res.status() >= 400
      ) {
        broken.push(`${res.status()} - ${url}`);
      }
    });

    const home = new HomePage(page);
    await home.open();
    await home.assertProductsVisible();

    // pequena estabilização para lazy-load (controlada)
    await page.waitForTimeout(500);

    expect(broken, `Imagens quebradas: ${broken.join(', ')}`).toHaveLength(0);
  });

  // ── Responsividade ────────────────────────────────────────────────────────

  test('@regression deve renderizar em múltiplos viewports', async ({ page }) => {
    const home = new HomePage(page);

    const viewports = [
      { width: 375, height: 812, label: 'Mobile' },
      { width: 768, height: 1024, label: 'Tablet' },
      { width: 1280, height: 800, label: 'Desktop' },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      await home.open();
      await home.assertProductsVisible();

      const count = await home.productCards.count();
      expect(count, `${vp.label}: nenhum produto`).toBeGreaterThan(0);
    }
  });

});