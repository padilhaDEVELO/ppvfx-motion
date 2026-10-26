// Barreira de publicação: roda depois do build e falha se o artefato (dist/) tiver
// qualquer arquivo fora da lista aprovada, link interno quebrado, página sem CSP
// ou política insegura. Nada de cópia recursiva de outras pastas entra sem passar aqui.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = fileURLToPath(new URL('../dist/', import.meta.url));
const BASE = '/ppvfx-motion/';
const projetos = JSON.parse(await readFile(new URL('../src/content/projetos.json', import.meta.url), 'utf8'));
const slugs = new Set(projetos.map((p) => p.slug));

// Lista de publicação: páginas exatas + recursos gerados pelo Astro em _astro/.
const PAGINAS = new Set(['index.html', '404.html', 'privacidade/index.html', 'en/index.html', 'en/privacy/index.html', ...[...slugs].map((s) => `en/work/${s}/index.html`), ...[...slugs].map((s) => `projetos/${s}/index.html`)]);
const AVULSOS = new Set(['robots.txt', 'sitemap.xml', 'favicon.svg', 'og.png', 'og-en.png']);
const RECURSO = /^_astro\/[A-Za-z0-9_.-]+\.(?:css|js|avif|webp|jpg|jpeg|png|svg|woff2|woff)$/;
// Vídeos da seção de IA: nomes fixos, H.264 com faststart, até 8 MB cada.
const VIDEOS = new Set(['febracis-cis-belem.mp4', 'febracis-cis-vitoria.mp4', 'roi-makers-fernando-miranda.mp4', 'pitch-ia-aplicada-aos-negocios.mp4'].map((v) => `videos/${v}`));
const LIMITE_VIDEO = 8 * 1024 * 1024;
const LIMITE_TOTAL = 8 * 1024 * 1024; // 8 MB, sem contar os vídeos
const LIMITE_VIDEOS = 16 * 1024 * 1024; // 16 MB somando os vídeos

const erros = [];
const arquivos = [];
async function percorrer(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await percorrer(p);
    else arquivos.push(relative(RAIZ, p).split('\\').join('/'));
  }
}
await percorrer(RAIZ);

let total = 0;
let totalVideos = 0;
for (const a of arquivos) {
  const tamanho = (await stat(join(RAIZ, a))).size;
  if (VIDEOS.has(a)) {
    totalVideos += tamanho;
    if (tamanho > LIMITE_VIDEO) erros.push(`vídeo com ${(tamanho / 1048576).toFixed(1)} MB (limite 8 MB): ${a}`);
    const inicio = (await readFile(join(RAIZ, a))).subarray(0, 64 * 1024);
    if (inicio.indexOf('moov') < 0) erros.push(`vídeo sem faststart (moov fora do início): ${a}`);
    continue;
  }
  total += tamanho;
  if (!(PAGINAS.has(a) || AVULSOS.has(a) || RECURSO.test(a))) erros.push(`arquivo fora da lista de publicação: ${a}`);
}
for (const p of [...PAGINAS, ...AVULSOS, ...VIDEOS]) if (!arquivos.includes(p)) erros.push(`arquivo obrigatório ausente: ${p}`);
if (total > LIMITE_TOTAL) erros.push(`artefato com ${(total / 1048576).toFixed(1)} MB sem os vídeos (limite 8 MB)`);
if (totalVideos > LIMITE_VIDEOS) erros.push(`vídeos somam ${(totalVideos / 1048576).toFixed(1)} MB (limite 16 MB)`);

