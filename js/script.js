const btnMenu = document.getElementById('btnMenu');
const menu = document.getElementById('menu');

btnMenu.addEventListener('click', () => {
  const aberto = menu.classList.toggle('hidden') === false;
  btnMenu.setAttribute('aria-expanded', aberto);
  btnMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  document.getElementById('iconeAbrir').classList.toggle('hidden', aberto);
  document.getElementById('iconeFechar').classList.toggle('hidden', !aberto);
});

menu.querySelectorAll('a').forEach((link) =>
  link.addEventListener('click', () => {
    if (!menu.classList.contains('hidden') && window.innerWidth < 1024) btnMenu.click();
  })
);

const carrossel = document.getElementById('carrossel');
const trilho = document.getElementById('trilho');
const dots = document.querySelectorAll('#indicadores button');
const totalSlides = trilho.children.length;
let slideAtual = 0;
let autoPlay;

function irPara(indice) {
  slideAtual = (indice + totalSlides) % totalSlides;
  trilho.style.transform = `translateX(-${slideAtual * 100}%)`;
  dots.forEach((dot, i) => {
    const ativo = i === slideAtual;
    dot.classList.toggle('bg-white', ativo);
    dot.classList.toggle('bg-white/50', !ativo);
    dot.classList.toggle('w-12', ativo);
    dot.classList.toggle('w-8', !ativo);
    dot.setAttribute('aria-current', ativo);
  });
}

function iniciarAutoPlay() {
  pararAutoPlay();
  autoPlay = setInterval(() => irPara(slideAtual + 1), 5000);
}
function pararAutoPlay() {
  clearInterval(autoPlay);
}

document.getElementById('btnAnterior').addEventListener('click', () => { irPara(slideAtual - 1); iniciarAutoPlay(); });
document.getElementById('btnProximo').addEventListener('click', () => { irPara(slideAtual + 1); iniciarAutoPlay(); });
dots.forEach((dot) => dot.addEventListener('click', () => { irPara(Number(dot.dataset.slide)); iniciarAutoPlay(); }));

carrossel.addEventListener('mouseenter', pararAutoPlay);
carrossel.addEventListener('mouseleave', iniciarAutoPlay);

let toqueInicioX = 0;
carrossel.addEventListener('touchstart', (e) => { toqueInicioX = e.touches[0].clientX; }, { passive: true });
carrossel.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - toqueInicioX;
  if (Math.abs(delta) > 50) { irPara(slideAtual + (delta < 0 ? 1 : -1)); iniciarAutoPlay(); }
});

irPara(0);
iniciarAutoPlay();

let ultimoFoco = null;

function abrirModal(modal) {
  ultimoFoco = document.activeElement;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
  modal.querySelector('.modal-caixa').classList.replace('scale-95', 'scale-100');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overflow-hidden');
  setTimeout(() => modal.querySelector('input, button')?.focus(), 50);
}

function fecharModal(modal) {
  modal.classList.add('opacity-0', 'pointer-events-none');
  modal.classList.remove('opacity-100');
  modal.querySelector('.modal-caixa').classList.replace('scale-100', 'scale-95');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal[aria-hidden="false"]')) {
    document.body.classList.remove('overflow-hidden');
  }
  ultimoFoco?.focus();
}

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharModal(modal); });
  modal.querySelectorAll('[data-fechar]').forEach((btn) =>
    btn.addEventListener('click', () => fecharModal(modal))
  );
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const aberto = document.querySelector('.modal[aria-hidden="false"]');
    if (aberto) fecharModal(aberto);
  }
});

const modalProduto = document.getElementById('modalProduto');
const modalConfirmacao = document.getElementById('modalConfirmacao');

function confirmar(mensagem) {
  document.getElementById('modalConfirmacaoMsg').textContent = mensagem;
  abrirModal(modalConfirmacao);
}

document.querySelectorAll('[data-abrir-produto]').forEach((botao) =>
  botao.addEventListener('click', () => {
    document.getElementById('modalProdutoTitulo').textContent = botao.dataset.nome;
    document.getElementById('modalProdutoPreco').textContent = botao.dataset.preco;
    const img = document.getElementById('modalProdutoImg');
    img.src = botao.dataset.img;
    img.alt = botao.dataset.nome;
    document.getElementById('quantidade').value = 1;
    abrirModal(modalProduto);
  })
);

document.getElementById('formCompra').addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('modalProdutoTitulo').textContent;
  const qtd = document.getElementById('quantidade').value;
  fecharModal(modalProduto);
  setTimeout(() => confirmar(`${qtd}x ${nome} adicionado ao carrinho!`), 300);
});

const formContato = document.getElementById('formContato');

formContato.addEventListener('submit', (e) => {
  e.preventDefault();
  formContato.dataset.validated = '';
  if (!formContato.checkValidity()) {
    formContato.querySelector(':invalid')?.focus();
    return;
  }
  formContato.reset();
  delete formContato.dataset.validated;
  confirmar('Mensagem enviada com sucesso!');
});
