import { test, expect } from '@playwright/test';
import { LARGURAS, PROJETOS, rolarTudo, vigiarErros } from './apoio';

test('seções na ordem do plano e âncoras antigas preservadas', async ({ page }) => {
  await page.goto('./');
  const ids = await page.locator('main > section').evaluateAll((s) => s.map((x) => x.id));
  expect(ids).toEqual(['home', 'work', 'youtube', 'servicos', 'processo', 'about', 'precos', 'faq', 'contact']);
  for (const ancora of ['marcas', 'manifesto']) await expect(page.locator(`#${ancora}`)).toHaveCount(1);
});

for (const largura of LARGURAS) {
  test(`sem rolagem horizontal acidental em ${largura}px`, async ({ page }) => {
    await page.setViewportSize({ width: largura, height: 900 });
    for (const caminho of ['./', `projetos/${PROJETOS[0].slug}/`, `projetos/${PROJETOS[6].slug}/`, 'privacidade/', 'nao-existe/']) {
      await page.goto(caminho);
      await rolarTudo(page);
      const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
      expect(sw, `${caminho} em ${largura}px`).toBeLessThanOrEqual(cw);
    }
  });
}

test('menu no desktop: links visíveis e botão de menu oculto', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('./');
  await expect(page.locator('.menu-botao')).toBeHidden();
  for (const rotulo of ['Trabalhos', 'Serviços', 'Processo', 'Sobre', 'Preços', 'FAQ']) {
    await expect(page.locator('#menu-principal').getByRole('link', { name: rotulo, exact: true })).toBeVisible();
  }
});

test('menu no celular: abre, fecha com Escape e leva ao destino', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  const menu = page.locator('#menu-principal');
  const botao = page.getByRole('button', { name: 'Menu' });
  await expect(menu).toBeHidden();
  await botao.click();
  await expect(menu).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(menu).toBeHidden();

  await botao.click();
  await menu.getByRole('link', { name: 'Preços' }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/#precos$/);
  await expect(page.locator('#precos-titulo')).toBeInViewport();
});

test('carrossel: controles explícitos quando há rolagem', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('./');
  const trilho = page.locator('#work [data-trilho]');
  const faixa = trilho.locator('[data-faixa]');
  const proximo = trilho.getByRole('button', { name: /próximos/ });
  const anterior = trilho.getByRole('button', { name: /anteriores/ });
  await expect(proximo).toBeVisible();
  await expect(anterior).toBeDisabled();
  await proximo.click();
  await expect.poll(() => faixa.evaluate((f) => f.scrollLeft)).toBeGreaterThan(100);
  await expect(anterior).toBeEnabled();
});

test('página interna acessada direto e atualizada: rotas e recursos íntegros', async ({ page }) => {
  const falhas: string[] = [];
  page.on('response', (r) => { if (r.url().startsWith('http://127.0.0.1') && r.status() >= 400) falhas.push(`${r.status()} ${r.url()}`); });
  const erros = vigiarErros(page);
  for (const p of PROJETOS) {
    await page.goto(`projetos/${p.slug}/`);
    await page.reload();
    await expect(page.locator('h1')).toHaveText(p.titulo);
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(14, 16, 22)');
    await page.getByRole('link', { name: 'Todos os trabalhos' }).click();
    await expect(page).toHaveURL(/\/ppvfx-motion\/#work$/);
  }
  expect(falhas).toEqual([]);
  expect(erros).toEqual([]);
});

test('404 próprio com caminho de volta', async ({ page }) => {
  const r = await page.goto('qualquer/coisa/');
  expect(r?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('Página não encontrada.');
  await page.getByRole('link', { name: 'Ir para o início' }).click();
  await expect(page).toHaveURL(/\/ppvfx-motion\/$/);
});
