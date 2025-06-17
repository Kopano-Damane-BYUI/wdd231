// products.mjs - Products page logic: fetch, filter, currency conversion, modal, discounts, add-to-cart

const productGrid = document.getElementById("productGrid");
const purposeFilter = document.getElementById("purposeFilter");
const currencySelect = document.getElementById("currencySelect");
const studentDiscountToggle = document.getElementById("studentDiscountToggle");
const modalOverlay = document.querySelector(".modal-overlay");
const modal = modalOverlay.querySelector(".modal");

let products = [];
let filteredProducts = [];
let currentCurrency = "USD";
let exchangeRates = {
  USD: 1,
  ZAR: 18,
  EUR: 0.9,
};

const STUDENT_DISCOUNT_RATE = 0.1; // 10%

// Load currency and student discount from localStorage
function loadPreferences() {
  const storedCurrency = localStorage.getItem("currency");
  if (storedCurrency && exchangeRates[storedCurrency]) {
    currentCurrency = storedCurrency;
  }
  currencySelect.value = currentCurrency;

  const studentDiscount = localStorage.getItem("studentDiscount");
  studentDiscountToggle.checked = studentDiscount === "true";
}

// Save preferences to localStorage
function savePreferences() {
  localStorage.setItem("currency", currentCurrency);
  localStorage.setItem("studentDiscount", studentDiscountToggle.checked);
}

// Fetch products data
async function fetchProducts() {
  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("Failed to fetch products");
    const data = await res.json();
    products = data;
    filteredProducts = [...products];
  } catch (err) {
    productGrid.innerHTML = "<p>Failed to load products. Please try again later.</p>";
  }
}

// Format price with currency conversion and discount
function formatPrice(priceUSD, currency, eligibleForDiscount) {
  let convertedPrice = priceUSD * exchangeRates[currency];
  if (studentDiscountToggle.checked && eligibleForDiscount) {
    convertedPrice = convertedPrice * (1 - STUDENT_DISCOUNT_RATE);
  }
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency,
  }).format(convertedPrice);
}

// Add product to cart stored in localStorage
function addToCart(product) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      currency: currentCurrency,
      image: product.image,
      specs: product.specs,
      quantity: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart item count in UI
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = count;
  }
}

// Create product card
function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute(
    "aria-label",
    `${product.name}, ${product.purpose}, Price: ${formatPrice(
      product.price,
      currentCurrency,
      product.studentDiscountEligible
    )}`
  );

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>Purpose: ${product.purpose}</p>
      <p>Specs: ${product.specs}</p>
      <p class="price">${formatPrice(product.price, currentCurrency, product.studentDiscountEligible)}</p>
      <button class="details-btn" aria-haspopup="dialog" aria-expanded="false" aria-controls="modal">Details</button>
    </div>
  `;

  // Show modal on button click
  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => showModal(product));

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      detailsBtn.click();
    }
  });

  return card;
}

// Render products grid
function renderProducts(productsToRender) {
  productGrid.innerHTML = "";
  if (productsToRender.length === 0) {
    productGrid.innerHTML = "<p>No products match your criteria.</p>";
    return;
  }
  productsToRender.forEach((p) => {
    productGrid.appendChild(createProductCard(p));
  });
}

// Filter products by purpose
function filterProducts() {
  const selectedPurpose = purposeFilter.value;
  if (selectedPurpose === "All") {
    filteredProducts = [...products];
  } else {
    filteredProducts = products.filter((p) => p.purpose === selectedPurpose);
  }
  renderProducts(filteredProducts);
}

// Modal handling
function showModal(product) {
  modal.setAttribute("aria-hidden", "false");
  modalOverlay.style.display = "flex";

  modal.innerHTML = `
    <button class="modal-close" aria-label="Close details">&times;</button>
    <h2 id="modalTitle">${product.name}</h2>
    <img src="${product.image}" alt="${product.name}" loading="lazy" style="max-width: 100%; height: auto;" />
    <p id="modalDesc">Purpose: ${product.purpose}</p>
    <p>Specifications: ${product.specs}</p>
    <p>Price: ${formatPrice(product.price, currentCurrency, product.studentDiscountEligible)}</p>
    <button id="addToCartBtn">Add to Cart</button>
  `;

  const closeBtn = modal.querySelector(".modal-close");
  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Accessibility focus trap could be added here for better UX
  closeBtn.focus();

  // Add to cart functionality
  const addToCartBtn = modal.querySelector("#addToCartBtn");
  addToCartBtn.addEventListener("click", () => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
    closeModal();
  });
}

function closeModal() {
  modalOverlay.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// Initialize page
async function init() {
  loadPreferences();
  await fetchProducts();

  // Support filtering via URL query param like ?purpose=Work
  const urlParams = new URLSearchParams(window.location.search);
  const purposeParam = urlParams.get("purpose");
  if (purposeParam && ["School", "Work", "Programming", "Gaming"].includes(purposeParam)) {
    purposeFilter.value = purposeParam;
  }

  filterProducts();
  updateCartCount();

  // Event listeners
  purposeFilter.addEventListener("change", () => {
    filterProducts();
  });

  currencySelect.addEventListener("change", () => {
    currentCurrency = currencySelect.value;
    savePreferences();
    renderProducts(filteredProducts);
  });

  studentDiscountToggle.addEventListener("change", () => {
    savePreferences();
    renderProducts(filteredProducts);
  });
}

init();
