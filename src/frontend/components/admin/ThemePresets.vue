<template>
  <div class="theme-presets">
    <h3>Theme Presets</h3>
    <p class="description">
      Save your custom themes as presets for quick access, or use one of our pre-defined presets.
    </p>

    <div class="presets-grid">
      <div
        v-for="preset in presets"
        :key="preset.id"
        class="preset-card"
        @click="selectPreset(preset)"
      >
        <div
          class="preset-color-bar"
          :style="{
            background: `linear-gradient(to right, ${preset.primaryColor}, ${preset.secondaryColor}, ${preset.accentColor})`,
          }"
        ></div>
        <div class="preset-details">
          <h4>{{ preset.name }}</h4>
          <p>{{ preset.description || 'Custom theme preset' }}</p>
        </div>
        <div class="preset-actions">
          <button class="apply-preset" @click.stop="applyPreset(preset)">Apply</button>
          <button class="edit-preset" @click.stop="editPreset(preset)">Edit</button>
          <button
            v-if="!preset.isSystem"
            class="delete-preset"
            @click.stop="deletePreset(preset.id)"
          >
            Delete
          </button>
        </div>
      </div>

      <div class="preset-card preset-card-new" @click="showSavePresetForm">
        <div class="preset-new-icon">+</div>
        <div class="preset-details">
          <h4>Save Current Theme</h4>
          <p>Create a new preset from current theme settings</p>
        </div>
      </div>
    </div>

    <!-- Save Preset Form -->
    <div v-if="showSaveForm" class="save-preset-form">
      <div class="form-header">
        <h4>Save Theme as Preset</h4>
        <div class="form-actions">
          <button class="btn-cancel" @click="cancelSavePreset">Cancel</button>
          <button class="btn-save" :disabled="!isValidPreset" @click="saveNewPreset">Save</button>
        </div>
      </div>

      <div class="form-group">
        <label for="preset-name">Preset Name</label>
        <input
          id="preset-name"
          v-model="newPreset.name"
          type="text"
          placeholder="My Custom Theme"
        />
      </div>

      <div class="form-group">
        <label for="preset-description">Description</label>
        <textarea
          id="preset-description"
          v-model="newPreset.description"
          placeholder="Describe your theme preset"
          rows="2"
        ></textarea>
      </div>

      <div class="form-group preset-id-group">
        <label for="preset-id">Preset ID</label>
        <input id="preset-id" v-model="newPreset.id" type="text" placeholder="my-custom-theme" />
        <span class="help-text">Used as an identifier, no spaces or special characters</span>
      </div>
    </div>

    <!-- Edit Preset Form -->
    <div v-if="showEditForm" class="edit-preset-form">
      <div class="form-header">
        <h4>Edit Theme Preset</h4>
        <div class="form-actions">
          <button class="btn-cancel" @click="cancelEditPreset">Cancel</button>
          <button class="btn-save" @click="saveEditedPreset">Save Changes</button>
        </div>
      </div>

      <div class="form-group">
        <label for="edit-preset-name">Preset Name</label>
        <input
          id="edit-preset-name"
          v-model="editingPreset.name"
          type="text"
          placeholder="My Custom Theme"
        />
      </div>

      <div class="form-group">
        <label for="edit-preset-description">Description</label>
        <textarea
          id="edit-preset-description"
          v-model="editingPreset.description"
          placeholder="Describe your theme preset"
          rows="2"
        ></textarea>
      </div>

      <!-- Colors settings -->
      <div class="form-section">
        <h5>Colors</h5>
        <div class="color-settings">
          <div class="color-setting">
            <label>Primary Color</label>
            <input v-model="editingPreset.primaryColor" type="color" />
            <span class="color-value">{{ editingPreset.primaryColor }}</span>
          </div>

          <div class="color-setting">
            <label>Secondary Color</label>
            <input v-model="editingPreset.secondaryColor" type="color" />
            <span class="color-value">{{ editingPreset.secondaryColor }}</span>
          </div>

          <div class="color-setting">
            <label>Accent Color</label>
            <input v-model="editingPreset.accentColor" type="color" />
            <span class="color-value">{{ editingPreset.accentColor }}</span>
          </div>

          <div class="color-setting">
            <label>Background Color</label>
            <input v-model="editingPreset.backgroundColor" type="color" />
            <span class="color-value">{{ editingPreset.backgroundColor }}</span>
          </div>

          <div class="color-setting">
            <label>Text Color</label>
            <input v-model="editingPreset.textColor" type="color" />
            <span class="color-value">{{ editingPreset.textColor }}</span>
          </div>
        </div>
      </div>

      <!-- Typography settings -->
      <div class="form-section">
        <h5>Typography</h5>
        <div class="form-group">
          <label for="edit-font-family">Base Font Family</label>
          <select id="edit-font-family" v-model="editingPreset.fontFamily">
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
          <label for="edit-heading-font-family">Heading Font Family</label>
          <select id="edit-heading-font-family" v-model="editingPreset.headingFontFamily">
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
          <label for="edit-base-font-size">Base Font Size</label>
          <select id="edit-base-font-size" v-model="editingPreset.baseFontSize">
            <option value="14px">Small (14px)</option>
            <option value="16px">Medium (16px)</option>
            <option value="18px">Large (18px)</option>
          </select>
        </div>
      </div>

      <!-- Styling settings -->
      <div class="form-section">
        <h5>Styling</h5>
        <div class="form-group">
          <label for="edit-border-radius">Border Radius</label>
          <input
            id="edit-border-radius"
            v-model="borderRadiusValue"
            type="range"
            min="0"
            max="24"
          />
          <span class="range-value">{{ borderRadiusValue }}px</span>
        </div>

        <div class="form-group">
          <label for="edit-shadow-intensity">Shadow Intensity</label>
          <input
            id="edit-shadow-intensity"
            v-model="shadowIntensityValue"
            type="range"
            min="0"
            max="40"
          />
          <span class="range-value">{{ shadowIntensityValue }}%</span>
        </div>

        <div class="form-group">
          <label for="edit-transition-speed">Transition Speed</label>
          <input
            id="edit-transition-speed"
            v-model="transitionSpeedValue"
            type="range"
            min="1"
            max="10"
          />
          <span class="range-value">{{ transitionSpeedValue / 10 }}s</span>
        </div>
      </div>
    </div>

    <div v-if="message" class="message" :class="{ success: !isError, error: isError }">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useThemeStore } from '../../store/modules/themeStore';

