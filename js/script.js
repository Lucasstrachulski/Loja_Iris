(function(){
  const dados = carregarConteudo();

  /* ---- Marca ---- */
  document.title = dados.marca + ' — Vitrine';
  document.getElementById('brandLogoBranco').alt = dados.marca;
  document.getElementById('brandLogoPreto').alt = dados.marca;
  document.getElementById('brandFooter').textContent = dados.marca;

  /* ---- Hero ---- */
  if (dados.heroImagem){
    document.getElementById('topo').style.backgroundImage = `url("${dados.heroImagem}")`;
  }

  /* ---- Sobre ---- */
  document.getElementById('sobreEyebrow').textContent = dados.sobreEyebrow;
  document.getElementById('sobreTitulo').textContent = dados.sobreTitulo;
  document.getElementById('sobreTexto').textContent = dados.sobreTexto;
  const sobreGaleria = document.getElementById('sobreGaleria');
  const TAMANHOS_GALERIA = {
    grande:    { col: 3, row: 3 },
    retangulo: { col: 2, row: 2 },
    vertical:  { col: 1, row: 2 },
    larga:     { col: 2, row: 1 },
    pequena:   { col: 1, row: 1 }
  };
  sobreGaleria.innerHTML = dados.sobreGaleria.map((item, i) => {
    const t = TAMANHOS_GALERIA[item.tamanho] || TAMANHOS_GALERIA.pequena;
    return `
    <div class="sobre-img" data-index="${i}" style="grid-column: span ${t.col}; grid-row: span ${t.row};"><img src="${item.imagem}" alt="${item.legenda}" loading="lazy"></div>
  `;
  }).join('');

  /* ---- Vitrine (galeria com efeito cortina) ---- */
  const vitrineGrid = document.getElementById('vitrineGrid');
  vitrineGrid.innerHTML = dados.vitrine.map((item, i) => `
    <figure class="vitrine-item" data-index="${i}">
      <img src="${item.imagem}" alt="${item.legenda}" loading="lazy">
      <div class="curtain"><span></span><span></span></div>
      <figcaption class="vitrine-cap">${item.legenda}</figcaption>
    </figure>
  `).join('');

  /* ---- Marcas ---- */
  document.getElementById('marcasEyebrow').textContent = dados.marcasEyebrow;
  document.getElementById('marcasTitulo').textContent = dados.marcasTitulo;
  document.getElementById('marcasNota').textContent = dados.marcasNota;
  const marcasGrid = document.getElementById('marcasGrid');
  const marcasItem = m => {
    const img = `<img src="${m.imagem}" alt="${m.nome}" loading="lazy">`;
    return m.link
      ? `<a class="marca-logo" href="${m.link}" target="_blank" rel="noopener" aria-label="${m.nome}">${img}</a>`
      : `<button type="button" class="marca-logo" aria-label="Ver ${m.nome}">${img}</button>`;
  };
  marcasGrid.innerHTML = dados.marcas.map(marcasItem).join('') + dados.marcas.map(marcasItem).join('');

  /* ---- Localização ---- */
  document.getElementById('enderecoLinhas').textContent =
    `${dados.enderecoLinha1} · ${dados.enderecoLinha2}`;
  document.getElementById('horarioTexto').textContent = dados.horario;
  const mapaFrame = document.getElementById('mapaFrame');
  const mapaFrameWrap = mapaFrame.closest('.map-frame');
  mapaFrame.addEventListener('load', () => mapaFrameWrap.classList.add('loaded'));
  mapaFrame.src = dados.mapaEmbedUrl;
  document.getElementById('mapaLink').href =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dados.enderecoLinha1 + ', ' + dados.enderecoLinha2)}`;

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

  /* Lightbox das fotos da loja (seção Sobre) */
  sobreGaleria.addEventListener('click', (e) => {
    const item = e.target.closest('.sobre-img');
    if (!item) return;
    const i = Number(item.dataset.index);
    lightboxImg.src = dados.sobreGaleria[i].imagem;
    lightboxImg.alt = dados.sobreGaleria[i].legenda;
    lightbox.classList.add('open');
  });
  /* Lightbox das marcas (logos sem link próprio abrem a foto ampliada) */
  marcasGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.marca-logo');
    if (!item || item.tagName === 'A') return;
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });

  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
})();
