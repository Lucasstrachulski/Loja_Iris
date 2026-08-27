(function(){
  let dados = carregarConteudo();

  /* ---- Login simples (protótipo, sem backend) ---- */
  document.getElementById('loginBtn').addEventListener('click', () => {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    preencherFormulario();
  });

  const camposSimples = [
    'marca','heroTitulo','heroTexto',
    'sobreTitulo','sobreTexto','sobreImagem',
    'whatsappNumero','whatsappMensagem','instagramUsuario','instagramUrl',
    'enderecoLinha1','enderecoLinha2','horario','mapaEmbedUrl'
  ];

  function preencherFormulario(){
    camposSimples.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = dados[id] ?? '';
    });
    renderizarVitrine();
    renderizarNovidades();
  }

  /* ---- Vitrine (lista repetível) ---- */
  function renderizarVitrine(){
    const lista = document.getElementById('vitrineList');
    lista.innerHTML = dados.vitrine.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-vitrine="${i}">remover</button>
        <label>Link da imagem</label>
        <input type="url" data-vitrine-campo="imagem" data-i="${i}" value="${item.imagem}">
        <label>Legenda</label>
        <input type="text" data-vitrine-campo="legenda" data-i="${i}" value="${item.legenda}">
      </div>
    `).join('');
  }
  document.getElementById('addVitrine').addEventListener('click', () => {
    dados.vitrine.push({ imagem: '', legenda: '' });
    renderizarVitrine();
  });
  document.getElementById('vitrineList').addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-remove-vitrine');
    if (i !== null){ dados.vitrine.splice(Number(i), 1); renderizarVitrine(); }
  });
  document.getElementById('vitrineList').addEventListener('input', (e) => {
    const campo = e.target.getAttribute('data-vitrine-campo');
    const i = e.target.getAttribute('data-i');
    if (campo){ dados.vitrine[Number(i)][campo] = e.target.value; }
  });

  /* ---- Novidades (lista repetível) ---- */
  function renderizarNovidades(){
    const lista = document.getElementById('novidadesList');
    lista.innerHTML = dados.novidades.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-novidade="${i}">remover</button>
        <label>Link da imagem</label>
        <input type="url" data-novidade-campo="imagem" data-i="${i}" value="${item.imagem}">
        <label>Etiqueta <small>ex: Recém-chegada, Últimas unidades</small></label>
        <input type="text" data-novidade-campo="tag" data-i="${i}" value="${item.tag}">
        <label>Título</label>
        <input type="text" data-novidade-campo="titulo" data-i="${i}" value="${item.titulo}">
        <label>Texto</label>
        <textarea data-novidade-campo="texto" data-i="${i}">${item.texto}</textarea>
      </div>
    `).join('');
  }
  document.getElementById('addNovidade').addEventListener('click', () => {
    dados.novidades.push({ imagem:'', tag:'', titulo:'', texto:'' });
    renderizarNovidades();
  });
  document.getElementById('novidadesList').addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-remove-novidade');
    if (i !== null){ dados.novidades.splice(Number(i), 1); renderizarNovidades(); }
  });
  document.getElementById('novidadesList').addEventListener('input', (e) => {
    const campo = e.target.getAttribute('data-novidade-campo');
    const i = e.target.getAttribute('data-i');
    if (campo){ dados.novidades[Number(i)][campo] = e.target.value; }
  });

  /* ---- Salvar / Restaurar ---- */
  document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    camposSimples.forEach(id => {
      const el = document.getElementById(id);
      if (el) dados[id] = el.value;
    });
    salvarConteudo(dados);
    const msg = document.getElementById('saveMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3200);
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!confirm('Restaurar todo o conteúdo para o padrão? As alterações salvas neste navegador serão perdidas.')) return;
    localStorage.removeItem(STORAGE_KEY);
    dados = carregarConteudo();
    preencherFormulario();
  });
})();
