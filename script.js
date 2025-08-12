// Sample Events Data
const events = [
    {
        id: 1,
        title: "Tech Seminar 2025",
        date: "2025-08-20",
        time: "10:00 AM",
        venue: "Conference Hall A",
        category: "Seminar",
        location: "New York",
        description: "Latest trends in AI and Machine Learning.",
        organizer: "Tech Corp"
    },
    {
        id: 2,
        title: "Rock Concert",
        date: "2025-08-25",
        time: "8:00 PM",
        venue: "Stadium Arena",
        category: "Concert",
        location: "Los Angeles",
        description: "Live performance by top bands.",
        organizer: "Music Inc"
    },
    {
        id: 3,
        title: "Creative Workshop",
        date: "2025-09-05",
        time: "2:00 PM",
        venue: "Art Studio",
        category: "Workshop",
        location: "Chicago",
        description: "Hands-on session for designers.",
        organizer: "Art Guild"
    },
    {
        id: 4,
        title: "Business Seminar",
        date: "2025-07-10",
        time: "9:00 AM",
        venue: "Business Center",
        category: "Seminar",
        location: "New York",
        description: "Strategies for business growth.",
        organizer: "Biz Experts"
    },
    {
        id: 5,
        title: "Jazz Concert",
        date: "2025-09-15",
        time: "7:00 PM",
        venue: "Jazz Club",
        category: "Concert",
        location: "New Orleans",
        description: "Smooth jazz night.",
        organizer: "Jazz Masters"
    },
    {
        id: 6,
        title: "Coding Workshop",
        date: "2025-08-30",
        time: "11:00 AM",
        venue: "Tech Hub",
        category: "Workshop",
        location: "San Francisco",
        description: "Learn advanced coding techniques.",
        organizer: "Code Academy"
    },
    // Add more events as needed
];

const currentDate = new Date('2025-08-13');

// Local Storage Keys
const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const REG_EVENTS_KEY = 'registeredEvents';
const THEME_KEY = 'theme';

// Pagination
const PER_PAGE = 6;
let currentPage = 1;
let filteredEvents = events.filter(e => new Date(e.date) >= currentDate); // Upcoming by default
let currentUser = null;

