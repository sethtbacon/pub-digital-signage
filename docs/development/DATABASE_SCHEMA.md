# Database Schema for Pub Digital Signage

This document outlines the SQLite database structure for tracking board games, visitors, and other dynamic content in the pub digital signage system.

## Overview

We'll use SQLite for its simplicity, reliability, and zero-configuration needs. The database will handle:
1. Board game results and leaderboards
2. Visitor tracking and milestones
3. Drink inventory and specials
4. Content scheduling information

## Database Tables

### Visitors Table
```sql
CREATE TABLE visitors (
  visitor_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  photo_path TEXT,
  first_visit_date TEXT NOT NULL,
  visit_count INTEGER DEFAULT 1,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Visits Table
```sql
CREATE TABLE visits (
  visit_id INTEGER PRIMARY KEY AUTOINCREMENT,
  visitor_id INTEGER NOT NULL,
  visit_date TEXT NOT NULL,
  milestone_achieved TEXT,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
);
```

### Milestones Table
```sql
CREATE TABLE milestones (
  milestone_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  visit_count INTEGER UNIQUE,
  reward TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Games Table
```sql
CREATE TABLE games (
  game_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image_path TEXT,
  scoring_type TEXT NOT NULL, -- 'high_wins', 'low_wins', 'points', etc.
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Game Sessions Table
```sql
CREATE TABLE game_sessions (
  session_id INTEGER PRIMARY KEY AUTOINCREMENT,
  game_id INTEGER NOT NULL,
  session_date TEXT NOT NULL,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(game_id)
);
```

### Player Results Table
```sql
CREATE TABLE player_results (
  result_id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER NOT NULL,
  visitor_id INTEGER NOT NULL,
  score REAL NOT NULL,  -- Using REAL to accommodate various scoring systems
  position INTEGER,     -- 1 for 1st place, etc.
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES game_sessions(session_id),
  FOREIGN KEY (visitor_id) REFERENCES visitors(visitor_id)
);
```

### Drinks Table
```sql
CREATE TABLE drinks (
  drink_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,  -- 'beer', 'wine', 'cocktail', etc.
  description TEXT,
  image_path TEXT,
  is_featured BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Content Schedule Table
```sql
CREATE TABLE content_schedule (
  schedule_id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_type TEXT NOT NULL,  -- 'drinks', 'games', 'announcements', etc.
  content_id INTEGER,          -- ID in the respective content table
  start_date TEXT,
  end_date TEXT,
  start_time TEXT,
  end_time TEXT,
  days_of_week TEXT,          -- e.g., '1,2,3,4,5' for weekdays
  priority INTEGER DEFAULT 0, -- Higher priority items get displayed more prominently
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

## View Definitions

### Leaderboard Views

For each game:

```sql
CREATE VIEW leaderboard_[game_name] AS
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
WHERE g.name = '[game_name]'
GROUP BY v.visitor_id, v.name
ORDER BY 
  -- Order differently based on game scoring type
  CASE 
    WHEN g.scoring_type = 'high_wins' THEN wins DESC, avg_score DESC
    WHEN g.scoring_type = 'low_wins' THEN wins DESC, avg_score ASC
  END;
```

### Overall Pub Leaderboard View

```sql
CREATE VIEW pub_overall_leaderboard AS
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
```

### Milestone Progress View

```sql
CREATE VIEW milestone_progress AS
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
```

## Sample Queries

### Get Top 5 Players for a Specific Game
```sql
SELECT * FROM leaderboard_catan LIMIT 5;
```

### Find Next Milestone for a Visitor
```sql
SELECT * FROM milestone_progress WHERE visitor_id = 1;
```

### Get Recent Game Results 
```sql
SELECT 
  g.name AS game,
  gs.session_date,
  v.name AS player,
  pr.score,
  pr.position
FROM player_results pr
JOIN game_sessions gs ON pr.session_id = gs.session_id
JOIN games g ON gs.game_id = g.game_id
JOIN visitors v ON pr.visitor_id = v.visitor_id
ORDER BY gs.session_date DESC, pr.position ASC
LIMIT 20;
```

## Initialization Data

We'll prepopulate some tables with initial data:

### Milestone Initial Data
```sql
INSERT INTO milestones (name, description, visit_count) VALUES
('First Timer', 'Welcome to the pub!', 1),
('Regular', 'Starting to become a regular!', 5),
('Frequent Visitor', 'A familiar face around here!', 10),
('Pub Enthusiast', 'Truly dedicated to the pub experience!', 25),
('Pub Legend', 'Your own stool should have your name on it!', 50);
```

### Games Initial Data
```sql
INSERT INTO games (name, description, scoring_type) VALUES
('Settlers of Catan', 'Build settlements and cities to win!', 'high_wins'),
('Cribbage', 'Classic card game with a wooden board', 'high_wins'),
('Monopoly', 'Property trading and development game', 'high_wins'),
('Chess', 'Strategic board game of kings and queens', 'binary'),
('Scrabble', 'Word creation with letter tiles', 'high_wins');
```

## Administrative Interface

We'll create simple admin forms for:
- Adding new visitors
- Recording visits
- Adding game sessions and results
- Managing drinks and specials

## Data Migration and Backup

- The SQLite database will be backed up nightly
- Backups will be stored both locally and in a designated backup location
- A simple export function will allow exporting data in CSV format