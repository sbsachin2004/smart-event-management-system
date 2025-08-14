// Calendar functionality for Event Management System
$(document).ready(function() {
    initializeCalendar();
});

function initializeCalendar() {
    // Initialize jQuery UI datepicker
    $("#event-calendar").datepicker({
        inline: true,
        showOtherMonths: true,
        selectOtherMonths: false,
        changeMonth: true,
        changeYear: true,
        firstDay: 0, // Sunday is first day
        dateFormat: 'yy-mm-dd',
        minDate: new Date(), // Can't select past dates
        maxDate: '+2y', // Up to 2 years from now
        
        // Before showing each day, check if it has events
        beforeShowDay: function(date) {
            const dateString = $.datepicker.formatDate('yy-mm-dd', date);
            const hasEvents = hasEventsOnDate(dateString);
            
            // Return array: [selectable, css class, popup title]
            if (hasEvents) {
                const eventCount = getEventsForDate(dateString).length;
                return [true, 'has-events', `${eventCount} event(s) on this day`];
            }
            return [true, '', ''];
        },
        
        // When a date is selected
        onSelect: function(dateText, inst) {
            displayEventsForDate(dateText);
            highlightSelectedDate(dateText);
        },
        
        // When month/year changes, refresh event highlighting
        onChangeMonthYear: function(year, month, inst) {
            // Small delay to ensure calendar is rendered
            setTimeout(function() {
                $("#event-calendar").datepicker('refresh');
            }, 50);
        }
    });
    
    // Set initial selected date to today if it has events, or next event date
    const today = new Date();
    const todayString = $.datepicker.formatDate('yy-mm-dd', today);
    
    if (hasEventsOnDate(todayString)) {
        $("#event-calendar").datepicker('setDate', today);
        displayEventsForDate(todayString);
    } else {
        // Find next date with events
        const nextEventDate = getNextEventDate();
        if (nextEventDate) {
            $("#event-calendar").datepicker('setDate', new Date(nextEventDate));
            displayEventsForDate(nextEventDate);
        }
    }
    
    // Add custom CSS for calendar styling
    addCalendarStyles();
}

// Check if a specific date has events
function hasEventsOnDate(dateString) {
    return getEventsForDate(dateString).length > 0;
}

// Get events for a specific date
function getEventsForDate(dateString) {
    return eventsData.filter(event => event.date === dateString);
}

// Get the next date that has events
function getNextEventDate() {
    const today = new Date();
    const upcomingEvents = eventsData
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return upcomingEvents.length > 0 ? upcomingEvents[0].date : null;
}

// Display events for the selected date
function displayEventsForDate(dateString) {
    const events = getEventsForDate(dateString);
    const formattedDate = formatDate(dateString);
    const container = $('#selected-date-events');
    
    if (events.length === 0) {
        container.html(`
            <div class="no-events">
                <i class="fas fa-calendar-times"></i>
                <h4>No events scheduled</h4>
                <p>No events are scheduled for ${formattedDate}</p>
            </div>
        `);
        return;
    }
    
    let eventsHtml = `<h4>Events for ${formattedDate}</h4>`;
    eventsHtml += '<div class="calendar-events-list">';
    
    events.forEach(event => {
        const availability = getAvailabilityStatus(event);
        eventsHtml += `
            <div class="calendar-event-card" data-event-id="${event.id}">
                <div class="event-time">
                    <i class="fas fa-clock"></i>
                    ${formatTime(event.time)}${event.endTime ? ' - ' + formatTime(event.endTime) : ''}
                </div>
                <div class="event-info">
                    <h5 class="event-title">${event.title}</h5>
                    <div class="event-details">
                        <span class="event-category">
                            <i class="fas fa-tag"></i>
                            ${categoryMap[event.category] || event.category}
                        </span>
                        <span class="event-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${event.locationName}
                        </span>
                    </div>
                    <div class="event-availability ${availability.status}">
                        ${availability.message}
                    </div>
                </div>
                <div class="event-actions">
                    <button class="btn-primary btn-small view-event-details" onclick="showEventDetails(${event.id})">
                        <i class="fas fa-eye"></i>
                        View Details
                    </button>
                    ${!isEventSoldOut(event) ? 
                        `<button class="btn-secondary btn-small register-for-event" onclick="handleEventRegistration(${event.id})">
                            <i class="fas fa-user-plus"></i>
                            Register
                        </button>` : 
                        '<span class="sold-out-label">Sold Out</span>'
                    }
                </div>
            </div>
        `;
    });
    
    eventsHtml += '</div>';
    container.html(eventsHtml);
    
    // Add click handlers for event cards
    $('.calendar-event-card').on('click', function(e) {
        // Don't trigger if clicking on buttons
        if ($(e.target).is('button') || $(e.target).closest('button').length) {
            return;
        }
        
        const eventId = $(this).data('event-id');
        showEventDetails(eventId);
    });
    
    // Add hover effects
    $('.calendar-event-card').hover(
        function() {
            $(this).addClass('hovered');
        },
        function() {
            $(this).removeClass('hovered');
        }
    );
}

