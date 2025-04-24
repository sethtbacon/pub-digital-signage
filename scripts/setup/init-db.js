const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const config = require('config');

// Get database path from config
const dbPath = path.resolve(config.get('database.path'));
const dbDir = path.dirname(dbPath);

// Ensure directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to the SQLite database.');
});

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
const createTables = () => {
  // Visitors table
  db.run(`CREATE TABLE IF NOT EXISTS visitors (
    visitor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    photo_path TEXT,
    first_visit_date TEXT NOT NULL,
    visit_count INTEGER DEFAULT 1,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Visits table
  db.run(`CREATE TABLE IF NOT EXISTS visits (
    visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
    visitor_id INTEGER NOT NULL,
    visit_date TEXT NOT NULL,
    milestone_achieved TEXT,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
  )`);

  // Milestones table
  db.run(`CREATE TABLE IF NOT EXISTS milestones (
    milestone_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    visit_count INTEGER UNIQUE,
    reward TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Games table
  db.run(`CREATE TABLE IF NOT EXISTS games (
    game_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    image_path TEXT,
    scoring_type TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Game Sessions table
  db.run(`CREATE TABLE IF NOT EXISTS game_sessions (
    session_id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    session_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(game_id)
  )`);

  // Player Results table
  db.run(`CREATE TABLE IF NOT EXISTS player_results (
    result_id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    visitor_id INTEGER NOT NULL,
    score REAL NOT NULL,
    position INTEGER,
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
    FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
  )`);

  // Drinks table
  db.run(`CREATE TABLE IF NOT EXISTS drinks (
    drink_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    image_path TEXT,
    is_featured BOOLEAN DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  // Content Schedule table
  db.run(`CREATE TABLE IF NOT EXISTS content_schedule (
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
  )`);
};

// Create views
const createViews = () => {
  // We'll create game-specific views dynamically after inserting sample games

  // Overall Pub Leaderboard View
  db.run(`CREATE VIEW IF NOT EXISTS pub_overall_leaderboard AS
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
    ORDER BY total_wins DESC, win_percentage DESC, total_games_played DESC
  `);

  // Milestone Progress View
  db.run(`CREATE VIEW IF NOT EXISTS milestone_progress AS
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
    ORDER BY v.visit_count DESC
  `);
};

// Insert sample data
const insertSampleData = () => {
  // Insert milestone data
  db.run(`INSERT INTO milestones (name, description, visit_count) VALUES
    ('First Timer', 'Welcome to the pub!', 1),
    ('Regular', 'Starting to become a regular!', 5),
    ('Frequent Visitor', 'A familiar face around here!', 10),
    ('Pub Enthusiast', 'Truly dedicated to the pub experience!', 25),
    ('Pub Legend', 'Your own stool should have your name on it!', 50)`);

  // Insert games data
  db.run(`INSERT INTO games (name, description, scoring_type) VALUES
    ('Settlers of Catan', 'Build settlements and cities to win!', 'high_wins'),
    ('Cribbage', 'Classic card game with a wooden board', 'high_wins'),
    ('Monopoly', 'Property trading and development game', 'high_wins'),
    ('Chess', 'Strategic board game of kings and queens', 'binary'),
    ('Scrabble', 'Word creation with letter tiles', 'high_wins')`);
  
  // Create game-specific views
  db.all(`SELECT name FROM games`, [], (err, games) => {
    if (err) {
      console.error('Error getting games:', err.message);
      return;
    }
    
    games.forEach(game => {
      const viewName = `leaderboard_${game.name.toLowerCase().replace(/\s+/g, '_')}`;
      db.run(`CREATE VIEW IF NOT EXISTS ${viewName} AS
        SELECT 
          v.visitor_id,
          v.name,
          COUNT(pr.result_id) AS games_played,
          SUM(CASE WHEN pr.position = 1 THEN 1 ELSE 0 END) AS wins,
          AVG(pr.score) AS avg_score,
          MAX(pr.score) AS best_score,
          MIN(pr.score) AS worst_score
        FROM visitors v
        JOIN player_results pr ON v.visitor_id = pr.visitor_id
        JOIN game_sessions gs ON pr.session_id = gs.session_id
        JOIN games g ON gs.game_id = g.game_id
        WHERE g.name = '${game.name}'
        GROUP BY v.visitor_id, v.name
        ORDER BY 
          CASE 
            WHEN g.scoring_type = 'high_wins' THEN wins DESC, avg_score DESC
            WHEN g.scoring_type = 'low_wins' THEN wins DESC, avg_score ASC
            ELSE wins DESC
          END
      `);
    });
  });

  // Add some sample drinks
  db.run(`INSERT INTO drinks (name, category, description, is_featured) VALUES
    ('Guinness', 'beer', 'Classic Irish stout', 1),
    ('Old Fashioned', 'cocktail', 'Whiskey, sugar, bitters', 1),
    ('House Red Wine', 'wine', 'Medium-bodied red blend', 0),
    ('IPA', 'beer', 'Hoppy craft IPA', 0),
    ('Moscow Mule', 'cocktail', 'Vodka, ginger beer, lime', 0)`);
};

// Run the initialization sequence
db.serialize(() => {
  console.log('Creating database tables...');
  createTables();
  
  console.log('Creating database views...');
  createViews();
  
  // Check if the database already has data before inserting sample data
  db.get('SELECT COUNT(*) as count FROM games', (err, result) => {
    if (err) {
      console.error('Error checking database:', err.message);
      return;
    }
    
    if (result.count === 0) {
      console.log('Inserting sample data...');
      insertSampleData();
    } else {
      console.log('Database already contains data. Skipping sample data insertion.');
    }
    
    console.log('Database initialization completed.');
  });
});

// Close the database connection when done
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});