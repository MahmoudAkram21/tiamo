// Product Page Functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const navUp = document.querySelector(".nav-up");
  const navDown = document.querySelector(".nav-down");
  const thumbnailList = document.querySelector(".thumbnail-list");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const quantityInput = document.getElementById("quantity");
  const qtyMinus = document.querySelector(".qty-minus");
  const qtyPlus = document.querySelector(".qty-plus");
  const addToCartBtn = document.querySelector(".add-to-cart-btn");
  const wishlistLink = document.querySelector(".wishlist-link");
  const compareLink = document.querySelector(".compare-link");
  const zoomBtn = document.querySelector(".zoom-btn");

  // Product Data
  const productData = {
    id: 1,
    name: "Classic wooden chair",
    price: 299.0,
    currency: "EGP",
    images: [
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=600&auto=format&fit=crop",
    ],
    thumbnails: [
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=150&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=150&auto=format&fit=crop",
    ],
  };

  // Initialize product page
  function initializeProductPage() {
    setupImageGallery();
    setupTabs();
    setupQuantitySelector();
    setupProductActions();
    setupZoom();
    updateWishlistState();
  }

  // Image Gallery Functionality
  function setupImageGallery() {
    let currentImageIndex = 0;
    const totalImages = thumbnails.length;

    // Thumbnail click handler
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        updateMainImage(index);
        updateThumbnailStates(index);
        currentImageIndex = index;
      });
    });

    // Navigation arrows
    if (navUp) {
      navUp.addEventListener("click", () => {
        if (currentImageIndex > 0) {
          currentImageIndex--;
          updateMainImage(currentImageIndex);
          updateThumbnailStates(currentImageIndex);
        }
      });
    }

    if (navDown) {
      navDown.addEventListener("click", () => {
        if (currentImageIndex < totalImages - 1) {
          currentImageIndex++;
          updateMainImage(currentImageIndex);
          updateThumbnailStates(currentImageIndex);
        }
      });
    }

    // Update navigation arrow states
    function updateNavArrows() {
      if (navUp) navUp.disabled = currentImageIndex === 0;
      if (navDown) navDown.disabled = currentImageIndex === totalImages - 1;
    }

    // Update main image
    function updateMainImage(index) {
      if (mainImage && productData.images[index]) {
        mainImage.src = productData.images[index];
        mainImage.alt = `${productData.name} - View ${index + 1}`;
      }
      updateNavArrows();
    }

    // Update thumbnail states
    function updateThumbnailStates(activeIndex) {
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle("active", index === activeIndex);
      });
    }

    // Initialize first image
    updateMainImage(0);
    updateThumbnailStates(0);
  }

  // Tabs Functionality
  function setupTabs() {
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        switchTab(targetTab);
      });
    });
  }

  function switchTab(tabName) {
    // Remove active class from all tabs and panes
    tabBtns.forEach((btn) => btn.classList.remove("active"));
    tabPanes.forEach((pane) => pane.classList.remove("active"));

    // Add active class to selected tab and pane
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activePane = document.getElementById(tabName);

    if (activeBtn) activeBtn.classList.add("active");
    if (activePane) activePane.classList.add("active");
  }

  // Quantity Selector Functionality
  function setupQuantitySelector() {
    if (qtyMinus) {
      qtyMinus.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
          quantityInput.value = currentValue - 1;
          updateAddToCartButton();
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 99) {
          quantityInput.value = currentValue + 1;
          updateAddToCartButton();
        }
      });
    }

    if (quantityInput) {
      quantityInput.addEventListener("input", () => {
        let value = parseInt(quantityInput.value);
        if (isNaN(value) || value < 1) {
          value = 1;
        } else if (value > 99) {
          value = 99;
        }
        quantityInput.value = value;
        updateAddToCartButton();
      });
    }
  }

  // Update Add to Cart button text
  function updateAddToCartButton() {
    if (addToCartBtn) {
      const quantity = parseInt(quantityInput.value) || 1;
      const totalPrice = (productData.price * quantity).toFixed(2);
      addToCartBtn.innerHTML = `
                <i class="fa-solid fa-shopping-cart"></i>
                ADD TO CART - ${totalPrice} ${productData.currency}
            `;
    }
  }

  // Product Actions Functionality
  function setupProductActions() {
    // Add to Cart
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", addToCart);
    }

    // Add to Wishlist
    if (wishlistLink) {
      wishlistLink.addEventListener("click", toggleWishlist);
    }

    // Add to Compare
    if (compareLink) {
      compareLink.addEventListener("click", addToCompare);
    }
  }

  // Add to Cart Function
  function addToCart(e) {
    e.preventDefault();
    const quantity = parseInt(quantityInput.value) || 1;

    // Show loading state
    const originalText = addToCartBtn.innerHTML;
    addToCartBtn.innerHTML =
      '<i class="fa-solid fa-spinner fa-spin"></i> ADDING...';
    addToCartBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
      // Update cart count in header
      const cartCount = document.getElementById("cart-count");
      if (cartCount) {
        const currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + quantity;
      }

      // Show success message
      showMessage("Product added to cart successfully!", "success");

      // Reset button
      addToCartBtn.innerHTML = originalText;
      addToCartBtn.disabled = false;

      // Reset quantity
      quantityInput.value = 1;
      updateAddToCartButton();
    }, 1000);
  }

  // Toggle Wishlist Function
  function toggleWishlist(e) {
    e.preventDefault();

    const isInWishlist = wishlistLink.classList.contains("in-wishlist");

    if (isInWishlist) {
      // Remove from wishlist
      wishlistLink.classList.remove("in-wishlist");
      wishlistLink.innerHTML =
        '<i class="fa-regular fa-heart"></i> Add to wishlist';
      showMessage("Product removed from wishlist", "info");
    } else {
      // Add to wishlist
      wishlistLink.classList.add("in-wishlist");
      wishlistLink.innerHTML =
        '<i class="fa-solid fa-heart"></i> Remove from wishlist';
      showMessage("Product added to wishlist", "success");
    }

    // Update header wishlist icon
    updateHeaderWishlistState();
  }

  // Add to Compare Function
  function addToCompare(e) {
    e.preventDefault();

    const isComparing = compareLink.classList.contains("comparing");

    if (isComparing) {
      compareLink.classList.remove("comparing");
      compareLink.innerHTML =
        '<i class="fa-solid fa-right-left"></i> Add to compare';
      showMessage("Product removed from comparison", "info");
    } else {
      compareLink.classList.add("comparing");
      compareLink.innerHTML =
        '<i class="fa-solid fa-right-left"></i> Remove from compare';
      showMessage("Product added to comparison", "success");
    }
  }

  // Update header wishlist state
  function updateHeaderWishlistState() {
    const headerWishlist = document.querySelector(".header .wishlist");
    const isInWishlist = wishlistLink.classList.contains("in-wishlist");

    if (headerWishlist) {
      if (isInWishlist) {
        headerWishlist.innerHTML = '<i class="fa-solid fa-heart"></i>';
        headerWishlist.classList.add("active");
      } else {
        headerWishlist.innerHTML = '<i class="fa-regular fa-heart"></i>';
        headerWishlist.classList.remove("active");
      }
    }
  }

  // Check initial wishlist state
  function updateWishlistState() {
    // Check if product is already in wishlist (from localStorage or API)
    const savedWishlist = localStorage.getItem("tiamoWishlist");
    if (savedWishlist) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        const isInWishlist = wishlistItems.some(
          (item) => item.id === productData.id
        );

        if (isInWishlist) {
          wishlistLink.classList.add("in-wishlist");
          wishlistLink.innerHTML =
            '<i class="fa-solid fa-heart"></i> Remove from wishlist';
          updateHeaderWishlistState();
        }
      } catch (error) {
        console.error("Error parsing wishlist data:", error);
      }
    }
  }

  // Zoom Functionality
  function setupZoom() {
    if (zoomBtn) {
      zoomBtn.addEventListener("click", openZoomView);
    }
  }

  function openZoomView() {
    // Create modal for zoomed image
    const modal = document.createElement("div");
    modal.className = "zoom-modal";
    modal.innerHTML = `
            <div class="zoom-modal-content">
                <button class="zoom-close" aria-label="Close zoom view">
                    <i class="fa-solid fa-times"></i>
                </button>
                <img src="${mainImage.src}" alt="${mainImage.alt}" class="zoomed-image">
            </div>
        `;

    // Add modal to page
    document.body.appendChild(modal);

    // Close modal on click
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".zoom-close")) {
        modal.remove();
      }
    });

    // Close modal on escape key
    document.addEventListener("keydown", function closeOnEscape(e) {
      if (e.key === "Escape") {
        modal.remove();
        document.removeEventListener("keydown", closeOnEscape);
      }
    });

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Re-enable body scroll when modal is removed
    modal.addEventListener("remove", () => {
      document.body.style.overflow = "";
    });
  }

  // Message Display Function
  function showMessage(message, type = "success") {
    // Remove existing messages
    const existingMessage = document.querySelector(".product-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = `product-message ${type}`;

    const icon = type === "success" ? "fa-check-circle" : "fa-info-circle";
    const iconColor = type === "success" ? "#28a745" : "#17a2b8";

    messageElement.innerHTML = `
            <i class="fa-solid ${icon}" style="color: ${iconColor}"></i>
            <span>${message}</span>
        `;

    // Insert after product actions
    const productActions = document.querySelector(".product-actions");
    if (productActions && productActions.parentNode) {
      productActions.parentNode.insertBefore(
        messageElement,
        productActions.nextSibling
      );
    }

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 3000);
  }

  // Social Share Functionality
  function setupSocialSharing() {
    const shareButtons = document.querySelectorAll(".share-btn");

    shareButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const platform = btn.classList.contains("facebook")
          ? "facebook"
          : btn.classList.contains("twitter")
          ? "twitter"
          : btn.classList.contains("pinterest")
          ? "pinterest"
          : "linkedin";

        shareProduct(platform);
      });
    });
  }

  function shareProduct(platform) {
    const url = window.location.href;
    const title = productData.name;
    const description = "Check out this amazing product!";

    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          url
        )}&text=${encodeURIComponent(title)}`;
        break;
      case "pinterest":
        shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
          url
        )}&description=${encodeURIComponent(description)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank", "width=600,height=400");
    }
  }

  // Initialize everything
  initializeProductPage();
  setupSocialSharing();
  updateAddToCartButton();
});

// Add CSS for zoom modal and messages
const style = document.createElement("style");
style.textContent = `
    .zoom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .zoom-modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
    }

    .zoom-close {
        position: absolute;
        top: -40px;
        right: 0;
        background: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #222;
        font-size: 16px;
    }

    .zoomed-image {
        width: 100%;
        height: auto;
        max-height: 90vh;
        object-fit: contain;
    }

    .product-message {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 15px 20px;
        border-radius: 8px;
        margin: 20px 0;
        font-weight: 500;
        animation: slideInDown 0.3s ease;
    }

    .product-message.success {
        background: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .product-message.info {
        background: #d1ecf1;
        color: #0c5460;
        border: 1px solid #bee5eb;
    }

    .product-message i {
        font-size: 16px;
    }

    .wishlist-link.in-wishlist {
        color: #da3c3c;
    }

    .compare-link.comparing {
        color: #da3c3c;
    }

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);
