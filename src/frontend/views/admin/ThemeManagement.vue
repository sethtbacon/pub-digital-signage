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
                >
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
              <div class="color-preview" :style="{ backgroundColor: themeStore.themes.morning.primaryColor }"></div>
            </div>
            <div class="time-period">
              <h3>Afternoon</h3>
              <span class="time-range">11:00 - 17:00</span>
              <div class="color-preview" :style="{ backgroundColor: themeStore.themes.afternoon.primaryColor }"></div>
            </div>
            <div class="time-period">
              <h3>Evening</h3>
              <span class="time-range">17:00 - 22:00</span>
              <div class="color-preview" :style="{ backgroundColor: themeStore.themes.evening.primaryColor }"></div>
            </div>
            <div class="time-period">
              <h3>Night</h3>
              <span class="time-range">22:00 - 5:00</span>
              <div class="color-preview" :style="{ backgroundColor: themeStore.themes.night.primaryColor }"></div>
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
              @change="changeTheme"
              :disabled="themeStore.isAutoThemeEnabled"
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
      
      <div class="settings-card">
        <div class="card-header">
          <h2>Custom Theme Colors</h2>
        </div>
        <div class="card-body">
          <div class="color-settings">
            <div class="color-setting">
              <label>Primary Color</label>
              <input 
                type="color" 
                v-model="customColors.primaryColor"
                @input="updateCustomColors"
              >
              <span class="color-value">{{ customColors.primaryColor }}</span>
            </div>
            
            <div class="color-setting">
              <label>Secondary Color</label>
              <input 
                type="color" 
                v-model="customColors.secondaryColor"
                @input="updateCustomColors"
              >
              <span class="color-value">{{ customColors.secondaryColor }}</span>
            </div>
            
            <div class="color-setting">
              <label>Accent Color</label>
              <input 
                type="color" 
                v-model="customColors.accentColor"
                @input="updateCustomColors"
              >
              <span class="color-value">{{ customColors.accentColor }}</span>
            </div>
            
            <div class="color-setting">
              <label>Background Color</label>
              <input 
                type="color" 
                v-model="customColors.backgroundColor"
                @input="updateCustomColors"
              >
              <span class="color-value">{{ customColors.backgroundColor }}</span>
            </div>
            
            <div class="color-setting">
              <label>Text Color</label>
              <input 
                type="color" 
                v-model="customColors.textColor"
                @input="updateCustomColors"
              >
              <span class="color-value">{{ customColors.textColor }}</span>
            </div>
          </div>
          
          <div class="action-buttons">
            <button 
              class="btn btn-primary" 
              @click="saveCustomTheme"
              :disabled="themeStore.isAutoThemeEnabled"
            >
              Save Custom Theme
            </button>
            <button 
              class="btn btn-secondary" 
              @click="resetTheme"
              :disabled="themeStore.isAutoThemeEnabled"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useThemeStore } from '../../store/modules/themeStore';

const themeStore = useThemeStore();

// Track the selected theme for the dropdown
const selectedTheme = ref(themeStore.currentTheme);

// Custom colors for theme editing
const customColors = ref({
  primaryColor: themeStore.currentThemeColors.primaryColor,
  secondaryColor: themeStore.currentThemeColors.secondaryColor,
  accentColor: themeStore.currentThemeColors.accentColor,
  backgroundColor: themeStore.currentThemeColors.backgroundColor,
  textColor: themeStore.currentThemeColors.textColor
});

// Preview styling based on custom colors
const themePreviewStyle = computed(() => {
  return {
    '--preview-primary-color': customColors.value.primaryColor,
    '--preview-secondary-color': customColors.value.secondaryColor,
    '--preview-accent-color': customColors.value.accentColor,
    '--preview-background-color': customColors.value.backgroundColor,
    '--preview-text-color': customColors.value.textColor
  };
});

// Change theme based on dropdown selection
const changeTheme = () => {
  themeStore.setTheme(selectedTheme.value);
  // Update custom colors to reflect selected theme
  updateColorsFromTheme();
};

// Update the custom colors when theme changes
const updateColorsFromTheme = () => {
  const theme = themeStore.currentThemeColors;
  customColors.value = {
    primaryColor: theme.primaryColor,
    secondaryColor: theme.secondaryColor,
    accentColor: theme.accentColor,
    backgroundColor: theme.backgroundColor,
    textColor: theme.textColor
  };
};

// Apply custom theme colors to preview
const updateCustomColors = () => {
  // This just updates the preview - doesn't save the theme yet
};

// Save custom theme
const saveCustomTheme = () => {
  // In a real app, this would probably update a database
  // For now, we'll just modify the current theme in the store
  const currentTheme = themeStore.currentTheme;
  
  themeStore.themes[currentTheme] = { ...customColors.value };
  themeStore.applyTheme();
};

// Reset theme to default values
const resetTheme = () => {
  selectedTheme.value = 'default';
  themeStore.setTheme('default');
  updateColorsFromTheme();
};

// Watch for changes in the theme store
watch(
  () => themeStore.currentTheme,
  () => {
    selectedTheme.value = themeStore.currentTheme;
    updateColorsFromTheme();
  }
);

onMounted(() => {
  // Ensure we have the latest theme selected
  selectedTheme.value = themeStore.currentTheme;
  updateColorsFromTheme();
});
</script>

<style lang="scss" scoped>
.theme-management {
  width: 100%;
}

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
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  
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
}

.form-group {
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  select {
    width: 100%;
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: white;
    color: #333;
    font-size: 1rem;
    
    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
  
  .setting-description {
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }
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
        background-color: #ff6b01;
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
      transition: .4s;
      border-radius: 34px;
      
      &:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
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
  border-radius: 6px;
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
    border-radius: 4px;
  }
}

.theme-preview {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1.5rem;
  border: 1px solid #ddd;
  background-color: var(--preview-background-color);
  color: var(--preview-text-color);
  
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
    border-radius: 6px;
    padding: 1rem;
    
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
      border-radius: 4px;
      font-size: 0.9rem;
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
  
  input[type="color"] {
    width: 100%;
    height: 40px;
    border: 1px solid #ddd;
    border-radius: 4px;
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
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
  
  .btn-primary {
    background-color: #ff6b01;
    color: white;
    
    &:hover:not(:disabled) {
      background-color: darken(#ff6b01, 10%);
    }
  }
  
  .btn-secondary {
    background-color: #eee;
    color: #333;
    
    &:hover:not(:disabled) {
      background-color: darken(#eee, 10%);
    }
  }
}
</style>