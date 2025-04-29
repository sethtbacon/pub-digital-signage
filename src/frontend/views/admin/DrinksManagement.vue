<template>
  <div class="drinks-management">
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Drinks Management</h1>
        <p class="page-description">Manage your pub's drink offerings and featured items</p>
      </div>
      <button class="primary-button add-button" @click="showAddDrinkModal = true">
        <i class="icon-add"></i> Add New Drink
      </button>
    </div>

    <div class="filter-controls">
      <div class="search-container">
        <i class="search-icon">🔍</i>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search drinks by name or description..."
          class="search-input"
          @input="filterDrinks"
        />
      </div>
      <div class="filter-container">
        <label for="categoryFilter">Filter by:</label>
        <select id="categoryFilter" v-model="categoryFilter" class="filter-select" @change="filterDrinks">
          <option value="">All Categories</option>
          <option value="beer">Beer</option>
          <option value="wine">Wine</option>
          <option value="cocktail">Cocktail</option>
          <option value="spirit">Spirit</option>
          <option value="nonalcoholic">Non-Alcoholic</option>
        </select>
      </div>
    </div>

    <!-- Drinks List -->
    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading drinks...</p>
      </div>

      <div v-else-if="filteredDrinks.length === 0" class="empty-state">
        <div class="empty-icon">🍹</div>
        <p v-if="searchQuery || categoryFilter">No drinks match your filters.</p>
        <p v-else>No drinks found. Add your first drink!</p>
        <button v-if="searchQuery || categoryFilter" class="secondary-button" @click="clearFilters">
          Clear filters
        </button>
        <button v-else class="primary-button" @click="showAddDrinkModal = true">
          Add First Drink
        </button>
      </div>

      <div v-else class="drinks-grid">
        <div
          v-for="drink in filteredDrinks"
          :key="drink.id"
          class="drink-card"
          :class="{ 'is-featured': drink.featured }"
        >
          <div class="drink-badge-container" v-if="drink.featured || drink.new || drink.special">
            <div v-if="drink.featured" class="drink-ribbon featured">Featured</div>
            <div v-else-if="drink.new" class="drink-ribbon new">New</div>
            <div v-else-if="drink.special" class="drink-ribbon special">Special</div>
          </div>
          
          <div class="drink-image-container">
            <img
              :src="drink.imageUrl || '/img/default-drink.jpg'"
              :alt="drink.name"
              class="drink-image"
            />
            <div class="drink-actions">
              <button class="edit-button" @click="editDrink(drink)" title="Edit drink">
                <i class="icon-edit">✎</i>
              </button>
              <button class="delete-button" @click="confirmDeleteDrink(drink)" title="Delete drink">
                <i class="icon-delete">×</i>
              </button>
            </div>
          </div>
          
          <div class="drink-details">
            <div class="drink-category-tag">{{ drink.category }}</div>
            <h3 class="drink-name">{{ drink.name }}</h3>
            
            <div class="drink-badges">
              <div v-if="drink.featured" class="badge featured">
                <span class="dot"></span>
                <span class="label">Featured</span>
              </div>
              <div v-if="drink.new" class="badge new">
                <span class="dot"></span>
                <span class="label">New</span>
              </div>
              <div v-if="drink.special" class="badge special">
                <span class="dot"></span>
                <span class="label">Special</span>
              </div>
            </div>
            
            <p class="drink-description">{{ drink.description || "No description available" }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Drink Modal -->
    <div v-if="showAddDrinkModal || showEditDrinkModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditDrinkModal ? 'Edit Drink' : 'Add New Drink' }}</h2>
          <button class="modal-close" @click="closeModals">×</button>
        </div>

        <form class="drink-form" @submit.prevent="saveDrink">
          <div class="form-layout">
            <div class="form-column">
              <div class="form-group">
                <label for="drinkName">Name</label>
                <input
                  id="drinkName"
                  v-model="currentDrink.name"
                  type="text"
                  required
                  class="form-control"
                  placeholder="Enter drink name"
                />
              </div>

              <div class="form-group">
                <label for="drinkCategory">Category</label>
                <select
                  id="drinkCategory"
                  v-model="currentDrink.category"
                  required
                  class="form-control"
                >
                  <option value="" disabled>Select a category</option>
                  <option value="beer">Beer</option>
                  <option value="wine">Wine</option>
                  <option value="cocktail">Cocktail</option>
                  <option value="spirit">Spirit</option>
                  <option value="nonalcoholic">Non-Alcoholic</option>
                </select>
              </div>

              <div class="form-group">
                <label for="drinkDescription">Description</label>
                <textarea
                  id="drinkDescription"
                  v-model="currentDrink.description"
                  rows="3"
                  class="form-control"
                  placeholder="Enter a brief description"
                ></textarea>
              </div>
              
              <div class="form-options">
                <div class="checkbox-option">
                  <label class="checkbox-label">
                    <input v-model="currentDrink.featured" type="checkbox" />
                    <span class="checkbox-text">Featured drink</span>
                  </label>
                </div>
                
                <div class="checkbox-option">
                  <label class="checkbox-label">
                    <input v-model="currentDrink.new" type="checkbox" />
                    <span class="checkbox-text">Mark as New</span>
                  </label>
                </div>
                
                <div class="checkbox-option">
                  <label class="checkbox-label">
                    <input v-model="currentDrink.special" type="checkbox" />
                    <span class="checkbox-text">Mark as Special</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div class="form-column">
              <div class="form-group image-group">
                <label for="drinkImage">Image</label>
                <div class="image-upload-container">
                  <div v-if="currentDrink.imageUrl" class="current-image">
                    <img :src="currentDrink.imageUrl" alt="Drink image" class="preview-image" />
                  </div>
                  <div v-else class="image-placeholder">
                    <span>No image selected</span>
                  </div>
                  <div class="file-upload-wrapper">
                    <input
                      id="drinkImage"
                      type="file"
                      accept="image/*"
                      class="form-control file-input"
                      @change="handleImageUpload"
                    />
                    <label for="drinkImage" class="file-upload-button">
                      {{ currentDrink.imageUrl ? 'Change image' : 'Select image' }}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeModals">Cancel</button>
            <button type="submit" class="primary-button">
              {{ showEditDrinkModal ? 'Save Changes' : 'Add Drink' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Delete Drink</h2>
          <button class="modal-close" @click="showDeleteModal = false">×</button>
        </div>
        <p class="confirmation-message">
          Are you sure you want to delete "<strong>{{ drinkToDelete?.name }}</strong>"?
          <span class="warning-text">This action cannot be undone.</span>
        </p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteModal = false">Cancel</button>
          <button class="danger-button" @click="deleteDrink">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { drinksApi } from '../../services/api/drinksApi';
import '../../assets/styles/admin';

const loading = ref(true);
const drinks = ref([]);
const filteredDrinks = ref([]);
const searchQuery = ref('');
const categoryFilter = ref('');

// Modal controls
const showAddDrinkModal = ref(false);
const showEditDrinkModal = ref(false);
const showDeleteModal = ref(false);

// Current drink being edited or deleted
const currentDrink = ref({
  name: '',
  category: '',
  description: '',
  imageUrl: '',
  featured: false,
  new: false,
  special: false,
});
const drinkToDelete = ref(null);

// Fetch all drinks on component mount
onMounted(async () => {
  try {
    const drinks_data = await drinksApi.getAllDrinks();
    // Map database field names to component properties
    drinks.value = drinks_data.map(drink => ({
      id: drink.drink_id,
      name: drink.name,
      category: drink.category,
      description: drink.description,
      imageUrl: drink.image_path,
      featured: drink.is_featured === 1,
      new: drink.is_new === 1,
      special: drink.is_special === 1
    }));
    filteredDrinks.value = [...drinks.value];
  } catch (error) {
    console.error('Failed to fetch drinks', error);
    // Could add error handling/notification here
  } finally {
    loading.value = false;
  }
});

// Filter drinks based on search query and category
const filterDrinks = () => {
  filteredDrinks.value = drinks.value.filter(drink => {
    const matchesSearch =
      drink.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      drink.description?.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = !categoryFilter.value || drink.category === categoryFilter.value;

    return matchesSearch && matchesCategory;
  });
};

// Clear all filters
const clearFilters = () => {
  searchQuery.value = '';
  categoryFilter.value = '';
  filterDrinks();
};

// Open edit modal with drink data
const editDrink = drink => {
  currentDrink.value = { ...drink };
  showEditDrinkModal.value = true;
};

// Open delete confirmation modal
const confirmDeleteDrink = drink => {
  drinkToDelete.value = drink;
  showDeleteModal.value = true;
};

// Save new or edited drink
const saveDrink = async () => {
  try {
    // Map component properties to database field names
    const drinkData = {
      name: currentDrink.value.name,
      category: currentDrink.value.category,
      description: currentDrink.value.description,
      is_featured: currentDrink.value.featured ? 1 : 0,
      is_new: currentDrink.value.new ? 1 : 0,
      is_special: currentDrink.value.special ? 1 : 0,
      image_path: currentDrink.value.imageUrl
    };

    if (showEditDrinkModal.value) {
      // Update existing drink
      await drinksApi.updateDrink(currentDrink.value.id, drinkData);

      // Update local list
      const index = drinks.value.findIndex(d => d.id === currentDrink.value.id);
      if (index !== -1) {
        drinks.value[index] = { ...currentDrink.value };
      }
    } else {
      // Add new drink
      const result = await drinksApi.createDrink(drinkData);
      
      // Create a new drink object with proper frontend property names
      const newDrink = {
        id: result.drinkId,
        name: currentDrink.value.name,
        category: currentDrink.value.category,
        description: currentDrink.value.description,
        imageUrl: currentDrink.value.imageUrl,
        featured: currentDrink.value.featured,
        new: currentDrink.value.new,
        special: currentDrink.value.special
      };
      
      drinks.value.push(newDrink);
    }

    // Re-apply filters
    filterDrinks();
    closeModals();
  } catch (error) {
    console.error('Failed to save drink', error);
    // Could add error notification here
  }
};

// Delete a drink
const deleteDrink = async () => {
  if (!drinkToDelete.value) return;

  try {
    await drinksApi.deleteDrink(drinkToDelete.value.id);

    // Remove from local list
    drinks.value = drinks.value.filter(d => d.id !== drinkToDelete.value.id);
    filterDrinks();

    showDeleteModal.value = false;
    drinkToDelete.value = null;
  } catch (error) {
    console.error('Failed to delete drink', error);
    // Could add error notification here
  }
};

// Handle image upload
const handleImageUpload = event => {
  const file = event.target.files[0];
  if (!file) return;

  // Here you would typically handle the file upload to your server
  // For now, we'll simulate by creating a temporary URL
  const tempUrl = URL.createObjectURL(file);
  currentDrink.value.imageUrl = tempUrl;

  // In a real application, you would upload the file to your server:
  // const formData = new FormData();
  // formData.append('image', file);
  // mediaApi.uploadImage(formData).then(response => {
  //   currentDrink.value.imageUrl = response.data.url;
  // });
};

// Close all modals and reset form
const closeModals = () => {
  showAddDrinkModal.value = false;
  showEditDrinkModal.value = false;
  currentDrink.value = {
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    featured: false,
    new: false,
    special: false,
  };
};
</script>

<style lang="scss" scoped>
.drinks-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  .header-content {
    .page-title {
      font-size: 28px;
      font-weight: 600;
      margin: 0;
      color: #333;
    }
    
    .page-description {
      margin: 5px 0 0;
      color: #666;
      font-size: 16px;
    }
  }
  
  .add-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    font-weight: 500;
    
    i {
      font-size: 18px;
    }
  }
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  
  .search-container {
    flex: 1;
    position: relative;
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #777;
    }
    
    .search-input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.2s ease;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
      }
    }
  }
  
  .filter-container {
    display: flex;
    align-items: center;
    gap: 10px;
    
    label {
      color: #555;
      font-weight: 500;
    }
    
    .filter-select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      min-width: 150px;
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
      }
    }
  }
}

