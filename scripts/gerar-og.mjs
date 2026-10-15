// Gera a imagem social própria (public/og.png, 1200×630) com as fontes da marca.
// Não depende de thumbnail de nenhum projeto. Uso: npm run og
// Requer o Chromium do Playwright (ver README: PLAYWRIGHT_BROWSERS_PATH).
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const fonte = async (pacote, arquivo) =>
  (await readFile(`${raiz}node_modules/@fontsource/${pacote}/files/${arquivo}`)).toString('base64');
const syne = await fonte('syne', 'syne-latin-800-normal.woff2');
const grotesk = await fonte('space-grotesk', 'space-grotesk-latin-500-normal.woff2');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Syne; font-weight: 800; src: url(data:font/woff2;base64,${syne}) format('woff2'); }
@font-face { font-family: 'Space Grotesk'; font-weight: 500; src: url(data:font/woff2;base64,${grotesk}) format('woff2'); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; background: #0e1016; color: #ece7e1; font-family: 'Space Grotesk'; position: relative; }
.a { position: absolute; border-radius: 50%; }
.a1 { width: 900px; height: 900px; left: -260px; top: -380px; background: radial-gradient(circle, rgba(59,7,100,.75), transparent 65%); }
.a2 { width: 700px; height: 700px; right: -220px; bottom: -330px; background: radial-gradient(circle, rgba(168,85,247,.28), transparent 65%); }
.conteudo { position: absolute; inset: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
.logo { font-family: Syne; font-size: 34px; letter-spacing: -0.02em; }
.ponto, .grad { background: linear-gradient(90deg, #ffaa40, #a855f7); -webkit-background-clip: text; background-clip: text; color: transparent; }
h1 { font-family: Syne; font-weight: 800; font-size: 132px; line-height: .95; letter-spacing: -0.03em; text-transform: uppercase; }
.sub { font-size: 30px; color: #a9abb2; letter-spacing: .02em; display: flex; align-items: center; gap: 20px; }
.linha { width: 64px; height: 4px; border-radius: 4px; background: linear-gradient(90deg, #ffaa40, #a855f7); }
</style></head><body>
<div class="a a1"></div><div class="a a2"></div>
<div class="conteudo">
  <div class="logo">ppvfx<span class="ponto">.</span></div>
  <h1>Paulo<br><span class="grad">Padilha</span></h1>
  <div class="sub"><span class="linha"></span>Motion Design &amp; Edição de Vídeo · Belém, PA</div>
</div></body></html>`;

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await pagina.setContent(html, { waitUntil: 'load' });
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: `${raiz}public/og.png`, type: 'png' });
await navegador.close();
console.log('og: public/og.png (1200×630)');
