// @ts-check
import { defineConfig } from 'astro/config';

// Endereço público atual (GitHub Pages, site de projeto). Mudar os dois juntos
// se o domínio ou o nome do repositório mudarem.
export const SITE = 'https://padilhadevelo.github.io';
export const BASE = '/ppvfx-motion';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  output: 'static',
  build: { format: 'directory', inlineStylesheets: 'never' },
  devToolbar: { enabled: false },
  security: {
    // CSP entregue por <meta>: o GitHub Pages não permite cabeçalhos próprios.
    // frame-ancestors, report-uri e sandbox não funcionam por meta (ver README).
    csp: {
      algorithm: 'SHA-256',
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        // Vídeos da seção de IA ficam no próprio site (public/videos).
        "media-src 'self'",
        "connect-src 'self'",
        'frame-src https://www.youtube-nocookie.com',
        "object-src 'none'",
        "worker-src 'none'",
        "manifest-src 'self'",
        "base-uri 'self'",
        "form-action 'none'",
        // Sem upgrade-insecure-requests: o Pages já força HTTPS, tudo é 'self' e o
        // verificador do build reprova links http:. A diretiva também quebrava a
        // prévia local (http://127.0.0.1) no WebKit.
      ],
    },
  },
});
