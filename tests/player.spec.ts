import { test, expect, type Page } from '@playwright/test';
import { PROJETOS, youtubeSimulado, vigiarErros } from './apoio';

const dialogo = (page: Page) => page.locator('dialog#player');
const iframes = (page: Page) => page.locator('dialog#player iframe');
const travado = (page: Page) => page.evaluate(() => getComputedStyle(document.documentElement).overflow === 'hidden');

test.beforeEach(async ({ page }) => { await youtubeSimulado(page); });

test('regressão: seta no card não impede Enter de abrir o vídeo', async ({ page }) => {
  await page.goto('./');
  const card = page.locator('[data-video]').first();
  await card.focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowLeft');
  await card.focus();
  await page.keyboard.press('Enter');
  await expect(dialogo(page)).toBeVisible();
  await expect(iframes(page)).toHaveCount(1);
});

test('Espaço abre; Escape fecha e devolve o foco ao card', async ({ page }) => {
  await page.goto('./');
  const card = page.locator('[data-video]').nth(2);
  await card.focus();
  await page.keyboard.press(' ');
  await expect(dialogo(page)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Fechar vídeo' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialogo(page)).toBeHidden();
  await expect(iframes(page)).toHaveCount(0);
  await expect(card).toBeFocused();
  expect(await travado(page)).toBe(false);
});

test('foco fica contido no diálogo enquanto aberto', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'WebKit não percorre links com Tab por padrão (preferência do Safari).');
  await page.goto('./');
  await page.locator('[data-video]').first().click();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    const dentro = await page.evaluate(() => {
      const a = document.activeElement;
      return !a || a === document.body || !!a.closest('dialog#player') || a.tagName === 'IFRAME';
    });
    expect(dentro).toBe(true);
  }
});

test('os sete vídeos abrem com ID, título e proporção corretos', async ({ page }) => {
  const erros = vigiarErros(page);
  await page.goto('./');
  const cards = page.locator('[data-video]');
  await expect(cards).toHaveCount(PROJETOS.length);
  for (const p of PROJETOS) {
    const card = page.locator(`[data-video="${p.video}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(dialogo(page)).toBeVisible();
    await expect(dialogo(page)).toHaveAttribute('data-formato', p.formato);
    const ifr = iframes(page);
    await expect(ifr).toHaveCount(1);
    await expect(ifr).toHaveAttribute('src', new RegExp(`^https://www\\.youtube-nocookie\\.com/embed/${p.video}\\?`));
    await expect(ifr).toHaveAttribute('title', `Vídeo: ${p.titulo}`);
    await expect(page.locator('#player-titulo')).toHaveText(p.titulo);
    await page.keyboard.press('Escape');
    await expect(dialogo(page)).toBeHidden();
    await expect(card).toBeFocused();
  }
  expect(erros).toEqual([]);
});

test('abrir e fechar repetidamente: um só player, sem áudio residual nem rolagem travada', async ({ page }) => {
  await page.goto('./');
  for (let i = 0; i < 4; i++) {
    await page.locator('[data-video]').nth(i % 2).click();
    await expect(iframes(page)).toHaveCount(1);
    expect(await travado(page)).toBe(true);
    if (i % 2) await page.getByRole('button', { name: 'Fechar vídeo' }).click();
    else await page.keyboard.press('Escape');
    await expect(iframes(page)).toHaveCount(0);
    expect(await travado(page)).toBe(false);
  }
  expect(await page.locator('iframe').count()).toBe(0);
});

test('clique no fundo fecha o player', async ({ page }) => {
  await page.goto('./');
  await page.locator('[data-video]').first().click();
  await expect(dialogo(page)).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(dialogo(page)).toBeHidden();
});

test('permissões do iframe: só o necessário', async ({ page }) => {
  await page.goto('./');
  await page.locator('[data-video]').first().click();
  const ifr = iframes(page);
  await expect(ifr).toHaveAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
  await expect(ifr).toHaveAttribute('sandbox', /allow-scripts/);
  const sandbox = (await ifr.getAttribute('sandbox')) ?? '';
  expect(sandbox).not.toMatch(/allow-top-navigation|allow-forms|allow-modals/);
});

test('player do projeto: mesma interação na página interna', async ({ page }) => {
  const p = PROJETOS[5];
  await page.goto(`projetos/${p.slug}/`);
  await page.locator(`[data-video="${p.video}"]`).click();
  await expect(iframes(page)).toHaveCount(1);
  await page.keyboard.press('Escape');
  await expect(iframes(page)).toHaveCount(0);
});
