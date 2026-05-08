const PRODUCTS = [
  {
    id: 'kit-dobradicas-amortecidas',
    name: 'Kit Dobradiças Amortecidas (35mm)',
    price: 'R$ 89,90',
    shortDescription: 'Fechamento suave e instalação prática em portas.',
    fullDescription:
      'Kit de dobradiças caneco 35mm com amortecimento para portas de armário. Ideal para acabamento profissional e fechamento silencioso.',
    benefits: ['Fechamento suave', 'Caneco 35mm', 'Ajuste fino', 'Alta durabilidade'],
    image:
      'https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&w=1400&q=80',
    badge: { text: 'Frete grátis', icon: 'bi-truck', variant: 'success' },
  },
  {
    id: 'corredica-telescopica-45cm',
    name: 'Corrediça Telescópica 45cm (par)',
    price: 'R$ 59,90',
    shortDescription: 'Abertura suave para gavetas firmes e alinhadas.',
    fullDescription:
      'Par de corrediças telescópicas para gavetas com deslizamento estável. Facilita montagem e aumenta a durabilidade do móvel.',
    benefits: ['Deslizamento suave', 'Aço reforçado', 'Instalação precisa', 'Alta capacidade'],
    image:
      'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1400&q=80',
    badge: { text: 'Mais vendido', icon: 'bi-fire', variant: 'light' },
  },
  {
    id: 'kit-parafusos-chipboard',
    name: 'Kit Parafusos Chipboard (sortido)',
    price: 'R$ 39,90',
    shortDescription: 'Fixação rápida para MDF/MDP e madeira maciça.',
    fullDescription:
      'Kit sortido de parafusos chipboard para montagem de móveis e estruturas. Excelente custo-benefício para o dia a dia da oficina.',
    benefits: ['Rosca agressiva', 'Alta aderência', 'Variedade de medidas', 'Ótimo rendimento'],
    image:
      'https://images.unsplash.com/photo-1582582429416-e4ea9c8f9052?auto=format&fit=crop&w=1400&q=80',
    badge: { text: 'Novo', icon: 'bi-stars', variant: 'light' },
  },
  {
    id: 'lixa-discos-125mm',
    name: 'Lixas Disco 125mm (kit 50)',
    price: 'R$ 49,90',
    shortDescription: 'Acabamento uniforme para projetos profissionais.',
    fullDescription:
      'Kit de lixas em disco 125mm com grãos variados para lixadeira roto-orbital. Ideal para preparo e acabamento de madeira.',
    benefits: ['Grãos variados', 'Boa durabilidade', 'Acabamento uniforme', 'Troca rápida'],
    image:
      'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&w=1400&q=80',
    badge: { text: 'Oficina', icon: 'bi-hammer', variant: 'light' },
  },
];

const DEFAULT_PRODUCT_ID = 'kit-dobradicas-amortecidas';

function getActiveProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('p') || DEFAULT_PRODUCT_ID;
}

function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || PRODUCTS.find((p) => p.id === DEFAULT_PRODUCT_ID);
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    el.textContent = value;
  });
}

function setImage(selector, src, altFallback) {
  document.querySelectorAll(selector).forEach((el) => {
    if (!(el instanceof HTMLImageElement)) return;
    el.src = src;
    if (!el.alt || el.alt.trim().length === 0) el.alt = altFallback;
  });
}

function renderBenefits(product) {
  const list = document.querySelector('[data-product-benefits]');
  if (!list) return;
  list.innerHTML = product.benefits
    .map(
      (b) => `
      <li class="d-flex gap-2 align-items-start">
        <i class="bi bi-check2-circle text-success mt-1"></i>
        <span>${escapeHtml(b)}</span>
      </li>`
    )
    .join('');
}

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isInternalLink(anchor) {
  try {
    const url = new URL(anchor.href, window.location.href);
    return url.origin === window.location.origin;
  } catch {
    return false;
  }
}

