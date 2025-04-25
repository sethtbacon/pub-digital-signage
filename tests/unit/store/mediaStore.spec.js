import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useMediaStore } from '../../../src/frontend/store/modules/mediaStore';

describe('MediaStore', () => {
  let mediaStore;

  beforeEach(() => {
    // Create a fresh pinia instance and activate it for each test
    setActivePinia(createPinia());
    
    // Get the media store
    mediaStore = useMediaStore();
    
    // Mock the API methods that the store uses
    mediaStore.mediaApi = {
      getAllMedia: vi.fn(),
      getMedia: vi.fn(),
      getFeaturedMedia: vi.fn(),
      getSlideshowMedia: vi.fn(),
      uploadMedia: vi.fn(),
      updateMedia: vi.fn(),
      deleteMedia: vi.fn()
    };
  });

  it('has initial state with empty arrays and null values', () => {
    expect(mediaStore.allMedia).toEqual([]);
    expect(mediaStore.photos).toEqual([]);
    expect(mediaStore.videos).toEqual([]);
    expect(mediaStore.featuredMedia).toEqual([]);
    expect(mediaStore.slideshowMedia).toEqual([]);
    expect(mediaStore.currentMedia).toBeNull();
    expect(mediaStore.loading).toBe(false);
    expect(mediaStore.error).toBeNull();
  });

  it('provides media by ID via getter', () => {
    // Prepare test data
    mediaStore.allMedia = [
      { id: 1, title: 'Test Photo', type: 'photo' },
      { id: 2, title: 'Test Video', type: 'video' }
    ];
    
    // Test getter function
    expect(mediaStore.getMediaById(1)).toEqual({ id: 1, title: 'Test Photo', type: 'photo' });
    expect(mediaStore.getMediaById(3)).toBeUndefined(); // Non-existent ID
  });

  it('filters media by type via getter', () => {
    // Prepare test data
    mediaStore.allMedia = [
      { id: 1, title: 'Test Photo 1', type: 'photo' },
      { id: 2, title: 'Test Video', type: 'video' },
      { id: 3, title: 'Test Photo 2', type: 'photo' }
    ];
    
    // Test getter function
    const photoResults = mediaStore.mediaByType('photo');
    expect(photoResults.length).toBe(2);
    expect(photoResults[0].id).toBe(1);
    expect(photoResults[1].id).toBe(3);
    
    const videoResults = mediaStore.mediaByType('video');
    expect(videoResults.length).toBe(1);
    expect(videoResults[0].id).toBe(2);
  });

  it('checks for slideshow content via getter', () => {
    // No content initially
    expect(mediaStore.hasSlideshowContent).toBe(false);
    
    // Add content
    mediaStore.slideshowMedia = [
      { id: 1, title: 'Slideshow Image' }
    ];
    
    // Check again
    expect(mediaStore.hasSlideshowContent).toBe(true);
  });

  it('fetches all media and sorts by type', async () => {
    // Mock API response
    const mockMedia = [
      { id: 1, title: 'Photo 1', type: 'photo' },
      { id: 2, title: 'Video 1', type: 'video' },
      { id: 3, title: 'Photo 2', type: 'photo' }
    ];
    
    mediaStore.mediaApi.getAllMedia.mockResolvedValue(mockMedia);
    
    // Call action
    await mediaStore.fetchAllMedia();
    
    // Verify API was called
    expect(mediaStore.mediaApi.getAllMedia).toHaveBeenCalled();
    
    // Verify state was updated
    expect(mediaStore.allMedia).toEqual(mockMedia);
    expect(mediaStore.photos.length).toBe(2);
    expect(mediaStore.videos.length).toBe(1);
    expect(mediaStore.loading).toBe(false);
    expect(mediaStore.error).toBeNull();
  });

  it('handles error when fetching all media', async () => {
    // Mock API error
    const errorMessage = 'Network error';
    mediaStore.mediaApi.getAllMedia.mockRejectedValue(new Error(errorMessage));
    
    // Call action
    await mediaStore.fetchAllMedia();
    
    // Verify error state
    expect(mediaStore.error).toBe(errorMessage);
    expect(mediaStore.loading).toBe(false);
  });

  it('fetches media by type', async () => {
    // Mock API response for photos
    const mockPhotos = [
      { id: 1, title: 'Photo 1', type: 'photo' },
      { id: 3, title: 'Photo 2', type: 'photo' }
    ];
    
    mediaStore.mediaApi.getAllMedia.mockResolvedValue(mockPhotos);
    
    // Call action to fetch photos
    const result = await mediaStore.fetchMediaByType('photo');
    
    // Verify API was called with correct type
    expect(mediaStore.mediaApi.getAllMedia).toHaveBeenCalledWith('photo');
    
    // Verify state was updated
    expect(mediaStore.photos).toEqual(mockPhotos);
    expect(result).toEqual(mockPhotos);
  });

  it('fetches media by ID', async () => {
    // Mock API response
    const mockMedia = { id: 1, title: 'Test Photo', type: 'photo' };
    mediaStore.mediaApi.getMedia.mockResolvedValue(mockMedia);
    
    // Call action
    await mediaStore.fetchMediaById(1);
    
    // Verify API was called with correct ID
    expect(mediaStore.mediaApi.getMedia).toHaveBeenCalledWith(1);
    
    // Verify state was updated
    expect(mediaStore.currentMedia).toEqual(mockMedia);
  });

  it('fetches featured media', async () => {
    // Mock API response
    const mockFeaturedMedia = [
      { id: 1, title: 'Featured Photo', type: 'photo', isFeatured: true }
    ];
    
    mediaStore.mediaApi.getFeaturedMedia.mockResolvedValue(mockFeaturedMedia);
    
    // Call action
    await mediaStore.fetchFeaturedMedia();
    
    // Verify API was called
    expect(mediaStore.mediaApi.getFeaturedMedia).toHaveBeenCalled();
    
    // Verify state was updated
    expect(mediaStore.featuredMedia).toEqual(mockFeaturedMedia);
  });

  it('fetches slideshow media', async () => {
    // Mock API response
    const mockSlideshowMedia = [
      { id: 1, title: 'Slideshow Photo', type: 'photo', inSlideshow: true }
    ];
    
    mediaStore.mediaApi.getSlideshowMedia.mockResolvedValue(mockSlideshowMedia);
    
    // Call action
    await mediaStore.fetchSlideshowMedia();
    
    // Verify API was called
    expect(mediaStore.mediaApi.getSlideshowMedia).toHaveBeenCalled();
    
    // Verify state was updated
    expect(mediaStore.slideshowMedia).toEqual(mockSlideshowMedia);
  });

  it('uploads media and adds to store', async () => {
    // Mock form data
    const formData = new FormData();
    formData.append('file', new Blob(['test file content'], {type: 'image/jpeg'}));
    
    // Mock API response
    const uploadedMedia = { id: 5, title: 'Uploaded Photo', type: 'photo', url: '/media/photo.jpg' };
    mediaStore.mediaApi.uploadMedia.mockResolvedValue(uploadedMedia);
    
    // Call action
    const result = await mediaStore.uploadMedia(formData);
    
    // Verify API was called with form data
    expect(mediaStore.mediaApi.uploadMedia).toHaveBeenCalledWith(formData);
    
    // Verify state was updated
    expect(mediaStore.allMedia).toContain(uploadedMedia);
    expect(mediaStore.photos).toContain(uploadedMedia);
    expect(result).toEqual(uploadedMedia);
  });

  it('updates media and updates store', async () => {
    // Setup initial state
    mediaStore.allMedia = [
      { id: 1, title: 'Old Title', type: 'photo' },
      { id: 2, title: 'Test Video', type: 'video' }
    ];
    mediaStore.photos = [{ id: 1, title: 'Old Title', type: 'photo' }];
    mediaStore.currentMedia = { id: 1, title: 'Old Title', type: 'photo' };
    
    // Update data
    const mediaId = 1;
    const updateData = { title: 'Updated Title' };
    
    // Mock API response
    const updatedMedia = { id: 1, title: 'Updated Title', type: 'photo' };
    mediaStore.mediaApi.updateMedia.mockResolvedValue(updatedMedia);
    
    // Call action
    const result = await mediaStore.updateMedia(mediaId, updateData);
    
    // Verify API was called with correct data
    expect(mediaStore.mediaApi.updateMedia).toHaveBeenCalledWith(mediaId, updateData);
    
    // Verify state was updated in all arrays
    expect(mediaStore.allMedia[0]).toEqual(updatedMedia);
    expect(mediaStore.photos[0]).toEqual(updatedMedia);
    expect(mediaStore.currentMedia).toEqual(updatedMedia);
    expect(result).toEqual(updatedMedia);
  });

  it('deletes media and removes from store', async () => {
    // Setup initial state
    mediaStore.allMedia = [
      { id: 1, title: 'Photo to Delete', type: 'photo' },
      { id: 2, title: 'Test Video', type: 'video' }
    ];
    mediaStore.photos = [{ id: 1, title: 'Photo to Delete', type: 'photo' }];
    mediaStore.videos = [{ id: 2, title: 'Test Video', type: 'video' }];
    mediaStore.featuredMedia = [{ id: 1, title: 'Photo to Delete', type: 'photo' }];
    mediaStore.slideshowMedia = [{ id: 1, title: 'Photo to Delete', type: 'photo' }];
    mediaStore.currentMedia = { id: 1, title: 'Photo to Delete', type: 'photo' };
    
    // Media ID to delete
    const mediaId = 1;
    
    // Mock API response
    mediaStore.mediaApi.deleteMedia.mockResolvedValue({ success: true });
    
    // Call action
    await mediaStore.deleteMedia(mediaId);
    
    // Verify API was called with correct ID
    expect(mediaStore.mediaApi.deleteMedia).toHaveBeenCalledWith(mediaId);
    
    // Verify item was removed from all arrays
    expect(mediaStore.allMedia.length).toBe(1);
    expect(mediaStore.photos.length).toBe(0);
    expect(mediaStore.featuredMedia.length).toBe(0);
    expect(mediaStore.slideshowMedia.length).toBe(0);
    expect(mediaStore.currentMedia).toBeNull();
  });
});