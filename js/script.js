// script.js

// Mock Events Data
const events = [
    {
        id: 1,
        title: "Tech Seminar",
        date: "2025-08-15",
        time: "10:00 AM",
        venue: "New York Convention Center",
        description: "A seminar on latest tech trends.",
        organizer: "Tech Corp",
        category: "Seminar",
        location: "New York"
    },
    {
        id: 2,
        title: "Rock Concert",
        date: "2025-08-20",
        time: "8:00 PM",
        venue: "LA Arena",
        description: "Live rock music performance.",
        organizer: "Music Inc",
        category: "Concert",
        location: "Los Angeles"
    },
    {
        id: 3,
        title: "Coding Workshop",
        date: "2025-08-25",
        time: "9:00 AM",
        venue: "Chicago Tech Hub",
        description: "Hands-on coding session.",
        organizer: "Code Academy",
        category: "Workshop",
        location: "Chicago"
    },
    {
        id: 4,
        title: "AI Seminar",
        date: "2025-09-05",
        time: "11:00 AM",
        venue: "New York AI Center",
        description: "Exploring AI advancements.",
        organizer: "AI Labs",
        category: "Seminar",
        location: "New York"
    },
    // Add more events as needed for pagination demo
    {
        id: 5,
        title: "Jazz Concert",
        date: "2025-09-10",
        time: "7:00 PM",
        venue: "Chicago Jazz Club",
        description: "Smooth jazz evening.",
        organizer: "Jazz Masters",
        category: "Concert",
        location: "Chicago"
    },
    {
        id: 6,
        title: "Design Workshop",
        date: "2025-09-15",
        time: "10:00 AM",
        venue: "LA Design Studio",
        description: "UI/UX design workshop.",
        organizer: "Design Pros",
        category: "Workshop",
        location: "Los Angeles"
    }
];

// Pagination settings
const eventsPerPage = 3;
let currentPage = 1;

// Registered events (from localStorage)
let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];

// Function to display events
function displayEvents(filteredEvents, page = 1) {
    const container = $('#events-container');
    container.empty();
    const start = (page - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(start, end);

    paginatedEvents.forEach(event => {
        const card = $(`
            <div class="event-card" data-id="${event.id}">
                <h3>${event.title}</h3>
                <p>Date: ${event.date}</p>
                <p>Category: ${event.category}</p>
                <p>Location: ${event.location}</p>
            </div>
        `);
        container.append(card).hide().fadeIn(500);
    });

    setupPagination(filteredEvents.length, page);
}

// Setup pagination
function setupPagination(totalEvents, page) {
    const pagination = $('#pagination');
    pagination.empty();
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = $(`<button>${i}</button>`);
        if (i === page) button.addClass('active');
        button.click(() => filterAndDisplay(i));
        pagination.append(button);
    }
}

// Filter events
function filterEvents() {
    const search = $('#search-bar').val().toLowerCase();
    const category = $('#category-filter').val();
    const location = $('#location-filter').val();
    const date = $('#date-filter').val();

    return events.filter(event => {
        return (
            (search === '' || event.title.toLowerCase().includes(search)) &&
            (category === '' || event.category === category) &&
            (location === '' || event.location === location) &&
            (date === '' || event.date === date)
        );
    });
}

// Filter and display
function filterAndDisplay(page = 1) {
    const filtered = filterEvents();
    displayEvents(filtered, page);
}

// Open modal
function openModal(event) {
    $('#modal-title').text(event.title);
    $('#modal-date').text(`Date: ${event.date}`);
    $('#modal-time').text(`Time: ${event.time}`);
    $('#modal-venue').text(`Venue: ${event.venue}`);
    $('#modal-description').text(`Description: ${event.description}`);
    $('#modal-organizer').text(`Organizer: ${event.organizer}`);
    $('#event-modal').fadeIn();
    $('#registration-form').data('event-id', event.id);
}

// Handle registration
$('#registration-form').submit(function(e) {
    e.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    if (name && email && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        const eventId = $(this).data('event-id');
        if (!registeredEvents.includes(eventId)) {
            registeredEvents.push(eventId);
            localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
            $('#event-modal').fadeOut();
            $('#confirmation-popup').fadeIn();
        } else {
            alert('Already registered!');
        }
    } else {
        alert('Invalid input!');
    }
});

// Close popup
$('#close-popup').click(() => $('#confirmation-popup').fadeOut());

// Theme toggle
$('#theme-toggle').click(() => $('body').toggleClass('dark'));

// Calendar
function setupCalendar() {
    const eventDates = events.map(e => e.date);
    $('#datepicker').datepicker({
        beforeShowDay: function(date) {
            const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
            return [true, eventDates.includes(dateStr) ? 'has-event' : ''];
        }
    });
}

// Dashboard display
function displayRegistered() {
    const container = $('#registered-container');
    container.empty();
    registeredEvents.forEach(id => {
        const event = events.find(e => e.id === id);
        if (event) {
            const card = $(`
                <div class="event-card">
                    <h3>${event.title}</h3>
                    <p>Date: ${event.date}</p>
                    <button class="cancel-btn" data-id="${event.id}">Cancel</button>
                </div>
            `);
            container.append(card);
        }
    });
}

// Cancel registration
$(document).on('click', '.cancel-btn', function() {
    const id = parseInt($(this).data('id'));
    registeredEvents = registeredEvents.filter(e => e !== id);
    localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
    displayRegistered();
});

// On load
$(document).ready(function() {
    // Show loading screen for 2 seconds
    setTimeout(() => $('#loading-screen').fadeOut(), 2000);

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        filterAndDisplay();
        setupCalendar();

        // Event listeners
        $('#search-bar').keyup(filterAndDisplay);
        $('#category-filter, #location-filter, #date-filter').change(filterAndDisplay);

        // Open modal on card click
        $(document).on('click', '.event-card', function() {
            const id = parseInt($(this).data('id'));
            const event = events.find(e => e.id === id);
            openModal(event);
        });
    } else if (window.location.pathname.includes('dashboard.html')) {
        displayRegistered();
    }

    // Close modal
    $('.close').click(() => $('#event-modal').fadeOut());
    $(window).click(e => {
        if (e.target === $('#event-modal')[0]) $('#event-modal').fadeOut();
    });
});

// Custom CSS for calendar highlights
$('<style>.has-event a { background: #3498db !important; color: white !important; }</style>').appendTo('head');