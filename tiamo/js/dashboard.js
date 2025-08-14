// Dashboard Page JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Initialize dashboard functionality
  initDashboard();
});

function initDashboard() {
  // Navigation functionality
  setupNavigation();

  // Dashboard card interactions
  setupDashboardCards();

  // Form handling
  setupForms();

  // Logout functionality
  setupLogout();
}

function setupNavigation() {
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
  const contentSections = document.querySelectorAll(".content-section");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Remove active class from all nav links
      navLinks.forEach((navLink) => navLink.classList.remove("active"));

      // Add active class to clicked link
      this.classList.add("active");

      // Hide all content sections
      contentSections.forEach((section) => {
        section.classList.remove("active");
      });

      // Show corresponding content section
      const targetSection = this.getAttribute("href").substring(1);
      if (targetSection === "dashboard") {
        // Show dashboard grid
        showDashboardGrid();
      } else {
        // Hide dashboard grid and show specific section
        hideDashboardGrid();
        const section = document.getElementById(targetSection);
        if (section) {
          section.classList.add("active");
        }
      }
    });
  });
}

function showDashboardGrid() {
  const dashboardGrid = document.querySelector(".dashboard-grid");
  const welcomeSection = document.querySelector(".welcome-section");

  if (dashboardGrid) {
    dashboardGrid.style.display = "grid";
  }
  if (welcomeSection) {
    welcomeSection.style.display = "block";
  }
}

function hideDashboardGrid() {
  const dashboardGrid = document.querySelector(".dashboard-grid");
  const welcomeSection = document.querySelector(".welcome-section");

  if (dashboardGrid) {
    dashboardGrid.style.display = "none";
  }
  if (welcomeSection) {
    welcomeSection.style.display = "none";
  }
}

function setupDashboardCards() {
  const dashboardCards = document.querySelectorAll(".dashboard-card");

  dashboardCards.forEach((card) => {
    card.addEventListener("click", function () {
      const section = this.getAttribute("data-section");

      if (section) {
        // Remove active class from all cards
        dashboardCards.forEach((c) => c.classList.remove("active"));

        // Add active class to clicked card
        this.classList.add("active");

        // Show loading state
        this.classList.add("loading");

        // Simulate loading delay
        setTimeout(() => {
          this.classList.remove("loading");

          // Navigate to section
          const navLink = document.querySelector(`[href="#${section}"]`);
          if (navLink) {
            navLink.click();
          }
        }, 500);
      }
    });

    // Add hover effects
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

function setupForms() {
  // Account details form
  const accountForm = document.querySelector(".account-form");
  if (accountForm) {
    accountForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleAccountUpdate(this);
    });
  }

  // Address edit buttons
  const editBtns = document.querySelectorAll(".edit-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      handleAddressEdit(this);
    });
  });
}

function handleAccountUpdate(form) {
  const saveBtn = form.querySelector(".save-btn");
  const originalText = saveBtn.textContent;

  // Show loading state
  saveBtn.textContent = "Saving...";
  saveBtn.disabled = true;

  // Simulate save process
  setTimeout(() => {
    showMessage("Account details updated successfully!", "success");

    // Reset button
    saveBtn.textContent = originalText;
    saveBtn.disabled = false;
  }, 1500);
}

function handleAddressEdit(btn) {
  const addressCard = btn.closest(".address-card");
  const addressText = addressCard.querySelector("p");
  const originalText = addressText.innerHTML;

  // Create edit form
  const editForm = document.createElement("div");
  editForm.className = "edit-address-form";
  editForm.innerHTML = `
        <div class="form-group">
            <label>Address</label>
            <textarea class="address-input" rows="3">${addressText.textContent.replace(
              /<br>/g,
              "\n"
            )}</textarea>
        </div>
        <div class="form-actions">
            <button type="button" class="save-address-btn">Save</button>
            <button type="button" class="cancel-edit-btn">Cancel</button>
        </div>
    `;

  // Style the form
  editForm.style.cssText = `
        margin-top: 1rem;
        padding: 1rem;
        border-top: 1px solid #e0e0e0;
    `;

  const textarea = editForm.querySelector(".address-input");
  textarea.style.cssText = `
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: inherit;
        resize: vertical;
    `;

  const saveBtn = editForm.querySelector(".save-address-btn");
  const cancelBtn = editForm.querySelector(".cancel-edit-btn");

  saveBtn.style.cssText = `
        background: #28a745;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 0.5rem;
    `;

  cancelBtn.style.cssText = `
        background: #6c757d;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    `;

  // Add event listeners
  saveBtn.addEventListener("click", function () {
    const newAddress = textarea.value;
    addressText.innerHTML = newAddress.replace(/\n/g, "<br>");
    editForm.remove();
    showMessage("Address updated successfully!", "success");
  });

  cancelBtn.addEventListener("click", function () {
    editForm.remove();
  });

  // Replace address text with form
  addressCard.appendChild(editForm);
}

