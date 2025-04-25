/**
 * Main Server Entry Point for Pub Digital Signage
 * 
 * This Express server provides the backend API for the Pub Digital Signage system.
 * It includes:
 * - RESTful API endpoints for content management
 * - SQLite database connection for data persistence
 * - Media file serving capabilities
 * - System status and control endpoints
 * 
 * The API is structured around core content types:
 * - Drinks menu and featured items
 * - Games and leaderboard management
 * - Visitor tracking and milestones
 * - Media management for photos and videos
 * - Theme configuration for display customization
 * - System settings and status information
 */

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const config = require('config');
const Database = require('better-sqlite3');

// Load configuration
const serverConfig = config.get('server');
const dbConfig = config.get('database');

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Logging in development mode

// Static file serving - for uploaded media
app.use('/media', express.static(path.resolve(process.cwd(), 'data/media')));

// Database connection
let db;
try {
  const dbPath = path.resolve(process.cwd(), dbConfig.path);
  console.log(`Connecting to database at ${dbPath}`);
  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  console.log('Database connected successfully');
} catch (err) {
  console.error('Database connection error:', err.message);
  process.exit(1);
}

// Basic root route
app.get('/', (req, res) => {
  res.json({
    message: 'Pub Digital Signage API',
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes - Use the centralized router
app.use('/api', (req, res, next) => {
  // Attach db to request for use in route handlers
  req.db = db;
  next();
});

// Import API routes
const apiRoutes = require('./api/routes');
app.use('/api', apiRoutes);

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.url} not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.name || 'Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start the server
const PORT = process.env.PORT || serverConfig.port || 8080;
const HOST = serverConfig.host || 'localhost';

app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`API available at http://${HOST}:${PORT}/api`);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  // Close database connection gracefully
  if (db) {
    db.close();
  }
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  // Close database connection
  if (db) {
    db.close();
  }
  process.exit(0);
});

module.exports = app; // Export for testing purposes