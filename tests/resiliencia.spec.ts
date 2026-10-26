import { test, expect } from '@playwright/test';
import { PROJETOS, rolarTudo, vigiarErros } from './apoio';

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('trabalhos, preços, informações e contato continuam visíveis', async ({ page }) => {
    await page.goto('./');
    await rolarTudo(page);
    const invisiveis = await page.locator('main *').evaluateAll((els) =>
      els.filter((e) => getComputedStyle(e).opacity === '0' && !e.closest('[aria-hidden="true"]')).length,
    );
    expect(invisiveis).toBe(0);
    for (const preco of ['R$ 350', 'R$ 450', 'R$ 550', 'R$ 900']) await expect(page.getByText(preco).first()).toBeVisible();
    await expect(page.locator('#contact').getByRole('link', { name: /Falar sobre meu projeto/ })).toBeVisible();
    const links = page.locator('[data-video]');
    await expect(links).toHaveCount(PROJETOS.length);
    for (const p of PROJETOS) {
      await expect(page.locator(`[data-video="${p.video}"]`)).toHaveAttribute('href', `https://www.youtube.com/watch?v=${p.video}`);
    }
  });

  test('menu do celular funciona sem script (popover nativo)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('./');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.locator('#menu-principal').getByRole('link', { name: 'FAQ' })).toBeVisible();
  });
});

test('fontes bloqueadas: conteúdo segue legível', async ({ page }) => {
  await page.route('**/*.{woff,woff2}', (r) => r.abort());
  await page.goto('./');
  await expect(page.locator('#hero-nome')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Quanto custa.' })).toBeAttached();
});

test('YouTube bloqueado: caminho alternativo para assistir', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/**', (r) => r.abort());
  await page.goto('./');
  const p = PROJETOS[0];
  await page.locator(`[data-video="${p.video}"]`).click();
  const alternativa = page.locator('dialog#player').getByRole('link', { name: /Assistir no YouTube/ });
  await expect(alternativa).toBeVisible();
  await expect(alternativa).toHaveAttribute('href', `https://www.youtube.com/watch?v=${p.video}`);
});

test('movimento reduzido: nada fica escondido e o letreiro para', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  await rolarTudo(page);
  await expect(page.locator('.rv-espera')).toHaveCount(0);
  await expect(page.locator('.letreiro-faixa.copia')).toBeHidden();
});

test('revelação com JavaScript: tudo visível depois de rolar', async ({ page }) => {
  const erros = vigiarErros(page);
  await page.goto('./');
  await rolarTudo(page);
  await expect(page.locator('.rv-espera')).toHaveCount(0);
  expect(erros).toEqual([]);
});

test('rolagem instantânea até o fim e salto por âncora não deixam conteúdo escondido', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('#contact .rv-espera')).toHaveCount(0);
  await page.goto('./#precos');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('.rv-espera')).toHaveCount(0);
});
