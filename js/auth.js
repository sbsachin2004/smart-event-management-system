// Authentication System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.users = JSON.parse(localStorage.getItem('users') || '[]');
        this.init();
    }

    init() {
        // Check if user is already logged in
        const loggedInUser = localStorage.getItem('currentUser');
        if (loggedInUser) {
            this.currentUser = JSON.parse(loggedInUser);
            this.updateUIForLoggedInUser();
        }

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login button click
        $('#login-btn').on('click', () => {
            this.showLoginModal();
        });

        // Login form submission
        $('#login-form').on('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Register form submission
        $('#register-form').on('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        // Profile form submission
        $('#profile-form').on('submit', (e) => {
            e.preventDefault();
            this.handleProfileUpdate();
        });

        // Logout button click
        $('#logout-btn').on('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Dashboard link click
        $('#dashboard-link').on('click', (e) => {
            e.preventDefault();
            if (this.currentUser) {
                this.showDashboard();
                this.closeUserDropdown();
            }
        });

        // Profile link click
        $('#profile-link').on('click', (e) => {
            e.preventDefault();
            if (this.currentUser) {
                this.showProfileModal();
                this.closeUserDropdown();
            }
        });

        // Show register modal
        $('#show-register').on('click', (e) => {
            e.preventDefault();
            this.hideLoginModal();
            this.showRegisterModal();
        });

        // Show login modal
        $('#show-login').on('click', (e) => {
            e.preventDefault();
            this.hideRegisterModal();
            this.showLoginModal();
        });

        // Modal close buttons
        $('.close').on('click', (e) => {
            this.hideAllModals();
        });

        // Close modal when clicking outside
        $('.modal').on('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideAllModals();
            }
        });

        // User dropdown toggle
        $('#user-menu').on('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });

        // Close dropdown when clicking outside
        $(document).on('click', () => {
            this.closeUserDropdown();
        });
    }

    showLoginModal() {
        $('#login-modal').fadeIn(300);
        $('#login-email').focus();
        this.clearFormErrors();
    }

    hideLoginModal() {
        $('#login-modal').fadeOut(300);
        this.clearForm('#login-form');
    }

    showRegisterModal() {
        $('#register-modal').fadeIn(300);
        $('#register-name').focus();
        this.clearFormErrors();
    }

    hideRegisterModal() {
        $('#register-modal').fadeOut(300);
        this.clearForm('#register-form');
    }

    showProfileModal() {
        if (!this.currentUser) return;

        // Populate form with current user data
        $('#profile-name').val(this.currentUser.name);
        $('#profile-email').val(this.currentUser.email);
        $('#profile-phone').val(this.currentUser.phone || '');

        $('#profile-modal').fadeIn(300);
        this.clearFormErrors();
    }

    hideProfileModal() {
        $('#profile-modal').fadeOut(300);
        this.clearForm('#profile-form');
    }

    hideAllModals() {
        $('.modal').fadeOut(300);
        this.clearAllForms();
    }

    handleLogin() {
        const email = $('#login-email').val().trim();
        const password = $('#login-password').val();

        // Clear previous errors
        this.clearFormErrors();

        // Validate form
        if (!this.validateLoginForm(email, password)) {
            return;
        }

        // Find user
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            this.showFieldError('login-email', 'Invalid email or password');
            return;
        }

        // Login successful
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        this.hideLoginModal();
        this.updateUIForLoggedInUser();
        this.showSuccessMessage('Login successful! Welcome back, ' + user.name + '!');
    }

    handleRegister() {
        const name = $('#register-name').val().trim();
        const email = $('#register-email').val().trim();
        const phone = $('#register-phone').val().trim();
        const password = $('#register-password').val();
        const confirmPassword = $('#register-confirm-password').val();

        // Clear previous errors
        this.clearFormErrors();

        // Validate form
        if (!this.validateRegisterForm(name, email, phone, password, confirmPassword)) {
            return;
        }

        // Check if user already exists
        if (this.users.some(u => u.email === email)) {
            this.showFieldError('register-email', 'Email already registered');
            return;
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            name,
            email,
            phone,
            password,
            registeredEvents: [],
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto-login after registration
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        this.hideRegisterModal();
        this.updateUIForLoggedInUser();
        this.showSuccessMessage('Registration successful! Welcome, ' + name + '!');
    }

    handleProfileUpdate() {
        if (!this.currentUser) return;

        const name = $('#profile-name').val().trim();
        const email = $('#profile-email').val().trim();
        const phone = $('#profile-phone').val().trim();
        const currentPassword = $('#profile-current-password').val();
        const newPassword = $('#profile-new-password').val();

        // Clear previous errors
        this.clearFormErrors();

        // Validate form
        if (!this.validateProfileForm(name, email, phone, currentPassword, newPassword)) {
            return;
        }

        // If changing password, verify current password
        if (newPassword && currentPassword !== this.currentUser.password) {
            this.showFieldError('profile-current-password', 'Current password is incorrect');
            return;
        }

        // Check if new email is already taken by another user
        const emailExists = this.users.some(u => 
            u.email === email && u.id !== this.currentUser.id
        );
        
        if (emailExists) {
            this.showFieldError('profile-email', 'Email already taken by another user');
            return;
        }

        // Update user data
        this.currentUser.name = name;
        this.currentUser.email = email;
        this.currentUser.phone = phone;
        
        if (newPassword) {
            this.currentUser.password = newPassword;
        }

        // Update in users array
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.currentUser };
            localStorage.setItem('users', JSON.stringify(this.users));
        }

        // Update current user in localStorage
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));

        this.hideProfileModal();
        this.updateUIForLoggedInUser();
        this.showSuccessMessage('Profile updated successfully!');
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUIForLoggedOutUser();
        this.closeUserDropdown();
        this.showSuccessMessage('Logged out successfully!');
        
        // Redirect to home if on dashboard
        if ($('#dashboard').is(':visible')) {
            showSection('home');
        }
    }

    updateUIForLoggedInUser() {
        $('#login-btn').hide();
        $('#user-dropdown').show();
        $('#username-display').text(this.currentUser.name);
        $('.nav-menu').find('li:has(#dashboard-link)').show();
    }

    updateUIForLoggedOutUser() {
        $('#login-btn').show();
        $('#user-dropdown').hide();
        $('.nav-menu').find('li:has(#dashboard-link)').hide();
    }

    toggleUserDropdown() {
        $('#user-dropdown').toggleClass('show');
    }

    closeUserDropdown() {
        $('#user-dropdown').removeClass('show');
    }

    showDashboard() {
        // Navigate to dashboard
        $('.nav-link').removeClass('active');
        $('.nav-link[href="#dashboard"]').addClass('active');
        showSection('dashboard');
    }

    validateLoginForm(email, password) {
        let isValid = true;

        if (!email) {
            this.showFieldError('login-email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('login-email', 'Please enter a valid email');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('login-password', 'Password is required');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(name, email, phone, password, confirmPassword) {
        let isValid = true;

        if (!name || name.length < 2) {
            this.showFieldError('register-name', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!email) {
            this.showFieldError('register-email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('register-email', 'Please enter a valid email');
            isValid = false;
        }

        if (!phone) {
            this.showFieldError('register-phone', 'Phone number is required');
            isValid = false;
        }

        if (!password) {
            this.showFieldError('register-password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            this.showFieldError('register-password', 'Password must be at least 6 characters');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showFieldError('register-confirm-password', 'Passwords do not match');
            isValid = false;
        }

        return isValid;
    }

    validateProfileForm(name, email, phone, currentPassword, newPassword) {
        let isValid = true;

        if (!name || name.length < 2) {
            this.showFieldError('profile-name', 'Name must be at least 2 characters');
            isValid = false;
        }

        if (!email) {
            this.showFieldError('profile-email', 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email)) {
            this.showFieldError('profile-email', 'Please enter a valid email');
            isValid = false;
        }

        if (!phone) {
            this.showFieldError('profile-phone', 'Phone number is required');
            isValid = false;
        }

        // If trying to change password, both fields are required
        if (newPassword && !currentPassword) {
            this.showFieldError('profile-current-password', 'Current password is required to change password');
            isValid = false;
        }

        if (newPassword && newPassword.length < 6) {
            this.showFieldError('profile-new-password', 'New password must be at least 6 characters');
            isValid = false;
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showFieldError(fieldId, message) {
        const field = $(`#${fieldId}`);
        const errorSpan = field.siblings('.error-message');
        
        field.addClass('error');
        errorSpan.text(message).show();
    }

    clearFormErrors() {
        $('.error-message').hide();
        $('input').removeClass('error');
    }

    clearForm(formSelector) {
        $(formSelector)[0].reset();
        this.clearFormErrors();
    }

    clearAllForms() {
        $('#login-form, #register-form, #profile-form')[0].reset();
        this.clearFormErrors();
    }

    showSuccessMessage(message) {
        // Create a temporary success message
        const successDiv = $(`
            <div class="success-message" style="
                position: fixed;
                top: 100px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 5px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideInRight 0.3s ease;
            ">
                <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
                ${message}
            </div>
        `);

        $('body').append(successDiv);

        setTimeout(() => {
            successDiv.fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }

    // Public method to check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Public method to get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Public method for event registration (to be used by other modules)
    canRegisterForEvents() {
        return this.isLoggedIn();
    }
}

// Initialize authentication when document is ready
$(document).ready(function() {
    window.authManager = new AuthManager();
});

// Add CSS for success message animation
$('head').append(`
<style>
@keyframes slideInRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.error-message {
    display: none;
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 0.25rem;
}

.form-group input.error {
    border-color: #e74c3c;
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.success-message {
    font-weight: 500;
}
</style>
`);
