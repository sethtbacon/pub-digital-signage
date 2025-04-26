# Project Structure

This document outlines the organization of files and directories for the pub digital signage project.

## Root Directory Structure

```
/pub-digital-signage/
├── .dockerignore          # Docker ignore file
├── .eslintignore          # ESLint ignore file
├── .github/               # GitHub specific files (for CI/CD)
│   └── workflows/         # GitHub Actions workflows
├── .gitignore             # Git ignore file
├── .prettierignore        # Prettier ignore file
├── .prettierrc            # Prettier configuration
├── config/                # Configuration files
├── data/                  # Data storage
│   ├── db/                # Database files
│   └── media/             # User-generated media
├── docker-compose.override.yml # Docker Compose override
├── docker-compose.yml     # Docker Compose configuration
├── Dockerfile             # Docker build configuration
├── docs/                  # Documentation files
│   ├── api/               # API documentation
│   ├── development/       # Development guides
│   ├── setup/             # Setup and installation guides
│   └── user/              # User guides
├── LICENSE                # Project license
├── NEXT_STEPS.md          # Project next steps
├── package-lock.json      # NPM dependency lock file
├── package.json           # NPM package configuration
├── prettier.config.js     # Prettier configuration
├── public/                # Public static files
│   ├── fonts/             # Font files
│   ├── img/               # Images
│   └── video/             # Video files
├── README.md              # Project readme
├── scripts/               # Utility scripts
│   ├── backup/            # Backup scripts
│   ├── deploy/            # Deployment scripts
│   ├── dev/               # Development scripts
│   └── setup/             # Setup scripts
├── src/                   # Source code
│   ├── backend/           # Backend Express server
│   ├── frontend/          # Frontend Vue.js application
│   └── shared/            # Shared code and types
├── tests/                 # Test files
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
└── tsconfig.json          # TypeScript configuration
```

## Frontend Structure

```
/src/frontend/
├── .env                  # Environment variables
├── .eslintrc.js          # ESLint configuration
├── App.vue               # Main Vue component
├── assets/               # Frontend assets
│   ├── images/           # Frontend-specific images
│   └── styles/           # CSS/SCSS styles
├── components/           # Vue components
│   ├── common/           # Common UI components
│   ├── layout/           # Layout components
│   └── widgets/          # Widget components for different content types
├── composables/          # Vue composition API functions
│   └── useTheme.js       # Theme management composable
├── constants/            # Constants and enumerations
├── main.js               # Application entry point
├── plugins/              # Vue plugins
│   └── themePlugin.js    # Theme management plugin
├── router/               # Vue router configuration
│   └── index.js          # Router entry point
├── services/             # API and service integrations
│   ├── api/              # API clients
│   ├── calendar/         # Google Calendar integration
│   ├── homeAssistant/    # Home Assistant integration
│   └── sports/           # Sports data integration
├── store/                # State management
│   ├── modules/          # Store modules for different features
│   └── index.js          # Store entry point
├── types/                # TypeScript type definitions
│   └── env.d.ts          # Environment type definitions
├── utils/                # Utility functions
├── views/                # Page views
│   ├── NotFound.vue      # 404 page
│   ├── admin/            # Admin interface views
│   ├── auth/             # Authentication views
│   └── display/          # Main display views
├── vite.config.js        # Vite configuration
└── vitest.config.js      # Vitest testing configuration
```

## Backend Structure

```
/src/backend/
├── .eslintrc.js          # ESLint configuration
├── api/                  # API routes and controllers
│   ├── controllers/      # Controller logic
│   └── routes/           # Route definitions
├── config/               # Backend configuration
├── data/                 # Backend data
│   ├── db/               # Database files
│   └── media/            # Media files
├── db/                   # Database integration
│   ├── migrations/       # Database migrations
│   ├── models/           # Data models
│   └── schemas/          # Database schemas
├── middleware/           # Express middleware
├── package.json          # NPM package configuration
├── server.js             # Server entry point
├── services/             # Business logic services
│   ├── calendar/         # Calendar integration services
│   ├── games/            # Game-related services
│   ├── homeAssistant/    # Home Assistant integration
│   ├── media/            # Media management services
│   └── visitors/         # Visitor tracking services
├── tsconfig.json         # TypeScript configuration
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Configuration Structure

```
/config/
├── default.json          # Default configuration
```

## Data Structure

```
/data/
├── db/
│   └── pubsignage.db     # SQLite database
└── media/
    ├── background/       # Background images
    ├── games/            # Game-related media
    ├── icons/            # UI icons
    │   ├── drinks.svg    # Drinks icon
    │   ├── games.svg     # Games icon
    │   ├── photos.svg    # Photos icon
    │   └── visitors.svg  # Visitors icon
    ├── logo/             # Logo files
    │   └── Orange Pig.svg # Pub logo
    ├── photos/           # User photos
    ├── uploads/          # Temporary upload directory
    └── videos/           # User videos
```

## Documentation Structure

```
/docs/
├── api/                  # API documentation
│   ├── endpoints.md      # API endpoint documentation
│   └── HOME_ASSISTANT_INTEGRATION.md # Home Assistant API documentation
├── development/          # Development guides
│   ├── ARCHITECTURE.md   # System architecture documentation
│   ├── contributing.md   # Contribution guidelines
│   ├── DATABASE_SCHEMA.md # Database schema documentation
│   ├── REQUIREMENTS.md   # System requirements documentation
│   └── Example Pages/    # UI design examples
│       ├── admin_dashboard_example.png
│       ├── admin_theme_management_example.png
│       ├── drink_menu_example_1.png
│       ├── drink_menu_example_2.png
│       └── home_page_example_BBG.png
├── setup/                # Setup and installation guides
│   ├── configuration.md  # Configuration guide
│   ├── IMPLEMENTATION_PLAN.md # Implementation planning document
│   ├── installation.md   # Installation instructions
│   ├── PROJECT_STRUCTURE.md # This file - project structure documentation
│   └── raspberry-pi.md   # Raspberry Pi specific setup instructions
└── user/                 # User guides
    ├── admin-guide.md    # Admin user guide
    ├── CI_CD_GUIDE.md    # Continuous integration guide
    └── content-guide.md  # Content management guide
```

## Scripts Structure

```
/scripts/
├── backup/
│   └── backup-db.sh      # Database backup script
├── deploy/
│   └── restart-services.sh # Restart services script
├── dev/
│   ├── start-dev.sh      # Development environment starter
│   └── test-api.js       # API testing script
└── setup/
    ├── init-db.js        # Database initialization script
    ├── install.sh        # Installation script
    └── seed-data.js      # Sample data generator
```

## Shared Code Structure

```
/src/shared/
├── constants/            # Constants shared between frontend and backend
├── types/                # Shared TypeScript interfaces and types
│   └── index.ts          # Main type definitions entry point
└── utils/                # Utility functions used by both frontend and backend
```

## Test Structure

```
/tests/
├── integration/          # Integration tests
│   ├── auth/             # Authentication tests
│   │   └── login.spec.js # Login integration tests
│   └── views/            # View component tests
│       └── DrinkDisplay.integration.spec.js # Drink display integration tests
└── unit/                 # Unit tests
    ├── components/       # Component unit tests
    │   └── BaseLayout.spec.js # Layout component tests
    ├── router/           # Router tests
    │   └── router.spec.js # Router configuration tests
    ├── services/         # Service unit tests
    └── store/            # State management tests
```

## Public Assets Structure

```
/public/
├── fonts/                # Font files for the application
├── img/                  # Static image assets
└── video/                # Static video assets
```