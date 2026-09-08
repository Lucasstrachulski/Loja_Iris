/* =========================================================
   Conteúdo editável do site.
   A aba Admin (admin.html) sobrescreve estes valores e salva
   no localStorage do navegador, em STORAGE_KEY.
   Isso é um protótipo de front-end: para o conteúdo persistir
   para todas as visitantes (não só no navegador de quem edita),
   essas informações precisam futuramente vir de um backend/CMS.
   ========================================================= */

const STORAGE_KEY = 'loja-site-conteudo-v1';

const CONTEUDO_PADRAO = {
  marca: 'Íris',
  heroTitulo: 'Uma vitrine para <em>peças</em> que contam história',
  heroTexto: 'Seleção exclusiva, escolhida peça a peça. Sem catálogo, sem categorias — só o que vale a pena ver de perto.',

  sobreEyebrow: 'A loja',
  sobreTitulo: 'Curadoria antes de tudo',
  sobreTexto: 'Cada peça que chega até a vitrine passa por uma escolha cuidadosa. Não trabalhamos com estoque parado nem reposição em série — o que você vê é o que existe, em quantidade limitada.',
  sobreGaleria: [
    { imagem: 'img/loja/logo-fachada.jpg', legenda: 'Íris' },
    { imagem: 'img/loja/interior.jpg', legenda: 'Interior da loja' },
    { imagem: 'img/loja/fachada.jpg', legenda: 'Fachada da loja' }
  ],
  sobreLista: [
    'Peças selecionadas, sem reposição automática',
    'Atendimento próximo, com hora marcada',
    'Novidades apresentadas antes de qualquer catálogo'
  ],

  vitrine: [
    { imagem: 'https://picsum.photos/seed/peca-01/900/1200', legenda: 'Coleção atual' },
    { imagem: 'https://picsum.photos/seed/peca-02/900/1200', legenda: 'Peça exclusiva' },
    { imagem: 'https://picsum.photos/seed/peca-03/900/1200', legenda: 'Edição limitada' },
    { imagem: 'https://picsum.photos/seed/peca-04/900/1200', legenda: 'Coleção atual' },
    { imagem: 'https://picsum.photos/seed/peca-05/900/1200', legenda: 'Peça exclusiva' },
    { imagem: 'https://picsum.photos/seed/peca-06/900/1200', legenda: 'Edição limitada' }
  ],

  marcasEyebrow: 'Marcas',
  marcasTitulo: 'Marcas que trabalhamos',
  marcasNota: 'Uma seleção das grifes que passam pela nossa curadoria.',
  marcas: [
    { imagem: 'img/marcas/animale.png', nome: 'Animale' },
    { imagem: 'img/marcas/dudalina.png', nome: 'Dudalina' },
    { imagem: 'img/marcas/cantao.png', nome: 'Cantão' },
    { imagem: 'img/marcas/reserva.png', nome: 'Reserva' },
    { imagem: 'img/marcas/dress-to.png', nome: 'Dress To' },
    { imagem: 'img/marcas/maria-filo.png', nome: 'Maria Filô' },
    { imagem: 'img/marcas/sacada.png', nome: 'Sacada' },
    { imagem: 'img/marcas/shoulder.png', nome: 'Shoulder' },
    { imagem: 'img/marcas/via-tricot.png', nome: 'Via Tricot' },
    { imagem: 'img/marcas/cia-maritima.png', nome: 'Cia. Marítima' },
    { imagem: 'img/marcas/viviane-furrier.png', nome: 'Viviane Furrier' },
    { imagem: 'img/marcas/lado-avesso.png', nome: 'Lado Avesso' },
    { imagem: 'img/marcas/basico-brasil.png', nome: 'Básico Brasil' },
    { imagem: 'img/marcas/borda-barroca.png', nome: 'Borda Barroca' },
    { imagem: 'img/marcas/ambi-por-anselmi.png', nome: 'Ambi por Anselmi' },
    { imagem: 'img/marcas/amarras.png', nome: 'Amarras' },
    { imagem: 'img/marcas/gida.png', nome: 'Gida' },
    { imagem: 'img/marcas/lucidez.png', nome: 'Lucidez' },
    { imagem: 'img/marcas/malise.png', nome: 'Malise' },
    { imagem: 'img/marcas/scalon.png', nome: 'Scalon' },
    { imagem: 'img/marcas/smartbag.jpg', nome: 'Smartbag' },
    { imagem: 'img/marcas/stroke.jpg', nome: 'Stroke' }
  ],

  whatsappNumero: '5542999477512',
  whatsappMensagem: 'Olá! Vi o site e gostaria de saber mais.',
  instagramUsuario: 'irismodamulher',
  instagramUrl: 'https://www.instagram.com/irismodamulher/',
  enderecoLinha1: 'Av. Bonifácio Vilela, 175 — Centro',
  enderecoLinha2: 'Ponta Grossa, PR',
  horario: 'Ter. a sáb., 10h às 19h',
  mapaEmbedUrl: 'https://www.google.com/maps?q=Avenida%20Bonif%C3%A1cio%20Vilela%2C%20175%2C%20Centro%2C%20Ponta%20Grossa%2C%20PR&output=embed'
};

function carregarConteudo(){
  try{
    const salvo = localStorage.getItem(STORAGE_KEY);
    if(!salvo) return structuredClone(CONTEUDO_PADRAO);
    const dados = JSON.parse(salvo);
    return { ...structuredClone(CONTEUDO_PADRAO), ...dados };
  }catch(e){
    console.error('Não foi possível carregar o conteúdo salvo, usando o padrão.', e);
    return structuredClone(CONTEUDO_PADRAO);
  }
}

function salvarConteudo(dados){
  try{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
    return true;
  }catch(e){
    console.error('Não foi possível salvar: armazenamento do navegador cheio.', e);
    return false;
  }
}