// Highlight the selected date
function highlightSelectedDate(dateString) {
    // Remove previous selection
    $('#event-calendar .ui-state-active').removeClass('selected-date');
    
    // Add highlight to selected date
    setTimeout(function() {
        $('#event-calendar .ui-state-active').addClass('selected-date');
    }, 10);
}

// Navigate calendar to specific month/year
function navigateToDate(dateString) {
    const date = new Date(dateString);
    $("#event-calendar").datepicker('setDate', date);
    displayEventsForDate(dateString);
}

// Refresh calendar (useful when events data changes)
function refreshCalendar() {
    $("#event-calendar").datepicker('refresh');
    
    // Refresh current selection if any
    const selectedDate = $("#event-calendar").datepicker('getDate');
    if (selectedDate) {
        const dateString = $.datepicker.formatDate('yy-mm-dd', selectedDate);
        displayEventsForDate(dateString);
    }
}

// Add custom styles for the calendar
function addCalendarStyles() {
    if ($('#calendar-custom-styles').length === 0) {
        $('head').append(`
        <style id="calendar-custom-styles">
        /* Calendar Container */
        .calendar-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }
        
        /* Datepicker Customization */
        #event-calendar {
            font-family: inherit;
            font-size: 0.9rem;
        }
        
        #event-calendar .ui-datepicker {
            width: 100%;
            border: none;
            box-shadow: var(--shadow);
            border-radius: 10px;
            background: var(--card-bg);
        }
        
        #event-calendar .ui-datepicker-header {
            background: var(--gradient);
            color: white;
            border: none;
            border-radius: 10px 10px 0 0;
            padding: 1rem;
        }
        
        #event-calendar .ui-datepicker-title {
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        #event-calendar .ui-datepicker-prev,
        #event-calendar .ui-datepicker-next {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
        }
        
        #event-calendar .ui-datepicker-prev:hover,
        #event-calendar .ui-datepicker-next:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        #event-calendar .ui-datepicker-calendar {
            margin: 0;
        }
        
        #event-calendar .ui-datepicker-calendar th {
            background: var(--bg-color);
            color: var(--text-color);
            font-weight: 600;
            padding: 0.75rem 0.5rem;
            border: none;
        }
        
        #event-calendar .ui-datepicker-calendar td {
            border: 1px solid var(--border-color);
            padding: 0;
        }
        
        #event-calendar .ui-datepicker-calendar td a {
            display: block;
            padding: 0.75rem 0.5rem;
            text-align: center;
            text-decoration: none;
            color: var(--text-color);
            transition: all 0.2s ease;
            border: none;
            background: var(--card-bg);
        }
        
        #event-calendar .ui-datepicker-calendar td a:hover {
            background: var(--primary-color);
            color: white;
            transform: scale(0.95);
        }
        
        #event-calendar .ui-datepicker-calendar td.has-events a {
            background: rgba(102, 126, 234, 0.1);
            font-weight: bold;
            position: relative;
        }
        
        #event-calendar .ui-datepicker-calendar td.has-events a::after {
            content: '';
            position: absolute;
            bottom: 3px;
            left: 50%;
            transform: translateX(-50%);
            width: 6px;
            height: 6px;
            background: var(--primary-color);
            border-radius: 50%;
        }
        
        #event-calendar .ui-datepicker-calendar td.selected-date a,
        #event-calendar .ui-datepicker-calendar td .ui-state-active {
            background: var(--primary-color) !important;
            color: white !important;
        }
        
        #event-calendar .ui-datepicker-calendar td.ui-datepicker-other-month a {
            color: #ccc;
        }
        
        /* Calendar Events Section */
        .calendar-events {
            background: var(--card-bg);
            border-radius: 10px;
            box-shadow: var(--shadow);
            overflow: hidden;
        }
        
        .calendar-events h3 {
            background: var(--gradient);
            color: white;
            margin: 0;
            padding: 1rem 1.5rem;
            font-size: 1.1rem;
        }
        
        #selected-date-events {
            padding: 1.5rem;
            min-height: 300px;
        }
        
        .no-events {
            text-align: center;
            color: var(--text-color);
            padding: 2rem;
        }
        
        .no-events i {
            font-size: 3rem;
            color: #ccc;
            margin-bottom: 1rem;
        }
        
        .no-events h4 {
            margin-bottom: 0.5rem;
            color: var(--text-color);
        }
        
        /* Calendar Event Cards */
        .calendar-events-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .calendar-event-card {
            display: grid;
            grid-template-columns: 120px 1fr auto;
            gap: 1rem;
            align-items: center;
            padding: 1rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background: var(--card-bg);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .calendar-event-card:hover,
        .calendar-event-card.hovered {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: var(--shadow-hover);
        }
        
        .event-time {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-weight: 600;
            color: var(--primary-color);
            font-size: 0.9rem;
        }
        
        .event-info {
            min-width: 0; /* Allow text truncation */
        }
        
        .event-title {
            margin: 0 0 0.5rem 0;
            font-size: 1rem;
            color: var(--text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .event-details {
            display: flex;
            gap: 1rem;
            margin-bottom: 0.5rem;
            flex-wrap: wrap;
        }
        
        .event-details span {
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-size: 0.85rem;
            color: #666;
        }
        
        .event-availability {
            font-size: 0.8rem;
            font-weight: 500;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            display: inline-block;
        }
        
        .event-availability.available {
            background: #e8f5e8;
            color: #2e7d2e;
        }
        
        .event-availability.filling-fast {
            background: #fff3cd;
            color: #856404;
        }
        
        .event-availability.limited {
            background: #f8d7da;
            color: #721c24;
        }
        
        .event-availability.sold-out {
            background: #f8d7da;
            color: #721c24;
        }
        
        .event-actions {
            display: flex;
            gap: 0.5rem;
            flex-direction: column;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            border-radius: 5px;
            white-space: nowrap;
        }
        
        .sold-out-label {
            background: #dc3545;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.85rem;
            text-align: center;
            font-weight: 600;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .calendar-container {
                grid-template-columns: 1fr;
                gap: 1rem;
            }
            
            .calendar-event-card {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 0.75rem;
            }
            
            .event-actions {
                flex-direction: row;
                justify-content: center;
            }
            
            .event-details {
                justify-content: center;
            }
        }
        
        /* Dark theme adjustments */
        [data-theme="dark"] #event-calendar .ui-datepicker-calendar th {
            background: var(--card-bg);
        }
        
        [data-theme="dark"] .event-details span {
            color: #aaa;
        }
        </style>
        `);
    }
}

// Public function to show calendar section
function showCalendarSection() {
    // Hide other sections
    $('.hero, .events-section, .dashboard-section').hide();
    $('.search-filter').hide();
    
    // Show calendar section
    $('#calendar').show();
    
    // Refresh calendar when shown
    refreshCalendar();
    
    // Update navigation
    $('.nav-link').removeClass('active');
    $('.nav-link[href="#calendar"]').addClass('active');
    
    // Scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Export functions for use in other modules
window.calendarFunctions = {
    navigateToDate,
    refreshCalendar,
    showCalendarSection,
    hasEventsOnDate,
    getEventsForDate
};
