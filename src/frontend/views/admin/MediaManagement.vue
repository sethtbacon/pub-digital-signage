<script setup>
import { ref, computed, onMounted } from 'vue';
import { mediaApi } from '../../services/api/mediaApi';
import '../../assets/styles/admin';

// Media state
const media = ref([]);
const filteredMedia = ref([]);
const loading = ref(true);
const error = ref(null);

// Filter state
const searchQuery = ref('');
const typeFilter = ref('');

// Modal states
const showAddMediaModal = ref(false);
const showEditMediaModal = ref(false);
const showDeleteMediaModal = ref(false);

// Current media item for editing or deletion
const currentMedia = ref({
  title: '',
  description: '',
  type: '',
  url: '',
  featured: false,
  slideshow: false,
  tags: [],
});
const mediaToDelete = ref(null);

// File upload state
const uploadedFile = ref(null);
const uploadProgress = ref(0);
const uploadError = ref('');

// Fetch all media on component mount
onMounted(async () => {
  await fetchAllMedia();
});

// Fetch media
const fetchAllMedia = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await mediaApi.getAllMedia();
    media.value = response.data || [];
    filteredMedia.value = [...media.value];
  } catch (err) {
    console.error('Error fetching media:', err);
    error.value = 'Failed to load media items';
  } finally {
    loading.value = false;
  }
};

