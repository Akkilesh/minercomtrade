// cart.js
document.addEventListener("DOMContentLoaded", () => {
  const cartKey = "minercom_cart";
  const quantityKey = "minercom_quantities";

  // ✅ Get existing cart and quantities
  let cart = JSON.parse(localStorage.getItem(cartKey)) || [];
  let quantities = JSON.parse(localStorage.getItem(quantityKey)) || {};

  console.log("Current cart:", cart);
  console.log("Current quantities:", quantities);

  // ✅ Restore quantities from localStorage
  document.querySelectorAll(".quantity-input").forEach(input => {
    const id = input.dataset.id;
    if (quantities[id]) {
      input.value = quantities[id];
    }
  });

  // --- Handle quantity increment/decrement (Multiples of 25) ---
  document.querySelectorAll(".quantity-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const input = document.querySelector(`.quantity-input[data-id="${id}"]`);
      
      if (!input) {
        console.error("Input not found for ID:", id);
        return;
      }
      
      let qty = parseInt(input.value) || 25; // Default to 25 if invalid
      
      // ✅ Change quantity in multiples of 25
      if (btn.classList.contains("plus")) {
        qty += 25;
      }
      if (btn.classList.contains("minus") && qty > 25) {
        qty -= 25;
      }
      
      // Ensure minimum of 25
      if (qty < 25) {
        qty = 25;
      }
      
      input.value = qty;
      
      // ✅ Save quantity to localStorage
      quantities[id] = qty;
      localStorage.setItem(quantityKey, JSON.stringify(quantities));
    });
  });

  // --- Get a Quote button ---
  document.querySelectorAll(".btn-add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const card = btn.closest(".card");
      
      if (!card) {
        console.error("Product card not found");
        return;
      }
      
      const name = card.querySelector(".product-name")?.textContent.trim() || "Unknown Product";
      const price = card.querySelector(".price")?.textContent.trim() || "$0.00";
      const qtyInput = document.querySelector(`.quantity-input[data-id="${id}"]`);
      let qty = qtyInput ? parseInt(qtyInput.value) : 25;

      // ✅ Ensure quantity is multiple of 25 and at least 25
      if (qty < 25) {
        qty = 25;
      }
      if (qty % 25 !== 0) {
        // Round up to nearest multiple of 25
        qty = Math.ceil(qty / 25) * 25;
      }

      console.log("Adding to cart:", { id, name, price, quantity: qty });

      // Check if item exists in cart already
      const existingIndex = cart.findIndex(item => item.id === id);
      
      if (existingIndex > -1) {
        // ✅ REPLACE the quantity instead of adding to it
        cart[existingIndex].quantity = qty;
        console.log("Updated existing item quantity:", cart[existingIndex]);
      } else {
        // Add new item
        const newItem = { id, name, price, quantity: qty };
        cart.push(newItem);
        console.log("Added new item:", newItem);
      }

      // ✅ Save updated cart
      localStorage.setItem(cartKey, JSON.stringify(cart));
      console.log("Cart saved:", cart);
      
      // ✅ Update cart count immediately after adding item
      updateCartCount();
      showNotification();
    });
  });

  function showNotification() {
    const notif = document.querySelector(".cart-notification");
    if (notif) {
      notif.style.display = "block";
      setTimeout(() => notif.style.display = "none", 1500);
    }
  }

  // ✅ Update cart count on page load
  updateCartCount();
  
  function updateCartCount() {
    // Re-fetch cart from localStorage to ensure we have latest data
    const currentCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    const cartCount = currentCart.reduce((total, item) => total + item.quantity, 0);
    console.log("Cart count:", cartCount);
    
    // Update cart badge if it exists
    const cartBadge = document.querySelector(".cart-badge");
    if (cartBadge) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = cartCount > 0 ? "inline" : "none";
    }
    
    // Update the View Cart link badge
    const viewCartBadge = document.querySelector("#cartCount");
    if (viewCartBadge) {
      viewCartBadge.textContent = cartCount;
      viewCartBadge.style.display = cartCount > 0 ? "inline" : "none";
    }
  }
});