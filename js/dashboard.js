// Dashboard Management
let userRegistrations = [];

// Initialize dashboard
function initializeDashboard() {
    loadUserRegistrations();
    updateDashboardStats();
    renderRegisteredEvents();
}

// Load user registrations from localStorage
function loadUserRegistrations() {
    userRegistrations = getRegistrations();
}

// Update dashboard statistics
function updateDashboardStats() {
    const totalRegistered = userRegistrations.length;
    const upcomingEvents = userRegistrations.filter(reg => {
        const eventDate = new Date(reg.eventDate);
        const today = new Date();
        return eventDate >= today;
    }).length;

    // Animate counter updates
    animateCounter('#registered-count', totalRegistered);
    animateCounter('#upcoming-count', upcomingEvents);
}

// Animate counter values
function animateCounter(selector, targetValue) {
    const $element = $(selector);
    const currentValue = parseInt($element.text()) || 0;
    
    if (currentValue === targetValue) return;
    
    $({ countNum: currentValue }).animate({
        countNum: targetValue
    }, {
        duration: 1000,
        easing: 'swing',
        step: function() {
            $element.text(Math.floor(this.countNum));
        },
        complete: function() {
            $element.text(targetValue);
        }
    });
}

// Render registered events
function renderRegisteredEvents() {
    const $container = $('#registered-events');
    
    if (userRegistrations.length === 0) {
        $container.html(`
            <div class="no-registrations" style="text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-calendar-plus" style="font-size: 4rem; margin-bottom: 1rem; opacity: 0.3;"></i>
                <h3 style="margin-bottom: 0.5rem;">No Event Registrations</h3>
                <p style="margin-bottom: 1.5rem;">You haven't registered for any events yet.</p>
                <button class="btn-primary" onclick="scrollToEvents()">Browse Events</button>
            </div>
        `);
        return;
    }

    // Sort registrations by event date
    const sortedRegistrations = [...userRegistrations].sort((a, b) => 
        new Date(a.eventDate) - new Date(b.eventDate)
    );

    // Group registrations by status
    const upcomingEvents = [];
    const pastEvents = [];
    const today = new Date();
    
    sortedRegistrations.forEach(registration => {
        const eventDate = new Date(registration.eventDate);
        if (eventDate >= today) {
            upcomingEvents.push(registration);
        } else {
            pastEvents.push(registration);
        }
    });

    let html = '';

    // Upcoming Events Section
    if (upcomingEvents.length > 0) {
        html += `
            <div class="events-section">
                <h3 style="margin-bottom: 1.5rem; color: var(--text-color);">
                    <i class="fas fa-calendar-alt" style="margin-right: 0.5rem; color: var(--primary-color);"></i>
                    Upcoming Events (${upcomingEvents.length})
                </h3>
                <div class="upcoming-events">
                    ${upcomingEvents.map(reg => createRegistrationCard(reg, 'upcoming')).join('')}
                </div>
            </div>
        `;
    }

    // Past Events Section
    if (pastEvents.length > 0) {
        html += `
            <div class="events-section" style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1.5rem; color: var(--text-color);">
                    <i class="fas fa-history" style="margin-right: 0.5rem; color: #666;"></i>
                    Past Events (${pastEvents.length})
                </h3>
                <div class="past-events">
                    ${pastEvents.map(reg => createRegistrationCard(reg, 'past')).join('')}
                </div>
            </div>
        `;
    }

    $container.html(html);

    // Add event listeners for cancel buttons
    $('.cancel-registration').on('click', function(e) {
        e.stopPropagation();
        const registrationId = $(this).data('registration-id');
        showCancelConfirmation(registrationId);
    });

    // Add event listeners for event cards
    $('.registered-event').on('click', function() {
        const eventId = $(this).data('event-id');
        showEventDetails(eventId);
    });
}

