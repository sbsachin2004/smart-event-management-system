// Main Application Logic
$(document).ready(function() {
    // Initialize the application
    initializeApp();
});

// Initialize application
function initializeApp() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize theme
    initializeTheme();
    
    // Setup navigation
    setupNavigation();
    
    // Initialize components
    initializeEvents();
    initializeDashboard();
    
    // Hide loading screen after delay
    setTimeout(() => {
        hideLoadingScreen();
    }, 2000);
    
    // Setup hamburger menu
    setupMobileMenu();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Initialize tooltips and other UI enhancements
    setupUIEnhancements();
}

// Loading screen functions
function showLoadingScreen() {
    $('#loading-screen').show();
}

function hideLoadingScreen() {
    $('#loading-screen').addClass('fade-out');
    setTimeout(() => {
        $('#loading-screen').hide();
    }, 500);
}

// Theme management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    $('#theme-toggle').on('click', toggleTheme);
}

function setTheme(theme) {
    if (theme === 'dark') {
        $('body').attr('data-theme', 'dark');
        $('#theme-toggle i').removeClass('fa-moon').addClass('fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        $('body').removeAttr('data-theme');
        $('#theme-toggle i').removeClass('fa-sun').addClass('fa-moon');
        localStorage.setItem('theme', 'light');
    }
}

function toggleTheme() {
    const currentTheme = $('body').attr('data-theme') === 'dark' ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Add transition effect
    $('body').css('transition', 'all 0.3s ease');
    setTheme(newTheme);
    
    // Remove transition after animation
    setTimeout(() => {
        $('body').css('transition', '');
    }, 300);
    
    // Animate theme button
    $('#theme-toggle').addClass('rotating');
    setTimeout(() => {
        $('#theme-toggle').removeClass('rotating');
    }, 300);
}

// Navigation setup
function setupNavigation() {
    // Handle navigation clicks
    $('.nav-link').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href').substring(1);
        
        // Update active nav link
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        
        // Show appropriate section
        showSection(target);
        
        // Close mobile menu if open
        closeMobileMenu();
    });
    
    // Handle scroll-based navigation highlighting
    $(window).on('scroll', updateActiveNavLink);
}

function showSection(sectionName) {
    // Hide all sections
    $('.hero, .events-section, .dashboard-section, .calendar-section').hide();
    $('.search-filter').hide();
    
    switch(sectionName) {
        case 'home':
            $('.hero').show();
            $('.search-filter').show();
            $('.events-section').show();
            break;
        case 'events':
            $('.search-filter').show();
            $('.events-section').show();
            break;
        case 'calendar':
            $('.calendar-section').show();
            // Refresh calendar when shown
            if (typeof refreshCalendar === 'function') {
                refreshCalendar();
            }
            break;
        case 'dashboard':
            $('.dashboard-section').show();
            // Refresh dashboard when shown
            if (typeof initializeDashboard === 'function') {
                initializeDashboard();
            }
            break;
        case 'contact':
            showContactModal();
            break;
        default:
            $('.hero').show();
            $('.search-filter').show();
            $('.events-section').show();
    }
    
    // Scroll to top of page
    $('html, body').animate({ scrollTop: 0 }, 300);
}

function updateActiveNavLink() {
    const scrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    
    // Determine which section is currently in view
    let activeSection = 'home';
    
    if (scrollTop > $('#events').offset().top - 200) {
        activeSection = 'events';
    }
    
    if ($('.dashboard-section').is(':visible')) {
        activeSection = 'dashboard';
    }
    
    // Update active nav link
    $('.nav-link').removeClass('active');
    $(`.nav-link[href="#${activeSection}"]`).addClass('active');
}

// Mobile menu setup
function setupMobileMenu() {
    $('.hamburger').on('click', function() {
        $(this).toggleClass('active');
        $('.nav-menu').toggleClass('active');
    });
    
    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.nav-container').length) {
            closeMobileMenu();
        }
    });
    
    // Close menu when window is resized to desktop
    $(window).on('resize', function() {
        if ($(window).width() > 768) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    $('.hamburger').removeClass('active');
    $('.nav-menu').removeClass('active');
}

// Smooth scrolling setup
function setupSmoothScrolling() {
    // Add smooth scrolling to anchor links
    $('a[href*="#"]:not([href="#"])').on('click', function(e) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 100
            }, 1000, 'easeInOutQuart');
        }
    });
}

