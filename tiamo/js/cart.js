// Cart Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cart functionality
  initCart();
});

function initCart() {
  // Quantity controls
  setupQuantityControls();

  // Remove item functionality
  setupRemoveItem();

  // Update cart button
  setupUpdateCart();

  // Apply coupon button
  setupApplyCoupon();

  // Checkout button
  setupCheckout();
}

function setupQuantityControls() {
  const minusBtns = document.querySelectorAll(".qty-btn.minus");
  const plusBtns = document.querySelectorAll(".qty-btn.plus");
  const qtyInputs = document.querySelectorAll(".qty-input");

  // Minus button functionality
  minusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".qty-input");
      const currentValue = parseInt(input.value);
      if (currentValue > 1) {
        input.value = currentValue - 1;
        updateItemSubtotal(input);
        updateCartTotals();
      }
    });
  });

  // Plus button functionality
  plusBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const input = this.parentNode.querySelector(".qty-input");
      const currentValue = parseInt(input.value);
      input.value = currentValue + 1;
      updateItemSubtotal(input);
      updateCartTotals();
    });
  });

  // Direct input functionality
  qtyInputs.forEach((input) => {
    input.addEventListener("change", function () {
      if (this.value < 1) {
        this.value = 1;
      }
      updateItemSubtotal(this);
      updateCartTotals();
    });
  });
}

function updateItemSubtotal(qtyInput) {
  const cartItem = qtyInput.closest(".cart-item");
  const priceElement = cartItem.querySelector(".col-price");
  const subtotalElement = cartItem.querySelector(".col-subtotal");

  const price = parseFloat(
    priceElement.textContent.replace(" EGP", "").replace(",", "")
  );
  const quantity = parseInt(qtyInput.value);
  const subtotal = price * quantity;

  subtotalElement.textContent =
    subtotal.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " EGP";
}

function updateCartTotals() {
  const subtotals = document.querySelectorAll(".col-subtotal");
  let total = 0;

  subtotals.forEach((subtotal) => {
    const value = parseFloat(
      subtotal.textContent.replace(" EGP", "").replace(",", "")
    );
    total += value;
  });

  // Update subtotal in cart totals
  const cartSubtotal = document.querySelector(
    ".totals-row:not(.total) span:last-child"
  );
  if (cartSubtotal) {
    cartSubtotal.textContent =
      total.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " EGP";
  }

  // Update total in cart totals
  const cartTotal = document.querySelector(".totals-row.total span:last-child");
  if (cartTotal) {
    cartTotal.textContent =
      total.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " EGP";
  }
}

function setupRemoveItem() {
  const removeBtns = document.querySelectorAll(".remove-item");

  removeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const cartItem = this.closest(".cart-item");

      // Add fade out animation
      cartItem.style.transition = "opacity 0.3s ease";
      cartItem.style.opacity = "0";

      setTimeout(() => {
        cartItem.remove();
        updateCartTotals();
        updateCartCount();

        // Check if cart is empty
        const remainingItems = document.querySelectorAll(".cart-item");
        if (remainingItems.length === 0) {
          showEmptyCart();
        }
      }, 300);
    });
  });
}

function showEmptyCart() {
  const cartItems = document.querySelector(".cart-items");
  const emptyMessage = document.createElement("div");
  emptyMessage.className = "empty-cart";
  emptyMessage.innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <h3>Your cart is empty</h3>
            <p>Add some items to get started!</p>
            <a href="shop.html" class="checkout-btn" style="display: inline-block; text-decoration: none; margin-top: 1rem;">Continue Shopping</a>
        </div>
    `;

  cartItems.appendChild(emptyMessage);
}

function updateCartCount() {
  const cartCount = document.querySelector(".cart-count");
  const remainingItems = document.querySelectorAll(".cart-item");
  cartCount.textContent = remainingItems.length;
}

function setupUpdateCart() {
  const updateBtn = document.querySelector(".update-cart-btn");

  updateBtn.addEventListener("click", function () {
    // Show loading state
    const originalText = this.textContent;
    this.textContent = "Updating...";
    this.disabled = true;

    // Simulate update process
    setTimeout(() => {
      this.textContent = "Cart Updated!";
      this.style.background = "#28a745";

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background = "#6c757d";
        this.disabled = false;
      }, 2000);
    }, 1000);
  });
}

function setupApplyCoupon() {
  const applyBtn = document.querySelector(".apply-coupon-btn");
  const couponInput = document.querySelector(".coupon-input");

  applyBtn.addEventListener("click", function () {
    const couponCode = couponInput.value.trim();

    if (!couponCode) {
      showMessage("Please enter a coupon code", "error");
      return;
    }

    // Simulate coupon validation
    this.textContent = "Applying...";
    this.disabled = true;

    setTimeout(() => {
      if (couponCode.toLowerCase() === "discount10") {
        showMessage("Coupon applied! 10% discount added.", "success");
        applyDiscount(10);
      } else {
        showMessage("Invalid coupon code. Please try again.", "error");
      }

      this.textContent = "APPLY COUPON";
      this.disabled = false;
    }, 1000);
  });
}

function applyDiscount(percentage) {
  const subtotals = document.querySelectorAll(".col-subtotal");
  let total = 0;

  subtotals.forEach((subtotal) => {
    const value = parseFloat(
      subtotal.textContent.replace(" EGP", "").replace(",", "")
    );
    total += value;
  });

  const discount = total * (percentage / 100);
  const discountedTotal = total - discount;

  // Update cart totals with discount
  const cartSubtotal = document.querySelector(
    ".totals-row:not(.total) span:last-child"
  );
  if (cartSubtotal) {
    cartSubtotal.textContent =
      total.toLocaleString("en-US", { minimumFractionDigits: 2 }) + " EGP";
  }

  const cartTotal = document.querySelector(".totals-row.total span:last-child");
  if (cartTotal) {
    cartTotal.textContent =
      discountedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 }) +
      " EGP";
  }

  // Add discount row
  const totalsContainer = document.querySelector(".cart-totals");
  const discountRow = document.createElement("div");
  discountRow.className = "totals-row discount";
  discountRow.innerHTML = `
        <span>Discount (${percentage}%)</span>
        <span>-${discount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })} EGP</span>
    `;

  // Insert before total row
  const totalRow = totalsContainer.querySelector(".totals-row.total");
  totalsContainer.insertBefore(discountRow, totalRow);
}

function setupCheckout() {
  const checkoutBtn = document.querySelector(".checkout-btn");

  checkoutBtn.addEventListener("click", function () {
    const remainingItems = document.querySelectorAll(".cart-item");

    if (remainingItems.length === 0) {
      showMessage("Your cart is empty!", "error");
      return;
    }

    // Show loading state
    const originalText = this.textContent;
    this.textContent = "Processing...";
    this.disabled = true;

    // Simulate checkout process
    setTimeout(() => {
      showMessage("Redirecting to checkout...", "success");
      // In a real application, this would redirect to a checkout page
      // window.location.href = 'checkout.html';

      setTimeout(() => {
        this.textContent = originalText;
        this.disabled = false;
      }, 2000);
    }, 1500);
  });
}

function showMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector(".cart-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `cart-message ${type}`;
  messageDiv.textContent = message;

  // Style the message
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 4px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

  if (type === "success") {
    messageDiv.style.background = "#28a745";
  } else if (type === "error") {
    messageDiv.style.background = "#dc3545";
  }

  document.body.appendChild(messageDiv);

  // Remove message after 3 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 3000);
}

// Add CSS animations for messages
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
