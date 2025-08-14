// Events Management
let currentFilters = {};
let currentPage = 1;
const eventsPerPage = 6;
let currentEventId = null;

// Initialize events functionality
function initializeEvents() {
    setupEventListeners();
    setupDatePicker();
    loadEvents();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    $('#search-input').on('keyup', debounce(function() {
        currentFilters.search = $(this).val();
        currentPage = 1;
        loadEvents();
    }, 300));

    // Filter change handlers
    $('#category-filter').on('change', function() {
        currentFilters.category = $(this).val();
        currentPage = 1;
        loadEvents();
    });

    $('#location-filter').on('change', function() {
        currentFilters.location = $(this).val();
        currentPage = 1;
        loadEvents();
    });

    $('#date-picker').on('change', function() {
        currentFilters.date = $(this).val();
        currentPage = 1;
        loadEvents();
    });

    // Pagination
    $('#prev-page').on('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadEvents();
        }
    });

    $('#next-page').on('click', function() {
        const totalEvents = getEvents(currentFilters).length;
        const totalPages = Math.ceil(totalEvents / eventsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadEvents();
        }
    });

    // Modal close handlers
    $('.close').on('click', function() {
        $(this).closest('.modal').removeClass('show').hide();
    });

    // Click outside modal to close
    $('.modal').on('click', function(e) {
        if (e.target === this) {
            $(this).removeClass('show').hide();
        }
    });

    // Registration form submission
    $('#registration-form').on('submit', handleRegistration);

    // CTA button click
    $('.cta-button').on('click', function() {
        $('html, body').animate({
            scrollTop: $('#events').offset().top - 100
        }, 1000);
    });
}

// Setup date picker with event highlighting
function setupDatePicker() {
    const eventDates = getEventDates();
    
    $('#date-picker').datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0,
        beforeShowDay: function(date) {
            const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
            const hasEvent = eventDates.includes(dateStr);
            return [true, hasEvent ? 'event-date' : '', hasEvent ? 'Event available' : ''];
        },
        onSelect: function(dateText) {
            currentFilters.date = dateText;
            currentPage = 1;
            loadEvents();
        }
    });

    // Add CSS for event dates
    $('<style>')
        .prop('type', 'text/css')
        .html(`
            .ui-datepicker .event-date a {
                background: linear-gradient(135deg, #667eea, #764ba2) !important;
                color: white !important;
                border-radius: 50% !important;
            }
            .ui-datepicker .event-date a:hover {
                background: linear-gradient(135deg, #764ba2, #667eea) !important;
            }
        `)
        .appendTo('head');
}

// Load and display events
function loadEvents() {
    const filteredEvents = getEvents(currentFilters);
    const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
    const startIndex = (currentPage - 1) * eventsPerPage;
    const endIndex = startIndex + eventsPerPage;
    const pageEvents = filteredEvents.slice(startIndex, endIndex);

    renderEvents(pageEvents);
    updatePagination(totalPages);
    
    // Trigger animation for new events
    $('.event-card').css('opacity', '0').each(function(index) {
        $(this).delay(index * 100).animate({ opacity: 1 }, 600);
    });
}

// Render events to the grid
function renderEvents(events) {
    const $eventsGrid = $('#events-grid');
    
    if (events.length === 0) {
        $eventsGrid.html(`
            <div class="no-events" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <i class="fas fa-calendar-times" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666; margin-bottom: 0.5rem;">No Events Found</h3>
                <p style="color: #999;">Try adjusting your filters to find events.</p>
            </div>
        `);
        return;
    }

    const eventsHtml = events.map(event => createEventCard(event)).join('');
    $eventsGrid.html(eventsHtml);

    // Add event listeners to cards
    $('.event-card').on('click', function() {
        const eventId = $(this).data('event-id');
        showEventDetails(eventId);
    });

    $('.register-btn').on('click', function(e) {
        e.stopPropagation();
        const eventId = $(this).data('event-id');
        showRegistrationModal(eventId);
    });
}

// Create event card HTML
function createEventCard(event) {
    const availability = getAvailabilityStatus(event);
    const daysUntil = getDaysUntilEvent(event.date);
    const soldOut = isEventSoldOut(event);
    
    return `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-image">
                <div class="event-category">${categoryMap[event.category]}</div>
                <div class="event-date">${formatDate(event.date).split(',')[0]}</div>
            </div>
            <div class="event-info">
                <h3 class="event-title">${event.title}</h3>
                <p class="event-description">${event.description}</p>
                <div class="event-meta">
                    <div class="event-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${locationMap[event.location]}
                    </div>
                    <div class="event-price">
                        <i class="fas fa-tag"></i>
                        ${event.price === 0 ? 'Free' : '$' + event.price}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn-secondary" onclick="showEventDetails(${event.id}); event.stopPropagation();">
                        View Details
                    </button>
                    <button class="btn-primary register-btn" 
                            data-event-id="${event.id}" 
                            ${soldOut ? 'disabled' : ''}>
                        ${soldOut ? 'Sold Out' : 'Register'}
                    </button>
                </div>
                <div class="availability-status ${availability.status}" style="margin-top: 0.5rem; font-size: 0.8rem; color: ${availability.status === 'sold-out' ? '#ff4757' : availability.status === 'limited' ? '#ff6b35' : '#2ed573'};">
                    ${availability.message}
                </div>
            </div>
        </div>
    `;
}

