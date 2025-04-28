<template>
  <div class="theme-management">
    <div class="page-header">
      <h1>Theme Management</h1>
      <p>Customize the appearance of your pub digital signage displays</p>
    </div>

    <div class="theme-settings">
      <div class="settings-card">
        <div class="card-header">
          <h2>Auto Theme Settings</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label class="switch-label">
              <span>Automatic Theme Switching</span>
              <div class="switch">
                <input
                  type="checkbox"
                  :checked="themeStore.isAutoThemeEnabled"
                  @change="themeStore.toggleAutoTheme"
                />
                <span class="slider"></span>
              </div>
            </label>
            <p class="setting-description">
              When enabled, themes will automatically change based on time of day
            </p>
          </div>

          <div class="time-periods">
            <div class="time-period">
              <h3>Morning</h3>
              <span class="time-range">5:00 - 11:00</span>
              <div
                class="color-preview"
                :style="{ backgroundColor: themeStore.themes.morning.primaryColor }"
              ></div>
            </div>
            <div class="time-period">
              <h3>Afternoon</h3>
              <span class="time-range">11:00 - 17:00</span>
              <div
                class="color-preview"
                :style="{ backgroundColor: themeStore.themes.afternoon.primaryColor }"
              ></div>
            </div>
            <div class="time-period">
              <h3>Evening</h3>
              <span class="time-range">17:00 - 22:00</span>
              <div
                class="color-preview"
                :style="{ backgroundColor: themeStore.themes.evening.primaryColor }"
              ></div>
            </div>
            <div class="time-period">
              <h3>Night</h3>
              <span class="time-range">22:00 - 5:00</span>
              <div
                class="color-preview"
                :style="{ backgroundColor: themeStore.themes.night.primaryColor }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="settings-card">
        <div class="card-header">
          <h2>Manual Theme Selection</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="theme-select">Current Theme</label>
            <select
              id="theme-select"
              v-model="selectedTheme"
              :disabled="themeStore.isAutoThemeEnabled"
              @change="changeTheme"
            >
              <option value="default">Default</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
              <option value="night">Night</option>
            </select>
          </div>

          <div class="theme-preview" :style="themePreviewStyle">
            <div class="preview-header">
              <div class="preview-title">Theme Preview</div>
              <div class="preview-time">20:00</div>
            </div>
            <div class="preview-content">
              <div class="preview-card">
                <h3>Featured Drink</h3>
                <p>Orange Pig IPA</p>
                <div class="preview-button">View</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Theme Colors Card -->
      <div class="settings-card">
        <div class="card-header">
          <h2>Theme Colors</h2>
        </div>
        <div class="card-body">
          <div class="color-settings">
            <div class="color-setting">
              <label>Primary Color</label>
              <input v-model="customColors.primaryColor" type="color" @input="updateCustomColors" />
              <span class="color-value">{{ customColors.primaryColor }}</span>
            </div>

            <div class="color-setting">
              <label>Secondary Color</label>
              <input
                v-model="customColors.secondaryColor"
                type="color"
                @input="updateCustomColors"
              />
              <span class="color-value">{{ customColors.secondaryColor }}</span>
            </div>

            <div class="color-setting">
              <label>Accent Color</label>
              <input v-model="customColors.accentColor" type="color" @input="updateCustomColors" />
              <span class="color-value">{{ customColors.accentColor }}</span>
            </div>

            <div class="color-setting">
              <label>Background Color</label>
              <input
                v-model="customColors.backgroundColor"
                type="color"
                @input="updateCustomColors"
              />
              <span class="color-value">{{ customColors.backgroundColor }}</span>
            </div>

            <div class="color-setting">
              <label>Text Color</label>
              <input v-model="customColors.textColor" type="color" @input="updateCustomColors" />
              <span class="color-value">{{ customColors.textColor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Typography Settings Card -->
      <div class="settings-card">
        <div class="card-header">
          <h2>Typography</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="font-family">Base Font Family</label>
            <select
              id="font-family"
              v-model="customTypography.fontFamily"
              :disabled="themeStore.isAutoThemeEnabled"
              @change="updateCustomTypography"
            >
              <option value="'Roboto', 'Helvetica Neue', Arial, sans-serif">Roboto</option>
              <option value="'Open Sans', 'Helvetica Neue', Arial, sans-serif">Open Sans</option>
              <option value="'Lato', 'Helvetica Neue', Arial, sans-serif">Lato</option>
              <option value="'Montserrat', 'Helvetica Neue', Arial, sans-serif">Montserrat</option>
              <option value="'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif">
                Source Sans Pro
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="heading-font-family">Heading Font Family</label>
            <select
              id="heading-font-family"
              v-model="customTypography.headingFontFamily"
              :disabled="themeStore.isAutoThemeEnabled"
              @change="updateCustomTypography"
            >
              <option value="'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif">
                Roboto Condensed
              </option>
              <option value="'Open Sans Condensed', 'Helvetica Neue', Arial, sans-serif">
                Open Sans Condensed
              </option>
              <option value="'Montserrat', 'Helvetica Neue', Arial, sans-serif">Montserrat</option>
              <option value="'Oswald', 'Helvetica Neue', Arial, sans-serif">Oswald</option>
              <option value="'Playfair Display', serif">Playfair Display</option>
            </select>
          </div>

          <div class="form-group">
            <label for="base-font-size">Base Font Size</label>
            <select
              id="base-font-size"
              v-model="customTypography.baseFontSize"
              :disabled="themeStore.isAutoThemeEnabled"
              @change="updateCustomTypography"
            >
              <option value="14px">Small (14px)</option>
              <option value="16px">Medium (16px)</option>
              <option value="18px">Large (18px)</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Styling Options Card -->
      <div class="settings-card">
        <div class="card-header">
          <h2>Styling Options</h2>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label for="border-radius">Border Radius</label>
            <input
              id="border-radius"
              v-model="customStyling.borderRadius"
              type="range"
              min="0"
              max="24"
              :disabled="themeStore.isAutoThemeEnabled"
              @input="updateCustomStyling"
            />
            <span class="range-value">{{ customStyling.borderRadius }}px</span>
          </div>

          <div class="form-group">
            <label for="shadow-intensity">Shadow Intensity</label>
            <input
              id="shadow-intensity"
              v-model="customStyling.shadowIntensity"
              type="range"
              min="0"
              max="40"
              :disabled="themeStore.isAutoThemeEnabled"
              @input="updateCustomStyling"
            />
            <span class="range-value">{{ customStyling.shadowIntensity }}%</span>
          </div>

          <div class="form-group">
            <label for="transition-speed">Transition Speed</label>
            <input
              id="transition-speed"
              v-model="customStyling.transitionSpeed"
              type="range"
              min="1"
              max="10"
              :disabled="themeStore.isAutoThemeEnabled"
              @input="updateCustomStyling"
            />
            <span class="range-value">{{ customStyling.transitionSpeed / 10 }}s</span>
          </div>
        </div>
      </div>

      <div class="settings-card actions-card">
        <div class="card-header">
          <h2>Theme Actions</h2>
        </div>
        <div class="card-body">
          <p class="setting-description">
            Save your customizations to the current theme or reset to default values.
          </p>

          <div class="action-buttons">
            <button
              class="btn btn-primary"
              :disabled="themeStore.isAutoThemeEnabled"
              @click="saveCustomTheme"
            >
              Save Custom Theme
            </button>
            <button
              class="btn btn-secondary"
              :disabled="themeStore.isAutoThemeEnabled"
              @click="resetTheme"
            >
              Reset to Default
            </button>
          </div>

          <div v-if="saveMessage" class="save-message">
            {{ saveMessage }}
          </div>

          <!-- Theme Presets Component -->
          <theme-presets
            @preset-applied="handlePresetApplied"
            @preset-saved="handlePresetSaved"
            @preset-deleted="handlePresetDeleted"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, inject } from 'vue';
import { useThemeStore } from '../../store/modules/themeStore';
import ThemePresets from '../../components/admin/ThemePresets.vue';
import '../../assets/styles/admin';

const themeStore = useThemeStore();
const theme = inject('theme'); // Get the theme service from the plugin

// Track the selected theme for the dropdown
const selectedTheme = ref(themeStore.currentTheme);

// Custom colors for theme editing
const customColors = ref({
  primaryColor: themeStore.currentThemeColors.primaryColor,
  secondaryColor: themeStore.currentThemeColors.secondaryColor,
  accentColor: themeStore.currentThemeColors.accentColor,
  backgroundColor: themeStore.currentThemeColors.backgroundColor,
  textColor: themeStore.currentThemeColors.textColor,
});

// Custom typography settings
const customTypography = ref({
  fontFamily: themeStore.currentThemeColors.fontFamily,
  headingFontFamily: themeStore.currentThemeColors.headingFontFamily,
  baseFontSize: themeStore.currentThemeColors.baseFontSize,
});

// Custom styling options
const customStyling = ref({
  borderRadius: parseInt(themeStore.currentThemeColors.borderRadius || '4'),
  shadowIntensity: 20, // Default value
  transitionSpeed: parseInt(
    parseFloat(themeStore.currentThemeColors.transitionSpeed || '0.5') * 10
  ),
});

// Success message for theme saving
const saveMessage = ref('');

// Preview styling based on custom colors
const themePreviewStyle = computed(() => {
  return {
    '--preview-primary-color': customColors.value.primaryColor,
    '--preview-secondary-color': customColors.value.secondaryColor,
    '--preview-accent-color': customColors.value.accentColor,
    '--preview-background-color': customColors.value.backgroundColor,
    '--preview-text-color': customColors.value.textColor,
    'font-family': customTypography.value.fontFamily,
    'border-radius': `${customStyling.value.borderRadius}px`,
    'box-shadow': `0 4px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    'transition-duration': `${customStyling.value.transitionSpeed / 10}s`,
  };
});

// Change theme based on dropdown selection
const changeTheme = () => {
  themeStore.setTheme(selectedTheme.value);
  // Update custom settings to reflect selected theme
  updateSettingsFromTheme();
};

// Update all custom settings from the current theme
const updateSettingsFromTheme = () => {
  const currentTheme = themeStore.currentThemeColors;

  // Update colors
  customColors.value = {
    primaryColor: currentTheme.primaryColor,
    secondaryColor: currentTheme.secondaryColor,
    accentColor: currentTheme.accentColor,
    backgroundColor: currentTheme.backgroundColor,
    textColor: currentTheme.textColor,
  };

  // Update typography
  customTypography.value = {
    fontFamily: currentTheme.fontFamily || "'Roboto', 'Helvetica Neue', Arial, sans-serif",
    headingFontFamily:
      currentTheme.headingFontFamily || "'Roboto Condensed', 'Helvetica Neue', Arial, sans-serif",
    baseFontSize: currentTheme.baseFontSize || '16px',
  };

  // Update styling options
  customStyling.value = {
    borderRadius: parseInt(currentTheme.borderRadius || '4'),
    shadowIntensity: 20, // Default value
    transitionSpeed: parseInt(parseFloat(currentTheme.transitionSpeed || '0.5') * 10),
  };
};

// Apply custom theme colors to preview
const updateCustomColors = () => {
  // Update the preview using our theme plugin
  updateThemePreview();
};

// Apply custom typography settings
const updateCustomTypography = () => {
  updateThemePreview();
};

// Apply custom styling options
const updateCustomStyling = () => {
  updateThemePreview();
};

// Update the theme preview with all custom settings
const updateThemePreview = () => {
  const previewTheme = {
    ...customColors.value,
    ...customTypography.value,
    borderRadius: `${customStyling.value.borderRadius}px`,
    shadowSmall: `0 2px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    shadowMedium: `0 4px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    shadowLarge: `0 8px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    transitionSpeed: `${customStyling.value.transitionSpeed / 10}s`,
  };

  // Apply the preview theme
  theme.applyPreviewTheme(previewTheme);
};

// Save custom theme
const saveCustomTheme = () => {
  // Combine all custom settings
  const themeData = {
    ...customColors.value,
    ...customTypography.value,
    borderRadius: `${customStyling.value.borderRadius}px`,
    shadowColor: `rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    shadowSmall: `0 2px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    shadowMedium: `0 4px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    shadowLarge: `0 8px ${customStyling.value.shadowIntensity / 5}px rgba(0, 0, 0, ${customStyling.value.shadowIntensity / 100})`,
    transitionSpeed: `${customStyling.value.transitionSpeed / 10}s`,
  };

  // Use our centralized theme plugin to save the theme
  theme.saveCustomTheme(selectedTheme.value, themeData);

  // Show success message
  saveMessage.value = 'Theme saved successfully!';
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
};

// Reset theme to default values
const resetTheme = () => {
  selectedTheme.value = 'default';
  themeStore.setTheme('default');
  updateSettingsFromTheme();
};

// Handle preset applied
const handlePresetApplied = preset => {
  // Update theme selection to match current theme
  selectedTheme.value = themeStore.currentTheme;
  // Update all settings from the theme
  updateSettingsFromTheme();
  // Show success message
  saveMessage.value = `Applied "${preset.name}" theme preset`;
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
};

// Handle preset saved
const handlePresetSaved = preset => {
  saveMessage.value = `Saved "${preset.name}" theme preset`;
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
};

// Handle preset deleted
const handlePresetDeleted = presetId => {
  saveMessage.value = 'Theme preset deleted';
  setTimeout(() => {
    saveMessage.value = '';
  }, 3000);
};

// Watch for changes in the theme store
watch(
  () => themeStore.currentTheme,
  () => {
    selectedTheme.value = themeStore.currentTheme;
    updateSettingsFromTheme();
  }
);

onMounted(() => {
  // Ensure we have the latest theme selected
  selectedTheme.value = themeStore.currentTheme;
  updateSettingsFromTheme();
});
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../assets/styles/variables' as *;

.theme-management {
  @extend .admin-page !optional;
}

// Theme-specific styles not covered by global styles
.page-header {
  margin-bottom: 2rem;

  h1 {
    margin-bottom: 0.5rem;
    font-size: 1.8rem;
    color: #333;
  }

  p {
    color: #666;
    font-size: 1rem;
  }
}

.theme-settings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 2rem;
}

.settings-card {
  background-color: white;
  border-radius: var(--border-radius-medium);
  box-shadow: var(--shadow-small);
  overflow: hidden;
  transition: box-shadow $transition-speed-fast;

  &:hover {
    box-shadow: var(--shadow-medium);
  }

  .card-header {
    padding: 1.25rem;
    background-color: #f9f9f9;
    border-bottom: 1px solid #eee;

    h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #333;
    }
  }

  .card-body {
    padding: 1.5rem;
  }

  &.actions-card {
    grid-column: 1 / -1; // Span all columns
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  select,
  input[type='text'] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-small);
    font-size: 0.9rem;
  }

  input[type='range'] {
    width: 100%;
    margin: 0.5rem 0;
  }

  .range-value {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.25rem;
    text-align: right;
  }
}

.setting-description {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 1rem;
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;

    input {
      opacity: 0;
      width: 0;
      height: 0;

      &:checked + .slider {
        background-color: var(--primary-color);
      }

      &:checked + .slider:before {
        transform: translateX(26px);
      }
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.4s;
      border-radius: 34px;

      &:before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    }
  }
}

.time-periods {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.time-period {
  text-align: center;
  padding: 0.75rem;
  border-radius: var(--border-radius-small);
  background-color: #f9f9f9;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }

  .time-range {
    display: block;
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 0.5rem;
  }

  .color-preview {
    height: 20px;
    border-radius: var(--border-radius-small);
  }
}

.theme-preview {
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  margin-top: 1.5rem;
  border: 1px solid #ddd;
  background-color: var(--preview-background-color);
  color: var(--preview-text-color);
  transition: all var(--transition-speed);

  .preview-header {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background-color: var(--preview-primary-color);
    color: var(--preview-text-color);
    font-weight: 500;
  }

  .preview-content {
    padding: 1rem;
  }

  .preview-card {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--border-radius-small);
    padding: 1rem;
    box-shadow: var(--shadow-small);

    h3 {
      margin: 0 0 0.5rem 0;
      color: var(--preview-primary-color);
    }

    p {
      margin: 0 0 1rem 0;
    }

    .preview-button {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      background-color: var(--preview-accent-color);
      color: var(--preview-text-color);
      border-radius: var(--border-radius-small);
      font-size: 0.9rem;
      transition: all var(--transition-speed);

      &:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-medium);
      }
    }
  }
}

.color-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.color-setting {
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  input[type='color'] {
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: var(--border-radius-small);
    background-color: white;
    cursor: pointer;
  }

  .color-value {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.25rem;
    text-align: center;
  }
}

.action-buttons {
  margin-top: 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  .btn {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius-small);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-speed);

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;

    &:hover:not(:disabled) {
      background-color: color.adjust($primary-color, $lightness: -10%);
    }
  }

  .btn-secondary {
    background-color: #f1f1f1;
    color: #333;

    &:hover:not(:disabled) {
      background-color: color.adjust(#f1f1f1, $lightness: -10%);
    }
  }
}

.save-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: var(--border-radius-small);
  text-align: center;
  transition: opacity var(--transition-speed);
}

@media (max-width: 768px) {
  .theme-settings {
    grid-template-columns: 1fr;
  }

  .time-periods {
    grid-template-columns: repeat(2, 1fr);
  }

  .color-settings {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .time-periods {
    grid-template-columns: 1fr;
  }

  .color-settings {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