$(document).ready(function() {
    // Hide Loader Immediately
    $('#loader').hide();

    // Theme Switcher
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark') {
        $('body').addClass('dark');
        $('#theme-switch').prop('checked', true);
    }
    $('#theme-switch').change(function() {
        $('body').toggleClass('dark');
        localStorage.setItem(THEME_KEY, $('body').hasClass('dark') ? 'dark' : 'light');
    });

    // Check Current User
    currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    updateUserUI();

    // Nav Links
    $('.nav-link').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        $('.nav-link').removeClass('active');
        $(this).addClass('active');
        $('.section').removeClass('active');
        $(target).addClass('active');
        if (target === '#dashboard' && !currentUser) {
            showPopup('Please login to access dashboard.');
            $('#login-modal').fadeIn();
        }
    });

    // Populate Filters
    const categories = [...new Set(events.map(e => e.category))];
    const locations = [...new Set(events.map(e => e.location))];
    categories.forEach(cat => $('#category').append(`<option value="${cat}">${cat}</option>`));
    locations.forEach(loc => $('#location').append(`<option value="${loc}">${loc}</option>`));

    // Datepickers for Filters
    $('#date-from, #date-to').datepicker({
        dateFormat: 'yy-mm-dd'
    });

    // Render Events
    renderEvents();

    // Search and Filter
    $('#search').keyup(filterEvents);
    $('#category, #location, #date-from, #date-to').change(filterEvents);

    // Event Click
    $('#events-list, #calendar-events').on('click', '.event-card', function() {
        const id = $(this).data('id');
        showEventModal(id);
    });

    // Modal Close
    $('.close').click(closeModal);
    $(window).click(function(e) {
        if ($(e.target).hasClass('modal')) closeModal();
    });

    // Login Button
    $('#login-btn').click(() => $('#login-modal').fadeIn());

    // Register Button Header
    $('#register-btn-header').click(() => $('#register-modal').fadeIn());

    // Profile Button
    $('#profile-btn').click(() => {
        if (currentUser) {
            $('#profile-name').val(currentUser.name);
            $('#profile-email').val(currentUser.email);
            $('#profile-phone').val(currentUser.phone);
            $('#profile-modal').fadeIn();
        }
    });

    // Logout
    $('#logout-btn').click(() => {
        localStorage.removeItem(CURRENT_USER_KEY);
        currentUser = null;
        updateUserUI();
        renderDashboard();
        showPopup('Logged out successfully.');
    });

    // Login Form
    $('#login-form').submit(function(e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            currentUser = user;
            updateUserUI();
            closeModal();
            showPopup('Login successful!');
        } else {
            alert('Invalid credentials.');
        }
    });

    // Register Form
    $('#register-form').submit(function(e) {
        e.preventDefault();
        const name = $('#reg-name').val();
        const email = $('#reg-email').val();
        const password = $('#reg-password').val();
        const phone = $('#reg-phone').val();
        let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        if (users.find(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }
        const newUser = { name, email, password, phone };
        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
        currentUser = newUser;
        updateUserUI();
        closeModal();
        showPopup('Registration successful!');
    });

    // Profile Form
    $('#profile-form').submit(function(e) {
        e.preventDefault();
        const name = $('#profile-name').val();
        const phone = $('#profile-phone').val();
        const password = $('#profile-password').val();
        let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            users[index].name = name;
            users[index].phone = phone;
            if (password) users[index].password = password;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
            currentUser = users[index];
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
            closeModal();
            updateUserUI();
            showPopup('Profile updated!');
        }
    });

    // Register Event Button
    $('#register-event-btn').click(function() {
        if (!currentUser) {
            showPopup('Please login to register for events.');
            $('#login-modal').fadeIn();
            return;
        }
        const id = $('#modal-title').data('id');
        let regs = JSON.parse(localStorage.getItem(REG_EVENTS_KEY)) || [];
        if (regs.find(r => r.userEmail === currentUser.email && r.eventId === id)) {
            showPopup('Already registered for this event.');
            return;
        }
        regs.push({ userEmail: currentUser.email, eventId: id });
        localStorage.setItem(REG_EVENTS_KEY, JSON.stringify(regs));
        closeModal();
        showPopup('Event registration successful!');
        renderDashboard();
    });

    // Dashboard Cancel
    $('#registered-events').on('click', '.cancel-btn', function() {
        const id = $(this).data('id');
        let regs = JSON.parse(localStorage.getItem(REG_EVENTS_KEY)) || [];
        regs = regs.filter(r => !(r.userEmail === currentUser.email && r.eventId === id));
        localStorage.setItem(REG_EVENTS_KEY, JSON.stringify(regs));
        renderDashboard();
    });

    // Calendar
    const eventDates = events.map(e => e.date);
    $('#datepicker').datepicker({
        beforeShowDay: function(date) {
            const d = $.datepicker.formatDate('yy-mm-dd', date);
            return [true, eventDates.includes(d) ? 'ui-state-highlight' : ''];
        },
        onSelect: function(dateText) {
            const selectedDate = dateText;
            const dayEvents = events.filter(e => e.date === selectedDate);
            renderCalendarEvents(dayEvents);
        }
    });
});

function updateUserUI() {
    if (currentUser) {
        $('#user-name').text(`Welcome, ${currentUser.name}`).show();
        $('#login-btn, #register-btn-header').hide();
        $('#profile-btn, #logout-btn').show();
    } else {
        $('#user-name').hide();
        $('#login-btn, #register-btn-header').show();
        $('#profile-btn, #logout-btn').hide();
    }
    renderDashboard();
}

