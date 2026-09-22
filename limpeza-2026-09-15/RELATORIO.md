# Limpeza local — 15/09/2026

## Resultado

- 2744 arquivos removidos e ausência verificada.
- 198.3 MiB de blocos alocados removidos (estimativa; APFS pode reter snapshots).
- Caches regeneráveis de usuário, Adobe e npm, logs, temporários e caches Python/projetos.
- Arquivos recentes e abertos preservados; limite de 24 horas para caches/logs e 72 horas para temporários/projetos.
- Quatro pastas de notícias de 08 a 11/09 arquivadas em `recuperacao/noticias`, com destinos verificados: True. Essa movimentação não libera espaço.
- Nenhuma cópia duplicada confirmada por nome e SHA-256 na varredura de Desktop, Downloads e projeto, com dependências excluídas.

## Pendências e limites

- 7 arquivos elegíveis permanecem em caches Adobe/npm pertencentes a root (110.4 MiB). `sudo -n` informou que é necessária senha; nenhuma senha foi solicitada ou armazenada.
- O macOS bloqueou acesso a oito diretórios de cache de serviços do sistema.
- Preservados caches de aplicativos ativos, dados de sincronização, modelos locais, runtimes e navegadores de automação.
- Não foram executadas as etapas legadas que apagam aplicativos, perfis completos, preferências ou dados de apps desinstalados. Essas etapas excedem a autorização de limpeza segura definida em `instrucoes-para-claude.txt`.
- Downloads, documentos pessoais, credenciais e Lixeira preservados.
- Não alterados scripts permanentes, agendamentos nem marcadores de execução das rotinas originais. Etapas sobrepostas foram consolidadas no executor local desta entrega.

## Registros

- `resultado.json`: inventário completo dos arquivos removidos e avisos.
- `previa.json` e `verificacao.log`: diagnóstico posterior à execução.
- `duplicados.json`: resultado da verificação de duplicados.
- `executar.py`: executor local revisado usado nesta sessão.
