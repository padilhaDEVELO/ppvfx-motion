import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PROJETOS, LARGURAS, rolarTudo, youtubeSimulado, vigiarErros } from './apoio';
const routes = ['en/', 'en/privacy/', ...PROJETOS.map(p => `en/work/${p.slug}/`)];

test('idiomas: todas as rotas têm troca recíproca, canonical e hreflang', async ({ page, request }) => {
  const errors = vigiarErros(page);
  for (const route of routes) {
    await page.goto(route);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://padilhadevelo.github.io/ppvfx-motion/${route}`);
    await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', `https://padilhadevelo.github.io/ppvfx-motion/${route}`);
    await page.getByRole('link', {name:'Ver em português'}).click();
    await expect(page.locator('html')).toHaveAttribute('lang','pt-BR');
    await page.getByRole('link', {name:'View in English'}).click();
    await expect(page).toHaveURL(new RegExp(route + '$'));
    await expect(page.locator('h1')).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect((await request.get('og-en.png')).headers()['content-type']).toContain('image/png');
});

for (const width of LARGURAS) {
  test(`inglês sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({width, height:900});
    for (const route of ['en/', 'en/privacy/', 'en/work/producao-completa/', 'en/work/lancamento-animado/']) {
      await page.goto(route);
      const sizes = await page.evaluate(() => ({scroll:document.documentElement.scrollWidth, client:document.documentElement.clientWidth}));
      expect(sizes.scroll, route).toBeLessThanOrEqual(sizes.client);
      if (width < 1000) {
        const menu = await page.getByRole('button', {name: 'Menu'}).boundingBox();
        expect(menu!.width).toBeGreaterThanOrEqual(44);
        expect(menu!.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
}

for (const route of ['en/', 'en/privacy/', 'en/work/producao-completa/', 'en/work/lancamento-animado/']) {
  test(`acessibilidade em inglês: ${route}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion:'reduce' });
    await page.goto(route);
    await rolarTudo(page);
    const audit = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa','best-practice']).analyze();
    expect(audit.violations.map(v => `${v.id}: ${v.nodes.map(n=>n.target).join(' | ')}`)).toEqual([]);
  });
}

test('player inglês: acessível, fallback correto e foco restaurado', async ({ page }) => {
  await youtubeSimulado(page);
  await page.goto('en/');
  const trigger = page.locator('[data-video]').first();
  await trigger.click();
  const dialog = page.locator('#player');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('iframe')).toHaveAttribute('title', /^Video: Círio/);
  await expect(dialog.getByRole('link',{name:'Watch on YouTube'})).toHaveAttribute('href', 'https://www.youtube.com/watch?v=cM_V5sN7SLY');
  await dialog.getByRole('button',{name:'Close video'}).click();
  await expect(dialog.locator('iframe')).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('menu inglês leva à seção e contatos abrem no destino esperado', async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto('en/');
  await page.getByRole('button',{name:'Menu'}).click();
  await page.locator('#menu-principal').getByRole('link',{name:'Experience',exact:true}).click();
  await expect(page).toHaveURL(/en\/#about$/);
  await expect(page.locator('#menu-principal')).toBeHidden();
  await expect(page.locator('#contact a').first()).toHaveAttribute('href','https://www.linkedin.com/in/paulopadilhai/');
  const wa = await page.locator('#contact a[href*="wa.me"]').getAttribute('href');
  expect(new URL(wa!).searchParams.get('text')).toContain('remote video editing');
});

test.describe('inglês sem JavaScript', () => {
  test.use({javaScriptEnabled:false});
  test('projetos e vídeos continuam acessíveis, sem dependência de terceiros na carga', async ({ page }) => {
    const external:string[]=[];
    page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1')) external.push(r.url());});
    await page.goto('en/');
    await rolarTudo(page);
    await expect(page.locator('[data-video]')).toHaveCount(7);
    await expect(page.locator('iframe')).toHaveCount(0);
    expect(external).toEqual([]);
    await page.getByRole('link',{name:/Project details\s*:\s*Círio 2023 — video & motion/}).click();
    await expect(page.locator('h1')).toHaveText('Círio 2023 — video & motion');
    await expect(page.locator('[data-video]')).toHaveAttribute('href','https://www.youtube.com/watch?v=cM_V5sN7SLY');
  });
});
