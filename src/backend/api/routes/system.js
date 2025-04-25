/**
 * System API Routes
 * Handles system status, information, and Home Assistant integration
 */

const express = require('express');
const router = express.Router();
const os = require('os');
const fs = require('fs');
const path = require('path');
const config = require('config');

// Get system information
router.get('/info', (req, res) => {
  try {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
        used: os.totalmem() - os.freemem()
      },
      uptime: os.uptime(),
      load: os.loadavg()
    };
    
    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get application status
router.get('/status', (req, res) => {
  try {
    const db = req.db;
    
    // Check if database is accessible
    let dbStatus = 'ok';
    try {
      db.prepare('SELECT 1').get();
    } catch (e) {
      dbStatus = 'error';
    }
    
    // Check Home Assistant status
    let haStatus = 'not configured';
    
    try {
      const haConfig = config.get('homeAssistant');
      if (haConfig && haConfig.url && haConfig.token) {
        // TODO: Implement actual status check with homeAssistant service
        haStatus = 'configured';
      }
    } catch (e) {
      // Home Assistant not configured in config
    }
    
    const status = {
      server: 'running',
      database: dbStatus,
      homeAssistant: haStatus,
      mediaStorage: {
        available: fs.existsSync(path.resolve(process.cwd(), 'data/media')),
        path: path.resolve(process.cwd(), 'data/media')
      },
      version: process.env.npm_package_version || '1.0.0'
    };
    
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get application health (for monitoring)
router.get('/health', (req, res) => {
  try {
    const db = req.db;
    
    // Simple database connection test
    try {
      db.prepare('SELECT 1').get();
      res.status(200).json({ status: 'healthy' });
    } catch (e) {
      res.status(500).json({
        status: 'unhealthy',
        error: 'Database connection failed'
      });
    }
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: err.message
    });
  }
});

// Home Assistant integration routes
router.get('/home-assistant/status', (req, res) => {
  try {
    let status = 'not configured';
    let entities = [];
    
    try {
      const haConfig = config.get('homeAssistant');
      
      if (haConfig && haConfig.url && haConfig.token) {
        status = 'configured';
        
        // TODO: Implement actual communication with Home Assistant API
        // This would query entity states related to the pub digital signage
        
        entities = [
          { entity_id: 'switch.pub_signage_display', state: 'on' },
          { entity_id: 'sensor.pub_signage_theme', state: 'evening' }
        ];
      }
    } catch (e) {
      // Home Assistant not configured in config
    }
    
    res.json({
      status,
      entities
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle webhook from Home Assistant
router.post('/home-assistant/webhook', (req, res) => {
  try {
    const { entity_id, state, attributes } = req.body;
    
    // TODO: Implement webhook handlers for Home Assistant events
    
    // Example: Handle display switch toggling
    if (entity_id === 'switch.pub_signage_display') {
      if (state === 'on') {
        // Handle display on event
      } else if (state === 'off') {
        // Handle display off event
      }
    }
    
    // Example: Handle theme changes
    else if (entity_id === 'input_select.pub_signage_theme') {
      // Activate specified theme
    }
    
    res.status(200).json({ 
      message: 'Webhook received successfully',
      received: { entity_id, state }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;