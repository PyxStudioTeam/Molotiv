const products = [
  {
    id: "coat-charcoal",
    name: "Пальто прямого кроя",
    category: "outerwear",
    price: 18900,
    image: "assets/product-coat.png",
    width: 1122,
    height: 1402,
    alt: "Модель в графитовом пальто прямого кроя и белой блузе",
    colors: [
      { name: "Графит", value: "oklch(0.22 0.006 240)" },
      { name: "Молочный", value: "oklch(0.88 0.012 83)" },
      { name: "Тауп", value: "oklch(0.55 0.02 70)" }
    ],
    sizes: ["42", "44", "46", "48", "50", "52"],
    line: "Шерсть с мягкой фактурой, посадка свободная.",
    composition: "70% шерсть, 20% вискоза, 10% полиамид"
  },
  {
    id: "knit-milk",
    name: "Кардиган и юбка из трикотажа",
    category: "knitwear",
    price: 14600,
    image: "assets/product-knit.png",
    width: 1122,
    height: 1402,
    alt: "Модель в молочном кардигане и трикотажной юбке",
    colors: [
      { name: "Молочный", value: "oklch(0.91 0.014 85)" },
      { name: "Овсяный", value: "oklch(0.78 0.025 75)" },
      { name: "Серый", value: "oklch(0.62 0.01 240)" }
    ],
    sizes: ["42", "44", "46", "48", "50"],
    line: "Комплект держит форму и подходит для спокойного повседневного образа.",
    composition: "48% шерсть, 32% хлопок, 20% полиамид"
  },
  {
    id: "dress-navy",
    name: "Платье миди с поясом",
    category: "dresses",
    price: 12900,
    image: "assets/product-dress.png",
    width: 1122,
    height: 1402,
    alt: "Модель в тёмно-синем платье миди с поясом",
    colors: [
      { name: "Глубокий синий", value: "oklch(0.25 0.055 250)" },
      { name: "Чёрный", value: "oklch(0.16 0.002 240)" },
      { name: "Стальной", value: "oklch(0.58 0.01 240)" }
    ],
    sizes: ["42", "44", "46", "48", "50", "52", "54"],
    line: "Закрытая линия плеча, мягкая талия, длина ниже колена.",
    composition: "62% вискоза, 35% полиэстер, 3% эластан"
  },
  {
    id: "suit-grey",
    name: "Костюм с прямыми брюками",
    category: "suits",
    price: 22400,
    image: "assets/product-suit.png",
    width: 1122,
    height: 1402,
    alt: "Модель в сером брючном костюме и светлом топе",
    colors: [
      { name: "Холодный серый", value: "oklch(0.57 0.012 245)" },
      { name: "Графит", value: "oklch(0.26 0.008 240)" },
      { name: "Какао", value: "oklch(0.48 0.028 60)" }
    ],
    sizes: ["42", "44", "46", "48", "50"],
    line: "Жакет без лишнего объёма и брюки полной длины.",
    composition: "64% вискоза, 32% полиэстер, 4% эластан"
  },
  {
    id: "blouse-ivory",
    name: "Блуза из шелковистой ткани",
    category: "suits",
    price: 7900,
    image: "assets/product-blouse.png",
    width: 1003,
    height: 1568,
    alt: "Модель в светлой блузе и прямых чёрных брюках",
    colors: [
      { name: "Айвори", value: "oklch(0.92 0.012 88)" },
      { name: "Чёрный", value: "oklch(0.15 0.002 240)" },
      { name: "Лёд", value: "oklch(0.9 0.012 230)" }
    ],
    sizes: ["42", "44", "46", "48", "50", "52"],
    line: "Базовая блуза под жакет, пальто или самостоятельный образ.",
    composition: "55% вискоза, 45% полиэстер"
  }
];

const categoryNames = {
  all: "Все",
  outerwear: "Пальто",
  knitwear: "Трикотаж",
  dresses: "Платья",
  suits: "Костюмы"
};

const state = {
  filter: "all",
  search: "",
  favorites: new Set(),
  cart: [],
  activeProduct: null,
  activeColor: null,
  activeSize: null
};

