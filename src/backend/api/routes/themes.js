/**
 * Themes API Routes
 * Handles theme management and customization
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Theme = require('../../db/models/Theme');

// Get all available themes (with optional filtering)
router.get('/', async (req, res) => {
  try {
    let themes;
    
    // Check if we should filter by isPreset
    if (req.query.isPreset !== undefined) {
      const isPreset = req.query.isPreset === 'true';
      themes = await Theme.getAllByFilter({ isPreset });
    } else {
      themes = await Theme.getAll();
    }
    
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active theme
router.get('/active', async (req, res) => {
  try {
    // Check for manual override
    try {
      const overridePath = path.resolve(process.cwd(), 'data/theme-override.json');
      if (fs.existsSync(overridePath)) {
        const manualTheme = JSON.parse(fs.readFileSync(overridePath));
        if (manualTheme && manualTheme.active && manualTheme.expiry > Date.now()) {
          const theme = await Theme.getById(manualTheme.theme);
          if (theme) {
            return res.json({
              ...theme,
              overrideExpiry: manualTheme.expiry
            });
          }
        } else {
          // Remove expired override file
          fs.unlinkSync(overridePath);
        }
      }
    } catch (err) {
      // No manual override or expired
    }
    
    // Get time-based theme from database
    const activeTheme = await Theme.getActive();
    res.json(activeTheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new theme
router.post('/', async (req, res) => {
  try {
    const themeData = req.body;
    
    // Validate required fields
    const requiredFields = ['id', 'name', 'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'textColor'];
    for (const field of requiredFields) {
      if (!themeData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }
    
    // Check if theme ID already exists
    const existingTheme = await Theme.getById(themeData.id);
    if (existingTheme) {
      return res.status(409).json({ error: 'Theme ID already exists' });
    }
    
    // Create the theme
    const theme = await Theme.create(themeData);
    res.status(201).json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single theme by ID
router.get('/:id', async (req, res) => {
  try {
    const theme = await Theme.getById(req.params.id);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a theme
router.put('/:id', async (req, res) => {
  try {
    const themeId = req.params.id;
    const themeData = req.body;
    
    // Check if theme exists
    const existingTheme = await Theme.getById(themeId);
    if (!existingTheme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    // If it's a system theme, only allow certain fields to be updated
    if (existingTheme.isSystem) {
      const allowedFields = [
        'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor', 'textColor',
        'fontFamily', 'headingFontFamily', 'baseFontSize', 'spacingUnit', 'borderRadius',
        'shadowColor', 'shadowSmall', 'shadowMedium', 'shadowLarge', 'transitionSpeed',
        'active', 'logoPath', 'backgroundPath'
      ];
      
      const filteredData = {};
      for (const field of allowedFields) {
        if (themeData[field] !== undefined) {
          filteredData[field] = themeData[field];
        }
      }
      
      // Update the theme
      const updatedTheme = await Theme.update(themeId, filteredData);
      res.json(updatedTheme);
    } else {
      // For non-system themes, allow full update
      const updatedTheme = await Theme.update(themeId, themeData);
      res.json(updatedTheme);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a theme
router.delete('/:id', async (req, res) => {
  try {
    const themeId = req.params.id;
    
    // Check if theme exists
    const existingTheme = await Theme.getById(themeId);
    if (!existingTheme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    // Don't allow deletion of system themes
    if (existingTheme.isSystem) {
      return res.status(403).json({ error: 'Cannot delete system themes' });
    }
    
    // Delete the theme
    await Theme.delete(themeId);
    res.json({ message: 'Theme deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set active theme (manual override)
router.post('/activate/:id', async (req, res) => {
  try {
    const themeId = req.params.id;
    const { duration } = req.body; // Duration in minutes
    
    // Check if theme exists
    const theme = await Theme.getById(themeId);
    if (!theme) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    // Calculate expiry time (default: 1 hour)
    const expiryMinutes = duration || 60;
    const expiry = Date.now() + expiryMinutes * 60 * 1000;
    
    // Save manual override
    const overrideData = {
      theme: themeId,
      active: true,
      expiry,
      activatedAt: Date.now()
    };
    
    const dataDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(
      path.resolve(dataDir, 'theme-override.json'),
      JSON.stringify(overrideData)
    );
    
    res.json({
      message: 'Theme activated successfully',
      theme: themeId,
      expiry
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear manual theme override
router.delete('/activate', (req, res) => {
  try {
    const overridePath = path.resolve(process.cwd(), 'data/theme-override.json');
    
    if (fs.existsSync(overridePath)) {
      fs.unlinkSync(overridePath);
    }
    
    res.json({
      message: 'Theme override cleared, reverted to time-based theme selection'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;