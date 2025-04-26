/**
 * Seed Theme Presets
 * This script creates a set of example theme presets to showcase the presets feature
 */

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const config = require('config');

// Initialize database from configuration
const dbConfig = config.get('database');
const dbPath = path.resolve(process.cwd(), dbConfig.path);

console.log('Seeding theme presets...');

// Connect to database
const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

function seedThemePresets() {
  try {
    const presets = [
      {
        id: 'preset-dark-contrast',
        name: 'High Contrast Dark',
        description: 'Dark theme with high contrast for better readability',
        primaryColor: '#ffd700', // Gold
        secondaryColor: '#4a90e2', // Bright blue
        accentColor: '#ff5252', // Red
        backgroundColor: '#121212', // Very dark gray
        textColor: '#ffffff', // White
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',
        spacingUnit: '1rem',
        borderRadius: '4px',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.2)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.3)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.4)',
        transitionSpeed: '0.4s',
        isPreset: 1,
        isSystem: 0
      },
      {
        id: 'preset-neon',
        name: 'Neon Lights',
        description: 'Vibrant neon colors on dark background, perfect for nighttime',
        primaryColor: '#00ff00', // Neon green
        secondaryColor: '#ff00ff', // Neon pink
        accentColor: '#00ffff', // Neon cyan
        backgroundColor: '#0a0a0a', // Near black
        textColor: '#ffffff', // White
        fontFamily: "'Oswald', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Oswald', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',
        spacingUnit: '1rem',
        borderRadius: '0px', // Sharp edges
        shadowColor: 'rgba(0, 255, 0, 0.3)',
        shadowSmall: '0 0 5px rgba(0, 255, 0, 0.5)',
        shadowMedium: '0 0 10px rgba(0, 255, 0, 0.5)',
        shadowLarge: '0 0 20px rgba(0, 255, 0, 0.5)',
        transitionSpeed: '0.3s',
        isPreset: 1,
        isSystem: 0
      },
      {
        id: 'preset-warm-pub',
        name: 'Traditional Pub',
        description: 'Warm browns and ambers for a cozy traditional pub feel',
        primaryColor: '#c77b30', // Amber
        secondaryColor: '#8b4513', // Saddle brown
        accentColor: '#a52a2a', // Brown
        backgroundColor: '#2a1506', // Very dark brown
        textColor: '#f5deb3', // Wheat
        fontFamily: "'Georgia', 'Times New Roman', serif",
        headingFontFamily: "'Playfair Display', serif",
        baseFontSize: '16px',
        spacingUnit: '1rem',
        borderRadius: '8px', // Rounded corners
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.3)',
        shadowMedium: '0 4px 8px rgba(0, 0, 0, 0.4)',
        shadowLarge: '0 8px 16px rgba(0, 0, 0, 0.5)',
        transitionSpeed: '0.6s',
        isPreset: 1,
        isSystem: 0
      },
      {
        id: 'preset-light-modern',
        name: 'Modern Light',
        description: 'Clean, light design with modern feel for daytime displays',
        primaryColor: '#3498db', // Bright blue
        secondaryColor: '#2ecc71', // Green
        accentColor: '#e74c3c', // Red
        backgroundColor: '#f5f5f5', // Light gray
        textColor: '#333333', // Dark gray
        fontFamily: "'Open Sans', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',
        spacingUnit: '1rem',
        borderRadius: '8px',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.05)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.08)',
        shadowLarge: '0 8px 15px rgba(0, 0, 0, 0.1)',
        transitionSpeed: '0.3s',
        isPreset: 1,
        isSystem: 0
      }
    ];
    
    // Add each preset if it doesn't already exist
    for (const preset of presets) {
      const exists = db.prepare('SELECT 1 FROM themes WHERE id = ?').get(preset.id);
      if (!exists) {
        // Create insert statement with all the preset properties
        const columns = Object.keys(preset).join(', ');
        const placeholders = Object.keys(preset).map(() => '?').join(', ');
        const insertPreset = db.prepare(`INSERT INTO themes (${columns}) VALUES (${placeholders})`);
        
        // Execute insert with all values in the same order as columns
        insertPreset.run(...Object.values(preset));
        console.log(`Created preset: ${preset.name}`);
      } else {
        console.log(`Preset ${preset.name} already exists, skipping.`);
      }
    }
    
    console.log('Theme presets seeded successfully!');
  } catch (error) {
    console.error('Error seeding theme presets:', error);
  }
}

// Run the seeding function
seedThemePresets();

// Close the database connection when done
db.close();