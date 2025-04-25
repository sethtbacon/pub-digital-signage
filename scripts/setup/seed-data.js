#!/usr/bin/env node

/**
 * Database seeding script
 * Populates the database with sample data for development
 */

const path = require('path');
const Database = require('better-sqlite3');
const config = require('config');

// Initialize database from configuration
const dbConfig = config.get('database');
const dbPath = path.resolve(process.cwd(), dbConfig.path);

console.log('Database seeding starting...');
console.log(`Connecting to database at ${dbPath}`);
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

// Define sample data

// Sample games data
console.log('Adding sample games...');
const games = [
  ['Settlers of Catan', 'Build settlements and cities to win!', 'high_wins'],
  ['Cribbage', 'Classic card game with a wooden board', 'high_wins'],
  ['Monopoly', 'Property trading and development game', 'high_wins'],
  ['Chess', 'Strategic board game of kings and queens', 'binary'],
  ['Scrabble', 'Word creation with letter tiles', 'high_wins']
];

// Insert sample games
const insertGame = db.prepare(
  'INSERT OR IGNORE INTO games (name, description, scoring_type) VALUES (?, ?, ?)'
);

for (const game of games) {
  insertGame.run(game);
}

// Sample visitors data
console.log('Adding sample visitors...');
const visitors = [
  ['John Smith', '2024-12-15', 'Regular who likes craft beer', 5],
  ['Jane Doe', '2025-01-10', 'Scrabble enthusiast', 8],
  ['Mike Johnson', '2025-02-20', 'Chess player', 3],
  ['Sara Williams', '2025-03-05', 'Wine connoisseur', 10],
  ['Bob Thompson', '2025-03-15', 'Loves board games', 7]
];

// Insert sample visitors
const insertVisitor = db.prepare(
  'INSERT OR IGNORE INTO visitors (name, first_visit_date, notes, visit_count) VALUES (?, ?, ?, ?)'
);

for (const visitor of visitors) {
  insertVisitor.run(visitor);
}

// Sample drinks data
console.log('Adding sample drinks...');
const drinks = [
  ['Guinness', 'beer', 'Irish dry stout', 1],
  ['Jameson', 'whiskey', 'Smooth Irish whiskey', 0],
  ['Cabernet Sauvignon', 'wine', 'Full-bodied red wine', 1],
  ['IPA', 'beer', 'India Pale Ale with citrus notes', 1],
  ['Old Fashioned', 'cocktail', 'Classic whiskey cocktail', 0],
  ['Martini', 'cocktail', 'Gin and vermouth cocktail', 0],
  ['Club Soda', 'non-alcoholic', 'Refreshing carbonated water', 0]
];

// Insert sample drinks
const insertDrink = db.prepare(
  'INSERT OR IGNORE INTO drinks (name, category, description, is_featured) VALUES (?, ?, ?, ?)'
);

for (const drink of drinks) {
  insertDrink.run(drink);
}

// Sample game sessions and results
console.log('Adding sample game sessions and results...');

// Function to get ID by name (for both visitors and games)
const getGameId = db.prepare('SELECT game_id FROM games WHERE name = ?');
const getVisitorId = db.prepare('SELECT visitor_id FROM visitors WHERE name = ?');

// Game session insertion
const insertGameSession = db.prepare(
  'INSERT INTO game_sessions (game_id, session_date, notes) VALUES (?, ?, ?)'
);

const insertResult = db.prepare(
  'INSERT INTO player_results (session_id, visitor_id, score, position) VALUES (?, ?, ?, ?)'
);

// Sample game sessions with results
const gameSessions = [
  {
    game: 'Settlers of Catan',
    date: '2025-04-10',
    notes: 'Friday game night',
    results: [
      { player: 'John Smith', score: 10, position: 1 },
      { player: 'Jane Doe', score: 8, position: 2 },
      { player: 'Mike Johnson', score: 6, position: 3 }
    ]
  },
  {
    game: 'Chess',
    date: '2025-04-12',
    notes: 'Saturday afternoon',
    results: [
      { player: 'Mike Johnson', score: 1, position: 1 },
      { player: 'Bob Thompson', score: 0, position: 2 }
    ]
  },
  {
    game: 'Scrabble',
    date: '2025-04-15',
    notes: 'Word game competition',
    results: [
      { player: 'Jane Doe', score: 320, position: 1 },
      { player: 'Sara Williams', score: 280, position: 2 },
      { player: 'John Smith', score: 225, position: 3 }
    ]
  }
];

// Insert game sessions and results
for (const session of gameSessions) {
  const gameId = getGameId.get(session.game).game_id;
  
  // Insert game session
  const sessionInfo = insertGameSession.run(gameId, session.date, session.notes);
  const sessionId = sessionInfo.lastInsertRowid;
  
  // Insert results for this session
  for (const result of session.results) {
    const visitorId = getVisitorId.get(result.player).visitor_id;
    insertResult.run(sessionId, visitorId, result.score, result.position);
  }
}

// Record some visits (beyond the initial ones)
console.log('Recording sample visits...');
const visits = [
  { visitor: 'John Smith', date: '2025-04-08', notes: 'Came for craft beer tasting' },
  { visitor: 'John Smith', date: '2025-04-15', notes: 'Game night participation' },
  { visitor: 'Jane Doe', date: '2025-04-10', notes: 'Friday social' },
  { visitor: 'Jane Doe', date: '2025-04-15', notes: 'Scrabble tournament' },
  { visitor: 'Sara Williams', date: '2025-04-12', notes: 'Wine tasting event' },
  { visitor: 'Mike Johnson', date: '2025-04-12', notes: 'Chess match' },
  { visitor: 'Bob Thompson', date: '2025-04-10', notes: 'Regular visit' },
  { visitor: 'Bob Thompson', date: '2025-04-15', notes: 'Game watching' }
];

// Insert visits
const insertVisit = db.prepare(
  'INSERT INTO visits (visitor_id, visit_date, notes) VALUES (?, ?, ?)'
);

for (const visit of visits) {
  const visitorId = getVisitorId.get(visit.visitor).visitor_id;
  insertVisit.run(visitorId, visit.date, visit.notes);
}

// Schedule some content
console.log('Creating sample content schedule...');
const schedules = [
  { type: 'drinks', content_id: 1, start_time: '18:00', end_time: '23:00', days: '1,2,3,4,5', priority: 1 },
  { type: 'games', content_id: null, start_time: '19:00', end_time: '22:00', days: '5,6', priority: 2 },
  { type: 'media', content_id: null, start_time: '12:00', end_time: '15:00', days: '1,2,3,4,5,6,7', priority: 0 }
];

// Insert schedules
const insertSchedule = db.prepare(
  'INSERT INTO content_schedule (content_type, content_id, start_time, end_time, days_of_week, priority) VALUES (?, ?, ?, ?, ?, ?)'
);

for (const schedule of schedules) {
  insertSchedule.run(schedule.type, schedule.content_id, schedule.start_time, schedule.end_time, schedule.days, schedule.priority);
}

console.log('Database seeding complete!');
db.close();