const themeStore = useThemeStore();
const emit = defineEmits(['preset-applied', 'preset-saved', 'preset-deleted']);

const presets = ref([]);
const showSaveForm = ref(false);
const showEditForm = ref(false);
const message = ref('');
const isError = ref(false);

const newPreset = ref({
  id: '',
  name: '',
  description: '',
});

const editingPreset = ref({
  id: '',
  name: '',
  description: '',
  primaryColor: '',
  secondaryColor: '',
  accentColor: '',
  backgroundColor: '',
  textColor: '',
  fontFamily: '',
  headingFontFamily: '',
  baseFontSize: '',
  spacingUnit: '',
  borderRadius: '',
  shadowColor: '',
  shadowSmall: '',
  shadowMedium: '',
  shadowLarge: '',
  transitionSpeed: '',
});

const isValidPreset = computed(() => {
  return newPreset.value.name && newPreset.value.id && /^[a-z0-9-]+$/.test(newPreset.value.id);
});

// Computed properties for styling values with proper units
const borderRadiusValue = computed({
  get: () => parseInt(editingPreset.value.borderRadius) || 0,
  set: (val) => {
    editingPreset.value.borderRadius = `${val}px`;
  }
});

const shadowIntensityValue = computed({
  get: () => {
    const opacity = editingPreset.value.shadowColor 
      ? parseFloat(editingPreset.value.shadowColor.match(/[\d.]+(?=\))/)?.[0] || 0.2) * 100
      : 20;
    return Math.round(opacity);
  },
  set: (val) => {
    const intensity = val / 100;
    editingPreset.value.shadowColor = `rgba(0, 0, 0, ${intensity})`;
    
    // Update shadow values based on intensity
    editingPreset.value.shadowSmall = `0 2px ${val / 5}px rgba(0, 0, 0, ${intensity})`;
    editingPreset.value.shadowMedium = `0 4px ${val / 5}px rgba(0, 0, 0, ${intensity})`;
    editingPreset.value.shadowLarge = `0 8px ${val / 5}px rgba(0, 0, 0, ${intensity})`;
  }
});

const transitionSpeedValue = computed({
  get: () => {
    const speed = parseFloat(editingPreset.value.transitionSpeed || '0.3s') * 10;
    return Math.round(speed);
  },
  set: (val) => {
    editingPreset.value.transitionSpeed = `${val / 10}s`;
  }
});

// Fetch presets on component mount
onMounted(async () => {
  await fetchPresets();
});

