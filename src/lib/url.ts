// Caminhos internos sempre a partir da base (/ppvfx-motion/), para funcionar
// em qualquer profundidade de página e no 404 servido em URLs arbitrárias.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(caminho = '/'): string {
  if (caminho.startsWith('#')) return `${BASE}/${caminho}`;
  const limpo = caminho.replace(/^\//, '');
  return `${BASE}/${limpo}`;
}

export const urlProjeto = (slug: string) => url(`projetos/${slug}/`);

// Só aceita IDs de vídeo do YouTube válidos; o schema da coleção já valida no build.
const ID_VIDEO = /^[A-Za-z0-9_-]{11}$/;
export function urlYouTube(id: string): string {
  if (!ID_VIDEO.test(id)) throw new Error(`ID de vídeo inválido: ${id}`);
  return `https://www.youtube.com/watch?v=${id}`;
}
