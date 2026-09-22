from pathlib import Path
import csv, json, statistics as st, datetime as dt, hashlib, shutil
from collections import defaultdict
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics.charts.lineplots import LinePlot

ROOT = Path(__file__).resolve().parent
SOURCE = Path('/Volumes/SSD_PP_FRZ/FILIPE/ANALISE PERFIS FILIPE/Overview.csv')
rows = list(csv.DictReader(SOURCE.open(encoding='utf-8-sig')))
keys = list(rows[0])[1:]
year, prev = 2025, 9
for r in rows:
    d = dt.datetime.strptime(r['Date'], '%B %d')
    if d.month < prev: year += 1
    prev = d.month
    r['data_inferida'] = dt.date(year, d.month, d.day).isoformat()
    for k in keys: r[k] = int(r[k])
assert len(rows) == 365
assert all((dt.date.fromisoformat(b['data_inferida'])-dt.date.fromisoformat(a['data_inferida'])).days == 1 for a,b in zip(rows, rows[1:]))
def totals(a): return {k:sum(r[k] for r in a) for k in keys}
def median(a): return st.median(r['Video Views'] for r in a)
def fmt(n): return f'{n:,.0f}'.replace(',', '.') if float(n).is_integer() else str(round(n,1)).replace('.',',')
recent, prior = rows[-28:], rows[-56:-28]
total, curr, old = totals(rows), totals(recent), totals(prior)
negative = [{'data_original':r['Date'],'data_inferida':r['data_inferida'],'campo':k,'valor':r[k]} for r in rows for k in keys if r[k]<0]
peak = [r for r in recent if r['data_inferida'] in ['2026-08-31','2026-09-01']]
spike = [r for r in rows if '2026-06-11' <= r['data_inferida'] <= '2026-06-16']
summary = {'source_sha256':hashlib.sha256(SOURCE.read_bytes()).hexdigest(), 'data_consulta':'2026-09-09','ano_inferido_nao_confirmado':True,'periodo_inferido':[rows[0]['data_inferida'],rows[-1]['data_inferida']],'linhas':len(rows),'totais':total,'mediana_diaria':median(rows),'ultimos_28_dias':curr,'mediana_ultimos_28':median(recent),'28_dias_anteriores':old,'mediana_28_anteriores':median(prior),'pico_31ago_1set':totals(peak),'pico_11a16jun':totals(spike),'valores_negativos':negative}
(ROOT/'calculos.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2))
shutil.copy2(SOURCE, ROOT/'Overview_original.csv')
with (ROOT/'dados_diarios_com_ano_inferido.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.DictWriter(f,fieldnames=list(rows[0])); w.writeheader(); w.writerows(rows)
days=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo']
weekday=[]
for d,name in enumerate(days):
    a=[r for r in recent if dt.date.fromisoformat(r['data_inferida']).weekday()==d]
    b=[r for r in rows[-90:] if dt.date.fromisoformat(r['data_inferida']).weekday()==d]
    weekday.append([name,len(a),totals(a)['Video Views'],median(a),len(b),median(b)])
with (ROOT/'dias_da_semana_condicionais.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f);w.writerow(['dia_se_ano_2025_2026','n_28d','views_28d','mediana_28d','n_90d','mediana_90d']);w.writerows(weekday)
monthly=defaultdict(list)
for r in rows: monthly[r['data_inferida'][:7]].append(r)
with (ROOT/'resumo_mensal_ano_inferido.csv').open('w',newline='',encoding='utf-8-sig') as f:
    w=csv.writer(f);w.writerow(['mes_ano_inferido','dias',*keys,'mediana_views_dia'])
    for m,a in monthly.items():w.writerow([m,len(a),*totals(a).values(),median(a)])

report=f'''# Filipe Frazão | Análise do TikTok Studio

Consulta: 09/09/2026. Fonte: Overview.csv fornecido pelo usuário. Análise local, sem envio dos dados a serviços externos.

## O que este arquivo permite concluir

Há 365 linhas diárias, de 8 de setembro a 7 de setembro, passando por dezembro e janeiro. O CSV não informa ano nem fuso. Pela data da conversa, adotei provisoriamente 08/09/2025 a 07/09/2026; a sequência é contínua nessa hipótese. Totais e comparações por ordem das linhas independem do ano. Qualquer análise de segunda a domingo depende de confirmar o ano. O arquivo não identifica a conta; sua atribuição ao Filipe vem do usuário.

São resultados agregados por dia da conta, não visualizações de cada vídeo publicado naquele dia. Faltam data e hora de publicação por vídeo, duração, retenção, conclusão, origem de tráfego, atividade horária e localização da audiência, frequência de publicação e identificação de promoção paga. Não é possível atribuir os picos a um conteúdo ou determinar o melhor horário por este CSV.

## Resultados reais

| Métrica | 365 dias | Últimos 28 dias | 28 anteriores |
|---|---:|---:|---:|
| Visualizações de vídeos | {fmt(total['Video Views'])} | {fmt(curr['Video Views'])} | {fmt(old['Video Views'])} |
| Visualizações do perfil | {fmt(total['Profile Views'])} | {fmt(curr['Profile Views'])} | {fmt(old['Profile Views'])} |
| Curtidas | {fmt(total['Likes'])} | {fmt(curr['Likes'])} | {fmt(old['Likes'])} |
| Compartilhamentos | {fmt(total['Shares'])} | {fmt(curr['Shares'])} | {fmt(old['Shares'])} |
| Mediana de visualizações por dia | {fmt(median(rows))} | {fmt(median(recent))} | {fmt(median(prior))} |

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
'''
for row in weekday:report+='| '+' | '.join(fmt(v) if isinstance(v,(int,float)) else v for v in row)+' |\n'
report+='''
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
'''
(ROOT/'ANALISE_TIKTOK_STUDIO_FILIPE.md').write_text(report)

# PDF de quatro páginas, com gráficos em escala linear e métricas verificáveis.
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyFRZ',fontName='Helvetica',fontSize=10,leading=14,spaceAfter=8,textColor=colors.HexColor('#242424')))
styles.add(ParagraphStyle(name='SmallFRZ',fontName='Helvetica',fontSize=8,leading=11,spaceAfter=6))
styles['Title'].textColor=colors.HexColor('#d95f00')
styles['Heading2'].textColor=colors.HexColor('#b84e00')
story=[]
def p(t,style='BodyFRZ'):story.append(Paragraph(t,styles[style]))
def title(t):p(t,'Title');story.append(Spacer(1,8))
def table(data,widths):
    cells=[[Paragraph(escape(str(c)),styles['SmallFRZ']) for c in row] for row in data]
    t=Table(cells,colWidths=widths,repeatRows=1)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#fff0df')),('VALIGN',(0,0),(-1,-1),'TOP'),('BOTTOMPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('LINEBELOW',(0,0),(-1,0),.7,colors.HexColor('#d95f00')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#f4f4f4')])]))
    story.append(t);story.append(Spacer(1,12))
def chart(a,max_y,step,label):
    d=Drawing(500,170);lp=LinePlot();lp.x=43;lp.y=27;lp.width=444;lp.height=120
    lp.data=[[(i,r['Video Views']) for i,r in enumerate(a)]]
    lp.lines[0].strokeColor=colors.HexColor('#f47a00');lp.lines[0].strokeWidth=1.3
    lp.xValueAxis.valueMin=0;lp.xValueAxis.valueMax=len(a)-1
    ticks=[0,len(a)//4,len(a)//2,3*len(a)//4,len(a)-1]
    lp.xValueAxis.valueSteps=ticks
    lp.xValueAxis.labelTextFormat=lambda x:dt.date.fromisoformat(a[max(0,min(len(a)-1,round(x)))]['data_inferida']).strftime('%d/%m')
    lp.yValueAxis.valueMin=0;lp.yValueAxis.valueMax=max_y;lp.yValueAxis.valueStep=step
    lp.yValueAxis.labels.fontSize=8;lp.xValueAxis.labels.fontSize=8
    d.add(lp);d.add(String(43,157,label,fontName='Helvetica',fontSize=9));story.append(d)
title('Filipe Frazão | TikTok Studio')
p('Diagnóstico do Overview.csv · 09/09/2026','SmallFRZ')
p('<b>A soma recente cresceu, mas o desempenho diário não se estabilizou.</b> Dois dias concentram 56,6% das visualizações dos últimos 28 dias. O CSV ajuda a localizar os picos; não mede o melhor horário de publicação.')
table([['Métrica','365 dias','Últimos 28','28 anteriores'],['Views de vídeos','26.293','1.241','956'],['Views do perfil','274','8','6'],['Curtidas','709','48','35'],['Compartilhamentos','37','3','5'],['Mediana de views/dia','7','20','30,5']],[194,100,100,110])
chart(rows,3200,800,'Visualizações diárias da conta | sequência completa')
p('<b>Leitura:</b> de 11 a 16/06 ocorreram 9.331 views, 35,5% do total, e 152 views do perfil, 55,5% do total. Identificar os vídeos e as fontes de tráfego desse intervalo é a investigação prioritária.')
p('Datas sem ano no CSV. Hipótese: 08/09/2025 a 07/09/2026. Ano e fuso não confirmados. Métricas diárias podem incluir vídeos antigos. Fonte fornecida pelo usuário; conta atribuída ao Filipe pelo contexto.','SmallFRZ')
story.append(PageBreak());title('O crescimento recente em detalhe')
chart(rows[-56:],400,100,'Visualizações diárias | 14/07 a 07/09')
p('<b>Últimos 28 dias:</b> 1.241 views contra 956 nos 28 anteriores (+29,8%). A mediana caiu de 30,5 para 20 (-34,4%). As duas medidas juntas mostram que a alta se concentrou em poucos dias.')
p('<b>31/08 e 01/09:</b> 703 views. Os outros 26 dias somaram 538, média de 20,7. Não é possível identificar no Overview qual vídeo ou ação gerou o pico.')
p('<b>Compartilhamentos:</b> 3 no período recente, ou 2,4 por mil views; antes, 5, ou 5,2 por mil. Poucos eventos: investigar quais conteúdos dão ao gestor um motivo para enviar a um sócio ou líder, sem atribuir a diferença ao horário.')
p('<b>Perfil:</b> 8 visualizações nos 28 dias recentes. A razão de 6,4 por mil views de vídeos é agregada; não é conversão individual nem crescimento de seguidores.')
p('Qualidade e limites dos dados','Heading2')
p('365 linhas diárias contínuas na hipótese de ano adotada. Comments tem 11 registros negativos, somando -12; positivos somam 51 e o saldo é 39. A causa não está documentada no CSV. Os negativos foram preservados e não tratados como contagem bruta de comentários recebidos.')
p('Não há hora de postagem, atividade horária do público, retenção, conclusão, número de vídeos publicados, identificação de vídeos, origem de tráfego ou indicação de mídia paga. Nenhuma dessas informações foi inferida a partir dos picos.')
story.append(PageBreak());title('Quais dias merecem teste?')
p('<b>Comparação condicional:</b> os nomes dos dias abaixo só valem se o período for setembro de 2025 a setembro de 2026. São dias de consumo, não desempenho de posts publicados nesses dias.')
table([['Dia','Views / 28 dias','Mediana / 28 dias','Mediana / 90 dias']]+[[r[0],fmt(r[2]),fmt(r[3]),fmt(r[5])] for r in weekday],[105,129,135,135])
p('A janela de 28 dias contém quatro observações por dia da semana. A de 90 contém 12 terças e 13 ocorrências dos demais dias. Terça e quinta apresentam medianas favoráveis nos 90 dias; quarta, quinta e terça ficam próximas no recorte recente.')
p('<b>Decisão para Filipe:</b> priorizar terça e quinta como candidatos a teste de liderança/cultura. Isso não comprova que sejam os melhores dias: frequência, temas e distribuição de vídeos antigos podem explicar diferenças.')
p('<b>Correção da recomendação anterior:</b> quarta às 19h era hipótese editorial. O Overview não confirma esse horário e não oferece nenhum dado por hora para substituí-lo por um horário comprovado.')
p('Para “Gestão humanizada não é bagunça”, escolher a próxima quinta às 12h como oportunidade de teste, ou terça às 19h se a janela já passou. O assunto é coerente com donos e gestores que precisam definir limites de equipe. As horas são escolhas operacionais; não foram medidas neste CSV.')
story.append(PageBreak());title('Aplicação nas próximas legendas')
p('Fuso de trabalho: Belém/Brasília (UTC-3). Confirmar o fuso no Studio. Grade de teste; nenhuma hora abaixo está validada pela exportação.')
table([['Dia','Horário inicial','Conteúdo'],['Segunda','19h','Decisões de gestão'],['Terça','19h','Cultura/liderança; testar também 12h'],['Quarta','19h','Liderança; hipótese editorial'],['Quinta','12h','Caso prático/cultura; testar também 19h'],['Sexta','18h','Bastidor e aprendizado'],['Sábado','10h','História pessoal ligada à gestão'],['Domingo','19h','Delegação e prioridades']],[85,95,324])
p('<b>Experimento:</b> semanas 1 e 3: terça 12h e quinta 19h. Semanas 2 e 4: terça 19h e quinta 12h. Dois cortes comparáveis por semana, sem duplicar vídeo. A alternância tem prioridade sobre a grade fixa. São apenas duas observações por combinação; ampliar se inconclusivo.')
p('Comparar resultados em 24h e 7 dias, controlando assunto, duração e formato tanto quanto possível. Registrar retenção, conclusão, compartilhamentos por mil views e comentários de gestores com problemas concretos. Não atribuir ao horário mudanças devidas ao conteúdo.')
p('<b>Próximos dados:</b> período com ano e fuso; exportação de Conteúdo com identificação, data/hora e métricas por vídeo; atividade de espectadores/seguidores por hora e dia, em CSV ou captura se necessário.')
p('Arquivos reproduzíveis: relatório Markdown, original preservado, dados diários, resumo mensal, tabela condicional de dias da semana, calculos.json e analisar.py. Processamento local. Nenhuma publicação foi feita.','SmallFRZ')
def footer(c,doc):
    c.setFont('Helvetica',8);c.setFillColor(colors.grey);c.drawString(45,24,'FILIPE FRAZÃO  |  Análise local de dados fornecidos');c.drawRightString(550,24,str(doc.page))
SimpleDocTemplate(str(ROOT/'ANALISE_TIKTOK_STUDIO_FILIPE.pdf'),pagesize=(595.28,841.89),leftMargin=45,rightMargin=45,topMargin=38,bottomMargin=42).build(story,onFirstPage=footer,onLaterPages=footer)
print(json.dumps(summary,ensure_ascii=False,indent=2))
