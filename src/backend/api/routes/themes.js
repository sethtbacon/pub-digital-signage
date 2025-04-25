/**
 * Themes API Routes
 * Handles theme management and customization
 */

const express = require('express');
const router = express.Router();
const config = require('config');
const fs = require('fs');
const path = require('path');

// Get all available themes from config
router.get('/', (req, res) => {
  try {
    // Load themes from config
    const themesConfig = config.get('themes');
    const themes = Object.entries(themesConfig).map(([key, theme]) => ({
      id: key,
      ...theme
    }));
    
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get active theme
router.get('/active', (req, res) => {
  try {
    // Determine active theme based on time of day
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
    
    // Load themes from config
    const themesConfig = config.get('themes');
    
    // Check for manual override
    try {
      const manualTheme = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'data/theme-override.json')));
      if (manualTheme && manualTheme.active && manualTheme.expiry > Date.now()) {
        const theme = themesConfig[manualTheme.theme];
        if (theme) {
          return res.json({
            id: manualTheme.theme,
            ...theme,
            overrideExpiry: manualTheme.expiry
          });
        }
      }
    } catch (err) {
      // No manual override or expired
    }
    
    // Find time-based theme
    let activeTheme = null;
    let activeThemeId = 'default';
    
    Object.entries(themesConfig).forEach(([key, theme]) => {
      if (theme.active && theme.startTime && theme.endTime) {
        // Check if current time is within theme time range
        if (
          (theme.startTime <= theme.endTime && currentTime >= theme.startTime && currentTime < theme.endTime) ||
          (theme.startTime > theme.endTime && (currentTime >= theme.startTime || currentTime < theme.endTime))
        ) {
          activeTheme = theme;
          activeThemeId = key;
        }
      }
    });
    
    // Fall back to default theme if no time-based theme is active
    if (!activeTheme) {
      activeTheme = themesConfig.default;
    }
    
    res.json({
      id: activeThemeId,
      ...activeTheme
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set active theme (manual override)
router.post('/activate/:name', (req, res) => {
  try {
    const themeName = req.params.name;
    const { duration } = req.body; // Duration in minutes
    
    // Load themes from config
    const themesConfig = config.get('themes');
    
    // Check if theme exists
    if (!themesConfig[themeName]) {
      return res.status(404).json({ error: 'Theme not found' });
    }
    
    // Calculate expiry time (default: 1 hour)
    const expiryMinutes = duration || 60;
    const expiry = Date.now() + expiryMinutes * 60 * 1000;
    
    // Save manual override
    const overrideData = {
      theme: themeName,
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
      theme: themeName,
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