# Pub Digital Signage - Requirements Document

## Content Requirements

### Core Content Types
1. **Drink List**
   - Display available drinks in the home pub (without prices)
   - Highlight featured/special drinks

2. **"Happy Hour" or Special Information**
   - Fun way to keep engagement
   - Could be themed for different days/events

3. **Events and Entertainment Schedule**
   - Integration with Google Calendar
   - Upcoming events/gatherings at the home pub
   - Special occasions (game nights, tastings, etc.)

4. **Sports Information**
   - Live scores
   - Upcoming games schedule
   - Team standings
   - Highlight favorite teams

5. **Custom Messages and Announcements**
   - Welcome messages
   - Special announcements
   - Fun facts or trivia

6. **Media Content**
   - Photos display/slideshow
   - Short video clips
   - Themed visuals

7. **Board Game Leaderboards**
   - Individual game leaderboards (Settlers of Catan, Cribbage, Monopoly, etc.)
   - Overall pub leaderboard aggregating scores from individual games
   - Game history and statistics

8. **Visitor Tracking**
   - Count of visits for each guest
   - Milestone achievements
   - Highlight special milestones (5th visit, 10th visit, etc.)

9. **User-Generated Content**
   - Photo gallery from pub events
   - Video clips from pub gatherings
   - QR code for easy media uploads by guests

10. **External Data**
    - Weather information
    - Sports scores from various leagues
    - Bloomberg news/financial data
    - Other third-party data sources

## Display Layout Requirements

### Primary Layout
- Single full-screen content with ability to navigate between sections
- Each content type should have its own full-screen view
- Navigation system to move between different content sections

### Interactive Navigation
- Touch/click capability to navigate to specific content areas:
  - Menu display
  - Board game leaderboards
  - Sports information
  - Events calendar
  - Media galleries
- Free video service displayed in full screen when selected

### Display Themes
- Different themes based on time of day (morning, afternoon, evening)
- Seasonal themes (holidays, special events, seasons)
- Ability to schedule theme changes automatically

### Additional Display Elements
- Consider ticker/crawl at bottom for sports scores or announcements
- Date/time display in corner
- Potential QR codes for links to playlists, recipes, etc.
- QR code for guest photo/video uploads

## Technical and Integration Requirements

1. **Calendar Integration**
   - Google Calendar API integration for events
   - Automatic updates when calendar is modified

2. **Sports Data**
   - Integration with sports API for live scores and schedules
   - Focus on preferred sports/teams

3. **Media Management**
   - System for easily adding/updating photos and videos
   - Support for common media formats
   - Slideshow functionality
   - User-generated content upload system

4. **Content Management**
   - Web-based interface for updating content
   - Alternative option for file-based updates via local network or cloud storage
   - Scheduling capabilities for time-based content

5. **System Operations**
   - Automatic startup/shutdown
   - Error recovery
   - Remote management capability

6. **Home Assistant Integration**
   - Connect with Home Assistant for automation
   - Trigger events based on Home Assistant data
   - Control display behavior through Home Assistant

7. **Leaderboard System**
   - Database for tracking game results
   - Interface for entering new game scores
   - Calculation of rankings and statistics
   - Display templates for various board games

8. **Visitor Tracking System**
   - Database for tracking visitor attendance
   - Milestone achievement system
   - Visual recognition of milestones

## User Experience Considerations

1. **Visibility and Readability**
   - Appropriate font sizes for a large 4K TV viewed from relatively close distance
   - High contrast color schemes for pub environment (potentially darker)
   - Clear hierarchy of information
   - Support for 1920x1080 content with ability to utilize 4K resolution

2. **Engagement**
   - Content rotation timing that allows for reading but keeps fresh
   - Engaging transitions
   - Timely and relevant information
   - Interactive elements

3. **Atmosphere Enhancement**
   - Content should enhance the pub atmosphere, not distract
   - Themed content based on occasions or seasons
   - Personalized elements for regulars

## Update Frequency

- Main layouts and structure: Infrequent updates
- Widget/section content: Weekly updates
- Special event information: As needed
- Leaderboards: Update after each game session
- Visitor milestones: Real-time or next-day updates
- Media galleries: Continuous addition of new content

## Future Expansion Possibilities

1. **Mobile Companion App**
   - Allow guests to see what's on tap
   - View upcoming events
   - Upload photos directly

2. **Audio Integration**
   - Music playlist information
   - Potential sound effects for special announcements

3. **Additional Displays**
   - Framework should support expansion to multiple screens
   - Consistent experience across all displays