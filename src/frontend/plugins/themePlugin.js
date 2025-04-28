/**
 * Theme Plugin
 * Centralizes theme management for the pub digital signage application
 */

import { useThemeStore } from '../store/modules/themeStore';

export default {
  install(app) {
    // Create a global theme service
    const themeService = {
      store: useThemeStore(),
      
      // Initialize the theme system
      init() {
        // Initialize the theme system from the store
        this.store.initialize();
        
        return this;
      },
      
      // Apply preview theme without saving
      applyPreviewTheme(themeData) {
        // Base preview variables
        const previewVars = {
          '--preview-primary-color': themeData.primaryColor,
          '--preview-secondary-color': themeData.secondaryColor,
          '--preview-accent-color': themeData.accentColor,
          '--preview-background-color': themeData.backgroundColor,
          '--preview-text-color': themeData.textColor,
        };
        
        // Add typography variables if available
        if (themeData.fontFamily) {
          previewVars['--preview-font-family'] = themeData.fontFamily;
        }
        if (themeData.headingFontFamily) {
          previewVars['--preview-heading-font-family'] = themeData.headingFontFamily;
        }
        if (themeData.baseFontSize) {
          previewVars['--preview-font-size'] = themeData.baseFontSize;
        }
        
        // Add spacing, border, shadow variables if available
        if (themeData.spacingUnit) {
          previewVars['--preview-spacing-unit'] = themeData.spacingUnit;
        }
        if (themeData.borderRadius) {
          previewVars['--preview-border-radius'] = themeData.borderRadius;
        }
        if (themeData.shadowSmall) {
          previewVars['--preview-shadow-small'] = themeData.shadowSmall;
        }
        if (themeData.shadowMedium) {
          previewVars['--preview-shadow-medium'] = themeData.shadowMedium;
        }
        if (themeData.shadowLarge) {
          previewVars['--preview-shadow-large'] = themeData.shadowLarge;
        }
        if (themeData.transitionSpeed) {
          previewVars['--preview-transition-speed'] = themeData.transitionSpeed;
        }
        
        // Apply preview variables
        Object.entries(previewVars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      },
      
      // Save a custom theme
      saveCustomTheme(themeName, themeData) {
        this.store.saveTheme(themeName, themeData);
        return this;
      },
      
      // Load a theme preset
      loadThemePreset(presetId) {
        return new Promise(async (resolve, reject) => {
          try {
            if (!presetId) {
              console.warn('Invalid preset ID provided');
              reject(new Error('Invalid preset ID'));
              return;
            }
            
            // Fetch theme preset from API
            const response = await fetch(`/api/themes/${presetId}`);
            
            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn('Theme preset API did not return JSON');
              reject(new Error('Invalid response format'));
              return;
            }
            
            if (!response.ok) {
              throw new Error(`Failed to load theme preset: ${response.statusText}`);
            }
            
            const preset = await response.json();
            
            // Apply the preset to the current theme
            if (preset) {
              const themeData = {
                primaryColor: preset.primaryColor || '#ff6b01',
                secondaryColor: preset.secondaryColor || '#2c3e50',
                accentColor: preset.accentColor || '#e74c3c',
                backgroundColor: preset.backgroundColor || '#111',
                textColor: preset.textColor || '#ecf0f1',
                fontFamily: preset.fontFamily || "'Roboto', 'Helvetica Neue', Arial, sans-serif",
                headingFontFamily: preset.headingFontFamily || "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
                baseFontSize: preset.baseFontSize || '16px',
                spacingUnit: preset.spacingUnit || '1rem',
                borderRadius: preset.borderRadius || '4px',
                shadowColor: preset.shadowColor || 'rgba(0, 0, 0, 0.2)',
                shadowSmall: preset.shadowSmall || '0 2px 5px rgba(0, 0, 0, 0.1)',
                shadowMedium: preset.shadowMedium || '0 4px 10px rgba(0, 0, 0, 0.15)', 
                shadowLarge: preset.shadowLarge || '0 8px 20px rgba(0, 0, 0, 0.2)',
                transitionSpeed: preset.transitionSpeed || '0.5s'
              };
              
              this.store.saveTheme(this.store.currentTheme, themeData);
              resolve(preset);
            } else {
              reject(new Error('Theme preset not found'));
            }
          } catch (error) {
            console.error('Error loading theme preset:', error);
            reject(error);
          }
        });
      },
      
      // Get all theme presets
      getThemePresets() {
        return new Promise(async (resolve, reject) => {
          try {
            // Fetch theme presets from API
            const response = await fetch('/api/themes?isPreset=true');
            
            // Check if the response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.warn('Theme preset API did not return JSON');
              resolve([]); // Return empty array instead of rejecting
              return;
            }
            
            if (!response.ok) {
              console.warn(`Failed to get theme presets: ${response.statusText}`);
              resolve([]); // Return empty array instead of rejecting
              return;
            }
            
            const presets = await response.json();
            resolve(Array.isArray(presets) ? presets : []);
          } catch (error) {
            console.error('Error getting theme presets:', error);
            resolve([]); // Return empty array instead of rejecting
          }
        });
      },
      
      // Save current theme as a preset
      saveAsPreset(presetName, presetId, description) {
        return new Promise(async (resolve, reject) => {
          try {
            const currentTheme = this.store.themes[this.store.currentTheme];
            
            const presetData = {
              id: presetId,
              name: presetName,
              description: description || `Custom theme preset based on ${this.store.currentTheme}`,
              isPreset: true,
              
              // Copy all theme properties
              ...currentTheme
            };
            
            // Save to API
            const response = await fetch('/api/themes', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(presetData)
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.error || 'Failed to save theme preset');
            }
            
            const newPreset = await response.json();
            resolve(newPreset);
          } catch (error) {
            console.error('Error saving theme preset:', error);
            reject(error);
          }
        });
      }
    };
    
    // Register as a global property
    app.config.globalProperties.$theme = themeService;
    
    // Make theme service available via the inject API
    app.provide('theme', themeService);
    
    // Initialize the theme service
    themeService.init();
  }
};