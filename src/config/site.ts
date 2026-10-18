// Configuração única de contato, serviços e preços.
// Valores comerciais: mantidos como estavam no site em 15/10/2026. Atualize aqui,
// em um só lugar, quando houver revisão comercial.

export const contato = {
  nome: 'Paulo Padilha',
  marca: 'ppvfx',
  cidade: 'Belém · PA',
  whatsapp: '5591991755068',
  linkedin: 'https://www.linkedin.com/in/paulopadilhai/',
  instagram: 'https://www.instagram.com/paulopadiilha',
} as const;

// Afirmações herdadas do site anterior. Não aumentar sem comprovação (ver README).
export const numeros = [
  { valor: '+200', rotulo: 'Projetos entregues' },
  { valor: '8', rotulo: 'Anos de experiência' },
  { valor: '24h', rotulo: 'Tempo de resposta' },
] as const;

export function linkWhatsApp(texto: string): string {
  return `https://wa.me/${contato.whatsapp}?text=${encodeURIComponent(texto)}`;
}

export const mensagens = {
  geral: 'Oi Paulo, tenho um projeto de motion design e quero conversar',
  portfolio: 'Oi Paulo, vi seu portfólio e quero um vídeo assim para minha marca',
  agenda: 'Oi Paulo, quero saber sua disponibilidade de agenda para um projeto',
  projeto: (titulo: string) => `Oi Paulo, vi o projeto "${titulo}" no seu portfólio e quero algo nessa linha`,
} as const;

export interface Servico {
  id: string;
  nome: string;
  preco: number;
  resumo: string;
  entregaveis: string[];
  rodadas: number;
  destaque?: string;
  cta: string;
  mensagem: string;
}

export const servicos: Servico[] = [
  {
    id: 'edicao-longa',
    nome: 'Edição Longa',
    preco: 350,
    resumo: 'Edição de vídeos para YouTube, podcast e vídeo de marca. Corte, cor, trilha e sincronização inclusos.',
    entregaveis: ['Vídeo de até 10 minutos', 'Cor e áudio inclusos', 'Corte, trilha e sincronização'],
    rodadas: 1,
    cta: 'Quero edição de vídeo',
    mensagem: 'Oi Paulo, quero edição de vídeo',
  },
  {
    id: 'motion-redes',
    nome: 'Motion para Redes',
    preco: 450,
    resumo: 'Animações para Instagram, Reels e TikTok. Conteúdo que para o dedo no feed.',
    entregaveis: ['Formato vertical otimizado', 'Identidade da marca aplicada'],
    rodadas: 1,
    cta: 'Quero animação para redes',
    mensagem: 'Oi Paulo, quero animação para redes',
  },
  {
    id: 'motion-campanha',
    nome: 'Motion de Campanha',
    preco: 900,
    resumo: 'Pacote completo para lançamento ou campanha: vinheta, peças animadas e versões por formato.',
    entregaveis: ['Múltiplas peças e formatos', 'Direção criativa inclusa'],
    rodadas: 2,
    destaque: 'Mais solicitado',
    cta: 'Quero motion de campanha',
    mensagem: 'Oi Paulo, quero motion de campanha',
  },
];

export const processo = [
  { nome: 'Briefing', texto: 'Você conta o projeto pelo WhatsApp: objetivo, formato e prazo que precisa.' },
  { nome: 'Proposta', texto: 'Respondo com prazo e valor por escrito. Sem surpresa no orçamento.' },
  { nome: 'Produção', texto: 'Aprovou, entro em produção. Sem reunião desnecessária.' },
  { nome: 'Revisão', texto: 'Checkpoint de revisão antes da entrega final, com as rodadas de ajuste do pacote.' },
  { nome: 'Entrega', texto: 'Arquivo pronto para publicar, nos formatos combinados.' },
] as const;

export const navegacao = [
  { href: '#work', rotulo: 'Trabalhos' },
  { href: '#servicos', rotulo: 'Serviços' },
  { href: '#processo', rotulo: 'Processo' },
  { href: '#about', rotulo: 'Sobre' },
  { href: '#precos', rotulo: 'Preços' },
  { href: '#faq', rotulo: 'FAQ' },
] as const;

export const formatoPreco = (v: number) => `R$ ${v.toLocaleString('pt-BR')}`;
