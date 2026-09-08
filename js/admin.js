(function(){
  let dados = carregarConteudo();

  /* ---- Login com senha (protótipo de front-end: a checagem roda no navegador,
     não em um servidor. Serve para barrar acesso casual, não é segurança real.
     Para trocar a senha: gere o hash SHA-256 dela (ex: no console do navegador
     rodando `await sha256Hex('novaSenha')`) e substitua o valor abaixo. ---- */
  const SENHA_HASH = '0f77bbbb3b3499d03da1447a61b27b18a31279f251e563247c45467936923f58'; // senha atual: iris2026
  const SESSAO_KEY = 'loja-admin-autenticado';

  async function sha256Hex(texto){
    const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function entrarNoPainel(){
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    preencherFormulario();
  }

  async function tentarLogin(){
    const campo = document.getElementById('loginSenha');
    const hash = await sha256Hex(campo.value);
    if (hash === SENHA_HASH){
      sessionStorage.setItem(SESSAO_KEY, '1');
      document.getElementById('loginErro').style.display = 'none';
      entrarNoPainel();
    } else {
      document.getElementById('loginErro').style.display = 'block';
      campo.value = '';
      campo.focus();
    }
  }

  document.getElementById('loginBtn').addEventListener('click', tentarLogin);
  document.getElementById('loginSenha').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tentarLogin();
  });

  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem(SESSAO_KEY);
    document.getElementById('adminShell').style.display = 'none';
    document.getElementById('loginCard').style.display = 'block';
    document.getElementById('loginSenha').value = '';
  });

  const camposSimples = [
    'marca','heroTitulo','heroTexto',
    'sobreTitulo','sobreTexto',
    'marcasTitulo','marcasNota',
    'whatsappNumero','whatsappMensagem','instagramUsuario','instagramUrl',
    'enderecoLinha1','enderecoLinha2','horario','mapaEmbedUrl'
  ];

  function preencherFormulario(){
    camposSimples.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = dados[id] ?? '';
    });
    renderizarSobreGaleria();
    renderizarVitrine();
    renderizarMarcas();
  }

  /* ---- Fotos da loja (lista repetível) ---- */
  function renderizarSobreGaleria(){
    const lista = document.getElementById('sobreGaleriaList');
    lista.innerHTML = dados.sobreGaleria.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-sobre-galeria="${i}">remover</button>
        <label>Link da imagem</label>
        <input type="url" data-sobre-galeria-campo="imagem" data-i="${i}" value="${item.imagem}">
        <label>Legenda</label>
        <input type="text" data-sobre-galeria-campo="legenda" data-i="${i}" value="${item.legenda}">
      </div>
    `).join('');
  }
  document.getElementById('addSobreGaleria').addEventListener('click', () => {
    dados.sobreGaleria.push({ imagem: '', legenda: '' });
    renderizarSobreGaleria();
  });
  document.getElementById('sobreGaleriaList').addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-remove-sobre-galeria');
    if (i !== null){ dados.sobreGaleria.splice(Number(i), 1); renderizarSobreGaleria(); }
  });
  document.getElementById('sobreGaleriaList').addEventListener('input', (e) => {
    const campo = e.target.getAttribute('data-sobre-galeria-campo');
    const i = e.target.getAttribute('data-i');
    if (campo){ dados.sobreGaleria[Number(i)][campo] = e.target.value; }
  });

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

  /* ---- Marcas (lista repetível) ---- */
  function renderizarMarcas(){
    const lista = document.getElementById('marcasList');
    lista.innerHTML = dados.marcas.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-marca="${i}">remover</button>
        <label>Link do logo</label>
        <input type="url" data-marca-campo="imagem" data-i="${i}" value="${item.imagem}">
        <label>Nome da marca</label>
        <input type="text" data-marca-campo="nome" data-i="${i}" value="${item.nome}">
      </div>
    `).join('');
  }
  document.getElementById('addMarca').addEventListener('click', () => {
    dados.marcas.push({ imagem:'', nome:'' });
    renderizarMarcas();
  });
  document.getElementById('marcasList').addEventListener('click', (e) => {
    const i = e.target.getAttribute('data-remove-marca');
    if (i !== null){ dados.marcas.splice(Number(i), 1); renderizarMarcas(); }
  });
  document.getElementById('marcasList').addEventListener('input', (e) => {
    const campo = e.target.getAttribute('data-marca-campo');
    const i = e.target.getAttribute('data-i');
    if (campo){ dados.marcas[Number(i)][campo] = e.target.value; }
  });

  /* ---- Salvar / Restaurar ---- */
  document.getElementById('adminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    camposSimples.forEach(id => {
      const el = document.getElementById(id);
      if (el) dados[id] = el.value;
    });
    /* Quem copia do Google Maps às vezes cola o <iframe> inteiro em vez de só o link: extrai o src. */
    const iframeColado = dados.mapaEmbedUrl.match(/src=["']([^"']+)["']/i);
    if (iframeColado) dados.mapaEmbedUrl = iframeColado[1];
    dados.mapaEmbedUrl = dados.mapaEmbedUrl.trim();
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

  /* Entra direto se já autenticou nesta aba antes (precisa vir por último:
     depende de preencherFormulario e das funções de renderização acima). */
  if (sessionStorage.getItem(SESSAO_KEY) === '1'){
    entrarNoPainel();
  }
})();