// Fetch theme presets from the API
async function fetchPresets() {
  try {
    const response = await fetch('/api/themes?isPreset=true');
    if (response.ok) {
      presets.value = await response.json();
    } else {
      showError('Failed to load theme presets');
    }
  } catch (error) {
    console.error('Error fetching presets:', error);
    showError('Failed to load theme presets');
  }
}

// Select a preset to see details
function selectPreset(preset) {
  // Highlight selected preset
  presets.value.forEach(p => (p.selected = p.id === preset.id));
}

// Apply a preset theme
function applyPreset(preset) {
  try {
    // Get the theme data from the preset
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
      transitionSpeed: preset.transitionSpeed,
    };

    // Apply the theme
    themeStore.saveTheme(themeStore.currentTheme, themeData);

    // Notify parent component
    emit('preset-applied', preset);

    showSuccess(`Applied "${preset.name}" theme preset`);
  } catch (error) {
    console.error('Error applying preset:', error);
    showError('Failed to apply theme preset');
  }
}

// Show the save preset form
function showSavePresetForm() {
  // Generate a default ID based on current timestamp
  const timestamp = new Date().getTime();
  const currentTheme = themeStore.currentTheme;

  newPreset.value = {
    id: `${currentTheme}-${timestamp}`,
    name: `${currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)} Custom`,
    description: `Custom theme based on ${currentTheme}`,
  };

  showSaveForm.value = true;
}

// Cancel saving a preset
function cancelSavePreset() {
  showSaveForm.value = false;
  newPreset.value = { id: '', name: '', description: '' };
}

