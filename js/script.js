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

// Cached LocalStorage data
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];

// Update navigation based on login status
function updateNav() {
    if (currentUser) {
        $('#login-link').hide();
        $('#logout-link').show();
        $('#profile-link').show();
    } else {
        $('#login-link').show();
        $('#logout-link').hide();
        $('#profile-link').hide();
    }
}

// Display events
function displayEvents(filteredEvents, page = 1) {
    const container = $('#events-container');
    container.empty();
    const start = (page - 1) * eventsPerPage;
    const end = start + eventsPerPage;
    const paginatedEvents = filteredEvents.slice(start, end);

    paginatedEvents.forEach(event => {
        const card = $(`
            <div class="col-md-4">
                <div class="card event-card" data-id="${event.id}">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">Date: ${event.date}</p>
                        <p class="card-text">Category: ${event.category}</p>
                        <p class="card-text">Location: ${event.location}</p>
                    </div>
                </div>
            </div>
        `);
        container.append(card);
    });

    setupPagination(filteredEvents.length, page);
}

// Setup pagination
function setupPagination(totalEvents, page) {
    const pagination = $('#pagination');
    pagination.empty();
    const totalPages = Math.ceil(totalEvents / eventsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = $(`<button class="btn btn-outline-primary mx-1 ${i === page ? 'active' : ''}">${i}</button>`);
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
    currentPage = page;
    displayEvents(filtered, page);
}

// Open modal
function openModal(event) {
    if (!currentUser) {
        alert('Please login to register for events.');
        window.location.href = 'login.html';
        return;
    }
    $('#modal-title').text(event.title);
    $('#modal-date').text(`Date: ${event.date}`);
    $('#modal-time').text(`Time: ${event.time}`);
    $('#modal-venue').text(`Venue: ${event.venue}`);
    $('#modal-description').text(`Description: ${event.description}`);
    $('#modal-organizer').text(`Organizer: ${event.organizer}`);
    $('#registration-form').data('event-id', event.id);
    $('#event-modal').modal('show');
}

// Handle registration
$('#registration-form').submit(function(e) {
    e.preventDefault();
    const name = $('#name').val();
    const email = $('#email').val();
    if (name && email && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        const eventId = $(this).data('event-id');
        if (!registeredEvents.some(re => re.eventId === eventId && re.userId === currentUser.email)) {
            registeredEvents.push({ eventId, userId: currentUser.email });
            localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
            $('#event-modal').modal('hide');
            $('#confirmation-popup').modal('show');
        } else {
            alert('Already registered!');
        }
    } else {
        alert('Invalid input!');
    }
});

// Handle login
$('#login-form').submit(function(e) {
    e.preventDefault();
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateNav();
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
});

// Handle registration
$('#register-form').submit(function(e) {
    e.preventDefault();
    const name = $('#register-name').val();
    const email = $('#register-email').val();
    const password = $('#register-password').val();
    if (name && email && password && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        if (users.find(u => u.email === email)) {
            alert('Email already registered.');
        } else {
            users.push({ name, email, password });
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = { name, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateNav();
            window.location.href = 'index.html';
        }
    } else {
        alert('Invalid input.');
    }
});

// Handle profile update
$('#profile-form').submit(function(e) {
    e.preventDefault();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    const name = $('#profile-name').val();
    const email = $('#profile-email').val();
    const password = $('#profile-password').val();
    if (name && email && /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        if (userIndex !== -1 && (!users.some(u => u.email === email && u.email !== currentUser.email))) {
            users[userIndex] = { name, email, password: password || users[userIndex].password };
            localStorage.setItem('users', JSON.stringify(users));
            currentUser = { name, email };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert('Profile updated successfully!');
            window.location.href = 'index.html';
        } else {
            alert('Email already in use.');
        }
    } else {
        alert('Invalid input.');
    }
});

// Handle logout
$('#logout-link').click(function(e) {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateNav();
    window.location.href = 'login.html';
});

// Display registered events
function displayRegistered() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }
    const container = $('#registered-container');
    container.empty();
    registeredEvents.filter(re => re.userId === currentUser.email).forEach(re => {
        const event = events.find(e => e.id === re.eventId);
        if (event) {
            const card = $(`
                <div class="col-md-4">
                    <div class="card event-card">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text">Date: ${event.date}</p>
                            <button class="btn btn-danger cancel-btn" data-id="${event.id}">Cancel</button>
                        </div>
                    </div>
                </div>
            `);
            container.append(card);
        }
    });
}

// Cancel registration
$(document).on('click', '.cancel-btn', function() {
    const id = parseInt($(this).data('id'));
    registeredEvents = registeredEvents.filter(re => !(re.eventId === id && re.userId === currentUser.email));
    localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
    displayRegistered();
});

// Setup calendar with lazy loading
function setupCalendar() {
    const eventDates = events.map(e => e.date);
    $('#datepicker').datepicker({
        beforeShowDay: function(date) {
            const dateStr = $.datepicker.formatDate('yy-mm-dd', date);
            return [true, eventDates.includes(dateStr) ? 'has-event' : ''];
        }
    });
}

// Lazy load calendar when in view
function lazyLoadCalendar() {
    const calendarSection = $('#calendar-section')[0];
    if (calendarSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setupCalendar();
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(calendarSection);
    }
}

// On load
$(document).ready(function() {
    // Update navigation
    updateNav();

    // Page-specific logic
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        filterAndDisplay();
        lazyLoadCalendar();

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
    } else if (window.location.pathname.includes('profile.html')) {
        if (currentUser) {
            $('#profile-name').val(currentUser.name);
            $('#profile-email').val(currentUser.email);
        } else {
            window.location.href = 'login.html';
        }
    } else if (window.location.pathname.includes('login.html') && currentUser) {
        window.location.href = 'index.html';
    }

    // Theme toggle
    $('#theme-toggle').click(() => $('body').toggleClass('dark'));
});