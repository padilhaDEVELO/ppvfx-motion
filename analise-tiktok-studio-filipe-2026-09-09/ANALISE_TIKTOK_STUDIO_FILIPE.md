# Filipe Frazão | Análise do TikTok Studio

Consulta: 09/09/2026. Fonte: Overview.csv fornecido pelo usuário. Análise local, sem envio dos dados a serviços externos.

## O que este arquivo permite concluir

Há 365 linhas diárias, de 8 de setembro a 7 de setembro, passando por dezembro e janeiro. O CSV não informa ano nem fuso. Pela data da conversa, adotei provisoriamente 08/09/2025 a 07/09/2026; a sequência é contínua nessa hipótese. Totais e comparações por ordem das linhas independem do ano. Qualquer análise de segunda a domingo depende de confirmar o ano. O arquivo não identifica a conta; sua atribuição ao Filipe vem do usuário.

São resultados agregados por dia da conta, não visualizações de cada vídeo publicado naquele dia. Faltam data e hora de publicação por vídeo, duração, retenção, conclusão, origem de tráfego, atividade horária e localização da audiência, frequência de publicação e identificação de promoção paga. Não é possível atribuir os picos a um conteúdo ou determinar o melhor horário por este CSV.

## Resultados reais

| Métrica | 365 dias | Últimos 28 dias | 28 anteriores |
|---|---:|---:|---:|
| Visualizações de vídeos | 26.293 | 1.241 | 956 |
| Visualizações do perfil | 274 | 8 | 6 |
| Curtidas | 709 | 48 | 35 |
| Compartilhamentos | 37 | 3 | 5 |
| Mediana de visualizações por dia | 7 | 20 | 30,5 |

Últimos 28 dias: 11/08 a 07/09. Janela anterior: 14/07 a 10/08. Visualizações subiram 29,8%, mas a mediana diária caiu 34,4%. Em outras palavras, o dia típico ficou abaixo do período anterior, apesar da soma maior.

31/08 e 01/09 somaram 703 visualizações: 56,6% das 1.241 da janela recente. Os outros 26 dias somam 538, média de 20,7 por dia. Isso indica concentração, não recuperação sustentada. Não sabemos quais vídeos receberam esse tráfego nem quando foram publicados.

11 a 16/06 somaram 9.331 visualizações (35,5% do total anual) e 152 visualizações do perfil (55,5% do total). 11/06 foi o maior dia, com 3.016 visualizações. A primeira investigação deve identificar os vídeos e fontes de tráfego que explicam essa sequência. Não há prova de viralização ou causalidade por calendário.

Nos últimos 28 dias, foram 3 compartilhamentos para 1.241 visualizações: 2,4 por mil. Na janela anterior, 5 para 956: 5,2 por mil. A contagem é pequena; tratar como sinal para investigar a utilidade e a vontade de compartilhar, não como diagnóstico definitivo. As 8 visualizações do perfil equivalem a 6,4 por mil visualizações de vídeos; essa razão agregada não mede conversão individual nem aquisição de seguidores.

## Qualidade dos dados

O campo Comments contém 11 valores negativos, cuja soma é -12; valores positivos somam 51 e o saldo de todas as linhas é 39. O arquivo não explica a origem dos negativos. Foram preservados e não tratados como comentários brutos recebidos. Não foi calculada uma taxa de engajamento total misturando esse saldo com outras interações. Não há linhas faltantes ou repetidas na sequência assumida. O CSV original está preservado com hash em calculos.json.

## Dias da semana: leitura condicional

Somente se o intervalo for 2025-2026:

| Dia | Dias na janela de 28 | Views nos 28 dias | Mediana diária 28 dias | Dias na janela de 90 | Mediana diária 90 dias |
|---|---:|---:|---:|---:|---:|
| Segunda | 4 | 361 | 16 | 13 | 31 |
| Terça | 4 | 455 | 24,5 | 12 | 45 |
| Quarta | 4 | 112 | 25,5 | 13 | 30 |
| Quinta | 4 | 92 | 25 | 13 | 38 |
| Sexta | 4 | 90 | 20 | 13 | 35 |
| Sábado | 4 | 74 | 19 | 13 | 28 |
| Domingo | 4 | 57 | 13,5 | 13 | 24 |

