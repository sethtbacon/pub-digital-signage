#!/usr/bin/env node

/**
 * Database initialization script
 * Creates SQLite database and tables based on schema in docs/development/DATABASE_SCHEMA.md
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('config');

// Initialize database from configuration
const dbConfig = config.get('database');
const dbPath = path.resolve(process.cwd(), dbConfig.path);
const dbDir = path.dirname(dbPath);

console.log('Database initialization starting...');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to database (creates it if it doesn't exist)
console.log(`Connecting to database at ${dbPath}`);
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Create tables
console.log('Creating database tables...');

// Create visitors table
db.exec(`
CREATE TABLE IF NOT EXISTS visitors (
  visitor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  photo_path TEXT,
  first_visit_date TEXT NOT NULL,
  visit_count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create visits table
db.exec(`
CREATE TABLE IF NOT EXISTS visits (
  visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  visit_date TEXT NOT NULL,
  milestone_achieved TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
);
`);

// Create milestones table
db.exec(`
CREATE TABLE IF NOT EXISTS milestones (
  milestone_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  visit_count INTEGER UNIQUE,
  reward TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create games table
db.exec(`
CREATE TABLE IF NOT EXISTS games (
  game_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_path TEXT,
  scoring_type TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create game_sessions table
db.exec(`
CREATE TABLE IF NOT EXISTS game_sessions (
  session_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  session_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);
`);

// Create player_results table
db.exec(`
CREATE TABLE IF NOT EXISTS player_results (
  result_id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  visitor_id INTEGER NOT NULL,
  score REAL NOT NULL,
  position INTEGER,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
);
`);

// Create drinks table
db.exec(`
CREATE TABLE IF NOT EXISTS drinks (
  drink_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  image_path TEXT,
  is_featured BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create content_schedule table
db.exec(`
CREATE TABLE IF NOT EXISTS content_schedule (
  schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,
  content_id INTEGER,
  start_date TEXT,
  end_date TEXT,
  start_time TEXT,
  end_time TEXT,
  days_of_week TEXT,
  priority INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// Create views
console.log('Creating database views...');

// Create milestone_progress view
db.exec(`
CREATE VIEW IF NOT EXISTS milestone_progress AS
SELECT 
  v.visitor_id,
  v.name,
  v.visit_count,
  m.name AS next_milestone,
  m.description AS milestone_description,
  m.visit_count AS milestone_count,
  (m.visit_count - v.visit_count) AS visits_needed
FROM visitors v
JOIN milestones m ON m.visit_count > v.visit_count
WHERE m.visit_count = (
  SELECT MIN(visit_count) 
  FROM milestones 
  WHERE visit_count > v.visit_count
)
ORDER BY v.visit_count DESC;
`);

// Create pub_overall_leaderboard view
db.exec(`
CREATE VIEW IF NOT EXISTS pub_overall_leaderboard AS
SELECT 
  v.visitor_id,
  v.name,
  v.visit_count,
  COUNT(DISTINCT gs.session_id) AS total_games_played,
  SUM(CASE WHEN pr.position = 1 THEN 1 ELSE 0 END) AS total_wins,
  CAST(SUM(CASE WHEN pr.position = 1 THEN 1 ELSE 0 END) AS REAL) / 
    CASE WHEN COUNT(DISTINCT gs.session_id) = 0 THEN 1 
    ELSE COUNT(DISTINCT gs.session_id) END AS win_percentage,
  COUNT(DISTINCT g.game_id) AS different_games_played
FROM visitors v
LEFT JOIN player_results pr ON v.visitor_id = pr.visitor_id
LEFT JOIN game_sessions gs ON pr.session_id = gs.session_id
LEFT JOIN games g ON gs.game_id = g.game_id
GROUP BY v.visitor_id, v.name, v.visit_count
ORDER BY total_wins DESC, win_percentage DESC, total_games_played DESC;
`);

// Initialize default milestone data
console.log('Adding default milestone data...');
const milestones = [
  ['First Timer', 'Welcome to the pub!', 1],
  ['Regular', 'Starting to become a regular!', 5],
  ['Frequent Visitor', 'A familiar face around here!', 10],
  ['Pub Enthusiast', 'Truly dedicated to the pub experience!', 25],
  ['Pub Legend', 'Your own stool should have your name on it!', 50]
];

// First check if milestones exist
const existingMilestones = db.prepare('SELECT COUNT(*) as count FROM milestones').get();

if (existingMilestones.count === 0) {
  const insertMilestone = db.prepare(
    'INSERT INTO milestones (name, description, visit_count) VALUES (?, ?, ?)'
  );
  
  for (const milestone of milestones) {
    insertMilestone.run(milestone);
  }
  console.log(`Added ${milestones.length} default milestones`);
}

console.log('Database initialization complete!');
db.close();