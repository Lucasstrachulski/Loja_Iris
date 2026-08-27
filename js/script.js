(function(){
  const dados = carregarConteudo();

  /* ---- Marca ---- */
  document.title = dados.marca + ' — Vitrine';
  document.getElementById('brandLogoBranco').alt = dados.marca;
  document.getElementById('brandLogoPreto').alt = dados.marca;
  document.getElementById('brandFooter').textContent = dados.marca;

  /* ---- Hero ---- */
  document.getElementById('heroTitulo').innerHTML = dados.heroTitulo;
  document.getElementById('heroTexto').textContent = dados.heroTexto;

  /* ---- Sobre ---- */
  document.getElementById('sobreEyebrow').textContent = dados.sobreEyebrow;
  document.getElementById('sobreTitulo').textContent = dados.sobreTitulo;
  document.getElementById('sobreTexto').textContent = dados.sobreTexto;
  document.getElementById('sobreImagem').src = dados.sobreImagem;
  const listaEl = document.getElementById('sobreLista');
  listaEl.innerHTML = dados.sobreLista.map(item => `<li>${item}</li>`).join('');

  /* ---- Vitrine (galeria com efeito cortina) ---- */
  const vitrineGrid = document.getElementById('vitrineGrid');
  vitrineGrid.innerHTML = dados.vitrine.map((item, i) => `
    <figure class="vitrine-item" data-index="${i}">
      <img src="${item.imagem}" alt="${item.legenda}" loading="lazy">
      <div class="curtain"><span></span><span></span></div>
      <figcaption class="vitrine-cap">${item.legenda}</figcaption>
    </figure>
  `).join('');

  /* ---- Novidades ---- */
  const novidadesGrid = document.getElementById('novidadesGrid');
  novidadesGrid.innerHTML = dados.novidades.map(n => `
    <article class="novidade-card reveal">
      <div class="novidade-img"><img src="${n.imagem}" alt="${n.titulo}" loading="lazy"></div>
      <div class="novidade-body">
        <span class="eyebrow novidade-tag">${n.tag}</span>
        <h3>${n.titulo}</h3>
        <p>${n.texto}</p>
      </div>
    </article>
  `).join('');

  /* ---- Localização ---- */
  document.getElementById('enderecoTexto').textContent =
    'Endereço e horário de funcionamento, para quem prefere ver de perto antes de decidir.';
  document.getElementById('enderecoLinhas').textContent =
    `${dados.enderecoLinha1} · ${dados.enderecoLinha2}`;
  document.getElementById('horarioTexto').textContent = dados.horario;
  document.getElementById('mapaFrame').src = dados.mapaEmbedUrl;

  /* ---- Contato ---- */
  const waLink = `https://wa.me/${dados.whatsappNumero}?text=${encodeURIComponent(dados.whatsappMensagem)}`;
  document.getElementById('whatsappBtn').href = waLink;
  document.getElementById('whatsappFloat').href = waLink;
  document.getElementById('instagramBtn').href = dados.instagramUrl;
  document.getElementById('instagramLabel').textContent = dados.instagramUsuario;

  /* ---- Rodapé ---- */
  document.getElementById('anoAtual').textContent = new Date().getFullYear();

  /* =========================================================
     Interações
     ========================================================= */

  /* Header muda de estado ao rolar (a logo branca cede lugar à preta via CSS) */
  const header = document.getElementById('siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Menu mobile */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const aberto = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(aberto));
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));

  /* Reveal genérico + efeito cortina da vitrine, respeitando reduced motion */
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (semMovimento){
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    document.querySelectorAll('.vitrine-item').forEach(el => el.classList.add('revealed'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in');
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal, .vitrine-item').forEach(el => observer.observe(el));
  }

  /* Lightbox da vitrine */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  vitrineGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.vitrine-item');
    if (!item) return;
    const i = Number(item.dataset.index);
    lightboxImg.src = dados.vitrine[i].imagem;
    lightboxImg.alt = dados.vitrine[i].legenda;
    lightbox.classList.add('open');
  });
  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
})();
