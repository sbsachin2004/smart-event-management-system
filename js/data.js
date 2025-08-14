// Mock Events Data
const eventsData = [
    {
        id: 1,
        title: "Tech Innovation Summit 2024",
        description: "Join us for a comprehensive summit covering the latest in AI, blockchain, and emerging technologies. Network with industry leaders and learn about cutting-edge innovations.",
        category: "conference",
        location: "new-york",
        locationName: "New York Convention Center",
        date: "2024-09-15",
        time: "09:00",
        endTime: "17:00",
        price: 299,
        organizer: "TechForward Inc.",
        organizerEmail: "contact@techforward.com",
        capacity: 500,
        registered: 342,
        tags: ["technology", "ai", "blockchain", "networking"],
        featured: true
    },
    {
        id: 2,
        title: "Jazz Under the Stars",
        description: "An enchanting evening of smooth jazz performances by renowned artists. Enjoy great music, food, and ambiance under the beautiful starlit sky.",
        category: "concert",
        location: "chicago",
        locationName: "Millennium Park Pavilion",
        date: "2024-09-22",
        time: "19:00",
        endTime: "22:00",
        price: 75,
        organizer: "Chicago Music Society",
        organizerEmail: "events@chicagomusic.org",
        capacity: 1000,
        registered: 756,
        tags: ["music", "jazz", "outdoor", "entertainment"],
        featured: false
    },
    {
        id: 3,
        title: "Digital Marketing Masterclass",
        description: "Learn advanced digital marketing strategies from industry experts. Covers SEO, social media marketing, content strategy, and analytics.",
        category: "workshop",
        location: "online",
        locationName: "Virtual Event",
        date: "2024-09-28",
        time: "14:00",
        endTime: "18:00",
        price: 149,
        organizer: "Marketing Pro Academy",
        organizerEmail: "support@marketingpro.com",
        capacity: 200,
        registered: 89,
        tags: ["marketing", "digital", "seo", "workshop"],
        featured: true
    },
    {
        id: 4,
        title: "Leadership Excellence Seminar",
        description: "Develop your leadership skills with practical workshops and interactive sessions. Perfect for managers and aspiring leaders.",
        category: "seminar",
        location: "los-angeles",
        locationName: "Beverly Hills Hotel",
        date: "2024-10-05",
        time: "10:00",
        endTime: "16:00",
        price: 199,
        organizer: "Leadership Institute",
        organizerEmail: "info@leadershipinstitute.com",
        capacity: 150,
        registered: 67,
        tags: ["leadership", "management", "professional development"],
        featured: false
    },
    {
        id: 5,
        title: "Classical Symphony Night",
        description: "Experience the magic of classical music performed by the Metropolitan Symphony Orchestra. A night of timeless compositions.",
        category: "concert",
        location: "new-york",
        locationName: "Lincoln Center",
        date: "2024-10-12",
        time: "20:00",
        endTime: "22:30",
        price: 120,
        organizer: "Metropolitan Symphony",
        organizerEmail: "tickets@metsymphony.org",
        capacity: 2000,
        registered: 1456,
        tags: ["classical", "orchestra", "music", "formal"],
        featured: true
    },
    {
        id: 6,
        title: "Web Development Bootcamp",
        description: "Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and MongoDB.",
        category: "workshop",
        location: "chicago",
        locationName: "Tech Hub Chicago",
        date: "2024-10-18",
        time: "09:00",
        endTime: "17:00",
        price: 599,
        organizer: "Code Academy Plus",
        organizerEmail: "admin@codeacademyplus.com",
        capacity: 50,
        registered: 23,
        tags: ["coding", "web development", "react", "bootcamp"],
        featured: false
    },
    {
        id: 7,
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas to a panel of investors. Network with entrepreneurs and industry professionals.",
        category: "conference",
        location: "los-angeles",
        locationName: "Santa Monica Pier",
        date: "2024-10-25",
        time: "13:00",
        endTime: "18:00",
        price: 25,
        organizer: "Startup LA",
        organizerEmail: "events@startupla.com",
        capacity: 300,
        registered: 178,
        tags: ["startup", "entrepreneurship", "investment", "networking"],
        featured: false
    },
    {
        id: 8,
        title: "Mind & Body Wellness Workshop",
        description: "Comprehensive workshop focusing on mental health, meditation, yoga, and holistic wellness practices for modern professionals.",
        category: "workshop",
        location: "online",
        locationName: "Virtual Wellness Center",
        date: "2024-11-02",
        time: "11:00",
        endTime: "15:00",
        price: 89,
        organizer: "Wellness First",
        organizerEmail: "hello@wellnessfirst.com",
        capacity: 100,
        registered: 34,
        tags: ["wellness", "meditation", "yoga", "mental health"],
        featured: true
    },
    {
        id: 9,
        title: "Rock Music Festival",
        description: "Three days of non-stop rock music featuring local and international bands. Food trucks, merchandise, and camping available.",
        category: "concert",
        location: "chicago",
        locationName: "Grant Park",
        date: "2024-11-08",
        time: "12:00",
        endTime: "23:00",
        price: 189,
        organizer: "Rock Fest Productions",
        organizerEmail: "info@rockfestpro.com",
        capacity: 5000,
        registered: 2134,
        tags: ["rock", "festival", "outdoor", "multi-day"],
        featured: true
    },
    {
        id: 10,
        title: "Data Science & AI Conference",
        description: "Explore the latest developments in data science, machine learning, and artificial intelligence with hands-on workshops.",
        category: "conference",
        location: "new-york",
        locationName: "Javits Center",
        date: "2024-11-15",
        time: "08:30",
        endTime: "18:00",
        price: 399,
        organizer: "Data Science Society",
        organizerEmail: "contact@datasciencesociety.org",
        capacity: 800,
        registered: 456,
        tags: ["data science", "ai", "machine learning", "technology"],
        featured: false
    },
    {
        id: 11,
        title: "Creative Photography Workshop",
        description: "Learn advanced photography techniques, composition, and post-processing skills from professional photographers.",
        category: "workshop",
        location: "los-angeles",
        locationName: "Venice Beach Studios",
        date: "2024-11-22",
        time: "10:00",
        endTime: "16:00",
        price: 179,
        organizer: "Visual Arts Collective",
        organizerEmail: "workshops@visualarts.com",
        capacity: 25,
        registered: 12,
        tags: ["photography", "creative", "arts", "hands-on"],
        featured: false
    },
    {
        id: 12,
        title: "Business Strategy Seminar",
        description: "Learn proven business strategies for growth, market expansion, and competitive advantage from successful entrepreneurs.",
        category: "seminar",
        location: "online",
        locationName: "Virtual Conference Room",
        date: "2024-11-29",
        time: "15:00",
        endTime: "19:00",
        price: 249,
        organizer: "Business Growth Partners",
        organizerEmail: "seminars@businessgrowth.com",
        capacity: 150,
        registered: 78,
        tags: ["business", "strategy", "entrepreneurship", "growth"],
        featured: true
    }
];

