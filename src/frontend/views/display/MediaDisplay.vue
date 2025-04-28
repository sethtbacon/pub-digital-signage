<template>
  <BaseLayout title="Media Gallery">
    <div class="media-display">
      <div v-if="mediaStore.loading" class="loading-state">
        Loading media content...
      </div>
      <div v-else-if="mediaStore.error" class="error-state">
        {{ mediaStore.error }}
      </div>
      <div v-else class="media-content">
        <!-- Media Filter Controls -->
        <div class="media-controls">
          <div class="filter-buttons">
            <button 
              v-for="type in mediaTypes" 
              :key="type"
              class="filter-button"
              :class="{ active: activeFilter === type }"
              @click="setFilter(type)"
            >
              {{ type }}
            </button>
          </div>
          
          <div class="view-toggle">
            <button 
              class="view-button"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
            >
              Grid
            </button>
            <button 
              class="view-button"
              :class="{ active: viewMode === 'slideshow' }"
              @click="viewMode = 'slideshow'"
            >
              Slideshow
            </button>
          </div>
        </div>

        <!-- Grid View Mode -->
        <div v-if="viewMode === 'grid'" class="media-grid">
          <div v-if="filteredMedia.length === 0" class="empty-state">
            No media content available.
          </div>
          <div 
            v-else
            v-for="media in filteredMedia" 
            :key="media.id" 
            class="media-item"
            @click="openMedia(media)"
          >
            <div class="media-thumbnail">
              <img 
                v-if="media.type === 'Photo'" 
                :src="media.url" 
                :alt="media.title"
              />
              <div 
                v-else-if="media.type === 'Video'" 
                class="video-thumbnail"
                :style="{ backgroundImage: `url(${media.thumbnailUrl || media.url})` }"
              >
                <div class="play-icon">▶</div>
              </div>
            </div>
            <div class="media-info">
              <h3 class="media-title">{{ media.title }}</h3>
              <div class="media-date">{{ formatDate(media.date) }}</div>
            </div>
          </div>
        </div>

        <!-- Slideshow View Mode -->
        <div v-else class="media-slideshow">
          <div v-if="filteredMedia.length === 0" class="empty-state">
            No media content available.
          </div>
          <div v-else class="slideshow-container">
            <div class="slideshow-content">
              <div v-if="currentMedia.type === 'Photo'" class="photo-slide">
                <img :src="currentMedia.url" :alt="currentMedia.title" />
              </div>
              <div v-else-if="currentMedia.type === 'Video'" class="video-slide">
                <video 
                  controls 
                  autoplay 
                  :src="currentMedia.url"
                ></video>
              </div>
            </div>
            
            <div class="slideshow-controls">
              <button class="slideshow-button prev" @click="prevMedia">
                &#10094;
              </button>
              <div class="slide-info">
                <h3>{{ currentMedia.title }}</h3>
                <p>{{ currentMedia.description }}</p>
                <div class="slide-meta">
                  <span>{{ formatDate(currentMedia.date) }}</span>
                  <span>{{ currentSlideIndex + 1 }} / {{ filteredMedia.length }}</span>
                </div>
              </div>
              <button class="slideshow-button next" @click="nextMedia">
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox for full screen media viewing -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <div class="lightbox-content" @click.stop>
        <button class="lightbox-close" @click="closeLightbox">×</button>
        
        <div v-if="lightboxMedia.type === 'Photo'" class="lightbox-photo">
          <img :src="lightboxMedia.url" :alt="lightboxMedia.title" />
        </div>
        <div v-else-if="lightboxMedia.type === 'Video'" class="lightbox-video">
          <video 
            controls 
            autoplay 
            :src="lightboxMedia.url"
          ></video>
        </div>
        
        <div class="lightbox-info">
          <h3>{{ lightboxMedia.title }}</h3>
          <p>{{ lightboxMedia.description }}</p>
          <div class="lightbox-date">{{ formatDate(lightboxMedia.date) }}</div>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import BaseLayout from '../../components/layout/BaseLayout.vue';
import { useMediaStore } from '../../store/modules/mediaStore';

const mediaStore = useMediaStore();

// View state
const viewMode = ref('grid'); // 'grid' or 'slideshow'
const activeFilter = ref('All');
const currentSlideIndex = ref(0);
const lightboxOpen = ref(false);
const lightboxMedia = ref({});

// Constants
const mediaTypes = ['All', 'Photo', 'Video'];

// Computed properties
const filteredMedia = computed(() => {
  if (activeFilter.value === 'All') {
    return mediaStore.mediaItems || [];
  } else {
    return (mediaStore.mediaItems || []).filter(item => item.type === activeFilter.value);
  }
});