const grid = document.querySelector("[data-product-grid]");
const emptyState = document.querySelector("[data-empty-state]");
const inlineSearch = document.querySelector("[data-inline-search]");
const globalSearch = document.querySelector("[data-global-search]");
const searchResults = document.querySelector("[data-search-results]");
const cartLayer = document.querySelector("[data-cart-layer]");
const productLayer = document.querySelector("[data-product-layer]");
const searchLayer = document.querySelector("[data-search-layer]");
const menuLayer = document.querySelector("[data-mobile-menu]");
const productDetail = document.querySelector("[data-product-detail]");
const cartItems = document.querySelector("[data-cart-items]");
const cartTotal = document.querySelector("[data-cart-total]");
const formStatus = document.querySelector("[data-form-status]");

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

function getVisibleProducts() {
  const query = state.search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = state.filter === "all" || product.category === state.filter;
    const text = [
      product.name,
      categoryNames[product.category],
      product.line,
      product.colors.map((color) => color.name).join(" "),
      product.sizes.join(" ")
    ].join(" ").toLowerCase();
    return matchesCategory && (!query || text.includes(query));
  });
}

function renderProducts() {
  const list = getVisibleProducts();
  grid.innerHTML = list.map((product) => productCard(product)).join("");
  emptyState.hidden = list.length > 0;
  updateCounts();
}

function productCard(product) {
  const isFavorite = state.favorites.has(product.id);
  return `
    <article class="product-card reveal is-visible" data-product-card="${product.id}">
      <div class="product-media">
        <img src="${product.image}" width="${product.width}" height="${product.height}" alt="${product.alt}" loading="lazy" decoding="async">
        <button class="favorite-button ${isFavorite ? "is-active" : ""}" type="button" data-toggle-favorite="${product.id}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? "Убрать из избранного" : "Добавить в избранное"}">
          ${isFavorite ? "В избранном" : "В избранное"}
        </button>
        <button class="quick-button" type="button" data-open-product="${product.id}">Быстрый просмотр</button>
      </div>
      <div class="product-info">
        <div class="product-title-row">
          <h3>${product.name}</h3>
          <span class="price">${money(product.price)}</span>
        </div>
        <div class="product-meta">${categoryNames[product.category]} / ${product.line}</div>
        <div class="swatches" aria-label="Цвета">
          ${product.colors.map((color) => `<span class="swatch" style="--swatch: ${color.value}" title="${color.name}"></span>`).join("")}
        </div>
        <div class="sizes" aria-label="Размеры">
          ${product.sizes.slice(0, 6).map((size) => `<span class="size-pill">${size}</span>`).join("")}
        </div>
        <button class="product-link-button" type="button" data-open-product="${product.id}">Смотреть</button>
      </div>
    </article>
  `;
}

function updateCounts() {
  const cartCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((node) => {
    node.textContent = cartCount;
  });
  document.querySelectorAll("[data-fav-count]").forEach((node) => {
    node.textContent = state.favorites.size;
  });
}

function setFilter(nextFilter) {
  state.filter = nextFilter;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === nextFilter);
  });
  renderProducts();
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
  } else {
    state.favorites.add(id);
  }
  renderProducts();
  renderSearchResults(globalSearch?.value || "");
}

function openProduct(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  state.activeProduct = product;
  state.activeColor = product.colors[0].name;
  state.activeSize = product.sizes[0];
  renderProductDetail();
  openLayer(productLayer);
}

