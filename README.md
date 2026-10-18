# Portfólio PP VFX — site

Site estático do portfólio de Paulo Padilha (motion design e edição de vídeo), feito com Astro 7. É publicado no GitHub Pages em https://padilhadevelo.github.io/ppvfx-motion/.

Não tem backend, formulário, login nem banco de dados. Isso reduz a superfície de ataque, mas **não é garantia de segurança total**: veja “Limitações” abaixo.

## Comandos

Requer Node 22.12 ou mais recente (a versão fixada para o CI está em `.nvmrc`: 24).

| Comando | O que faz |
|---|---|
| `npm ci` | Instala exatamente as versões do `package-lock.json`. |
| `npm run dev` | Servidor de desenvolvimento em http://localhost:4321/ppvfx-motion/. |
| `npm run build` | Gera `dist/` e roda o **verificador de artefato**. Se o verificador reprovar, o build falha. |
| `npm run preview` | Serve o `dist/` com a mesma base do Pages. |
| `npm run test:local` | Testes Playwright nos 5 perfis, com os navegadores em `IA/.cache/ms-playwright`. |
| `npm test` | Os mesmos testes, usando os navegadores do local padrão (é o que roda no CI). |
| `npm run imagens` | Gera de novo as capas (`src/assets/capas`) a partir de `src/assets/originais`. |
| `npm run og` | Gera de novo as imagens sociais `public/og.png` e `public/og-en.png` (1200×630). |

Na primeira vez em outra máquina, instale os navegadores de teste dentro da pasta IA:
`PLAYWRIGHT_BROWSERS_PATH=../../../.cache/ms-playwright npx playwright install chromium firefox webkit`.

## Estrutura

```
src/
  config/site.ts         contato, números, serviços, preços, processo e menu (fonte única)
  content/projetos.json  coleção de projetos (validada no build)
  content.config.ts      schema da coleção: slug, título, categoria, formato, ID do vídeo, capa…
  styles/tokens.css      cores, fontes, espaçamentos, bordas e movimento
  styles/global.css      base global, botões, foco visível, revelação progressiva
  layouts/Base.astro     <head>, SEO, fontes locais, cabeçalho, rodapé e player
  components/            Cabecalho, Rodape, CardVideo, Trilho (carrossel), PlayerDialogo, Icone
  scripts/player.ts      player acessível (diálogo nativo, iframe só após interação)
  scripts/revelar.ts     animação de entrada como melhoria progressiva
  pages/                 index, projetos/[slug], privacidade, 404, sitemap.xml
public/                  robots.txt, favicon.svg, og.png (copiados sem processamento)
scripts/                 verificar-artefato.mjs, gerar-imagens.mjs, gerar-og.mjs
tests/                   Playwright: navegação, player, resiliência, acessibilidade, CSP, SEO
.github/workflows/       validação, build e publicação (ações fixadas por SHA)
```

## Tarefas comuns

**Adicionar um projeto.** Salve a thumbnail em `src/assets/originais/<ID>-maxresdefault.jpg` (1280×720) e acrescente um item em `src/content/projetos.json` com `slug`, `titulo`, `categoria`, `formato` (`vertical` ou `horizontal`), `video` (ID de 11 caracteres do YouTube), `descricao`, `ordem`, `capa` e o objeto `en` (title, category, context, role, focus, note, group). Depois rode `npm run imagens` e `npm run build`. O build falha se faltar campo ou se o ID for inválido, e a página `/projetos/<slug>/` é criada sozinha. Registre só informação verificável: cliente, resultado ou depoimento entram apenas com confirmação.

**Mudar preço, serviço, contato ou texto do processo.** Edite só `src/config/site.ts`. O FAQ e os cards leem dali.

**Mudar cores, fontes ou espaçamentos.** Edite `src/styles/tokens.css`.

## Segurança

- **CSP por `<meta>`**, gerada pelo Astro com hashes SHA-256 dos scripts e estilos inline. Sem `unsafe-inline` e sem `unsafe-eval`. Só `youtube-nocookie.com` pode ser incorporado. Origens permitidas: `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`.
- **Player**: o iframe só é criado depois do clique e é destruído ao fechar. Usa permissões mínimas (`autoplay; encrypted-media; picture-in-picture; fullscreen`) e `sandbox` sem `allow-top-navigation` e sem `allow-forms`. Os IDs de vídeo são validados no build e no script.
- **Links externos** de contato e vídeos para `wa.me`, `instagram.com`, `linkedin.com` e `youtube.com`, sempre com `rel="noopener noreferrer"`.
- **Verificador de artefato** (`scripts/verificar-artefato.mjs`): reprova o build se o `dist/` tiver arquivo fora da lista de publicação, link interno quebrado, página sem CSP, `unsafe-*`, handler inline, `javascript:`, iframe estático, destino externo não previsto, caminho local de usuário ou padrão de segredo.
- **CI**: permissões mínimas por job, `npm audit --audit-level=high` bloqueante, nenhum segredo, sem `pull_request_target`. Pull requests nunca publicam.

### Limitações (GitHub Pages)

O Pages não permite cabeçalhos HTTP próprios. Por isso, **continuam sem correção nesta versão**:

- `frame-ancestors` (proteção contra o site ser enquadrado por outro): só funciona por cabeçalho, não por `<meta>`;
- `X-Content-Type-Options`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, além de `report-uri`/`report-to` da CSP.

A política de referência é aplicada por `<meta name="referrer">`, que funciona. O HTTPS obrigatório e o HSTS já vêm do Pages. Para controlar os cabeçalhos, seria preciso trocar a hospedagem, o que ficou fora desta versão.

## Afirmações comerciais

“+200 projetos”, “8 anos”, “resposta em até 24h” e o selo “Mais solicitado” foram **mantidos como estavam** no site anterior. Estão em `src/config/site.ts` e dependem de confirmação do responsável. A mensagem automática “2 vagas abertas em <mês>” foi substituída por “Agenda sob consulta”.

## Versão internacional

`/en/` é a entrada para recrutadores; `/en/work/<slug>/` apresenta cada trabalho e `/en/privacy/` explica os serviços externos. A versão portuguesa permanece na raiz. O layout gera canonical e hreflang recíprocos, e o seletor mantém o projeto ao trocar de idioma. O player e os contatos também são localizados.

Os textos em `projetos.json → en` usam títulos públicos do YouTube, as imagens das peças e as funções já registradas no portfólio. Peças publicadas como teste aparecem como estudos; não implicam encomenda comercial. O currículo resumido em `pages/en/index.astro` reflete o perfil LinkedIn verificado em 18/10/2026. Atualize-o quando a experiência mudar.

O inglês é apresentado como conversacional. A entrada inglesa não usa os números comerciais ainda sem confirmação da versão portuguesa.
