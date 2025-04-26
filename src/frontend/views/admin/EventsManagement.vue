<script setup>
import { ref, computed, onMounted } from 'vue';
import { eventsApi } from '../../services/api/eventsApi';
import '../../assets/styles/admin';

const events = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const categoryFilter = ref('');

const fetchEvents = async () => {
  loading.value = true;
  try {
    const response = await eventsApi.getAllEvents();
    events.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch events';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEvents();
});

const eventCount = computed(() => events.value.length);

</script>

<template>
  <div class="events-management">
    <h1 class="page-title">Events Management</h1>
    
    <div class="action-bar">
      <button class="primary-button" @click="showAddEventModal = true">
        <i class="icon-add"></i> Add New Event
      </button>
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search events..." 
          class="search-input"
        />
      </div>
      <div class="filter-container">
        <select v-model="categoryFilter" class="filter-select">
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="sports">Sports</option>
          <option value="special">Special</option>
        </select>
      </div>
    </div>
    
    <div class="content-container">
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
      <div v-else-if="error" class="error-container">{{ error }}</div>
      <div v-else-if="events.length === 0" class="empty-state">
        <p>No events found. Add your first event!</p>
      </div>
      <div v-else class="events-grid">
        <div v-for="event in events" :key="event.id" class="event-card">
          <div class="event-image-container" v-if="event.imageUrl">
            <img :src="event.imageUrl" :alt="event.name" class="event-image">
            <div class="event-actions">
              <button class="edit-button" @click="editEvent(event)">
                <i class="icon-edit"></i>
              </button>
              <button class="delete-button" @click="deleteEvent(event)">
                <i class="icon-delete"></i>
              </button>
            </div>
          </div>
          <div class="event-details">
            <h3 class="event-title">{{ event.name }}</h3>
            <div class="event-meta">
              <span class="event-date">{{ formatDate(event.date) }}</span>
              <span class="event-time">{{ event.startTime }} - {{ event.endTime }}</span>
            </div>
            <p class="event-description">{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.events-management {
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

.events-grid {
  @extend .grid-layout;
}

.event-card {
  @extend .card-item;
}

.event-image-container {
  @extend .card-image-container;
}

.event-image {
  @extend .card-image;
}

.event-actions {
  @extend .card-actions;
}

.event-details {
  @extend .card-details;
}

.event-title {
  @extend .card-title;
}

.event-description {
  @extend .card-description;
}

.edit-button {
  @extend .edit-button;
}

.delete-button {
  @extend .delete-button;
}

// Event-specific styles
.event-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
}

.event-date {
  font-weight: 500;
}

.event-time {
  color: #777;
}

.error-container {
  color: #e74c3c;
  padding: 16px;
  text-align: center;
  font-weight: 500;
}
</style>