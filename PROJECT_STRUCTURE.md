# Project Structure

This document outlines the organization of files and directories for the pub digital signage project.

## Root Directory Structure

```
/pub-digital-signage/
├── docs/                 # Documentation files
│   ├── setup/            # Setup and installation guides
│   └── api/              # API documentation
├── src/                  # Source code
│   ├── frontend/         # Frontend Vue.js application
│   ├── backend/          # Backend Express server
│   └── shared/           # Shared code and types
├── public/               # Public static files
│   ├── img/              # Images
│   ├── video/            # Video files
│   └── fonts/            # Font files
├── data/                 # Data storage
│   ├── db/               # Database files
│   └── media/            # User-generated media
├── config/               # Configuration files
├── scripts/              # Utility scripts
│   ├── setup/            # Setup scripts
│   ├── backup/           # Backup scripts
│   └── deploy/           # Deployment scripts
├── tests/                # Test files
│   ├── unit/             # Unit tests
│   └── integration/      # Integration tests
└── .github/              # GitHub specific files (for CI/CD)
    └── workflows/        # GitHub Actions workflows
```

## Frontend Structure

```
/src/frontend/
├── components/           # Vue components
│   ├── common/           # Common UI components
│   ├── layout/           # Layout components
│   └── widgets/          # Widget components for different content types
│       ├── drinks/       # Drink-related widgets
│       ├── games/        # Game-related widgets
│       ├── visitors/     # Visitor-related widgets
│       ├── events/       # Event calendar widgets
│       ├── sports/       # Sports data widgets
│       ├── media/        # Media gallery widgets
│       └── weather/      # Weather widgets
├── views/                # Page views
│   ├── display/          # Main display views
│   ├── admin/            # Admin interface views
│   └── auth/             # Authentication views
├── router/               # Vue router configuration
├── store/                # Vuex state management
│   ├── modules/          # Store modules for different features
│   └── index.js          # Store entry point
├── assets/               # Frontend assets
│   ├── styles/           # CSS/SCSS styles
│   └── images/           # Frontend-specific images
├── services/             # API and service integrations
│   ├── api/              # API clients
│   ├── homeAssistant/    # Home Assistant integration
│   ├── calendar/         # Google Calendar integration
│   └── sports/           # Sports data integration
├── utils/                # Utility functions
├── constants/            # Constants and enumerations
├── types/                # TypeScript type definitions
├── plugins/              # Vue plugins
└── main.js              # Application entry point
```

## Backend Structure

```
/src/backend/
├── api/                  # API routes and controllers
│   ├── routes/           # Route definitions
│   └── controllers/      # Controller logic
├── db/                   # Database integration
│   ├── models/           # Data models
│   ├── schemas/          # Database schemas
│   └── migrations/       # Database migrations
├── services/             # Business logic services
│   ├── games/            # Game-related services
│   ├── visitors/         # Visitor tracking services
│   ├── calendar/         # Calendar integration services
│   ├── homeAssistant/    # Home Assistant integration
│   └── media/            # Media management services
├── middleware/           # Express middleware
├── utils/                # Utility functions
├── config/               # Backend configuration
├── types/                # TypeScript type definitions
└── server.js             # Server entry point
```

## Configuration Structure

```
/config/
├── default.json          # Default configuration
├── development.json      # Development environment config
├── production.json       # Production environment config
├── test.json             # Test environment config
└── custom-environment-variables.json # Environment variable mapping
```

## Data Structure

```
/data/
├── db/
│   └── pubsignage.db     # SQLite database
├── media/
│   ├── photos/           # User photos
│   ├── videos/           # User videos
│   └── uploads/          # Temporary upload directory
└── backups/              # Database backups
```

## Scripts Structure

```
/scripts/
├── setup/
│   ├── install.sh        # Installation script
│   ├── init-db.js        # Database initialization script
│   └── sample-data.js    # Sample data generator
├── backup/
│   └── backup-db.sh      # Database backup script
├── deploy/
│   ├── deploy.sh         # Deployment script
│   └── post-deploy.sh    # Post-deployment tasks
└── dev/
    └── start-dev.sh      # Development environment starter
```

## Documentation Structure

```
/docs/
├── setup/
│   ├── installation.md   # Installation guide
│   ├── configuration.md  # Configuration guide
│   └── raspberry-pi.md   # Raspberry Pi setup guide
├── api/
│   └── endpoints.md      # API endpoints documentation
├── user/
│   ├── admin-guide.md    # Admin interface guide
│   └── content-guide.md  # Content management guide
└── development/
    └── contributing.md   # Contributing guidelines
```

## Shared Code

```
/src/shared/
├── constants/            # Shared constants
├── types/                # Shared type definitions
└── utils/                # Shared utility functions
```

This structure organizes the project in a way that:
1. Separates concerns between frontend, backend, and shared code
2. Groups related functionality together
3. Makes it easy to find specific components and features
4. Allows for clean separation of configuration and data
5. Provides a clear path for testing and documentation