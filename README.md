# Vitrine digital — projeto de front-end

Protótipo completo de front-end feito a partir da fala da dona da loja (PDF anexado).

## Arquivos

```
index.html      site público (a vitrine)
admin.html      aba administrativa para a dona editar o conteúdo
css/
  styles.css    todo o visual do site
js/
  script.js     comportamento do site público (menu, efeito de cortina na vitrine, lightbox, WhatsApp/Instagram)
  admin.js      lógica do painel administrativo
  data.js       conteúdo do site (textos, fotos, contatos) em um único lugar, editável pelo painel
img/            logo e ícone da marca (versões preta e branca)
design/         arquivos originais da logo (.ai/.pdf/.png, em LOGO.zip)
```

Para visualizar: abra `index.html` em qualquer navegador. Não depende de servidor, banco de dados ou instalação — é front-end puro (HTML, CSS e JavaScript).

## Como cada pedido da dona foi atendido

| Pedido da dona | Como foi resolvido |
|---|---|
| Não vende online, tem só vitrine | Site 100% de exposição: fotos, textos, contato — sem carrinho, sem checkout |
| Não tem estoque fixo | Seção "Vitrine" mostra peças em destaque no momento, editável a qualquer hora pelo painel |
| Sistema mais atual | Site novo, responsivo, com tipografia e identidade próprias (não é um template genérico) |
| Não por categoria, vitrine de verdade | Galeria única em grade (sem menus de categoria), com efeito de "cortina" abrindo peça por peça |
| Mais um site com front-end | Projeto 100% front-end — sem loja/carrinho por trás |
| Layout simples, sem muitas abas | Menu com só 5 seções: Vitrine, Sobre, Novidades, Localização, Contato |
| Trocar as imagens do site | Todas as imagens (capa, sobre, vitrine, novidades) ficam em campos editáveis no painel |
| Domínio próprio | Site é estático — pode ser publicado em qualquer hospedagem e apontado para o domínio BR que ela já tem registrado |
| Botão do WhatsApp direto | Botão flutuante fixo + botão na seção de contato, ambos abrindo o WhatsApp da loja com mensagem pronta |
| Arroba do Instagram clicável | Botão que leva direto ao perfil do Instagram |
| Sem forma de pagamento no site | Não existe nenhuma tela ou menção a pagamento |
| Sem barra de procura | Não há campo de busca em lugar nenhum do site |
| Foto da loja, marca, contatos, localização, novidades | Todas essas seções existem: Sobre (foto+texto), Vitrine, Novidades, Localização (endereço, horário, mapa), Contato |
| Aba de admin para ela mexer | `admin.html`: painel para editar textos, fotos, WhatsApp, Instagram, endereço e mapa |

## Sobre o painel administrativo (importante)

O painel (`admin.html`) é um **protótipo de front-end**: hoje ele salva as alterações no navegador de quem está editando (localStorage), sem senha real e sem sincronizar entre dispositivos. Ele já mostra pra dona exatamente como vai ser usar (quais campos existem, como adicionar/remover fotos, como salvar). Para colocar em produção — ou seja, ela editar de qualquer computador ou celular e o site mudar para todo mundo — falta ligar esse mesmo painel a um backend simples (um banco de dados pequeno + login de verdade). Se quiser, o próximo passo natural é eu montar essa parte.

## Personalização

Todo o conteúdo de exemplo (nome da loja, textos, fotos, WhatsApp, Instagram, endereço) está em `js/data.js`, no objeto `CONTEUDO_PADRAO` — é só trocar pelos dados reais da loja, ou preencher direto pelo painel administrativo.

As fotos de exemplo vêm de um serviço de imagens aleatórias (picsum.photos) só para visualização — devem ser trocadas pelas fotos reais da loja e da vitrine.
