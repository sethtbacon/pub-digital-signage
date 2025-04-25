/**
 * API Routes Index
 * Centralizes all route imports and exports them as a single router
 */

const express = require('express');
const router = express.Router();

// Import route modules
// These will be implemented in separate files for each entity
const drinksRoutes = require('./drinks');
const gamesRoutes = require('./games');
const visitorsRoutes = require('./visitors');
const themesRoutes = require('./themes');
const mediaRoutes = require('./media');
const systemRoutes = require('./system');

// Register routes
router.use('/drinks', drinksRoutes);
router.use('/games', gamesRoutes);
router.use('/visitors', visitorsRoutes);
router.use('/themes', themesRoutes);
router.use('/media', mediaRoutes);
router.use('/system', systemRoutes);

// Base API route
router.get('/', (req, res) => {
  res.json({
    message: 'Pub Digital Signage API',
    version: '1.0.0',
    endpoints: [
      '/drinks',
      '/games',
      '/visitors',
      '/themes',
      '/media',
      '/system',
    ]
  });
});

module.exports = router;