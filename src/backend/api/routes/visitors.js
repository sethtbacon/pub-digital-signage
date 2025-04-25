/**
 * Visitors API Routes
 * Handles visitor tracking, visit recording, and milestone achievements
 */

const express = require('express');
const router = express.Router();

// Get all visitors
router.get('/', (req, res, next) => {
  try {
    const db = req.db;
    const visitors = db.prepare(`
      SELECT 
        visitor_id,
        name,
        photo_path,
        visit_count,
        first_visit_date,
        notes,
        created_at
      FROM visitors
      ORDER BY name ASC
    `).all();
    res.json(visitors);
  } catch (err) {
    next(err);
  }
});

// Get visitor by ID
router.get('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const visitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    res.json(visitor);
  } catch (err) {
    next(err);
  }
});

// Get visitor milestones
router.get('/:id/milestones', (req, res, next) => {
  try {
    const db = req.db;
    const visitorId = req.params.id;
    
    // Check if visitor exists
    const visitorExists = db.prepare('SELECT 1 FROM visitors WHERE visitor_id = ?').get(visitorId);
    if (!visitorExists) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Get completed milestones
    const completedMilestones = db.prepare(`
      SELECT m.milestone_id, m.name, m.description, m.visit_count, m.icon_path
      FROM milestones m
      JOIN visitors v ON m.visit_count <= v.visit_count
      WHERE v.visitor_id = ?
      ORDER BY m.visit_count ASC
    `).all(visitorId);
    
    // Get next milestone
    const nextMilestone = db.prepare(`
      SELECT m.milestone_id, m.name, m.description, m.visit_count, m.icon_path,
        (m.visit_count - v.visit_count) AS visits_needed
      FROM milestones m
      JOIN visitors v ON m.visit_count > v.visit_count
      WHERE v.visitor_id = ?
      ORDER BY m.visit_count ASC
      LIMIT 1
    `).get(visitorId);
    
    res.json({
      completed: completedMilestones,
      next: nextMilestone || null
    });
  } catch (err) {
    next(err);
  }
});

// Get visitor visit history
router.get('/:id/visits', (req, res, next) => {
  try {
    const db = req.db;
    const visitorId = req.params.id;
    
    // Check if visitor exists
    const visitorExists = db.prepare('SELECT 1 FROM visitors WHERE visitor_id = ?').get(visitorId);
    if (!visitorExists) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Get visit history
    const visits = db.prepare(`
      SELECT visit_id, visit_date, notes
      FROM visits
      WHERE visitor_id = ?
      ORDER BY visit_date DESC
    `).all(visitorId);
    
    res.json(visits);
  } catch (err) {
    next(err);
  }
});

// Create new visitor
router.post('/', (req, res, next) => {
  try {
    const { name, photo_path, notes } = req.body;
    const now = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    
    if (!name) {
      return res.status(400).json({ error: 'Visitor name is required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'INSERT INTO visitors (name, photo_path, first_visit_date, visit_count, notes) VALUES (?, ?, ?, 1, ?)'
    ).run(name, photo_path || null, now, notes || null);
    
    res.status(201).json({
      message: 'Visitor created successfully',
      visitorId: result.lastInsertRowid
    });
  } catch (err) {
    next(err);
  }
});

// Record a visit
router.post('/:id/visit', (req, res, next) => {
  try {
    const visitorId = req.params.id;
    const { visit_date, notes } = req.body;
    
    if (!visit_date) {
      return res.status(400).json({ error: 'Visit date is required' });
    }
    
    const db = req.db;
    
    // Check if visitor exists
    const visitor = db.prepare('SELECT visit_count, first_visit_date FROM visitors WHERE visitor_id = ?').get(visitorId);
    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    // Start transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Record the visit
      const visitInsert = db.prepare(
        'INSERT INTO visits (visitor_id, visit_date, notes) VALUES (?, ?, ?)'
      ).run(visitorId, visit_date, notes || '');
      
      // Update visitor stats - just increment the visit count
      db.prepare(`
        UPDATE visitors 
        SET visit_count = visit_count + 1
        WHERE visitor_id = ?
      `).run(visitorId);
      
      // Commit transaction
      db.prepare('COMMIT').run();
      
      // Get updated visitor data
      const updatedVisitor = db.prepare('SELECT * FROM visitors WHERE visitor_id = ?').get(visitorId);
      
      // Check for new milestone achievements
      const newMilestone = db.prepare(`
        SELECT * FROM milestones
        WHERE visit_count = ?
      `).get(updatedVisitor.visit_count);
      
      res.status(201).json({
        message: 'Visit recorded successfully',
        visitId: visitInsert.lastInsertRowid,
        visitor: updatedVisitor,
        milestone: newMilestone || null
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

// Update visitor
router.put('/:id', (req, res, next) => {
  try {
    const { name, photo_path, notes } = req.body;
    const visitorId = req.params.id;
    
    if (!name) {
      return res.status(400).json({ error: 'Visitor name is required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'UPDATE visitors SET name = ?, photo_path = ?, notes = ? WHERE visitor_id = ?'
    ).run(name, photo_path || null, notes || null, visitorId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Visitor not found' });
    }
    
    res.json({
      message: 'Visitor updated successfully',
      visitorId
    });
  } catch (err) {
    next(err);
  }
});

// Delete visitor
router.delete('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const visitorId = req.params.id;
    
    // Check for game results
    const hasResults = db.prepare(`
      SELECT 1 FROM player_results 
      WHERE visitor_id = ? 
      LIMIT 1
    `).get(visitorId);
    
    if (hasResults) {
      return res.status(400).json({ 
        error: 'Cannot delete visitor with game results. Delete all game results first.' 
      });
    }
    
    // Start transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    try {
      // Delete visits
      db.prepare('DELETE FROM visits WHERE visitor_id = ?').run(visitorId);
      
      // Delete visitor
      const result = db.prepare('DELETE FROM visitors WHERE visitor_id = ?').run(visitorId);
      
      if (result.changes === 0) {
        // Rollback if visitor not found
        db.prepare('ROLLBACK').run();
        return res.status(404).json({ error: 'Visitor not found' });
      }
      
      // Commit transaction
      db.prepare('COMMIT').run();
      
      res.json({ message: 'Visitor deleted successfully' });
    } catch (err) {
      // Rollback transaction on error
      db.prepare('ROLLBACK').run();
      throw err;
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;