# AGENTS.md

Este repositório é um **mini e-commerce estático** (sem backend) para vender **peças e itens de marcenaria** (produtos físicos) usando **Stripe Payment Links**, sob a marca **Criatto Farm**.

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
- `src/img/logo.jpg`: logo da marca Criatto Farm

Pasta:

- `produto/`: **todos os arquivos de detalhe do produto devem ficar aqui**.
- `src/img/`: imagens e assets visuais da marca

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

## Produtos (fonte de dados)

- O catálogo é renderizado na home via JS (lista `PRODUCTS`).
- A página de detalhe reutiliza o mesmo template e troca o produto pelo parâmetro de URL `?p=<id>`.
- Exemplo: `./produto/produto.html?p=kit-dobradicas-amortecidas`

### Carregamento via `fetch` (sem hardcode)

- Os produtos **não ficam hardcoded** no `script.js`.
- A lista é carregada via `fetch` a partir de `data/products.json` publicado no GitHub (Raw):
  - `https://raw.githubusercontent.com/cearamarceneiro/cearamarceneiro.github.io/refs/heads/main/data/products.json`
- **Sem fallback de dados**: se o `fetch` falhar, a home exibe um aviso de carregamento e não renderiza o catálogo.

## Stripe Payment Link (onde trocar)

Em `produto/produto.html`, o botão **“Comprar Agora”** tem seu `href` definido dinamicamente via JavaScript, utilizando o valor da propriedade `stripe_link` do produto carregado via `fetch` do `data/products.json`.

- O link é configurado na função `hydrateProductDetail()` do `script.js`, que define `href` do elemento com `id="stripeLink"` com `product.stripe_link`.
- Para publicar/usar de verdade, substitua os valores de `stripe_link` no `data/products.json` pelos **Payment Links reais** do Stripe para cada produto.

## Padrões de UI/UX

- Bootstrap para grid/components e utilitários de layout
- CSS custom para “acabamento premium”:
  - bordas arredondadas
  - sombras suaves
  - hover com transições leves
  - fade-in ao carregar
  - sticky navbar
  - footer minimalista
- Logo **Criatto Farm** no navbar como elemento de identidade visual
- "Vibe" visual: **moderno + profissional** (laranja vibrante, branco, preto). Limpo, moderno e com foco em tecnologia.
## Paleta de Cores

Variáveis CSS definidas em `style.css`:

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `--primary` | `#ff6600` | Laranja vibrante (accent principal, conforme logo Criatto Farm) |
| `--primary-2` | `#e55a00` | Laranja escuro (hover/active) |
| `--bg` | `#ffffff` | Branco puro (background) |
| `--panel` | `rgba(255, 255, 255, 0.95)` | Branco translúcido (cards/navbar) |
| `--panel-solid` | `#ffffff` | Branco sólido |
| `--text` | `#1a1a1a` | Preto/cinza muito escuro (texto principal) |
| `--muted` | `#666666` | Cinza médio (texto secundário) |
| `--ring` | `rgba(255, 102, 0, 0.28)` | Laranja com transparência (focus ring) |

**Tema:** Laranja vibrante + branco + preto, baseado na identidade visual da marca Criatto Farm. Design moderno, limpo e profissional com alta legibilidade.
## Boas práticas para agentes

- Não introduzir build tools (Webpack/Vite/etc.). Deve continuar **100% estático**.
- Evite dependências locais (npm/pip). Tudo via CDN ou arquivos do repo.
- Sempre considerar **paths relativos** ao mover/criar arquivos em subpastas.
- Se criar novas páginas de produto/detalhe, coloque em `produto/` e ajuste `data-nav` e caminhos de assets.

