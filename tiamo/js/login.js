// Login/Registration Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the page
  initializePage();

  // Add event listeners
  addEventListeners();
});

function initializePage() {
  // Show login form by default
  showLogin();

  // Set up form validation
  setupFormValidation();
}

function addEventListeners() {
  // Login form submission
  const loginForm = document.getElementById("loginFormElement");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }

  // Register form submission
  const registerForm = document.getElementById("registerFormElement");
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }

  // Add input event listeners for real-time validation
  addInputValidationListeners();
}

// Form switching functions
function showLogin() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginToggle = document.getElementById("loginToggle");
  const registerToggle = document.getElementById("registerToggle");

  if (loginForm && registerForm && loginToggle && registerToggle) {
    // Show login form
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    // Update toggle button states
    loginToggle.classList.add("active");
    registerToggle.classList.remove("active");

    // Clear any previous error states
    clearFormErrors();

    // Focus on first input
    const firstInput = loginForm.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }
}

function showRegister() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginToggle = document.getElementById("loginToggle");
  const registerToggle = document.getElementById("registerToggle");

  if (loginForm && registerForm && loginToggle && registerToggle) {
    // Show register form
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    // Update toggle button states
    registerToggle.classList.add("active");
    loginToggle.classList.remove("active");

    // Clear any previous error states
    clearFormErrors();

    // Focus on first input
    const firstInput = registerForm.querySelector("input");
    if (firstInput) {
      firstInput.focus();
    }
  }
}

// Password visibility toggle
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const toggleBtn = input.parentElement.querySelector(".password-toggle i");

  if (input.type === "password") {
    input.type = "text";
    toggleBtn.classList.remove("fa-eye");
    toggleBtn.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    toggleBtn.classList.remove("fa-eye-slash");
    toggleBtn.classList.add("fa-eye");
  }
}

// Form submission handlers
function handleLoginSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const password = formData.get("password");
  const remember = formData.get("remember");

  // Basic validation
  if (!validateLoginForm(username, password)) {
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Logging in...";

  // Simulate API call (replace with actual authentication logic)
  setTimeout(() => {
    // For demo purposes, show success
    showMessage("Login successful!", "success");

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    // Redirect to dashboard or home page after successful login
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1500);
  }, 2000);
}

function handleRegisterSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const agree = formData.get("agree");

  // Basic validation
  if (
    !validateRegisterForm(username, email, password, confirmPassword, agree)
  ) {
    return;
  }

  // Show loading state
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating Account...";

  // Simulate API call (replace with actual registration logic)
  setTimeout(() => {
    // For demo purposes, show success
    showMessage("Registration successful! Welcome to Tiamo!", "success");

    // Reset button
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    // Switch to login form after successful registration
    setTimeout(() => {
      showLogin();
      // Pre-fill username field
      const loginUsername = document.getElementById("loginUsername");
      if (loginUsername) {
        loginUsername.value = username;
      }
    }, 2000);
  }, 2000);
}

// Form validation functions
function validateLoginForm(username, password) {
  let isValid = true;

  // Clear previous errors
  clearFormErrors();

  if (!username || username.trim() === "") {
    showFieldError("loginUsername", "Username or email is required");
    isValid = false;
  }

  if (!password || password.trim() === "") {
    showFieldError("loginPassword", "Password is required");
    isValid = false;
  }

  return isValid;
}

function validateRegisterForm(
  username,
  email,
  password,
  confirmPassword,
  agree
) {
  let isValid = true;

  // Clear previous errors
  clearFormErrors();

  if (!username || username.trim() === "") {
    showFieldError("registerUsername", "Username is required");
    isValid = false;
  } else if (username.length < 3) {
    showFieldError(
      "registerUsername",
      "Username must be at least 3 characters"
    );
    isValid = false;
  }

  if (!email || email.trim() === "") {
    showFieldError("registerEmail", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showFieldError("registerEmail", "Please enter a valid email address");
    isValid = false;
  }

  if (!password || password.trim() === "") {
    showFieldError("registerPassword", "Password is required");
    isValid = false;
  } else if (password.length < 6) {
    showFieldError(
      "registerPassword",
      "Password must be at least 6 characters"
    );
    isValid = false;
  }

  if (password !== confirmPassword) {
    showFieldError("confirmPassword", "Passwords do not match");
    isValid = false;
  }

  if (!agree) {
    showFieldError("agreeTerms", "You must agree to the terms and conditions");
    isValid = false;
  }

  return isValid;
}

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.add("error");

    // Remove existing error message
    const existingError = field.parentElement.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
  }
}

