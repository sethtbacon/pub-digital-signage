import baseApi from './baseApi';

export const drinksApi = {
  // Get all drinks
  getAllDrinks: async () => {
    const response = await baseApi.get('/api/drinks');
    return response.data;
  },
  
  // Get drink by ID
  getDrink: async (id) => {
    const response = await baseApi.get(`/api/drinks/${id}`);
    return response.data;
  },
  
  // Create a new drink
  createDrink: async (drinkData) => {
    const response = await baseApi.post('/api/drinks', drinkData);
    return response.data;
  },
  
  // Update an existing drink
  updateDrink: async (id, drinkData) => {
    const response = await baseApi.put(`/api/drinks/${id}`, drinkData);
    return response.data;
  },
  
  // Delete a drink
  deleteDrink: async (id) => {
    const response = await baseApi.delete(`/api/drinks/${id}`);
    return response.data;
  },
  
  // Get featured drinks
  getFeaturedDrinks: async () => {
    const response = await baseApi.get('/api/drinks/featured');
    return response.data;
  },
};

export default drinksApi;