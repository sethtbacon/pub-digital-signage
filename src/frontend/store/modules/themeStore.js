import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'default', // default, morning, afternoon, evening, night
    themes: {
      default: {
        primaryColor: '#ff6b01', // Orange
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#e74c3c', // Red
        backgroundColor: '#111', // Dark background
        textColor: '#ecf0f1' // Light text
      },
      morning: {
        primaryColor: '#f39c12', // Yellow-orange
        secondaryColor: '#3498db', // Blue
        accentColor: '#e74c3c', // Red
        backgroundColor: '#1a1a1a',
        textColor: '#ecf0f1'
      },
      afternoon: {
        primaryColor: '#ff6b01', // Orange
        secondaryColor: '#2980b9', // Dark blue
        accentColor: '#e67e22', // Orange
        backgroundColor: '#111',
        textColor: '#ecf0f1'
      },
      evening: {
        primaryColor: '#d35400', // Dark orange
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#c0392b', // Dark red
        backgroundColor: '#0a0a0a',
        textColor: '#ecf0f1'
      },
      night: {
        primaryColor: '#8e44ad', // Purple
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#3498db', // Blue
        backgroundColor: '#050505',
        textColor: '#ecf0f1'
      }
    },
    isAutoThemeEnabled: true
  }),
  
  getters: {
    currentThemeColors: (state) => state.themes[state.currentTheme],
    
    // Return CSS variables object for current theme
    cssVars: (state) => {
      const theme = state.themes[state.currentTheme];
      return {
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
        '--background-color': theme.backgroundColor,
        '--text-color': theme.textColor
      };
    }
  },
  
  actions: {
    // Set a specific theme
    setTheme(themeName) {
      if (this.themes[themeName]) {
        this.currentTheme = themeName;
        this.applyTheme();
      }
    },
    
    // Save a theme with new values
    saveTheme(themeName, themeColors) {
      // Update theme if it exists, otherwise add new theme
      if (themeName && themeColors) {
        this.themes[themeName] = { ...themeColors };
        
        // Apply if it's the current theme
        if (this.currentTheme === themeName) {
          this.applyTheme();
        }
        
        // Save themes to localStorage for persistence
        this.persistThemes();
      }
    },
    
    // Save themes to localStorage
    persistThemes() {
      localStorage.setItem('pubSignage_themes', JSON.stringify(this.themes));
    },
    
    // Toggle auto theme based on time of day
    toggleAutoTheme() {
      this.isAutoThemeEnabled = !this.isAutoThemeEnabled;
      if (this.isAutoThemeEnabled) {
        this.updateThemeByTime();
      }
    },
    
    // Apply the current theme CSS variables to the document
    applyTheme() {
      const theme = this.themes[this.currentTheme];
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', theme.accentColor);
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', theme.textColor);
    },
    
    // Update theme based on time of day
    updateThemeByTime() {
      if (!this.isAutoThemeEnabled) return;
      
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 11) {
        this.setTheme('morning');
      } else if (hour >= 11 && hour < 17) {
        this.setTheme('afternoon');
      } else if (hour >= 17 && hour < 22) {
        this.setTheme('evening');
      } else {
        this.setTheme('night');
      }
    },
    
    // Initialize theme system
    initialize() {
      // Set up auto theme updates
      if (this.isAutoThemeEnabled) {
        this.updateThemeByTime();
        
        // Update theme every hour
        setInterval(() => {
          this.updateThemeByTime();
        }, 60 * 60 * 1000);
      } else {
        this.applyTheme();
      }
    }
  }
});