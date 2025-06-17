//cart js
const cartItemsContainer = document.getElementById("cartItems");
const emptyCartMsg = document.getElementById("emptyCartMsg");
const cartSummary = document.getElementById("cartSummary");
const cartTotalElem = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

const STUDENT_DISCOUNT_RATE = 0.1; // 10%
let currentCurrency = localStorage.getItem("currency") || "USD";
const studentDiscountEnabled = localStorage.getItem("studentDiscount") === "true";

let exchangeRates = {
  USD: 1,
  ZAR: 18,
  EUR: 0.9,
};

// Format price with currency and discount
function formatPrice(priceUSD, currency) {
  let convertedPrice = priceUSD * exchangeRates[currency];
  if (studentDiscountEnabled) {
    convertedPrice *= (1 - STUDENT_DISCOUNT_RATE);
  }
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency,
  }).format(convertedPrice);
}

// Load cart from localStorage
function loadCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart;
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Render cart items
function renderCart() {
  const cart = loadCart();
  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyCartMsg.style.display = "block";
    cartSummary.style.display = "none";
    return;
  }

  emptyCartMsg.style.display = "none";
  cartSummary.style.display = "block";

  cart.forEach((item, index) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy" width="100" height="auto" />
      <div class="cart-item-details">
        <h3>${item.name}</h3>
        <p>${item.specs}</p>
        <p>Price: ${formatPrice(item.price, currentCurrency)}</p>
        <label>
          Quantity:
          <input type="number" min="1" value="${item.quantity}" aria-label="Quantity for ${item.name}" />
        </label>
        <button class="remove-btn" aria-label="Remove ${item.name} from cart">Remove</button>
      </div>
    `;

    // Quantity change handler
    const qtyInput = itemDiv.querySelector("input[type='number']");
    qtyInput.addEventListener("change", (e) => {
      let newQty = parseInt(e.target.value);
      if (isNaN(newQty) || newQty < 1) {
        newQty = 1;
        e.target.value = 1;
      }
      cart[index].quantity = newQty;
      saveCart(cart);
      updateCartTotal();
    });

    // Remove item handler
    const removeBtn = itemDiv.querySelector(".remove-btn");
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
      renderCart();
      updateCartCount();
    });

    cartItemsContainer.appendChild(itemDiv);
  });

  updateCartTotal();
}

// Calculate and display total
function updateCartTotal() {
  const cart = loadCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalElem.textContent = formatPrice(total, currentCurrency);
}

// Clear cart button
clearCartBtn.addEventListener("click", () => {
  localStorage.removeItem("cart");
  renderCart();
  updateCartCount();
});

// Update cart count in nav (assumes nav has #cartCount span)
function updateCartCount() {
  const cart = loadCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = count;
  }
}

renderCart();
updateCartCount();