// Update pagination controls
function updatePagination(totalPages) {
    $('#page-info').text(`Page ${currentPage} of ${totalPages}`);
    $('#prev-page').prop('disabled', currentPage === 1);
    $('#next-page').prop('disabled', currentPage === totalPages || totalPages === 0);
}

// Show event details modal
function showEventDetails(eventId) {
    const event = getEventById(eventId);
    if (!event) return;

    const daysUntil = getDaysUntilEvent(event.date);
    const availability = getAvailabilityStatus(event);
    const soldOut = isEventSoldOut(event);

    const modalContent = `
        <div class="event-detail-image"></div>
        <h2 class="event-detail-title">${event.title}</h2>
        <div class="event-detail-info">
            <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${formatDate(event.date)}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-clock"></i>
                <span>${formatTime(event.time)} - ${formatTime(event.endTime)}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.locationName}, ${locationMap[event.location]}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-tag"></i>
                <span>${event.price === 0 ? 'Free Event' : '$' + event.price}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-user-tie"></i>
                <span>${event.organizer}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-users"></i>
                <span>${event.registered}/${event.capacity} registered (${availability.message})</span>
            </div>
            ${daysUntil > 0 ? `
            <div class="info-item">
                <i class="fas fa-calendar-day"></i>
                <span>${daysUntil} days until event</span>
            </div>` : ''}
        </div>
        <div class="event-description-full">
            <h4>About This Event</h4>
            <p>${event.description}</p>
            <div class="event-tags" style="margin-top: 1rem;">
                ${event.tags.map(tag => `<span class="tag" style="display: inline-block; background: var(--gradient); color: white; padding: 0.2rem 0.5rem; border-radius: 15px; font-size: 0.8rem; margin-right: 0.5rem; margin-bottom: 0.5rem;">${tag}</span>`).join('')}
            </div>
        </div>
        <div style="margin-top: 2rem; display: flex; gap: 1rem;">
            <button class="btn-secondary" onclick="closeEventModal()">Close</button>
            <button class="btn-primary" onclick="showRegistrationModal(${event.id}); closeEventModal();" ${soldOut ? 'disabled' : ''}>
                ${soldOut ? 'Sold Out' : 'Register Now'}
            </button>
        </div>
    `;

    $('#modal-body').html(modalContent);
    $('#event-modal').addClass('show').show();
}

// Show registration modal
function showRegistrationModal(eventId) {
    currentEventId = eventId;
    const event = getEventById(eventId);
    if (!event) return;

    $('#registration-modal h2').text(`Register for ${event.title}`);
    $('#registration-form')[0].reset();
    $('.error-message').text('');
    $('#registration-modal').addClass('show').show();
}

// Handle registration form submission
function handleRegistration(e) {
    e.preventDefault();
    
    // Clear previous errors
    $('.error-message').text('');
    
    // Validate form
    let isValid = true;
    const formData = {
        fullName: $('#full-name').val().trim(),
        email: $('#email').val().trim(),
        phone: $('#phone').val().trim(),
        specialRequirements: $('#special-requirements').val().trim()
    };

    // Validation
    if (!formData.fullName) {
        $('#full-name').siblings('.error-message').text('Full name is required');
        isValid = false;
    }

    if (!formData.email) {
        $('#email').siblings('.error-message').text('Email is required');
        isValid = false;
    } else if (!isValidEmail(formData.email)) {
        $('#email').siblings('.error-message').text('Please enter a valid email address');
        isValid = false;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
        $('#phone').siblings('.error-message').text('Please enter a valid phone number');
        isValid = false;
    }

    if (!isValid) return;

    // Simulate registration process
    const event = getEventById(currentEventId);
    
    // Check if already registered
    const registrations = getRegistrations();
    const existingRegistration = registrations.find(reg => 
        reg.eventId === currentEventId && reg.email === formData.email
    );

    if (existingRegistration) {
        $('#email').siblings('.error-message').text('You are already registered for this event');
        return;
    }

    // Add registration to localStorage
    const registration = {
        id: Date.now(),
        eventId: currentEventId,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.locationName,
        ...formData,
        registrationDate: new Date().toISOString()
    };

    registrations.push(registration);
    localStorage.setItem('eventRegistrations', JSON.stringify(registrations));

    // Update event capacity (for demo purposes)
    const eventIndex = eventsData.findIndex(e => e.id === currentEventId);
    if (eventIndex !== -1) {
        eventsData[eventIndex].registered++;
    }

    // Close registration modal and show confirmation
    closeRegistrationModal();
    showConfirmationModal();

    // Refresh events display
    loadEvents();
}

// Close modals
function closeEventModal() {
    $('#event-modal').removeClass('show').hide();
}

function closeRegistrationModal() {
    $('#registration-modal').removeClass('show').hide();
    currentEventId = null;
}

function closeConfirmationModal() {
    $('#confirmation-modal').removeClass('show').hide();
}

// Show confirmation modal
function showConfirmationModal() {
    $('#confirmation-modal').addClass('show').show();
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        closeConfirmationModal();
    }, 3000);
}

// Get registrations from localStorage
function getRegistrations() {
    return JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
}

// Validation helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.showEventDetails = showEventDetails;
window.showRegistrationModal = showRegistrationModal;
window.closeEventModal = closeEventModal;
window.closeRegistrationModal = closeRegistrationModal;
window.closeConfirmationModal = closeConfirmationModal;