function renderProductDetail() {
  const product = state.activeProduct;
  if (!product) return;

  productDetail.innerHTML = `
    <article class="product-detail">
      <div class="product-detail-image">
        <img src="${product.image}" width="${product.width}" height="${product.height}" alt="${product.alt}" decoding="async">
      </div>
      <div class="detail-copy">
        <h2>${product.name}</h2>
        <div class="detail-price">${money(product.price)}</div>
        <p>${product.line}</p>
        <p><strong>Состав:</strong> ${product.composition}</p>

        <fieldset class="option-group">
          <legend>Цвет</legend>
          <div class="option-row">
            ${product.colors.map((color) => `
              <button class="color-button ${state.activeColor === color.name ? "is-selected" : ""}" type="button" data-select-color="${color.name}" style="--swatch: ${color.value}" aria-pressed="${state.activeColor === color.name}">
                ${color.name}
              </button>
            `).join("")}
          </div>
        </fieldset>

        <fieldset class="option-group">
          <legend>Размер</legend>
          <div class="option-row">
            ${product.sizes.map((size) => `
              <button class="size-button ${state.activeSize === size ? "is-selected" : ""}" type="button" data-select-size="${size}" aria-pressed="${state.activeSize === size}">
                ${size}
              </button>
            `).join("")}
          </div>
        </fieldset>

        <div class="size-guide">
          Размерная сетка: 42 - грудь 84-88, 44 - 88-92, 46 - 92-96, 48 - 96-100, 50 - 100-104, 52 - 104-108.
        </div>

        <button class="add-button" type="button" data-add-active>Добавить в корзину</button>
      </div>
    </article>
  `;
}

function addActiveProduct() {
  const product = state.activeProduct;
  if (!product || !state.activeColor || !state.activeSize) return;
  const key = `${product.id}-${state.activeColor}-${state.activeSize}`;
  const existing = state.cart.find((item) => item.key === key);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      key,
      productId: product.id,
      color: state.activeColor,
      size: state.activeSize,
      qty: 1
    });
  }
  renderCart();
  updateCounts();
  closeLayer(productLayer);
  openLayer(cartLayer);
}

function renderCart() {
  if (!state.cart.length) {
    cartItems.innerHTML = `<p class="cart-empty">Корзина пока пустая. Добавьте товар из каталога.</p>`;
  } else {
    cartItems.innerHTML = state.cart.map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return `
        <article class="cart-item">
          <img src="${product.image}" width="${product.width}" height="${product.height}" alt="${product.alt}" loading="lazy" decoding="async">
          <div>
            <h3>${product.name}</h3>
            <p>${item.color} / размер ${item.size}</p>
            <div class="quantity" aria-label="Количество">
              <button type="button" data-decrease="${item.key}" aria-label="Уменьшить количество">-</button>
              <span>${item.qty}</span>
              <button type="button" data-increase="${item.key}" aria-label="Увеличить количество">+</button>
              <button class="remove-button" type="button" data-remove="${item.key}">Удалить</button>
            </div>
          </div>
          <strong>${money(product.price * item.qty)}</strong>
        </article>
      `;
    }).join("");
  }

  cartTotal.textContent = money(
    state.cart.reduce((sum, item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return sum + product.price * item.qty;
    }, 0)
  );
}

function changeQuantity(key, delta) {
  const item = state.cart.find((entry) => entry.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    state.cart = state.cart.filter((entry) => entry.key !== key);
  }
  renderCart();
  updateCounts();
}

function removeItem(key) {
  state.cart = state.cart.filter((entry) => entry.key !== key);
  renderCart();
  updateCounts();
}

function openLayer(layer) {
  if (!layer) return;
  layer.classList.add("is-open");
  layer.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  const focusTarget = layer.querySelector("button, input, a");
  if (focusTarget) focusTarget.focus({ preventScroll: true });
}

function closeLayer(layer) {
  if (!layer) return;
  layer.classList.remove("is-open");
  layer.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".is-open.mobile-menu, .is-open.search-layer, .is-open.product-layer, .is-open.cart-layer")) {
    document.body.classList.remove("is-locked");
  }
}

function renderSearchResults(query) {
  const clean = query.trim().toLowerCase();
  const results = products.filter((product) => {
    const text = `${product.name} ${product.line} ${categoryNames[product.category]} ${product.sizes.join(" ")}`.toLowerCase();
    return !clean || text.includes(clean);
  });
  searchResults.innerHTML = results.length
    ? results.map((product) => `
      <button class="search-result" type="button" data-open-product="${product.id}">
        <span>${product.name}</span>
        <strong>${money(product.price)}</strong>
      </button>
    `).join("")
    : `<p class="cart-empty">По такому запросу товаров не найдено.</p>`;
}

