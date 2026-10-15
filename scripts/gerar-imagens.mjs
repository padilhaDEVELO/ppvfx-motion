// Gera as capas locais a partir das thumbnails originais em src/assets/originais.
// Verticais: recorte central 9:16 (a thumbnail do YouTube vem em 16:9 com moldura borrada).
// Horizontais: mantém 16:9. O Astro converte para AVIF/WebP no build.
// Uso: npm run imagens
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const projetos = JSON.parse(await readFile(`${raiz}src/content/projetos.json`, 'utf8'));

for (const p of projetos) {
  const origem = `${raiz}src/assets/originais/${p.video}-maxresdefault.jpg`;
  const destino = `${raiz}src/assets/capas/${p.video}.jpg`;
  const img = sharp(origem);
  const { width, height } = await img.metadata();
  if (p.formato === 'vertical') {
    const w = Math.round((height * 9) / 16);
    await img.extract({ left: Math.round((width - w) / 2), top: 0, width: w, height }).jpeg({ quality: 90 }).toFile(destino);
  } else {
    await img.jpeg({ quality: 90 }).toFile(destino);
  }
  console.log(`capa: ${p.slug} (${p.formato})`);
}
