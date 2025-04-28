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

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pub-digital-signage.git
   cd pub-digital-signage
   ```

2. **Quick Setup (Recommended)**
   ```bash
   # For development environment
   npm run setup:dev
   
   # For production environment (includes build)
   npm run setup
   ```

   This will:
   - Install all dependencies
   - Initialize the database
   - Create default configurations

3. **Alternatively, follow these steps manually**

   a. Install dependencies
   ```bash
   npm run install:all
   ```

   b. Configure the application
   ```bash
   cp config/default.json config/local.json
   # Edit local.json with your specific settings
   ```

   c. Set up the database
   ```bash
   npm run db:init
   ```

   d. Add sample data (optional)
   ```bash
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   # For JavaScript development
   npm run dev
   
   # For TypeScript development
   npm run dev:ts
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

6. **Deploy to Raspberry Pi**
   See detailed instructions in [Raspberry Pi Setup Guide](docs/setup/raspberry-pi.md)

## Docker Development Environment

We provide a Docker setup for consistent development across machines:

1. **Start the Docker environment**
   ```bash
   docker-compose up
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - Database Admin: http://localhost:8081

3. **Run tests in Docker**
   ```bash
   docker-compose --profile testing up test-runner
   ```

## Development Tools

This project uses TypeScript, ESLint and Prettier to maintain consistent code style and quality:

### TypeScript Support

```bash
# Run type checking
npm run type-check

# Watch for TypeScript errors during development
npm run type-check:watch
```

### Code Quality

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Get test coverage
npm run test:coverage
```

### Database Management

```bash
# Initialize the database with schema
npm run db:init

# Seed the database with sample data
npm run db:seed
```

For more details on our code style and development workflow, see the [Contributing Guide](docs/development/contributing.md).

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

This project uses:
- Vue.js 3 for the frontend
- Node.js/Express for the backend
- SQLite for the database
- Docker for development environment

### Code Structure

- `/src/frontend` - Vue.js frontend application
- `/src/backend` - Express backend API
- `/src/shared` - Shared code between frontend and backend
- `/data` - Database and media storage
- `/config` - Application configuration
- `/scripts` - Utility scripts

### Available Scripts

- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Build frontend for production
- `npm run test` - Run tests for frontend and backend
- `npm run lint` - Run linting for frontend and backend

For more details, see [Contributing Guide](docs/development/contributing.md)

## Production Deployment

For detailed deployment instructions, see:
- [Installation Guide](docs/setup/installation.md)
- [Raspberry Pi Setup](docs/setup/raspberry-pi.md)
- [CI/CD Pipeline Guide](docs/user/CI_CD_GUIDE.md)

## Contributing

1. Fork the repository
2. Create your feature branch 
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

For detailed contribution guidelines, see [Contributing Guide](docs/development/contributing.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.