import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PROJETOS, rolarTudo, vigiarErros, youtubeSimulado } from './apoio';

const PAGINAS = ['./', `projetos/${PROJETOS[0].slug}/`, `projetos/${PROJETOS[5].slug}/`, 'privacidade/', 'nao-existe/'];

test.describe('acessibilidade (axe, WCAG 2.2 AA)', () => {
  for (const caminho of PAGINAS) {
    test(`sem violações: ${caminho}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' }); // estado final, sem animação no meio
      await page.goto(caminho);
      await rolarTudo(page);
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)).toEqual([]);
    });
  }

  test('sem violações com o player aberto', async ({ page }) => {
    await youtubeSimulado(page);
    await page.goto('./');
    await page.locator('[data-video]').first().click();
    const r = await new AxeBuilder({ page }).include('dialog#player').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(r.violations.map((v) => v.id)).toEqual([]);
  });
});

test('CSP ativa e sem violações em nenhuma página', async ({ page }) => {
  await youtubeSimulado(page);
  const erros = vigiarErros(page);
  for (const caminho of PAGINAS) {
    await page.goto(caminho);
    const csp = await page.locator('meta[http-equiv="content-security-policy"]').getAttribute('content');
    expect(csp).toContain("default-src 'self'");
    expect(csp).not.toMatch(/unsafe-eval|unsafe-inline/);
    await rolarTudo(page);
  }
  await page.goto('./');
  await page.locator('[data-video]').first().click();
  await expect(page.locator('dialog#player iframe')).toHaveCount(1);
  // O 404 de propósito da página inexistente não conta; violações de CSP e erros de script sim.
  expect(erros.filter((e) => !/status of 404/.test(e))).toEqual([]);
});

test('CSP bloqueia de fato script externo não previsto', async ({ page }) => {
  const bloqueios: string[] = [];
  page.on('console', (m) => { if (/content.security.policy/i.test(m.text())) bloqueios.push(m.text()); });
  await page.goto('./');
  const executou = await page.evaluate(async () => {
    const s = document.createElement('script');
    s.src = 'https://example.com/x.js';
    const ok = await new Promise<boolean>((res) => { s.onload = () => res(true); s.onerror = () => res(false); document.head.append(s); });
    return ok;
  });
  expect(executou).toBe(false);
});

test('SEO: títulos, descrição, canonical, imagem social, sitemap e robots', async ({ page, request }) => {
  await page.goto('./');
  await expect(page).toHaveTitle('Paulo Padilha — Motion Design & Edição de Vídeo');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://padilhadevelo.github.io/ppvfx-motion/');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.{50,}/);
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toBe('https://padilhadevelo.github.io/ppvfx-motion/og.png');
  expect((await request.get('og.png')).headers()['content-type']).toContain('image/png');

  for (const p of PROJETOS) {
    await page.goto(`projetos/${p.slug}/`);
    await expect(page).toHaveTitle(`${p.titulo} — Paulo Padilha`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://padilhadevelo.github.io/ppvfx-motion/projetos/${p.slug}/`);
  }

  const robots = await (await request.get('robots.txt')).text();
  expect(robots).toContain('Sitemap: https://padilhadevelo.github.io/ppvfx-motion/sitemap.xml');
  const sitemap = await (await request.get('sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)?.length).toBe(PROJETOS.length + 2);
  expect(sitemap).not.toContain('404');

  await page.goto('nao-existe/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
});

test('imagens com dimensões explícitas e sem recursos de terceiros na carga', async ({ page }) => {
  const externos: string[] = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1')) externos.push(r.url()); });
  await page.goto('./');
  await rolarTudo(page);
  const semDimensao = await page.locator('img').evaluateAll((imgs) => imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length);
  expect(semDimensao).toBe(0);
  expect(externos).toEqual([]);
});

test('links externos abrem em nova aba com noopener e só para destinos previstos', async ({ page }) => {
  await page.goto('./');
  const hosts = await page.locator('a[href^="http"]').evaluateAll((as) =>
    as.map((a) => ({ host: new URL((a as HTMLAnchorElement).href).host, rel: a.getAttribute('rel') ?? '', alvo: a.getAttribute('target') })),
  );
  for (const h of hosts) {
    expect(['wa.me', 'www.instagram.com', 'www.youtube.com']).toContain(h.host);
    expect(h.alvo).toBe('_blank');
    expect(h.rel).toContain('noopener');
  }
  await expect(page.locator('a[href*="behance.net"], a[href="https://www.youtube.com"]')).toHaveCount(0);
});
