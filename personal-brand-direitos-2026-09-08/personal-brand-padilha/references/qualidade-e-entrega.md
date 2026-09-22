<!-- © 2026 personal-brand-padilha. Todos os direitos reservados. Licença proprietária: ../LICENSE -->

# Conferência e entrega

## Factual e editorial

Confira identidade, vínculos, autoria, datas, cifras, períodos e condição de uso. Não classifique toda afirmação como auditada porque está em uma transcrição. Marque textos propostos, cenários didáticos e simulações. Verifique se fontes e limites que sustentam a decisão aparecem na apresentação e no dossiê.

Confirme a coerência entre objetivo, público, prova, posicionamento, canais, conteúdo, oferta e recursos. Revise mudanças de escopo em todos os arquivos afetados. Uma proposta de 12 meses não deve conservar uma conclusão comercial de 90 dias por reaproveitamento acidental.

## Técnico e visual

1. Construa uma versão nova com `project.py build`.
2. Renderize com `render.mjs`; leia `qa/render.json`, corrija overflow e recursos ausentes. A medição automática é triagem, não revisão editorial.
3. Inspecione screenshots e todas as telas do kit. Confira que a quantidade entregue corresponde ao prometido.
4. Abra o PDF produzido. Extraia texto, confira páginas e links e renderize o próprio PDF com ferramenta local disponível (por exemplo PyMuPDF/Poppler). Inspecione imagens do PDF, pois screenshots do HTML não garantem a impressão.
5. Confira o PDF com acentos, fontes, imagens, rodapés, dimensões e fundos. Não declare QA visual independente se só houver extração textual.
6. Empacote a versão revisada; confira checksums e abra o ZIP.

Se PDF/renderização não estiver disponível, informe o arquivo específico faltante e entregue os materiais funcionais. Não renomeie HTML como PDF ou marque um teste não executado como aprovado.

## Pacote final

O pacote deve conter apenas os entregáveis selecionados. Scripts e fontes de trabalho podem acompanhar quando úteis, mas nunca carregar perfis de navegador, extensões, cookies, tokens, caches ou transcrições privadas por consequência automática. `project.py pack` inclui arquivos declarados no manifesto da versão, saídas do renderizador e documentos escolhidos com `--document`, não a pasta inteira do cliente. Selecione dossiê, plano, proposta, calendário e roteiros aplicáveis e confira a matriz de entrega contra o índice do ZIP.

Escreva um índice com versão vigente, finalidade e estado dos arquivos. Registre quais são editáveis, quais são exportações, o que precisa de revisão factual e o que foi publicado, se houver. O ZIP usa caminhos relativos portáveis e inclui manifesto SHA-256. Mantenha a versão anterior.

## Critério para encerrar o pedido completo

Cada linha da matriz de entrega aplicável tem um arquivo utilizável e revisão correspondente, ou uma limitação concreta explicada. Uma estratégia redigida não substitui a produção das peças prometidas. Uma etapa futura de acompanhamento não se marca concluída sem execução e dados.

Na retomada, leia `estado.json`, decisões e versão vigente. Evite repetir entrevista e coleta que já foram documentadas. Use a nova evidência para revisar o próximo ciclo.
