// Checkout Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize checkout functionality
  initCheckout();
});

function initCheckout() {
  // Form validation
  setupFormValidation();

  // Coupon functionality
  setupCouponSystem();

  // Place order functionality
  setupPlaceOrder();

  // Form field interactions
  setupFormInteractions();
}

function setupFormValidation() {
  const form = document.querySelector(".billing-form");
  const inputs = form.querySelectorAll("input, select, textarea");

  inputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearFieldError);
  });

  form.addEventListener("submit", handleFormSubmit);
}

function validateField(event) {
  const field = event.target;
  const value = field.value.trim();
  const fieldName = field.name;

  // Remove existing error styling
  field.classList.remove("error");

  // Check if field is required
  if (field.hasAttribute("required") && !value) {
    showFieldError(field, `${getFieldLabel(field)} is required`);
    return false;
  }

  // Specific validation rules
  switch (fieldName) {
    case "email":
      if (value && !isValidEmail(value)) {
        showFieldError(field, "Please enter a valid email address");
        return false;
      }
      break;
    case "phone":
      if (value && !isValidPhone(value)) {
        showFieldError(field, "Please enter a valid phone number");
        return false;
      }
      break;
    case "postcode":
      if (value && !isValidPostcode(value)) {
        showFieldError(field, "Please enter a valid postcode");
        return false;
      }
      break;
  }

  return true;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
}

function isValidPostcode(postcode) {
  const postcodeRegex = /^[0-9A-Za-z\s\-]{3,10}$/;
  return postcodeRegex.test(postcode);
}

