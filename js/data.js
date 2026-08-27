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
  sobreImagem: 'https://picsum.photos/seed/loja-interior/1000/1250',
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

  novidades: [
    {
      imagem: 'https://picsum.photos/seed/novidade-01/700/540',
      tag: 'Recém-chegada',
      titulo: 'Nova seleção de inverno',
      texto: 'Peças escolhidas a dedo, direto da vitrine para você conferir pessoalmente.'
    },
    {
      imagem: 'https://picsum.photos/seed/novidade-02/700/540',
      tag: 'Últimas unidades',
      titulo: 'Edição limitada',
      texto: 'Quantidade reduzida — sem reposição quando as unidades atuais se esgotarem.'
    },
    {
      imagem: 'https://picsum.photos/seed/novidade-03/700/540',
      tag: 'Em breve',
      titulo: 'Próxima coleção',
      texto: 'Uma prévia do que chega na loja nas próximas semanas.'
    }
  ],

  whatsappNumero: '5541999999999',
  whatsappMensagem: 'Olá! Vi o site e gostaria de saber mais.',
  instagramUsuario: '@nomedaloja',
  instagramUrl: 'https://instagram.com/nomedaloja',
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}
