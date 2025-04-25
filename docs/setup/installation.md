# Installation Guide

This guide provides detailed instructions for installing the Pub Digital Signage application on different platforms. Follow these steps to get your digital signage solution up and running.

## Prerequisites

Before installation, ensure your system meets these requirements:

### For Development

- Node.js 16+ and npm 8+
- Git
- SQLite 3.30+
- Docker and Docker Compose (optional but recommended)

### For Raspberry Pi Deployment

- Raspberry Pi 4 (4GB+ RAM recommended)
- Raspberry Pi OS Bullseye or newer
- 32GB+ MicroSD card
- Display with HDMI input
- Keyboard and mouse for initial setup
- Internet connection (Wi-Fi or Ethernet)

## Installation Options

Choose one of the following installation methods:

1. [Docker Development Environment](#docker-development-environment) (recommended for development)
2. [Manual Installation](#manual-installation) (for development or custom setups)
3. [Raspberry Pi Deployment](#raspberry-pi-deployment) (for production use)

## Docker Development Environment

This is the recommended way to set up your development environment as it provides a consistent environment for all developers.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pub-digital-signage.git
cd pub-digital-signage
```

### 2. Create Configuration

```bash
cp config/default.json config/local.json
# Edit local.json with your preferred settings
```

### 3. Start Docker Environment

```bash
# Build and start containers
docker-compose up
```

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Database Admin: http://localhost:8081

### 5. Stop Docker Environment

When you're done developing, press `Ctrl+C` in the terminal or run:

```bash
docker-compose down
```

## Manual Installation

If you prefer not to use Docker, you can install the application manually.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pub-digital-signage.git
cd pub-digital-signage
```

### 2. Quick Setup (Recommended)

```bash
# For development environment
npm run setup:dev

# For production environment (includes building the application)
npm run setup
```

This will:
- Install all dependencies (root, frontend, and backend)
- Initialize the database with tables
- Create default configuration if needed

### 3. Manual Setup Steps

If you prefer to perform the setup manually:

```bash
# Install all dependencies (root, frontend, and backend)
npm run install:all

# Create configuration
cp config/default.json config/local.json
# Edit local.json with your preferred settings

# Initialize the database
npm run db:init

# Optional: Seed with sample data for development
npm run db:seed
```

### 4. Start Development Servers

```bash
# Start both frontend and backend servers (JavaScript)
npm run dev

# Or, if using TypeScript development:
npm run dev:ts
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080

## Raspberry Pi Deployment

For detailed instructions on setting up the Raspberry Pi for production use, see the [Raspberry Pi Setup Guide](raspberry-pi.md).

### Quick Raspberry Pi Setup

If you're already familiar with Raspberry Pi setup, here's a brief overview:

1. Flash Raspberry Pi OS to your MicroSD card using the Raspberry Pi Imager
2. Configure OS settings including Wi-Fi and SSH
3. Boot the Raspberry Pi and complete initial setup
4. Clone the repository and install dependencies
5. Set up kiosk mode and auto-start
6. Configure network settings for local access

## Configuration Options

After installation, you'll need to configure your application. Edit `config/local.json` to customize these settings:

### Server Configuration

```json
{
  "server": {
    "port": 3000,
    "host": "localhost"
  }
}
```

### Database Configuration

```json
{
  "database": {
    "path": "./data/db/pubsignage.db"
  }
}
```

### Home Assistant Integration (optional)

```json
{
  "homeAssistant": {
    "url": "http://your-home-assistant:8123",
    "token": "your_long_lived_access_token"
  }
}
```

### Media Configuration

```json
{
  "media": {
    "storagePath": "./data/media",
    "allowedTypes": ["image/jpeg", "image/png", "image/gif", "video/mp4"]
  }
}
```

## Directory Structure

The application is organized in the following directory structure:

- `src/` - Source code (frontend and backend)
- `config/` - Configuration files
- `data/` - Data storage (database and media)
- `scripts/` - Utility scripts
- `public/` - Static public assets
- `docs/` - Documentation

For more details on the project structure, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md).

## Common Installation Issues

### Database Permission Errors

Symptoms: Cannot write to database, permission errors
Solution:
```bash
# Set correct permissions on data directory
chmod -R 755 data/
chmod -R 644 data/db/pubsignage.db
```

### Node.js Version Issues

Symptoms: Unexpected errors when starting the application
Solution: Ensure you're using Node.js 16+
```bash
node -v # Should be v16.0.0 or higher
```

### Port Conflicts

Symptoms: Server won't start, "port already in use" error
Solution: Change the port in config/local.json, or stop the process using the port

## Next Steps

After installation, you should:

1. **Set up your theme**: Configure the appearance of your digital signage
2. **Add your content**: Add drinks, games, visitors, and other content
3. **Configure integrations**: Set up calendar or Home Assistant integration
4. **Test the display**: Ensure everything displays correctly on your monitor

## Updating the Application

To update to the latest version:

```bash
git pull
npm run install:all
npm run build
```

For Docker:
```bash
git pull
docker-compose down
docker-compose up --build
```

## Support

If you encounter issues during installation:

- Check the [troubleshooting guide](troubleshooting.md)
- Open an issue on GitHub with detailed information about your problem
- Join our community chat for real-time assistance