// Location mapping for display
const locationMap = {
    "new-york": "New York, NY",
    "los-angeles": "Los Angeles, CA", 
    "chicago": "Chicago, IL",
    "online": "Online Event"
};

// Category mapping for display
const categoryMap = {
    "seminar": "Seminar",
    "concert": "Concert",
    "workshop": "Workshop",
    "conference": "Conference"
};

// Function to get events with filters
function getEvents(filters = {}) {
    let filteredEvents = [...eventsData];
    
    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(event => 
            event.title.toLowerCase().includes(searchTerm) ||
            event.description.toLowerCase().includes(searchTerm) ||
            event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
    
    // Apply category filter
    if (filters.category) {
        filteredEvents = filteredEvents.filter(event => event.category === filters.category);
    }
    
    // Apply location filter
    if (filters.location) {
        filteredEvents = filteredEvents.filter(event => event.location === filters.location);
    }
    
    // Apply date filter
    if (filters.date) {
        filteredEvents = filteredEvents.filter(event => event.date === filters.date);
    }
    
    // Sort by date (upcoming first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return filteredEvents;
}

// Function to get event by ID
function getEventById(id) {
    return eventsData.find(event => event.id === parseInt(id));
}

// Function to get featured events
function getFeaturedEvents(limit = 6) {
    return eventsData
        .filter(event => event.featured)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, limit);
}

// Function to get events with dates for calendar highlighting
function getEventDates() {
    return eventsData.map(event => event.date);
}

// Function to format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Function to format time for display
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
}

// Function to calculate days until event
function getDaysUntilEvent(dateString) {
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Function to check if event is sold out
function isEventSoldOut(event) {
    return event.registered >= event.capacity;
}

// Function to get availability status
function getAvailabilityStatus(event) {
    const available = event.capacity - event.registered;
    const percentage = (event.registered / event.capacity) * 100;
    
    if (percentage >= 100) return { status: 'sold-out', message: 'Sold Out' };
    if (percentage >= 90) return { status: 'limited', message: `Only ${available} spots left` };
    if (percentage >= 75) return { status: 'filling-fast', message: 'Filling Fast' };
    return { status: 'available', message: `${available} spots available` };
}
