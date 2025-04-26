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
            // Fetch theme preset from API
            const response = await fetch(`/api/themes/${presetId}`);
            
            if (!response.ok) {
              throw new Error(`Failed to load theme preset: ${response.statusText}`);
            }
            
            const preset = await response.json();
            
            // Apply the preset to the current theme
            if (preset) {
              const themeData = {
                primaryColor: preset.primaryColor,
                secondaryColor: preset.secondaryColor,
                accentColor: preset.accentColor,
                backgroundColor: preset.backgroundColor,
                textColor: preset.textColor,
                fontFamily: preset.fontFamily,
                headingFontFamily: preset.headingFontFamily,
                baseFontSize: preset.baseFontSize,
                spacingUnit: preset.spacingUnit,
                borderRadius: preset.borderRadius,
                shadowColor: preset.shadowColor,
                shadowSmall: preset.shadowSmall,
                shadowMedium: preset.shadowMedium,
                shadowLarge: preset.shadowLarge,
                transitionSpeed: preset.transitionSpeed
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
            
            if (!response.ok) {
              throw new Error(`Failed to get theme presets: ${response.statusText}`);
            }
            
            const presets = await response.json();
            resolve(presets);
          } catch (error) {
            console.error('Error getting theme presets:', error);
            reject(error);
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