# Next Steps for Pub Digital Signage

This document outlines the immediate actions and development path for implementing the Pub Digital Signage project based on the completed planning documents.

## Immediate Actions (Week 1) - COMPLETED ✅

### 1. Confirm Technology Stack ✅
- **Frontend Framework**: Vue.js (recommended for reactive components and ease of development)
- **Backend**: Node.js with Express (for API and content management)
- **Database**: SQLite (using the schema defined in DATABASE_SCHEMA.md)
- **Development Environment**: Set up VSCode with appropriate plugins for the stack

### 2. Repository & Project Structure Setup ✅
- Initialize Git repository ✅
- Create folder structure as outlined in PROJECT_STRUCTURE.md ✅
- Set up npm project with initial dependencies ✅
- Create basic .gitignore file to exclude node_modules, env files, etc. ✅

### 3. Development Environment Setup ✅
- Create Docker development environment for consistent development ✅
- Set up ESLint and Prettier for code quality ✅
- Configure TypeScript for type safety ✅
- Create development scripts for running the application locally ✅

## Current Focus - Core Application Setup (Week 2)

### 4. Core Application Setup ⏳
- Create basic Express server
- Set up Vue.js frontend project
- Configure Webpack/Vite for bundling
- Establish connection between frontend and backend
- Create basic theme system foundation

## Phase 1 Implementation Tasks (Weeks 1-2)

### Frontend Development
1. Create responsive layout framework ⏳
   - Implement base layout components
   - Design grid system for content placement
   - Build navigation component
   - Implement theme switching mechanism

2. Build core display components
   - Develop home screen grid with main navigation icons
   - Create base content display templates for each content type
   - Implement transitions between different content views
   - Design admin interface wireframes

3. Implement basic theme system
   - Create CSS variables for theme colors
   - Implement time-based theme switching
   - Design default themes (morning, afternoon, evening, night)

### Backend Development
1. Set up database ✅
   - Create SQLite database with initial schema ✅
   - Implement database connection and ORM layer ⏳
   - Create seed data for testing ✅
   - Build basic CRUD operations for all content types ⏳

2. Develop API endpoints
   - Implement RESTful API for content management
   - Create authentication mechanism for admin interface
   - Build endpoints for theme management
   - Develop system status and control endpoints

3. Create file management system
   - Set up media file storage structure
   - Implement file upload handlers
   - Create media processing utilities (resize, optimize)
   - Build file browsing and selection API

### System Configuration
1. Create configuration system
   - Develop environment-based configuration
   - Define default settings
   - Create configuration UI in admin interface
   - Implement secure storage for API keys and tokens

2. Raspberry Pi setup
   - Create Raspberry Pi OS installation script
   - Configure auto-start for Chromium in kiosk mode
   - Set up local network access and remote management
   - Implement power management and monitoring

## First Demo Milestone (End of Week 2)
- Working application with basic navigation
- Sample content display for drinks and games
- Admin interface for content management
- Theme switching based on time of day
- Running successfully on Raspberry Pi in kiosk mode

## Phase 2 Focus Areas (Weeks 3-4)

1. **Content Type Implementation**
   - Drinks list display and management
   - Game leaderboards and score entry
   - Visitor tracking system
   - Media gallery implementation

2. **Admin Interface Enhancement**
   - Complete admin dashboard
   - Content scheduling system
   - Media upload and management
   - User management (if multiple admins)

3. **Database Refinement**
   - Implement full database schema
   - Create database backup system
   - Build data export/import features
   - Optimize queries for performance

## Technology-Specific Tasks

### Vue.js Setup
- Initialize Vue project with Vue CLI or Vite
- Set up Vue Router for navigation
- Configure Vuex/Pinia for state management
- Create base component library

### Express Backend
- Configure middleware (CORS, body-parser, etc.)
- Set up route structure
- Implement authentication (JWT or session-based)
- Create error handling and logging system

### SQLite Implementation
- Set up Knex.js or similar ORM
- Create migration scripts
- Implement the views defined in DATABASE_SCHEMA.md
- Set up automated backup process

## Development Workflow

1. **Local Development**
   - Develop and test features on development machine
   - Use mock data for external integrations during development
   - Run automated tests for each component

2. **Raspberry Pi Testing**
   - Deploy to test Raspberry Pi environment
   - Verify performance and display on target hardware
   - Test interaction with actual TV/display

3. **Version Control**
   - Use feature branches for development
   - Create pull requests for code review
   - Tag stable versions for deployment

4. **CI/CD Implementation**
   - Set up GitHub Actions for automated testing
   - Create deployment script for Raspberry Pi
   - Implement automated backup before deployment

## External Integration Priorities

1. **Home Assistant** (High Priority)
   - Research API connection options
   - Implement authentication
   - Create basic entity for display control
   - Test basic automation trigger

2. **Google Calendar** (Medium Priority)
   - Set up OAuth authentication
   - Implement calendar polling
   - Create event display component
   - Test automatic updates

3. **Sports Data** (Lower Priority)
   - Research available API options
   - Implement basic score retrieval
   - Create sports display component
   - Set up regular data refresh

## Next Planning Meeting Agenda
1. Review technology stack decisions
2. Assign initial development tasks
3. Set up development environment
4. Create first sprint goals
5. Plan testing approach and criteria

## Getting Started Today

1. Clone the repository
2. Run `npm install` in both frontend and backend directories
3. Copy `.env.example` to `.env` and configure local settings
4. Run `npm run dev` to start the development server
5. Access the application at http://localhost:3000