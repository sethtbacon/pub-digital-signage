/**
 * Theme Model
 * Handles data operations for themes
 */

const knex = require('../db');

class Theme {
  /**
   * Get all themes
   * @returns {Promise<Array>} Array of themes
   */
  static async getAll() {
    return knex('themes').select('*');
  }

  /**
   * Get themes by filter
   * @param {Object} filter - Filter criteria
   * @returns {Promise<Array>} Array of filtered themes
   */
  static async getAllByFilter(filter) {
    return knex('themes').where(filter).select('*');
  }

  /**
   * Get a theme by ID
   * @param {string} id - Theme ID
   * @returns {Promise<Object|null>} Theme object or null if not found
   */
  static async getById(id) {
    return knex('themes').where({ id }).first();
  }

  /**
   * Get active theme based on current time
   * @returns {Promise<Object>} Active theme object
   */
  static async getActive() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
    
    // Find themes with time ranges
    const themes = await knex('themes').where({ active: true });
    
    // Check for a theme that matches the current time
    for (const theme of themes) {
      if (theme.startTime && theme.endTime) {
        if (
          (theme.startTime <= theme.endTime && currentTime >= theme.startTime && currentTime < theme.endTime) ||
          (theme.startTime > theme.endTime && (currentTime >= theme.startTime || currentTime < theme.endTime))
        ) {
          return theme;
        }
      }
    }
    
    // Fall back to default theme if no time-based theme is active
    return knex('themes').where({ id: 'default' }).first();
  }

  /**
   * Create a new theme
   * @param {Object} themeData - Theme data
   * @returns {Promise<Object>} Newly created theme
   */
  static async create(themeData) {
    // Set created_at and updated_at
    themeData.created_at = new Date();
    themeData.updated_at = new Date();
    
    await knex('themes').insert(themeData);
    return this.getById(themeData.id);
  }

  /**
   * Update a theme
   * @param {string} id - Theme ID
   * @param {Object} themeData - Theme data
   * @returns {Promise<Object>} Updated theme
   */
  static async update(id, themeData) {
    // Set updated_at
    themeData.updated_at = new Date();
    
    await knex('themes').where({ id }).update(themeData);
    return this.getById(id);
  }

  /**
   * Delete a theme
   * @param {string} id - Theme ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // Don't allow deletion of system themes
    const theme = await this.getById(id);
    if (!theme || theme.isSystem) {
      return false;
    }
    
    await knex('themes').where({ id }).delete();
    return true;
  }

  /**
   * Seed default themes
   * @returns {Promise<void>}
   */
  static async seedDefaultThemes() {
    const defaultThemes = [
      {
        id: 'default',
        name: 'Default',
        active: true,
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
        isSystem: true,
      },
      {
        id: 'morning',
        name: 'Morning',
        active: true,
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
        isSystem: true,
      },
      {
        id: 'afternoon',
        name: 'Afternoon',
        active: true,
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
        isSystem: true,
      },
      {
        id: 'evening',
        name: 'Evening',
        active: true,
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
        isSystem: true,
      },
      {
        id: 'night',
        name: 'Night',
        active: true,
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
        isSystem: true,
      }
    ];

    // Check if themes already exist
    for (const theme of defaultThemes) {
      const exists = await this.getById(theme.id);
      if (!exists) {
        await this.create(theme);
      }
    }
  }
}

module.exports = Theme;