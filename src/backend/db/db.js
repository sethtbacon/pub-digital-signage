/**
 * Database connection module
 * Configures and exports a knex instance for database operations
 */

const config = require('config');
const knex = require('knex');
const path = require('path');

// Get database configuration from config
const dbConfig = config.get('database');

// Create absolute path to the database file
const dbPath = path.resolve(
  process.cwd(),
  dbConfig.path
);

// Initialize knex with SQLite configuration
const db = knex({
  client: 'sqlite3',
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
  // Enable foreign key constraints
  pool: {
    afterCreate: (conn, cb) => {
      conn.run('PRAGMA foreign_keys = ON', cb);
    },
  },
});

// Export the configured knex instance
module.exports = db;