// Create registration card HTML
function createRegistrationCard(registration, status) {
    const eventDate = new Date(registration.eventDate);
    const isUpcoming = status === 'upcoming';
    const daysUntil = isUpcoming ? getDaysUntilEvent(registration.eventDate) : null;
    const registrationDate = new Date(registration.registrationDate);

    return `
        <div class="registered-event ${status}" data-event-id="${registration.eventId}" data-registration-id="${registration.id}">
            <div class="registered-event-info">
                <h4>${registration.eventTitle}</h4>
                <div class="event-details" style="margin-top: 0.5rem;">
                    <p style="margin: 0.2rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-calendar" style="color: var(--primary-color); width: 16px;"></i>
                        ${formatDate(registration.eventDate)} at ${formatTime(registration.eventTime)}
                    </p>
                    <p style="margin: 0.2rem 0; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-map-marker-alt" style="color: var(--primary-color); width: 16px;"></i>
                        ${registration.eventLocation}
                    </p>
                    ${daysUntil !== null ? `
                    <p style="margin: 0.2rem 0; display: flex; align-items: center; gap: 0.5rem; color: ${daysUntil === 0 ? '#ff6b35' : daysUntil <= 7 ? '#2ed573' : '#666'};">
                        <i class="fas fa-clock" style="color: var(--primary-color); width: 16px;"></i>
                        ${daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days to go`}
                    </p>` : ''}
                    <p style="margin: 0.2rem 0; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: #999;">
                        <i class="fas fa-check-circle" style="color: #2ed573; width: 16px;"></i>
                        Registered on ${registrationDate.toLocaleDateString()}
                    </p>
                </div>
            </div>
            <div class="registration-actions">
                ${isUpcoming ? `
                <button class="cancel-registration cancel-btn" data-registration-id="${registration.id}">
                    <i class="fas fa-times"></i> Cancel
                </button>` : `
                <span class="status-badge" style="background: #95a5a6; color: white; padding: 0.3rem 0.8rem; border-radius: 15px; font-size: 0.8rem;">
                    <i class="fas fa-check"></i> Attended
                </span>`}
            </div>
        </div>
    `;
}

// Show cancel confirmation dialog
function showCancelConfirmation(registrationId) {
    const registration = userRegistrations.find(reg => reg.id === registrationId);
    if (!registration) return;

    const modal = $(`
        <div class="modal cancel-confirmation-modal" style="display: flex; justify-content: center; align-items: center;">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div style="color: #ff4757; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 style="margin-bottom: 1rem; color: var(--text-color);">Cancel Registration</h3>
                <p style="margin-bottom: 1.5rem; color: #666;">
                    Are you sure you want to cancel your registration for<br>
                    <strong>"${registration.eventTitle}"</strong>?
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn-secondary cancel-no">No, Keep Registration</button>
                    <button class="btn-primary cancel-yes" style="background: #ff4757;">Yes, Cancel Registration</button>
                </div>
            </div>
        </div>
    `);

    $('body').append(modal);

    // Handle confirmation
    modal.find('.cancel-yes').on('click', function() {
        cancelRegistration(registrationId);
        modal.remove();
    });

    modal.find('.cancel-no').on('click', function() {
        modal.remove();
    });

    // Close on outside click
    modal.on('click', function(e) {
        if (e.target === this) {
            modal.remove();
        }
    });
}

// Cancel registration
function cancelRegistration(registrationId) {
    const registrationIndex = userRegistrations.findIndex(reg => reg.id === registrationId);
    if (registrationIndex === -1) return;

    const registration = userRegistrations[registrationIndex];

    // Update event capacity (for demo purposes)
    const eventIndex = eventsData.findIndex(e => e.id === registration.eventId);
    if (eventIndex !== -1) {
        eventsData[eventIndex].registered--;
    }

    // Remove registration from array and localStorage
    userRegistrations.splice(registrationIndex, 1);
    localStorage.setItem('eventRegistrations', JSON.stringify(userRegistrations));

    // Show cancellation success message
    showCancellationSuccess(registration.eventTitle);

    // Refresh dashboard and events display
    updateDashboardStats();
    renderRegisteredEvents();
    
    // Refresh events page if visible
    if ($('#events').is(':visible')) {
        loadEvents();
    }
}

// Show cancellation success message
function showCancellationSuccess(eventTitle) {
    const successModal = $(`
        <div class="modal success-modal" style="display: flex; justify-content: center; align-items: center;">
            <div class="modal-content" style="max-width: 400px; text-align: center;">
                <div style="color: #2ed573; font-size: 3rem; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3 style="margin-bottom: 1rem; color: var(--text-color);">Registration Cancelled</h3>
                <p style="margin-bottom: 1.5rem; color: #666;">
                    Your registration for "<strong>${eventTitle}</strong>" has been successfully cancelled.
                </p>
                <button class="btn-primary close-success">Close</button>
            </div>
        </div>
    `);

    $('body').append(successModal);

    successModal.find('.close-success').on('click', function() {
        successModal.remove();
    });

    // Auto-close after 3 seconds
    setTimeout(() => {
        successModal.fadeOut(function() {
            successModal.remove();
        });
    }, 3000);
}

// Scroll to events section
function scrollToEvents() {
    // Switch to events section
    showSection('events');
    
    // Scroll to events section
    setTimeout(() => {
        $('html, body').animate({
            scrollTop: $('#events').offset().top - 100
        }, 1000);
    }, 100);
}

// Export functions for global access
window.initializeDashboard = initializeDashboard;
window.updateDashboardStats = updateDashboardStats;
window.scrollToEvents = scrollToEvents;
