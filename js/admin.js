(function(){
  let dados = structuredClone(CONTEUDO_PADRAO);

  /* ---- Login (Supabase Auth). Quem pode entrar é quem foi cadastrado em
     Authentication → Users no painel do Supabase; o banco só aceita
     alterações vindas de uma sessão logada (ver supabase/setup.sql). ---- */

  /* ---- Fotos escolhidas do celular/computador: redimensiona e comprime
     no navegador antes de enviar, pra subir rápido mesmo no 4G. ---- */
  function arquivoParaBlob(file, ladoMaximo, formatoSaida, qualidade){
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > ladoMaximo || height > ladoMaximo){
            if (width > height){ height = Math.round(height * ladoMaximo / width); width = ladoMaximo; }
            else { width = Math.round(width * ladoMaximo / height); height = ladoMaximo; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);
          canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Não foi possível ler essa imagem.')),
            formatoSaida, qualidade);
        };
        img.onerror = () => reject(new Error('Não foi possível ler essa imagem.'));
        img.src = leitor.result;
      };
      leitor.onerror = () => reject(new Error('Não foi possível ler esse arquivo.'));
      leitor.readAsDataURL(file);
    });
  }
  async function enviarFotoArquivo(file){
    return enviarFoto(await arquivoParaBlob(file, 1600, 'image/jpeg', 0.82), 'jpg');
  }
  async function enviarLogoArquivo(file){
    const png = file.type === 'image/png';
    return enviarFoto(await arquivoParaBlob(file, 700, png ? 'image/png' : 'image/jpeg', 0.9), png ? 'png' : 'jpg');
  }

  async function entrarNoPainel(){
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('adminShell').style.display = 'block';
    dados = await carregarConteudo();
    preencherFormulario();
  }

  function mostrarErroLogin(texto){
    const erro = document.getElementById('loginErro');
    erro.textContent = texto;
    erro.style.display = 'block';
  }

  async function tentarLogin(){
    if (!supabaseCliente){
      mostrarErroLogin('O painel ainda não foi ligado ao Supabase (js/config.js).');
      return;
    }
    const campo = document.getElementById('loginSenha');
    const { error } = await supabaseCliente.auth.signInWithPassword({
      email: document.getElementById('loginEmail').value.trim(),
      password: campo.value
    });
    if (!error){
      document.getElementById('loginErro').style.display = 'none';
      entrarNoPainel();
    } else {
      mostrarErroLogin('E-mail ou senha incorretos. Tente novamente.');
      campo.value = '';
      campo.focus();
    }
  }

  document.getElementById('loginBtn').addEventListener('click', tentarLogin);
  document.getElementById('loginSenha').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tentarLogin();
  });

  document.getElementById('logoutBtn').addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseCliente.auth.signOut();
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
    renderizarHeroImagem();
    renderizarSobreGaleria();
    renderizarVitrine();
    renderizarMarcas();
  }

  /* ---- Foto de capa ---- */
  function renderizarHeroImagem(){
    const preview = document.getElementById('heroImagemPreview');
    preview.src = dados.heroImagem || '';
    preview.style.display = dados.heroImagem ? '' : 'none';
  }
  /* A capa é salva na hora: no celular é fácil trocar a foto e sair sem rolar até "Salvar alterações".
     Só a capa entra no que já estava salvo, para não gravar textos que ainda estão sendo editados. */
  async function salvarCapa(mensagemOk){
    const status = document.getElementById('heroImagemStatus');
    const salvo = await carregarConteudo();
    salvo.heroImagem = dados.heroImagem;
    if (await salvarConteudo(salvo)){
      status.textContent = mensagemOk;
    } else {
      status.textContent = '';
      alert('Não deu pra salvar a capa. Verifique a internet e tente de novo.');
    }
  }
  document.getElementById('heroImagemArquivo').addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const status = document.getElementById('heroImagemStatus');
    status.textContent = 'Enviando foto…';
    try{
      dados.heroImagem = await enviarFotoArquivo(file);
      renderizarHeroImagem();
      await salvarCapa('Foto de capa salva.');
    }catch(err){ status.textContent = ''; alert(err.message); }
    e.target.value = '';
  });
  document.getElementById('removerHeroImagem').addEventListener('click', () => {
    dados.heroImagem = '';
    renderizarHeroImagem();
    salvarCapa('Foto de capa removida.');
  });

  /* ---- Fotos da loja (lista repetível) ---- */
  function renderizarSobreGaleria(){
    const lista = document.getElementById('sobreGaleriaList');
    lista.innerHTML = dados.sobreGaleria.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-sobre-galeria="${i}">remover</button>
        <label>Foto</label>
        <div class="img-picker">
          <img class="img-preview" src="${item.imagem}" alt="">
          <label class="file-btn">Escolher foto do celular
            <input type="file" accept="image/*" data-sobre-galeria-foto="${i}">
          </label>
        </div>
        <label>Legenda</label>
        <input type="text" data-sobre-galeria-campo="legenda" data-i="${i}" value="${item.legenda}">
        <label>Tamanho no mosaico</label>
        <select data-sobre-galeria-campo="tamanho" data-i="${i}">
          ${Object.entries(TAMANHOS_GALERIA_LABEL).map(([valor, rotulo]) =>
            `<option value="${valor}" ${item.tamanho === valor ? 'selected' : ''}>${rotulo}</option>`
          ).join('')}
        </select>
      </div>
    `).join('');
  }
  const TAMANHOS_GALERIA_LABEL = {
    grande: 'Grande (ocupa a linha toda)',
    retangulo: 'Retângulo',
    vertical: 'Vertical (mais alta)',
    larga: 'Larga (mais baixa)',
    pequena: 'Pequena'
  };
  document.getElementById('addSobreGaleria').addEventListener('click', () => {
    dados.sobreGaleria.push({ imagem: '', legenda: '', tamanho: 'pequena' });
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
  document.getElementById('sobreGaleriaList').addEventListener('change', async (e) => {
    const i = e.target.getAttribute('data-sobre-galeria-foto');
    const file = e.target.files && e.target.files[0];
    if (i === null || !file) return;
    try{
      dados.sobreGaleria[Number(i)].imagem = await enviarFotoArquivo(file);
      renderizarSobreGaleria();
    }catch(err){ alert(err.message); }
  });

  /* ---- Vitrine (lista repetível) ---- */
  function renderizarVitrine(){
    const lista = document.getElementById('vitrineList');
    lista.innerHTML = dados.vitrine.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-vitrine="${i}">remover</button>
        <label>Foto</label>
        <div class="img-picker">
          <img class="img-preview" src="${item.imagem}" alt="">
          <label class="file-btn">Escolher foto do celular
            <input type="file" accept="image/*" data-vitrine-foto="${i}">
          </label>
        </div>
        <label>Legenda</label>
        <input type="text" data-vitrine-campo="legenda" data-i="${i}" value="${item.legenda}">
        <label>Tamanho no mosaico</label>
        <select data-vitrine-campo="tamanho" data-i="${i}">
          ${Object.entries(TAMANHOS_VITRINE_LABEL).map(([valor, rotulo]) =>
            `<option value="${valor}" ${item.tamanho === valor ? 'selected' : ''}>${rotulo}</option>`
          ).join('')}
        </select>
      </div>
    `).join('');
  }
  const TAMANHOS_VITRINE_LABEL = {
    grande: 'Grande (metade da largura)',
    retangulo: 'Retângulo',
    vertical: 'Vertical (mais alta)',
    larga: 'Larga (mais baixa)',
    pequena: 'Pequena'
  };
  document.getElementById('addVitrine').addEventListener('click', () => {
    dados.vitrine.push({ imagem: '', legenda: '', tamanho: 'pequena' });
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
  document.getElementById('vitrineList').addEventListener('change', async (e) => {
    const i = e.target.getAttribute('data-vitrine-foto');
    const file = e.target.files && e.target.files[0];
    if (i === null || !file) return;
    try{
      dados.vitrine[Number(i)].imagem = await enviarFotoArquivo(file);
      renderizarVitrine();
    }catch(err){ alert(err.message); }
  });

  /* ---- Marcas (lista repetível) ---- */
  function renderizarMarcas(){
    const lista = document.getElementById('marcasList');
    lista.innerHTML = dados.marcas.map((item, i) => `
      <div class="repeat-item" data-i="${i}">
        <button type="button" class="remove-btn" data-remove-marca="${i}">remover</button>
        <label>Logo</label>
        <div class="img-picker">
          <img class="img-preview" src="${item.imagem}" alt="">
          <label class="file-btn">Escolher logo do celular
            <input type="file" accept="image/*" data-marca-foto="${i}">
          </label>
        </div>
        <label>Nome da marca</label>
        <input type="text" data-marca-campo="nome" data-i="${i}" value="${item.nome}">
      </div>
    `).join('');
  }
  document.getElementById('addMarca').addEventListener('click', () => {
    dados.marcas.push({ imagem:'', nome:'', link:'' });
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
  document.getElementById('marcasList').addEventListener('change', async (e) => {
    const i = e.target.getAttribute('data-marca-foto');
    const file = e.target.files && e.target.files[0];
    if (i === null || !file) return;
    try{
      dados.marcas[Number(i)].imagem = await enviarLogoArquivo(file);
      renderizarMarcas();
    }catch(err){ alert(err.message); }
  });

  /* ---- Salvar / Restaurar ---- */
  document.getElementById('adminForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    camposSimples.forEach(id => {
      const el = document.getElementById(id);
      if (el) dados[id] = el.value;
    });
    /* Quem copia do Google Maps às vezes cola o <iframe> inteiro em vez de só o link: extrai o src. */
    const iframeColado = dados.mapaEmbedUrl.match(/src=["']([^"']+)["']/i);
    if (iframeColado) dados.mapaEmbedUrl = iframeColado[1];
    dados.mapaEmbedUrl = dados.mapaEmbedUrl.trim();
    const salvou = await salvarConteudo(dados);
    if (!salvou){
      alert('Não deu pra salvar. Verifique a internet e tente de novo.');
      return;
    }
    const msg = document.getElementById('saveMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3200);
  });

  document.getElementById('resetBtn').addEventListener('click', async () => {
    if (!confirm('Restaurar todo o conteúdo para o padrão? Isso muda o site para todo mundo.')) return;
    dados = structuredClone(CONTEUDO_PADRAO);
    if (!(await salvarConteudo(dados))) alert('Não deu pra restaurar. Verifique a internet e tente de novo.');
    preencherFormulario();
  });

  /* Entra direto se já existe uma sessão logada neste aparelho (precisa vir por último:
     depende de preencherFormulario e das funções de renderização acima). */
  if (supabaseCliente){
    supabaseCliente.auth.getSession().then(({ data }) => {
      if (data.session) entrarNoPainel();
    });
  }
})();
