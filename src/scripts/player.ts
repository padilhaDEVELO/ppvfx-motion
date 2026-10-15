// Player de vídeo: o card é um link para o YouTube (funciona sem JavaScript).
// Com JavaScript, clique, Enter e Espaço abrem o diálogo com o player incorporado.
// O iframe só é criado depois da interação e é destruído ao fechar.

const ID_VIDEO = /^[A-Za-z0-9_-]{11}$/;
const EMBED = 'https://www.youtube-nocookie.com/embed/';
const SANDBOX = ['allow-scripts', 'allow-same-origin', 'allow-presentation', 'allow-popups', 'allow-popups-to-escape-sandbox'];

export function iniciarPlayer(): void {
  const dialogo = document.getElementById('player');
  if (!(dialogo instanceof HTMLDialogElement) || typeof dialogo.showModal !== 'function') return;
  if (dialogo.dataset.iniciado) return;
  dialogo.dataset.iniciado = '1';

  const quadro = dialogo.querySelector<HTMLElement>('[data-quadro]')!;
  const titulo = dialogo.querySelector<HTMLElement>('#player-titulo')!;
  const alternativa = dialogo.querySelector<HTMLAnchorElement>('[data-alternativa]')!;
  let origem: HTMLElement | null = null;

  function abrir(gatilho: HTMLElement): boolean {
    const id = gatilho.dataset.video ?? '';
    if (!ID_VIDEO.test(id) || dialogo.open) return false;
    origem = gatilho;

    const nome = gatilho.dataset.titulo || 'Vídeo';
    titulo.textContent = nome;
    dialogo.dataset.formato = gatilho.dataset.formato === 'vertical' ? 'vertical' : 'horizontal';
    alternativa.href = `https://www.youtube.com/watch?v=${id}`;

    const iframe = document.createElement('iframe');
    iframe.src = `${EMBED}${id}?autoplay=1&rel=0&playsinline=1`;
    iframe.title = `Vídeo: ${nome}`;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    // Sem navegação da página principal nem formulários dentro do player.
    // Só aplica as flags que o navegador reconhece (o WebKit não tem allow-presentation).
    for (const flag of SANDBOX) if (iframe.sandbox.supports(flag)) iframe.sandbox.add(flag);
    quadro.replaceChildren(iframe);

    dialogo.showModal();
    return true;
  }

  dialogo.addEventListener('close', () => {
    quadro.replaceChildren(); // encerra o vídeo e o áudio
    const voltar = origem;
    origem = null;
    if (voltar && voltar.isConnected) voltar.focus();
  });

  dialogo.addEventListener('click', (e) => {
    const alvo = e.target as Element;
    // Clique no fundo (fora da caixa) ou no botão de fechar.
    if (alvo === dialogo || alvo.closest('[data-fechar]')) dialogo.close();
  });

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const gatilho = (e.target as Element).closest<HTMLElement>('[data-video]');
    if (gatilho && abrir(gatilho)) e.preventDefault();
  });

  // Espaço também aciona (o link já responde a Enter pelo clique nativo).
  // Só Espaço é tratado; setas e demais teclas seguem o comportamento padrão.
  document.addEventListener('keydown', (e) => {
    if (e.key !== ' ' || e.repeat) return;
    const gatilho = (e.target as Element).closest?.<HTMLElement>('[data-video]');
    if (gatilho && abrir(gatilho)) e.preventDefault();
  });

  for (const el of document.querySelectorAll<HTMLElement>('[data-video]')) el.setAttribute('role', 'button');
}
