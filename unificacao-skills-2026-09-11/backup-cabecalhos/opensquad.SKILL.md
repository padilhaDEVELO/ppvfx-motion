---
name: opensquad
description: Ativa o sistema Opensquad — criar, editar e rodar squads de agentes de IA para produção de conteúdo (Instagram, LinkedIn, YouTube, e-mail, blog). Use quando o usuário digitar `/opensquad`, pedir para rodar/criar/listar um squad, mencionar um squad pelo nome (ex.: filipe-hip, filipe-aulas-ia), pedir para atuar como um agente do squad (Igor Instagram, Yago YouTube, Pedro Pauta, Valéria Veredito, Lucas Lead), ou falar em pipeline, squad-party, skills do Opensquad.
---

# Opensquad — Claude Code

Sistema de squads de agentes já instalado neste workspace. Este arquivo é apenas o
entrypoint; toda a lógica vive em `_opensquad/core/`.

**Raiz do projeto:** `/Users/ppvfx/Documents/IA` (todos os caminhos abaixo são relativos a ela)

## Inicialização

Execute NESTA ORDEM:

1. Leia `_opensquad/_memory/company.md` (contexto da empresa)
2. Leia `_opensquad/_memory/preferences.md` (preferências do usuário)
3. Se `company.md` estiver vazio ou contiver `<!-- NOT CONFIGURED -->`, rode o fluxo de ONBOARDING
4. Caso contrário, mostre o MENU PRINCIPAL

## Menu Principal

Apresente numerado e peça um número:

1. **Criar um novo squad** — descreva o que precisa e eu monto o squad
2. **Rodar um squad existente** — executa o pipeline
3. **Meus squads** — ver, editar ou excluir
4. **Mais opções** — skills, perfil da empresa, configurações e ajuda

Se o usuário responder "4", mostre o segundo menu:

1. **Skills** — navegar, instalar, criar e gerenciar skills
2. **Perfil da empresa** — ver ou atualizar
3. **Configurações e ajuda**

## Roteamento de comandos

| Entrada | Ação |
|---------|------|
| `/opensquad` ou `/opensquad menu` | Mostrar menu principal |
| `/opensquad help` | Mostrar ajuda |
| `/opensquad create <descrição>` | Carregar Architect → fluxo Create Squad |
| `/opensquad list` | Listar squads em `squads/` |
| `/opensquad run <nome>` | Carregar Pipeline Runner → executar squad |
| `/opensquad edit <nome> <mudanças>` | Carregar Architect → fluxo Edit Squad |
| `/opensquad skills` | Carregar Skills Engine → menu de skills |
| `/opensquad install <nome>` | Instalar skill do catálogo |
| `/opensquad uninstall <nome>` | Remover skill instalada |
| `/opensquad delete <nome>` | Confirmar e excluir diretório do squad |
| `/opensquad edit-company` | Refazer setup do perfil da empresa |
| `/opensquad show-company` | Exibir `company.md` |
| `/opensquad settings` | Ver/editar `preferences.md` |
| `/opensquad reset` | Confirmar e resetar toda a configuração |
| Linguagem natural sobre squads | Inferir a intenção e rotear |

## Carregando um agente isolado

Quando o usuário pedir um agente específico (ex.: "como o Igor Instagram, me dê...")
ou quando o pipeline ativar um agente:

1. Leia o `.agent.md` do agente por completo (`squads/{nome}/agents/{agente}.agent.md`)
2. Adote a persona: role, identity, communication_style, principles, voice guidance
3. Leia também os dados que o agente declara em `Integration → Reads from`
4. Siga o menu/workflow do agente
5. Ao terminar, volte ao contexto principal do Opensquad

## Carregando o Pipeline Runner

Ao rodar um squad:

1. Leia `squads/{nome}/squad.yaml`
2. Leia `squads/{nome}/squad-party.csv`
3. Para cada agente do party, leia o `.agent.md` completo em `agents/`
4. Carregue `_opensquad/_memory/company.md`
5. Carregue `squads/{nome}/_memory/memories.md`
6. Leia `_opensquad/core/runner.pipeline.md` e siga as instruções
7. Execute o pipeline passo a passo

## Referências do core

- `_opensquad/core/runner.pipeline.md` — executor de pipeline
- `_opensquad/core/skills.engine.md` — instalação e gestão de skills
- `_opensquad/core/architect.agent.yaml` — agente que cria/edita squads
- `_opensquad/core/prompts/` — prompts de discovery, design, build e os "sherlock" por rede
- `_opensquad/core/best-practices/` — boas práticas por formato (instagram-reels, youtube-script, copywriting etc.)
- `skills/` — skills instaladas (template-designer, image-ai-generator, instagram-publisher, canva, resend...)

## Idioma

- `preferences.md` define o idioma de saída (aqui: Português do Brasil)
- Nomes de arquivo e código permanecem em inglês
- As personas dos agentes falam no idioma do usuário

## Regras críticas

- NUNCA pule o onboarding se `company.md` não estiver configurado
- SEMPRE carregue o contexto da empresa antes de rodar um squad
- SEMPRE apresente os checkpoints ao usuário — nunca pule
- SEMPRE salve os outputs no diretório `output/` do squad
- Ao trocar de persona em execução inline, deixe explícito qual agente está falando
- Depois de cada run, atualize `memories.md` do squad com os aprendizados

## Nota específica do Claude Code

O `runner.pipeline.md` foi escrito para ser IDE-agnóstico e já referencia
`.claude/settings.local.json` para verificação de MCP — não precisa de adaptação.
As skills do Opensquad ficam em `skills/` (raiz do projeto), que é diferente de
`.claude/skills/` (skills do próprio Claude Code). Não confunda as duas pastas.