function filterEvents() {
    const search = $('#search').val().toLowerCase();
    const cat = $('#category').val();
    const loc = $('#location').val();
    const from = $('#date-from').val() ? new Date($('#date-from').val()) : null;
    const to = $('#date-to').val() ? new Date($('#date-to').val()) : null;

    filteredEvents = events.filter(e => {
        const eDate = new Date(e.date);
        return (
            (e.title.toLowerCase().includes(search) || e.description.toLowerCase().includes(search)) &&
            (!cat || e.category === cat) &&
            (!loc || e.location === loc) &&
            (!from || eDate >= from) &&
            (!to || eDate <= to)
        );
    });

    currentPage = 1;
    renderEvents();
}

function renderEvents() {
    const start = (currentPage - 1) * PER_PAGE;
    const end = start + PER_PAGE;
    const pageEvents = filteredEvents.slice(start, end);

    $('#events-list').empty();
    pageEvents.forEach(e => {
        $('#events-list').append(`
            <div class="event-card" data-id="${e.id}">
                <h3 class="event-title">${e.title}</h3>
                <p class="event-date">${e.date} - ${e.time}</p>
            </div>
        `);
    });

    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredEvents.length / PER_PAGE);
    $('#pagination').empty();
    for (let i = 1; i <= totalPages; i++) {
        const btn = $('<button>').text(i).click(() => {
            currentPage = i;
            renderEvents();
        });
        if (i === currentPage) btn.addClass('disabled');
        $('#pagination').append(btn);
    }
}

function showEventModal(id) {
    const e = events.find(ev => ev.id === id);
    $('#modal-title').text(e.title).data('id', id);
    $('#modal-date').text(`Date: ${e.date}`);
    $('#modal-time').text(`Time: ${e.time}`);
    $('#modal-venue').text(`Venue: ${e.venue}`);
    $('#modal-category').text(`Category: ${e.category}`);
    $('#modal-location').text(`Location: ${e.location}`);
    $('#modal-description').text(`Description: ${e.description}`);
    $('#modal-organizer').text(`Organizer: ${e.organizer}`);
    $('#event-modal').fadeIn();
}

function closeModal() {
    $('.modal').fadeOut();
    $('#login-form, #register-form, #profile-form')[0].reset();
}

function showPopup(message) {
    $('#popup-message').text(message);
    $('#confirm-popup').fadeIn().delay(2000).fadeOut();
}

function renderDashboard() {
    if (!currentUser) {
        $('#registered-events').html('<p>Please login to view your registered events.</p>');
        return;
    }
    const regs = JSON.parse(localStorage.getItem(REG_EVENTS_KEY)) || [];
    const userRegs = regs.filter(r => r.userEmail === currentUser.email);
    const regEvents = events.filter(e => userRegs.some(ur => ur.eventId == e.id));

    $('#registered-events').empty();
    if (regEvents.length === 0) {
        $('#registered-events').html('<p>No registered events.</p>');
    } else {
        regEvents.forEach(e => {
            $('#registered-events').append(`
                <div class="event-card" data-id="${e.id}">
                    <h3 class="event-title">${e.title}</h3>
                    <p class="event-date">${e.date} - ${e.time}</p>
                    <button class="btn cancel-btn" data-id="${e.id}">Cancel</button>
                </div>
            `);
        });
    }
}

function renderCalendarEvents(dayEvents) {
    $('#calendar-events').empty().html('<h3>Events on Selected Day</h3>');
    if (dayEvents.length === 0) {
        $('#calendar-events').append('<p>No events on this day.</p>');
    } else {
        dayEvents.forEach(e => {
            $('#calendar-events').append(`
                <div class="event-card" data-id="${e.id}">
                    <h3 class="event-title">${e.title}</h3>
                    <p class="event-date">${e.date} - ${e.time}</p>
                </div>
            `);
        });
    }
}