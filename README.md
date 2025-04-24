# Pub Digital Signage

A digital signage solution for home pub displays running on Raspberry Pi 4 connected directly to a monitor via HDMI.

## Project Overview

This project creates a digital signage system that displays:
- Drink menu and specials
- Event announcements
- Sports scores/schedules
- Custom messages and announcements
- Media content (images, videos)
- Board game leaderboards
- Visitor tracking and milestones

## Hardware Requirements

- Raspberry Pi 4 (recommended 4GB+ RAM)
- MicroSD card (32GB+ recommended)
- Monitor/Display with HDMI input
- HDMI cable
- Power supply for Raspberry Pi

## Setup Instructions

1. **Install Dependencies**
   ```bash
   # Clone the repository
   git clone https://github.com/sethtbacon/pub-digital-signage
   cd pub-digital-signage

   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd src/frontend
   npm install
   ```

2. **Configure the Application**
   - Copy `config/default.example.json` to `config/default.json`
   - Update configuration values as needed
   - Ensure media directories exist:
     - `data/media/logo` for pub logo
     - `data/media/background` for background media
     - `data/media/icons` for category icons in the home grid:
       - `data/media/icons/drinks.svg` - Drinks icon
       - `data/media/icons/games.svg` - Games icon
       - `data/media/icons/visitors.svg` - Visitors icon
       - `data/media/icons/photos.svg` - Photos icon

3. **Initialize the Database**
   ```bash
   npm run setup
   ```

4. **Start the Application**
   ```bash
   # Start backend server (runs on port 3000)
   npm run start:backend

   # Start frontend development server (runs on port 8080)
   nnpm run start:backend
   ```

## Admin Interface

Access the admin interface at `/admin` to manage:

### Theme Management (/admin/themes)
- Switch between predefined themes
- Create custom themes
- Configure theme colors:
  - Primary: #96d6dd (default)
  - Secondary: #565059 (default)
  - Accent: #fc4242 (default)
- Upload pub logo
- Set background media (image or video)
- Configure home page grid icons (in `data/media/icons/`)

### Content Management
- Drinks menu (/admin/drinks)
- Games and leaderboards (/admin/games)
- Visitor tracking (/admin/visitors)

## Home Page Layout

The home page features a 2x2 grid layout with tiles for the main sections:
1. **Drinks** - Shows available beverages and specials
2. **Games** - Displays available games and current leaderboards
3. **Visitors** - Shows visitor statistics and milestones
4. **Photos** - Media gallery of pub events and activities

Each tile can be customized with its own icon by placing SVG files in the `data/media/icons/` directory with the corresponding names (drinks.svg, games.svg, visitors.svg, photos.svg).

## Theme System

The application supports multiple theme types:

1. **Custom Theme**
   - Fully customizable colors
   - Custom logo placement
   - Background media support

2. **Time-based Themes**
   - Morning (6:00 - 12:00)
   - Afternoon (12:00 - 18:00)
   - Evening (18:00 - 23:00)
   - Night (23:00 - 6:00)

### Theme Features
- Automatic time-based switching
- Manual override through admin interface
- Support for both static and video backgrounds
- Responsive design for different screen sizes
- Consistent branding with logo placement

## Development

```bash
# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Production Deployment

For production deployment on a Raspberry Pi, follow these additional steps:

1. Build the frontend:
   ```bash
   cd src/frontend
   npm run build
   ```

2. Configure auto-start:
   ```bash
   # Setup instructions for systemd service will be provided
   ```

3. Configure Chromium kiosk mode for the display

Detailed deployment instructions can be found in `docs/setup/installation.md`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request