const existentes = new Set(arquivos);
const resolver = (ref, deArquivo) => {
  // Retorna o caminho em dist/ para referências internas; null para externas permitidas.
  if (/^(?:https?:)?\/\//.test(ref) || ref.startsWith('mailto:') || ref.startsWith('data:') || ref.startsWith('#')) return null;
  let caminho = ref.split('#')[0].split('?')[0];
  if (!caminho) return null;
  if (caminho.startsWith('/')) {
    if (!caminho.startsWith(BASE)) return { erro: `link absoluto fora da base: ${ref}` };
    caminho = caminho.slice(BASE.length);
  } else {
    caminho = posix.normalize(posix.join(posix.dirname(deArquivo), caminho));
  }
  if (caminho === '' || caminho.endsWith('/')) caminho += 'index.html';
  return { caminho };
};

const HOSTS_EXTERNOS = new Set(['www.linkedin.com', 'wa.me', 'www.instagram.com', 'www.youtube.com', 'padilhadevelo.github.io', 'docs.github.com', 'policies.google.com', 'www.whatsapp.com']);

for (const pagina of arquivos.filter((a) => a.endsWith('.html'))) {
  const html = await readFile(join(RAIZ, pagina), 'utf8');
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]+)"/i);
  if (!csp) erros.push(`${pagina}: sem CSP`);
  else {
    const pol = csp[1];
    if (/unsafe-eval|unsafe-inline/.test(pol)) erros.push(`${pagina}: CSP com unsafe-*`);
    for (const d of ["default-src 'self'", "media-src 'self'", "object-src 'none'", "base-uri 'self'", 'frame-src https://www.youtube-nocookie.com']) {
      if (!pol.includes(d)) erros.push(`${pagina}: CSP sem "${d}"`);
    }
  }
  if (/\son[a-z]+\s*=/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ''))) erros.push(`${pagina}: atributo de evento inline`);
  if (/javascript:/i.test(html)) erros.push(`${pagina}: URL javascript:`);
  if (/<iframe/i.test(html)) erros.push(`${pagina}: iframe no HTML estático (o player só nasce após interação)`);

  for (const [, attr, valor] of html.matchAll(/\s(href|src|srcset|content)="([^"]*)"/g)) {
    const refs = attr === 'srcset' ? valor.split(',').map((v) => v.trim().split(/\s+/)[0]) : [valor];
    for (const ref of refs) {
      if (attr === 'content' && !ref.startsWith(BASE)) continue;
      if (/^https?:\/\//.test(ref)) {
        const host = new URL(ref).host;
        if (!HOSTS_EXTERNOS.has(host)) erros.push(`${pagina}: destino externo não previsto: ${host}`);
        if (ref.startsWith('http:')) erros.push(`${pagina}: link sem HTTPS: ${ref}`);
        continue;
      }
      const r = resolver(ref, pagina);
      if (!r) continue;
      if (r.erro) erros.push(`${pagina}: ${r.erro}`);
      else if (!existentes.has(r.caminho)) erros.push(`${pagina}: link interno quebrado: ${ref}`);
    }
  }
  for (const [tag] of html.matchAll(/<a\s[^>]*>/g)) {
    if (/target="_blank"/.test(tag) && !/rel="[^"]*noopener[^"]*"/.test(tag)) erros.push(`${pagina}: target=_blank sem noopener`);
  }
}

// Nenhum texto do artefato pode carregar caminhos locais ou marcadores de segredo.
for (const a of arquivos.filter((x) => /\.(?:html|js|css|txt|xml|svg)$/.test(x))) {
  const t = await readFile(join(RAIZ, a), 'utf8');
  if (/\/Users\/[A-Za-z0-9._-]+\//.test(t)) erros.push(`${a}: caminho local de usuário`);
  if (/\bgh[pousr]_[A-Za-z0-9]{30,}|github_pat_|-----BEGIN [A-Z ]*PRIVATE KEY|\bAKIA[0-9A-Z]{16}\b|\bsk-[A-Za-z0-9_-]{20,}/.test(t)) erros.push(`${a}: padrão de segredo`);
}

if (erros.length) {
  console.error(`\n✗ Artefato reprovado (${erros.length}):\n  - ${erros.join('\n  - ')}`);
  process.exit(1);
}
console.log(`✓ Artefato aprovado: ${arquivos.length} arquivos, ${(total / 1024).toFixed(0)} KB + ${(totalVideos / 1048576).toFixed(1)} MB de vídeo, ${PAGINAS.size} páginas, só itens da lista de publicação.`);
