import { Page } from '@playwright/test';

/**
 * utils/helpers.ts
 * Funções utilitárias reutilizáveis.
 */

// ── Tempo ──────────────────────────────────────────────────────────────────

/**
 * Evite usar sleep. Use apenas como fallback controlado.
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, ms));
}

// ── Formatação ─────────────────────────────────────────────────────────────

export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valueInCents / 100);
}

export function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, '-') // evita problemas em nomes de arquivo
    .slice(0, 19);
}

// ── Browser / Page ─────────────────────────────────────────────────────────

/**
 * Garante que apenas UM listener de dialog será registrado.
 */
export function autoAcceptDialogs(page: Page): void {
  page.removeAllListeners('dialog');

  page.on('dialog', async dialog => {
    try {
      await dialog.accept();
    } catch {
      // ignora falhas silenciosamente
    }
  });
}

/**
 * Define localStorage antes da navegação.
 * Use preferencialmente com page.addInitScript.
 */
export async function setLocalStorage(
  page: Page,
  data: Record<string, string>
): Promise<void> {
  await page.addInitScript((entries) => {
    for (const [key, value] of Object.entries(entries)) {
      localStorage.setItem(key, value);
    }
  }, data);
}

/**
 * Limpa localStorage de forma segura.
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear();
  });
}

/**
 * Aguarda elemento visível com retry inteligente.
 */
export async function waitForVisible(
  page: Page,
  selector: string,
  timeout = 10000
): Promise<void> {
  await page.locator(selector).waitFor({
    state: 'visible',
    timeout,
  });
}

// ── Strings ────────────────────────────────────────────────────────────────

export function extractNumbers(text: string): string {
  return text.replace(/\D+/g, '');
}

/**
 * Validação de e-mail (melhorada, ainda não RFC full — intencional)
 */
export function isValidEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}