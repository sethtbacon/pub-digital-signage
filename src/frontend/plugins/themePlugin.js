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
        // Load saved themes from localStorage if available
        const savedThemes = localStorage.getItem('pubSignage_themes');
        if (savedThemes) {
          try {
            const themes = JSON.parse(savedThemes);
            this.store.themes = themes;
          } catch (error) {
            console.error('Failed to load saved themes', error);
          }
        }
        
        // Initialize the theme system from the store
        this.store.initialize();
        
        return this;
      },
      
      // Apply preview theme without saving
      applyPreviewTheme(themeColors) {
        const previewVars = {
          '--preview-primary-color': themeColors.primaryColor,
          '--preview-secondary-color': themeColors.secondaryColor,
          '--preview-accent-color': themeColors.accentColor,
          '--preview-background-color': themeColors.backgroundColor,
          '--preview-text-color': themeColors.textColor
        };
        
        // Apply preview variables
        Object.entries(previewVars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      },
      
      // Save a custom theme
      saveCustomTheme(themeName, themeColors) {
        this.store.saveTheme(themeName, themeColors);
        return this;
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