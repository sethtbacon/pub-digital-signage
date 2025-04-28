import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'default', // default, morning, afternoon, evening, night
    themes: {
      default: {
        // Colors
        primaryColor: '#ff6b01', // Orange
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#e74c3c', // Red
        backgroundColor: '#111', // Dark background
        textColor: '#ecf0f1', // Light text

        // Typography
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',

        // Spacing
        spacingUnit: '1rem',

        // Borders
        borderRadius: '4px',

        // Shadows
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',

        // Transitions
        transitionSpeed: '0.5s',
      },
      morning: {
        // Colors
        primaryColor: '#f39c12', // Yellow-orange
        secondaryColor: '#3498db', // Blue
        accentColor: '#e74c3c', // Red
        backgroundColor: '#1a1a1a',
        textColor: '#ecf0f1',

        // Typography
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',

        // Spacing
        spacingUnit: '1rem',

        // Borders
        borderRadius: '4px',

        // Shadows
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',

        // Transitions
        transitionSpeed: '0.5s',
      },
      afternoon: {
        // Colors
        primaryColor: '#ff6b01', // Orange
        secondaryColor: '#2980b9', // Dark blue
        accentColor: '#e67e22', // Orange
        backgroundColor: '#111',
        textColor: '#ecf0f1',

        // Typography
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',

        // Spacing
        spacingUnit: '1rem',

        // Borders
        borderRadius: '4px',

        // Shadows
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',

        // Transitions
        transitionSpeed: '0.5s',
      },
      evening: {
        // Colors
        primaryColor: '#d35400', // Dark orange
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#c0392b', // Dark red
        backgroundColor: '#0a0a0a',
        textColor: '#ecf0f1',

        // Typography
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',

        // Spacing
        spacingUnit: '1rem',

        // Borders
        borderRadius: '4px',

        // Shadows
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',

        // Transitions
        transitionSpeed: '0.5s',
      },
      night: {
        // Colors
        primaryColor: '#8e44ad', // Purple
        secondaryColor: '#2c3e50', // Dark blue-grey
        accentColor: '#3498db', // Blue
        backgroundColor: '#050505',
        textColor: '#ecf0f1',

        // Typography
        fontFamily: "'Roboto', 'Helvetica Neue', Arial, sans-serif",
        headingFontFamily: "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
        baseFontSize: '16px',

        // Spacing
        spacingUnit: '1rem',

        // Borders
        borderRadius: '4px',

        // Shadows
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowSmall: '0 2px 5px rgba(0, 0, 0, 0.1)',
        shadowMedium: '0 4px 10px rgba(0, 0, 0, 0.15)',
        shadowLarge: '0 8px 20px rgba(0, 0, 0, 0.2)',

        // Transitions
        transitionSpeed: '0.5s',
      },
    },
    isAutoThemeEnabled: true,
    // Add configurable time ranges for themes
    themeTimeRanges: {
      morning: {
        start: '05:00',
        end: '11:00'
      },
      afternoon: {
        start: '11:00',
        end: '17:00'
      },
      evening: {
        start: '17:00',
        end: '22:00'
      },
      night: {
        start: '22:00',
        end: '05:00'
      }
    }
  }),

  getters: {
    currentThemeColors: state => state.themes[state.currentTheme],

    // Return CSS variables object for current theme
    cssVars: state => {
      const theme = state.themes[state.currentTheme];
      return {
        // Colors
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
        '--background-color': theme.backgroundColor,
        '--text-color': theme.textColor,

        // Typography
        '--font-family-base': theme.fontFamily,
        '--font-family-headings': theme.headingFontFamily,
        '--font-size-base': theme.baseFontSize,

        // Spacing
        '--spacing-unit': theme.spacingUnit,

        // Borders
        '--border-radius': theme.borderRadius,

        // Shadows
        '--shadow-color': theme.shadowColor,
        '--shadow-small': theme.shadowSmall,
        '--shadow-medium': theme.shadowMedium,
        '--shadow-large': theme.shadowLarge,

        // Transitions
        '--transition-speed': theme.transitionSpeed,
      };
    },
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
        this.themes[themeName] = {
          ...this.themes[themeName], // Keep existing properties
          ...themeColors, // Apply new values
        };

        // Apply if it's the current theme
        if (this.currentTheme === themeName) {
          this.applyTheme();
        }

        // Save themes to localStorage for persistence
        this.persistThemes();

        // If sync with backend is enabled, save to database
        this.syncThemeWithBackend(themeName);
      }
    },

    // Save theme time range for a specific theme
    setThemeTimeRange(themeName, startTime, endTime) {
      if (this.themeTimeRanges[themeName]) {
        this.themeTimeRanges[themeName] = {
          start: startTime,
          end: endTime
        };
        
        // Persist the updated time ranges
        this.persistThemeTimeRanges();
        
        // Apply the new time ranges (update current theme if auto mode is on)
        if (this.isAutoThemeEnabled) {
          this.updateThemeByTime();
        }
        
        // Sync with backend if available
        this.syncThemeTimeRangesWithBackend();
      }
    },
    
    // Persist theme time ranges to localStorage
    persistThemeTimeRanges() {
      localStorage.setItem('pubSignage_themeTimeRanges', JSON.stringify(this.themeTimeRanges));
    },
    
    // Load theme time ranges from localStorage
    loadThemeTimeRanges() {
      const savedTimeRanges = localStorage.getItem('pubSignage_themeTimeRanges');
      if (savedTimeRanges) {
        try {
          const parsedTimeRanges = JSON.parse(savedTimeRanges);
          // Update each theme time range
          Object.keys(parsedTimeRanges).forEach(key => {
            if (this.themeTimeRanges[key]) {
              this.themeTimeRanges[key] = parsedTimeRanges[key];
            }
          });
        } catch (e) {
          console.error('Error parsing saved theme time ranges', e);
        }
      }
    },
    
    // Sync theme time ranges with backend database
    async syncThemeTimeRangesWithBackend() {
      try {
        // Use API to save theme time ranges to database
        const response = await fetch('/api/themes/time-ranges', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.themeTimeRanges),
        });

        if (!response.ok) {
          console.error('Failed to save theme time ranges to database:', await response.text());
        }
      } catch (error) {
        console.error('Error syncing theme time ranges with backend:', error);
      }
    },
    
    // Load theme time ranges from backend
    async loadThemeTimeRangesFromBackend() {
      try {
        const response = await fetch('/api/themes/time-ranges');
        
        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Theme time ranges API did not return JSON. Using default time ranges.');
          return;
        }

        if (response.ok) {
          const timeRanges = await response.json();

          // Handle empty response
          if (!timeRanges) {
            console.warn('Theme time ranges API returned invalid data. Using default time ranges.');
            return;
          }

          // Update local time ranges with backend values
          Object.keys(timeRanges).forEach(key => {
            if (this.themeTimeRanges[key]) {
              this.themeTimeRanges[key] = timeRanges[key];
            }
          });

          // Save merged time ranges
          this.persistThemeTimeRanges();
        }
      } catch (error) {
        console.warn('Error loading theme time ranges from backend, using default time ranges:', error);
      }
    },

    // Save themes to localStorage
    persistThemes() {
      localStorage.setItem('pubSignage_themes', JSON.stringify(this.themes));
    },

    // Sync theme with backend database
    async syncThemeWithBackend(themeName) {
      try {
        const theme = this.themes[themeName];
        if (!theme) return;

        // Use API to save theme to database
        const response = await fetch(`/api/themes/${themeName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(theme),
        });

        if (!response.ok) {
          console.error('Failed to save theme to database:', await response.text());
        }
      } catch (error) {
        console.error('Error syncing theme with backend:', error);
      }
    },

    // Load themes from backend
    async loadThemesFromBackend() {
      try {
        const response = await fetch('/api/themes');

        // Check if the response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.warn('Theme API did not return JSON. Using default themes.');
          return; // Exit early, use default themes
        }

        if (response.ok) {
          const themes = await response.json();

          // Handle empty themes array
          if (!themes || !Array.isArray(themes)) {
            console.warn('Theme API returned invalid data. Using default themes.');
            return;
          }

          // Merge with existing themes, keeping local customizations
          themes.forEach(theme => {
            if (theme && theme.id && theme.name) {
              // Only update if not already customized locally
              if (
                !this.themes[theme.id] ||
                theme.lastUpdated > (this.themes[theme.id].lastUpdated || 0)
              ) {
                this.themes[theme.id] = { ...theme };
              }
            }
          });

          // Save merged themes
          this.persistThemes();
          this.applyTheme();
        }
      } catch (error) {
        console.warn('Error loading themes from backend, using default themes:', error);
        // Continue with default themes
        this.applyTheme();
      }
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

      // Apply colors
      document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
      document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
      document.documentElement.style.setProperty('--accent-color', theme.accentColor);
      document.documentElement.style.setProperty('--background-color', theme.backgroundColor);
      document.documentElement.style.setProperty('--text-color', theme.textColor);

      // Apply typography
      document.documentElement.style.setProperty('--font-family-base', theme.fontFamily);
      document.documentElement.style.setProperty('--font-family-headings', theme.headingFontFamily);
      document.documentElement.style.setProperty('--font-size-base', theme.baseFontSize);

      // Apply spacing
      document.documentElement.style.setProperty('--spacing-unit', theme.spacingUnit);

      // Apply borders
      document.documentElement.style.setProperty('--border-radius', theme.borderRadius);

      // Apply shadows
      document.documentElement.style.setProperty('--shadow-color', theme.shadowColor);
      document.documentElement.style.setProperty('--shadow-small', theme.shadowSmall);
      document.documentElement.style.setProperty('--shadow-medium', theme.shadowMedium);
      document.documentElement.style.setProperty('--shadow-large', theme.shadowLarge);

      // Apply transitions
      document.documentElement.style.setProperty('--transition-speed', theme.transitionSpeed);
    },

    // Helper function to check if the current time is within a range
    isTimeInRange(timeStr, startTimeStr, endTimeStr) {
      const time = this.parseTime(timeStr);
      const startTime = this.parseTime(startTimeStr);
      const endTime = this.parseTime(endTimeStr);
      
      // Handle cases where the end time is earlier than start time (crosses midnight)
      if (endTime < startTime) {
        return time >= startTime || time < endTime;
      }
      
      return time >= startTime && time < endTime;
    },
    
    // Helper to parse a time string (HH:MM) to minutes since midnight
    parseTime(timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    },
    
    // Helper to get current time string in 24-hour format (HH:MM)
    getCurrentTimeString() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },

    // Update theme based on time of day using configurable time ranges
    updateThemeByTime() {
      if (!this.isAutoThemeEnabled) return;

      const currentTime = this.getCurrentTimeString();
      
      // Check each theme's time range
      if (this.isTimeInRange(currentTime, this.themeTimeRanges.morning.start, this.themeTimeRanges.morning.end)) {
        this.setTheme('morning');
      } else if (this.isTimeInRange(currentTime, this.themeTimeRanges.afternoon.start, this.themeTimeRanges.afternoon.end)) {
        this.setTheme('afternoon');
      } else if (this.isTimeInRange(currentTime, this.themeTimeRanges.evening.start, this.themeTimeRanges.evening.end)) {
        this.setTheme('evening');
      } else if (this.isTimeInRange(currentTime, this.themeTimeRanges.night.start, this.themeTimeRanges.night.end)) {
        this.setTheme('night');
      } else {
        // Fallback to default theme if somehow no time range matches
        this.setTheme('default');
      }
    },

    // Initialize theme system
    initialize() {
      // Try to load theme time ranges from localStorage first
      this.loadThemeTimeRanges();
      
      // Then try to load from backend, which will merge
      this.loadThemeTimeRangesFromBackend();
      
      // Try to load themes from localStorage first
      const savedThemes = localStorage.getItem('pubSignage_themes');
      if (savedThemes) {
        try {
          const parsedThemes = JSON.parse(savedThemes);
          // Only update individual theme properties to preserve defaults
          Object.keys(parsedThemes).forEach(key => {
            if (this.themes[key]) {
              this.themes[key] = {
                ...this.themes[key], // Keep default properties
                ...parsedThemes[key], // Override with saved values
              };
            } else {
              this.themes[key] = parsedThemes[key]; // Add new custom themes
            }
          });
        } catch (e) {
          console.error('Error parsing saved themes', e);
        }
      }

      // Then try to load from backend, which will merge
      this.loadThemesFromBackend();

      // Set up auto theme updates
      if (this.isAutoThemeEnabled) {
        this.updateThemeByTime();

        // Update theme every minute to ensure accurate time-based changes
        setInterval(
          () => {
            this.updateThemeByTime();
          },
          60 * 1000 // Check every minute instead of every hour
        );
      } else {
        this.applyTheme();
      }
    },
  },
});
