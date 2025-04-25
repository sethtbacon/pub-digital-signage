/**
 * Games API Routes
 * Handles board game listings and leaderboards
 */

const express = require('express');
const router = express.Router();

// Get all games
router.get('/', (req, res, next) => {
  try {
    const db = req.db;
    const games = db.prepare('SELECT * FROM games ORDER BY name ASC').all();
    res.json(games);
  } catch (err) {
    next(err);
  }
});

// Get game by ID
router.get('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const game = db.prepare('SELECT * FROM games WHERE game_id = ?').get(req.params.id);
    
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(game);
  } catch (err) {
    next(err);
  }
});

// Get leaderboard for specific game
router.get('/:id/leaderboard', (req, res, next) => {
  try {
    const db = req.db;
    const gameId = req.params.id;
    
    // Check if game exists
    const gameExists = db.prepare('SELECT 1 FROM games WHERE game_id = ?').get(gameId);
    if (!gameExists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Get leaderboard data
    const leaderboard = db.prepare(`
      SELECT 
        v.visitor_id, 
        v.name as player_name,
        COUNT(pr.result_id) as games_played,
        SUM(CASE WHEN pr.position = 1 THEN 1 ELSE 0 END) as wins,
        AVG(pr.score) as average_score,
        MAX(pr.score) as best_score
      FROM visitors v
      JOIN player_results pr ON v.visitor_id = pr.visitor_id
      JOIN game_sessions gs ON pr.session_id = gs.session_id
      WHERE gs.game_id = ?
      GROUP BY v.visitor_id
      ORDER BY wins DESC, average_score DESC
    `).all(gameId);
    
    res.json(leaderboard);
  } catch (err) {
    next(err);
  }
});

// Create new game
router.post('/', (req, res, next) => {
  try {
    const { name, description, min_players, max_players, rules_summary } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Game name is required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'INSERT INTO games (name, description, min_players, max_players, rules_summary) VALUES (?, ?, ?, ?, ?)'
    ).run(name, description || '', min_players || 1, max_players || null, rules_summary || '');
    
    res.status(201).json({
      message: 'Game created successfully',
      gameId: result.lastInsertRowid
    });
  } catch (err) {
    next(err);
  }
});

// Update game
router.put('/:id', (req, res, next) => {
  try {
    const { name, description, min_players, max_players, rules_summary } = req.body;
    const gameId = req.params.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Game name is required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'UPDATE games SET name = ?, description = ?, min_players = ?, max_players = ?, rules_summary = ? WHERE game_id = ?'
    ).run(name, description || '', min_players || 1, max_players || null, rules_summary || '', gameId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({
      message: 'Game updated successfully',
      gameId
    });
  } catch (err) {
    next(err);
  }
});

// Record game session with results
router.post('/:id/session', (req, res, next) => {
  try {
    const gameId = req.params.id;
    const { session_date, notes, results } = req.body;
    
    if (!session_date || !results || !Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Session date and player results are required' });
    }
    
    const db = req.db;
    
    // Check if game exists
    const gameExists = db.prepare('SELECT 1 FROM games WHERE game_id = ?').get(gameId);
    if (!gameExists) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    // Start transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Create session
      const sessionInsert = db.prepare(
        'INSERT INTO game_sessions (game_id, session_date, notes) VALUES (?, ?, ?)'
      ).run(gameId, session_date, notes || '');
      
      const sessionId = sessionInsert.lastInsertRowid;
      
      // Insert player results
      const insertResult = db.prepare(
        'INSERT INTO player_results (session_id, visitor_id, score, position, notes) VALUES (?, ?, ?, ?, ?)'
      );
      
      results.forEach((result, index) => {
        insertResult.run(
          sessionId,
          result.visitor_id,
          result.score,
          result.position || index + 1,
          result.notes || ''
        );
      });
      
      // Commit transaction
      db.prepare('COMMIT').run();
      
      res.status(201).json({
        message: 'Game session recorded successfully',
        sessionId
      });
    } catch (err) {
      // Rollback transaction on error
      db.prepare('ROLLBACK').run();
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

// Delete game
router.delete('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const gameId = req.params.id;
    
    // Check if game has sessions
    const hasSessions = db.prepare('SELECT 1 FROM game_sessions WHERE game_id = ? LIMIT 1').get(gameId);
    
    if (hasSessions) {
      return res.status(400).json({ 
        error: 'Cannot delete game with recorded sessions. Delete all sessions first.' 
      });
    }
    
    const result = db.prepare('DELETE FROM games WHERE game_id = ?').run(gameId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json({ message: 'Game deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;