function showFieldError(field, message) {
  field.classList.add("error");

  // Remove existing error message
  const existingError = field.parentNode.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  // Create error message
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message";
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 0.8rem;
        margin-top: 0.25rem;
        font-weight: 500;
    `;

  field.parentNode.appendChild(errorDiv);
}

function clearFieldError(event) {
  const field = event.target;
  field.classList.remove("error");

  const errorMessage = field.parentNode.querySelector(".error-message");
  if (errorMessage) {
    errorMessage.remove();
  }
}

function getFieldLabel(field) {
  const label = field.parentNode.querySelector("label");
  return label ? label.textContent.replace(" *", "") : "This field";
}

function handleFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const inputs = form.querySelectorAll("input, select, textarea");
  let isValid = true;

  // Validate all fields
  inputs.forEach((input) => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });

  if (isValid) {
    // Form is valid, proceed with order
    processOrder();
  } else {
    // Show error message
    showMessage("Please fill in all required fields correctly", "error");

    // Scroll to first error
    const firstError = form.querySelector(".error");
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
}

function setupCouponSystem() {
  const couponLink = document.querySelector(".coupon-link");
  const couponBanner = document.querySelector(".coupon-banner");

  couponLink.addEventListener("click", function (event) {
    event.preventDefault();

    // Create coupon input form
    const couponForm = document.createElement("div");
    couponForm.className = "coupon-form";
    couponForm.innerHTML = `
            <div class="coupon-input-group">
                <input type="text" placeholder="Enter coupon code" class="coupon-code-input">
                <button type="button" class="apply-coupon-btn">Apply</button>
            </div>
            <button type="button" class="close-coupon-btn">×</button>
        `;

    // Style the coupon form
    couponForm.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
        `;

    const couponInput = couponForm.querySelector(".coupon-code-input");
    couponInput.style.cssText = `
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.9rem;
        `;

    const applyBtn = couponForm.querySelector(".apply-coupon-btn");
    applyBtn.style.cssText = `
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            font-size: 0.9rem;
            cursor: pointer;
        `;

    const closeBtn = couponForm.querySelector(".close-coupon-btn");
    closeBtn.style.cssText = `
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

    // Add event listeners
    applyBtn.addEventListener("click", applyCoupon);
    closeBtn.addEventListener("click", closeCouponForm);

    // Replace banner content
    couponBanner.innerHTML = "";
    couponBanner.appendChild(couponForm);
  });
}

function applyCoupon() {
  const couponInput = document.querySelector(".coupon-code-input");
  const couponCode = couponInput.value.trim();

  if (!couponCode) {
    showMessage("Please enter a coupon code", "error");
    return;
  }

  // Simulate coupon validation
  const applyBtn = document.querySelector(".apply-coupon-btn");
  const originalText = applyBtn.textContent;
  applyBtn.textContent = "Applying...";
  applyBtn.disabled = true;

  setTimeout(() => {
    if (couponCode.toLowerCase() === "discount10") {
      showMessage("Coupon applied! 10% discount added.", "success");
      applyDiscount(10);
      closeCouponForm();
    } else {
      showMessage("Invalid coupon code. Please try again.", "error");
    }

    applyBtn.textContent = originalText;
    applyBtn.disabled = false;
  }, 1000);
}

function applyDiscount(percentage) {
  const subtotalElement = document.querySelector(
    ".order-row.subtotal span:last-child"
  );
  const totalElement = document.querySelector(
    ".order-row.total span:last-child"
  );

  if (subtotalElement && totalElement) {
    const subtotal = parseFloat(
      subtotalElement.textContent.replace(" EGP", "").replace(",", "")
    );
    const discount = subtotal * (percentage / 100);
    const discountedTotal = subtotal - discount;

    // Add discount row
    const orderTable = document.querySelector(".order-table");
    const totalRow = orderTable.querySelector(".order-row.total");

    const discountRow = document.createElement("div");
    discountRow.className = "order-row discount";
    discountRow.innerHTML = `
            <span>Discount (${percentage}%)</span>
            <span>-${discount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })} EGP</span>
        `;

    // Style discount row
    discountRow.style.cssText = `
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 500;
            color: #28a745;
        `;

    orderTable.insertBefore(discountRow, totalRow);

    // Update total
    totalElement.textContent =
      discountedTotal.toLocaleString("en-US", { minimumFractionDigits: 2 }) +
      " EGP";
  }
}

function closeCouponForm() {
  const couponBanner = document.querySelector(".coupon-banner");
  couponBanner.innerHTML = `
        <p>Have a coupon? <a href="#" class="coupon-link">Click here to enter your code</a></p>
    `;

  // Reattach event listener
  const couponLink = couponBanner.querySelector(".coupon-link");
  couponLink.addEventListener("click", function (event) {
    event.preventDefault();
    setupCouponSystem();
  });
}

function setupPlaceOrder() {
  const placeOrderBtn = document.querySelector(".place-order-btn");

  placeOrderBtn.addEventListener("click", function () {
    // Validate form first
    const form = document.querySelector(".billing-form");
    const inputs = form.querySelectorAll("input, select, textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateField({ target: input })) {
        isValid = false;
      }
    });

    if (!isValid) {
      showMessage("Please fill in all required fields correctly", "error");
      return;
    }

    // Process order
    processOrder();
  });
}

function processOrder() {
  const placeOrderBtn = document.querySelector(".place-order-btn");
  const originalText = placeOrderBtn.textContent;

  // Show loading state
  placeOrderBtn.classList.add("loading");
  placeOrderBtn.textContent = "Processing...";
  placeOrderBtn.disabled = true;

  // Simulate order processing
  setTimeout(() => {
    showMessage(
      "Order placed successfully! Redirecting to confirmation...",
      "success"
    );

    // In a real application, this would redirect to a confirmation page
    // window.location.href = 'order-confirmation.html';

    setTimeout(() => {
      placeOrderBtn.classList.remove("loading");
      placeOrderBtn.textContent = originalText;
      placeOrderBtn.disabled = false;
    }, 2000);
  }, 2000);
}

function setupFormInteractions() {
  // Auto-format phone number
  const phoneInput = document.querySelector("#phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 0) {
        if (value.length <= 3) {
          value = value;
        } else if (value.length <= 6) {
          value = value.slice(0, 3) + "-" + value.slice(3);
        } else {
          value =
            value.slice(0, 3) +
            "-" +
            value.slice(3, 6) +
            "-" +
            value.slice(6, 10);
        }
      }
      e.target.value = value;
    });
  }

  // Auto-format postcode
  const postcodeInput = document.querySelector("#postcode");
  if (postcodeInput) {
    postcodeInput.addEventListener("input", function (e) {
      let value = e.target.value.toUpperCase();
      e.target.value = value;
    });
  }
}

function showMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector(".checkout-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `checkout-message ${type}`;
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
        max-width: 300px;
    `;

  if (type === "success") {
    messageDiv.style.background = "#28a745";
  } else if (type === "error") {
    messageDiv.style.background = "#dc3545";
  }

  document.body.appendChild(messageDiv);

  // Remove message after 4 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease";
    setTimeout(() => {
      messageDiv.remove();
    }, 300);
  }, 4000);
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
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
    }
    
    .coupon-input-group {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
    
    .apply-coupon-btn:hover {
        background: #c82333 !important;
    }
    
    .close-coupon-btn:hover {
        color: #333 !important;
    }
`;
document.head.appendChild(style);
