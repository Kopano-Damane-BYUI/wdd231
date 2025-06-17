// home.mjs - Load featured products for index.html

const featuredGrid = document.getElementById("featuredGrid");

async function fetchProducts() {
  try {
    const res = await fetch("data/products.json");
    if (!res.ok) throw new Error("Network response not OK");
    const products = await res.json();
    return products;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

function formatPrice(price, currency) {
  return new Intl.NumberFormat(navigator.language, {
    style: "currency",
    currency,
  }).format(price);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${product.name}, ${product.purpose}, Price: ${formatPrice(product.price, product.currency)}`);

  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" />
    <div class="product-info">
      <h3>${product.name}</h3>
      <p>Purpose: ${product.purpose}</p>
      <p class="price">${formatPrice(product.price, product.currency)}</p>
    </div>
  `;

  card.addEventListener("click", () => {
    window.location.href = `products.html#product-${product.id}`;
  });

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      card.click();
    }
  });

  return card;
}

async function displayFeatured() {
  const products = await fetchProducts();
  const featured = products.filter(p => p.featured);

  if (featured.length === 0) {
    featuredGrid.innerHTML = "<p>No featured products available.</p>";
    return;
  }

  featuredGrid.innerHTML = "";
  featured.forEach(product => {
    const card = createProductCard(product);
    featuredGrid.appendChild(card);
  });
}

displayFeatured();
