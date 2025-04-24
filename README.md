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

The home page features sections:
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

## Production Deployment


## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request