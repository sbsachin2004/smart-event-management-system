# Smart Event Management System

A modern, responsive web application for managing events like seminars, concerts, workshops, and conferences. Built with HTML5, CSS3, JavaScript, and jQuery.

## Features

### 🏠 Homepage with Upcoming Events
- Responsive event cards with hover effects
- Smooth jQuery animations when loading
- Hero section with call-to-action button
- Featured events showcase

### 🔍 Event Filtering & Search
- Real-time search functionality with jQuery keyup filtering
- Filter events by:
  - Date (jQuery UI date picker with highlighted event dates)
  - Category (Seminars, Concerts, Workshops, Conferences)
  - Location (New York, Los Angeles, Chicago, Online)
- Advanced search through event titles, descriptions, and tags

### 📅 Interactive Calendar
- jQuery UI date picker integration
- Highlighted dates with available events
- Easy date selection for filtering
- Visual event availability indicators

### 📋 Event Details & Registration
- Click-to-view detailed event information in modal/lightbox
- Comprehensive event details:
  - Date, time, and duration
  - Venue and location information
  - Organizer details and contact
  - Pricing and availability status
  - Event tags and categories
- Complete registration form with validation
- Real-time availability tracking

### ✅ Registration Management
- Form validation using JavaScript/jQuery
- Data persistence using localStorage
- Duplicate registration prevention
- Success confirmation with animated popup
- Email and phone number validation

### 📊 User Dashboard
- Personal registration overview
- Statistical cards with animated counters
- Upcoming and past events separation
- Registration cancellation functionality
- Quick access to browse more events

### 🎨 Modern Responsive Design
- Mobile-first responsive design
- CSS Grid and Flexbox layouts
- Works seamlessly on:
  - Mobile devices (320px+)
  - Tablets (768px+)
  - Desktop computers (1024px+)
- Touch-optimized interactions

### 🌙 Theme Support
- Light/Dark mode toggle with jQuery
- Smooth theme transitions
- Persistent theme preference storage
- Accessibility-friendly color schemes

### ⚡ Enhanced User Experience
- Animated loading screen
- Smooth scrolling navigation
- Pagination for event listings (6 events per page)
- Hover effects and micro-interactions
- Ripple effects on button clicks
- Custom scrollbar styling

## Technology Stack

- **HTML5**: Semantic structure and accessibility
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript**: Core functionality and data handling
- **jQuery 3.6.0**: DOM manipulation and UI interactions
- **jQuery UI 1.13.2**: Date picker and enhanced UI components
- **Font Awesome 6.0.0**: Icon library
- **localStorage**: Client-side data persistence

## File Structure

```
event-management-system/
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main stylesheet
│   └── responsive.css     # Responsive design styles
├── js/
│   ├── data.js           # Mock event data and utilities
│   ├── events.js         # Event management functionality
│   ├── dashboard.js      # User dashboard features
│   └── main.js           # Main application logic
├── images/               # Image assets directory
└── README.md            # Project documentation
```

## Setup and Installation

1. **Download the Project**
   ```bash
   # Clone or download the project files
   git clone <repository-url>
   cd event-management-system
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - No server setup required (uses CDN resources)
   - Works with all modern browsers

3. **For Development**
   - Use a local development server for best experience:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

## Usage Guide

### 🏠 Browsing Events
1. Navigate to the homepage to see featured events
2. Use the search bar to find specific events
3. Apply filters by category, location, or date
4. Click on any event card to view detailed information

### 📝 Event Registration
1. Click "Register" on any available event
2. Fill out the registration form with required information
3. Submit the form to confirm registration
4. Receive confirmation popup and email notification

### 📊 Managing Registrations
1. Visit the Dashboard section
2. View your registration statistics
3. See upcoming and past events
4. Cancel registrations if needed
5. Click on any registered event to view details

### 🔧 Customization
- **Theme**: Toggle between light and dark modes using the theme button
- **Navigation**: Use the responsive navigation menu on mobile devices
- **Pagination**: Navigate through events using the pagination controls

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- High contrast mode compatibility
- Screen reader friendly
- Focus management in modals
- Reduced motion support

## Performance Optimizations

- Debounced search functionality
- Efficient DOM manipulation
- CSS animations over JavaScript
- Minimal external dependencies
- Optimized for mobile devices
- Lazy loading of content

## Data Storage

The application uses localStorage to persist:
- User registrations
- Theme preferences
- Form data (temporarily)

**Note**: In a production environment, this would be replaced with a proper backend database.

## Mock Data

The system includes 12 sample events across different categories:
- **Conferences**: Tech summits, business meetings
- **Concerts**: Jazz performances, classical music, rock festivals
- **Workshops**: Digital marketing, web development, photography
- **Seminars**: Leadership training, business strategy

## Future Enhancements

Potential improvements for the system:
- Backend integration with REST API
- Real payment processing
- Email notifications
- Social media sharing
- Event creation interface
- Advanced analytics
- Multi-language support
- Push notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or issues:
- Create an issue in the repository
- Contact: contact@eventhub.com
- Phone: +1 (555) 123-4567

---

**Smart Event Management System** - Built with ❤️ using modern web technologies.