// Save a new preset
async function saveNewPreset() {
  if (!isValidPreset.value) return;

  try {
    // Get current theme colors
    const currentTheme = themeStore.themes[themeStore.currentTheme];

    // Create preset data
    const presetData = {
      id: newPreset.value.id,
      name: newPreset.value.name,
      description: newPreset.value.description,
      isPreset: true,

      // Include all theme properties
      primaryColor: currentTheme.primaryColor,
      secondaryColor: currentTheme.secondaryColor,
      accentColor: currentTheme.accentColor,
      backgroundColor: currentTheme.backgroundColor,
      textColor: currentTheme.textColor,
      fontFamily: currentTheme.fontFamily,
      headingFontFamily: currentTheme.headingFontFamily,
      baseFontSize: currentTheme.baseFontSize,
      spacingUnit: currentTheme.spacingUnit,
      borderRadius: currentTheme.borderRadius,
      shadowColor: currentTheme.shadowColor,
      shadowSmall: currentTheme.shadowSmall,
      shadowMedium: currentTheme.shadowMedium,
      shadowLarge: currentTheme.shadowLarge,
      transitionSpeed: currentTheme.transitionSpeed,
    };

    // Save to API
    const response = await fetch('/api/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presetData),
    });

    if (response.ok) {
      // Add to local presets list
      const newPresetData = await response.json();
      presets.value.push(newPresetData);

      // Hide form
      showSaveForm.value = false;

      // Reset form
      newPreset.value = { id: '', name: '', description: '' };

      // Notify parent
      emit('preset-saved', newPresetData);

      showSuccess('Theme preset saved successfully');
    } else {
      const errorData = await response.json();
      showError(`Failed to save preset: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error saving preset:', error);
    showError('Failed to save theme preset');
  }
}

// Edit a preset
function editPreset(preset) {
  // Make a deep copy of the preset to avoid direct mutation
  editingPreset.value = JSON.parse(JSON.stringify(preset));
  
  // Make sure all required values have defaults
  if (!editingPreset.value.spacingUnit) editingPreset.value.spacingUnit = '1rem';
  
  // Open the edit form
  showEditForm.value = true;
}

// Cancel editing a preset
function cancelEditPreset() {
  showEditForm.value = false;
  editingPreset.value = {};
}

// Save the edited preset
async function saveEditedPreset() {
  try {
    // API call to update the preset
    const response = await fetch(`/api/themes/${editingPreset.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(editingPreset.value),
    });

    if (response.ok) {
      // Update the preset in the local list
      const updatedPreset = await response.json();
      const index = presets.value.findIndex(p => p.id === updatedPreset.id);
      
      if (index !== -1) {
        presets.value[index] = updatedPreset;
      }

      // Close the edit form
      showEditForm.value = false;
      
      // Notify parent component
      emit('preset-saved', updatedPreset);
      
      showSuccess(`Updated "${updatedPreset.name}" theme preset`);
    } else {
      const errorData = await response.json();
      showError(`Failed to update preset: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error updating preset:', error);
    showError('Failed to update theme preset');
  }
}

// Delete a preset
async function deletePreset(presetId) {
  try {
    const response = await fetch(`/api/themes/${presetId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove from local list
      presets.value = presets.value.filter(p => p.id !== presetId);

      // Notify parent
      emit('preset-deleted', presetId);

      showSuccess('Theme preset deleted');
    } else {
      const errorData = await response.json();
      showError(`Failed to delete preset: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error deleting preset:', error);
    showError('Failed to delete theme preset');
  }
}

// Show success message
function showSuccess(msg) {
  message.value = msg;
  isError.value = false;
  setTimeout(() => {
    message.value = '';
  }, 3000);
}

// Show error message
function showError(msg) {
  message.value = msg;
  isError.value = true;
  setTimeout(() => {
    message.value = '';
  }, 5000);
}
</script>

<style lang="scss" scoped>
@use "sass:color";
@use '../../assets/styles/variables' as *;

.theme-presets {
  margin-top: 2rem;
  color: #333; /* Dark color for light background in admin */

  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    color: #333; /* Dark color for light background */
  }

  .description {
    color: #666; /* Medium gray for better readability */
    opacity: 0.8;
    margin-bottom: 1.5rem;
  }
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.preset-card {
  border-radius: var(--border-radius-medium);
  overflow: hidden;
  box-shadow: var(--shadow-small);
  background-color: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }

  .preset-color-bar {
    height: 8px;
    width: 100%;
  }

  .preset-details {
    padding: 1rem;

    h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #333; /* Dark color for light background */
    }

    p {
      margin: 0;
      font-size: 0.85rem;
      color: #666; /* Medium gray for better readability */
      opacity: 0.8;
    }
  }

  .preset-actions {
    display: flex;
    padding: 0.5rem 1rem 1rem;
    gap: 0.5rem;

    button {
      border: none;
      border-radius: var(--border-radius-small);
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .apply-preset {
      background-color: var(--primary-color);
      color: #fff;
      flex: 1;

      &:hover {
        background-color: color.adjust($primary-color, $lightness: -10%);
      }
    }

    .edit-preset {
      background-color: #f9f9f9;
      color: #333; /* Dark text for light button */

      &:hover {
        background-color: #e0e0e0;
      }
    }

    .delete-preset {
      background-color: #f1f1f1;
      color: #333; /* Dark text for light button */

      &:hover {
        background-color: #e0e0e0;
      }
    }
  }

  &.preset-card-new {
    border: 2px dashed #ddd;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f9f9f9;

    .preset-new-icon {
      font-size: 2rem;
      color: #666; /* Medium gray for better visibility */
      opacity: 0.4;
      margin-top: 1rem;
    }
  }
}

.save-preset-form, .edit-preset-form {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-medium);
  padding: 1.5rem;
  margin-top: 1rem;
  color: #333; /* Dark text for light form background */

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;

    h4 {
      margin: 0;
      color: #333; /* Dark text for heading */
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin: 0;

      button {
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-small);
        border: none;
        font-weight: 500;
        cursor: pointer;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .btn-cancel {
        background-color: #f1f1f1;
        color: #333; /* Dark text for light button */

        &:hover {
          background-color: #e0e0e0;
        }
      }

      .btn-save {
        background-color: var(--primary-color);
        color: #fff;

        &:hover:not(:disabled) {
          background-color: color.adjust($primary-color, $lightness: -10%);
        }
      }
    }
  }

  .form-group {
    margin-bottom: 1rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333; /* Dark text for label */
    }

    input,
    textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: var(--border-radius-small);
      font-size: 0.9rem;
      color: #333; /* Dark text for inputs */
    }

    &.preset-id-group {
      .help-text {
        display: block;
        font-size: 0.8rem;
        color: #666; /* Medium gray for better readability */
        opacity: 0.8;
        margin-top: 0.25rem;
      }
    }
  }
}

.message {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-small);
  margin-top: 1rem;

  &.success {
    background-color: #d4edda;
    color: #155724; /* Green text for success message */
    border: 1px solid #c3e6cb;
  }

  &.error {
    background-color: #f8d7da;
    color: #721c24; /* Red text for error message */
    border: 1px solid #f5c6cb;
  }
}

@media (max-width: 768px) {
  .presets-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 576px) {
  .presets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
