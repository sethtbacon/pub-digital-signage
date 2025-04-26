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

### 4. Core Application Setup ✅
- Create basic Express server ✅
- Set up Vue.js frontend project ✅
- Set up a more detailed content management interface in the admin section ✅
- Create additional display views for games, visitors, media, and events similar to the DrinkDisplay view ✅
- Configure Webpack/Vite for bundling ✅
- Establish connection between frontend and backend ✅
- Create basic theme system foundation ✅

## Phase 1 Implementation Tasks (Weeks 1-2)

### Frontend Development
1. Create responsive layout framework ✅
   - Create a home page using the concept of widgets in grid system for content placement ✅
   - Implement base layout components ✅
   - Build navigation component ✅
   - Create a page for drinks ✅
   - Create a page for board games ✅
   - Create a page for visitor milestones ✅
   - Implement theme switching mechanism ✅

2. Build core display components ⏳
   - Develop home screen grid with main navigation icons ✅
   - Create base content display templates for each content type ✅
   - Implement transitions between different content views
   - Design admin interface wireframes ✅

3. Implement basic theme system ✅
   - Create CSS variables for theme colors ✅
   - Implement time-based theme switching ✅
   - Design default themes (morning, afternoon, evening, night) ✅
   
4. Theme System Improvements
   - **Theme Storage Location**: Store custom themes in database to sync across devices and persist beyond browser cache clears
   - **Stylesheet Optimization**: Implement a more structured approach to shared styles instead of using @extend for repeated styles like .primary-button
   - **SCSS Variables Integration**: Create SCSS variables mirroring CSS variables for better compile-time checking and SCSS function usage (darken, lighten, etc.)
   - **Theme Transition Effects**: Add smooth transitions when changing themes with transition properties on elements that change with theme
   - **Additional Theme Properties**: Extend themes beyond colors to include typography, border-radius, shadow styles, etc.
   - **Responsive Theme Adjustments**: Allow different theme settings based on screen sizes
   - **Theme Presets**: Add functionality to save and load theme presets for quick switching

### Backend Development
1. Set up database ✅
   - Create SQLite database with initial schema ✅
   - Implement database connection and ORM layer ✅
   - Create seed data for testing ✅
   - Build basic CRUD operations for all content types ✅

2. Develop API endpoints ✅
   - Implement RESTful API for content management ✅
   - Create authentication mechanism for admin interface ⏳
   - Build endpoints for theme management ✅
   - Develop system status and control endpoints ✅

3. Create file management system ⏳
   - Set up media file storage structure
   - Implement file upload handlers
   - Create media processing utilities (resize, optimize)
   - Build file browsing and selection API

### System Configuration
1. Create configuration system ⏳
   - Develop environment-based configuration
   - Define default settings
   - Create configuration UI in admin interface
   - Implement secure storage for API keys and tokens

2. Raspberry Pi setup
   - Create Raspberry Pi OS installation script
   - Configure auto-start for Chromium in kiosk mode
   - Set up local network access and remote management
   - Implement power management and monitoring

## First Demo Milestone (End of Week 2) - APPROACHING COMPLETION
- Working application with basic navigation ✅
- Sample content display for drinks and games ✅
- Admin interface for content management ✅
- Theme switching based on time of day ✅
- Running successfully on Raspberry Pi in kiosk mode ⏳

## Phase 2 Focus Areas (Weeks 3-4) - UPCOMING

1. **Content Type Implementation**
   - Drinks list display and management ✅
   - Game leaderboards and score entry ⏳
   - Visitor tracking system ⏳
   - Media gallery implementation ⏳

2. **Admin Interface Enhancement**
   - Complete admin dashboard ✅
   - Content scheduling system
   - Media upload and management
   - User management (if multiple admins)

3. **Database Refinement**
   - Implement full database schema ✅
   - Create database backup system
   - Build data export/import features
   - Optimize queries for performance

4. **External Data Integration**
   - Market data display (as seen in Bloomberg-style dashboard)
   - TV schedule integration
   - Weather information
   - News headlines ticker

## Technology-Specific Tasks

### Vue.js Setup ✅
- Initialize Vue project with Vue CLI or Vite ✅
- Set up Vue Router for navigation ✅
- Configure Vuex/Pinia for state management ✅
- Create base component library ✅

### Express Backend ✅
- Configure middleware (CORS, body-parser, etc.) ✅
- Set up route structure ✅
- Implement authentication (JWT or session-based) ⏳
- Create error handling and logging system ✅

