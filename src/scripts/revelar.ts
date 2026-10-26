// Revelação ao rolar, como melhoria progressiva. Só esconde o que está abaixo da tela
// na abertura, então não há piscada. A cada rolagem revela tudo o que já entrou OU
// já passou da tela: uma rolagem rápida nunca deixa conteúdo preso invisível.
// O que entra junto (cards da mesma fileira) aparece em cascata curta.

const CASCATA_MS = 50;
const CASCATA_MAX = 5;

const raiz = document.documentElement;

document.addEventListener('visibilitychange', () => {
  raiz.classList.toggle('pagina-oculta', document.hidden);
});

const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduzido) {
  const limite = () => window.innerHeight * 0.94;
  const pendentes = new Set<Element>();
  for (const el of document.querySelectorAll('.rv')) {
    if (el.getBoundingClientRect().top > limite()) {
      el.classList.add('rv-espera');
      pendentes.add(el);
    }
  }

  let agendado = false;
  const verificar = () => {
    agendado = false;
    const l = limite();
    let ordem = 0;
    for (const el of pendentes) {
      if (el.getBoundingClientRect().top < l) {
        const atraso = Math.min(ordem++, CASCATA_MAX) * CASCATA_MS;
        if (atraso) setTimeout(() => el.classList.remove('rv-espera'), atraso);
        else el.classList.remove('rv-espera');
        pendentes.delete(el);
      }
    }
    if (!pendentes.size) {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    }
  };
  const agendar = () => {
    if (!agendado) { agendado = true; requestAnimationFrame(verificar); }
  };
  if (pendentes.size) {
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar, { passive: true });
  }
}
