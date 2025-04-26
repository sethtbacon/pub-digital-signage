/**
 * Initialize Themes
 * Runs migrations and seeds default themes
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('config');
const { execSync } = require('child_process');

// Initialize database from configuration
const dbConfig = config.get('database');
const dbPath = path.resolve(process.cwd(), dbConfig.path);
const dbDir = path.dirname(dbPath);

console.log('Theme system initialization starting...');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  console.log(`Creating database directory: ${dbDir}`);
  fs.mkdirSync(dbDir, { recursive: true });
}

// Connect to database (creates it if it doesn't exist)
console.log(`Connecting to database at ${dbPath}`);
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

async function initThemes() {
  try {
    console.log('Checking if themes table exists...');
    
    // Check if themes table exists
    const hasThemesTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='themes'").get();
    
    if (!hasThemesTable) {
      console.log('Creating themes table...');
      // Create themes table
      db.exec(`
        CREATE TABLE themes (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          active INTEGER DEFAULT 1,
          startTime TEXT,
          endTime TEXT,
          
          -- Colors
          primaryColor TEXT NOT NULL,
          secondaryColor TEXT NOT NULL,
          accentColor TEXT NOT NULL,
          backgroundColor TEXT NOT NULL,
          textColor TEXT NOT NULL,
          
          -- Typography
          fontFamily TEXT,
          headingFontFamily TEXT,
          baseFontSize TEXT,
          
          -- Spacing
          spacingUnit TEXT,
          
          -- Borders
          borderRadius TEXT,
          
          -- Shadows
          shadowColor TEXT,
          shadowSmall TEXT,
          shadowMedium TEXT,
          shadowLarge TEXT,
          
          -- Transitions
          transitionSpeed TEXT,
          
          -- Extra theme metadata
          description TEXT,
          logoPath TEXT,
          backgroundPath TEXT,
          isSystem INTEGER DEFAULT 0,
          isPreset INTEGER DEFAULT 0,
          
          -- Tracking
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Themes table created successfully!');
    } else {
      console.log('Themes table already exists.');
    }
    
    // Seed default themes
    console.log('Seeding default themes...');
    seedDefaultThemes();
    console.log('Default themes seeded successfully!');
    
    // Seed theme presets
    console.log('Seeding theme presets...');
    try {
      // Using execSync to run the seed-theme-presets script separately
      execSync('node ' + path.join(__dirname, 'seed-theme-presets.js'), { stdio: 'inherit' });
    } catch (error) {
      console.error('Error seeding theme presets:', error.message);
    }
    
    console.log('Theme initialization complete!');
  } catch (error) {
    console.error('Error initializing themes:', error);
    process.exit(1);
  }
}

// Function to seed default themes
function seedDefaultThemes() {
  const defaultThemes = [
    {
      id: 'default',
      name: 'Default',
      active: 1,
      primaryColor: '#ff6b01',
      secondaryColor: '#2c3e50',
      accentColor: '#e74c3c',
      backgroundColor: '#111',
      textColor: '#ecf0f1',
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
      baseFontSize: '16px',
      spacingUnit: '1rem',
      borderRadius: '4px',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
      shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
      shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transitionSpeed: '0.5s',
      description: 'Default theme for pub digital signage',
      isSystem: 1,
    },
    {
      id: 'morning',
      name: 'Morning',
      active: 1,
      startTime: '05:00',
      endTime: '11:00',
      primaryColor: '#f39c12',
      secondaryColor: '#3498db',
      accentColor: '#e74c3c',
      backgroundColor: '#1a1a1a',
      textColor: '#ecf0f1',
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
      baseFontSize: '16px',
      spacingUnit: '1rem',
      borderRadius: '4px',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
      shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
      shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transitionSpeed: '0.5s',
      description: 'Morning theme (5:00 - 11:00)',
      isSystem: 1,
    },
    {
      id: 'afternoon',
      name: 'Afternoon',
      active: 1,
      startTime: '11:00',
      endTime: '17:00',
      primaryColor: '#ff6b01',
      secondaryColor: '#2980b9',
      accentColor: '#e67e22',
      backgroundColor: '#111',
      textColor: '#ecf0f1',
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
      baseFontSize: '16px',
      spacingUnit: '1rem',
      borderRadius: '4px',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
      shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
      shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transitionSpeed: '0.5s',
      description: 'Afternoon theme (11:00 - 17:00)',
      isSystem: 1,
    },
    {
      id: 'evening',
      name: 'Evening',
      active: 1,
      startTime: '17:00',
      endTime: '22:00',
      primaryColor: '#d35400',
      secondaryColor: '#2c3e50',
      accentColor: '#c0392b',
      backgroundColor: '#0a0a0a',
      textColor: '#ecf0f1',
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
      baseFontSize: '16px',
      spacingUnit: '1rem',
      borderRadius: '4px',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
      shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
      shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transitionSpeed: '0.5s',
      description: 'Evening theme (17:00 - 22:00)',
      isSystem: 1,
    },
    {
      id: 'night',
      name: 'Night',
      active: 1,
      startTime: '22:00',
      endTime: '05:00',
      primaryColor: '#8e44ad',
      secondaryColor: '#2c3e50',
      accentColor: '#3498db',
      backgroundColor: '#050505',
      textColor: '#ecf0f1',
      fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
      headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
      baseFontSize: '16px',
      spacingUnit: '1rem',
      borderRadius: '4px',
      shadowColor: 'rgba(0, 0, 0, 0.2)',
      shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
      shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
      shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',
      transitionSpeed: '0.5s',
      description: 'Night theme (22:00 - 5:00)',
      isSystem: 1,
    }
  ];

  // Check if themes already exist before inserting
  for (const theme of defaultThemes) {
    const exists = db.prepare('SELECT 1 FROM themes WHERE id = ?').get(theme.id);
    if (!exists) {
      // Create insert statement with all the theme properties
      const columns = Object.keys(theme).join(', ');
      const placeholders = Object.keys(theme).map(() => '?').join(', ');
      const insertTheme = db.prepare(`INSERT INTO themes (${columns}) VALUES (${placeholders})`);
      
      // Execute insert with all values in the same order as columns
      insertTheme.run(...Object.values(theme));
      console.log(`Created theme: ${theme.name}`);
    } else {
      console.log(`Theme ${theme.name} already exists, skipping.`);
    }
  }
}

// Run the initialization
initThemes()
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    // Close the database connection
    db.close();
  });