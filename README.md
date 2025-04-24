# Pub Digital Signage

A digital signage solution for home pub displays running on Raspberry Pi 4 connected directly to a monitor via HDMI.

## Project Overview

This project aims to create a digital signage system that will display information like:
- Drink menu and specials
- Event announcements
- Sports scores/schedules
- Custom messages and announcements
- Media content (images, videos)

## Hardware Requirements

- Raspberry Pi 4 (recommended 4GB+ RAM)
- MicroSD card (32GB+ recommended)
- Monitor/Display with HDMI input
- HDMI cable
- Power supply for Raspberry Pi

## Software Architecture

### Operating System
- Raspberry Pi OS Lite (headless) or Raspberry Pi OS with desktop depending on chosen approach

### Backend Options
1. **Self-hosted on the Raspberry Pi**
   - Web server (Node.js/Express or Python/Flask)
   - Content management system
   - Database for content storage
   - Scheduling system

2. **Remote Management**
   - API endpoints for content updates
   - Authentication system for secure updates

### Frontend Options
1. **Web-based Display**
   - HTML/CSS/JavaScript
   - Chromium in kiosk mode
   - Content rotation using JavaScript

2. **Native Application**
   - Electron-based application
   - Python with Tkinter/PyQt
   - React Native application

### Content Management
- Admin interface for updating content
- Scheduling features for time-based displays
- Content templates for consistent branding

## Implementation Approaches

### Approach 1: Web-based Solution
- Setup Raspberry Pi with Chromium in kiosk mode
- Create web application using HTML/CSS/JavaScript
- Host content locally on Pi or remotely
- Configure auto-start on boot

### Approach 2: Custom Application
- Develop a dedicated display application
- Better control over hardware resources
- Potentially more stable for 24/7 operation

### Connection to Display
- Direct HDMI connection from Raspberry Pi to monitor
- Consider display resolution and orientation (landscape vs portrait)
- Monitor power management settings

## Getting Started

[To be added as project develops]

## Development Roadmap

1. **Phase 1: Basic Setup**
   - Configure Raspberry Pi OS
   - Setup auto-start display mechanism
   - Create basic display template

2. **Phase 2: Content Management**
   - Develop admin interface
   - Implement content database
   - Create content update mechanisms

3. **Phase 3: Advanced Features**
   - Add scheduling capabilities
   - Implement media streaming
   - Add network monitoring and recovery

4. **Phase 4: Remote Management**
   - Develop remote admin capabilities
   - Implement content distribution
   - Add monitoring and analytics

## Maintenance Considerations

- Automatic updates
- Remote monitoring
- Backup and recovery procedures
- Power management (handling unexpected shutdowns)