Nos últimos 90 dias, terça (mediana 45) e quinta (38) têm sinal descritivo favorável. Nos últimos 28, quarta (25,5), quinta (25) e terça (24,5) estão próximas, com apenas quatro observações por dia. Os grandes totais de segunda e terça são afetados pelo pico recente. Não há base para eleger um dia vencedor: o tráfego pode vir de vídeos antigos, e volume de publicações e temas não estão controlados.

## O que muda para o Filipe

A recomendação anterior de quarta às 19h era uma escolha editorial, não um horário comprovado. Este arquivo não a valida. Para reduzir tentativa aleatória, priorizar testes de cultura e liderança em terça e quinta é uma escolha operacional apoiada nos sinais descritivos acima, condicionada ao ano; não uma conclusão causal.

Para o corte “Gestão humanizada não é bagunça”, a próxima oportunidade de teste pode ser quinta às 12h; se esse horário já tiver passado, terça às 19h. As horas continuam hipóteses de rotina de donos e gestores, sem medição horária neste arquivo. Não há compromisso com uma data específica nem necessidade de esperar se houver calendário já definido.

Nas primeiras quatro semanas, publicar dois cortes comparáveis por semana: semana 1 terça 12h e quinta 19h; semana 2 terça 19h e quinta 12h; repetir a alternância nas semanas 3 e 4. Não duplicar o vídeo. Isso produz duas observações por combinação, suficientes apenas para iniciar exploração; ampliar a amostra se os resultados forem instáveis. Distribuir temas de liderança/cultura entre as duas janelas para não confundir assunto e horário. Registrar resultados em 24h e 7 dias, duração, abertura, retenção, conclusão, compartilhamentos por mil views e comentários qualificados. A atividade horária e localização no Studio podem redirecionar esse teste.

Prioridade de diagnóstico: (1) identificar o conteúdo responsável por 11 a 16/06 e por 31/08 a 01/09; (2) comparar abertura, assunto, formato e distribuição; (3) avaliar retenção e compartilhamentos de vídeos comparáveis; (4) testar horário. Uma capa melhor ou um horário diferente ainda não explicam os picos e quedas observados.

## Grade de apoio para as próximas legendas

Fuso operacional: Belém/Brasília (UTC-3), a confirmar contra o fuso da exportação. Todos os horários são hipóteses; os dias também dependem da confirmação do ano. Esta grade não exige postagem diária. A alternância do experimento tem prioridade nas terças e quintas.

| Dia | Horário inicial | Aplicação editorial |
|---|---|---|
| Segunda | 19h | Decisão de gestão e problema do dono |
| Terça | 19h | Cultura/liderança; alternar com 12h no teste |
| Quarta | 19h | Liderança; janela editorial ainda sem validação |
| Quinta | 12h | Caso prático/cultura; alternar com 19h no teste |
| Sexta | 18h | Bastidor e aprendizado de uma decisão |
| Sábado | 10h | História pessoal ligada à gestão |
| Domingo | 19h | Delegação e prioridades da semana |

## Dados que faltam para fechar a recomendação

O período com ano e o fuso exibidos na exportação; a exportação de Conteúdo com identificação, data e hora dos vídeos e métricas disponíveis; e o relatório de atividade dos espectadores/seguidores por hora e dia, com fuso, em CSV ou captura se o Studio não exportar essa informação. Não fornecer senha. Não é preciso autorizar publicação para analisar esses dados.

Arquivos de apoio: Overview_original.csv, dados_diarios_com_ano_inferido.csv, dias_da_semana_condicionais.csv, resumo_mensal_ano_inferido.csv, calculos.json e analisar.py. Valores negativos do original foram preservados. As conclusões usam os dados fornecidos, não estimativas de mercado.
