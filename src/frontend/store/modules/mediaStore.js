import { defineStore } from 'pinia';
import { mediaApi } from '../../services/api/mediaApi';

export const useMediaStore = defineStore('media', {
  state: () => ({
    allMedia: [],
    photos: [],
    videos: [],
    featuredMedia: [],
    slideshowMedia: [],
    currentMedia: null,
    loading: false,
    error: null,
  }),

  getters: {
    getMediaById: state => id => {
      return state.allMedia.find(item => item.id === id);
    },

    mediaByType: state => type => {
      return state.allMedia.filter(item => item.type === type);
    },

    hasSlideshowContent: state => {
      return state.slideshowMedia.length > 0;
    },
  },

  actions: {
    async fetchAllMedia() {
      this.loading = true;
      this.error = null;
      try {
        const media = await mediaApi.getAllMedia();
        this.allMedia = media;

        // Sort media by type
        this.photos = media.filter(item => item.type === 'photo');
        this.videos = media.filter(item => item.type === 'video');
      } catch (error) {
        this.error = error.message || 'Failed to fetch media';
        console.error('Error fetching media:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMediaByType(type) {
      this.loading = true;
      this.error = null;
      try {
        const media = await mediaApi.getAllMedia(type);
        if (type === 'photo') {
          this.photos = media;
        } else if (type === 'video') {
          this.videos = media;
        }
        return media;
      } catch (error) {
        this.error = error.message || `Failed to fetch media of type: ${type}`;
        console.error(`Error fetching ${type} media:`, error);
      } finally {
        this.loading = false;
      }
    },

    async fetchMediaById(id) {
      this.loading = true;
      this.error = null;
      try {
        const media = await mediaApi.getMedia(id);
        this.currentMedia = media;
      } catch (error) {
        this.error = error.message || `Failed to fetch media with ID: ${id}`;
        console.error(`Error fetching media ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFeaturedMedia() {
      this.loading = true;
      this.error = null;
      try {
        const featured = await mediaApi.getFeaturedMedia();
        this.featuredMedia = featured;
      } catch (error) {
        this.error = error.message || 'Failed to fetch featured media';
        console.error('Error fetching featured media:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSlideshowMedia() {
      this.loading = true;
      this.error = null;
      try {
        const slideshow = await mediaApi.getSlideshowMedia();
        this.slideshowMedia = slideshow;
      } catch (error) {
        this.error = error.message || 'Failed to fetch slideshow media';
        console.error('Error fetching slideshow media:', error);
      } finally {
        this.loading = false;
      }
    },

    async uploadMedia(formData) {
      this.loading = true;
      this.error = null;
      try {
        const result = await mediaApi.uploadMedia(formData);

        // If it's a single file upload, add it to the store
        if (result.id) {
          this.allMedia.push(result);
          if (result.type === 'photo') {
            this.photos.push(result);
          } else if (result.type === 'video') {
            this.videos.push(result);
          }
        }

        return result;
      } catch (error) {
        this.error = error.message || 'Failed to upload media';
        console.error('Error uploading media:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateMedia(id, mediaData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedMedia = await mediaApi.updateMedia(id, mediaData);

        // Update in the main array
        const index = this.allMedia.findIndex(item => item.id === id);
        if (index !== -1) {
          this.allMedia[index] = updatedMedia;
        }

        // Update in type-specific arrays
        if (updatedMedia.type === 'photo') {
          const photoIndex = this.photos.findIndex(item => item.id === id);
          if (photoIndex !== -1) {
            this.photos[photoIndex] = updatedMedia;
          } else {
            this.photos.push(updatedMedia);
          }
        } else if (updatedMedia.type === 'video') {
          const videoIndex = this.videos.findIndex(item => item.id === id);
          if (videoIndex !== -1) {
            this.videos[videoIndex] = updatedMedia;
          } else {
            this.videos.push(updatedMedia);
          }
        }

        // Update current media if we're viewing it
        if (this.currentMedia && this.currentMedia.id === id) {
          this.currentMedia = updatedMedia;
        }

        return updatedMedia;
      } catch (error) {
        this.error = error.message || `Failed to update media with ID: ${id}`;
        console.error(`Error updating media ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteMedia(id) {
      this.loading = true;
      this.error = null;
      try {
        await mediaApi.deleteMedia(id);

        // Remove from all arrays
        this.allMedia = this.allMedia.filter(item => item.id !== id);
        this.photos = this.photos.filter(item => item.id !== id);
        this.videos = this.videos.filter(item => item.id !== id);
        this.featuredMedia = this.featuredMedia.filter(item => item.id !== id);
        this.slideshowMedia = this.slideshowMedia.filter(item => item.id !== id);

        if (this.currentMedia && this.currentMedia.id === id) {
          this.currentMedia = null;
        }
      } catch (error) {
        this.error = error.message || `Failed to delete media with ID: ${id}`;
        console.error(`Error deleting media ${id}:`, error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
