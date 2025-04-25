import baseApi from './baseApi';

export const mediaApi = {
  // Get all media items
  getAllMedia: async (type = null) => {
    const url = type ? `/api/media?type=${type}` : '/api/media';
    const response = await baseApi.get(url);
    return response.data;
  },
  
  // Get media by ID
  getMedia: async (id) => {
    const response = await baseApi.get(`/api/media/${id}`);
    return response.data;
  },
  
  // Create a new media item with file upload
  uploadMedia: async (formData) => {
    const response = await baseApi.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  // Update media metadata
  updateMedia: async (id, mediaData) => {
    const response = await baseApi.put(`/api/media/${id}`, mediaData);
    return response.data;
  },
  
  // Delete a media item
  deleteMedia: async (id) => {
    const response = await baseApi.delete(`/api/media/${id}`);
    return response.data;
  },
  
  // Get featured media
  getFeaturedMedia: async () => {
    const response = await baseApi.get('/api/media/featured');
    return response.data;
  },
  
  // Get media for slideshow
  getSlideshowMedia: async () => {
    const response = await baseApi.get('/api/media/slideshow');
    return response.data;
  },
};

export default mediaApi;