function setupLogout() {
  const logoutBtn = document.querySelector(".logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      handleLogout();
    });
  }
}

function handleLogout() {
  const logoutBtn = document.querySelector(".logout-btn");
  const originalText = logoutBtn.textContent;

  // Show loading state
  logoutBtn.textContent = "Logging out...";
  logoutBtn.disabled = true;

  // Simulate logout process
  setTimeout(() => {
    showMessage("Logged out successfully! Redirecting...", "success");

    // In a real application, this would redirect to login page
    // window.location.href = 'login.html';

    setTimeout(() => {
      logoutBtn.textContent = originalText;
      logoutBtn.disabled = false;
    }, 2000);
  }, 1500);
}

function showMessage(message, type) {
  // Remove existing message
  const existingMessage = document.querySelector(".dashboard-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  // Create new message
  const messageDiv = document.createElement("div");
  messageDiv.className = `dashboard-message ${type}`;
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
    
    .edit-address-form .form-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
    }
    
    .save-address-btn:hover {
        background: #218838 !important;
    }
    
    .cancel-edit-btn:hover {
        background: #5a6268 !important;
    }
    
    .address-input:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
`;
document.head.appendChild(style);

// Add keyboard navigation support
document.addEventListener("keydown", function (e) {
  // Escape key to close any open forms
  if (e.key === "Escape") {
    const editForms = document.querySelectorAll(".edit-address-form");
    editForms.forEach((form) => form.remove());
  }

  // Enter key to submit forms
  if (e.key === "Enter" && e.target.matches("input, textarea")) {
    const form = e.target.closest("form");
    if (form) {
      form.dispatchEvent(new Event("submit"));
    }
  }
});

// Add smooth scrolling for navigation
function smoothScrollTo(element) {
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Add loading states for better UX
function addLoadingState(element) {
  element.classList.add("loading");
  element.disabled = true;
}

function removeLoadingState(element) {
  element.classList.remove("loading");
  element.disabled = false;
}

// Add error handling
function handleError(error, context) {
  console.error(`Error in ${context}:`, error);
  showMessage("An error occurred. Please try again.", "error");
}

// Add success handling
function handleSuccess(message) {
  showMessage(message, "success");
}

// Initialize any additional features
function initAdditionalFeatures() {
  // Add tooltips for dashboard cards
  const dashboardCards = document.querySelectorAll(".dashboard-card");
  dashboardCards.forEach((card) => {
    const title = card.querySelector("h3").textContent;
    card.setAttribute("title", `Click to view ${title}`);
  });

  // Add confirmation for logout
  const logoutLinks = document.querySelectorAll('a[href="#logout"]');
  logoutLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (!confirm("Are you sure you want to log out?")) {
        e.preventDefault();
      }
    });
  });
}

// Call additional features initialization
document.addEventListener("DOMContentLoaded", function () {
  initAdditionalFeatures();
  setupNewsletterForm();
});

// Newsletter form functionality
function setupNewsletterForm() {
  const newsletterForm = document.querySelector(".newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleNewsletterSignup(this);
    });
  }
}

function handleNewsletterSignup(form) {
  const emailInput = form.querySelector(".email-input");
  const signupBtn = form.querySelector(".signup-btn");
  const email = emailInput.value.trim();

  if (!email) {
    showMessage("Please enter your email address", "error");
    return;
  }

  if (!isValidEmail(email)) {
    showMessage("Please enter a valid email address", "error");
    return;
  }

  // Show loading state
  const originalText = signupBtn.textContent;
  signupBtn.textContent = "Signing up...";
  signupBtn.disabled = true;

  // Simulate newsletter signup
  setTimeout(() => {
    showMessage("Successfully subscribed to newsletter!", "success");

    // Reset form
    emailInput.value = "";
    signupBtn.textContent = originalText;
    signupBtn.disabled = false;
  }, 1500);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
