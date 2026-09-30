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

O painel (`admin.html`) salva tudo no **Supabase** (plano gratuito): os textos ficam na tabela `site_conteudo` e as fotos no bucket `fotos`. Qualquer alteração feita de qualquer celular ou computador aparece para todo mundo que abre o site. O login é de verdade (e-mail + senha do Supabase Auth), e o banco só aceita alterações de quem está logado.

### Configuração (uma vez só)

1. Crie uma conta em https://supabase.com e um projeto novo (região: São Paulo).
2. Em **SQL Editor → New query**, cole o conteúdo de `supabase/setup.sql` e clique em **Run**.
3. Em **Authentication → Sign In / Providers**, **desligue "Allow new users to sign up"**. Sem isso, qualquer pessoa conseguiria criar uma conta e editar o site.
4. Em **Authentication → Users → Add user → Create new user**, cadastre o e-mail e a senha da dona (marque "Auto Confirm User").
5. Em **Project Settings → API**, copie a *Project URL* e a *anon public key* para `js/config.js`.
6. Faça commit e push. Pronto: ela entra em `admin.html` com esse e-mail e senha.

Se `js/config.js` estiver vazio, o site mostra o conteúdo padrão de `js/data.js` e o painel avisa que ainda não foi ligado.

## Personalização

Todo o conteúdo de exemplo (nome da loja, textos, fotos, WhatsApp, Instagram, endereço) está em `js/data.js`, no objeto `CONTEUDO_PADRAO` — é só trocar pelos dados reais da loja, ou preencher direto pelo painel administrativo.

As fotos de exemplo vêm de um serviço de imagens aleatórias (picsum.photos) só para visualização — devem ser trocadas pelas fotos reais da loja e da vitrine.
