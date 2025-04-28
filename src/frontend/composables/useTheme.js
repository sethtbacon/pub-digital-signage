/**
 * Theme composable for pub digital signage
 * Provides a clean API for components to interact with the theme system
 */

import { inject, computed } from 'vue';
import { useThemeStore } from '../store/modules/themeStore';

export function useTheme() {
  const themeStore = useThemeStore();
  const themeService = inject('theme');

  // Current theme name (default, morning, afternoon, evening, night)
  const currentTheme = computed(() => themeStore.currentTheme);

  // Current theme colors
  const colors = computed(() => themeStore.currentThemeColors);

  // Is auto theme switching enabled
  const isAutoThemeEnabled = computed(() => themeStore.isAutoThemeEnabled);

  // Toggle auto theme switching
  const toggleAutoTheme = () => themeStore.toggleAutoTheme();

  // Manually set theme
  const setTheme = themeName => themeStore.setTheme(themeName);

  // All available themes
  const availableThemes = computed(() => Object.keys(themeStore.themes));

  // Save a custom theme
  const saveTheme = (name, colors) => {
    themeService.saveCustomTheme(name, colors);
  };

  return {
    currentTheme,
    colors,
    isAutoThemeEnabled,
    toggleAutoTheme,
    setTheme,
    availableThemes,
    saveTheme,
  };
}
