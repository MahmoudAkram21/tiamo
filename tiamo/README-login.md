# Tiamo Login/Registration Page

## Overview
This is a modern, responsive login and registration page for the Tiamo fashion website. The page features a clean design with smooth animations and form validation.

## Features

### 🎨 **Design**
- Clean, minimalist design with modern UI elements
- Responsive layout that works on all devices
- Smooth animations and transitions
- Tajawal font family for consistent typography
- Professional color scheme with Tiamo brand colors

### 🔐 **Functionality**
- **Toggle between Login and Registration forms**
- **Form validation** with real-time feedback
- **Password visibility toggle** for better UX
- **Remember me** checkbox for login
- **Terms and conditions** agreement for registration
- **Responsive design** for mobile and desktop

### 📱 **Responsive Features**
- Mobile-first design approach
- Adaptive layouts for different screen sizes
- Touch-friendly form elements
- Optimized spacing for mobile devices

### ♿ **Accessibility**
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast elements

## How to Use

### 1. **Access the Page**
- Navigate to `login.html` in your browser
- Or click the "login/register" button in the header of any page

### 2. **Switching Between Forms**
- **Login Form**: Click the "Login" toggle button (default view)
- **Registration Form**: Click the "Register" toggle button
- Forms switch smoothly with fade animations

### 3. **Login Process**
1. Enter your username or email
2. Enter your password
3. Optionally check "Remember me"
4. Click "LOG IN" button
5. Form validates and shows success message

### 4. **Registration Process**
1. Choose a username (minimum 3 characters)
2. Enter your email address
3. Create a password (minimum 6 characters)
4. Confirm your password
5. Agree to terms and conditions
6. Click "REGISTER" button
7. Form validates and shows success message

## File Structure

```
├── login.html          # Main HTML file
├── css/
│   └── login.css      # Styles for the login page
├── js/
│   └── login.js       # JavaScript functionality
└── README-login.md     # This documentation
```

## Technical Details

### **HTML Structure**
- Semantic HTML5 elements
- Proper form structure with labels
- Accessible form controls
- Clean, organized markup

### **CSS Features**
- CSS Grid and Flexbox for layouts
- CSS custom properties (variables)
- Smooth transitions and animations
- Mobile-first responsive design
- Modern CSS features (border-radius, box-shadow, etc.)

### **JavaScript Features**
- Form validation and error handling
- Dynamic form switching
- Password visibility toggle
- Form submission handling
- Accessibility improvements
- Keyboard navigation support

## Customization

### **Colors**
The page uses Tiamo brand colors:
- Primary: `#ff4d4f` (Red)
- Secondary: `#6c757d` (Gray)
- Success: `#28a745` (Green)
- Error: `#dc3545` (Red)

### **Fonts**
- Primary font: Tajawal (as per project requirements)
- Fallback: system fonts

### **Animations**
- Form switching: 0.4s ease-in-out
- Button hover effects: 0.3s ease
- Message notifications: slide in/out animations

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Future Enhancements

- [ ] Integration with backend authentication
- [ ] Social media login options
- [ ] Two-factor authentication
- [ ] Password strength indicator
- [ ] Email verification flow
- [ ] Remember login state
- [ ] Multi-language support

## Notes

- The current implementation includes demo functionality
- Form submissions are simulated with setTimeout
- Replace the demo logic with actual API calls
- Add proper error handling for production use
- Implement proper security measures (HTTPS, CSRF protection, etc.)

## Support

For any issues or questions about the login page, please refer to the main project documentation or contact the development team.