// UI Enhancements
function setupUIEnhancements() {
    // Add loading states to buttons
    $(document).on('click', '.btn-primary, .btn-secondary', function() {
        const $btn = $(this);
        if ($btn.hasClass('loading')) return;
        
        $btn.addClass('loading');
        const originalText = $btn.text();
        $btn.html('<i class="fas fa-spinner fa-spin"></i> Loading...');
        
        setTimeout(() => {
            $btn.removeClass('loading');
            $btn.text(originalText);
        }, 1000);
    });
    
    // Add hover effects to cards
    $(document).on('mouseenter', '.event-card, .stat-card, .registered-event', function() {
        $(this).addClass('hover-effect');
    });
    
    $(document).on('mouseleave', '.event-card, .stat-card, .registered-event', function() {
        $(this).removeClass('hover-effect');
    });
    
    // Add focus states for accessibility
    $('button, input, select, textarea').on('focus', function() {
        $(this).addClass('focus-visible');
    });
    
    $('button, input, select, textarea').on('blur', function() {
        $(this).removeClass('focus-visible');
    });
    
    // Add ripple effect to buttons
    $(document).on('click', '.btn-primary, .btn-secondary', function(e) {
        const $btn = $(this);
        const rect = this.getBoundingClientRect();
        const ripple = $('<span class="ripple"></span>');
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.css({
            left: x + 'px',
            top: y + 'px'
        });
        
        $btn.append(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// Contact modal
function showContactModal() {
    const contactModal = $(`
        <div class="modal contact-modal" style="display: flex; justify-content: center; align-items: center;">
            <div class="modal-content" style="max-width: 500px;">
                <span class="close">&times;</span>
                <h2 style="margin-bottom: 1.5rem; text-align: center;">Contact Us</h2>
                
                <div class="contact-info" style="margin-bottom: 2rem;">
                    <div class="contact-item" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-color);">Email</h4>
                            <p style="margin: 0; color: #666;">contact@eventhub.com</p>
                        </div>
                    </div>
                    
                    <div class="contact-item" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-color);">Phone</h4>
                            <p style="margin: 0; color: #666;">+1 (555) 123-4567</p>
                        </div>
                    </div>
                    
                    <div class="contact-item" style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div>
                            <h4 style="margin: 0; color: var(--text-color);">Address</h4>
                            <p style="margin: 0; color: #666;">123 Event Street, City, State 12345</p>
                        </div>
                    </div>
                </div>
                
                <div class="social-links" style="display: flex; justify-content: center; gap: 1rem;">
                    <a href="#" class="social-link" style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; transition: transform 0.3s ease;">
                        <i class="fab fa-facebook"></i>
                    </a>
                    <a href="#" class="social-link" style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; transition: transform 0.3s ease;">
                        <i class="fab fa-twitter"></i>
                    </a>
                    <a href="#" class="social-link" style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; transition: transform 0.3s ease;">
                        <i class="fab fa-instagram"></i>
                    </a>
                    <a href="#" class="social-link" style="width: 40px; height: 40px; background: var(--gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; text-decoration: none; transition: transform 0.3s ease;">
                        <i class="fab fa-linkedin"></i>
                    </a>
                </div>
            </div>
        </div>
    `);

    $('body').append(contactModal);

    contactModal.find('.close').on('click', function() {
        contactModal.remove();
    });

    contactModal.on('click', function(e) {
        if (e.target === this) {
            contactModal.remove();
        }
    });

    // Add hover effects to social links
    contactModal.find('.social-link').on('mouseenter', function() {
        $(this).css('transform', 'translateY(-2px)');
    }).on('mouseleave', function() {
        $(this).css('transform', 'translateY(0)');
    });
}

// Add CSS for additional animations and effects
$('<style>')
    .prop('type', 'text/css')
    .html(`
        .rotating {
            animation: rotate 0.3s ease;
        }
        
        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(180deg); }
        }
        
        .hover-effect {
            transform: translateY(-5px) !important;
            transition: transform 0.3s ease !important;
        }
        
        .focus-visible {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3) !important;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn-primary, .btn-secondary {
            position: relative;
            overflow: hidden;
        }
        
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        /* Smooth scrolling enhancement */
        html {
            scroll-behavior: smooth;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        
        ::-webkit-scrollbar-track {
            background: var(--border-color);
        }
        
        ::-webkit-scrollbar-thumb {
            background: var(--gradient);
            border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: var(--primary-color);
        }
    `)
    .appendTo('head');

// Easing function for smooth animations
$.easing.easeInOutQuart = function (x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

// Export functions for global access
window.showSection = showSection;
window.toggleTheme = toggleTheme;
window.showContactModal = showContactModal;
