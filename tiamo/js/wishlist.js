// Wishlist Page Functionality
document.addEventListener("DOMContentLoaded", function () {
  // DOM Elements
  const wishlistItems = document.getElementById("wishlist-items");
  const emptyWishlist = document.getElementById("empty-wishlist");
  const selectedActions = document.getElementById("selected-actions");
  const selectedCount = document.getElementById("selected-count");
  const removeAllBtn = document.getElementById("remove-all-btn");
  const deselectAllBtn = document.getElementById("deselect-all-btn");
  const addSelectedBtn = document.getElementById("add-selected-btn");
  const removeSelectedBtn = document.getElementById("remove-selected-btn");

  // Wishlist State
  let wishlistData = [
    {
      id: 1,
      name: "Classic wooden chair",
      category: "Furniture",
      image:
        "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=400&auto=format&fit=crop",
      price: 299.0,
      selected: true,
    },
    {
      id: 2,
      name: "Modern design lamp",
      category: "Lighting",
      image:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400&auto=format&fit=crop",
      price: 199.0,
      selected: false,
    },
    {
      id: 3,
      name: "Decoration wooden present",
      category: "Cooking",
      image:
        "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=400&auto=format&fit=crop",
      price: 89.0,
      selected: false,
    },
  ];

  // Initialize wishlist
  function initializeWishlist() {
    updateWishlistDisplay();
    updateSelectedActions();
    attachEventListeners();
  }

  // Update wishlist display
  function updateWishlistDisplay() {
    if (wishlistData.length === 0) {
      wishlistItems.style.display = "none";
      emptyWishlist.style.display = "block";
      selectedActions.style.display = "none";
    } else {
      wishlistItems.style.display = "grid";
      emptyWishlist.style.display = "none";
      renderWishlistItems();
    }
  }

  // Render wishlist items
  function renderWishlistItems() {
    wishlistItems.innerHTML = wishlistData
      .map(
        (item) => `
      <div class="wishlist-item" data-product-id="${item.id}">
        <div class="item-controls">
          <button type="button" class="remove-item-btn" title="Remove item" onclick="removeWishlistItem(${
            item.id
          })">
            <i class="fa-solid fa-times"></i>
            Remove
          </button>
          <label class="item-checkbox">
            <input type="checkbox" class="item-select" ${
              item.selected ? "checked" : ""
            } onchange="toggleItemSelection(${item.id})">
            <span class="checkmark"></span>
          </label>
        </div>
        <div class="item-content">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
            <div class="image-overlay">
              <button class="overlay-btn compare-btn" title="Compare" onclick="compareProduct(${
                item.id
              })">
                <i class="fa-solid fa-right-left"></i>
              </button>
              <button class="overlay-btn quick-view-btn" title="Quick View" onclick="quickViewProduct(${
                item.id
              })">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
          </div>
          <div class="item-info">
            <h3 class="item-title">${item.name}</h3>
            <span class="item-category">${item.category}</span>
            <a href="#" class="add-to-cart-btn" onclick="addToCart(${
              item.id
            })">Add To Cart</a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  }

  // Update selected actions visibility
  function updateSelectedActions() {
    const selectedItems = wishlistData.filter((item) => item.selected);
    const selectedCountValue = selectedItems.length;

    if (selectedCountValue > 0) {
      selectedActions.style.display = "flex";
      selectedCount.textContent = selectedCountValue;
    } else {
      selectedActions.style.display = "none";
    }
  }

  // Attach event listeners
  function attachEventListeners() {
    // Remove all items
    if (removeAllBtn) {
      removeAllBtn.addEventListener("click", removeAllItems);
    }

    // Deselect all items
    if (deselectAllBtn) {
      deselectAllBtn.addEventListener("click", deselectAllItems);
    }

    // Add selected to cart
    if (addSelectedBtn) {
      addSelectedBtn.addEventListener("click", addSelectedToCart);
    }

    // Remove selected items
    if (removeSelectedBtn) {
      removeSelectedBtn.addEventListener("click", removeSelectedItems);
    }
  }

  // Toggle item selection
  window.toggleItemSelection = function (productId) {
    const item = wishlistData.find((item) => item.id === productId);
    if (item) {
      item.selected = !item.selected;
      updateSelectedActions();
      updateWishlistDisplay();
    }
  };

  // Remove wishlist item
  window.removeWishlistItem = function (productId) {
    const itemElement = document.querySelector(
      `[data-product-id="${productId}"]`
    );
    if (itemElement) {
      itemElement.classList.add("removing");

      setTimeout(() => {
        wishlistData = wishlistData.filter((item) => item.id !== productId);
        updateWishlistDisplay();
        updateSelectedActions();
        showSuccessMessage(
          `"${
            wishlistData.find((item) => item.id === productId)?.name || "Item"
          }" removed from wishlist`
        );
      }, 300);
    }
  };

  // Remove all items
  function removeAllItems() {
    if (wishlistData.length === 0) return;

    if (
      confirm("Are you sure you want to remove all items from your wishlist?")
    ) {
      wishlistData.forEach((item) => {
        const itemElement = document.querySelector(
          `[data-product-id="${item.id}"]`
        );
        if (itemElement) {
          itemElement.classList.add("removing");
        }
      });

      setTimeout(() => {
        wishlistData = [];
        updateWishlistDisplay();
        updateSelectedActions();
        showSuccessMessage("All items removed from wishlist");
      }, 300);
    }
  }

  // Deselect all items
  function deselectAllItems() {
    wishlistData.forEach((item) => {
      item.selected = false;
    });
    updateWishlistDisplay();
    updateSelectedActions();
    showSuccessMessage("All items deselected");
  }

  // Add selected items to cart
  function addSelectedToCart() {
    const selectedItems = wishlistData.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      showSuccessMessage("No items selected", "info");
      return;
    }

    // Simulate adding to cart
    selectedItems.forEach((item) => {
      console.log(`Adding to cart: ${item.name}`);
    });

    showSuccessMessage(`${selectedItems.length} item(s) added to cart`);

    // Remove selected items from wishlist after adding to cart
    setTimeout(() => {
      wishlistData = wishlistData.filter((item) => !item.selected);
      updateWishlistDisplay();
      updateSelectedActions();
    }, 1000);
  }

  // Remove selected items
  function removeSelectedItems() {
    const selectedItems = wishlistData.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      showSuccessMessage("No items selected", "info");
      return;
    }

    if (
      confirm(
        `Are you sure you want to remove ${selectedItems.length} selected item(s) from your wishlist?`
      )
    ) {
      selectedItems.forEach((item) => {
        const itemElement = document.querySelector(
          `[data-product-id="${item.id}"]`
        );
        if (itemElement) {
          itemElement.classList.add("removing");
        }
      });

      setTimeout(() => {
        wishlistData = wishlistData.filter((item) => !item.selected);
        updateWishlistDisplay();
        updateSelectedActions();
        showSuccessMessage(
          `${selectedItems.length} item(s) removed from wishlist`
        );
      }, 300);
    }
  }

  // Add to cart (individual item)
  window.addToCart = function (productId) {
    const item = wishlistData.find((item) => item.id === productId);
    if (item) {
      console.log(`Adding to cart: ${item.name}`);
      showSuccessMessage(`"${item.name}" added to cart`);

      // Remove from wishlist after adding to cart
      setTimeout(() => {
        removeWishlistItem(productId);
      }, 1000);
    }
  };

  // Compare product
  window.compareProduct = function (productId) {
    const item = wishlistData.find((item) => item.id === productId);
    if (item) {
      console.log(`Comparing product: ${item.name}`);
      showSuccessMessage(`"${item.name}" added to comparison`);
    }
  };

  // Quick view product
  window.quickViewProduct = function (productId) {
    const item = wishlistData.find((item) => item.id === productId);
    if (item) {
      console.log(`Quick view: ${item.name}`);
      // Here you would typically open a quick view modal
      showSuccessMessage(`Quick view: ${item.name}`);
    }
  };

  // Show success message
  function showSuccessMessage(message, type = "success") {
    // Remove existing messages
    const existingMessage = document.querySelector(".success-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement("div");
    messageElement.className = `success-message ${
      type === "info" ? "info-message" : ""
    }`;

    const icon = type === "info" ? "fa-info-circle" : "fa-check-circle";
    const iconColor = type === "info" ? "#17a2b8" : "#28a745";

    messageElement.innerHTML = `
      <i class="fa-solid ${icon}" style="color: ${iconColor}"></i>
      <span>${message}</span>
    `;

    // Insert before wishlist items
    if (wishlistItems.parentNode) {
      wishlistItems.parentNode.insertBefore(messageElement, wishlistItems);
    }

    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 3000);
  }

  // Load wishlist from localStorage on page load
  function loadWishlistFromStorage() {
    const savedWishlist = localStorage.getItem("tiamoWishlist");
    if (savedWishlist) {
      try {
        wishlistData = JSON.parse(savedWishlist);
      } catch (error) {
        console.error("Error loading wishlist from storage:", error);
      }
    }
  }

  // Save wishlist to localStorage
  function saveWishlistToStorage() {
    try {
      localStorage.setItem("tiamoWishlist", JSON.stringify(wishlistData));
    } catch (error) {
      console.error("Error saving wishlist to storage:", error);
    }
  }

  // Enhanced remove function with storage sync
  const originalRemoveWishlistItem = window.removeWishlistItem;
  window.removeWishlistItem = function (productId) {
    originalRemoveWishlistItem(productId);
    saveWishlistToStorage();
  };

  // Enhanced selection toggle with storage sync
  const originalToggleItemSelection = window.toggleItemSelection;
  window.toggleItemSelection = function (productId) {
    originalToggleItemSelection(productId);
    saveWishlistToStorage();
  };

  // Enhanced remove all with storage sync
  const originalRemoveAllItems = removeAllItems;
  function removeAllItems() {
    originalRemoveAllItems();
    saveWishlistToStorage();
  }

  // Enhanced deselect all with storage sync
  const originalDeselectAllItems = deselectAllItems;
  function deselectAllItems() {
    originalDeselectAllItems();
    saveWishlistToStorage();
  }

  // Enhanced remove selected with storage sync
  const originalRemoveSelectedItems = removeSelectedItems;
  function removeSelectedItems() {
    originalRemoveSelectedItems();
    saveWishlistToStorage();
  }

  // Enhanced add selected to cart with storage sync
  const originalAddSelectedToCart = addSelectedToCart;
  function addSelectedToCart() {
    originalAddSelectedToCart();
    saveWishlistToStorage();
  }

  // Enhanced add to cart with storage sync
  const originalAddToCart = window.addToCart;
  window.addToCart = function (productId) {
    originalAddToCart(productId);
    saveWishlistToStorage();
  };

  // Initialize the wishlist
  loadWishlistFromStorage();
  initializeWishlist();

  // Keyboard shortcuts
  document.addEventListener("keydown", function (e) {
    // Ctrl/Cmd + A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === "a") {
      e.preventDefault();
      wishlistData.forEach((item) => (item.selected = true));
      updateWishlistDisplay();
      updateSelectedActions();
      showSuccessMessage("All items selected");
    }

    // Delete key to remove selected items
    if (e.key === "Delete") {
      e.preventDefault();
      const selectedItems = wishlistData.filter((item) => item.selected);
      if (selectedItems.length > 0) {
        removeSelectedItems();
      }
    }
  });

  // Export wishlist functionality for external use
  window.wishlistManager = {
    addItem: function (item) {
      if (!wishlistData.find((existing) => existing.id === item.id)) {
        wishlistData.push({ ...item, selected: false });
        updateWishlistDisplay();
        updateSelectedActions();
        saveWishlistToStorage();
        showSuccessMessage(`"${item.name}" added to wishlist`);
      }
    },

    removeItem: function (productId) {
      removeWishlistItem(productId);
    },

    getItems: function () {
      return [...wishlistData];
    },

    getSelectedItems: function () {
      return wishlistData.filter((item) => item.selected);
    },

    clearWishlist: function () {
      removeAllItems();
    },
  };
});
