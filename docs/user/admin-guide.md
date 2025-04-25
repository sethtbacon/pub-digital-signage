# Admin Guide - Pub Digital Signage

This guide provides instructions for administering the pub digital signage system, including content management, theme configuration, and system maintenance.

## Accessing the Admin Interface

1. **Local Access**:
   - When on the same network as the Raspberry Pi, navigate to:
   - `http://<raspberry-pi-ip>:3000/admin`
   - Default login: admin / pubsignage (change immediately)

2. **Remote Access** (if configured):
   - Access through your configured domain
   - Use VPN if accessing from outside your network for security

## Dashboard Overview

The admin dashboard is divided into several sections:

1. **Content Management**
   - Drinks menu
   - Games and leaderboards
   - Visitor tracking
   - Media galleries
   - Announcements

2. **Theme Management**
   - Time-based themes
   - Custom themes
   - Background media

3. **System Settings**
   - Display configuration
   - Integration settings
   - User management
   - System status

## Content Management

### Managing the Drinks Menu

1. **Adding a New Drink**:
   - Navigate to Content → Drinks
   - Click "Add New Drink"
   - Fill in drink details:
     - Name
     - Category (beer, wine, cocktail, etc.)
     - Description
     - Upload image (optional)
     - Set as featured (optional)
   - Click Save

2. **Editing Existing Drinks**:
   - Click on any drink in the list
   - Modify details as needed
   - Click Save

3. **Setting Featured Drinks**:
   - Toggle the "Featured" switch for drinks you want to highlight
   - Featured drinks appear more prominently on the display

### Game Leaderboards

1. **Adding a New Game**:
   - Navigate to Content → Games
   - Click "Add New Game"
   - Enter game details:
     - Name
     - Description
     - Scoring type (high wins, low wins, etc.)
     - Upload image (optional)
   - Click Save

2. **Recording Game Results**:
   - Click "Record Game Session" 
   - Select the game
   - Enter the date
   - Add players and their scores
   - Click Save

3. **Viewing Leaderboards**:
   - Click "View Leaderboards" to see current rankings
   - Filter by game or time period
   - The system automatically calculates rankings based on game history

### Visitor Tracking

1. **Adding New Visitors**:
   - Navigate to Content → Visitors
   - Click "Add New Visitor"
   - Enter visitor details:
     - Name
     - First visit date
     - Upload photo (optional)
     - Add notes (optional)
   - Click Save

2. **Recording Visits**:
   - Select a visitor from the list
   - Click "Record Visit"
   - Enter the visit date and any notes
   - The system automatically tracks milestones

3. **Managing Milestones**:
   - Navigate to Content → Milestones
   - Add, edit, or remove milestone definitions
   - Default milestones are at 1, 5, 10, 25, and 50 visits

### Media Management

1. **Uploading Media**:
   - Navigate to Content → Media
   - Click "Upload Media"
   - Select files or drag and drop
   - Add tags and descriptions
   - Select category (photos, videos, background, etc.)

2. **Managing Media Library**:
   - Browse by category
   - Filter by tags or date
   - Click on any item to edit its details or delete

3. **Creating Galleries**:
   - Click "Create Gallery"
   - Name the gallery
   - Select images to include
   - Set display options (timing, transition effects)
   - Enable/disable in navigation

## Theme Management

### Time-based Themes

1. **Editing Default Themes**:
   - Navigate to Themes → Time-based
   - Select a time period (Morning, Afternoon, Evening, Night)
   - Customize colors, fonts, and layout
   - Set background image or video
   - Save changes

2. **Theme Scheduling**:
   - Adjust time ranges for each theme
   - Enable/disable specific themes
   - Set theme priority

### Custom Themes

1. **Creating a New Theme**:
   - Navigate to Themes → Custom
   - Click "Create New Theme"
   - Define theme properties:
     - Name
     - Color scheme
     - Background media
     - Font settings
     - Layout options
   - Save theme

2. **Applying Custom Themes**:
   - Enable the theme
   - Set schedule (if time-based)
   - Set as default (optional)

### Background Media

1. **Adding Background Media**:
   - Upload images or videos to the media library
   - Navigate to Themes → Background
   - Select media items for different themes
   - Set display options (fit, position, opacity)

## System Settings

### Display Configuration

1. **Screen Settings**:
   - Navigate to Settings → Display
   - Set resolution
   - Configure rotation timing
   - Adjust transition effects

2. **Navigation Options**:
   - Enable/disable navigation sections
   - Rearrange navigation items
   - Set default landing page

### Integration Settings

1. **Google Calendar**:
   - Enter API credentials
   - Select calendars to display
   - Set update frequency

2. **Home Assistant**:
   - Enter Home Assistant URL and access token
   - Configure entities and automations
   - Test connection

3. **Sports Data**:
   - Enter API key
   - Select sports and teams to follow
   - Configure display options

### User Management

1. **Creating New Users**:
   - Navigate to Settings → Users
   - Click "Add User"
   - Enter user details and permissions
   - Set password or send invitation

2. **Managing Permissions**:
   - Edit user roles
   - Set access restrictions
   - Configure two-factor authentication (if enabled)

### System Maintenance

1. **Backup and Restore**:
   - Navigate to Settings → Maintenance
   - Click "Create Backup" to save current state
   - Use "Restore" to revert to a previous backup

2. **System Updates**:
   - Check for software updates
   - Apply updates when available

3. **Logs and Diagnostics**:
   - View system logs
   - Run diagnostics
   - Check system health

## Troubleshooting

### Common Issues and Solutions

1. **Display Not Updating**:
   - Check network connection
   - Restart browser (Settings → Maintenance → Restart Browser)
   - Verify content is published

2. **Media Not Showing**:
   - Check file formats (supported: JPG, PNG, GIF, MP4)
   - Verify file permissions
   - Check storage space

3. **Integration Problems**:
   - Verify API keys and credentials
   - Check network connectivity to external services
   - Review integration logs (Settings → Logs → Integration)

4. **System Performance Issues**:
   - Clear cache (Settings → Maintenance → Clear Cache)
   - Check for large media files that may affect performance
   - Consider reducing video quality for smoother playback

## Getting Help

For additional support:
- Check the [GitHub repository](https://github.com/yourusername/pub-digital-signage)
- Review the [troubleshooting guide](../setup/troubleshooting.md)
- Open an issue for bugs or feature requests