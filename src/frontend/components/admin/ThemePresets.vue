<template>
  <div class="theme-presets">
    <h3>Theme Presets</h3>
    <p class="description">Save your custom themes as presets for quick access, or use one of our pre-defined presets.</p>
    
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
            background: `linear-gradient(to right, ${preset.primaryColor}, ${preset.secondaryColor}, ${preset.accentColor})` 
          }"
        ></div>
        <div class="preset-details">
          <h4>{{ preset.name }}</h4>
          <p>{{ preset.description || 'Custom theme preset' }}</p>
        </div>
        <div class="preset-actions">
          <button 
            class="apply-preset"
            @click.stop="applyPreset(preset)"
          >
            Apply
          </button>
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
      <h4>Save Theme as Preset</h4>
      
      <div class="form-group">
        <label for="preset-name">Preset Name</label>
        <input
          type="text"
          id="preset-name"
          v-model="newPreset.name"
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
        <input
          type="text"
          id="preset-id"
          v-model="newPreset.id"
          placeholder="my-custom-theme"
        />
        <span class="help-text">Used as an identifier, no spaces or special characters</span>
      </div>
      
      <div class="form-actions">
        <button class="btn-cancel" @click="cancelSavePreset">Cancel</button>
        <button class="btn-save" @click="saveNewPreset" :disabled="!isValidPreset">Save</button>
      </div>
    </div>
    
    <div v-if="message" class="message" :class="{ 'success': !isError, 'error': isError }">
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
const message = ref('');
const isError = ref(false);

const newPreset = ref({
  id: '',
  name: '',
  description: ''
});

const isValidPreset = computed(() => {
  return newPreset.value.name && newPreset.value.id && /^[a-z0-9-]+$/.test(newPreset.value.id);
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
  presets.value.forEach(p => p.selected = p.id === preset.id);
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
      transitionSpeed: preset.transitionSpeed
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
    description: `Custom theme based on ${currentTheme}`
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
      transitionSpeed: currentTheme.transitionSpeed
    };
    
    // Save to API
    const response = await fetch('/api/themes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(presetData)
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

// Delete a preset
async function deletePreset(presetId) {
  try {
    const response = await fetch(`/api/themes/${presetId}`, {
      method: 'DELETE'
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
.theme-presets {
  margin-top: 2rem;
  
  h3 {
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
  
  .description {
    color: #666;
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
  transition: transform 0.2s, box-shadow 0.2s;
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
    }
    
    p {
      margin: 0;
      font-size: 0.85rem;
      color: #666;
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
        background-color: darken($primary-color, 10%);
      }
    }
    
    .delete-preset {
      background-color: #f1f1f1;
      color: #666;
      
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
      color: #ccc;
      margin-top: 1rem;
    }
  }
}

.save-preset-form {
  background-color: #f9f9f9;
  border-radius: var(--border-radius-medium);
  padding: 1.5rem;
  margin-top: 1rem;
  
  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: var(--border-radius-small);
      font-size: 0.9rem;
    }
    
    &.preset-id-group {
      .help-text {
        display: block;
        font-size: 0.8rem;
        color: #666;
        margin-top: 0.25rem;
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
    
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
      color: #333;
      
      &:hover {
        background-color: #e0e0e0;
      }
    }
    
    .btn-save {
      background-color: var(--primary-color);
      color: #fff;
      
      &:hover:not(:disabled) {
        background-color: darken($primary-color, 10%);
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
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.error {
    background-color: #f8d7da;
    color: #721c24;
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