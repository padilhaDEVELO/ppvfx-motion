<!-- © 2026 personal-brand-padilha. Todos os direitos reservados. Licença proprietária: ../LICENSE -->

# Fluxo de projeto e retomada

## Abrir o projeto

Reaproveite arquivos e autorizações existentes. Identifique a pessoa, o solicitante, o prestador de serviço quando houver, objetivo, prazo, canais, acervo e capacidade. Não confunda objetivo ainda desconhecido com liberdade para inventar uma oferta.

Use `scripts/project.py init` para criar uma pasta nova autorizada, ou organize a existente sem sobrescrever. O inicializador cria a estrutura e os registros vazios, não uma análise pronta. Preencha o dossiê, o registro de decisões e o estado durante a execução.

Estrutura sugerida:

```text
projeto/
  projeto.json                 Identidade, redação dos slides e peças
  estado.json                  Etapas, limitações e versão vigente
  dossie.md                     Evidências e decisões estratégicas
  decisoes.md                   Alterações e suas razões
  fontes/                      Fontes.csv, transcrições e capturas selecionadas
  planejamento/                Plano, proposta, calendário e indicadores
  conteudo/                    Roteiros, legendas e desenvolvimento dos pilotos
  assets/                      Fotos e fontes locais utilizáveis
  entregas/v001/               HTML, PDF, kit e QA desta versão
```

## Dependências e critérios de conclusão

| Etapa | Insumo e decisão | Entrega e critério |
|---|---|---|
| 1. Inventariar | Arquivos, instruções, links e versões | Mapa do acervo; versão vigente identificada; original preservado |
| 2. Pesquisar | Canais e materiais relevantes ao objetivo | Fontes com data, amostra e profundidade; limitações explícitas |
| 3. Diagnosticar | Observações e problemas do público | Gargalos priorizados e alternativas de explicação |
| 4. Posicionar | Experiência, público e provas | Contribuição compreensível, voz e exemplos; hipóteses rotuladas |
| 5. Conectar ao objetivo | Oferta existente ou oportunidade profissional | Jornada, destino e responsabilidade por atender |
| 6. Planejar | Equipe, horas e formatos | Plano por período, calendário inicial e indicadores |
| 7. Desenvolver conteúdo | Temas, perguntas, fonte e voz | Pilotos completos no formato prometido, com contexto e revisão |
| 8. Aplicar identidade | Diretrizes, repertório visual e canais | Tokens, bio, kit e aplicações coerentes |
| 9. Apresentar | Decisões e materiais consolidados | HTML editável e PDF com hierarquia e fontes |
| 10. Conferir | Arquivos renderizados e registros | Revisão factual, visual, links internos e integridade |
| 11. Entregar | Versão revisada | Índice, pacote delimitado e estado de continuidade |
| 12. Acompanhar | Execução autorizada e dados observados | Aprendizados e próximo teste, sem atribuição causal inventada |

Etapas podem se sobrepor quando independentes. Mudança de objetivo exige revisar decisões dependentes: uma bio de autoridade pode não servir à divulgação de um programa específico. Mudança de cor não exige repetir toda a pesquisa.

## Matriz de entrega do pedido completo

Na ausência de especificação mais estreita, execute um conjunto proporcional ao caso:

- Dossiê com pesquisa, diagnóstico, posicionamento, público, provas e voz.
- Arquitetura de canais e jornada; proposta comercial se houver prestação de serviço ou intenção comercial pertinente.
- Plano para o horizonte acordado; em pedido anual, 12 meses detalhados por objetivos, entregas e condições de avanço. Calendário operacional do primeiro ciclo.
- Bio, apresentação profissional e direção visual aplicada. Destaques e fixados somente em canais que utilizem esses recursos.
- Pilotos que permitam avaliar a estratégia: combine texto, peça estática/carrossel completo e roteiro audiovisual conforme o canal. Escolha a quantidade pela capacidade e registre o escopo adotado.
- Apresentação HTML e PDF; ativos editáveis e exportados; registros de QA; índice e pacote final.

Se o usuário pedir vídeo final, o roteiro não satisfaz essa entrega: use o material disponível para editar/exportar ou registre o insumo concreto que falta. Se pedir carrosséis completos, desenhe todas as telas. Não repita a limitação do kit de referência que tinha capas e roteiros, mas não todas as telas diagramadas.

## Estado e versões

Em `estado.json`, use etapas `pendente`, `em_andamento`, `concluida` ou `limitada`, sempre com arquivo de saída e motivo quando limitada. Separe `plano_de_mensuracao` de `acompanhamento_real`: sem publicação ou dados, o plano pode estar concluído, enquanto o acompanhamento fica pendente. Registre `versao_vigente` somente após revisão. Nunca use o preenchimento automático de um template como evidência de etapa concluída.

Em trabalho multicanal, mantenha uma matriz de aceite por canal: apresentação de perfil/campos, formatos, peças, legendas, destino e arquivo. Uma bio única ou a mesma legenda em todos os canais não encerra automaticamente o escopo. O orçamento de manutenção semanal é distinto do esforço inicial para produzir todas as peças pedidas; distribua o prazo em vez de reduzir entregas explícitas sem motivo.

Em `decisoes.md`, registre data, decisão anterior, decisão nova, justificativa/fonte e arquivos impactados. Versões novas vão para pastas novas. Preserve também o JSON que efetivamente gerou cada versão.

## Lição operacional do caso que originou a extensão

Um diagnóstico evoluiu para proposta, projeto anual, multicanal, plano mensal e identidade. O que deve ser reaproveitado é a sequência e a rastreabilidade. A quantidade de páginas, cores, cliente, cadência, fontes individuais e condições comerciais daquele caso permanecem específicas dele. Não transportar dados pessoais ou recursos do cliente para a instalação global da skill.