### SQLite Implementation ✅
- Set up Knex.js or similar ORM ✅
- Create migration scripts ✅
- Implement the views defined in DATABASE_SCHEMA.md ✅
- Set up automated backup process

## Development Workflow

1. **Local Development**
   - Develop and test features on development machine ✅
   - Use mock data for external integrations during development ✅
   - Run automated tests for each component ⏳

2. **Raspberry Pi Testing**
   - Deploy to test Raspberry Pi environment
   - Verify performance and display on target hardware
   - Test interaction with actual TV/display

3. **Version Control** ✅
   - Use feature branches for development ✅
   - Create pull requests for code review ✅
   - Tag stable versions for deployment ⏳

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

4. **Market Data** (Medium Priority)
   - Select financial data API provider
   - Implement basic market data display
   - Create stock/crypto ticker components
   - Configure regular updates

## Test Infrastructure Improvements

Based on recent test runs, the following improvements are needed for the frontend test infrastructure:

### 1. Pinia Store Testing Setup
- Resolve the Pinia library issue as it requires running it with legacy
- Configure `createTestingPinia()` properly in store tests
- Fix store initialization in test setup files
- Address the "getActivePinia()" errors in mediaStore, themeStore, and visitorStore tests

### 2. Vue Router Mocking
- Properly mock Vue Router in component tests to avoid "Cannot read properties of undefined" errors
- Fix router.beforeEach mock setup in router tests
- Create reusable router mocking utilities for component tests

### 3. API Testing Alignment
- Align API endpoint expectations in tests with actual implementation
- Fix path discrepancies in gamesApi tests (e.g., "/api/games/leaderboard" vs "/api/games/leaderboard/overall")
- Create consistent API mocking approach across all tests

### 4. Test Coverage Expansion
- Fix and complete existing tests before adding new ones
- Prioritize fixing tests in this order:
  1. Infrastructure issues (Pinia, Vue Router)
  2. Component tests
  3. Integration tests
- Add new tests for recently developed features

### 5. Integration Test Environment
- Set up proper environment for integration tests
- Fix missing module errors in integration tests
- Create consistent test data fixtures

## Project Structure Improvements

To enhance maintainability, scalability, and developer experience, the following structural improvements are recommended:

### 1. Environment Configuration Files
- Add `.env` files at project root and backend directory (currently only in frontend)
- Create `.env.example` files in each location to help new developers get set up quickly
- Document environment variables in README.md

### 2. Type Consistency
- Fully adopt TypeScript across both frontend and backend
- Convert remaining JavaScript files to TypeScript
- Standardize and enhance type definitions in shared/types
- Enable stricter TypeScript configuration for better type safety

### 3. Testing Structure Enhancement
- Mirror the `src` directory structure in the `tests` directory for easier navigation
- Organize test files to match their implementation counterparts
- Create consistent naming conventions for test files

### 4. Documentation Improvements
- Add CHANGELOG.md to track version changes
- Create API.md for API documentation in OpenAPI format
- Enhance existing documentation with more examples and diagrams

### 5. Docker Organization
- Move Docker-related files (Dockerfile, docker-compose files) to a dedicated `docker` directory
- Separate development and production Docker configurations
- Create Docker documentation with usage instructions

### 6. Separation of Config
- Separate environment-specific configurations into distinct files:
  - development.json
  - production.json
  - testing.json
- Use config merging to maintain a core default.json with overrides

### 7. Build Output Directory
- Add dedicated `dist` or `build` directories for compiled output
- Update .gitignore to exclude build artifacts
- Create consistent build output structure for frontend and backend

### 8. Dependency Management
- Implement a monorepo tool like Lerna or Yarn Workspaces
- Centralize common dependencies to reduce duplication
- Create consistent versioning strategy across packages

### 9. Shared Assets
- Create a shared assets directory for resources used by both frontend and backend
- Implement a consistent approach for accessing shared assets
- Document asset management workflow

### 10. Standard Components Library
- Create a dedicated components library directory in shared code
- Implement storybook for component documentation and testing
- Standardize component API patterns

## Next Tasks (Priority Order)
1. Complete authentication mechanism for admin interface
2. Implement file management system for media
3. Finish transitions between different content views
4. Set up Raspberry Pi in kiosk mode
5. Begin integration of external data sources (market data, TV schedule)

## Getting Started Today

1. Clone the repository
2. Run `npm install` in both frontend and backend directories
3. Copy `.env.example` to `.env` and configure local settings
4. Run `npm run dev` to start the development server
5. Access the application at http://localhost:3000