.content-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 24px;
  min-height: 400px;
}

.drinks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.drink-card {
  background-color: #fff;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  border: 1px solid #eee;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    
    .drink-actions {
      opacity: 1;
    }
  }
  
  &.is-featured {
    box-shadow: 0 5px 15px rgba(var(--primary-color-rgb), 0.2);
    border: 1px solid var(--primary-color);
  }
  
  .drink-badge-container {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }
  
  .drink-ribbon {
    background-color: var(--primary-color);
    color: white;
    padding: 6px 12px;
    font-size: 12px;
    font-weight: 500;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
    min-width: 80px;
    text-align: center;
    
    &.featured {
      background-color: var(--primary-color);
    }
    
    &.new {
      background-color: var(--accent-color);
    }
    
    &.special {
      background-color: var(--secondary-color);
    }
  }
}

.drink-image-container {
  position: relative;
  height: 180px;
  overflow: hidden;
  
  .drink-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background-color: #f8f8f8;
    
    &[src$=".svg"] {
      width: auto;
      max-width: 100%;
      max-height: 100%;
      padding: 10px;
      margin: 0 auto;
      display: block;
    }
  }
  
  .drink-actions {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.2s ease;
    
    button {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      color: white;
      font-size: 18px;
      
      &.edit-button {
        background-color: rgba(0, 0, 0, 0.6);
        
        &:hover {
          background-color: #3498db;
        }
      }
      
      &.delete-button {
        background-color: rgba(0, 0, 0, 0.6);
        
        &:hover {
          background-color: #e74c3c;
        }
      }
    }
  }
}

