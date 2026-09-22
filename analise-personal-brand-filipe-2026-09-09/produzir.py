from pathlib import Path
import json, io, html, hashlib
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from pypdf import PdfReader, PdfWriter

ROOT = Path(__file__).resolve().parent
PROJECT = ROOT / 'projeto'
DEST = ROOT / 'entregas'
DEST.mkdir(exist_ok=True)
FONT = Path('/Users/ppvfx/Library/Fonts')
for name,file in [('Body','Montserrat-Regular.ttf'),('Bold','Montserrat-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONT/file)))
W,H = 960,540
WHITE='#FFFFFF'; MUTED='#9D9D9F'; BG='#030201'
bio='Gestão, processos e IA para sua empresa depender menos de você.\nFounder & CEO do Grupo FRZ\nConheça as soluções do grupo ↓'
slides=[]
def slide(title, body, eyebrow, note='', sources=None):
    slides.append(dict(layout='text',title=title,body=body,eyebrow=eyebrow,note=note,sources=sources or []))
slide('Filipe Frazão\nMarca pessoal e descoberta',
      'Instagram, TikTok e comparação com Alfredo Soares.\nDireção editorial, entrada do perfil, pilotos e revisão do plano de Stories.',
      'REVISÃO ESTRATÉGICA · 09 SET 2026',
      'Diagnóstico apoiado em acervo de agosto e fontes públicas acessíveis. A grade atual e os Analytics não foram verificados.')
slide('O que sabemos — e o que falta',
      'ACERVO: relatório de redes de 27/08; texto de dois PDFs de Stories; seis capas enviadas.\nFONTES PÚBLICAS: sites de Filipe/Grupo FRZ e Alfredo; um post histórico de Alfredo no LinkedIn.\nLIMITES: Instagram e TikTok não carregaram. Não foram assistidos os cortes nem conferidas as hashtags atuais.',
      'ALCANCE DA LEITURA',
      'Não atribuímos notas, taxas atuais ou causalidade a perfis que não puderam ser examinados.',
      [{'label':'Inventário detalhado no dossiê','source_id':'L01-L03'}])
slide('A utilidade precisa aparecer primeiro',
      'O relatório de agosto registrava uma promessa ampla de escala e performance e uma primeira fileira institucional.\nHipótese: o visitante frio precisa interpretar a marca antes de perceber qual problema ela ajuda a resolver.\nMudança: começar pela situação do gestor, mostrar uma decisão e conectar a demonstração ao grupo.',
      'INSTAGRAM DO FILIPE · EVIDÊNCIA HISTÓRICA',
      'É um diagnóstico da comunicação registrada em agosto; o estado atual da bio e dos fixados precisa de conferência.',
      [{'label':'Relatório local, seções 3.1 e 6','source_id':'L01'}])
slide('Alfredo: território e continuidade',
      'No site oficial, vendas, marketing e varejo conectam trajetória, livros, conteúdo e caminhos de educação.\nNo post histórico examinado, a experiência pessoal dá contexto à produção e ao relacionamento.\nPara Filipe: repetir uma contribuição clara e demonstrar a própria decisão em situações reais.',
      'COMPARAÇÃO · MECANISMO DE MARCA',
      'A arquitetura observada não comprova receita nem explica, isoladamente, o alcance nas redes.',
      [{'label':'Site Alfredo Soares','url':'https://alfredosoares.com.br/'}])
slide('Comparação por canal, com limites claros',
      'INSTAGRAM: conta do Alfredo vinculada pelo site; ambos os perfis sem leitura atual.\nYOUTUBE: site de Alfredo aponta para endereço legado; handle atual localizado, equivalência pendente.\nLINKEDIN: um texto público histórico de Alfredo lido; sem análise da frequência.\nTIKTOK: perfil indicado pelo usuário; sem acesso direto.\nSPOTIFY: podcast vinculado pelo site; episódios não ouvidos.',
      'INVENTÁRIO DAS REDES',
      'Perfis de cortes e homônimos não foram tratados como oficiais. URLs e condições de identificação estão no dossiê.')
slide('Um recorte demonstrável para Filipe',
      'POSICIONAMENTO PROPOSTO\nMostrar como organizar a operação de uma empresa com gestão, processos e IA.\nPÚBLICO\nDonos e gestores com decisões centralizadas e rotinas repetitivas.\nPROVA\nSituação → decisão → demonstração → limite → próximo passo.',
      'APLICAÇÃO · PERSONAL BRAND PADILHA',
      'A contribuição deve ser demonstrada em cada conteúdo. Não há promessa de exclusividade ou resultado financeiro.',
      [{'label':'Apresentação do Grupo FRZ','url':'https://frzgroup.com.br/'}])
slide('Bio pronta para revisão',bio,
      'ENTRADA DO INSTAGRAM',
      'Nome proposto: Filipe Frazão | Gestão e IA. Destino proposto: frzgroup.com.br. Não foi aplicado ao perfil.')
slide('Três fixados com funções diferentes',
      '1 · IDENTIFICAÇÃO\nSua empresa depende de você para tudo? Três sinais e um exemplo didático.\n2 · PROVA\nComo uma tarefa vira um processo claro. Mostrar entrada, responsável, conclusão e exceção.\n3 · ORIENTAÇÃO\nPor onde começar com gestão e IA. Explicar a ordem e o próximo passo real.',
      'DO VISITANTE AO INTERESSE',
      'Destaques propostos: Comece aqui, Gestão, IA, Casos e Soluções. Criar somente os que tiverem acervo suficiente.')
slide('A mesma capa não produz o mesmo alcance',
      'Na imagem enviada: de 2.106 a 57,8 mil visualizações com linguagem visual semelhante.\nA diferença de aproximadamente 27,4 vezes não permite isolar o efeito da capa. Faltam datas, idade, tráfego, duração e retenção.\nAplicação: foto real, fundo escurecido e título curto. Tema, abertura e entrega continuam sendo hipóteses prioritárias de teste.',
      'TIKTOK · CAPAS E TÍTULOS',
      'Imagem sem identificação independente do perfil/plataforma. Modelo HTML entregue na pasta TikTok.')
slide('Três pilotos para gravar',
      'GESTÃO · Sua empresa depende só de você?\nResponsável, critério e exceção para uma decisão recorrente.\nIA · IA não conserta processo ruim.\nEntrada, saída e conferência antes da automação.\nVENDAS · Cliente sem retorno: quem acompanha?\nResponsável, próxima ação e data por oportunidade.',
      'PEÇAS EDITORIAIS CONCRETAS',
      'Roteiros completos e legendas por canal em conteudo/pilotos.md. Exemplos didáticos; vídeos ainda não produzidos.')
slide('O PDF de Stories precisava de correções',
      'CTA: substituir “arraste para cima” por mensagem ou toque no sticker de link.\nCONCORRÊNCIA: retirar a alegação de território livre e ausência de diagnóstico dos concorrentes.\nMÉTRICAS: razão de alcance não é conclusão das mesmas pessoas. Separar eventos, contas e conversas.\nTESTES: horários e pontuações editoriais são hipóteses, não parâmetros validados.',
      'REVISÃO DO ACERVO',
      'Original preservado. Edição revisada com nota inicial e nove páginas substituídas; consulte revisao-stories.md.')
slide('Uma métrica responde a uma pergunta',
      'ATENÇÃO · tempo assistido, retenção quando disponível e conclusão do vídeo.\nUTILIDADE · compartilhamentos e salvamentos, com denominador explícito.\nINTERESSE · visitas ao perfil, seguidores atribuídos e perguntas concretas.\nNEGÓCIO · conversas qualificadas e origem; receita somente quando observada e rastreada.',
      'PLANO DE MENSURAÇÃO',
      'Comparar idade, duração, formato e objetivo semelhantes. Views, alcance e pessoas não são equivalentes.')
slide('Primeiro ciclo de 30 dias',
      'SEMANA 1 · conferir entrada do perfil, reunir perguntas e separar demonstrações.\nSEMANAS 2–3 · dois temas por semana; versões próprias para Reels/TikTok e Stories de contexto.\nSEMANA 4 · comparar grupos, perguntas e esforço de produção; escolher o próximo teste.\nCAPACIDADE · estimar 4–6h de produção + 45–60min do Filipe; medir o primeiro lote.',
      'OPERAÇÃO PROPOSTA',
      'Frequência dimensionada como hipótese. O plano não instala agendamentos nem autoriza publicação.')
slide('Pronto para revisão; dados ainda necessários',
      'ENTREGUE · diagnóstico, comparação possível, bio, pilotos, modelo de capa e revisão de Stories.\nPARA FECHAR A AUDITORIA · amostra atual acessível do Instagram/TikTok, Analytics e o vídeo específico para a capa.\nFONTES · dossiê e fontes.csv distinguem histórico, observação pública, interpretação e proposta.',
      'CONTINUIDADE',
      'Nenhuma conta foi editada. Nenhum conteúdo foi publicado. Método: personal-brand-padilha, © 2026.')

data=dict(schema_version=1,person='Filipe Frazão',title='Marca pessoal, Instagram e TikTok',status='revisão estratégica com coleta atual limitada',bio=bio,bios={'instagram':bio},visual={'background':BG,'foreground':WHITE,'accent':MUTED,'font_file':'assets/Montserrat-Regular.ttf'},deck=slides,highlights=[],posts=[])
(PROJECT/'assets').mkdir(exist_ok=True)
(PROJECT/'assets'/'Montserrat-Regular.ttf').write_bytes((FONT/'Montserrat-Regular.ttf').read_bytes())
(PROJECT/'projeto.json').write_text(json.dumps(data,ensure_ascii=False,indent=2))
(PROJECT/'bios.txt').write_text('PROPOSTA — NÃO PUBLICADA\nNome: Filipe Frazão | Gestão e IA\n\n'+bio+f'\n\nCaracteres da bio, incluindo quebras: {len(bio)}\nDestino proposto: https://frzgroup.com.br/\n')

layout_checks=[]
def paragraph(c, text, x, top, width, font='Body', size=18, color=WHITE, leading=None):
    style=ParagraphStyle('p',fontName=font,fontSize=size,leading=leading or size*1.38,textColor=HexColor(color))
    p=Paragraph(html.escape(text).replace('\n','<br/>'),style)
    _,height=p.wrap(width,1000)
    p.drawOn(c,x,H-top-height)
    return top+height

def page(c, title, body, eyebrow, note='', number='', sources=None):
    c.setFillColor(HexColor(BG));c.rect(0,0,W,H,fill=1,stroke=0)
    paragraph(c,eyebrow,48,32,864,'Bold',10,MUTED)
    bottom=paragraph(c,title,48,62,864,'Bold',29,leading=35)
    end=paragraph(c,body,48,bottom+26,845,'Body',18,leading=25)
    if end>425: raise ValueError(f'Conteúdo excede área útil ({end}): {title}')
    if note:
        note_end=paragraph(c,note,48,445,864,'Body',10,MUTED,14)
        if note_end>496: raise ValueError('Nota excede área útil: '+title)
    c.setStrokeColor(HexColor('#373535'));c.line(48,39,912,39)
    c.setFont('Body',8);c.setFillColor(HexColor(MUTED));c.drawString(48,24,'FILIPE FRAZÃO  /  REVISÃO · 09.09.2026');c.drawRightString(912,24,str(number))
    if sources:
        url=next((s.get('url') for s in sources if s.get('url')),None)
        if url:c.linkURL(url,(48,42,912,94),relative=0)
    layout_checks.append({'title':title,'body_bottom':end,'passed':end<=425})
    c.showPage()

out=DEST/'ANALISE_MARCA_PESSOAL_FILIPE_2026-09-09.pdf'
c=canvas.Canvas(str(out),pagesize=(W,H));c.setTitle('Filipe Frazão — Marca pessoal, Instagram e TikTok')
for i,s in enumerate(slides,1):page(c,s['title'],s['body'],s['eyebrow'],s['note'],f'{i:02} / {len(slides)}',s['sources'])
c.save()

replacements={
9:('Uma próxima ação que realmente existe',
   'DESCOBERTA · “Qual tarefa mais se repete na sua empresa? Responda por mensagem.”\nCONSIDERAÇÃO · “Veja a demonstração completa no link deste Story.” Usar somente se o destino existir.\nCONVERSA · “Conte por mensagem qual processo você quer organizar.”\nLink externo: orientar o toque no sticker. Mensagem: orientar a resposta ao Story. Escolher uma ação principal.',
   'Não oferecer diagnóstico gratuito, agendamento ou material sem confirmar entrega, destino e capacidade de atendimento.'),
11:('Destaques que ajudam quem chega agora',
    'COMECE AQUI · destinatário, contribuição e forma de acompanhar.\nGESTÃO · rotinas, critérios e decisões.\nIA · demonstrações com contexto e limites.\nCASOS · materiais autorizados, situação e resultado com período.\nSOLUÇÕES · ofertas existentes e próximos passos.',
    'O scorecard 0–2 é uma ferramenta editorial. A nota 12/16 não é um limiar validado de desempenho. Promover conteúdo útil, claro e atualizado.'),
14:('Diferenciar pela contribuição e pela prova',
    'PROPOSTA PARA FILIPE\nDocumentar uma situação operacional, explicar a decisão e acompanhar o que mudou.\nREFERÊNCIA DO ALFREDO\nA arquitetura pública de marca conecta repertório, problemas comerciais e oferta.\nCRITÉRIO\nA proposta de Filipe precisa funcionar para o seu público e ter evidências próprias.',
    'Retirada a afirmação de “território livre”. A amostra não permite dizer que Alfredo ou Tallis não documentam diagnóstico e retorno.'),
16:('Separar contas, visualizações e ações',
    'ALCANCE · contas únicas expostas ao frame, conforme definição do campo exportado.\nVISUALIZAÇÕES / IMPRESSÕES · usar o nome e a definição disponíveis na conta; não tratar como pessoas únicas.\nNAVEGAÇÃO · avanços, voltas, próximo Story e saídas, quando disponíveis; são eventos.\nINTERAÇÃO · respostas, curtidas privadas e ações em stickers, quando disponíveis.',
    'Não presumir que todos os campos estejam presentes em toda conta, versão ou exportação. Ausência de campo não significa zero.'),
17:('Do Story à conversa: outra unidade',
    'LINK · registrar cliques e o alcance do frame com link.\nPERFIL · registrar visitas e seguidores atribuídos somente se disponíveis.\nCONVERSAS · contar pessoas ou conversas únicas que responderam, separando o total de mensagens.\nQUALIFICAÇÃO · definir problema, aderência à solução e próximo passo.\nRECEITA · registrar somente com venda observada e origem rastreável.',
    'Resposta não equivale a lead. Lead não equivale a venda. Não somar pessoas repetidas nem misturar eventos e contas no mesmo denominador.'),
18:('Fórmulas com denominadores explícitos',
    'RAZÃO DE ALCANCE · alcance último / alcance primeiro × 100. Proxy agregado; não é conclusão individual.\nRESPOSTAS · contas únicas que responderam / alcance do frame × 100, quando houver deduplicação.\nLINK · cliques / alcance do frame com link × 100. Intensidade por alcance; pode incluir repetição.\nNAVEGAÇÃO · reportar eventos por visualizações compatíveis, se disponíveis.\nQUALIFICAÇÃO · conversas únicas qualificadas / conversas únicas iniciadas × 100.',
    'Denominador zero ou campo ausente: N/D. A razão final/inicial pode superar 100%; não limitar artificialmente. Não é uma coorte das mesmas pessoas.'),
19:('Um sinal orienta a investigação',
    'ALCANCE MENOR · conferir exposição, horário, tamanho da base e tema; não concluir que o gancho falhou.\nMENOR RAZÃO FINAL/INICIAL · investigar sequência, entradas intermediárias, duração e clareza.\nPOUCAS RESPOSTAS · verificar interesse, convite e facilidade de responder.\nPOUCOS PRÓXIMOS PASSOS · revisar oferta, destino e capacidade de atendimento.',
    'São hipóteses. Comparar grupos semelhantes e ler os conteúdos antes de atribuir uma causa.'),
22:('Comparar grupos antes de mudar a rotina',
    '24 HORAS · registrar as sequências, os dados por frame e as perguntas recebidas.\n7 DIAS · consolidar conversas e encaminhamentos; Stories já expirados exigem dados salvos ou Insights disponíveis.\n28 DIAS · comparar séries com objetivo, tamanho e janela semelhantes.\n90 DIAS · rever contribuição, formatos e custo operacional.',
    'Três posts abaixo da mediana não provam fracasso. Quantidade, qualidade da amostra e causas alternativas precisam ser consideradas.'),
28:('Horário é hipótese de teste',
    'BASE · usar atividade do público e histórico próprios, quando disponíveis.\nTESTE · comparar duas janelas compatíveis com a rotina da equipe e alternar a ordem.\nCONTROLE · registrar fuso, tema, formato, duração e idade do post na coleta.\nCAPACIDADE · começar com dois temas por semana, adaptados para Instagram, TikTok e Stories.\nDECISÃO · escolher a janela após observar grupos de publicações.',
    'Nenhum “melhor horário” foi comprovado. As janelas da versão anterior são possibilidades de teste, não resultado de pesquisa do público.')}

original=Path('/Volumes/SSD_PP_FRZ/FILIPE/ANALISE PERFIS FILIPE/APRESENTACAO_ESTRATEGICA_STORIES_FILIPE_FRAZAO_COM_HORARIOS.pdf')
reader=PdfReader(original); writer=PdfWriter()
buf=io.BytesIO();c=canvas.Canvas(buf,pagesize=(W,H))
page(c,'Stories · edição revisada',
     'Origem: plano de Stories com horários, 28 páginas. Esta edição preserva o original e atualiza nove páginas.\nA leitura dos concorrentes permanece uma referência histórica, sem auditoria de Stories atuais.\nNos trechos preservados, “conclusão” calculada por alcance significa razão final/inicial, conforme a página 18 revisada.\nFrequências, rotas e percentuais editoriais são propostas; não foram implementados.',
     'NOTA DE REVISÃO · 09/09/2026',
     'Páginas de origem substituídas: 9, 11, 14, 16, 17, 18, 19, 22 e 28. Paginação original preservada nos rodapés. Referências completas em revisao-stories.md.', 'NOTA')
c.save();writer.add_page(PdfReader(buf).pages[0])
for i,p in enumerate(reader.pages,1):
    if i in replacements:
        title,body,note=replacements[i];b=io.BytesIO();rc=canvas.Canvas(b,pagesize=(W,H))
        page(rc,title,body,'STORIES · PÁGINA REVISADA',note,f'ORIGEM {i:02}')
        rc.save();writer.add_page(PdfReader(b).pages[0])
    else:writer.add_page(p)
writer.add_metadata({'/Title':'Stories Filipe Frazão — edição revisada 09/09/2026'})
with (DEST/'STORIES_FILIPE_EDICAO_REVISADA_2026-09-09.pdf').open('wb') as f:writer.write(f)
(ROOT/'qa'/'layout.json').write_text(json.dumps(layout_checks,ensure_ascii=False,indent=2))
(ROOT/'qa'/'originais.json').write_text(json.dumps({'original':str(original),'sha256':hashlib.sha256(original.read_bytes()).hexdigest(),'paginas_original':len(reader.pages),'paginas_revisada':len(writer.pages)},ensure_ascii=False,indent=2))
print(json.dumps({'deck_pages':len(slides),'revised_pdf_pages':len(writer.pages),'bio_characters':len(bio),'layout_passed':all(x['passed'] for x in layout_checks)},ensure_ascii=False))