const currentMedia = computed(() => {
  if (filteredMedia.value.length === 0) {
    return { title: '', description: '', url: '', type: 'Photo', date: new Date() };
  }
  return filteredMedia.value[currentSlideIndex.value];
});

// Methods
const setFilter = (type) => {
  activeFilter.value = type;
  currentSlideIndex.value = 0;
};

const nextMedia = () => {
  if (filteredMedia.value.length === 0) return;
  currentSlideIndex.value = (currentSlideIndex.value + 1) % filteredMedia.value.length;
};

const prevMedia = () => {
  if (filteredMedia.value.length === 0) return;
  currentSlideIndex.value = currentSlideIndex.value === 0 
    ? filteredMedia.value.length - 1
    : currentSlideIndex.value - 1;
};

const openMedia = (media) => {
  lightboxMedia.value = media;
  lightboxOpen.value = true;
};

const closeLightbox = () => {
  lightboxOpen.value = false;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Start slideshow timer when in slideshow mode
let slideshowTimer = null;
const startSlideshowTimer = () => {
  clearInterval(slideshowTimer);
  slideshowTimer = setInterval(() => {
    nextMedia();
  }, 7000); // Change slides every 7 seconds
};

// Watch for changes to viewMode to start/stop slideshow timer
watch(viewMode, (newMode) => {
  if (newMode === 'slideshow') {
    startSlideshowTimer();
  } else {
    clearInterval(slideshowTimer);
  }
});

// Load data on mount
onMounted(async () => {
  await mediaStore.fetchMediaItems();
});

// Clean up timer when component is unmounted
onMounted(() => {
  return () => {
    clearInterval(slideshowTimer);
  };
});
</script>

<style lang="scss" scoped>
.media-display {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
  padding: var(--spacing-medium);
  height: 100%;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: var(--spacing-medium);
  min-height: 200px;
  font-size: var(--font-size-medium);
}

.error-state {
  color: var(--accent-color);
}

.media-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);
  flex: 1;
}

// Controls section
.media-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: var(--spacing-small);
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-button, .view-button {
  background: rgba(0, 0, 0, 0.2);
  color: var(--text-color);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &.active {
    background: var(--primary-color);
    color: var(--text-color);
  }
}

.view-toggle {
  display: flex;
  gap: 8px;
}

// Grid view
.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-medium);
  flex: 1;
}

.media-item {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  }
  
  .media-thumbnail {
    height: 180px;
    width: 100%;
    overflow: hidden;
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .video-thumbnail {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .play-icon {
      font-size: 40px;
      color: white;
      background-color: rgba(0, 0, 0, 0.5);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  
  .media-info {
    padding: var(--spacing-small);
    
    .media-title {
      margin: 0;
      font-size: 1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .media-date {
      font-size: 0.8rem;
      color: #999;
      margin-top: 5px;
    }
  }
}

// Slideshow view
.media-slideshow {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  overflow: hidden;
}

.slideshow-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.slideshow-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  
  .photo-slide {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  }
  
  .video-slide {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
    video {
      max-width: 100%;
      max-height: 100%;
    }
  }
}

.slideshow-controls {
  display: flex;
  align-items: center;
  padding: var(--spacing-medium);
  background-color: rgba(0, 0, 0, 0.2);
  
  .slideshow-button {
    background: rgba(0, 0, 0, 0.3);
    color: var(--text-color);
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    cursor: pointer;
    transition: background 0.2s ease;
    
    &:hover {
      background: var(--primary-color);
    }
  }
  
  .slide-info {
    flex: 1;
    padding: 0 var(--spacing-medium);
    
    h3 {
      margin: 0 0 5px 0;
    }
    
    p {
      margin: 0 0 8px 0;
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .slide-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: #999;
    }
  }
}

// Lightbox
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lightbox-content {
  width: 90%;
  height: 90%;
  display: flex;
  flex-direction: column;
  position: relative;
  
  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 30px;
    cursor: pointer;
  }
  
  .lightbox-photo, .lightbox-video {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    
    img, video {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    }
  }
  
  .lightbox-info {
    padding: var(--spacing-medium);
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 8px 8px;
    
    h3 {
      margin: 0 0 5px 0;
    }
    
    p {
      margin: 0 0 8px 0;
      color: #ccc;
    }
    
    .lightbox-date {
      font-size: 0.8rem;
      color: #999;
    }
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  
  .media-controls {
    flex-direction: column;
    gap: var(--spacing-small);
  }
  
  .slideshow-controls {
    padding: var(--spacing-small);
    
    .slide-info {
      p {
        display: none;
      }
    }
  }
}
</style>