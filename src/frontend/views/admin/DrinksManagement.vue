<template>
  <div class="drinks-management">
    <h1 class="page-title">Drinks Management</h1>

    <div class="action-bar">
      <button class="primary-button" @click="showAddDrinkModal = true">
        <i class="icon-add"></i> Add New Drink
      </button>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search drinks..."
          class="search-input"
          @input="filterDrinks"
        />
      </div>
      <div class="filter-container">
        <select v-model="categoryFilter" class="filter-select" @change="filterDrinks">
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
        <p v-if="searchQuery || categoryFilter">No drinks match your filters.</p>
        <p v-else>No drinks found. Add your first drink!</p>
      </div>

      <div v-else class="drinks-grid">
        <div
          v-for="drink in filteredDrinks"
          :key="drink.id"
          class="drink-card"
          :class="{ 'is-featured': drink.featured }"
        >
          <div class="drink-image-container">
            <img
              :src="drink.imageUrl || '/img/default-drink.jpg'"
              :alt="drink.name"
              class="drink-image"
            />
            <div class="drink-actions">
              <button class="edit-button" @click="editDrink(drink)">
                <i class="icon-edit"></i>
              </button>
              <button class="delete-button" @click="confirmDeleteDrink(drink)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="drink-details">
            <h3 class="drink-name">{{ drink.name }}</h3>
            <div class="drink-status">
              <div class="drink-category">{{ drink.category }}</div>
              <div v-if="drink.featured" class="drink-badge featured">
                <span class="dot"></span>
                <span class="label">Featured</span>
              </div>
              <div v-if="drink.new" class="drink-badge new">
                <span class="dot"></span>
                <span class="label">New</span>
              </div>
              <div v-if="drink.special" class="drink-badge special">
                <span class="dot"></span>
                <span class="label">Special</span>
              </div>
            </div>
            <p class="drink-description">{{ drink.description }}</p>
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
          <div class="form-group">
            <label for="drinkName">Name</label>
            <input
              id="drinkName"
              v-model="currentDrink.name"
              type="text"
              required
              class="form-control"
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
              <option value="">Select a category</option>
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
            ></textarea>
          </div>

          <div class="form-group">
            <label for="drinkImage">Image</label>
            <div class="image-upload-container">
              <div v-if="currentDrink.imageUrl" class="current-image">
                <img :src="currentDrink.imageUrl" alt="Drink image" class="preview-image" />
              </div>
              <input
                id="drinkImage"
                type="file"
                accept="image/*"
                class="form-control"
                @change="handleImageUpload"
              />
            </div>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="currentDrink.featured" type="checkbox" />
              Feature this drink
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="currentDrink.new" type="checkbox" />
              Mark as New
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="currentDrink.special" type="checkbox" />
              Mark as Special
            </label>
          </div>

          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeModals">Cancel</button>
            <button type="submit" class="primary-button">Save</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteModal = false">×</button>
        </div>
        <p>Are you sure you want to delete "{{ drinkToDelete?.name }}"?</p>
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
      drink.description.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = !categoryFilter.value || drink.category === categoryFilter.value;

    return matchesSearch && matchesCategory;
  });
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
        featured: currentDrink.value.featured
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
  @extend .admin-page !optional;
}

.drinks-grid {
  @extend .grid-layout !optional;
}

.drink-card {
  @extend .card-item !optional;

  &.is-featured {
    border: 2px solid var(--primary-color);
  }
}

.drink-image-container {
  @extend .card-image-container !optional;
}

.drink-image {
  @extend .card-image !optional;
}

.drink-actions {
  @extend .card-actions !optional;
}

.drink-details {
  @extend .card-details !optional;
}

.drink-name {
  @extend .card-title !optional;
}

.drink-description {
  @extend .card-description !optional;
}

.drink-form {
  @extend .admin-form !optional;
}

.drink-status {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.drink-badge {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  
  .dot {
    height: 8px;
    width: 8px;
    border-radius: 50%;
    margin-right: 4px;
    background-color: white;
  }
  
  &.featured {
    background-color: var(--primary-color);
    color: white;
  }
  
  &.new {
    background-color: var(--accent-color);
    color: white;
  }
  
  &.special {
    background-color: var(--secondary-color);
    color: white;
  }
}

// Drink-specific styles not covered by global styles
.drink-category {
  display: inline-block;
  padding: 4px 8px;
  background-color: #f1f1f1;
  border-radius: 12px;
  font-size: 12px;
  text-transform: capitalize;
}
</style>
