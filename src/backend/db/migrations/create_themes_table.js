/**
 * Migration: Create themes table
 */

exports.up = function(knex) {
  return knex.schema.createTable('themes', function(table) {
    table.string('id').primary();  // Theme ID (default, morning, etc.)
    table.string('name').notNullable(); // Display name
    table.boolean('active').defaultTo(true); // Whether theme is active
    table.string('startTime'); // Start time for auto-switching (HH:MM format)
    table.string('endTime'); // End time for auto-switching (HH:MM format)
    
    // Colors
    table.string('primaryColor').notNullable();
    table.string('secondaryColor').notNullable();
    table.string('accentColor').notNullable();
    table.string('backgroundColor').notNullable();
    table.string('textColor').notNullable();
    
    // Typography
    table.string('fontFamily');
    table.string('headingFontFamily');
    table.string('baseFontSize');
    
    // Spacing
    table.string('spacingUnit');
    
    // Borders
    table.string('borderRadius');
    
    // Shadows
    table.string('shadowColor');
    table.string('shadowSmall');
    table.string('shadowMedium');
    table.string('shadowLarge');
    
    // Transitions
    table.string('transitionSpeed');
    
    // Extra theme metadata
    table.string('description');
    table.string('logoPath');
    table.string('backgroundPath'); // Path to background image or video
    table.boolean('isSystem').defaultTo(false); // Whether this is a built-in theme
    table.boolean('isPreset').defaultTo(false); // Whether this is a preset theme
    
    // Tracking
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('themes');
};