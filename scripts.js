const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const filterRow = document.getElementById("filterRow");
const toast = document.getElementById("toast");
const cartButton = document.getElementById("cartButton");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const searchInput = document.getElementById("searchInput");

let selectedCategory = "All";
let toastTimer;


// Display products
function displayProducts(productList) {
  productGrid.innerHTML = "";

  if (productList.length === 0) {
    productGrid.innerHTML =
      '<p class="empty-state">No products found. Try another search.</p>';
    return;
  }

  productList.forEach(function (product) {
    const productCard = document.createElement("article");
    productCard.className = "product-card";

    productCard.innerHTML = `
      <div class="product-image-wrap">
        <img class="product-image"
             src="${product.image}"
             alt="${product.name}"
             loading="lazy">
        <span class="product-category">${product.category}</span>
      </div>

      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="product-description">${product.description}</p>

        <div class="product-bottom">
          <span class="product-price">$${product.price.toFixed(2)}</span>

          <button class="add-button" data-product-id="${product.id}">
            <span aria-hidden="true">＋</span> Add to Cart
          </button>
        </div>
      </div>
    `;

    productGrid.appendChild(productCard);
  });
}


// Search and filter products together
function filterProducts() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredProducts = products.filter(function (product) {

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  displayProducts(filteredProducts);
}


// Show notification
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}


// Add product to cart when clicking Add to Cart
productGrid.addEventListener("click", function (event) {
  const addButton = event.target.closest(".add-button");

  if (addButton) {
    const productId = Number(addButton.dataset.productId);
    addToCart(productId);
  }
});


// Filter buttons
filterRow.addEventListener("click", function (event) {
  const filterButton = event.target.closest(".filter-button");

  if (filterButton) {
    selectedCategory = filterButton.dataset.category;

    document.querySelectorAll(".filter-button").forEach(function (button) {
      button.classList.toggle(
        "active",
        button.dataset.category === selectedCategory
      );
    });

    filterProducts();
  }
});


// Search while typing
searchInput.addEventListener("input", function () {
  filterProducts();
});


// Display shopping cart
function displayCart() {
  const cartItems = document.getElementById("cartItems");

  cartItems.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItems.innerHTML =
      '<div class="cart-empty">Your cart is empty. Add something you love!</div>';
  }

  cart.forEach(function (item) {
    const product = products.find(function (product) {
      return product.id === item.id;
    });

    if (!product) return;

    const subtotal = product.price * item.quantity;

    totalItems += item.quantity;
    totalPrice += subtotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}">

      <div>
        <h3>${product.name}</h3>
        <p>Unit price: $${product.price.toFixed(2)}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
      </div>

      <div class="quantity-controls">
        <button data-action="decrease" data-id="${product.id}">−</button>
        <strong>${item.quantity}</strong>
        <button data-action="increase" data-id="${product.id}">+</button>
      </div>

      <button class="remove-button"
              data-action="remove"
              data-id="${product.id}">
        Remove
      </button>
    `;

    cartItems.appendChild(cartItem);
  });

  document.getElementById("totalItems").textContent = totalItems;

  document.getElementById("totalPrice").textContent =
    "$" + totalPrice.toFixed(2);

  cartCount.textContent = totalItems;

  cartButton.setAttribute(
    "aria-label",
    `Shopping cart, ${totalItems} items`
  );
}


// Cart buttons
document.getElementById("cartItems").addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) return;

  const productId = Number(button.dataset.id);
  const action = button.dataset.action;

  if (action === "increase") {
    changeQuantity(productId, 1);
  }

  if (action === "decrease") {
    changeQuantity(productId, -1);
  }

  if (action === "remove") {
    removeFromCart(productId);
  }
});


// Clear cart button
document.getElementById("clearCart").addEventListener("click", function () {
  clearCart();
});


// Cart navigation button
cartButton.addEventListener("click", function () {
  document.getElementById("cart").scrollIntoView({
    behavior: "smooth"
  });
});


// Mobile menu
menuToggle.addEventListener("click", function () {
  const isOpen = navLinks.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.textContent = isOpen ? "✕" : "☰";
});


// Close mobile menu after clicking a link
navLinks.addEventListener("click", function (event) {
  if (event.target.closest("a")) {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }
});


// Current year
document.getElementById("currentYear").textContent =
  new Date().getFullYear();


// Start website
loadCart();
displayProducts(products);
displayCart();