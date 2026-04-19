import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Config — QAZANDO Shop Automation
 *
 * Variáveis de ambiente suportadas:
 *   BASE_URL           → URL do sistema (padrão: automationpratice.com.br)
 *   TEST_USER_EMAIL    → E-mail do usuário de teste
 *   TEST_USER_PASSWORD → Senha do usuário de teste
 *   CI                 → Define modo CI (sem paralelismo, com retries)
 */

const BASE_URL = (process.env.BASE_URL ?? 'https://www.automationpratice.com.br')
  .trim()
  .replace(/\/+$/, '');

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],

  use: {
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true,
  },

  timeout: 60_000,

  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      animations: 'disabled',
    },
  },

  snapshotDir: './tests/snapshots',
  outputDir: 'test-results/',

  projects: [
    // ── Desktop ───────────────────────────────────────────────────────────
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*visual\.spec\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /.*visual\.spec\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: /.*visual\.spec\.ts/,
    },

    // ── Mobile ────────────────────────────────────────────────────────────
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testIgnore: /.*visual\.spec\.ts/,
    },

    // ── Visual Regression (Chromium fixo para consistência de pixel) ──────
    {
      name: 'visual',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
      testMatch: /.*visual\.spec\.ts/,
    },
  ],
});