function clearFormErrors() {
  // Remove error classes from inputs
  const errorInputs = document.querySelectorAll(".form-input.error");
  errorInputs.forEach((input) => {
    input.classList.remove("error");
  });

  // Remove error messages
  const errorMessages = document.querySelectorAll(".error-message");
  errorMessages.forEach((message) => {
    message.remove();
  });
}

function showMessage(message, type = "info") {
  // Create message element
  const messageDiv = document.createElement("div");
  messageDiv.className = `message message--${type}`;
  messageDiv.textContent = message;

  // Add styles
  messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Tajawal', sans-serif;
    `;

  // Set background color based on type
  if (type === "success") {
    messageDiv.style.background = "#28a745";
  } else if (type === "error") {
    messageDiv.style.background = "#dc3545";
  } else {
    messageDiv.style.background = "#17a2b8";
  }

  // Add to page
  document.body.appendChild(messageDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    messageDiv.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      if (messageDiv.parentElement) {
        messageDiv.parentElement.removeChild(messageDiv);
      }
    }, 300);
  }, 5000);
}

function setupFormValidation() {
  // Add CSS for message animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
}

function addInputValidationListeners() {
  // Real-time validation for register form
  const registerUsername = document.getElementById("registerUsername");
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const confirmPassword = document.getElementById("confirmPassword");

  if (registerUsername) {
    registerUsername.addEventListener("blur", () => {
      validateUsername(registerUsername.value);
    });
  }

  if (registerEmail) {
    registerEmail.addEventListener("blur", () => {
      validateEmail(registerEmail.value);
    });
  }

  if (registerPassword) {
    registerPassword.addEventListener("blur", () => {
      validatePassword(registerPassword.value);
    });
  }

  if (confirmPassword) {
    confirmPassword.addEventListener("blur", () => {
      validateConfirmPassword(registerPassword.value, confirmPassword.value);
    });
  }
}

function validateUsername(username) {
  if (username && username.length < 3) {
    showFieldError(
      "registerUsername",
      "Username must be at least 3 characters"
    );
  } else {
    clearFieldError("registerUsername");
  }
}

function validateEmail(email) {
  if (email && !isValidEmail(email)) {
    showFieldError("registerEmail", "Please enter a valid email address");
  } else {
    clearFieldError("registerEmail");
  }
}

function validatePassword(password) {
  if (password && password.length < 6) {
    showFieldError(
      "registerPassword",
      "Password must be at least 6 characters"
    );
  } else {
    clearFieldError("registerPassword");
  }
}

function validateConfirmPassword(password, confirmPassword) {
  if (confirmPassword && password !== confirmPassword) {
    showFieldError("confirmPassword", "Passwords do not match");
  } else {
    clearFieldError("confirmPassword");
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (field) {
    field.classList.remove("error");
    const errorMessage = field.parentElement.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }
}

// Keyboard navigation support
document.addEventListener("keydown", function (event) {
  if (event.key === "Tab") {
    // Handle tab navigation within forms
    const activeForm = document.querySelector(".auth-form:not(.hidden)");
    if (activeForm) {
      const inputs = activeForm.querySelectorAll(
        "input, button, select, textarea"
      );
      const firstInput = inputs[0];
      const lastInput = inputs[inputs.length - 1];

      if (event.shiftKey && document.activeElement === firstInput) {
        event.preventDefault();
        lastInput.focus();
      } else if (!event.shiftKey && document.activeElement === lastInput) {
        event.preventDefault();
        firstInput.focus();
      }
    }
  }

  // Enter key to submit forms
  if (event.key === "Enter" && document.activeElement.tagName === "INPUT") {
    const form = document.activeElement.closest("form");
    if (form) {
      event.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  }
});

// Accessibility improvements
function improveAccessibility() {
  // Add ARIA labels and roles
  const forms = document.querySelectorAll(".auth-form");
  forms.forEach((form, index) => {
    form.setAttribute("role", "form");
    form.setAttribute(
      "aria-label",
      index === 0 ? "Login form" : "Registration form"
    );
  });

  // Add live regions for dynamic content
  const liveRegion = document.createElement("div");
  liveRegion.setAttribute("aria-live", "polite");
  liveRegion.setAttribute("aria-atomic", "true");
  liveRegion.className = "sr-only";
  document.body.appendChild(liveRegion);
}

// Screen reader only class
const srOnlyStyle = document.createElement("style");
srOnlyStyle.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(srOnlyStyle);

// Initialize accessibility improvements
document.addEventListener("DOMContentLoaded", improveAccessibility);
