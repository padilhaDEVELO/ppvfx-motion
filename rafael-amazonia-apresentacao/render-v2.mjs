import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const deckDir = path.resolve(import.meta.dirname);
const inputHtml = path.join(deckDir, "apresentacao.html");
const outputHtml = path.join(deckDir, "apresentacao-v2-revisada.html");
const outputPdf = path.resolve(deckDir, "..", "pdf", "estrategia-rafael-amazonia-na-cuia-v2-revisada.pdf");

const replaceOnce = (source, search, replacement, label) => {
  const first = source.indexOf(search);
  if (first === -1) throw new Error(`Trecho não encontrado: ${label}`);
  if (source.indexOf(search, first + search.length) !== -1) {
    throw new Error(`Trecho duplicado; substituição ambígua: ${label}`);
  }
  return source.replace(search, replacement);
};

const corrections = `
    /* Revisão UI/UX v2: ajustes de contraste e visualização de dados. */
    :root {
      --muted: #5f6b63;
      --orange-text: #a94524;
      --brown-text: #604126;
    }

    .slide::after { color: var(--muted); }
    .dark::after, .brown::after { color: rgba(244, 237, 225, .72); }
    .kicker { color: var(--orange-text); }
    .dark .small, .brown .small,
    .dark .source, .brown .source { color: rgba(244, 237, 225, .72); }
    .source { z-index: 4; font-size: 12px; }
    .pill.orange, .scenario .scenario-name { color: var(--orange-text); }
    .badge { background: var(--orange-text); }
    .yellow .kicker,
    .yellow .source,
    .yellow .footer-quote,
    .yellow .small[style*="color:var(--brown)"],
    .yellow .process .num { color: var(--brown-text) !important; }

    .target-card .big-number { color: var(--yellow); }

    .benchmark-scale {
      position: relative;
      height: 18px;
      margin: 8px 82px 0 204px;
      color: var(--muted);
      font-size: 11px;
      font-weight: 800;
    }
    .benchmark-scale .start { position: absolute; left: 0; }
    .benchmark-scale .median { position: absolute; left: 40%; transform: translateX(-50%); }
    .benchmark-scale .end { position: absolute; right: 0; }
    .benchmark-track { position: relative; }
    .benchmark-track::after {
      content: "";
      position: absolute;
      z-index: 2;
      top: -3px;
      bottom: -3px;
      left: 40%;
      width: 2px;
      border-radius: 2px;
      background: var(--brown-text);
    }
    .index-card .bar-row { margin: 10px 0; }
    .duration-callout {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 20px;
      margin-top: 18px;
      padding: 14px 16px;
      border-radius: 14px;
      background: rgba(203, 92, 47, .11);
      border-left: 5px solid var(--orange);
    }
    .duration-callout .duration-label {
      display: block;
      margin-bottom: 2px;
      color: var(--brown-text);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    .duration-callout strong {
      color: var(--green-dark);
      font-family: "Avenir Next Condensed", "Avenir Next", sans-serif;
      font-size: 30px;
      line-height: 1;
    }
    .duration-callout .duration-note {
      max-width: 170px;
      color: var(--brown-text);
      font-size: 12px;
      font-weight: 800;
      line-height: 1.25;
      text-align: right;
    }
`;

const oldChart = `        <div class="card">
          <div class="label">Índice: mediana dos 14 Reels anteriores = 100</div>
          <div class="bar-row"><div class="name">Visualizações</div><div class="bar-track"><div class="bar-fill orange" style="width:51%"></div></div><div class="bar-value">51</div></div>
          <div class="bar-row"><div class="name">Curtidas</div><div class="bar-track"><div class="bar-fill" style="width:94%"></div></div><div class="bar-value">94</div></div>
          <div class="bar-row"><div class="name">Comentários</div><div class="bar-track"><div class="bar-fill yellow" style="width:100%"></div></div><div class="bar-value">240</div></div>
          <div class="bar-row"><div class="name">Interação parcial</div><div class="bar-track"><div class="bar-fill yellow" style="width:100%"></div></div><div class="bar-value">196</div></div>
          <div class="bar-row"><div class="name">Duração</div><div class="bar-track"><div class="bar-fill orange" style="width:100%"></div></div><div class="bar-value">800</div></div>
        </div>`;

const newChart = `        <div class="card index-card">
          <div class="label">Índice: mediana dos 14 Reels anteriores = 100</div>
          <div class="benchmark-scale"><span class="start">0</span><span class="median">100 - mediana</span><span class="end">250</span></div>
          <div class="bar-row"><div class="name">Visualizações</div><div class="bar-track benchmark-track"><div class="bar-fill orange" style="width:20.4%"></div></div><div class="bar-value">51</div></div>
          <div class="bar-row"><div class="name">Curtidas</div><div class="bar-track benchmark-track"><div class="bar-fill" style="width:37.6%"></div></div><div class="bar-value">94</div></div>
          <div class="bar-row"><div class="name">Comentários</div><div class="bar-track benchmark-track"><div class="bar-fill yellow" style="width:96%"></div></div><div class="bar-value">240</div></div>
          <div class="bar-row"><div class="name">Interação parcial</div><div class="bar-track benchmark-track"><div class="bar-fill yellow" style="width:78.4%"></div></div><div class="bar-value">196</div></div>
          <div class="duration-callout"><div><span class="duration-label">Duração</span><strong>Índice 800</strong></div><div class="duration-note">8x a mediana, exibido fora da escala do gráfico</div></div>
        </div>`;

let html = await readFile(inputHtml, "utf8");
html = replaceOnce(html, "    @media print {", `${corrections}\n    @media print {`, "bloco de estilos de revisão");
html = replaceOnce(html, oldChart, newChart, "gráfico do slide 13");
html = replaceOnce(
  html,
  '<div class="card" style="background:var(--green); color:var(--cream)"><div class="label" style="color:var(--yellow)">Alvo</div><div class="big-number">16,1 mil</div>',
  '<div class="card target-card" style="background:var(--green); color:var(--cream)"><div class="label" style="color:var(--yellow)">Alvo</div><div class="big-number">16,1 mil</div>',
  "card-alvo do slide 30",
);

await writeFile(outputHtml, html, "utf8");

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].filter(Boolean);

let executablePath;
for (const candidate of chromeCandidates) {
  try {
    await access(candidate);
    executablePath = candidate;
    break;
  } catch {
    // Try the next local browser.
  }
}

const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ["--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto(pathToFileURL(outputHtml).href, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve, reject) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", reject, { once: true });
            }),
      ),
    );
  });
  await page.emulateMedia({ media: "print" });
  await page.pdf({
    path: outputPdf,
    printBackground: true,
    preferCSSPageSize: true,
    width: "13.333333in",
    height: "7.5in",
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });
} finally {
  await browser.close();
}

console.log(outputHtml);
console.log(outputPdf);