function samePageAnchor(anchor) {
  if (!anchor.hash) return false;
  const url = new URL(anchor.href, window.location.href);
  return (
    url.pathname === window.location.pathname &&
    url.search === window.location.search &&
    url.hash.length > 1
  );
}

function shouldIntercept(anchor) {
  if (!anchor) return false;
  if (!isInternalLink(anchor)) return false;
  if (anchor.target && anchor.target !== '_self') return false;
  if (anchor.hasAttribute('download')) return false;
  if (samePageAnchor(anchor)) return false;
  return true;
}

function setupPageLoadFade() {
  const root = document.body;
  requestAnimationFrame(() => {
    root.classList.remove('is-loading');
    root.classList.add('is-loaded');
  });
}

function setupPageTransitions() {
  document.addEventListener('click', (event) => {
    const anchor = event.target?.closest?.('a[data-nav]');
    if (!anchor) return;
    if (!shouldIntercept(anchor)) return;

    event.preventDefault();
    const href = anchor.getAttribute('href');
    if (!href) return;

    document.body.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.href = href;
    }, 180);
  });
}

function setupScrollReveal() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (els.length === 0) return;

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('is-visible'));
  }
}

function hydrateProductDetail() {
  const product = getProductById(getActiveProductId());
  setText('[data-product="name"]', product.name);
  setText('[data-product="price"]', product.price);
  setText('[data-product="shortDescription"]', product.shortDescription);
  setText('[data-product="fullDescription"]', product.fullDescription);
  setImage('[data-product="image"]', product.image, product.name);
  renderBenefits(product);
}

function setFooterYear() {
  const year = new Date().getFullYear().toString();
  const node = document.getElementById('year');
  if (node) node.textContent = year;
}

function renderProductsGrid() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const href = `./produto/produto.html?p=${encodeURIComponent(p.id)}`;
    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card border-0 shadow-soft h-100 reveal">
          <div class="card-body p-3 p-sm-4">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
              <span class="badge text-bg-${escapeHtml(p.badge?.variant || 'light')} badge-soft">
                <i class="bi ${escapeHtml(p.badge?.icon || 'bi-tag')} me-1"></i>${escapeHtml(p.badge?.text || 'Destaque')}
              </span>
            </div>
            <div class="product-media rounded-4 overflow-hidden mb-3">
              <img class="img-fluid w-100 product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
            </div>
            <div class="d-flex align-items-start justify-content-between gap-3">
              <div>
                <div class="fw-semibold mb-1">${escapeHtml(p.name)}</div>
                <div class="text-secondary small">${escapeHtml(p.shortDescription)}</div>
              </div>
              <div class="text-end">
                <div class="fw-bold">${escapeHtml(p.price)}</div>
                <div class="text-secondary small">12x no cartão</div>
              </div>
            </div>
            <div class="d-grid mt-3">
              <a class="btn btn-outline-primary btn-soft" href="${href}" data-nav>
                Ver detalhes <i class="bi bi-arrow-right-short ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function hydrateIndexHeroFeatured() {
  const featured = getProductById(DEFAULT_PRODUCT_ID);
  setText('[data-featured="name"]', featured.name);
  setText('[data-featured="price"]', featured.price);
  setText('[data-featured="shortDescription"]', featured.shortDescription);
  setImage('[data-featured="image"]', featured.image, featured.name);
  document.querySelectorAll('[data-featured-link]').forEach((a) => {
    if (!(a instanceof HTMLAnchorElement)) return;
    a.href = `./produto/produto.html?p=${encodeURIComponent(featured.id)}`;
  });
}

const isProductPage = document.querySelector('[data-product-page]') !== null;

renderProductsGrid();
hydrateIndexHeroFeatured();
if (isProductPage) hydrateProductDetail();
setFooterYear();
setupPageLoadFade();
setupPageTransitions();
setupScrollReveal();

