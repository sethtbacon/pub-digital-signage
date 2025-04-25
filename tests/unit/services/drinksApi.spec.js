import { describe, it, expect, vi, beforeEach } from 'vitest';
import drinksApi from '../../../src/frontend/services/api/drinksApi';
import baseApi from '../../../src/frontend/services/api/baseApi';

// Mock axios/baseApi
vi.mock('../../../src/frontend/services/api/baseApi', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('drinksApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('fetches all drinks', async () => {
    // Mock response data
    const mockDrinks = [
      { id: 1, name: 'Beer', price: 4.5, category: 'Beer' },
      { id: 2, name: 'Wine', price: 6.0, category: 'Wine' }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockDrinks });
    
    // Call the API method
    const result = await drinksApi.getAllDrinks();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/drinks');
    // Verify the result is what we expect
    expect(result).toEqual(mockDrinks);
  });
  
  it('fetches a drink by ID', async () => {
    // Mock response data
    const mockDrink = { id: 1, name: 'Beer', price: 4.5, category: 'Beer' };
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockDrink });
    
    // Call the API method
    const result = await drinksApi.getDrink(1);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/drinks/1');
    // Verify the result is what we expect
    expect(result).toEqual(mockDrink);
  });
  
  it('creates a new drink', async () => {
    // Mock drink data to create
    const newDrink = { name: 'New Beer', price: 5.0, category: 'Beer' };
    
    // Mock response with created drink including ID
    const createdDrink = { ...newDrink, id: 3 };
    
    // Mock response
    baseApi.post.mockResolvedValue({ data: createdDrink });
    
    // Call the API method
    const result = await drinksApi.createDrink(newDrink);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.post).toHaveBeenCalledWith('/api/drinks', newDrink);
    // Verify the result is what we expect
    expect(result).toEqual(createdDrink);
  });
  
  it('updates an existing drink', async () => {
    // Mock drink data to update
    const drinkId = 1;
    const updateData = { name: 'Updated Beer', price: 5.5 };
    
    // Mock response with updated drink
    const updatedDrink = { id: drinkId, name: 'Updated Beer', price: 5.5, category: 'Beer' };
    
    // Mock response
    baseApi.put.mockResolvedValue({ data: updatedDrink });
    
    // Call the API method
    const result = await drinksApi.updateDrink(drinkId, updateData);
    
    // Verify the API was called with the correct endpoint and data
    expect(baseApi.put).toHaveBeenCalledWith(`/api/drinks/${drinkId}`, updateData);
    // Verify the result is what we expect
    expect(result).toEqual(updatedDrink);
  });
  
  it('deletes a drink', async () => {
    // Mock drink ID to delete
    const drinkId = 1;
    
    // Mock response
    baseApi.delete.mockResolvedValue({ data: { success: true } });
    
    // Call the API method
    const result = await drinksApi.deleteDrink(drinkId);
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.delete).toHaveBeenCalledWith(`/api/drinks/${drinkId}`);
    // Verify the result is what we expect
    expect(result).toEqual({ success: true });
  });
  
  it('fetches featured drinks', async () => {
    // Mock featured drinks
    const mockFeaturedDrinks = [
      { id: 1, name: 'Featured Beer', price: 4.5, category: 'Beer', isFeatured: true }
    ];
    
    // Mock response
    baseApi.get.mockResolvedValue({ data: mockFeaturedDrinks });
    
    // Call the API method
    const result = await drinksApi.getFeaturedDrinks();
    
    // Verify the API was called with the correct endpoint
    expect(baseApi.get).toHaveBeenCalledWith('/api/drinks/featured');
    // Verify the result is what we expect
    expect(result).toEqual(mockFeaturedDrinks);
  });
});