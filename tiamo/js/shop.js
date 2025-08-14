// Shop Mobile Sidebar and Sort Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Sidebar Toggle
  const filterToggle = document.getElementById("filter-toggle");
  const sidebar = document.getElementById("shop-sidebar");
  const sidebarOverlay = document.getElementById("sidebar-overlay");
  const sidebarClose = document.querySelector(".sidebar-close");

  // Price Range Functionality
  const priceRange = document.getElementById("price-range");
  const priceRangeLabels = document.querySelector(".price-range-labels");
  const filterBtn = document.querySelector(".filter-btn");

  // Filter Summary Elements
  const filterSummary = document.getElementById("filter-summary");
  const filterSummaryText = document.querySelector(".filter-summary-text");
  const clearFiltersBtn = document.getElementById("clear-filters-btn");
  const activeFilters = document.getElementById("active-filters");

  // Sale Elements
  const viewAllSaleBtn = document.querySelector(".view-all-sale-btn");
  const saleFilter = document.getElementById("sale-filter");

  // Product Grid Elements
  const productsContainer = document.getElementById("products-container");
  const showOptions = document.querySelector(".show-options");

  // Track active filters
  let activeFiltersList = {
    price: null,
    colors: [],
    sizes: [],
    brands: [],
    onSale: false,
    inStock: false,
  };

  // AJAX Filter State
  let isFiltering = false;
  let filterTimeout = null;
  let currentPage = 1;
  let productsPerPage = 9;
  let totalProducts = 0;
  let allProducts = [];

  // Laravel CSRF Token (get from meta tag)
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");

  // API Configuration
  const API_CONFIG = {
    baseUrl: "/api", // Adjust this to match your Laravel API routes
    endpoints: {
      products: "/products",
      filter: "/products/filter",
      search: "/products/search",
    },
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  };

  // Add CSRF token to headers if available
  if (csrfToken) {
    API_CONFIG.headers["X-CSRF-TOKEN"] = csrfToken;
  }

  function openSideBar() {
    document.body.classList.add("sidebar-open");
    sidebar.classList.add("active");
    sidebarOverlay.classList.add("active");

    // Prevent body scroll when sidebar is open
    if (sidebar.classList.contains("active")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.classList.remove("sidebar-open");
      document.body.style.overflow = "";
    }
  }

  filterToggle.addEventListener("click", openSideBar);

  function closeSideBar() {
    document.body.classList.remove("sidebar-open");
    document.body.classList.remove("sidebar-open");
    sidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");

    // Allow body scroll when sidebar is closed
    document.body.style.overflow = "";
  }

  sidebarClose.addEventListener("click", closeSideBar);

  // Close sidebar when clicking overlay
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeSideBar);
  }

  const sidebarLinks = sidebar.querySelectorAll("a");
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 991.98) {
        closeSideBar();
      }
    });
  });

  // AJAX Filter Functions
  function debounceFilter(func, wait) {
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(filterTimeout);
        func(...args);
      };
      clearTimeout(filterTimeout);
      filterTimeout = setTimeout(later, wait);
    };
  }

  async function applyFilters() {
    if (isFiltering) return;

    isFiltering = true;
    showLoadingState();

    try {
      // Build filter parameters for Laravel
      const filterParams = buildFilterParams();

      // Make API request to Laravel backend
      const response = await fetchProducts(filterParams);

      if (response.success) {
        allProducts = response.data.products || [];
        totalProducts = response.data.total || 0;
        updateProductGrid(allProducts);
        updateProductCount(allProducts.length);
        updateFilterSummary();
      } else {
        console.error("Filter failed:", response.message);
        showErrorMessage("Failed to apply filters. Please try again.");
      }
    } catch (error) {
      console.error("Filter error:", error);
      showErrorMessage("An error occurred while filtering products.");
    } finally {
      hideLoadingState();
      isFiltering = false;
    }
  }

  function buildFilterParams() {
    const params = new URLSearchParams();

    // Add pagination
    params.append("page", currentPage);
    params.append("per_page", productsPerPage);

    // Add filters
    if (activeFiltersList.price) {
      params.append("max_price", activeFiltersList.price);
    }

    if (activeFiltersList.colors.length > 0) {
      activeFiltersList.colors.forEach((color) => {
        params.append("colors[]", color);
      });
    }

    if (activeFiltersList.sizes.length > 0) {
      activeFiltersList.sizes.forEach((size) => {
        params.append("sizes[]", size);
      });
    }

    if (activeFiltersList.brands.length > 0) {
      activeFiltersList.brands.forEach((brand) => {
        params.append("brands[]", brand);
      });
    }

    if (activeFiltersList.onSale) {
      params.append("on_sale", "1");
    }

    if (activeFiltersList.inStock) {
      params.append("in_stock", "1");
    }

    return params;
  }

  async function fetchProducts(filterParams) {
    try {
      const url = `${API_CONFIG.baseUrl}${
        API_CONFIG.endpoints.filter
      }?${filterParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: API_CONFIG.headers,
        credentials: "same-origin", // Include cookies for Laravel session
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Laravel typically returns data in this format
      return {
        success: true,
        data: {
          products: data.data || data.products || [],
          total: data.total || data.meta?.total || 0,
          current_page: data.current_page || data.meta?.current_page || 1,
          last_page: data.last_page || data.meta?.last_page || 1,
        },
      };
    } catch (error) {
      console.error("Fetch error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async function searchProducts(searchTerm) {
    try {
      const url = `${API_CONFIG.baseUrl}${
        API_CONFIG.endpoints.search
      }?q=${encodeURIComponent(searchTerm)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: API_CONFIG.headers,
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        success: true,
        data: {
          products: data.data || data.products || [],
          total: data.total || data.meta?.total || 0,
        },
      };
    } catch (error) {
      console.error("Search error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  }

  const debouncedApplyFilters = debounceFilter(applyFilters, 300);

  function updateProductGrid(products) {
    if (!productsContainer) return;

    if (products.length === 0) {
      productsContainer.innerHTML = `
        <div class="no-products-found">
          <div class="no-products-icon">
            <i class="fa-solid fa-search"></i>
          </div>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
          <button class="clear-filters-btn" onclick="clearAllFilters()">
            <i class="fa-solid fa-times"></i> Clear all filters
          </button>
        </div>
      `;
      return;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = products.slice(startIndex, endIndex);

    productsContainer.innerHTML = pageProducts
      .map((product) => createProductCard(product))
      .join("");

    // Reattach event listeners to new product cards
    attachProductCardEvents();
  }

  function createProductCard(product) {
    const saleLabel = product.onSale
      ? `<div class="product-label product-label--sale">-${product.discount}%</div>`
      : "";
    const newLabel = product.isNew
      ? '<div class="product-label product-label--new">NEW</div>'
      : "";
    const hotLabel = product.isHot
      ? '<div class="product-label product-label--hot">HOT</div>'
      : "";
    const rating = createStarRating(product.rating);

    const priceDisplay = product.oldPrice
      ? `<div class="product-card__price"><span class="old-price">${product.oldPrice.toFixed(
          2
        )},00 EGP</span><span class="current-price">${product.price.toFixed(
          2
        )},00 EGP</span></div>`
      : `<div class="product-card__price">${product.price.toFixed(
          2
        )},00 EGP</div>`;

    const productClass = product.onSale
      ? "product-card sale-product"
      : "product-card";

    return `
      <article class="${productClass}" data-product-id="${product.id}">
        <div class="product-card__media">
          <img class="product-card__img" src="${product.image}" alt="${product.name}" />
          ${saleLabel}${newLabel}${hotLabel}
          <div class="product-card__actions">
            <button title="Compare" aria-label="Compare" class="icon-btn">
              <i class="fa-solid fa-right-left"></i>
            </button>
            <button title="Quick View" aria-label="Quick View" class="icon-btn">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button title="Wishlist" aria-label="Wishlist" class="icon-btn">
              <i class="fa-regular fa-heart"></i>
            </button>
          </div>
          ${rating}
        </div>
        <div class="product-card__info">
          <h3 class="product-card__title">${product.name}</h3>
          <span class="product-card__category">${product.category}</span>
          ${priceDisplay}
          <a href="#" class="product-card__cta">Add To Cart</a>
        </div>
      </article>
    `;
  }

  function createStarRating(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars += '<i class="fa-solid fa-star"></i>';
      } else {
        stars += '<i class="fa-regular fa-star"></i>';
      }
    }
    return `<div class="product-rating">${stars}</div>`;
  }

  function updateProductCount(count) {
    if (showOptions) {
      showOptions.innerHTML = `Show: <b>${count}</b> / ${totalProducts} products`;
    }
  }

  function showLoadingState() {
    if (productsContainer) {
      productsContainer.style.opacity = "0.6";
      productsContainer.style.pointerEvents = "none";

      // Add loading spinner
      const loadingSpinner = document.createElement("div");
      loadingSpinner.className = "loading-spinner";
      loadingSpinner.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      productsContainer.appendChild(loadingSpinner);
    }
  }

  function hideLoadingState() {
    if (productsContainer) {
      productsContainer.style.opacity = "1";
      productsContainer.style.pointerEvents = "auto";

      // Remove loading spinner
      const loadingSpinner =
        productsContainer.querySelector(".loading-spinner");
      if (loadingSpinner) {
        loadingSpinner.remove();
      }
    }
  }

  function showErrorMessage(message) {
    // Create error message element
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <div class="error-content">
        <i class="fa-solid fa-exclamation-triangle"></i>
        <span>${message}</span>
        <button class="error-close" onclick="this.parentElement.parentElement.remove()">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    `;

    // Insert at the top of products container
    if (productsContainer) {
      productsContainer.insertBefore(errorDiv, productsContainer.firstChild);

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (errorDiv.parentElement) {
          errorDiv.remove();
        }
      }, 5000);
    }
  }

  // Price Range Functionality
  if (priceRange && priceRangeLabels) {
    const minPrice = parseInt(priceRange.min);
    const maxPrice = parseInt(priceRange.max);

    // Update price display when range changes
    priceRange.addEventListener("input", function () {
      const currentValue = this.value;
      const priceLabels = priceRangeLabels.querySelectorAll("span");

      if (priceLabels.length >= 2) {
        priceLabels[1].textContent = `${currentValue} EGP`;
      }

      // Apply filters with debouncing
      activeFiltersList.price = currentValue;
      debouncedApplyFilters();
    });

    // Filter button functionality
    if (filterBtn) {
      filterBtn.addEventListener("click", function () {
        const currentPrice = priceRange.value;
        activeFiltersList.price = currentPrice;
        updateFilterSummary();
        applyFilters();
      });
    }
  }

  // Update Filter Summary
  function updateFilterSummary() {
    const hasActiveFilters = Object.values(activeFiltersList).some(
      (filter) => filter && (Array.isArray(filter) ? filter.length > 0 : true)
    );

    if (hasActiveFilters) {
      clearFiltersBtn.style.display = "flex";
      updateActiveFilterTags();
    } else {
      clearFiltersBtn.style.display = "none";
      activeFilters.innerHTML = "";
    }

    // Update summary text
    const filterCount = getFilterCount();
    if (filterCount > 0) {
      filterSummaryText.textContent = `Showing filtered products (${filterCount} filters active)`;
    } else {
      filterSummaryText.textContent = "Showing all products";
    }
  }

  function getFilterCount() {
    let count = 0;
    if (activeFiltersList.price) count++;
    if (activeFiltersList.colors.length > 0) count++;
    if (activeFiltersList.sizes.length > 0) count++;
    if (activeFiltersList.brands.length > 0) count++;
    if (activeFiltersList.onSale) count++;
    if (activeFiltersList.inStock) count++;
    return count;
  }

  function updateActiveFilterTags() {
    activeFilters.innerHTML = "";

    // Price filter
    if (activeFiltersList.price) {
      addFilterTag(`Price: ${activeFiltersList.price} EGP`, "price");
    }

    // Color filters
    activeFiltersList.colors.forEach((color) => {
      addFilterTag(`Color: ${color}`, "color", color);
    });

    // Size filters
    activeFiltersList.sizes.forEach((size) => {
      addFilterTag(`Size: ${size}`, "size", size);
    });

    // Brand filters
    activeFiltersList.brands.forEach((brand) => {
      addFilterTag(`Brand: ${brand}`, "brand", brand);
    });

    // Sale filter
    if (activeFiltersList.onSale) {
      addFilterTag("On Sale", "sale");
    }

    // Stock filter
    if (activeFiltersList.inStock) {
      addFilterTag("In Stock", "stock");
    }
  }

  function addFilterTag(text, type, value = null) {
    const filterTag = document.createElement("div");
    filterTag.className = "filter-tag";
    filterTag.innerHTML = `
      ${text}
      <button class="remove-filter" data-type="${type}" data-value="${value}">
        <i class="fa-solid fa-times"></i>
      </button>
    `;

    // Add remove functionality
    const removeBtn = filterTag.querySelector(".remove-filter");
    removeBtn.addEventListener("click", function () {
      removeFilter(type, value);
    });

    activeFilters.appendChild(filterTag);
  }

  function removeFilter(type, value = null) {
    switch (type) {
      case "price":
        activeFiltersList.price = null;
        if (priceRange) priceRange.value = priceRange.max;
        break;
      case "color":
        activeFiltersList.colors = activeFiltersList.colors.filter(
          (c) => c !== value
        );
        break;
      case "size":
        activeFiltersList.sizes = activeFiltersList.sizes.filter(
          (s) => s !== value
        );
        break;
      case "brand":
        activeFiltersList.brands = activeFiltersList.brands.filter(
          (b) => b !== value
        );
        break;
      case "sale":
        activeFiltersList.onSale = false;
        if (saleFilter) saleFilter.checked = false;
        break;
      case "stock":
        activeFiltersList.inStock = false;
        break;
    }
    updateFilterSummary();
    applyFilters();
  }

  // Clear All Filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", function () {
      // Reset all filters
      activeFiltersList = {
        price: null,
        colors: [],
        sizes: [],
        brands: [],
        onSale: false,
        inStock: false,
      };

      // Reset UI
      if (priceRange) priceRange.value = priceRange.max;
      document
        .querySelectorAll('input[type="checkbox"]')
        .forEach((checkbox) => {
          checkbox.checked = false;
        });

      updateFilterSummary();
      applyFilters();
    });
  }

  // Shop Sort Dropdown Functionality
  const sortDropdown = document.querySelector(".sort-dropdown");

  if (sortDropdown) {
    const toggle = sortDropdown.querySelector(".sort-dropdown__toggle");
    const menu = sortDropdown.querySelector(".sort-dropdown__menu");
    const items = sortDropdown.querySelectorAll(".sort-dropdown__item");
    let isOpen = false;

    // Toggle dropdown menu
    function toggleDropdown() {
      isOpen = !isOpen;
      toggle.setAttribute("aria-expanded", isOpen);

      if (isOpen) {
        // Close when clicking outside
        document.addEventListener("click", handleOutsideClick);
      } else {
        document.removeEventListener("click", handleOutsideClick);
      }
    }

    // Handle clicks outside the dropdown
    function handleOutsideClick(event) {
      if (!sortDropdown.contains(event.target)) {
        isOpen = false;
        toggle.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", handleOutsideClick);
      }
    }

    // Handle item selection
    function handleItemClick(event) {
      event.preventDefault();
      const selectedText = this.textContent;

      // Update toggle text
      toggle.querySelector("span").textContent = selectedText;

      // Update active state
      items.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");

      // Close dropdown
      isOpen = false;
      toggle.setAttribute("aria-expanded", "false");
      document.removeEventListener("click", handleOutsideClick);

      // Apply sorting
      applySorting(selectedText);
    }

    // Event listeners
    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleDropdown();
    });

    items.forEach((item) => {
      item.addEventListener("click", handleItemClick);
    });

    // Close when pressing Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen) {
        isOpen = false;
        toggle.setAttribute("aria-expanded", "false");
        document.removeEventListener("click", handleOutsideClick);
      }
    });
  }

  function applySorting(sortType) {
    const filteredProducts = [...allProducts];
    let sortedProducts = [...filteredProducts];

    switch (sortType) {
      case "Sort by price: low to high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Sort by price: high to low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "Sort by popularity":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "Sort by average rating":
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "Sort by latest":
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sorting - keep original order
        break;
    }

    updateProductGrid(sortedProducts);
  }

  // View Toggle Functionality
  const gridViewBtn = document.getElementById("grid-view-btn");
  const listViewBtn = document.getElementById("list-view-btn");

  if (gridViewBtn && listViewBtn && productsContainer) {
    // Set initial active view (grid view by default)
    const savedView = localStorage.getItem("shopView") || "grid";
    setView(savedView);

    // Add click event listeners
    gridViewBtn.addEventListener("click", () => setView("grid"));
    listViewBtn.addEventListener("click", () => setView("list"));

    function setView(view) {
      // Update UI
      if (view === "grid") {
        productsContainer.classList.remove("list-view");
        productsContainer.classList.add("grid-view");
        gridViewBtn.classList.add("active");
        listViewBtn.classList.remove("active");
      } else {
        productsContainer.classList.remove("grid-view");
        productsContainer.classList.add("list-view");
        listViewBtn.classList.add("active");
        gridViewBtn.classList.remove("active");
      }

      // Save preference
      localStorage.setItem("shopView", view);
    }
  }

  // Filter Checkbox Functionality
  const filterCheckboxes = document.querySelectorAll(
    '.filter-checkbox input[type="checkbox"]'
  );
  filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const filterType = this.name;
      const filterValue = this.value;
      const isChecked = this.checked;

      if (filterType === "on_sale") {
        activeFiltersList.onSale = isChecked;
      } else if (filterType === "in_stock") {
        activeFiltersList.inStock = isChecked;
      }

      updateFilterSummary();
      applyFilters();
      console.log(
        `Filter ${filterType}: ${filterValue} - ${
          isChecked ? "enabled" : "disabled"
        }`
      );
    });
  });

  // Color Filter Functionality
  const colorFilters = document.querySelectorAll(
    '.filter-color input[type="checkbox"]'
  );
  colorFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const color = this.value;
      const isChecked = this.checked;

      if (isChecked) {
        activeFiltersList.colors.push(color);
      } else {
        activeFiltersList.colors = activeFiltersList.colors.filter(
          (c) => c !== color
        );
      }

      updateFilterSummary();
      applyFilters();
      console.log(
        `Color filter ${color}: ${isChecked ? "enabled" : "disabled"}`
      );
    });
  });

  // Size Filter Functionality
  const sizeFilters = document.querySelectorAll(
    '.filter-size input[type="checkbox"]'
  );
  sizeFilters.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const size = this.value;
      const isChecked = this.checked;

      if (isChecked) {
        activeFiltersList.sizes.push(size);
      } else {
        activeFiltersList.sizes = activeFiltersList.sizes.filter(
          (s) => s !== size
        );
      }

      updateFilterSummary();
      applyFilters();
      console.log(`Size filter ${size}: ${isChecked ? "enabled" : "disabled"}`);
    });
  });

  // Brand Filter Functionality
  const brandFilters = document.querySelectorAll(
    '.filter-brand input[type="checkbox"]'
  );
  brandFilters.forEach((checkbox) => {
    checkbox.addEventListener("click", function () {
      const brand = this.value;
      const isChecked = this.checked;

      if (isChecked) {
        activeFiltersList.brands.push(brand);
      } else {
        activeFiltersList.brands = activeFiltersList.brands.filter(
          (b) => b !== brand
        );
      }

      updateFilterSummary();
      applyFilters();
      console.log(
        `Brand filter ${brand}: ${isChecked ? "enabled" : "disabled"}`
      );
    });
  });

  // View All Sale Items Button
  if (viewAllSaleBtn) {
    viewAllSaleBtn.addEventListener("click", function () {
      // Check the sale filter
      if (saleFilter) {
        saleFilter.checked = true;
        activeFiltersList.onSale = true;
        updateFilterSummary();
        applyFilters();
      }

      // Scroll to products
      document.querySelector(".shop-products").scrollIntoView({
        behavior: "smooth",
      });

      console.log("Viewing all sale items");
    });
  }

  // Product Card Event Handlers
  function attachProductCardEvents() {
    const productCards = document.querySelectorAll(".product-card");
    productCards.forEach((card) => {
      // Add to cart functionality
      const addToCartBtn = card.querySelector(".product-card__cta");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", function (e) {
          e.preventDefault();
          const productTitle = card.querySelector(
            ".product-card__title"
          ).textContent;
          console.log(`Adding to cart: ${productTitle}`);

          // Here you would typically add the product to cart
          // For now, we'll just show a message
          this.textContent = "Added to Cart!";
          this.style.background = "#4caf50";

          setTimeout(() => {
            this.textContent = "Add To Cart";
            this.style.background = "#222";
          }, 2000);
        });
      }

      // Wishlist functionality
      const wishlistBtn = card.querySelector('.icon-btn[title="Wishlist"]');
      if (wishlistBtn) {
        wishlistBtn.addEventListener("click", function () {
          const productTitle = card.querySelector(
            ".product-card__title"
          ).textContent;
          console.log(`Added to wishlist: ${productTitle}`);

          // Toggle wishlist state
          this.classList.toggle("active");
          if (this.classList.contains("active")) {
            this.style.background = "#da3c3c";
            this.style.color = "white";
          } else {
            this.style.background = "rgba(255, 255, 255, 0.9)";
            this.style.color = "#333";
          }
        });
      }

      // Quick view functionality
      const quickViewBtn = card.querySelector('.icon-btn[title="Quick View"]');
      if (quickViewBtn) {
        quickViewBtn.addEventListener("click", function () {
          const productTitle = card.querySelector(
            ".product-card__title"
          ).textContent;
          console.log(`Quick view: ${productTitle}`);

          // Here you would typically open a quick view modal
          // For now, we'll just log the action
        });
      }

      // Compare functionality
      const compareBtn = card.querySelector('.icon-btn[title="Compare"]');
      if (compareBtn) {
        compareBtn.addEventListener("click", function () {
          const productTitle = card.querySelector(
            ".product-card__title"
          ).textContent;
          console.log(`Compare: ${productTitle}`);

          // Here you would typically add the product to comparison
          // For now, we'll just log the action
        });
      }
    });
  }

  // Close sidebar when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sidebar.classList.contains("active")) {
      closeSideBar();
    }
  });

  // Initialize the shop
  async function initializeShop() {
    try {
      // Load initial products
      await applyFilters();
      updateFilterSummary();
      attachProductCardEvents();
    } catch (error) {
      console.error("Shop initialization failed:", error);
      showErrorMessage("Failed to load products. Please refresh the page.");
    }
  }

  // Start the shop
  initializeShop();
});
