 // Update the mobile cart count
      function updateMobileCartCount() {
        const currentCart =
          JSON.parse(localStorage.getItem("minercom_cart")) || [];
        const cartCount = currentCart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        const mobileCartBadge = document.querySelector("#mobileCartCount");
        if (mobileCartBadge) {
          mobileCartBadge.textContent = cartCount;
          mobileCartBadge.style.display = cartCount > 0 ? "inline" : "none";
        }
      }

      // Update both cart counts when page loads
      document.addEventListener("DOMContentLoaded", function () {
        updateMobileCartCount();

        // Also update the existing cart count function to update both badges
        const originalUpdateCartCount = window.updateCartCount;
        window.updateCartCount = function () {
          if (originalUpdateCartCount) originalUpdateCartCount();
          updateMobileCartCount();
        };
      });