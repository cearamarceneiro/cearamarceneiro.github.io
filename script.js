const PRODUCTS_URL =
  'https://raw.githubusercontent.com/cearamarceneiro/cearamarceneiro.github.io/refs/heads/main/data/products.json';

let PRODUCTS = [];
let DEFAULT_PRODUCT_ID = '';

async function loadProductsFromRemote() {
  const res = await fetch(PRODUCTS_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Falha ao buscar products.json (${res.status})`);
  const data = await res.json();
  if (!data || !Array.isArray(data.products)) throw new Error('products.json inválido');

  PRODUCTS = data.products;
  if (typeof data.defaultProductId === 'string' && data.defaultProductId.trim().length > 0) {
    DEFAULT_PRODUCT_ID = data.defaultProductId.trim();
  }

  if (!DEFAULT_PRODUCT_ID) DEFAULT_PRODUCT_ID = PRODUCTS[0]?.id || '';
  if (!PRODUCTS.length || !DEFAULT_PRODUCT_ID) throw new Error('products.json sem produtos');
}

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
function getProductImages(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }
  if (typeof product.image === 'string' && product.image.trim().length > 0) {
    return [product.image];
  }
  return [];
}

function renderProductCarousel(product) {
  const carouselInner = document.querySelector('[data-product-carousel]');
  const indicators = document.querySelector('[data-product-carousel-indicators]');
  const carousel = document.getElementById('productCarousel');
  if (!carouselInner || !carousel || !indicators) return;

  const images = getProductImages(product);
  if (!images.length) {
    carouselInner.innerHTML = '<div class="carousel-item active"><div class="product-media-placeholder text-center py-5">Imagem indisponível</div></div>';
    indicators.innerHTML = '';
    carousel.querySelector('.carousel-control-prev')?.classList.add('d-none');
    carousel.querySelector('.carousel-control-next')?.classList.add('d-none');
    return;
  }

  carouselInner.innerHTML = images
    .map(
      (src, index) => `
        <div class="carousel-item${index === 0 ? ' active' : ''}">
          <img class="d-block w-100 product-img" src="${escapeHtml(src)}" alt="${escapeHtml(product.name)}" loading="lazy" />
        </div>`
    )
    .join('');

  indicators.innerHTML = images
    .map(
      (_, index) => `
        <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="${index}" class="${index === 0 ? 'active' : ''}" aria-current="${index === 0 ? 'true' : 'false'}" aria-label="Imagem ${index + 1}"></button>`
    )
    .join('');

  const controls = [
    carousel.querySelector('.carousel-control-prev'),
    carousel.querySelector('.carousel-control-next')
  ];
  if (images.length <= 1) {
    controls.forEach((ctrl) => ctrl?.classList.add('d-none'));
    indicators.classList.add('d-none');
  } else {
    controls.forEach((ctrl) => ctrl?.classList.remove('d-none'));
    indicators.classList.remove('d-none');
  }
}
function getProductImage(product) {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  return product.image || '';
}

function renderBenefits(product) {
  const list = document.querySelector('[data-product-benefits]');
  if (!list) return;
  if (!product?.benefits?.length) {
    list.innerHTML = '';
    return;
  }
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
  if (!product) return;
  setText('[data-product="name"]', product.name);
  setText('[data-product="price"]', product.price);
  setText('[data-product="shortDescription"]', product.shortDescription);
  setText('[data-product="fullDescription"]', product.fullDescription);
  renderProductCarousel(product);
  renderBenefits(product);

  // Definir o link do Stripe
  const stripeLink = document.getElementById('stripeLink');
  if (stripeLink && product.stripe_link) {
    stripeLink.href = product.stripe_link;
  }
}

function setFooterYear() {
  const year = new Date().getFullYear().toString();
  const node = document.getElementById('year');
  if (node) node.textContent = year;
}

function renderProductsGrid() {
  const grid = document.querySelector('[data-products-grid]');
  if (!grid) return;
  if (!PRODUCTS.length) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning shadow-soft border-0 mb-0 reveal is-visible">
          <div class="fw-semibold mb-1">Não foi possível carregar o catálogo.</div>
          <div class="small text-secondary">
            Verifique sua conexão e se o arquivo <code>data/products.json</code> está acessível.
          </div>
        </div>
      </div>
    `;
    return;
  }

  grid.innerHTML = PRODUCTS.map((p) => {
    const href = `./produto/produto.html?p=${encodeURIComponent(p.id)}`;
    const productImage = getProductImage(p);
    return `
      <div class="col-12 col-sm-6 col-lg-3">
        <div class="card product-card border-0 shadow-soft h-100 reveal" data-href="${href}">
          <div class="card-body p-3 p-sm-4">
            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
              <span class="badge text-bg-${escapeHtml(p.badge?.variant || 'light')} badge-soft">
                <i class="bi ${escapeHtml(p.badge?.icon || 'bi-tag')} me-1"></i>${escapeHtml(p.badge?.text || 'Destaque')}
              </span>
            </div>
            <div class="product-media rounded-4 overflow-hidden mb-3">
              <img class="img-fluid w-100 product-img" src="${escapeHtml(productImage)}" alt="${escapeHtml(p.name)}" loading="lazy" />
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
          </div>
          <div class="card-footer border-0 bg-transparent px-3 px-sm-4 pb-4 pt-0">
            <div class="d-grid">
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
  // Removido: a home não possui produto em destaque.
}

const isProductPage = document.querySelector('[data-product-page]') !== null;

async function init() {
  try {
    await loadProductsFromRemote();
  } catch {
    // Sem fallback de dados: apenas mostra mensagem na UI (home) e mantém a página funcional
  }

  renderProductsGrid();
  if (isProductPage) hydrateProductDetail();

  makeProductCardsClickable();
  setFooterYear();
  setupPageLoadFade();
  setupPageTransitions();
  setupScrollReveal();
}

function makeProductCardsClickable() {
  document.querySelectorAll('.product-card[data-href]').forEach((card) => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (event) => {
      const target = event.target;
      if (target.closest('a')) return;
      const href = card.getAttribute('data-href');
      if (href) window.location.href = href;
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const href = card.getAttribute('data-href');
        if (href) window.location.href = href;
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'link');
  });
}

init();

