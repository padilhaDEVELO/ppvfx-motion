import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { url } from '../lib/url';

// Sitemap gerado no build com as páginas públicas (o 404 fica de fora).
export const GET: APIRoute = async ({ site }) => {
  const projetos = (await getCollection('projetos')).sort((a, b) => a.data.ordem - b.data.ordem);
  const caminhos = ['/', 'privacidade/', ...projetos.map((p) => `projetos/${p.data.slug}/`)];
  const corpo = caminhos.map((c) => `  <url><loc>${new URL(url(c), site).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${corpo}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
