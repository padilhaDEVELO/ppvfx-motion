import type { Page, BrowserContext } from '@playwright/test';

export const PROJETOS: { slug: string; titulo: string; video: string; formato: string }[] = (
  await import('../src/content/projetos.json', { with: { type: 'json' } })
).default;

export const LARGURAS = [320, 390, 640, 768, 1024, 1440];

/** Substitui o player do YouTube por uma página local: testes rápidos e sem rede. */
export async function youtubeSimulado(alvo: Page | BrowserContext) {
  await alvo.route('https://www.youtube-nocookie.com/**', (r) =>
    r.fulfill({ contentType: 'text/html', body: '<!doctype html><title>player simulado</title><p>player</p>' }),
  );
}

/** Coleta violações de CSP e erros de execução da página. */
export function vigiarErros(page: Page) {
  const erros: string[] = [];
  page.on('console', (m) => {
    const t = m.text();
    if (m.type() === 'error' || /content.security.policy/i.test(t)) erros.push(`[console] ${t}`);
  });
  page.on('pageerror', (e) => erros.push(`[pageerror] ${e.message}`));
  return erros;
}

/** Rola a página inteira para disparar revelações e carregamentos tardios.
 *  O laço fica no teste (não na página) para funcionar também sem JavaScript. */
export async function rolarTudo(page: Page) {
  const { altura, passo } = await page.evaluate(() => ({ altura: document.documentElement.scrollHeight, passo: Math.max(200, Math.floor(innerHeight * 0.7)) }));
  for (let y = 0; y <= altura; y += passo) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(150);
}