function showFavorites() {
  if (state.favorites.size === 0) {
    state.search = "";
    state.filter = "all";
    inlineSearch.value = "";
    setFilter("all");
    openLayer(searchLayer);
    searchResults.innerHTML = `<p class="cart-empty">В избранном пока пусто. Отметьте товары в каталоге.</p>`;
    return;
  }

  const favoriteProducts = products.filter((product) => state.favorites.has(product.id));
  openLayer(searchLayer);
  searchResults.innerHTML = favoriteProducts.map((product) => `
    <button class="search-result" type="button" data-open-product="${product.id}">
      <span>${product.name}</span>
      <strong>${money(product.price)}</strong>
    </button>
  `).join("");
}

document.addEventListener("click", (event) => {
  const target = event.target;
  const filterButton = target.closest("[data-filter]");
  const openProductButton = target.closest("[data-open-product]");
  const favoriteButton = target.closest("[data-toggle-favorite]");
  const categoryShortcut = target.closest("[data-category-shortcut]");

  if (filterButton) {
    setFilter(filterButton.dataset.filter);
  }

  if (openProductButton) {
    openProduct(openProductButton.dataset.openProduct);
  }

  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.toggleFavorite);
  }

  if (categoryShortcut) {
    setFilter(categoryShortcut.dataset.categoryShortcut);
  }

  if (target.closest("[data-open-cart]")) {
    renderCart();
    openLayer(cartLayer);
  }

  if (target.closest("[data-close-cart]")) {
    closeLayer(cartLayer);
  }

  if (target.closest("[data-open-search]")) {
    openLayer(searchLayer);
    renderSearchResults(globalSearch.value);
  }

  if (target.closest("[data-close-search]")) {
    closeLayer(searchLayer);
  }

  if (target.closest("[data-close-product]")) {
    closeLayer(productLayer);
  }

  if (target.closest("[data-open-menu]")) {
    openLayer(menuLayer);
  }

  if (target.closest("[data-close-menu]") || target.closest("[data-menu-link]")) {
    closeLayer(menuLayer);
  }

  if (target.closest("[data-show-favorites]")) {
    showFavorites();
  }

  const colorButton = target.closest("[data-select-color]");
  if (colorButton) {
    state.activeColor = colorButton.dataset.selectColor;
    renderProductDetail();
  }

  const sizeButton = target.closest("[data-select-size]");
  if (sizeButton) {
    state.activeSize = sizeButton.dataset.selectSize;
    renderProductDetail();
  }

  if (target.closest("[data-add-active]")) {
    addActiveProduct();
  }

  const increaseButton = target.closest("[data-increase]");
  if (increaseButton) {
    changeQuantity(increaseButton.dataset.increase, 1);
  }

  const decreaseButton = target.closest("[data-decrease]");
  if (decreaseButton) {
    changeQuantity(decreaseButton.dataset.decrease, -1);
  }

  const removeButton = target.closest("[data-remove]");
  if (removeButton) {
    removeItem(removeButton.dataset.remove);
  }

  if ([cartLayer, productLayer, searchLayer, menuLayer].includes(target)) {
    closeLayer(target);
  }
});

inlineSearch.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

globalSearch.addEventListener("input", (event) => {
  renderSearchResults(event.target.value);
});

document.querySelector("[data-checkout-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.cart.length) {
    formStatus.textContent = "Добавьте товар в корзину перед оформлением.";
    return;
  }
  const form = new FormData(event.currentTarget);
  const delivery = form.get("delivery");
  formStatus.textContent = `Демо-заказ собран. Выбран способ доставки: ${delivery}.`;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  [cartLayer, productLayer, searchLayer, menuLayer].forEach(closeLayer);
});

const header = document.querySelector(".site-header");
const headerObserver = new IntersectionObserver(
  ([entry]) => {
    header.dataset.elevated = entry.isIntersecting ? "false" : "true";
  },
  { threshold: 0.1 }
);
headerObserver.observe(document.querySelector(".hero"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((node) => {
  revealObserver.observe(node);
});

renderProducts();
renderCart();