// Filter media based on search query and type filter
const filterMedia = () => {
  if (!media.value.length) return;

  let results = [...media.value];

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    results = results.filter(
      item =>
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  // Apply type filter
  if (typeFilter.value) {
    results = results.filter(item => item.type === typeFilter.value);
  }

  filteredMedia.value = results;
};

// Format date for display
const formatDate = dateString => {
  if (!dateString) return 'Unknown';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Handle file selection for upload
const handleFileSelect = event => {
  const file = event.target.files[0];
  if (!file) return;

  uploadedFile.value = file;

  // Determine media type from file
  const fileType = file.type.split('/')[0];
  currentMedia.value.type = fileType === 'image' ? 'image' : fileType === 'video' ? 'video' : '';

  // Create preview URL
  currentMedia.value.url = URL.createObjectURL(file);

  // Reset upload state
  uploadProgress.value = 0;
  uploadError.value = '';
};

// Edit media
const editMedia = item => {
  currentMedia.value = { ...item };
  showEditMediaModal.value = true;
};

// Confirm delete media
const confirmDeleteMedia = item => {
  mediaToDelete.value = item;
  showDeleteMediaModal.value = true;
};

// Delete media
const deleteMedia = async () => {
  if (!mediaToDelete.value) return;

  try {
    await mediaApi.deleteMedia(mediaToDelete.value.id);

    // Remove from local array
    media.value = media.value.filter(item => item.id !== mediaToDelete.value.id);

    // Update filtered list
    filterMedia();

    // Reset state
    showDeleteMediaModal.value = false;
    mediaToDelete.value = null;
  } catch (err) {
    console.error('Error deleting media:', err);
    error.value = 'Failed to delete media';
  }
};

// Save media (create or update)
const saveMedia = async () => {
  try {
    if (showEditMediaModal.value) {
      // Update existing media
      const response = await mediaApi.updateMedia(currentMedia.value.id, currentMedia.value);

      // Update in local array
      const index = media.value.findIndex(item => item.id === currentMedia.value.id);
      if (index !== -1) {
        media.value[index] = response.data;
      }
    } else {
      // Upload new media
      const formData = new FormData();
      formData.append('file', uploadedFile.value);
      formData.append('title', currentMedia.value.title);
      formData.append('description', currentMedia.value.description);
      formData.append('featured', currentMedia.value.featured);
      formData.append('slideshow', currentMedia.value.slideshow);

      if (currentMedia.value.tags && currentMedia.value.tags.length) {
        formData.append('tags', JSON.stringify(currentMedia.value.tags));
      }

      const response = await mediaApi.uploadMedia(formData);

      // Add to local array
      media.value.unshift(response.data);
    }

    // Update filtered list
    filterMedia();

    // Reset state and close modal
    closeMediaModal();
  } catch (err) {
    console.error('Error saving media:', err);
    uploadError.value = 'Failed to save media';
  }
};

// Close media modal and reset form
const closeMediaModal = () => {
  showAddMediaModal.value = false;
  showEditMediaModal.value = false;
  currentMedia.value = {
    title: '',
    description: '',
    type: '',
    url: '',
    featured: false,
    slideshow: false,
    tags: [],
  };
  uploadedFile.value = null;
  uploadProgress.value = 0;
  uploadError.value = '';
};

// Add tag to media
const addTag = tag => {
  if (!tag || !tag.trim()) return;

  if (!currentMedia.value.tags) {
    currentMedia.value.tags = [];
  }

  // Avoid duplicates
  if (!currentMedia.value.tags.includes(tag.trim())) {
    currentMedia.value.tags.push(tag.trim());
  }
};

// Remove tag from media
const removeTag = index => {
  if (currentMedia.value.tags && index >= 0 && index < currentMedia.value.tags.length) {
    currentMedia.value.tags.splice(index, 1);
  }
};
</script>

<template>
  <div class="media-management">
    <h1 class="page-title">Media Management</h1>

    <div class="action-bar">
      <button class="primary-button" @click="showAddMediaModal = true">
        <i class="icon-add"></i> Upload Media
      </button>
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search media..."
          class="search-input"
          @input="filterMedia"
        />
      </div>
      <div class="filter-container">
        <select v-model="typeFilter" class="filter-select" @change="filterMedia">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
        </select>
      </div>
    </div>

    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading media...</p>
      </div>

      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>

      <div v-else-if="filteredMedia.length === 0" class="empty-state">
        <p v-if="searchQuery || typeFilter">No media matches your filters.</p>
        <p v-else>No media found. Upload your first media!</p>
      </div>

      <div v-else class="media-grid">
        <div v-for="media in filteredMedia" :key="media.id" class="media-card">
          <div class="media-image-container">
            <img
              v-if="media.type === 'image'"
              :src="media.url"
              :alt="media.title"
              class="media-image"
            />
            <video
              v-else-if="media.type === 'video'"
              :src="media.url"
              class="media-image"
              controls
            ></video>
            <div class="media-actions">
              <button class="edit-button" @click="editMedia(media)">
                <i class="icon-edit"></i>
              </button>
              <button class="delete-button" @click="confirmDeleteMedia(media)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="media-details">
            <h3 class="media-title">{{ media.title }}</h3>
            <div class="media-meta">
              <span class="media-type">{{ media.type }}</span>
              <span class="media-date">{{ formatDate(media.uploadDate) }}</span>
            </div>
            <p v-if="media.description" class="media-description">{{ media.description }}</p>
            <div v-if="media.tags && media.tags.length" class="media-tags">
              <span v-for="(tag, index) in media.tags" :key="index" class="media-tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Media Modal -->
    <div v-if="showAddMediaModal || showEditMediaModal" class="modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditMediaModal ? 'Edit Media' : 'Upload Media' }}</h2>
          <button class="modal-close" @click="closeMediaModal">×</button>
        </div>

        <form class="media-form" @submit.prevent="saveMedia">
          <!-- File Upload (only for new media) -->
          <div v-if="!showEditMediaModal" class="form-group">
            <label for="mediaFile">Select File</label>
            <input
              id="mediaFile"
              type="file"
              accept="image/*, video/*"
              class="form-control"
              required
              @change="handleFileSelect"
            />

            <div v-if="currentMedia.url" class="media-preview">
              <img
                v-if="currentMedia.type === 'image'"
                :src="currentMedia.url"
                alt="Preview"
                class="preview-image"
              />
              <video
                v-else-if="currentMedia.type === 'video'"
                :src="currentMedia.url"
                controls
                class="preview-image"
              ></video>
            </div>

            <div v-if="uploadProgress > 0" class="upload-progress">
              <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
              <span>{{ uploadProgress }}%</span>
            </div>
          </div>

          <!-- Media Details -->
          <div class="form-group">
            <label for="mediaTitle">Title</label>
            <input
              id="mediaTitle"
              v-model="currentMedia.title"
              type="text"
              required
              class="form-control"
              placeholder="Enter a title for this media"
            />
          </div>

          <div class="form-group">
            <label for="mediaDescription">Description</label>
            <textarea
              id="mediaDescription"
              v-model="currentMedia.description"
              rows="3"
              class="form-control"
              placeholder="Describe this media (optional)"
            ></textarea>
          </div>

          <!-- Tags -->
          <div class="form-group">
            <label>Tags</label>
            <div class="tag-input-container">
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                class="form-control tag-input"
                @keydown.enter.prevent="
                  addTag($event.target.value);
                  $event.target.value = '';
                "
              />
            </div>
            <div v-if="currentMedia.tags && currentMedia.tags.length" class="tags-container">
              <span v-for="(tag, index) in currentMedia.tags" :key="index" class="media-tag">
                {{ tag }}
                <button type="button" class="remove-tag" @click="removeTag(index)">×</button>
              </span>
            </div>
          </div>

          <!-- Display Options -->
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="currentMedia.featured" type="checkbox" />
              Featured in galleries
            </label>
          </div>

          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input v-model="currentMedia.slideshow" type="checkbox" />
              Include in slideshow
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="uploadError" class="error-message">
            {{ uploadError }}
          </div>

          <!-- Form Actions -->
          <div class="form-actions">
            <button type="button" class="secondary-button" @click="closeMediaModal">Cancel</button>
            <button type="submit" class="primary-button">
              {{ showEditMediaModal ? 'Save Changes' : 'Upload Media' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteMediaModal" class="modal">
      <div class="modal-content confirmation-modal">
        <div class="modal-header">
          <h2>Confirm Delete</h2>
          <button class="modal-close" @click="showDeleteMediaModal = false">×</button>
        </div>
        <p>Are you sure you want to delete "{{ mediaToDelete?.title }}"? This cannot be undone.</p>
        <div class="form-actions">
          <button class="secondary-button" @click="showDeleteMediaModal = false">Cancel</button>
          <button class="danger-button" @click="deleteMedia">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.media-management {
  @extend .admin-page;
}

.page-title {
  @extend .page-title;
}

.action-bar {
  @extend .action-bar;
}

.primary-button {
  @extend .primary-button;
}

.search-input {
  @extend .search-input;
}

.filter-select {
  @extend .filter-select;
}

.content-container {
  @extend .content-container;
}

.loading-container {
  @extend .loading-container;
}

.loading-spinner {
  @extend .loading-spinner;
}

.empty-state {
  @extend .empty-state;
}

.media-grid {
  @extend .grid-layout;
}

.media-card {
  @extend .card-item;
}

.media-image-container {
  @extend .card-image-container;
  height: 180px;
}

.media-image {
  @extend .card-image;
}

.media-actions {
  @extend .card-actions;
}

.media-details {
  @extend .card-details;
}

.media-title {
  @extend .card-title;
}

.media-description {
  @extend .card-description;
}

.edit-button {
  @extend .edit-button;
}

.delete-button {
  @extend .delete-button;
}

.error-state {
  color: var(--accent-color);
  text-align: center;
  padding: 20px;
  font-weight: 500;
}

// Media-specific styles not covered by global styles
.media-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.media-type {
  text-transform: capitalize;
  padding: 2px 8px;
  background-color: #f5f5f5;
  border-radius: 12px;
  font-size: 12px;
}

.media-date {
  font-size: 12px;
}

video.media-image {
  background-color: #000;
}

.media-form {
  @extend .admin-form;
}

.media-preview {
  margin-top: 10px;
  text-align: center;
}

.preview-image {
  max-height: 200px;
  max-width: 100%;
  object-fit: contain;
}

.upload-progress {
  margin-top: 10px;
  background-color: #f0f0f0;
  height: 20px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;

  .progress-bar {
    height: 100%;
    background-color: var(--primary-color);
    transition: width 0.3s ease;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    color: #333;
  }
}

.media-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
}

.media-tag {
  background-color: #f0f0f0;
  color: #666;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  display: flex;
  align-items: center;

  .remove-tag {
    background: none;
    border: none;
    color: #999;
    font-size: 14px;
    cursor: pointer;
    margin-left: 5px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--accent-color);
    }
  }
}

.tag-input-container {
  margin-bottom: 10px;
}

.error-message {
  color: var(--accent-color);
  margin: 10px 0;
  padding: 10px;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
  }
}
</style>
