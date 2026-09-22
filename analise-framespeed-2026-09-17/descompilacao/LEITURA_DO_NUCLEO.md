# Núcleo do Frame Speed: resultado da descompilação

17/09/2026. A pedido do usuário, uma cópia do `hostscript.jsxbin` foi processada localmente com [Jsxer 1.7.4](https://github.com/AngeloD2022/jsxer). Nenhum arquivo do plugin instalado foi modificado ou executado.

Resultado: `hostscript.original.jsx`, com **18.535 linhas, 338 declarações de funções nomeadas no início da linha e 449.363 bytes**. O índice `indice-funcoes.json` aponta os nomes e as linhas. O código recuperado passou pela análise de sintaxe JavaScript, sem execução.

O hash SHA-256 da cópia foi comparado ao arquivo instalado depois da operação e continuou idêntico:

`b7d39c14c221297549bc794e89aef20efe98ab6ff809b1837f55bdbfd33cf09f`

O arquivo ZIP de distribuição do Jsxer utilizado teve SHA-256:

`747ce7b177d1381a61eea4c711688a183bddaf395fda88973aa13c1b6afe6d68`

## O que o motor de corte faz

| Função / linha no arquivo recuperado | Comportamento observado |
|---|---|
| `_fsAcNormalizeCuts`, 7088 | Converte segundos para ticks, alinha aos frames, rejeita intervalos menores que um frame e junta sobreposições |
| `_fsAcTrackFlags`, 7130 | Identifica trilhas bloqueadas e exclui essas trilhas do corte |
| `_fsAcRunPhases`, 7186 aproximadamente | Coordena aplicação da lâmina, remoção, deslocamento e reconstrução de vínculos |
| `fsAutocutApply`, 7479 | Valida entradas, verifica QE, testa uma estratégia de movimentação, cria backup opcional e executa o plano |
| `fsAutocutSetStep`, 7673 | Aplica um estado intermediário da lista de cortes a partir do backup |
| `fsAutocutRestore`, 7831 | Rotina de retorno ao estado de referência |
| `fsAutocutSondaLink`, 14576 | Diagnostica vínculo de áudio/vídeo e comportamento de `linkSelection` |
| `fsExportAudioTrilha`, 2736 | Exporta áudio da trilha escolhida, guarda estados de mute e In/Out e tenta restaurá-los ao terminar |

Na parte de corte, o plugin ativa o acesso **QE** do Premiere e chama `razor` nas trilhas utilizáveis de vídeo e áudio. Em seguida, planeja quais clipes remover e qual deve ser a posição dos demais. A nova posição desconta a soma dos intervalos cortados que ficam antes do clipe.

A remoção observada usa `remove(false, false)`, seguida por deslocamentos calculados. Há rotinas para verificar se o Premiere realmente moveu o clipe. Para restabelecer vínculos, o código procura pares de áudio/vídeo por nome e posições compatíveis, seleciona os pares e chama `linkSelection`.

O alinhamento usa a unidade temporal do Premiere — 254.016.000.000 ticks por segundo — e o tamanho do frame da sequência. Há também conversão de timecode com tratamento de drop-frame. Isso ajuda a entender por que uma implementação que apenas subtrai segundos com arredondamentos independentes pode perder sincronismo.

## O que isso esclarece para o novo painel

- Áudio e vídeo precisam compartilhar uma única lista de intervalos e uma única regra de arredondamento.
- A posição realmente retornada pelo Premiere precisa ser conferida depois das operações.
- O estado anterior de In/Out, seleção e trilhas deve ser restaurado quando for alterado temporariamente.
- A sequência original deve continuar disponível para recuperar/revisar o trabalho.
- Sincronismo temporal não prova qualidade editorial: selecionar ideias completas requer uma camada de análise da transcrição.

O protótipo Padilha Cortes usa uma implementação própria: cria subsequências dos intervalos e monta pares de áudio/vídeo aninhados em uma nova sequência por tema. Essa escolha evita depender do código recuperado e preserva os conteúdos internos para revisão. Sua integração com o Premiere ainda precisa de teste real.

## Limites da recuperação

Descompilação não recupera necessariamente comentários, formatação original ou todas as particularidades de precedência de expressões. Algumas concatenações com operadores condicionais no texto recuperado merecem atenção. Passar pela análise de sintaxe não comprova equivalência de execução.

Não foram alteradas verificações de licença, sessão ou autenticação. O `.jsx` recuperado é material de estudo local; não foi instalado como substituto do motor original nem incluído no novo plugin.

Este documento atualiza a limitação do relatório anterior: agora existe uma reconstrução legível do núcleo, mas ainda não o projeto-fonte original do fabricante.
