# AGENTS.md

Este repositório é um **mini e-commerce estático** (sem backend) para vender **peças e itens de marcenaria** (produtos físicos) usando **Stripe Payment Links**.

## Público-alvo

- **Marceneiros** e profissionais/entusiastas de marcenaria
- Pessoas que buscam **ferragens, acessórios e peças** para facilitar o trabalho na oficina

## Objetivo

- **Site estático** que funciona **apenas abrindo os arquivos no navegador** (sem servidor local).
- **Visual moderno/profissional**, responsivo (mobile-first), com animações suaves.
- **Checkout** via **Stripe Payment Link** (redirecionamento para URL do Stripe).
- Linguagem e UI voltadas à marcenaria: **clareza, durabilidade, medidas e uso prático**.

## Stack (obrigatório)

- **HTML5**
- **CSS3**
- **JavaScript Vanilla**
- **Bootstrap 5 via CDN**
- **Bootstrap Icons via CDN**

Regras:

- **Sem backend**
- **Sem JS inline** (evitar `onclick`, etc.)
- **Sem CSS inline** (evitar `style=""`)
- Manter código limpo, organizado e fácil de editar

## Estrutura do projeto

Arquivos principais:

- `index.html`: página inicial (hero + **catálogo com vários produtos** + CTA para detalhes)
- `produto/produto.html`: página de detalhes (grid Bootstrap + benefícios + CTA Stripe)
- `style.css`: estilos customizados (aparência premium minimalista, transições, responsividade)
- `script.js`: dados mockados do produto + animações (fade-in/scroll reveal) + transição entre páginas
- `favicon.svg`: favicon simples

Pasta:

- `produto/`: **todos os arquivos de detalhe do produto devem ficar aqui**.

## Navegação e paths (importante)

O site é aberto via `file://...` e precisa funcionar com **caminhos relativos**.

- Da home (`index.html`) para detalhes: `./produto/produto.html`
- Dentro de `produto/produto.html`, assets do root usam `../`:
  - CSS: `../style.css`
  - JS: `../script.js`
  - Favicon: `../favicon.svg`
  - Voltar para home: `../index.html`

Links com transição suave:

- Links internos que devem usar transição possuem `data-nav`

## Produtos (mock)

Produtos (mockados no `script.js`) são exemplos de **peças/itens de marcenaria**.

- O catálogo é renderizado na home via JS (lista `PRODUCTS`).
- A página de detalhe reutiliza o mesmo template e troca o produto pelo parâmetro de URL `?p=<id>`.
- Exemplo: `./produto/produto.html?p=kit-dobradiças-amortecidas`

## Stripe Payment Link (onde trocar)

Em `produto/produto.html`, o botão **“Comprar Agora”** aponta para um placeholder:

- `https://buy.stripe.com/SEU_LINK`

Ao publicar/usar de verdade, substitua esse `href` pelo **Payment Link real** do Stripe.

## Padrões de UI/UX

- Bootstrap para grid/components e utilitários de layout
- CSS custom para “acabamento premium”:
  - bordas arredondadas
  - sombras suaves
  - hover com transições leves
  - fade-in ao carregar
  - sticky navbar
  - footer minimalista
- “Vibe” visual: **madeira/oficina** (tons quentes, sensação artesanal + profissional).

## Boas práticas para agentes

- Não introduzir build tools (Webpack/Vite/etc.). Deve continuar **100% estático**.
- Evite dependências locais (npm/pip). Tudo via CDN ou arquivos do repo.
- Sempre considerar **paths relativos** ao mover/criar arquivos em subpastas.
- Se criar novas páginas de produto/detalhe, coloque em `produto/` e ajuste `data-nav` e caminhos de assets.