.drink-details {
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .drink-category-tag {
    display: inline-block;
    background-color: #f0f0f0;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: #555;
    text-transform: capitalize;
    margin-bottom: 8px;
  }
  
  .drink-name {
    margin: 0 0 8px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
  
  .drink-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
    
    .badge {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      
      .dot {
        height: 8px;
        width: 8px;
        border-radius: 50%;
        margin-right: 4px;
      }
      
      &.featured {
        background-color: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
        
        .dot {
          background-color: var(--primary-color);
        }
      }
      
      &.new {
        background-color: rgba(var(--accent-color-rgb), 0.1);
        color: var(--accent-color);
        
        .dot {
          background-color: var(--accent-color);
        }
      }
      
      &.special {
        background-color: rgba(var(--secondary-color-rgb), 0.1);
        color: var(--secondary-color);
        
        .dot {
          background-color: var(--secondary-color);
        }
      }
    }
  }
  
  .drink-description {
    margin: 0;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    flex-grow: 1;
  }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  
  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 16px;
    color: #777;
    margin-bottom: 20px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  
  .loading-spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid var(--primary-color);
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  
  .modal-content {
    background-color: white;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    
    &.confirmation-modal {
      max-width: 500px;
      
      .confirmation-message {
        padding: 20px;
        margin: 0;
        line-height: 1.5;
        
        .warning-text {
          display: block;
          margin-top: 8px;
          color: #e74c3c;
          font-size: 14px;
        }
      }
    }
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    
    h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }
    
    .modal-close {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
      
      &:hover {
        background-color: #f5f5f5;
        color: #333;
      }
    }
  }
}

