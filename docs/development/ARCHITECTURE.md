# Pub Digital Signage - Technical Architecture

## System Overview

The pub digital signage system is built on a Raspberry Pi 4 running a web-based application displayed in kiosk mode. The architecture balances local operation reliability with the flexibility of remote content management, and supports interactive features for navigation between content sections.

## Hardware Architecture

- **Raspberry Pi 4**: Core computing platform
- **Display Monitor**: 4K TV connected via HDMI (operating at 1920x1080 with ability to use 4K)
- **Local Storage**: MicroSD card for OS and content
- **Network Connection**: For API integrations, remote management, and Home Assistant connection

## Software Architecture

### Core Components

1. **Operating System Layer**
   - Raspberry Pi OS (Lite or Desktop)
   - Auto-start configuration
   - Power management settings
   - Input handler for touch/click interactions

2. **Application Platform**
   - Web-based front-end (HTML5, CSS3, JavaScript)
   - Chromium browser in kiosk mode
   - Local web server (Node.js/Express)
   - Interactive navigation system

3. **Content Management System**
   - Local database for content storage
   - RESTful API for content manipulation
   - Admin interface for content updates
   - File-based update system (local network/cloud storage)

4. **Integration Services**
   - Google Calendar API connector
   - Sports data API client
   - Weather service integration
   - Bloomberg news API client
   - Home Assistant integration
   - Media management subsystem
   - QR code generation for uploads

5. **Game & Visitor Systems**
   - Board game leaderboard database
   - Visitor tracking database
   - Achievement/milestone system
   - Statistics calculation engine

## Component Details

### Display Engine

- **Rendering**: Browser-based rendering of HTML/CSS/JS content
- **Layout Manager**: Controls screen real estate allocation
- **Navigation System**: Handles user interaction and section switching
- **Transition System**: Handles transitions between content sections
  - Supports multiple animation types (fade, slide, zoom, flip)
  - Configurable transition speeds and timing
  - CSS-based transitions for optimal performance
  - Hardware-accelerated animations using transform properties
- **Media Player**: For images, videos, and animations
- **Theme Manager**: Handles time-based and seasonal theme switching
  - Dynamic CSS variable application for instant theme changes
  - Responsive design adaptation for different screen sizes
  - Supports custom typography, spacing, shadows, and border-radius
  - Smooth transitions between theme states

### Content Management

- **Storage**: JSON or SQLite database
- **Content Types**: Structured data models for different content types
- **Admin Panel**: Web interface for content management
- **Scheduling**: Time-based content display rules
- **File Watcher**: Monitors specified directories for content updates

### External Integrations

- **Google Calendar**: OAuth authentication and event polling
- **Sports APIs**: REST client for scores and schedules
- **Media Storage**: Local and optional cloud storage integration
- **Weather**: Location-based weather data
- **Home Assistant**: API integration for automation and control
- **Financial Data**: Bloomberg API client for financial news/data

### Game & Visitor Management

- **Leaderboard System**:
  - Game results database
  - Scoring algorithms for different games
  - Ranking calculation system
  - Visualization components

- **Visitor System**:
  - Visitor database with visit counts
  - Milestone definition framework
  - Achievement triggers and notifications
  - Visitor recognition display

### User-Generated Content

- **Upload System**:
  - QR code-based upload interface
  - File validation and processing
  - Storage management
  - Gallery display components

## Application Flow

1. System boots and auto-starts Chromium in kiosk mode
2. Web application loads from local server
3. Application initializes and loads content from local database
4. Time-based theme is applied based on current time/date
5. Default view is displayed with navigation options
6. User can interact to navigate between content sections
7. Periodic background jobs update external data (sports, calendar, news)
8. Admin can access management interface locally or remotely

## Content Update Flow

1. Admin accesses web-based control panel
2. Updates content through form-based interfaces
3. Changes stored in local database
4. Display application automatically reflects changes
5. Alternatively, files updated in designated folders are detected and processed
6. No restart required for most content updates

## Technical Considerations

### Security

- Local network operation
- Admin authentication for content management
- HTTPS for API communications
- File validation for user uploads

### Reliability

- Offline operation capability
- Error recovery procedures
- Content caching
- Automatic restart capabilities

### Performance

- Optimized media handling
- Memory management for long-term operation
- Background loading of content
- Efficient theme switching

## Development Stack

- **Front-End**: HTML5, CSS3, JavaScript with Vue.js or React
- **Back-End**: Node.js with Express
- **Database**: SQLite for structured data or LowDB for JSON storage
- **Media Handling**: HTML5 media APIs with specialized libraries as needed
- **Dev Tools**: Git for version control, npm for dependency management

## Deployment Strategy

1. Development on standard computer
2. Testing on Raspberry Pi
3. Production deployment script for clean installation
4. Backup/restore procedures
5. Update mechanism for future enhancements

## Home Assistant Integration

- **Connection Method**: Home Assistant API and webhook integration
- **Automation Triggers**:
  - Time-based display changes
  - Event-triggered content changes
  - Presence detection for visitor tracking
- **Control Interface**:
  - Home Assistant entities for display control
  - Custom service for content updates