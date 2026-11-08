let cart = [];

// Load cart from LocalStorage
function loadCart() {
  try {
    const savedCart = localStorage.getItem("miniShopCart");

    if (savedCart) {
      const savedItems = JSON.parse(savedCart);

      if (Array.isArray(savedItems)) {
        cart = savedItems.filter(function (item) {
          return products.some(function (product) {
            return product.id === item.id;
          }) &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0;
        });
      }
    }
  } catch (error) {
    cart = [];
  }
}

// Save cart to LocalStorage
function saveCart() {
  localStorage.setItem("miniShopCart", JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId) {
  const selectedProduct = products.find(function (product) {
    return product.id === productId;
  });

  if (!selectedProduct) return;

  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  displayCart();
  showToast(`${selectedProduct.name} added to your cart!`);
}

// Change product quantity
function changeQuantity(productId, amount) {
  const cartItem = cart.find(function (item) {
    return item.id === productId;
  });

  if (!cartItem) return;

  cartItem.quantity += amount;

  if (cartItem.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  displayCart();
}

// Remove product
function removeFromCart(productId) {
  cart = cart.filter(function (item) {
    return item.id !== productId;
  });

  saveCart();
  displayCart();
}

// Clear all products
function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}