.drink-form {
  padding: 24px;
  
  .form-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-bottom: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .form-group {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      color: #333; /* Ensuring dark text on light background */
      background-color: #fff; /* Explicitly setting white background */
      
      &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
      }
      
      &::placeholder {
        color: #aaa;
      }
    }
    
    textarea.form-control {
      resize: vertical;
      min-height: 100px;
      color: #333; /* Match the same text color as other inputs */
      background-color: #fff; /* Explicit white background */
      font-family: inherit; /* Use the same font as other inputs */
      font-size: 16px; /* Match the font size of other inputs */
    }
  }
  
  .form-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    
    .checkbox-option {
      margin-bottom: 12px;
      
      .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        
        input[type="checkbox"] {
          margin-right: 8px;
          width: 16px;
          height: 16px;
        }
        
        .checkbox-text {
          color: #555;
        }
      }
    }
  }
  
  .image-group {
    height: 100%;
    
    .image-upload-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      
      .current-image {
        background-color: #f8f8f8;
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        
        img {
          max-width: 100%;
          max-height: 200px;
          object-fit: contain;
          
          &[src$=".svg"] {
            width: auto;
            height: auto;
            max-height: 180px;
            padding: 10px;
          }
        }
      }
      
      .image-placeholder {
        background-color: #f8f8f8;
        border: 2px dashed #ddd;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        color: #aaa;
      }
      
      .file-upload-wrapper {
        position: relative;
        
        .file-input {
          opacity: 0;
          width: 0.1px;
          height: 0.1px;
          position: absolute;
        }
        
        .file-upload-button {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f8f8f8;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          color: #555;
          font-weight: 500;
          transition: background-color 0.2s;
          
          &:hover {
            background-color: #eee;
          }
        }
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid #eee;
    
    button {
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      
      &.secondary-button {
        background-color: #f5f5f5;
        color: #333;
        border: none;
        
        &:hover {
          background-color: #e8e8e8;
        }
      }
      
      &.primary-button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        
        &:hover {
          filter: brightness(0.9);
        }
      }
      
      &.danger-button {
        background-color: #e74c3c;
        color: white;
        border: none;
        
        &:hover {
          background-color: #c0392b;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    
    .add-button {
      width: 100%;
      justify-content: center;
    }
  }
  
  .filter-controls {
    flex-direction: column;
    
    .search-container, .filter-container {
      width: 100%;
    }
    
    .filter-container {
      display: grid;
      grid-template-columns: 1fr 3fr;
    }
  }
  
  .drinks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
