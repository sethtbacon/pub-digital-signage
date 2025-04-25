/**
 * Drinks API Routes
 * Handles drink menu and featured drinks endpoints
 */

const express = require('express');
const router = express.Router();

// Get all drinks
router.get('/', (req, res, next) => {
  try {
    const db = req.db;
    const drinks = db.prepare('SELECT * FROM drinks ORDER BY name ASC').all();
    res.json(drinks);
  } catch (err) {
    next(err);
  }
});

// Get featured drinks
router.get('/featured', (req, res, next) => {
  try {
    const db = req.db;
    const drinks = db.prepare('SELECT * FROM drinks WHERE is_featured = 1 ORDER BY name ASC').all();
    res.json(drinks);
  } catch (err) {
    next(err);
  }
});

// Get drink by ID
router.get('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const drink = db.prepare('SELECT * FROM drinks WHERE drink_id = ?').get(req.params.id);
    
    if (!drink) {
      return res.status(404).json({ error: 'Drink not found' });
    }
    
    res.json(drink);
  } catch (err) {
    next(err);
  }
});

// Create new drink
router.post('/', (req, res, next) => {
  try {
    const { name, category, description, is_featured } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'INSERT INTO drinks (name, category, description, is_featured) VALUES (?, ?, ?, ?)'
    ).run(name, category, description || '', is_featured || 0);
    
    res.status(201).json({
      message: 'Drink created successfully',
      drinkId: result.lastInsertRowid
    });
  } catch (err) {
    next(err);
  }
});

// Update drink
router.put('/:id', (req, res, next) => {
  try {
    const { name, category, description, is_featured } = req.body;
    const drinkId = req.params.id;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const db = req.db;
    const result = db.prepare(
      'UPDATE drinks SET name = ?, category = ?, description = ?, is_featured = ? WHERE drink_id = ?'
    ).run(name, category, description || '', is_featured || 0, drinkId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Drink not found' });
    }
    
    res.json({
      message: 'Drink updated successfully',
      drinkId
    });
  } catch (err) {
    next(err);
  }
});

// Delete drink
router.delete('/:id', (req, res, next) => {
  try {
    const db = req.db;
    const result = db.prepare('DELETE FROM drinks WHERE drink_id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Drink not found' });
    }
    
    res.json({ message: 'Drink deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;