# Produção local, schema e comandos

## Ferramentas incluídas

- `scripts/project.py`: inicializa projeto, constrói HTML/kit a partir de JSON, verifica hashes e empacota uma versão. Usa somente Python 3.10+ padrão.
- `scripts/render.mjs`: usa Chrome/Chromium headless e CDP para gerar PDF, screenshots, painéis e PNGs dos SVGs, com diagnóstico de overflow. Requer Node com WebSocket nativo; validado inicialmente em Node 24 e Chrome no macOS. Detecta caminhos usuais em macOS/Linux/Windows e aceita `--chrome`.
- `assets/apresentacao.css`: base de slides 1280 × 720, em 16:9; quatro layouts, cores e fonte configuráveis.

Os scripts não instalam dependências, não pesquisam, não publicam e não enviam materiais a serviços. O navegador de renderização usa perfil temporário próprio, desativa extensões e bloqueia requisições HTTP(S) da página. Perfis pessoais do Chrome não são utilizados.

## Comandos

Use o caminho real da skill no agente em execução; não dependa de variáveis específicas de outro aplicativo. Exemplo com a instalação universal, executado na pasta de trabalho autorizada:

```bash
python3 ~/.agents/skills/personal-brand/scripts/project.py init ./projeto-marca --name "Nome da pessoa"
# Preencher pesquisa, dossiê, plano e projeto.json antes de construir.
python3 ~/.agents/skills/personal-brand/scripts/project.py build ./projeto-marca --version v001
node ~/.agents/skills/personal-brand/scripts/render.mjs ./projeto-marca/entregas/v001
python3 ~/.agents/skills/personal-brand/scripts/project.py check ./projeto-marca/entregas/v001
# Após inspeção factual e visual, empacotar:
python3 ~/.agents/skills/personal-brand/scripts/project.py pack ./projeto-marca/entregas/v001 --document ./projeto-marca/dossie.md
```

As rotinas recusam reinicializar uma pasta, substituir uma versão ou sobrescrever ZIP existente. Após uma correção, construa `v002`; mantenha o JSON correspondente dentro da versão. O estado editorial não é promovido automaticamente pelo script.

## JSON editorial

`projeto.json` usa `schema_version: 1`. Campos:

| Campo | Conteúdo |
|---|---|
| `person`, `title`, `status` | Identificação, título da apresentação e estado editorial como proposta/rascunho |
| `bio`, `bios` | `bio` é o texto principal; `bios` opcional mapeia identificador de canal/campo para texto, como `instagram`, `linkedin-headline`, `linkedin-sobre`. Cada entrada gera TXT e contagem |
| `visual` | `background`, `foreground`, `accent` em `#RRGGBB`; opcional `font_file` relativo ao projeto (TTF, WOFF2 ou OTF) |
| `deck` | Lista não vazia de slides; `title`, `eyebrow`, `body`, `note`, `sources` e `layout` |
| `highlights` | Lista de `{id,title,icon}`; cada item gera SVG 1080 × 1920 e depois PNG |
| `posts` | Lista de `{id,caption,slides:[{title,body}]}`; cada tela gera SVG 1080 × 1350 e depois PNG. `channels` pode registrar destinos; `captions` opcional mapeia canal para legenda adaptada e gera TXT separado |

IDs usam letras minúsculas, números e hífens. `sources` aceita `{label,url}` HTTP(S) como link clicável, ou `{label,source_id}` para uma fonte local registrada em `fontes.csv`; inclua trecho/página na descrição. Não invente URL para transcrição local. Textos são texto simples; `\n` produz quebra de linha, HTML é escapado. Referências locais de arquivos precisam permanecer dentro do projeto. A fonte é incorporada quando fornecida; sem arquivo, a base usa fonte do sistema, então a aparência pode variar entre máquinas.

Layouts de `deck`: `cover`, `text`, `columns` (com uma a três entradas `{title,body}` em `columns`) e `image` (com `image` relativo ao projeto e `alt`; aceita PNG, JPEG ou WebP). Use notas para estado das hipóteses e fontes, mas não esconda uma ressalva essencial em letra pequena.

Ícones disponíveis para destaques: `compass`, `steps`, `chart`, `people`, `mic`, `globe`, `calendar`, `arrow`. Se não atenderem à identidade, desenvolva SVGs próprios em uma cópia de trabalho. Não substituem logotipos oficiais.

Exemplo estrutural **fictício**, apenas para entender o formato:

```json
{
  "schema_version": 1,
  "person": "Pessoa de exemplo",
  "title": "Direção de marca",
  "status": "exemplo fictício",
  "bio": "Texto da bio baseado em informações reais do projeto.",
  "visual": {"background":"#101113","foreground":"#FFFFFF","accent":"#D0B779"},
  "deck": [{"layout":"text","title":"Uma decisão por página","body":"Desenvolver a decisão e a evidência que a sustenta.","note":"Exemplo de estrutura, sem diagnóstico real."}],
  "highlights": [{"id":"trajetoria","title":"Trajetória","icon":"steps"}],
  "posts": [{"id":"apresentacao","caption":"Legenda completa da peça.","slides":[{"title":"Primeira tela","body":"Desenvolvimento editorial."},{"title":"Segunda tela","body":"Continuidade do argumento e conclusão."}]}]
}
```

## Fluxo editorial e visual

Primeiro escreva a análise; depois monte uma narrativa de apresentação: problema, evidências, direção, exemplos, operação, calendário, indicadores e próximo passo. O módulo de identidade pode ser separado ou integrado, com numeração recalculada. O total de slides acompanha a clareza necessária, sem obrigação de chegar a 50.

O JSON é a fonte das peças geradas, e não substitui os documentos estratégicos. Mudança no dossiê exige atualizar o JSON afetado e gerar nova versão. Fotografias, carrosséis e composições mais elaboradas podem usar outros recursos locais; mantenha os arquivos e a revisão rastreáveis.

O construtor interrompe textos muito longos para peças; o renderizador também mede os limites reais. Reduza/dê continuidade em outra tela ou ajuste um layout de trabalho quando necessário. Não diminua texto até ficar ilegível para apenas passar no teste.

## Saídas e limites

`manifesto-build.json` registra versão, hashes, contagens e ativos. `qa/render.json` registra a versão de build, arquivos exportados e problemas encontrados. `passed` significa que o renderizador concluiu sem os problemas que ele mede; não significa aprovação factual nem QA independente do PDF.

`pack` exige hashes íntegros e renderização aprovada, grava ZIP relativo portável e inventário SHA-256 e verifica CRC. Inclui as saídas declaradas dessa versão e documentos selecionados explicitamente com `--document ARQUIVO` repetido. Use essa opção para dossiê, proposta, plano, calendário, índice de entrega e roteiros que façam parte do escopo; esses arquivos entram em `documentos/` com hashes. Aceita MD, TXT, CSV, JSON, PDF e HTML; rejeita nomes duplicados. Não inclui automaticamente a raiz do projeto. O agente deve conferir se todos os itens prometidos foram selecionados antes de empacotar.

Não foram incluídos editor audiovisual, coletor automático de redes sociais, gerador de imagens por IA ou dependência de outro aplicativo. Use as ferramentas pertinentes disponíveis quando esses módulos forem necessários, mantendo todo o processo nesta skill como orientação. A indisponibilidade de uma ferramenta específica não deve ser escondida por rótulos de entrega concluída.
